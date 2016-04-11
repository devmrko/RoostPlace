
// 첫번째 Index 에 Store Map 랜더링 
renderDaumMap(0);

/* Store Section */
$("#ul_store > li").click(function() {
    var str = $(this).index();
    console.log("ul_store Index: "+ str);
    
    renderDaumMap(str);
});