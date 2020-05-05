
// const WebSocket = require('ws');

export class DockerWS
{
  oWebSocket = null
  bConnected = false

  constructor()
  {
    var oThis = this;

    var ws = oThis.oWebSocket = new WebSocket('ws://localhost:3001');

    var send = oThis.oWebSocket.send.bind(oThis.oWebSocket);

    oThis.oWebSocket.send = (oObject) => {
      send(JSON.stringify(oObject));
    };

    ws.onopen = function open() {
      oThis.bConnected = true;
    };

    ws.onmessage = function incoming(sMessage) {
      console.log(sMessage);
    };

    ws.onclose = () => {
      oThis.bConnected = false;
    };
  }

  fnWaitForConnetion(fnCallback)
  {
    var oThis = this;

    var iTimeoutHandler = 0;
    var fnWait = () => {
      iTimeoutHandler = setTimeout(() => {
        if (oThis.bConnected) {
          fnCallback();
        } else {
          fnWait();
        }
      }, 1000);
    };

    fnWait();
  }

  async fnRun(sMethod, oParams={})
  {
    var oThis = this;

    return new Promise((fnSuccess, fnFail) => {
      var oPacket = {
        sMethod,
        oParams
      };

      oThis.fnWaitForConnetion(() => {
        oThis.oWebSocket.send(oPacket);

        oThis.oWebSocket.onmessage = (oMessage) => {
          fnSuccess(JSON.parse(oMessage.data));
        };
      });
    });
  }
}

// export var oDockerWS = new DockerWS();