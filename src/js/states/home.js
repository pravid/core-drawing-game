import Balloon from '../prefabs/balloon'

export default class Home extends Phaser.State {

    create() {
        this.game.stage.backgroundColor = otsimo.kv.homeBackgroundColor;
        this.game.add.button((this.game.width) * 0.37, (this.game.height) * 0.47, 'playButton', this.playAction, this, 2, 1, 0);
        this.game.add.button(25, 25, 'back', otsimo.quitgame, this);
    }

    playAction(button) {
        this.game.state.start('Play');
    }

    render() {
        if (otsimo.debug) {
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
        }
    }
}




