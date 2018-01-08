const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
var del = require('delete');

//SET ENV
process.env.NODE_ENV = 'dev';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 1200,
    height: 1000,
    // maxWidth: 1200,
    // maxHeight: 1000,
    // minWidth: 1200,
    // minHeight: 1000,
    // backgroundImage: "url('../img/bg.png')",
    backgroundColor: '#ccc',
    /*frame: false*/
  });



  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // win.webContents.openDevTools()



  // Continue to handle mainWindow "close" event here
  win.on('close', function(e){
          // e.preventDefault();
          // win.hide();
        console.log('shutting down FORTIFYmobile');

        console.log('attempting to terminate FFMPEG job');

        console.log('deleting old HLS segments');

        //delete all the HLS files in public/videos -- wait one second to let the ffmpeg job die
        setTimeout(function(){
          del(['public/videos/*.ts', 'public/videos/*.m3u8'],function(err, deleted){
            if(err) throw err;
            console.log(deleted + " from the error");
          });

          del.sync(['public/videos/*.ts', 'public/videos/*.m3u8']);

          del.promise(['public/videos/*.ts', 'public/videos/*.m3u8'])
          .then(function(deleted){
            console.log(deleted + " from the promise")

          });
        },10);

  });

  // You can use 'before-quit' instead of (or with) the close event
  app.on('before-quit', function (e) {
      // Handle menu-item or keyboard shortcut quit here
          // e.preventDefault();

  });

  // Remove mainWindow.on('closed'), as it is redundant





  // Emitted when the window is closed.
  win.on('closed', (e) => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.


    win = null
  })



  let menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: "Exit",
          click(){
              app.quit();
          },
          accelerator: process.platform == 'darwin' ? "Command+Q" : "Control+Q"
        },
      ]
    },
    {
      label: 'Dev Tools',
      submenu: [
        {
          label: 'Toggle Dev Tools',
          accelerator: process.platform == 'darwin' ? 'Command+I' : 'Control+I',
          click(item, focusedWindow){
            focusedWindow.toggleDevTools();
          }
        },
        {
          role: 'reload',
        }
      ]
    }
  ])

  Menu.setApplicationMenu(menu);
}
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



//
//
//
//
// //open HLS-stream and capture livestream from camera
// var HLSServer = require('hls-server-ef')
// var ffmpeg = require('fluent-ffmpeg')
// var http = require('http')
//
// var server = http.createServer()
// var hls = new HLSServer(server, {
//   path: '/streams',     // Base URI to output HLS streams
//   dir: 'public/videos'  // Directory that input files are stored
// })
// server.listen(9999);
//
// // host, port and path to the RTMP stream
// var host = '192.168.2.1';
// // var port = '1935'
// var append = '/live1.sdp';
//
// function callback() { // do something when stream ends and encoding finshes
// }
//
// ffmpeg('rtsp://'+host+append, { timeout: 432000 }).addOptions([
//     '-c:v copy',
//     // '-c:a aac',
//     // '-ac 1',
//     // '-strict -2',
//     // '-crf 5',
//     // '-profile:v baseline',
//     // '-maxrate 400k',
//     // '-bufsize 1835k',
//     // '-pix_fmt yuv420p',
//     '-hls_time .1', //target segement length in seconds (.ts)
//     '-hls_list_size 15', //max number of playlist entries
//     '-hls_wrap 15', //number of .ts files to keep in cache
//     '-start_number 1'
//   ]).output('public/videos/output.m3u8').on('end', callback).run();
