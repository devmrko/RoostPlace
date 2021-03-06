var obj_NgApp = angular.module('app_memo', ['ngRoute', 'ui.bootstrap']);

obj_NgApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {
          templateUrl: 'list.html',
          controller: 'ctr_memo'
        }).
        when('/detail/:idx', {
          templateUrl: 'detail.html',
          controller: 'ctr_memoDtl'
        }).
        otherwise({
          //redirectTo: '/list'
        });
}]);

obj_NgApp.factory("sharedDObj", function () {
    return {};
});

obj_NgApp.controller('ctr_memo', function ($scope, $http, sharedDObj, $document, $window, $location) {

    $scope.sharedDObj = sharedDObj;

    var baseUrl = '/memo';

    $scope.total_cnt = 0;
    $scope.maxPaginationPerPage = 5;
    $scope.curPage = 1;
    $scope.perPage = 5;
    $scope.completeBool = true;

    $scope.selectedBadge = '';

    $document.ready(function () {

        $scope.searchTag = $scope.sharedDObj.searchCriteria != undefined ? $scope.sharedDObj.searchCriteria.searchTags : undefined;

        /*
        $( "#inp_date" ).datepicker({
          defaultDate: "",
          changeMonth: true,
          changeYear: true,
          numberOfMonths: 1,
          dateFormat    : "yy-mm-dd"
        });
        */
        
        // Loading 시 Search 로딩
        $scope.searchClick($scope.searchTag);

    });
    
    $scope.searchClick = function (searchTag) {
        
        //console.log("memo.js searchClick....: " + searchTag);
        
        $scope.selectedBadge = searchTag;

        // $scope.cancleClick();
        if(searchTag == undefined) {
            $scope.searchTag = 'All';
            // $scope.sharedDObj.searchCriteria.searchTags = 'All';
        } else {
            $scope.searchTag = searchTag;

        }
        
        //console.log("memo.js searchCriteria....: " + $scope.sharedDObj.searchCriteria);
        
        if($scope.sharedDObj.searchCriteria != undefined) {
            $scope.sharedDObj.searchCriteria.searchTags = searchTag;
        }

        $scope.curPage = 1;
        searchHanlder();
    }

    $scope.pageChanged = function() {
        searchHanlder();
    }

    $scope.completeClick = function (sel_id) {
        var ctrUrl = baseUrl + '/complete';

        var dataObj = returnSearchCriteria();
        addDataObj(jQuery, dataObj, "sel_id", sel_id);

        $http.post(ctrUrl, dataObj).success(function (returnData) {
            $scope.cancleClick();
            // searchResultHandler(returnData);
        }).error(function (data, status, headers, config) {
            alert('error: ' + status);
        });

    }

    $scope.cancelCompletionClick = function (sel_id) {
        var ctrUrl = baseUrl + '/cancelComplete';

        var dataObj = returnSearchCriteria();
        addDataObj(jQuery, dataObj, "sel_id", sel_id);

        $http.post(ctrUrl, dataObj).success(function (returnData) {
            $scope.cancleClick();
            // searchResultHandler(returnData);
        }).error(function (data, status, headers, config) {
            alert('error: ' + status);
        });

    }
    
    $scope.prevClick = function() {
        // $scope.cancleClick();
        $scope.curPage = $scope.curPage - 1;
        searchHanlder();
    }

    $scope.nextClick = function () {
        // $scope.cancleClick();
        if ($scope.test_cols.length == 0) {
            alert('There is no more page.')
        } else {
            $scope.curPage = $scope.curPage + 1;
            searchHanlder();
        }
    }

    $scope.newPostClick = function () {
        $scope.sharedDObj.searchCriteria = returnSearchCriteria();
        $location.path('/detail/' + 'N');
    }

    $scope.rowClick = function (idx) {
        // if ($scope.selInx == idx) {
        //     $location.url('/list');
        //     $('#summernote').summernote('destroy');
        // } else {
            $scope.sharedDObj.searchCriteria = returnSearchCriteria();
            $location.path('/detail/' + $scope.test_cols[idx]._id);
        // }
    }

    $scope.cancleClick = function () {
        //$('#summernote').summernote('destroy');
        
        $location.url('/');

    }
    
    function formattedDate(date) {

        //ISO Date로 전환(달, 일자를 2자리 수로 고정하기 위해)
        var isoDate = date.toISOString();

        //정규 표현식으로 변환(MM/DD/YYYY)
        //result = isoDate.replace(/^(\d{4})\-(\d{2})\-(\d{2}).*$/, '$2/$3/$1');
        result = isoDate.replace(/^(\d{4})\-(\d{2})\-(\d{2}).*$/, '$1-$2-$3');
        return result;
    }

    function subtractDate(date, sub) {
        //sub 값이 있을 경우(빼기)
        if (sub != undefined) {
            date.setDate(date.getDate() - sub);
        }
        return date;
    }

    function returnSearchCriteria() {
        var dataObj = {};
        addDataObj(jQuery, dataObj, "searchText", $scope.searchText);
        if($scope.searchTag != 'All') {
            addDataObj(jQuery, dataObj, "searchTags", $scope.searchTag);
        }
        addDataObj(jQuery, dataObj, "completeYn", $scope.completeBool == true ? 'n' : 'y');
        addDataObj(jQuery, dataObj, "pageNo", $scope.curPage);
        return dataObj;
    }

    function searchResultHandler(returnData) {
        $scope.test_cols = returnData.test_cols;
        $scope.keywords = returnData.keywords;
        $scope.total_cnt = returnData.total_cnt;
    }

    function searchHanlder() {
        var ctrUrl = baseUrl + '/search';

        $http.post(ctrUrl, returnSearchCriteria()).success(function (returnData) {
            searchResultHandler(returnData);

        }).error(function (data, status, headers, config) {
            alert('error: ' + status);
        });
    }

    function addDataObj(jQuery, dataObj, keyNm, keyVal) {
        eval("jQuery.extend(dataObj, {" + keyNm + " : keyVal})");
    }

});

obj_NgApp.controller('ctr_memoDtl', ['$scope', '$routeParams', '$http', '$document', '$location', function ($scope, $routeParams, $http, $document, $location, sharedDObj) {

    $scope.sharedDObj = sharedDObj;

    var baseUrl = '/memo';

    /*
    $( "#inp_date" ).datepicker({
      defaultDate: "",
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      dateFormat    : "yy-mm-dd"
    });
    */

    if($routeParams.idx == 'N') {
        $scope.sel_contents = '';
        $scope.sel_title = '';
        $scope.sel_tags = '';
        $scope.sel_id = '';
        $scope.sel_due_date = formattedDate(subtractDate(new Date(), 0));
        $scope.sel_hits = '';

        /*
        $('#summernote').summernote({
          height: 100,                 // set editor height
          minHeight: null,             // set minimum height of editor
          maxHeight: null,             // set maximum height of editor
          focus: true
        });
        */
        
    } else {
        var ctrUrl = baseUrl + '/searchDetail';
        var dataObj = {};
        
        $scope.sel_id = $routeParams.idx;
        addDataObj(jQuery, dataObj, "sel_id", $scope.sel_id);
        
        $http.post(ctrUrl, dataObj).success(function (returnData) {
            $scope.sel_contents = returnData.detailObj[0].contents;
            //var contents = returnData.detailObj[0].contents;
            //var contents2 = "";
            
            //if (contents != undefined) {
            //    contents2 = contents.replace(/\n/g, '<br />');
            //}
            //$scope.sel_contents = contents2;
            
            //$('#summernote').summernote('code', $scope.sel_contents);
            $scope.sel_title = returnData.detailObj[0].title;
            $scope.sel_tags = returnData.detailObj[0].tags;
            $scope.sel_id = returnData.detailObj[0]._id;
            $scope.sel_notice_bool = returnData.detailObj[0].notice_bool;
            $scope.sel_due_date = returnData.detailObj[0].due_date;
            $scope.sel_hits = returnData.detailObj[0].hits;

            if(returnData.detailObj[0].complete == 'y') {
                $scope.completeButtonBool = false;
            } else {
                $scope.completeButtonBool = true;
            }
            
            /*
            $('#summernote').summernote({
              height: 100,                 // set editor height
              minHeight: null,             // set minimum height of editor
              maxHeight: null,             // set maximum height of editor
              focus: true
            });
            */
            
        }).error(function (data, status, headers, config) {
            //console.log('******** searchDetail error ************'); //debug
            res.send(err)
            
            //alert('error: ' + status);
        });
    }

    function addDataObj(jQuery, dataObj, keyNm, keyVal) {
        eval("jQuery.extend(dataObj, {" + keyNm + " : keyVal})");
    }

    function formattedDate(date) {
        //ISO Date로 전환(달, 일자를 2자리 수로 고정하기 위해)
        var isoDate = date.toISOString();
        
        //정규 표현식으로 변환(MM/DD/YYYY)
        //result = isoDate.replace(/^(\d{4})\-(\d{2})\-(\d{2}).*$/, '$2/$3/$1');
        result = isoDate.replace(/^(\d{4})\-(\d{2})\-(\d{2}).*$/, '$1-$2-$3');
        return result;
    }

    function subtractDate(date, sub) {
        //sub 값이 있을 경우(빼기)
        if (sub != undefined) {
            date.setDate(date.getDate() - sub);
        }
        return date;
    }

    $scope.savePost = function () {
        var ctrUrl = baseUrl + '/savePost';
        var dataObj = returnSearchCriteria();

        //$scope.sel_contents = $('#summernote').summernote('code');
        
        addDataObj(jQuery, dataObj, "sel_title", $scope.sel_title);
        addDataObj(jQuery, dataObj, "sel_contents", $scope.sel_contents);
        addDataObj(jQuery, dataObj, "sel_tags", $scope.sel_tags);
        addDataObj(jQuery, dataObj, "sel_id", $scope.sel_id);
        addDataObj(jQuery, dataObj, "sel_due_date", $scope.sel_due_date);
        addDataObj(jQuery, dataObj, "sel_notice_bool", $scope.sel_notice_bool);

        $http.post(ctrUrl, dataObj).success(function (returnData) {
            // $('#summernote').summernote('destroy');
            // $location.url('/list');
            
            $scope.cancleClick();

        }).error(function (data, status, headers, config) {
            //console.log('******** savePost error ************'); //debug
            res.send(err)
            
            //alert('error: ' + status);
        });
    }

    function returnSearchCriteria() {
        var dataObj = {};
        return dataObj;
    }
    
}]);
