(function () {
  'use strict';

  function Game() {
  }

  Game.prototype = {
    create: function () {
      this.input.onDown.add(this.onInputDown, this);
    },

    update: function () {

    },

    onInputDown: function () {
      this.game.state.start('mainMenu');
    }
  };

  window['draw-prototype'] = window['draw-prototype'] || {};
  window['draw-prototype'].Game = Game;
}());
