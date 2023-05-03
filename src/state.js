class AppState {

  constructor() {
    this._basicAuth = false;
    this._active = false;
    this.currentUrlID = 0;
    this.currentLength = 0;
    this.currentUrlInfo = {index:-1, id:-1, url: 'http://localhost:1223', status:0};
    this._crawled = [];
    this._all = [];
    this._startTime = 0;
  }
  /**
   * get all urls to be crawled
   */
  get all() {
    return this._all;
  }

  /**
   * get all crawled urls
   */
  get crawled() {
    return this._crawled;
  }
  /**
   * set all crawled urls
   */
  set crawled(crawled) {
    this._crawled = crawled;
  }
  /**
   * get the current id crawled
   */
  get id() {
    return this.currentUrlID;
  }
  /**
   * set the current id crawled
   */
  set id(id) {
    this.currentUrlID = id;
  }

  /**
   * get the current urls set length
   */
  get length() {
    return this.currentLength;
  }
  /**
   * set the current urls set length
   */
  set length(length) {
    this.currentLength = length;
  }


  /**
   * get the current url object
   */
  get info() {
    return this.currentUrlInfo;
  }
  /**
   * set the current url object
   */
  set info(info) {
    this.currentUrlInfo = info;
  }
  /**
   * get the status
   */
  get active() {
    return this._active;
  }
  /**
   * set the status
   */
  set active(val) {
    this._active = val;
    console.log('ACTIVE:', val);
  }

  /**
   * get the basicAuth
   */
  get basicAuth() {
    return this._basicAuth;
  }
  /**
   * set the basicAuth
   */
  set basicAuth(val) {
    this._basicAuth = val;
  }

  /**
   * get the global state object
   */
  get state() {
    return {basicAuth:this.basicAuth,state:this.active, length:this.currentLength, last:this.info, crawled:this.crawled, all:this.all};
  }

  reset(){
    this._active = false;
    this.currentUrlID = 0;
    this.currentLength = 0;
    this.currentUrlInfo = {index:-1, id:-1, url: 'http://localhost:1223', status:0};
    this._crawled = [];
    this._all = [];
    this._startTime = 0;
  }
  
  init(urls){
    this._all = urls;
  }
}


class State {

  constructor() {
    if (!State.instance) {
      State.instance = new AppState();
    }
  }

  getInstance() {
      return State.instance;
  }

}

module.exports = State;

