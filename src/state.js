class AppState {

  constructor() {
    this.isActive = false;
    this.currentUrlID = 0;
    this.currentUrlInfo = {index:null, id:null, url: null};
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
    return this.isActive;
  }
  set active(val) {
    console.log('STATE STOP:', val);
    this.isActive = val;
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