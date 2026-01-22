const U=`*** DEWA BIOS v3.03 ***
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
JR-DOS Version 5.0`,V=`
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
`,u=`                   @%@@%%%%#%                     
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
`,i=document.getElementById("typingCanvas"),o=i.getContext("2d"),r=window.devicePixelRatio,F=()=>{i.width=i.offsetWidth*r,i.height=i.offsetHeight*r,i.style.width=i.offsetWidth+"px",i.style.height=i.offsetHeight+"px",o.scale(r,r),i.style.cursor="pointer";const D=window.innerWidth<1024?16:20;o.font=`${D}px "VT323", monospace`,o.fillStyle="#00ff00";let I=1,s=U.split(`
`),h=[],a=0,l=0,g=0,S=0;const O=15,w=0,m=0;let A=0;const p=2,R=2,M=.1,x=5.7,y=.5,P=.5;let T,N;i.addEventListener("click",()=>{if(a<s.length){const t=s.length-a;t>5?Array.from({length:5}).forEach(()=>{a++,l++,h[l]=s[a]}):Array.from({length:t}).forEach(()=>{a++,l++,h[l]=s[a]})}});function B(){T=document.createElement("canvas"),T.width=i.width,T.height=i.height,N=T.getContext("2d"),N.scale(r,r)}B();function C(t,n,e){o.shadowColor="#00ff00",o.shadowBlur=10,o.shadowOffsetX=0,o.shadowOffsetY=0,o.globalAlpha=P,o.fillText(t,n,e),o.shadowBlur=0,o.globalAlpha=1,o.fillText(t,n,e)}function G(t){S||(S=t);const n=t-S;o.fillStyle="#00ff00",a<s.length&&(g<s[a].length?n>w&&(g+=10,S=t):n>m&&(a++,l++,g=0,S=t)),l*O>i.height/r-10&&l<=s.length&&(h=h.map((e,c)=>h[c+1]?h[c+1]:""),l--);for(let e=0;e<l;e++)C(h[e],20,13+e*O);l<s.length?(h[l]=s[a],typeof h[l]=="string"&&C(h[l].substring(0,g+1),20,13+l*O)):I===1&&a===s.length&&b()}function W(){const t=i.width/r,n=i.height/r,e=t/2,c=n/2,d=Math.max(t,n)*.8,f=o.createRadialGradient(e,c,d*(1-y),e,c,d);f.addColorStop(0,"rgba(0, 0, 0, 0)"),f.addColorStop(1,`rgba(0, 0, 0, ${x})`),o.fillStyle=f,o.fillRect(0,0,t,n)}function b(){I=2,a=0,l=0,g=0,S=0,s=[],s[0]=`>>> ACCESSING RECORDS...
`,s[1]=`>>> RECORD FOUND - DISPLAYING DATA
`,s[2]=`
`;let t=[],n=V.split(`
`);for(let e=0;e<n.length;e++)if(n[e].length*20+20>i.width){const d=Math.floor(i.width/20);let f=0;for(let E=0;E<n[e].length;E++)if(n[e][E]===" ")f=E;else if(E>=d)break;if(f!==0){const E=n[e].substring(f+1);n[e]=n[e].substring(0,f)+`
`,n=[...n.slice(0,e+1),E,...n.slice(e+1)]}}if(window.innerWidth<1024)t=u.split(`
`),t=t.concat([`
`,`
`]),t=t.concat(n);else{t=u.split(`
`);const e=Math.max(...s.map(c=>c.length));t=t.map((c,d)=>n[d]?`${c}${" ".repeat(e-c.length+20)}${n[d]}`:c)}s=s.concat(t)}function v(){o.fillStyle=`rgba(0, 255, 0, ${M})`,o.fillRect(0,A,i.width/r,p),A+=R,A>i.height/r&&(A=0)}function L(t){o.clearRect(0,0,i.width,i.height),G(t),v(),W(),requestAnimationFrame(L)}requestAnimationFrame(L)};async function H(){await document.fonts.load('1rem "VT323"')}i&&o&&H().then(F);
