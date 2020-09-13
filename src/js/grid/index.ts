export default class Grid {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    verticalGrid: [[number, number], [number, number]][];
    horizontalGrid: [[number, number], [number, number]][];
    boxSize: number;
    lineWidth: number;
    gridSize: number;
    speed: number;
    color: string;

    playing: boolean;

    constructor() {
        this.canvas = document.getElementById('grid') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        /* Set canvas height and width
         * This can be used to make the grid more pixel
         */
        this.ctx.canvas.width = window.innerWidth * 2;
        this.ctx.canvas.height = window.innerHeight * 2;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        /*! Editable variables */
        this.boxSize = 70;
        this.lineWidth = 4;
        this.playing = false;
        this.gridSize = 100;
        this.speed = 1;
        this.color = '#ff00c1';

        // Create grid
        this.verticalGrid = [];
        for (let i = 0; i < this.gridSize; i++) {
            this.verticalGrid.push([
                [i * this.boxSize, 0],
                [i * this.boxSize, this.gridSize * this.boxSize],
            ]);
        }
        this.horizontalGrid = [];
        for (let i = 0; i < this.gridSize; i++) {
            this.horizontalGrid.push([
                [0, i * this.boxSize],
                [this.gridSize * this.boxSize, i * this.boxSize],
            ]);
        }
    }

    private draw() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.lineWidth = this.lineWidth;
        this.ctx.shadowBlur = 13;
        this.ctx.shadowColor = this.color;
        this.verticalGrid.forEach((line) => {
            this.ctx.strokeStyle = this.color;
            this.ctx.beginPath();
            this.ctx.moveTo(line[0][0], line[0][1]);
            this.ctx.lineTo(line[1][0], line[1][1]);
            this.ctx.stroke();
        });
        this.horizontalGrid.forEach((line) => {
            this.ctx.strokeStyle = this.color;
            this.ctx.beginPath();
            this.ctx.moveTo(line[0][0], line[0][1]);
            this.ctx.lineTo(line[1][0], line[1][1]);
            this.ctx.stroke();
        });
        this.ctx.restore();
    }

    private tick() {
        this.draw();

        /* Update */
        for (let i = 0; i < this.horizontalGrid.length; i++) {
            let newY = this.horizontalGrid[i][0][1] + this.speed;
            if (newY > this.gridSize * this.boxSize) {
                newY = 0;
            }
            this.horizontalGrid[i] = [
                [0, newY],
                [this.width, newY],
            ];
        }

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
