

//open HLS-stream and capture livestream from camera
var HLSServer = require('hls-server-ef')
var ffmpeg = require('fluent-ffmpeg')
var http = require('http')

var server = http.createServer()
var hls = new HLSServer(server, {
  path: '/streams',     // Base URI to output HLS streams
  dir: 'public/videos'  // Directory that input files are stored
})
server.listen(9999);

// host, port and path to the RTMP stream
var host = '192.168.2.1';
// var port = '1935'
var append = '/live1.sdp';

function callback() { // do something when stream ends and encoding finshes
}

ffmpeg('rtsp://'+host+append, { timeout: 432000 }).addOptions([
    '-c:v copy',
    // '-c:a aac',
    // '-ac 1',
    // '-strict -2',
    // '-crf 5',
    // '-profile:v baseline',
    // '-maxrate 400k',
    // '-bufsize 1835k',
    // '-pix_fmt yuv420p',
    '-hls_time 5', //target segement length in seconds (.ts)
    '-hls_list_size 15', //max number of playlist entries
    '-hls_wrap 15', //number of .ts files to keep in cache
    '-start_number 1'
  ]).output('public/videos/output.m3u8').on('end', callback).run();
