var express = require('express');
var router = express.Router();
var perPage = 5;
var url = require('url');
var async = require('async');
var ObjectID = require('mongodb').ObjectID;


//-----------------------------------------------------------------------------
router.post('/search', function (req, res, next) {
    console.log('******** list search'); //debug
    
    searchHandler(req, res, next);
});


//-----------------------------------------------------------------------------
router.post('/searchDetail', function (req, res, next) {
    console.log('******** list searchDetail'); //debug
    
    var db = req.db;
    var test_cols = db.get('notice');
    var selId = new ObjectID(req.body.sel_id);
    
    //update hits
    test_cols.update({_id: selId}, {$inc:{hits:1}}, function(err, one_guest_msg) {
        if (err) {
            console.log('******** update hits error ************'); //debug
            res.send(err)
        }
    });
        
    test_cols.find({_id: selId}, function (err, test_cols) {
        if (err) {
            console.log('******** searchDetail error ************'); //debug
            res.send(err)
        }
        
        res.jsonp({
            "detailObj": test_cols
        });
    });
});

//-----------------------------------------------------------------------------
router.post('/complete', function (req, res, next) {
    console.log('******** complete'); //debug
    
    var selId = req.body.sel_id;
    var db = req.db;
    var test_cols = db.get('notice');
    
    test_cols.update({"_id":selId}, {$set:{"complete": 'y'}},
        function (err, doc) {
            if (err) {
                console.log('******** complete error ************'); //debug
                res.send(err)
                
                //throw err;
            } else {
                req.flash('success', 'post completed');
                res.jsonp({
                    "error_code": 0
                });
                
                // res.location('/memo');
                // res.redirect('/memo');
                // searchHandler(req, res, next);
            }
        }
    );
});

//-----------------------------------------------------------------------------
router.post('/cancelComplete', function (req, res, next) {
    console.log('******** cancelComplete'); //debug
    
    var selId = req.body.sel_id;
    var db = req.db;
    var test_cols = db.get('notice');
    
    test_cols.update({"_id": selId}, {$set: {"complete": 'n'}},
        function (err, doc) {
            if (err) {
                console.log('******** cancelComplete error ************'); //debug
                res.send(err)
                
                //throw err;
            } else {
                req.flash('success', 'Cancel post completion');
                res.jsonp({
                    "error_code": 0
                });
                
                // res.location('/memo');
                // res.redirect('/memo');
                // searchHandler(req, res, next);
            }
        }
    );
});

//-----------------------------------------------------------------------------
router.post('/savePost', function (req, res, next) {
    console.log('******** savePost'); //debug
    
    // get form values
    var selContents = req.body.sel_contents;
    var selTitle = req.body.sel_title;
    var selTags = req.body.sel_tags;
    var selId = req.body.sel_id;
    var selDueDate = req.body.sel_due_date;
    var selNoticeBool = req.body.sel_notice_bool;
    var db = req.db;
    var test_cols = db.get('notice');

    if (selId == '') {
        test_cols.insert({
            "contents": selContents,
            "title": selTitle,
            "tags": selTags,
            "reg_date": new Date(),
            "edit_date": new Date(),
            "due_date": selDueDate,
            "notice_bool": selNoticeBool,
            "complete" : "n",
            'reg_id': req.user.name
        }, function (err, test_cols) {
            if (err) {
                console.log('******** savePost: INSERT error ************'); //debug
                res.send(err)
                
                //res.send('There was an issue submitting the post');
            } else {
                // req.flash('success', 'Post Submitted');
                // res.jsonp({
                //                 "error_code": 0
                //             });
                // res.location('/memo');
                // res.redirect('/memo');
                
                searchHandler(req, res, next);
            }
        });
    } else {
        test_cols.update({"_id": selId}, {
            $set: {
                "contents": selContents,
                "title": selTitle,
                "tags": selTags,
                "reg_date": new Date(),
                "edit_date": new Date(),
                "due_date": selDueDate,
                "notice_bool": selNoticeBool
            }
        }, function (err, doc) {
            if (err) {
                console.log('******** savePost: UPDATE error ************'); //debug
                res.send(err)
                
                //throw err;
            } else {
                //req.flash('success', 'Comment Added');
                // res.jsonp({
                //                 "error_code": 0
                //             });
                // // res.location('/posts/show/'+selId);
                // // res.redirect('/posts/show/'+selId);
                // res.location('/memo');
                // res.redirect('/memo');
                searchHandler(req, res, next);
            }
           }
        );
    }
});

function searchHandler(req, res, next) {    
    console.log("S searchHandler");
    
    var searchText = req.body.searchText === undefined ? '' : req.body.searchText;
    var pageNo = req.body.pageNo === undefined ? 1 : req.body.pageNo;
    var searchTags = req.body.searchTags === undefined ? 'All' : req.body.searchTags;
    var completeYn = req.body.completeYn === undefined ? 'y' : req.body.completeYn;
    
    doJsonSearch(req, res, searchText, searchTags, pageNo, completeYn);
    
    console.log("E searchHandler");
}

function doJsonSearch(req, res, searchText, searchTags, pageNo, completeYn) {
    var db = req.db;
    var test_cols = db.get('notice');
    var searchQeury;
    
    if(searchTags != 'All') {
        if(completeYn == 'y') {
            searchQeury = {"contents": { "$regex": searchText }, "tags": searchTags };
        } else {
            searchQeury = {"complete": {"$ne": 'y'}, "contents": { "$regex": searchText }, "tags": searchTags};
        }
    } else {
        if(completeYn == 'y') {
            searchQeury = {"contents": { "$regex": searchText }};
        } else {
            searchQeury = { "complete": {"$ne": 'y'}, "contents": { "$regex": searchText } };
        }
    }
    // var searchFields = {_id: 1, tags: 1, title: 1, edit_date: 1, contents: 0, reg_date: 0, complete: 0, due_date: 0, notice_bool: 0, reg_id: 0};
    var searchFields = {user: 1, title: 1, contents: 1, due_date: 1, hits: 1};

    async.parallel([
        function(callback) {
            test_cols.find(searchQeury, { fields: searchFields, sort: { edit_date: -1 }, skip: (pageNo - 1) * perPage, limit: perPage },
                function (err, test_cols) {
                    callback(null, test_cols);
                });
        },
        function(callback) {
            test_cols.count(searchQeury,
                function (err, cnt) {
                    callback(null, cnt);
                });
        }
    ], function(err, results) {
        if (err) {
            console.log('******** doJsonSearch error ************'); //debug
            res.send(err)
        }

        res.jsonp({
            "test_cols" : results[0],
            'pageNo' : pageNo,
            //'keywords': results[0],
            'searchText' : searchText,
            'total_cnt' : results[1]
        });
    });

}

module.exports = router;