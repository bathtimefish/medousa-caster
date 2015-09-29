// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// PeerJS object
var peer = null;

// Medosa API
var key = 'de8eXWrSu4Q7E2ezwQBBvRaA';
var api = 'http://dev.bathtimefish.com:10010/v1/caster/';

var peerId = null;

$.ajax({ type:"GET", url:api + key, dataType:"json" })
 .then(function(data) {
    console.log(data);

    // 自分のカメラを映す
    navigator.getUserMedia({audio: true, video: true},
      function(stream){
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
        peer = new Peer({ key: 'c1dce32b-71cf-4ddf-bfc3-7bd7b492e03e', debug: 3});
        peer.on('open', function(){
          var call = peer.call(data.id, window.localStream);
          console.info(call);
          startMonitor(call);
        });
      },
      function(){
        console.error('cannot get video stream');
      }
    );


 }).fail(function(err) {
   console.error(err.status);
   console.error(err.responseText);
   $('.modal-title').text('Medousa Server Error');
   var res = JSON.parse(err.responseText);
   $('.modal-body').text('Status:'+err.status+' '+res.message);
   $('#modal').modal();
 });


function startMonitor(call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
  }

  // Wait for stream on the call, then set peer video display
  // Senderのカメラを映す
  call.on('stream', function(stream){
    $('#caster-video').prop('src', URL.createObjectURL(stream));
  });

  window.existingCall = call;
  call.on('close', function(){ console.log('peer closed'); });
}

$('#restart').click(function() {
  window.location.reload(true);
});
