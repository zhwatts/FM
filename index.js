//videojs with 360 dewarping
require('three');
let vjs = require('video.js');
require('videojs-contrib-hls');
require('videojs-panorama');

//create function to reset the video player source
function updateVideo(element){
  $(element).attr('src', '../public/videos/output.m3u8');
  $('#videoPlayer')[0].load();
}


//check and see if the main HLS file exists, if not wait a second and retry
function run(){
$.get('../public/videos/output.m3u8')
  .done(function() {
    $('#alert').html('Stream found, starting up view...');
    console.log('Stream file found, updating video source');
    updateVideo($('#videoPlayer > source'));
    console.log('Video source updated, instantiating VideoJS');

    //wait one second then create videoJS element
    setTimeout(function(){
        var player = vjs('videoPlayer');

        player.panorama({
          backToVerticalCenter: false,
          backToHorizonCenter: false,
          clickAndDrag: true,
          Notice: {
                Enable: false,
                // Message: (isMobile())? "please drag and drop the video" : "please use your mouse drag and drop the video"
            },
          //how far down can we drag... used to hide the blind spot
          minLat: 33,
          // rotateX: -Math.PI,
          videoType: "fisheye",
          VREnable: true,
          //auto start the video on load
          callback: function () {
            player.play();
          }
        });

        $('#alert').fadeOut(2000);
      }, 3000);

  }).fail(function() {
    if(retryCounter < 20){
    console.log('Stream file doesnt exist yet. Waiting one second and trying again.');
    $('#alert').html('Trying to capture stream...');

    retryCounter++;
    //wait one second then re-try
    setTimeout(function(){run();}, 1000);
  }
  else{
    console.log('No stream detected, terminating loop.');
    $('#alert').html('You do not appear to be connected to a camera.');
  }
  });
}
retryCounter = 0;
run();
