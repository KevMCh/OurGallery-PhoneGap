/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//Script geolocalización

var map;
var marcador;

function initialize() {
  var mapCanvas = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(44.5403, -78.5463),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(mapCanvas, mapOptions)

  marcador = new google.maps.Marker({
    position:LatLng,
    map: map
  })
}

function showPosition(){

  navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccurracy:true})
}

function onSuccess(position){

  var myposition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
  map.setCenter(myposition)

  var element = document.getElementById('geolocation');
  element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br>' +
                      'Longitude: ' + position.coords.longitude     + '<br>' +
                      ' ';

  marcador.setPosition(myposition)
}


  function onError(error) {

    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  }

  google.maps.event.addDomListener(window, 'load', initialize);


//Script cámara

var pictureSource;
var destinationType;

document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady(){

  pictureSource = navigator.camera.PictureSourceType;
  destinationType = navigator.camera.DestinationType;
}

function capturePhoto(){

  navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
}

function onPhotoFileSuccess(imageData){

  console.log(JSON.stringify(imageData));

  var myImage = document.getElementById('myImage');

  myImage.style.display = 'block';

  myImage.src = imageData;
}

function getPhoto(source){

  navigator.camera.getPicture(onPhotoURISuccess, onFail, {
    quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
}

function onFail(message){

  alert('Failed because: ' + message);
}
