
// const WebSocket = require('ws');

export class DockerWS
{
  oWebSocket = null
  bConnected = false

  oResultsGroupedByMethods = {}
  oCallbacksGroupedByMethods = {}

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

    ws.onmessage = (oMessage) => {
      oMessage = JSON.parse(oMessage.data);
      oThis.oCallbacksGroupedByMethods[oMessage.sMethod](oMessage.mResult);
      // if (oMessage.sMethod == sMethod) {
      //   fnSuccess(oMessage.mResult);
      // }
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

  async fnRun(sMethod, mParams={})
  {
    var oThis = this;

    return new Promise((fnSuccess, fnFail) => {
      var oPacket = {
        sMethod,
        mParams
      };

      oThis.oCallbacksGroupedByMethods[sMethod] = fnSuccess;

      oThis.fnWaitForConnetion(() => {
        oThis.oWebSocket.send(oPacket);
      });
    });
  }
}

// export var oDockerWS = new DockerWS();