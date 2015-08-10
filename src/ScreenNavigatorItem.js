var ScreenNavigatorItem = function(screen, events){
  this.screen = screen;

  this.isInstance = typeof screen === 'function' ? false : true;
  this.instance = null;
};

ScreenNavigatorItem.prototype.getScreen = function() {
  if (this.isInstance) {
    this.instance = this.screen;
  }else{
    this.instance = new this.screen();
  }

  return this.instance;
};

ScreenNavigatorItem.prototype.disposeInstance = function() {
  if (this.isInstance) return;

  this.instance.dispose();
  this.instance = null;
};

ScreenNavigatorItem.prototype.dispose = function() {
  if (this.isInstance){
    this.screen.dispose();
  }else if (this.instance){
    this.instance.dispose();
  }

  this.instance = this.screen = null;
};