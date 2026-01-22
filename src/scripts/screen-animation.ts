const initialText = `*** DEWA BIOS v3.03 ***
Copyright (C) 1985-1992 DEWA Technologies Ltd.
All Rights Reserved
CPU : Intel 80286 @ 12.5 MHz
640K System RAM Passed
512K Extended RAM

Fixed Disk 0: ST251 42MB
Fixed Disk 1: None
Diskette Drive A: 1.44MB 3½"
Diskette Drive B: 1.2MB 5¼"

Keyboard Detected
Mouse Not Found

Initializing BIOS...
Performing POST...

Press DEL to enter Setup

Booting from C:\\
JR-DOS Version 5.0`;

const introductionText = `
-------------------------------------------------
| NAME:               JOONAS REINIKKA           |
| OCCUPATION:         SOFTWARE ENGINEER         |
| LOCATION:           OULU, FINLAND             |
| ALIAS(ES):          "DEWA", "J.R."            |
| STATUS:             ACTIVE                    |
| PROFESSIONAL LEVEL: HIGH                      |
| SYSTEM ACCESS LVL:  CLASS A - TECHNICAL       |
-------------------------------------------------

SKILL SET:
 - ADVANCED PROGRAMMING (TS, PYTHON, GOLANG)
 - CLOUD SYSTEMS & DEVOPS
 - IOT & EMBEDDED SYSTEMS
 - WEB DEVELOPMENT
 - DATABASES

LAST KNOWN ACTIVITY:
 - MULTIPLE WEB AND MOBILE PROJECTS
 - CONSULTING
 - GAMES AND MOVIES

NOTES:
- CONTINUOUS LEARNING & IMPROVEMENT
- EXPERIMENTING WITH NEW TECHNOLOGIES
- CONTRIBUTING TO OPEN SOURCE
`;

const faceText = `                   @%@@%%%%#%                     
           #**%%@#%%@@%%@**#%#%%*                 
         %%%%#%#**#%#%%#@#%*+##***#%#+            
        %@##*###%#@%@*+*#%%#%@*@*++%%#%           
      @@#%*#####@%+%%%*+#*******%@@**%@%%         
     @@#%@%#########+++=++*%#*+%%*#%%%%%%*        
    @%%#@%##*#*#+++*+++=====+**+++*++*#**#        
    %%%#@@%#*++=====-----------------==*+         
    @%%####**+======------------------=+++        
     #####*#*+===-----:-:::--::::------=**        
     #####***+===----:::::::::::::-:----==        
     **####*++===-----:--:::::::-::-----=+        
     ###**#**+==------------:::::::------+        
     @**#**+======----:::::::::::::::::--=        
      *##*+=======---=+#=---=-::::::==.+.@#       
   @++=#%%.=*#*====+#@@@@@@@@%::::=-**@@@@@@@     
   *++-++*+=@++#*#%@@@@@@@@@@@@.-=%%@@@@@@@@@@    
    +==**++=====@.*@@@@@@@@@@@%==--@@@@@@@@@@@    
    @=+==++===---=@@@@@@@@@@@@===--@@@@@@@@@@     
     +++*++===-----@@@%@@%%%%=+++===@%%%@@@#      
   @@@+=++++==-------@*##%@:=*++=-::-:-*-*        
@@@@@@@*+*+====-----:::::::-+===-=--:::--@@@@@    
@@@@@@@#+*+====------:::::-:--=-::-------@@@@@@@  
@@@@@@@@***+====-----::::::::--:::------+@@@@@@@@ 
@@@@@@@@@##+++===-----:::-::::--==+=----@@@@@@@@@@
@@@@@@@@@@#*++++=----::::::==++=====---=@@@@@@@@@@
@@@@@@@@@@%#**++==----::::---:::-----==@@@@@@@@@@@
@@@@@@@@@@@#*#**+==----------:::----=+@@@@@@@@@@@@
@@@@@@@@@@@@@+*##*+===------::::::---@@@@@@@@@@@@@
@@@@@@@@@@@@@@*++****+++++==--::---#@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@*+=+++++#@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
`;

const canvas = document.getElementById('typingCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const ratio = window.devicePixelRatio;

const run = () => {
  // Set canvas size
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.style.width = canvas.offsetWidth + 'px';
  canvas.style.height = canvas.offsetHeight + 'px';
  ctx.scale(ratio, ratio);

  // Make canvas clickable
  canvas.style.cursor = 'pointer';

  // Set text style
  const fontSize = window.innerWidth < 1024 ? 16 : 20;
  ctx.font = `${fontSize}px "VT323", monospace`;
  ctx.fillStyle = '#00ff00';

  // Text variables
  let phase = 1;
  let lines = initialText.split('\n');
  let screenLines: string[] = [];
  let currentTextLine = 0;
  let currentPrintLine = 0;
  let currentChar = 0;
  let lastTime = 0;
  const lineHeight = 15;
  const charDelay = 0; // ms between characters
  const lineDelay = 0; // ms between lines

  // Scanline effect variables
  let scanlineY = 0;
  const scanlineHeight = 2;
  const scanlineSpeed = 2;
  const scanlineOpacity = 0.1;

  // Curvature effect variables
  const curvatureIntensity = 0.007;
  const curvatureFrequency = 0.004;

  // Vignette effect variables
  const vignetteIntensity = 5.7;
  const vignetteFeather = 0.5;

  // CRT effect variables
  const bloomIntensity = 0.3;
  const glowIntensity = 0.5;
  let bloomCanvas: HTMLCanvasElement;
  let bloomCtx: CanvasRenderingContext2D;

  // Fast forward text when clicked
  canvas.addEventListener('click', () => {
    if (currentTextLine < lines.length) {
      // Advance text by 5 lines
      const remainingLines = lines.length - currentTextLine;
      if (remainingLines > 5) {
        Array.from({ length: 5 }).forEach(() => {
          currentTextLine++;
          currentPrintLine++;
          screenLines[currentPrintLine] = lines[currentTextLine];
        });
      } else {
        Array.from({ length: remainingLines }).forEach(() => {
          currentTextLine++;
          currentPrintLine++;
          screenLines[currentPrintLine] = lines[currentTextLine];
        });
      }
    }
  });

  // Initialize bloom canvas
  function initBloomCanvas() {
    bloomCanvas = document.createElement('canvas');
    bloomCanvas.width = canvas.width;
    bloomCanvas.height = canvas.height;
    bloomCtx = bloomCanvas.getContext('2d') as CanvasRenderingContext2D;
    bloomCtx.scale(ratio, ratio);
  }

  initBloomCanvas();

  function applyBloom() {
    // Get the current canvas content
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply bloom effect
    for (let i = 0; i < data.length; i += 4) {
      // Increase brightness for bright pixels
      if (data[i + 1] > 100) {
        // Green channel
        data[i] = Math.min(255, data[i] + data[i + 1] * bloomIntensity); // Red bleed
        data[i + 2] = Math.min(255, data[i + 2] + data[i + 1] * bloomIntensity); // Blue bleed
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function drawTextWithGlow(text: string, x: number, y: number) {
    // Draw glow
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.globalAlpha = glowIntensity;
    ctx.fillText(text, x, y);

    // Draw main text
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillText(text, x, y);
  }

  function drawText(time: number) {
    if (!lastTime) lastTime = time;
    const delta = time - lastTime;

    ctx.fillStyle = '#00ff00';

    if (currentTextLine < lines.length) {
      if (currentChar < lines[currentTextLine].length) {
        if (delta > charDelay) {
          currentChar += 10;
          lastTime = time;
        }
      } else if (delta > lineDelay) {
        currentTextLine++;
        currentPrintLine++;
        currentChar = 0;
        lastTime = time;
      }
    }

    // If currentPrintLine goes over canvas height, scroll up
    if (
      currentPrintLine * lineHeight > canvas.height / ratio - 10 &&
      currentPrintLine <= lines.length
    ) {
      screenLines = screenLines.map((_, index) =>
        screenLines[index + 1] ? screenLines[index + 1] : ''
      );
      currentPrintLine--;
    }

    // Draw all completed lines
    for (let i = 0; i < currentPrintLine; i++) {
      drawTextWithGlow(screenLines[i], 20, 13 + i * lineHeight);
    }

    // Draw current line up to current character
    if (currentPrintLine < lines.length) {
      screenLines[currentPrintLine] = lines[currentTextLine];
      if (typeof screenLines[currentPrintLine] === 'string') {
        drawTextWithGlow(
          screenLines[currentPrintLine].substring(0, currentChar + 1),
          20,
          13 + currentPrintLine * lineHeight
        );
      }
    } else if (phase === 1 && currentTextLine === lines.length) {
      initPhase2();
    }
  }

  function applyVignette() {
    const width = canvas.width / ratio;
    const height = canvas.height / ratio;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, height) * 0.8;

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * (1 - vignetteFeather),
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteIntensity})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function initPhase2() {
    phase = 2;
    currentTextLine = 0;
    currentPrintLine = 0;
    currentChar = 0;
    lastTime = 0;

    lines = [];
    lines[0] = '>>> ACCESSING RECORDS...\n';
    lines[1] = '>>> RECORD FOUND - DISPLAYING DATA\n';
    lines[2] = '\n';

    let informationLines = [];
    let introductionLines = introductionText.split('\n');

    // Go through introduction text and add newlines to make it fit the screen
    for (let i = 0; i < introductionLines.length; i++) {
      const faceWidth = 20;
      if (introductionLines[i].length * 20 + faceWidth > canvas.width) {
        const lastPossibleCharacterIndex = Math.floor(canvas.width / 20);
        // Find good index to split the line
        let splitIndex = 0;
        for (let j = 0; j < introductionLines[i].length; j++) {
          if (introductionLines[i][j] === ' ') {
            splitIndex = j;
          } else if (j >= lastPossibleCharacterIndex) {
            break;
          }
        }
        if (splitIndex !== 0) {
          const newLineText = introductionLines[i].substring(splitIndex + 1);
          introductionLines[i] = introductionLines[i].substring(0, splitIndex) + '\n';
          introductionLines = [
            ...introductionLines.slice(0, i + 1),
            newLineText,
            ...introductionLines.slice(i + 1),
          ];
        }
      }
    }

    if (window.innerWidth < 1024) {
      informationLines = faceText.split('\n');
      informationLines = informationLines.concat(['\n', '\n']);
      informationLines = informationLines.concat(introductionLines);
    } else {
      informationLines = faceText.split('\n');
      const maximumCharacters = Math.max(...lines.map((line) => line.length));

      informationLines = informationLines.map((line, index) => {
        if (introductionLines[index]) {
          return `${line}${' '.repeat(maximumCharacters - line.length + 20)}${introductionLines[index]}`;
        }
        return line;
      });
    }

    lines = lines.concat(informationLines);
  }

  function applyCurvature() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    const newData = newImageData.data;

    for (let y = 0; y < canvas.height; y++) {
      const offset = Math.sin(y * curvatureFrequency) * curvatureIntensity * canvas.width;

      for (let x = 0; x < canvas.width; x++) {
        const sourceX = Math.floor(x + offset);

        if (sourceX >= 0 && sourceX < canvas.width) {
          const sourceIndex = (y * canvas.width + sourceX) * 4;
          const targetIndex = (y * canvas.width + x) * 4;

          newData[targetIndex] = data[sourceIndex];
          newData[targetIndex + 1] = data[sourceIndex + 1];
          newData[targetIndex + 2] = data[sourceIndex + 2];
          newData[targetIndex + 3] = data[sourceIndex + 3];
        }
      }
    }

    ctx.putImageData(newImageData, 0, 0);
  }

  function drawScanline() {
    ctx.fillStyle = `rgba(0, 255, 0, ${scanlineOpacity})`;
    ctx.fillRect(0, scanlineY, canvas.width / ratio, scanlineHeight);

    scanlineY += scanlineSpeed;
    if (scanlineY > canvas.height / ratio) {
      scanlineY = 0;
    }
  }

  let frameCount = 0;
  const framesPerUpdate = 60; // Only apply vignette every 10 frames

  function animate(time: number) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all text
    drawText(time);

    // Draw scanline
    drawScanline();
    applyVignette();
    //applyBloom();
    //applyCurvature();

    frameCount++;

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
};

async function waitForAssets() {
  await document.fonts.load('1rem "VT323"');
}

if (canvas && ctx) {
  waitForAssets().then(run);
}
