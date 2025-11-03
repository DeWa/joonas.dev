import { faceText, introductionText, initialText, loadingText } from './texts';

export enum AnimationType {
  Initial,
  NotFound,
}

class ScreenAnimation {
  private canvas: HTMLCanvasElement;
  private bloomCanvas: HTMLCanvasElement | null = null;
  private scanlineCanvas: HTMLCanvasElement | null = null;
  private scanlineCtx: CanvasRenderingContext2D | null = null;
  private ctx: CanvasRenderingContext2D;
  private bloomCtx: CanvasRenderingContext2D | null = null;
  private ratio: number;
  private animationType: AnimationType = AnimationType.Initial;
  private indexPhases = [initialText, loadingText, faceText, introductionText];
  private phases: string[] = [];
  private lastTime: number = 0;

  // Screen
  private maxCharsY = 40;
  private maxCharsX = 80;
  private screen: string[][] = Array.from({ length: this.maxCharsY }, () =>
    Array.from({ length: this.maxCharsX }, () => ' ')
  );
  private fontSize: number = 0;

  // Typing state
  private currentPhaseIndex: number = 0;
  private currentText: string = '';
  private characterIndex: number = 0;
  private currentRow: number = 0;
  private currentCol: number = 0;
  private typingSpeed: number = 0.5; // milliseconds between characters
  private lastTypingTime: number = 0;
  private fastForward: boolean = false;

  // Effects
  private scanlineY: number = 0;

  private effectProperties: {
    scanlineHeight: number;
    scanlineSpeed: number;
    scanlineOpacity: number;
    curvatureIntensity: number;
    curvatureFrequency: number;
    vignetteIntensity: number;
    bloomIntensity: number;
    glowIntensity: number;
    vignetteFeather: number;
  } = {
    scanlineHeight: 4,
    scanlineSpeed: 2,
    scanlineOpacity: 0.1,
    curvatureIntensity: 0.007,
    curvatureFrequency: 0.004,
    vignetteIntensity: 0.8,
    bloomIntensity: 0.3,
    glowIntensity: 3,
    vignetteFeather: 0.6,
  };

  constructor() {
    this.canvas = document.getElementById('typingCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ratio = window.devicePixelRatio;

    this.canvas.width = 800 * this.ratio;
    this.canvas.height = 600 * this.ratio;
    this.canvas.style.zIndex = '1';
    this.ctx.scale(this.ratio, this.ratio);

    // Create and apply SVG filter for curvature effect (hardware accelerated)
    this.createCurvatureFilter();

    this.initializeText();

    // Make canvas clickable
    this.canvas.style.cursor = 'pointer';
    // Fast forward text when clicked
    this.canvas.addEventListener('click', () => {
      this.fastForwardText();
    });
  }

  /**
   * Create a proper CRT barrel distortion using SVG filter (hardware accelerated)
   */
  private createCurvatureFilter() {
    // Create proper CRT barrel distortion using SVG filter (hardware accelerated)
    // This creates true radial distortion where center bulges outward like CRT monitors
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('style', 'position: absolute; width: 0; height: 0;');
    svg.innerHTML = `
    <defs>
		<filter id="SphereMapTest" filterUnits="objectBoundingBox" x="-0.45" y="-1.29" width="1.6" height="3.5">
			<feImage id="mapa" result="Map" xlink:href="data:image/png;base64,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"></feImage>
			<feDisplacementMap id="despMap" in="SourceGraphic" in2="map" scale="100" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
		</filter>
	</defs>
      `;
    document.body.appendChild(svg);

    // Apply the filter to canvas (hardware accelerated, no performance impact)
    this.canvas.style.filter = 'url(#SphereMapTest)';
  }
  /**
   * This initializes fonts used by screen
   */
  private initializeText() {
    // Make sure the screen fit 80x25 characters
    this.fontSize = 16;
    this.ctx.font = `${this.fontSize}px "VT323", monospace`;
    this.ctx.fillStyle = '#00ff00';
    // Measure character width for accurate positioning
    this.ctx.textBaseline = 'top';
  }

  /**
   * Get approx font size
   */
  private getCharWidth(): number {
    return this.fontSize * 0.6; // Approximate monospace width
  }

  /**
   * Initializes canvas element used by scanline
   */
  private initializeScanlineCanvas() {
    this.scanlineCanvas = document.getElementById('scanlineCanvas') as HTMLCanvasElement;
    this.scanlineCanvas.width = this.canvas.width;
    this.scanlineCanvas.height = this.canvas.height;
    this.scanlineCanvas.style.zIndex = '2';
    this.scanlineCanvas.style.width = this.canvas.offsetWidth + 'px';
    this.scanlineCanvas.style.height = this.canvas.offsetHeight + 'px';
    this.scanlineCanvas.style.position = 'absolute';
    this.scanlineCanvas.style.top = '0';
    this.scanlineCanvas.style.left = '0';
    this.scanlineCanvas.style.pointerEvents = 'none';

    this.scanlineCtx = this.scanlineCanvas.getContext('2d') as CanvasRenderingContext2D;
  }

  /**
   * Initializes canvas element used by bloom and vignette effects
   */
  private initializeBloomCanvas() {
    this.bloomCanvas = document.getElementById('bloomCanvas') as HTMLCanvasElement;
    this.bloomCanvas.width = this.canvas.width;
    this.bloomCanvas.height = this.canvas.height;
    this.bloomCanvas.style.zIndex = '3';

    this.bloomCanvas.style.position = 'absolute';
    this.bloomCanvas.style.top = '0';
    this.bloomCanvas.style.left = '0';
    this.bloomCanvas.style.pointerEvents = 'none';
    this.bloomCtx = this.bloomCanvas.getContext('2d') as CanvasRenderingContext2D;
  }

  /**
   * Applies Bloom effect
   */
  private applyBloom() {
    if (!this.bloomCanvas || !this.bloomCtx) return;

    const { bloomIntensity } = this.effectProperties;
    const logicalWidth = this.canvas.width / this.ratio;
    const logicalHeight = this.canvas.height / this.ratio;

    // Copy current canvas to bloom canvas at logical size
    this.bloomCtx.clearRect(0, 0, logicalWidth, logicalHeight);
    this.bloomCtx.drawImage(this.canvas, 0, 0, logicalWidth, logicalHeight);

    // Get image data and enhance bright pixels (use actual canvas pixel dimensions)
    const imageData = this.bloomCtx.getImageData(
      0,
      0,
      this.bloomCanvas.width,
      this.bloomCanvas.height
    );
    const data = imageData.data;

    // Apply bloom by increasing brightness and creating glow
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Check if pixel is bright (green text)
      if (g > 50) {
        // Enhance brightness and add color bleed
        const brightness = g / 255;
        data[i] = Math.min(255, r + g * bloomIntensity * 0.3); // Red bleed
        data[i + 1] = Math.min(255, g + g * bloomIntensity * 0.5); // Green enhancement
        data[i + 2] = Math.min(255, b + g * bloomIntensity * 0.3); // Blue bleed
      }
    }

    this.bloomCtx.putImageData(imageData, 0, 0);

    // Apply blur to bloom canvas for glow effect
    try {
      this.bloomCtx.filter = 'blur(3px)';
      this.bloomCtx.drawImage(this.bloomCanvas, 0, 0, logicalWidth, logicalHeight);
      this.bloomCtx.filter = 'none';
    } catch (e) {
      // Fallback if filter not supported - skip blur but still apply color enhancement
    }

    // Composite bloom onto main canvas
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.globalAlpha = bloomIntensity;
    this.ctx.drawImage(this.bloomCanvas, 0, 0, logicalWidth, logicalHeight);
    this.ctx.restore();
  }

  /**
   * Applies Vignette effect
   */
  private applyVignette() {
    if (!this.bloomCtx || !this.bloomCanvas) {
      return;
    }

    const width = this.bloomCanvas.width / this.ratio;
    const height = this.bloomCanvas.height / this.ratio;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, height) * 0.8;

    const gradient = this.ctx.createRadialGradient(
      centerX,
      centerY,
      radius * (1 - this.effectProperties.vignetteFeather),
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${this.effectProperties.vignetteIntensity})`);

    this.bloomCtx.fillStyle = gradient;
    this.bloomCtx.fillRect(0, 0, width, height);
  }

  private drawTextWithGlow(text: string, x: number, y: number) {
    const { glowIntensity } = this.effectProperties;
    // Draw glow
    this.ctx.shadowColor = '#00ff00';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.globalAlpha = glowIntensity;
    this.ctx.fillText(text, x, y);

    // Draw main text
    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1;
    this.ctx.fillText(text, x, y);
  }

  private typeNextCharacter() {
    if (this.currentPhaseIndex >= this.phases.length) {
      return; // All phases complete
    }

    if (this.characterIndex >= this.currentText.length) {
      // Move to next phase
      this.currentPhaseIndex++;
      if (this.currentPhaseIndex >= this.phases.length) {
        return; // All phases complete
      }
      this.currentText = this.phases[this.currentPhaseIndex];
      this.characterIndex = 0;
      // Add some spacing between phases
      this.currentRow += 2;
      this.currentCol = 0;
      if (this.currentRow >= this.maxCharsY) {
        this.currentRow = 0;
      }
    }

    const char = this.currentText[this.characterIndex];

    if (char === '\n') {
      // Newline - move to next row
      this.currentRow++;
      this.currentCol = 0;
      if (this.currentRow >= this.maxCharsY) {
        // Screen full, stop or scroll (for now just stop)
        this.currentRow = this.maxCharsY - 1;
      }
    } else {
      // Write character to screen
      if (this.currentRow < this.maxCharsY && this.currentCol < this.maxCharsX) {
        this.screen[this.currentRow][this.currentCol] = char;
        this.currentCol++;

        // Handle word wrap at column 80
        if (this.currentCol >= this.maxCharsX) {
          this.currentRow++;
          this.currentCol = 0;
          if (this.currentRow >= this.maxCharsY) {
            this.currentRow = this.maxCharsY - 1;
          }
        }
      }
    }

    this.characterIndex++;
  }

  private drawScreen() {
    // Clear canvas for redraw (we redraw everything from the screen array)
    const width = this.canvas.width / this.ratio;
    const height = this.canvas.height / this.ratio;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, width, height);

    // Draw all characters from screen array (this preserves what was already typed)
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = `${this.fontSize}px "VT323", monospace`;
    this.ctx.textBaseline = 'top';

    const charWidth = this.getCharWidth();

    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 80; col++) {
        const char = this.screen[row][col];
        if (char !== ' ') {
          const x = col * charWidth + 20;
          const y = row * this.fontSize;
          this.drawTextWithGlow(char, x, y);
        }
      }
    }
  }

  private fastForwardText() {
    this.fastForward = true;
    // Complete all remaining phases immediately
    while (this.currentPhaseIndex < this.phases.length) {
      this.typeNextCharacter();
      // If we've completed all phases, stop
      if (this.currentPhaseIndex >= this.phases.length) {
        break;
      }
    }
    this.drawScreen();
    this.fastForward = false;
  }

  private drawScanline() {
    if (!this.scanlineCtx || !this.scanlineCanvas) return;
    this.scanlineCtx.clearRect(0, 0, this.scanlineCanvas.width, this.scanlineCanvas.height);
    this.scanlineCtx.fillStyle = `rgba(0, 255, 0, ${this.effectProperties.scanlineOpacity})`;
    this.scanlineCtx.fillRect(
      0,
      this.scanlineY,
      this.scanlineCanvas.width,
      this.effectProperties.scanlineHeight
    );

    this.scanlineY += this.effectProperties.scanlineSpeed;
    if (this.scanlineY > this.scanlineCanvas.height) {
      this.scanlineY = 0;
    }
  }

  private launchAnimation() {
    this.ctx.fillStyle = '#00ff00';
    this.applyVignette();
    //this.applyBloom();
    requestAnimationFrame(() => this.animate(0));
  }

  private animate(delta: number) {
    const deltaTime = delta - this.lastTime;

    // Type characters
    const timeSinceLastChar = delta - this.lastTypingTime;
    const typingInterval = this.fastForward ? 0 : this.typingSpeed;
    if (timeSinceLastChar >= typingInterval && this.currentPhaseIndex < this.phases.length) {
      this.typeNextCharacter();
      this.drawScreen();
      this.lastTypingTime = delta;
    }

    // Draw scanline effect
    if (deltaTime > 20) {
      this.drawScanline();
      this.lastTime = delta;
    }

    requestAnimationFrame(() => this.animate(performance.now()));
  }

  public run(animationType: AnimationType) {
    this.animationType = animationType;
    if (this.animationType === AnimationType.Initial) {
      this.phases = this.indexPhases;
    } else if (this.animationType === AnimationType.NotFound) {
      this.phases = [];
    }

    // Reset typing state
    this.currentPhaseIndex = 0;
    this.characterIndex = 0;
    this.currentRow = 0;
    this.currentCol = 0;
    this.fastForward = false;
    this.lastTypingTime = 0;

    // Clear screen
    this.screen = Array.from({ length: this.maxCharsY }, () =>
      Array.from({ length: this.maxCharsX }, () => ' ')
    );

    // Start with first phase
    if (this.phases.length > 0) {
      this.currentText = this.phases[0];
    }

    this.initializeBloomCanvas();
    this.initializeScanlineCanvas();
    this.launchAnimation();
  }
}

const screenAnimation = new ScreenAnimation();

export function run(animationType: AnimationType) {
  screenAnimation.run(animationType);
}
