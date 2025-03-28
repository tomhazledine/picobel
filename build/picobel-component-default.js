var Q=Object.defineProperty;var X=(e,t)=>{for(var r in t)Q(e,r,{get:t[r],enumerable:!0})};var L=`.default.picobel{--black: #555;--black--light: hsl(0, 0%, 43.3%);--black--opacity: rgba(0, 0, 0, .3);--white: #ffffff;--grey: #dad8d2;--greyDark: hsl(30, 10%, 65%);--primary: #ddd;--primary--opacity: rgba(221, 221, 221, .4);--highlight: #00b7c6;--background_grey_dark: #e6e6e6;--background_grey_light: #f1f1f1;--focus: #015ecc;--progress-bar-height: 20px}@keyframes default_background_slide{0%{background-position:0 0}to{background-position:20px 0}}.default.picobel{font-size:10px;position:relative;box-sizing:border-box;z-index:1;margin:10px 0;height:60px;border-radius:3px;box-shadow:var(--black--opacity) 0 1px 2px 0;background-image:linear-gradient(var(--background_grey_light),var(--background_grey_dark))}.default.picobel *,.default.picobel *:before,.default.picobel *:after{box-sizing:inherit}.default.picobel *:focus{outline:2px solid var(--focus);outline-offset:1px;border-radius:2px}.default__loader{position:absolute;z-index:2;bottom:0;left:56px;right:0;height:var(--progress-bar-height);opacity:0;transition:opacity .2s;pointer-events:none;background:linear-gradient(to right,var(--highlight) 50%,var(--black) 50%);background-size:var(--progress-bar-height) var(--progress-bar-height);background-repeat:repeat;background-position:0 0;animation:default_background_slide linear infinite .4s}.default.loading .default__loader{opacity:1}.default__play-pause{font-size:10px;border:none;appearance:none;width:40px;height:60px;color:var(--white);background:var(--black);background-image:linear-gradient(var(--black--light),var(--black));box-shadow:inset var(--black--light) -1px 0 0 0;position:absolute;top:0;left:0;cursor:pointer}.default__play-pause:focus{z-index:3}.default__play-pause__text{display:none}.default__play-pause:before{content:"";display:block;position:absolute;top:50%;left:50%;margin-top:-8px;margin-left:-4px;border-top:8px solid transparent;border-left:10px solid var(--white);border-bottom:8px solid transparent}.default__play-pause:after{content:"";display:block;position:absolute;top:50%;right:50%;height:14px;margin-top:-7px;margin-right:-7px;border-top:0;border-left:5px solid var(--white);border-bottom:0;opacity:0}.default__play-pause.playing:before{height:14px;margin-top:-7px;margin-left:-7px;border-top:0;border-left:5px solid var(--white);border-bottom:0}.default__play-pause.playing:after{opacity:1}.default__wrapper--title-artist{padding:10px 20px 10px 70px;height:44px;background:var(--primary);color:var(--black);text-shadow:var(--white) 0 1px 0;background-image:linear-gradient(var(--background_grey_light),var(--background_grey_dark))}.default__title{display:inline-block;line-height:1;font-weight:700;font-family:monospace}.default__artist{font-family:monospace;display:inline-block;line-height:1;margin-left:5px}.default__artist:not(:empty):before{content:" \\2013  "}.default__wrapper--timer-progress-duration{position:absolute;bottom:0;left:56px;right:0;height:var(--progress-bar-height)}.default__timer,.default__duration{position:absolute;top:0;z-index:3;width:60px;text-align:left;background:transparent;color:var(--white);line-height:10px;height:var(--progress-bar-height);pointer-events:none;font-size:10px;padding:5px 5px 5px 10px;font-family:monospace}.default__timer{left:0}.default__duration{right:0;text-align:right}.default.loading .default__timer,.default.loading .default__duration{display:none}.default__progress-slider__wrapper{height:var(--progress-bar-height);position:absolute;top:0;left:0;width:100%}.default__progress-slider__replacement{height:100%;position:absolute;top:0;left:0;width:100%;background:var(--black);border-bottom-right-radius:2px;overflow:hidden}.default__progress-slider__replacement.focus{outline:2px solid var(--focus);outline-offset:1px;border-radius:2px}.default__progress-slider__indicator{height:var(--progress-bar-height);position:absolute;top:0;left:0;background:var(--primary--opacity);width:0%}.default__progress-slider__playhead{width:5px;height:var(--progress-bar-height);position:absolute;top:0;left:0%;margin-left:-2px;background:var(--highlight)}.default.loading .default__progress-slider__indicator,.default.loading .default__progress-slider__playhead{display:none}.default__progress-slider__range{width:100%;height:var(--progress-bar-height);font-size:inherit;padding:0;margin:0;position:absolute;top:0;left:0;opacity:0}.default__progress-slider__range::-webkit-slider-runnable-track{width:100%;font-size:10px;height:20px;cursor:pointer}.default__progress-slider__range::-moz-range-track{width:100%;height:20px;cursor:pointer}.default__progress-slider__range::-ms-track{width:100%;height:20px;cursor:pointer}.default__wrapper--mute-volume{position:absolute;top:0;left:40px;width:16px;height:60px;z-index:2}.default__mute{display:block;width:16px;height:16px;font-size:0;color:transparent;border:0;appearance:none;background:var(--black);position:absolute;top:0;right:0;cursor:pointer;overflow:hidden}.default__mute:before{display:block;width:4px;height:3px;position:absolute;content:"";top:50%;right:50%;margin-right:-1px;transform:translateY(-50%);background:var(--white)}.default__mute:after{display:block;width:4px;max-width:100%;height:4px;position:absolute;content:"";top:50%;margin-top:-4px;right:50%;margin-right:-2px;border-top:4px solid transparent;border-right:4px solid var(--white);border-bottom:4px solid transparent}.default__mute.muted:before{background:var(--grey)}.default__mute.muted:after{border-right-color:var(--grey)}.default__volume-label{display:none}.default__volume-slider__wrapper{display:block;height:16px;position:absolute;top:16px;left:0;z-index:3;width:44px;transform:rotate(90deg) translateY(-100%);transform-origin:top left}.default__volume-slider__replacement{display:block;height:16px;position:absolute;top:0;left:0;background:var(--greyDark);width:44px}.default__volume-slider__replacement:after{content:"";display:block;width:100%;border-right:44px solid var(--black);border-bottom:16px solid transparent;position:absolute;bottom:0;left:0;pointer-events:none}.default__volume-slider__replacement.focus{outline:2px solid var(--focus);outline-offset:1px;border-radius:2px}.default__volume-slider__indicator{height:16px;position:absolute;top:0;right:0;background:var(--highlight);width:100%;transform:rotate(180deg)}.default__volume-slider__playhead{display:none}.default__volume-slider__range{width:100%;padding:0;margin:0;height:16px;position:absolute;top:0;left:0;opacity:0;transform:rotate(180deg)}.default__volume-slider__range::-webkit-slider-runnable-track{width:100%;font-size:10px;height:15px;cursor:pointer}.default__volume-slider__range::-moz-range-track{width:100%;height:15px;cursor:pointer}.default__volume-slider__range::-ms-track{width:100%;height:15px;cursor:pointer}
`;var ee=(e="default")=>{switch(e){case"itunes":return["playPause",[["title","artist"],["timer","progress","duration"]]];case"default":default:return["playPause",["mute","volume"],["title","artist"],["timer","progress","duration"]]}},E=(e={})=>{let t={context:document,theme:"default",preload:!1},{components:r,...i}=e,o=ee(e.theme),a={...t,components:o,...i};return r&&Array.isArray(r)&&(a.components=r),a};var g=e=>{let t=Math.floor(e/3600),r=Math.floor(e%3600/60).toFixed(0).toString(),i=Math.floor(e%3600%60).toFixed(0).toString().padStart(2,"0"),o=`${r}:${i}`;return t>0&&(o=`${t}:${r.padStart(2,"0")}:${i}`),o},A=e=>e.replace(/^.*[\\/]/,"").split(".")[1],T=e=>e.replace(/^.*[\\/]/,"").split(".")[0];var $=e=>[...e.getElementsByTagName("audio")].map((i,o)=>Object.assign(i,{key:o})),C=(e,t,r)=>[...`picobel loading picobel--index-${e} ${t}`.trim().split(" "),r],P=e=>e.map((t,r)=>(t.key=r,t.mute=!1,t.tmpVolume=1,t)),M=e=>{let t=e.currentSrc,r=A(t),i=T(t),o=e.title&&e.title!==""?e.title:`${i}.${r}`,a=e.dataset?.artist?e.dataset.artist:!1;return{url:t,fileType:r,fileName:i,title:o,artist:a}};var f={};X(f,{artist:()=>oe,duration:()=>se,mute:()=>ne,playPause:()=>te,progress:()=>ae,timer:()=>ie,title:()=>re,volume:()=>le});var h=({namespace:e="picobel",min:t=0,max:r=100,value:i=0,step:o=!1,index:a=0,label:l="slider"})=>{let n=s("div",e),u=s("div",`${e}-slider__wrapper`),c=s("div",`${e}-slider__replacement`),K=s("div",`${e}-slider__background`);c.appendChild(K);let Y=s("div",`${e}-slider__indicator`);c.appendChild(Y);let J=s("div",`${e}-slider__playhead`);c.appendChild(J),u.appendChild(c);let w=`${e}-slider__range--${a}`,p=s("input",`${e}-slider__range`);p.setAttribute("id",w),p.setAttribute("type","range"),p.setAttribute("min",t.toString()),p.setAttribute("max",r.toString()),p.setAttribute("value",i.toString()),o&&p.setAttribute("step",o.toString()),u.appendChild(p);let m=s("label",`${e}-label`);return typeof l=="string"?m.innerHTML=l:m.appendChild(l),m.setAttribute("for",w),n.appendChild(m),n.appendChild(u),n};var te=e=>{let t=s("button",`${e}__play-pause`);t.setAttribute("type","button");let r=s("span",`${e}__play-pause__text`);return r.innerHTML="Play",t.appendChild(r),t},re=(e,t)=>{let r=s("span",`${e}__title`);return r.innerHTML="File "+(t+1),r},oe=e=>s("span",`${e}__artist`),ie=e=>{let t=s("span",`${e}__timer`);return t.innerHTML="0:00",t},se=e=>{let t=s("span",`${e}__duration`);return t.innerHTML="-:--",t},ae=(e,t)=>{let r=s("span",`${e}__progress-label-inner`);return r.innerHTML="Progress",h({namespace:`${e}__progress`,min:0,max:100,value:0,index:t,label:r})},ne=e=>{let t=s("button",`${e}__mute`);return t.setAttribute("type","button"),t.innerHTML="Mute",t},le=(e,t)=>{let r=s("span",`${e}__volume-label-inner`),i=s("span",`${e}__volume-label-key`);i.innerHTML="Volume ",r.appendChild(i);let o=s("span",`${e}__volume-label-value`);return o.innerHTML="10",r.appendChild(o),h({namespace:`${e}__volume`,min:0,max:1,value:1,step:.1,index:t,label:r})};var s=(e="div",t="")=>{let r=document.createElement(e);return r.className=t,r},b=({key:e,container:t,components:r,namespace:i})=>(r.forEach(o=>{if(typeof o=="string"&&f[o]){let a=f[o](i,e);t.appendChild(a);return}if(Array.isArray(o)&&o.length){let a=o.flat().join("-"),l=s("div",`${i}__wrapper--${a}`),n=b({key:e,container:l,components:o,namespace:i});t.appendChild(n)}}),t);var S=e=>{let t=g(e.duration);return e.elements.durationDisplay&&(e.elements.durationDisplay.innerHTML=t),e},H=(e,t)=>(e.artist&&t.artistDisplay&&(t.artistDisplay.innerHTML=e.artist),t.titleDisplay&&(t.titleDisplay.innerHTML=e.title),t),N=(e,t,r)=>e.map(o=>{let a=s("div"),l=C(o.key,o.className,r);a.classList.add(...l),a.setAttribute("data-picobel-index",o.key.toString());let n=s("div",`${r}__loader`);return a.appendChild(n),b({key:o.key,container:a,components:t,namespace:r})}),B=(e,t,r)=>e.map(i=>{let o=t.querySelector(`[data-picobel-index='${i.key}']`);return i.elements={wrapper:o,playPauseButton:o.querySelector(`.${r}__play-pause`),playPauseButtonText:o.querySelector(`.${r}__play-pause__text`),muteButton:o.querySelector(`.${r}__mute`),playTimer:o.querySelector(`.${r}__timer`),durationDisplay:o.querySelector(`.${r}__duration`),titleDisplay:o.querySelector(`.${r}__title`),artistDisplay:o.querySelector(`.${r}__artist`),progressWrapper:o.querySelector(`.${r}__progress-slider__replacement`),progressRange:o.querySelector(`.${r}__progress-slider__range`),progressPlayhead:o.querySelector(`.${r}__progress-slider__playhead`),progressBackground:o.querySelector(`.${r}__progress-slider__background`),progressIndicator:o.querySelector(`.${r}__progress-slider__indicator`),volumeWrapper:o.querySelector(`.${r}__volume-slider__replacement`),volumeControl:o.querySelector(`.${r}__volume-slider__range`),volumeDisplay:o.querySelector(`.${r}__volume-label-value`),volumeIndicator:o.querySelector(`.${r}__volume-slider__indicator`),volumePlayhead:o.querySelector(`.${r}__volume-slider__playhead`)},i});var pe=e=>e.forEach(t=>{D(t)}),F=(e,t)=>{e.paused||e.currentTime===0?(pe(t),ue(e)):D(e)},ue=e=>{e.play();let t=e.elements.playPauseButton,r=e.elements.playPauseButtonText;t.classList.remove("paused"),r.innerHTML="Pause",t.classList.add("playing")},D=e=>{e.pause();let t=e.elements.playPauseButton,r=e.elements.playPauseButtonText;t.classList.remove("playing"),r.innerHTML="Play",t.classList.add("paused")},de=e=>{e.pause();let t=e.elements.playPauseButton,r=e.elements.playPauseButtonText;t.classList.remove("playing"),r.innerHTML="Play"},q=e=>z(e.srcElement),z=e=>{let t=e.currentTime,r=e.duration;if(e.elements.playTimer){let o=g(t);e.elements.playTimer.innerHTML=o}t>=r&&de(e);let i=(t/r*100).toFixed(2);e.elements.progressRange&&(e.elements.progressRange.value=i,e.elements.progressIndicator.style.width=i+"%",e.elements.progressPlayhead.style.left=i+"%")},O=e=>{S(e),d(e)},d=e=>{e.elements.wrapper.classList.remove("loading");let t=M(e);H(t,e.elements)},R=e=>{e.elements.wrapper.classList.add("error"),e.elements.wrapper.classList.remove("loading"),e.elements.wrapper.innerHTML='<div class="error" style="display:flex;height: 100%;align-items:  center;justify-content: center;"><span class="error__icon"></span><span class="error__message">Error loading audio file</span></div>'},G=(e,t)=>{let o=(t.duration*(e.srcElement.value/100)).toFixed(2);t.currentTime=o,z(t)},y=(e,t)=>e.elements.progressWrapper.classList.toggle("focus",t),I=(e,t)=>{let r=e.srcElement.value;t.tmpVolume=t.volume,t.mute=!1,U(t),_(t,r)},x=(e,t)=>e.elements.volumeWrapper.classList.toggle("focus",t),_=(e,t)=>{let r=t*10,i=(t*100).toFixed(2);e.volume=t,e.elements.volumeDisplay&&(e.elements.volumeDisplay.innerHTML=r),e.elements.volumeControl&&(e.elements.volumeControl.value=t),e.elements.volumeIndicator&&(e.elements.volumeIndicator.style.width=i+"%"),e.elements.volumePlayhead&&(e.elements.volumePlayhead.style.left=i+"%")},V=e=>{e.mute=!e.mute,U(e)},U=e=>{let t=e.elements.muteButton;e.mute?(e.tmpVolume=e.volume,_(e,0),t.classList.add("muted"),t.classList.remove("unmuted"),t.innerHTML="Unmute"):(typeof e.tmpVolume<"u"&&e.tmpVolume>0?_(e,e.tmpVolume):_(e,1),t.classList.remove("muted"),t.classList.add("unmuted"),t.innerHTML="Mute")},ce=(e,t)=>{let r=e.duration,i=(t/r*100).toFixed(2);e.elements.progressBackground&&(e.elements.progressBackground.style.width=i+"%")},v=e=>{if(e.buffered.length>0){let t=e.buffered.end(e.buffered.length-1),r=e.duration;ce(e,t),t>=r&&e.removeEventListener("progress",()=>v(e))}};var W=e=>e.map(t=>(t.addEventListener("progress",()=>v(t),!1),t.addEventListener("timeupdate",q,!1),t.addEventListener("canplaythrough",()=>O(t),!1),t.addEventListener("loadedmetadata",()=>d(t),!1),t.addEventListener("error",()=>R(t),!1),t.elements?.playPauseButton&&t.elements?.playPauseButton.addEventListener("click",()=>F(t,e),!1),t.elements?.progressRange&&t.elements?.progressRange.addEventListener("input",r=>G(r,t),!1),t.elements?.progressRange&&t.elements?.progressRange.addEventListener("focus",()=>y(t,!0),!1),t.elements?.progressRange&&t.elements?.progressRange.addEventListener("blur",()=>y(t,!1),!1),t.elements?.volumeControl&&t.elements?.volumeControl.addEventListener("input",r=>I(r,t),!1),t.elements?.volumeControl&&t.elements?.volumeControl.addEventListener("focus",()=>x(t,!0),!1),t.elements?.volumeControl&&t.elements?.volumeControl.addEventListener("blur",()=>x(t,!1),!1),t.elements?.muteButton&&t.elements?.muteButton.addEventListener("click",()=>V(t),!1),t));var j=(e={})=>{let t=E(e),r={audioNodes:[],theme:t.theme,components:t.components},i=(a,l)=>{a.map((n,u)=>{n.parentNode.replaceChild(l[u],n)})};r.audioNodes=$(t.context),r.audioNodes=P(r.audioNodes);let o=N(r.audioNodes,r.components,r.theme);return i(r.audioNodes,o),r.audioNodes=B(r.audioNodes,t.context,r.theme),r.audioNodes=W(r.audioNodes),r.audioNodes.forEach(a=>{a.readyState>=1&&d(a)}),{state:r}};var k=class extends HTMLElement{constructor(){super()}mountStyles(t="default"){let r=`picobel-styles-${t}`;if(!document.getElementById(r)){let i=document.createElement("style");i.id=r,i.textContent=L,document.head.appendChild(i)}}connectedCallback(){let t=this.getAttribute("data-theme")||"default",r={theme:t,context:this},i=this.getAttribute("data-components");i&&(r.components=JSON.parse(i)),j(r),this.mountStyles(t)}};typeof window<"u"&&"customElements"in window&&window.customElements.define("picobel-player-default",k);
