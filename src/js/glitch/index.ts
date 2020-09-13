export default class Glitch {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    playing: boolean;

    constructor() {
        this.canvas = document.getElementById('glitch') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.playing = false;
    }

    private draw() {}

    private tick() {
        if (this.playing) {
            window.requestAnimationFrame(this.tick.bind(this));
        }
    }

    public play() {
        this.playing = true;
        window.requestAnimationFrame(this.tick.bind(this));
    }

    public stop() {
        this.playing = false;
    }
}
