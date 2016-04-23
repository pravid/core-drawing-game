import {calculateConstraint} from '../utils'

export default class Introduction extends Phaser.Group {
    constructor({game, question}) {
        super(game);
        this.onComplete = new Phaser.Signal();
        this.question = question;
        this.currentPage = 0;
    }

    _addOnPageCompleted(chain, txts) {
        let intro = otsimo.kv.play_screen.intro;

        chain.onComplete.addOnce(() => {
            let last = null;
            for (let txt of txts) {
                last = otsimo.game.add.tween(txt).to({ alpha: 0 }, intro.text_enter_duration, Phaser.Easing.Cubic.Out, false, intro.duration_each * 4);
                last.start();
            }
            this.currentPage = this.currentPage + 1
            if (this.currentPage < this.pageTweens.length) {
                last.chain(this.pageTweens[this.currentPage])
            } else {
                last.onComplete.addOnce(() => {
                    this.onComplete.dispatch();
                }, this)
            }
        }, this);
    }

    show() {
        let q = this.question// otsimo.kv.alphabet[0] //this.question;
        let intro = otsimo.kv.play_screen.intro;
        let qp = calculateConstraint(intro.question_constraint);
        let question_image = this.create(qp.x, -otsimo.game.height, q.object_img, q.object_frame);
        question_image.anchor.set(qp.anchor.x, qp.anchor.y);
        let itween = otsimo.game.add.tween(question_image).to({ y: qp.y }, 300, Phaser.Easing.Cubic.Out);

        this.pageTweens = [itween];

        for (let i = 0; i < intro.pages.length; i++) {
            let chain = null;
            let txts = [];
            for (let t of intro.pages[i]) {
                let pos = calculateConstraint(t.position);
                let text = sprintf(t.text, q);
                let style = intro.styles[t.style];

                let txt = otsimo.game.add.text(pos.x, pos.y, text, style, this);

                txt.audio = sprintf(t.audio, q);
                txt.anchor.set(0.5, 0.5);
                txt.alpha = 0;

                let k = otsimo.game.add.tween(txt).to({ alpha: 1 }, intro.text_enter_duration, Phaser.Easing.Cubic.Out, false, intro.duration_each);

                if (chain) {
                    chain.chain(k);
                } else {
                    if (this.pageTweens.length == 1) {
                        itween.chain(k);
                    }
                    this.pageTweens.push(k);
                }

                chain = k;
                txts.push(txt);
            }
            this._addOnPageCompleted(chain, txts);
        }
        this.objectImage = question_image;
        this.pageTweens[this.currentPage].start();
        this.currentPage = this.currentPage + 1
    }

    hide() {
        let img = this.objectImage;
        let t = otsimo.game.add.tween(img)
            .to({ x: otsimo.game.width + img.width }, 300, Phaser.Easing.Cubic.In, true);

        t.onComplete.addOnce(this.destroy, this);
    }

    makeObjectImageSmall() {
        let p = calculateConstraint(otsimo.kv.play_screen.intro.question_small_constraint);
        let img = this.objectImage;

        let co = otsimo.kv.play_screen.intro.question_small_size
        let xc = co.width.constant | 0;
        let yc = co.height.constant | 0;
        let mw = co.width.multiplier * otsimo.game.width + xc;
        let mh = co.height.multiplier * otsimo.game.height + yc;

        let s = img.scale.x;

        if (img.width > mw) {
            s = mw / img.width;
        }
        if ((img.height * s) > mh) {
            s = mh / (img.height * s);
        }

        if (Math.abs(s - img.scale.x) > 0.001) {
            otsimo.game.add.tween(img.scale)
                .to({ x: s, y: s }, 300, Phaser.Easing.Cubic.Out, true);
        }

        otsimo.game.add.tween(img)
            .to({ x: p.x, y: p.y }, 300, Phaser.Easing.Cubic.Out, true);

        if (p.anchor.x != img.anchor.x || p.anchor.y != img.anchor.y) {
            otsimo.game.add.tween(img.anchor).to({ x: p.anchor.x, y: p.anchor.y }, 300, Phaser.Easing.Cubic.Out, true)
        }


    }

    goRightForEnding(){
        
    }
}