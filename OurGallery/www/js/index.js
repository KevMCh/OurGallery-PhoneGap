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

function initialize(){

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

function setLocalization(map, lat, lng){

  var mapCanvas = document.getElementById(map);
  var mapOptions = {
    center: new google.maps.LatLng(lat, lng),
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
  element.innerHTML = position.coords.latitude + ' ' + position.coords.longitude + ' ';

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
var descripcion;
var myImage;

document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady(){

  pictureSource = navigator.camera.PictureSourceType;
  destinationType = navigator.camera.DestinationType;
}

function capturePhoto(){

  navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
}

function onPhotoFileSuccess(imageData){

  myImage = document.getElementById('myImage');

  myImage.style.display = 'block';

  myImage.src = imageData;

  uploadPhoto(imageData);
}

function onFail(message){

  alert('Failed because: ' + message);
}

function uploadPhoto(imageURI) {
    //If you wish to display image on your page in app
    // Get image handle
    var userid = '123456';

    var options = new FileUploadOptions();
    options.fileKey = "file";    //Tipo del campo que recibirá el servidor. Tipo post, get ...
    var imageFileName = userid + Number(new Date()) + ".jpg";
    options.fileName = imageFileName;
    options.mimeType = "image/jpg";

    var params = new Object();  //Objeto que tendrá los datos que pasaremos al servidor.
    var cadena = document.getElementById('geolocation').textContent;
    params.descripcion =  cadena;
    alert("Alert descripcion: "+ params.descripcion);
    //params.imageURI = imageURI;
    //params.userid = sessionStorage.loginuserid;
    options.params = params;
    options.chunkedMode = true; //Envío del archivo a trocitos, poco a poco.

    var ft = new FileTransfer();

    //var url = "http://photoprueba-ullalu.rhcloud.com/subir.php";
    var url = "http://10.159.2.124:8888/phoneFotos/subir.php";
    ft.upload(imageURI, url, win, fail, options);
}

//Success callback
function win(r) {
    alert("Image uploaded successfully!! "+r.response);
}
//Failure callback
function fail(error) {
    alert("There was an error uploading image");
}

function downloadLocation(n){

  if(document.getElementById(n).classList.contains('vis')){

    document.getElementById(n).classList.remove('vis');
    document.getElementById(n).classList.add('ocul');

    document.getElementById("map"+n).classList.remove('ocul');
    document.getElementById("map"+n).classList.add('mapa');
    document.getElementById("map"+n).classList.add('vis');

    //var urlBajar = "http://photoprueba-ullalu.rhcloud.com/localization.php"
    var urlBajar = "http://10.159.2.124:8888/phoneFotos/localization.php";
    pasarVariable(urlBajar, n);

  }else{

    document.getElementById(n).classList.remove('ocul');
    document.getElementById(n).classList.add('vis');

    document.getElementById("map"+n).classList.remove('mapa');
    document.getElementById("map"+n).classList.remove('vis');
    document.getElementById("map"+n).classList.add('ocul');
  }
}

function pasarVariable(urlBajar, n){
  
  var regexp = /^\s*([\w|\d]+\.jpg)\s([-+]?\d+(?:.\d+)?)\s([-+]?\d+(?:.\d+)?)\s*$/i;
  var m;
  var response;
  var lat = 44.5403;
  var lng = -78.5463;

  $.get(urlBajar, {name: n}, function(r, status){
    response = r;
    m = response.match(regexp); //Funcion match pone los resultados en un array.
    //alert("Variable m[1]: "+m[1] + "Variable m[2]: "+m[2] + "Variable m[3]: "+m[3]);

    lat = m[2];
    lng = m[3];

    setLocalization("map"+n, lat, lng);

  }, "text");
}

//Descargar archivos
function downloadImages(n) {
  //var URL = "http://photoprueba-ullalu.rhcloud.com";
  var URL = "http://10.159.2.124:8888/phoneFotos/fotos";
  var fileName = n;
  //Parameters mismatch check
  if (URL == null && fileName == null) {
      alert("Parámetro en null: "+URL+", "+fileName);
      return;
  }
  else {
      //checking Internet connection availablity
      var networkState = navigator.connection.type;
      if (networkState == Connection.NONE) {
          alert("Falla conexión");
          return;
      }
      else {

          //star = $.getJSON('http://photoprueba-ullalu.rhcloud.com/bajar.php', function(data){
          star = $.getJSON('http://10.159.2.124:8888/phoneFotos/bajar.php', function(data){
            document.getElementById('divConsulta').innerHTML = "";
            for(var i=0; i<data.length; i++){

              download(URL,data[i]); //If available download function call

            }
          });
    }
  }
}

function download(URL,fileName) {

  //var urli = "http://photoprueba-ullalu.rhcloud.com/fotos/" + fileName;
  var urli = "http://10.159.2.124:8888/phoneFotos/fotos/" + fileName;
  var uri = encodeURI(urli);

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {

      var imagePath = fs.root.toURL()+fileName;
      var fileTransfer = new FileTransfer();
      fileTransfer.download(uri,imagePath,function(entry){
        var x = document.getElementById('divConsulta').innerHTML;
        document.getElementById('divConsulta').innerHTML = x + '<p>'+entry.fullPath+'</p>'+'<img id="'+ entry.name + '" src="'+imagePath+'" onClick = "downloadLocation(\''+entry.name+'\')" style="transform: rotate(90deg);" alt="No cargó la imagen" class="fGaleria"> <br> <div id="map'+entry.name+'" onClick = "downloadLocation(\''+entry.name+'\')"></div> <br>'
      }, function(error){
        alert("Error: "+ error.code);
      });
  });
}
