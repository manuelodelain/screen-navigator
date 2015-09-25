var ScreenNavigatorItem = function(screen, events){
  this.screen = screen;

  this.isInstance = typeof screen !== 'function';
  this.instance = this.isInstance ? screen : null;
};

ScreenNavigatorItem.prototype.getScreen = function() {
  if (!this.instance){
      this.instance = new this.screen();
  }

  return this.instance;
};

ScreenNavigatorItem.prototype.disposeScreen = function() {
  if (this.isInstance) return;

  this.instance.dispose();
  this.instance = null;
};

ScreenNavigatorItem.prototype.dispose = function() {
  if (this.instance){
    this.instance.dispose();
  }

  this.instance = this.screen = null;
};

module.exports = ScreenNavigatorItem;