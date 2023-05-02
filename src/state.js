class AppState {

  constructor() {
    this._active = false;
    this.currentUrlID = 0;
    this.currentUrlInfo = {index:-1, id:-1, url: 'http://localhost:1223'};
    this._crawled = [];
    this._all = [];
  }
  get all() {
    return this._all;
  }
  get crawled() {
    return this._crawled;
  }
  get id() {
    return this.currentUrlID;
  }

  set id(id) {
    this.currentUrlID = id;
  }
  get info() {
    return this.currentUrlInfo;
  }

  set info(info) {
    this.currentUrlInfo = info;
  }

  get active() {
    return this._active;
  }
  set active(val) {    
    this._active = val;
    console.log('ACTIVE:', val);
  }

  get state() {
    return {state:this.active, last:this.info, crawled:this.crawled, all:this.all};
  }
  reset(){
    this._active = false;
    this.currentUrlID = 0;
    this.currentUrlInfo = {index:-1, id:-1, url: 'http://localhost:1223'};
    this._crawled = [];
    this._all = [];
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

