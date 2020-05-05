
const DockerAPI = require("./docker-api");
const SpawnCommand = require("./spawn-command");

module.exports.oDocker = {
  oDockerAPI: new DockerAPI(),
  oDockerDaemonUser: new SpawnCommand(`ps aux | grep dockerd | grep -v "grep" | awk '{ print $1; exit; }'`, false, true),
  oDockerPullImage: new SpawnCommand(`docker pull %sImageName%`, true)
};
