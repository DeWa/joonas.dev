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
`,D=`                   @%@@%%%%#%                     
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
`,i=document.getElementById("typingCanvas"),o=i.getContext("2d"),r=window.devicePixelRatio;if(i&&o){let u=function(){T=document.createElement("canvas"),T.width=i.width,T.height=i.height,L=T.getContext("2d"),L.scale(r,r)},I=function(t,n,e){o.shadowColor="#00ff00",o.shadowBlur=10,o.shadowOffsetX=0,o.shadowOffsetY=0,o.globalAlpha=v,o.fillText(t,n,e),o.shadowBlur=0,o.globalAlpha=1,o.fillText(t,n,e)},p=function(t){S||(S=t);const n=t-S;o.fillStyle="#00ff00",a<l.length&&(g<l[a].length?n>x&&(g+=10,S=t):n>P&&(a++,s++,g=0,S=t)),s*O>i.height/r-10&&s<=l.length&&(h=h.map((e,c)=>h[c+1]?h[c+1]:""),s--);for(let e=0;e<s;e++)I(h[e],20,13+e*O);s<l.length?(h[s]=l[a],typeof h[s]=="string"&&I(h[s].substring(0,g+1),20,13+s*O)):C===1&&a===l.length&&R()},w=function(){const t=i.width/r,n=i.height/r,e=t/2,c=n/2,E=Math.max(t,n)*.8,f=o.createRadialGradient(e,c,E*(1-b),e,c,E);f.addColorStop(0,"rgba(0, 0, 0, 0)"),f.addColorStop(1,`rgba(0, 0, 0, ${W})`),o.fillStyle=f,o.fillRect(0,0,t,n)},R=function(){C=2,a=0,s=0,g=0,S=0,l=[],l[0]=`>>> ACCESSING RECORDS...
`,l[1]=`>>> RECORD FOUND - DISPLAYING DATA
`,l[2]=`
`;let t=[],n=V.split(`
`);for(let e=0;e<n.length;e++)if(n[e].length*20+20>i.width){const E=Math.floor(i.width/20);let f=0;for(let d=0;d<n[e].length;d++)if(n[e][d]===" ")f=d;else if(d>=E)break;if(f!==0){const d=n[e].substring(f+1);n[e]=n[e].substring(0,f)+`
`,n=[...n.slice(0,e+1),d,...n.slice(e+1)]}}if(window.innerWidth<1024)t=D.split(`
`),t=t.concat([`
`,`
`]),t=t.concat(n);else{t=D.split(`
`);const e=Math.max(...l.map(c=>c.length));t=t.map((c,E)=>n[E]?`${c}${" ".repeat(e-c.length+20)}${n[E]}`:c)}l=l.concat(t)},m=function(){o.fillStyle=`rgba(0, 255, 0, ${G})`,o.fillRect(0,A,i.width/r,y),A+=B,A>i.height/r&&(A=0)},N=function(t){o.clearRect(0,0,i.width,i.height),p(t),m(),w(),requestAnimationFrame(N)};i.width=i.offsetWidth*r,i.height=i.offsetHeight*r,i.style.width=i.offsetWidth+"px",i.style.height=i.offsetHeight+"px",o.scale(r,r),i.style.cursor="pointer";const M=window.innerWidth<1024?16:20;o.font=`${M}px "VT323", monospace`,o.fillStyle="#00ff00";let C=1,l=U.split(`
`),h=[],a=0,s=0,g=0,S=0;const O=15,x=0,P=0;let A=0;const y=2,B=2,G=.1,W=5.7,b=.5,v=.5;let T,L;i.addEventListener("click",()=>{if(a<l.length){const t=l.length-a;t>5?Array.from({length:5}).forEach(()=>{a++,s++,h[s]=l[a]}):Array.from({length:t}).forEach(()=>{a++,s++,h[s]=l[a]})}}),u(),requestAnimationFrame(N)}
