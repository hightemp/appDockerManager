
const { $log } = require('./logger');

var { Docker } = require('./docker');

// var objectPath = require("object-path");
var dpresolve = require('./dotpath-resolve/lib/resolve');

const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 3001,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

wss.on('connection', (ws) => {
  var oDocker = new Docker();

  var send = ws.send.bind(ws);

  ws.send = (oObject) => {
    send(JSON.stringify(oObject));
  };

  ws.on('message', async (sMessage) => {
    var oMessage = JSON.parse(sMessage);

    if (oMessage) {
      // var fnFunction = objectPath.withInheritedProps.get(oDocker, oMessage.sMethod);
      var mResult = dpresolve(oDocker, oMessage.sMethod);

      console.log(oMessage.sMethod, mResult);

      if (typeof mResult === "function") {
        ws.send(await mResult(oMessage.mParams));
      } else {
        ws.send(mResult);
      }
      // if (oMessage.sMethod == "oDockerDaemonUser") {
      //   ws.send(await oDocker.oDockerDaemonUser.fnRun(oMessage.oParams));
      // }
    }
  });
});

module.exports.wss = wss;
