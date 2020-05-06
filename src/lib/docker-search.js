
const { $log } = require('./logger');

const buildUrl = require('build-url');

// Here's what we send and what we receive:

// $ curl 'https://registry.redhat.io/v1/search?q=*'
// <a lot of results, omitted>

// $ curl 'https://index.docker.io/v1/search?q=*'
// {"num_pages":1,"num_results":0,"page_size":25,"page":1,"query":"*","results":[]}

// $ curl 'https://quay.io/v1/search?q=*'
// {"num_pages": 1, "num_results": 0, "results": [], "page_size": 25, "query": "*", "page": 1}


// Satellite will query /v2/_catalog if /v1/search doesn't exist (note: doesn't exist, not "return empty list"). But it wouldn't help:

// $ curl 'https://quay.io/v2/_catalog'
// {"repositories":[]}

// $ curl 'https://index.docker.io/v2/_catalog'
// {"errors":[{"code":"UNAUTHORIZED","message":"authentication required","detail":[{"Type":"registry","Class":"","Name":"catalog","Action":"*"}]}]}

class DockerSearch
{
  sSearchURL = 'https://hub.docker.com/api/content/v1/products/search'

  oParams = {
    page_size: 50,
    q: '*',
    source: 'community',
    type: 'image'
  }

  constructor(oParams={})
  {
    this.fnSetParams(oParams);
    // '?page_size=100&q=%2B&source=community'
  }

  fnSetParams(oParams={})
  {
    this.oParams = {...this.oParams, ...oParams};
    
    if (!this.oParams.q) {
      this.oParams.q = '*';
    }

    return this;
  }

  toString()
  {
    return buildUrl(this.sSearchURL, { queryParams: this.oParams });
  }
}

module.exports.DockerSearch = DockerSearch;