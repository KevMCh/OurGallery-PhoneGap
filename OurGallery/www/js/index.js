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
    params.descripcion = " Esta es la descripcion de la foto.";
    //params.imageURI = imageURI;
    //params.userid = sessionStorage.loginuserid;
    options.params = params;
    options.chunkedMode = true; //Envío del archivo a trocitos, poco a poco.

    var ft = new FileTransfer();
    //var url = "http://192.168.3.116:8888/phoneFotos/subir.php";
    var url = "http://192.168.3.165:8888/phoneFotos/subir.php";
    //var url = "http://photoprueba-ullalu.rhcloud.com/subir.php";
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

function downloadImg(){
    $("#btnBajar").click(function(e) {
        e.preventDefault();
        // Un mensaje de estado
        $("#divConsulta").html("Obteniendo los datos - esperando...");
        // Hacemos un peticion web y obtenemos la data
        //var urlBajar = "http://192.168.3.165:8888/phoneFotos/descargar.php";
        //var urlBajar = "http://192.168.3.165:8888/phoneFotos/bajar.php";
        var urlBajar = "http://photoprueba-ullalu.rhcloud.com/bajar.php";
        $.get(urlBajar, {}, function(data) {
            // Cargamos la data dentro de la etiqueta div
            $("#divConsulta").html(data);
        })
    });
}

// ----------------------------------------------------------------------------
//Descargar archivos
function downloadImages() {
  //var URL = "http://10.159.2.124:8888/phoneFotos/fotos";
  var URL = "http://photoprueba-ullalu.rhcloud.com";
  var fileName = "prueba.jpg";
  //Parameters mismatch check
  if (URL == null && File_Name == null) {
      alert("Parámetro en null: "+URL+", "+File_Name);
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
          download(URL,fileName); //If available download function call
    }
  }
}

function download(URL,fileName) {

  var urli = "http://photoprueba-ullalu.rhcloud.com/fotos/prueba.jpg";
  var uri = encodeURI(urli);

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {

      var imagePath = fs.root.toURL()+fileName;
      alert(fs.root.toURL());    //   file:///data/data/com.adobe.phonegap.app/files/files/
      var fileTransfer = new FileTransfer();
      fileTransfer.download(uri,imagePath,function(entry){
        alert("entry.fullPath = " + entry.fullPath);
        document.getElementById('divConsulta').innerHTML = '<p>'+entry.fullPath+'</p>'+'<img src="'+imagePath+'" alt="No cargó la imagen" class="fGaleria">'
      }, function(error){
        alert("Error: "+ error.code);
      });
  });
}
