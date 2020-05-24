
const { $log } = require('./logger');

const { DockerAPI } = require("./docker-api");
const { SpawnCommand } = require("./spawn-command");

class Docker 
{
  oDockerAPI = null
  oDockerDaemonUser = null
  oDockerVersion = null
  oDockerPullImage = null
  oInfo = {
    bNeedRoot: false,
    sDockerDaemonUser: '',
    sDockerVersion: ''  
  }
  oCommands = {

  }

  async fnGetDockerImages(aParams)
  {
    var aResult = [];

    var aImagesList = await this.oCommands.oDockerImages.fnRun(aParams);
    
    aImagesList.forEach((v) => {
      try {
        aResult.push(JSON.parse(v));
      } catch (_) {
        return;
      }
    });

    return aResult;
  }

  async fnGetDockerContainers(aParams)
  {
    var aResult = [];

    var aContainersList = await this.oCommands.oDockerContainers.fnRun(aParams);
    
    aContainersList.forEach((v) => {
      try {
        aResult.push(JSON.parse(v));
      } catch (_) {
        return;
      }
    });

    return aResult;
  }

  async fnGetDockerRunningContainers(aParams)
  {
    var aResult = [];

    var aContainersList = await this.oCommands.oDockerContainers.fnRun(aParams);
    
    aContainersList.forEach((v) => {
      try {
        aResult.push(JSON.parse(v));
      } catch (_) {
        return;
      }
    });

    return aResult;
  }

  constructor()
  {
    this.fnInit();
  }

  async fnInit()
  {
    this.oDockerAPI = new DockerAPI();

    this.oCommands.oDockerDaemonUser = new SpawnCommand(`ps aux | grep dockerd | grep -v "grep" | awk '{ print $1; exit; }'`, false, true);
    this.oInfo.sDockerDaemonUser = await this.oCommands.oDockerDaemonUser.fnRun();
    this.oInfo.bNeedRoot = this.sDockerDaemonUser == 'root';

    this.oCommands.oDockerVersion = new SpawnCommand(`docker --version | awk '{ sub(/,/, "", $3); print $3 }'`, this.bNeedRoot, true);
    this.oInfo.sDockerVersion = await this.oCommands.oDockerVersion.fnRun();

    this.oCommands.oDockerPullImage = new SpawnCommand(`docker pull %sImageName%`, this.bNeedRoot);

    this.oCommands.oDockerImages = new SpawnCommand(`docker images --format "{{json . }}"`, this.bNeedRoot, false, -1);

    this.oCommands.oDockerContainers = new SpawnCommand(`docker container ls --all --format "{{json . }}"`, this.bNeedRoot, false, -1);

    this.oCommands.oDockerRunningdContainers = new SpawnCommand(`docker ps --all --format "{{json . }}"`, this.bNeedRoot, false, -1);
  }
}

module.exports.Docker = Docker;
