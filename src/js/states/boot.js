export default class Boot extends Phaser.State {
    preload() {
        this.load.image('preloader', 'img/preloader.gif');
    }
    
    create() {
        // configure game
        this.game.input.maxPointers = 1;
        this.game.stage.backgroundColor = otsimo.kv.homeBackgroundColor;

        if (this.game.device.desktop) {
            this.game.scale.pageAlignHorizontally = true;
        } else {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = 1024;
            this.game.scale.minHeight = 768;
            this.game.scale.maxWidth = 1024;
            this.game.scale.maxHeight = 768;
            this.game.scale.forceOrientation(true);
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.setScreenSize(true);
        }
        this.game.state.start('Preloader');
    }
}
