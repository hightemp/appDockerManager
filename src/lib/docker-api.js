
const DockerSearch = require("./docker-search");
const axios = require('axios');
const $log = console.log.bind(console);

class DockerAPI
{
  constructor()
  {
    this.oDockerSearch = new DockerSearch();
  }

  async fnSearch(sSearchString)
  {
    return new Promise((fnSuccess, fnFail) => {
      var sURL = this.oDockerSearch.fnSetParams({ q:sSearchString }).toString();

      axios
        .get(sURL)
        .then(function (response) {
          var aResult = [];

          if (response.data && response.data.summaries) {
            aResult = response.data.summaries;
          }

          $log(aResult);

          fnSuccess(aResult);
        })
        .catch(function (error) {
          fnFail(error);
        });
    });
  }
}

module.exports.DockerAPI = DockerAPI;