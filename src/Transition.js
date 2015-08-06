var TinyEmitter = require('tiny-emitter');
var inherits = require('inherits');

var Transition = function(currentScreen, prevScreen, type){
  this.currentScreen = currentScreen;
  this.prevScreen = prevScreen;
  this.type = type || Transition.NONE;

  this.isRunnning = false;
};

inherits(Transition, TinyEmitter);

Transition.OUT_AND_IN = 'outAndIn';
Transition.OUT_THEN_IN = 'outThenIn';
Transition.IN_THEN_OUT = 'inThenOut';
Transition.OUT = 'out';
Transition.IN = 'in';
Transition.NONE = 'none';

Transition.prototype.start = function() {
  this.isRunnning = true;

  swith(this.type){
    case Transition.OUT_AND_IN:
      break;

    case Transition.OUT_THEN_IN:
      break;

    case Transition.IN_THEN_OUT:
      break;

    case Transition.OUT:
      break;

    case Transition.IN:
      break;

    case Transition.NONE:
    default:
      break;
  }

  this.onStart();
};

Transition.prototype.stop = function(complete) {
  this.isRunnning = false;
};

Transition.prototype.onStart = function() {
  this.emit('start');
};

Transition.prototype.onComplete = function() {
  this.emit('complete');
};

Transition.prototype.dispose = function() {
  this.off('start');
  this.off('complete');

  if (this.isRunnning) this.stop();
};

