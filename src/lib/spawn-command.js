
const { spawn, exec } = require('child_process');
// console.log(require('child_process'));

var sudo = require('sudo-prompt');
var oSudoOptions = {};

class SpawnCommand
{
  sCommand = ''
  aCommand = []
  sSpawnCommand = ''
  aSpawnArgs = []
  aStdOut = []
  aStdErr = []
  bClosed = true
  iExitCode = -1
  oSpawn = null
  bSudo = false
  bExec = false
  iRowIndex = -1

  constructor(sCommand, bSudo = false, bExec = false, iRowIndex=0)
  {
    var oThis = this;

    oThis.iRowIndex = iRowIndex;
    oThis.bSudo = bSudo;
    oThis.bExec = bExec;

    oThis.sCommand = sCommand;

    if (sCommand.match(/|/)) {
      oThis.bExec = true;
    } else {
      var oMatch = oThis.sCommand.match(/\w+|".*?[^\\]"|'.*?[^\\]'/g);

      if (!oMatch) {
        throw new Error(`can't parse command '${sCommand}'`);
      }

      oThis.aCommand = Array.from(oMatch);
      var aArr = Array.from(oMatch);
      oThis.sSpawnCommand = aArr.shift();
      oThis.aSpawnArgs = aArr;
    }
  }

  fnPrepareParamsArray(aParams)
  {
    var oThis = this;

    var aResult = oThis.aSpawnArgs.slice();

    for (var sKey in aParams) {
      aResult = aResult.map((v) => v.replace(`%${sKey}%`, aParams[sKey]));
    }

    return aResult;
  }

  fnPrepareParamsString(aParams)
  {
    var oThis = this;

    var sResult = oThis.sCommand;

    for (var sKey in aParams) {
      sResult = sResult.replace(new RegExp(`%${sKey}%`, "ig"), aParams[sKey]);
    }

    return sResult;
  }

  async fnRun(aParams={}, bSudo = null, bExec = null, iRowIndex = null)
  {
    var oThis = this;

    return new Promise((fnSuccess, fnFail) => {
      var aMapped = [];
      var sCommand = '';

      if (iRowIndex !== null) oThis.iRowIndex = iRowIndex;
      if (bSudo !== null) oThis.bSudo = bSudo;
      if (bExec !== null) oThis.bExec = bExec;

      if (!oThis.bExec) {
        aMapped = oThis.fnPrepareParamsArray(aParams);
        $log(`spawn: ${sCommand}`);
      } else {
        sCommand = oThis.fnPrepareParamsString(aParams);
        $log(`exec: ${sCommand}`);
      }
      
      // var sCommand = oThis.sSpawnCommand+" "+aMapped.join(" ");

      oThis.bClosed = false;

      if (oThis.bSudo) {
        sudo.exec(
          sCommand, 
          oSudoOptions,
          function(oError, sStdout, sStdErr) {
            oThis.bClosed = true;

            if (oError) throw oError;

            oThis.aStdOut = sStdout.split(/\n/);
            oThis.aStdErr = sStdErr.split(/\n/);

            var mResult = ~oThis.iRowIndex ? oThis.aStdOut[oThis.iRowIndex] : oThis.aStdOut;

            fnSuccess(mResult, {aStdOut: oThis.aStdOut, aStdErr: oThis.aStdErr, iExitCode:-1});

            console.log('stdout: ' + sStdout);
          }
        );
        // oThis.oSpawn = sudo(oThis.aCommand, oSudoOptions);
      } else if (oThis.bExec) {
        exec(
          sCommand,
          (oError, sStdout, sStdErr) => {
            oThis.bClosed = true;

            if (oError) throw oError;

            oThis.aStdOut = sStdout.split(/\n/);
            oThis.aStdErr = sStdErr.split(/\n/);

            var mResult = ~oThis.iRowIndex ? oThis.aStdOut[oThis.iRowIndex] : oThis.aStdOut;

            fnSuccess(mResult, {aStdOut: oThis.aStdOut, aStdErr: oThis.aStdErr, iExitCode:-1});

            console.log('stdout: ' + sStdout);
          }
        );
      } else {
        oThis.oSpawn = spawn(oThis.sSpawnCommand, aMapped);

        oThis.oSpawn.stdout.on('data', (data) => {
          oThis.aStdOut.push(data);
          console.log(`stdout: ${data}`);
        });

        oThis.oSpawn.stderr.on('data', (data) => {
          oThis.aStdErr.push(data);
          console.error(`stderr: ${data}`);
        });

        oThis.oSpawn.on('close', (code) => {
          oThis.bClosed = false;
          oThis.iExitCode = code;

          console.log(`child process exited with code ${code}`);

          var mResult = ~oThis.iRowIndex ? oThis.aStdOut[oThis.iRowIndex] : oThis.aStdOut;

          fnSuccess(mResult, {aStdOut: oThis.aStdOut, aStdErr: oThis.aStdErr, iExitCode:oThis.iExitCode});
        });
      }
    });
  }
}

module.exports.SpawnCommand = SpawnCommand;