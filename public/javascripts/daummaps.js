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
        level: 2
    };
    //
    var map = new daum.maps.Map(container, options);

    var imageSrc = 'http://localhost:3000/images/map/marker_roost.png', // 마커이미지의 주소입니다    
        imageSize = new daum.maps.Size(64, 69), // 마커이미지의 크기입니다
        imageOprion = {offset: new daum.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOprion),
        markerPosition = new daum.maps.LatLng(wLatArr[mapIdx], lLatArr[mapIdx]); // 마커가 표시될 위치입니다
    
    // 마커를 생성합니다
    var marker = new daum.maps.Marker({
        position: markerPosition,
        image: markerImage // 마커이미지 설정 
    });

    // 마커가 표시될 위치입니다 
    //var markerPosition  = new daum.maps.LatLng(wLatArr[mapIdx], lLatArr[mapIdx]); 

    // 마커를 생성합니다
    //var marker = new daum.maps.Marker({
    //    position: markerPosition
    //});

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);

    // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    var content = '<div class="customoverlay">' +
        '  <a href="http://map.daum.net/link/map/' + itemIdArr[mapIdx] + '" target="_blank">' +
        '    <span class="title">' + storeNmArr[mapIdx] + '</span>' +
        '  </a>' +
        '</div>';
    
    // 커스텀 오버레이가 표시될 위치입니다 
    var position = new daum.maps.LatLng(wLatArr[mapIdx], lLatArr[mapIdx]);  

    // 커스텀 오버레이를 생성합니다
    var customOverlay = new daum.maps.CustomOverlay({
        map: map,
        position: position,
        content: content,
        yAnchor: 1 
    });

/*
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
*/
}
