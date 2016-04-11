// 각 지점별 위경도 정보
var storeNmArr = ["루스트 노형점", "베라체점", "제원점", "삼화점", "서귀포점", "시청점", "외도점", "칠성점"];
var wLatArr = [33.4838730, 33.4924271, 33.4855807, 33.514457, 33.2535815, 33.4989411, 33.4856155, 33.5149974];
var lLatArr = [126.469922, 126.5429524, 126.4928116, 126.5754184, 126.5072841, 126.5298713, 126.4306835, 126.5253870];
var itemIdArr = [12779921, 19606244, 24212842, 26354378, 26430711, 26628045, 26627955, 27123962];

/* DAUM MAP */
function renderDaumMap(mapIdx) {
    /* 
    console.log("wLatArr: " + wLatArr[mapIdx]);
    console.log("lLatArr: " + lLatArr[mapIdx]);
    console.log("storeNmArr: " + storeNmArr[mapIdx]);    
    */ 
    
    var container = document.getElementById('daum_map');
    var options = {
        center: new daum.maps.LatLng(wLatArr[mapIdx], lLatArr[mapIdx]),
        level: 3
    };
    //
    var map = new daum.maps.Map(container, options);

    // 마커가 표시될 위치입니다 
    var markerPosition  = new daum.maps.LatLng(wLatArr[mapIdx], lLatArr[mapIdx]); 

    // 마커를 생성합니다
    var marker = new daum.maps.Marker({
        position: markerPosition
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);

    var conTemp = "";
    conTemp += '<div style="padding:5px;">' + storeNmArr[mapIdx];
    conTemp += '  <br>';
    //conTemp += '  <a href="http://map.daum.net/link/map/' + storeNmArr[mapIdx] + ',' + wLatArr[mapIdx] + ',' + lLatArr[mapIdx] + '" style="color:blue" target="_blank">큰지도보기</a>';
    conTemp += '  <a href="http://map.daum.net/link/map/' + itemIdArr[mapIdx] + '" style="color:blue" target="_blank">확대보기</a>';
    conTemp += '  <a href="http://map.daum.net/link/to/'  + storeNmArr[mapIdx] + ',' + wLatArr[mapIdx] + ',' + lLatArr[mapIdx] + '" style="color:blue" target="_blank">길찾기</a>';
    conTemp += '</div>';    
    var iwContent = conTemp, iwPosition = new daum.maps.LatLng(wLatArr[mapIdx], lLatArr[mapIdx]);

    // 인포윈도우를 생성합니다
    var infowindow = new daum.maps.InfoWindow({
        position : iwPosition, 
        content : iwContent 
    });
    
    // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
    infowindow.open(map, marker); 
}
