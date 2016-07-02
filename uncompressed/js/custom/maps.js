// 08. Maps
var mapBox = $('#mapCanvas');
var mapZoom = parseInt($('.mapZoom').text());
var mapLat = parseFloat($('.propMapLat').text());
var mapLng = parseFloat($('.propMapLng').text());
var mapOffsetXRaw = parseFloat($('.propMapLatOffset').text());
var mapOffsetYRaw = parseFloat($('.propMapLngOffset').text());
// var customMarkerIcon = '/wp-content/themes/penvale/assets/images/pawIcon.png';
if(!isNaN(mapOffsetXRaw)){
  var mapOffsetX = mapOffsetXRaw;
  //console.log('mapOffsetX = '+mapOffsetX);
}else{
  var mapOffsetX = 0;
  //console.log('mapOffsetX = null');
}
if(!isNaN(mapOffsetYRaw)){
  var mapOffsetY = mapOffsetYRaw;
}else{
  var mapOffsetY = 0;
}


if(mapBox.length){
  //console.log('There is a map on this page.');

  var map;// Setup the Google Maps variable

  function initialize(){

    // Call in the target latitude and longitude
    var testingLat = window.mapLat;
    var testingLng = window.mapLng;

    // Call in the desired offset, and setup the offset latitude and longitude
    var testingOffsetLat = testingLat + mapOffsetX;
    var testingOffsetLng = testingLng + mapOffsetY;

    // Declare map centre position
    var currentTarget = new google.maps.LatLng(testingLat, testingLng);
    // Declare marker position
    var currentCentre = new google.maps.LatLng(testingOffsetLat, testingOffsetLng);

    // Setup map options
    var mapOptions = {
      center:currentCentre,
      zoom: window.mapZoom,
      scrollwheel: false,
      mapTypeId:google.maps.MapTypeId.MAP
    }

    // Make the map
    map = new google.maps.Map(document.getElementById('mapCanvas'),
      mapOptions);

    // Set the marker marker
    var marker = new google.maps.Marker({
      position: currentTarget,
      map: map,
      // icon: customMarkerIcon
    });

  }

  // The standard Google Maps load trigger
  google.maps.event.addDomListener(window, 'load', initialize);
}