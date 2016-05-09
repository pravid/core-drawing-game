/**
 * hint interrupts missing for painting.js
 * hint anchor and star anchor don't match
 */

export default class Hint {
    constructor({game, stars}) {
        this.game = game;
        this.stars = stars;
        this.step = 0;
        this.timerArr = [];
        this.tweenArr = [];
        this.timer = undefined;
        this.tween = undefined;
        this.arrow = undefined;
    }

    /**
     * Call hint timer
     * Timer is calls hint otsimo.settings.hint_duration seconds with delay
     * @param {integer} delay for outside conditions
     */
    call(delay) {
        console.log("hint is called");
        if (!otsimo.settings.show_hint) {
            return;
        }
        this.removeTimer();
        this.timer = otsimo.game.time.events.add(delay + (otsimo.settings.hint_duration * 1000), this.hint, this);
        this.timerArr.push(this.timer);
    }

    /**
     * Kill hint from scene or paint
     * Also destroys tweens
     */
    kill() { //kills objects
        this.tweenArr = [];
        this.killArrow();
    }
    
    /**
     * Removes timer calls if there was any
     * Does not affect active tweens
     */
    removeTimer() {
        otsimo.game.time.events.stop(false);
        if (this.timer) {
            otsimo.game.time.events.remove(this.timer);
            this.timer = undefined;
        }
        otsimo.game.time.events.start();
    }

    incrementStep() {
        this.step++;
    }

    /**
     * Creates hint arrow and its tweens.
     * Calls hint again with a delay of tween animations.
     */
    hint() {
        this.incrementStep();
        console.log("showing hint");
        let fT = undefined;
        let lT = undefined;
        let next = { func: Phaser.Easing.Sinusoidal.Out, id: 'out' };
        this.swap = function (prev) {
            switch (prev.id) {
                case ('out'):
                    prev.func = Phaser.Easing.Sinusoidal.In;
                    prev.id = 'in';
                    break;
                case ('in'):
                    prev.func = Phaser.Easing.Sinusoidal.Out;
                    prev.id = 'out';
                    break;
            }
        }
        this.arrow = otsimo.game.add.sprite(this.stars[0].world.x, this.stars[0].world.y + otsimo.game.height * 0.05, 'hand');
        console.log("anchors: ", this.stars[0].anchor.x - 0.1, this.stars[0].anchor.y);
        this.arrow.anchor.set(this.stars[0].anchor.x, this.stars[0].anchor.y);
        for (let i of this.stars) {
            if (i != this.stars[0]) {
                let t = otsimo.game.add.tween(this.arrow).to({ y: i.world.y, x: i.world.x }, otsimo.kv.game.hint_hand_duration, Phaser.Easing.Linear.Out, false);
                this.tweenArr.push(t);
                this.swap(next);
            }
        }
        for (let i = 0; i < this.tweenArr.length - 1; i++) {
            if (i == 0) {
                fT = this.tweenArr[i];
            } else if (i == this.tweenArr.length - 2) {
                lT = this.tweenArr[i + 1];
            }
            this.tweenArr[i].chain(this.tweenArr[i + 1]);
        }
        this.tween = fT;
        fT.start();
        lT.onComplete.add(this.kill, this);
        let delay = this.tweenArr.length * otsimo.kv.game.hint_hand_duration;
        this.call(delay);
    }
    
    /**
     * Kills the hint object if it exists
     */
    
    killArrow() {
        if (this.arrow) {
            this.arrow.kill();
            this.arrow = undefined;
        }
    }

    /**
     * Kills all tweens in tweenArr 
     */
    
    killTween() {
        let temp = this.tween;
        for (let i of this.tweenArr) {
            temp = i;
            while (temp.chainedTween != null) {
                let k = temp.chainedTween;
                otsimo.game.tweens.remove(temp.chainedTween);
                temp = k;
            }
            otsimo.game.tweens.remove(i);
            i = undefined;
        }
        if (this.tween) {
            this.tween.stop();
        }
    }

    getStep() {
        return this.step;
    }

}
