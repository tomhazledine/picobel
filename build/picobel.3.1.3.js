"use strict";(()=>{var Q=Object.defineProperty;var X=(e,t)=>{for(var r in t)Q(e,r,{get:t[r],enumerable:!0})};var Y=(e="default")=>{switch(e){case"itunes":return["playPause",[["title","artist"],["timer","progress","duration"]]];case"default":default:return["playPause",["mute","volume"],["title","artist"],["timer","progress","duration"]]}},T=(e={})=>{let t={context:document,theme:"default",preload:!1},{components:r,...o}=e,s=Y(e.theme),l={...t,components:s,...o};return r&&Array.isArray(r)&&(l.components=r),l};var g=e=>{let t=Math.floor(e/3600),r=Math.floor(e%3600/60).toFixed(0).toString().padStart(2,"0"),o=Math.floor(e%3600%60).toFixed(0).toString().padStart(2,"0"),s=`${r}:${o}`;return t>0&&(s=`${t}:${r}:${o}`),s},E=e=>e.substr((~-e.lastIndexOf(".")>>>0)+2),A=e=>e.replace(/^.*[\\/]/,"").split(".")[0];var f={};X(f,{artist:()=>te,duration:()=>se,mute:()=>ne,playPause:()=>Z,progress:()=>oe,timer:()=>re,title:()=>ee,volume:()=>le});var b=({namespace:e="picobel",min:t=0,max:r=100,value:o=0,step:s=!1,index:l=0,label:i="slider"})=>{let a=n("div",e),p=n("div",`${e}-slider__wrapper`),m=n("div",`${e}-slider__replacement`),J=n("div",`${e}-slider__background`);m.appendChild(J);let z=n("div",`${e}-slider__indicator`);m.appendChild(z);let K=n("div",`${e}-slider__playhead`);m.appendChild(K),p.appendChild(m);let L=`${e}-slider__range--${l}`,u=n("input",`${e}-slider__range`);u.setAttribute("id",L),u.setAttribute("type","range"),u.setAttribute("min",t.toString()),u.setAttribute("max",r.toString()),u.setAttribute("value",o.toString()),s&&u.setAttribute("step",s.toString()),p.appendChild(u);let d=n("label",`${e}-label`);return typeof i=="string"?d.innerHTML=i:d.appendChild(i),d.setAttribute("for",L),a.appendChild(d),a.appendChild(p),a};var Z=e=>{let t=n("button",`${e}__play-pause`);t.setAttribute("type","button");let r=n("span",`${e}__play-pause__text`);return r.innerHTML="Play",t.appendChild(r),t},ee=(e,t)=>{let r=n("span",`${e}__title`);return r.innerHTML="File "+(t+1),r},te=e=>n("span",`${e}__artist`),re=e=>{let t=n("span",`${e}__timer`);return t.innerHTML="0:00",t},se=e=>{let t=n("span",`${e}__duration`);return t.innerHTML="-:--",t},oe=(e,t)=>{let r=n("span",`${e}__progress-label-inner`);return r.innerHTML="Progress",b({namespace:`${e}__progress`,min:0,max:100,value:0,index:t,label:r})},ne=e=>{let t=n("button",`${e}__mute`);return t.setAttribute("type","button"),t.innerHTML="Mute",t},le=(e,t)=>{let r=n("span",`${e}__volume-label-inner`),o=n("span",`${e}__volume-label-key`);o.innerHTML="Volume ",r.appendChild(o);let s=n("span",`${e}__volume-label-value`);return s.innerHTML="10",r.appendChild(s),b({namespace:`${e}__volume`,min:0,max:1,value:1,step:.1,index:t,label:r})};var n=(e="div",t="")=>{let r=document.createElement(e);return r.className=t,r},v=({key:e,container:t,components:r,namespace:o})=>(r.forEach(s=>{if(typeof s=="string"&&f[s]){let l=f[s](o,e);t.appendChild(l);return}if(Array.isArray(s)&&s.length){let l=s.flat().join("-"),i=n("div",`${o}__wrapper--${l}`),a=v({key:e,container:i,components:s,namespace:o});t.appendChild(a)}}),t);var $=e=>{let t=g(e.duration);return e.elements.durationDisplay&&(e.elements.durationDisplay.innerHTML=t),e},P=(e,t)=>(e.artist&&t.artistDisplay&&(t.artistDisplay.innerHTML=e.artist),t.titleDisplay&&(t.titleDisplay.innerHTML=e.title),t),C=(e,t,r)=>e.map(s=>{let l=n("div"),i=M(s.key,s.className,r);l.classList.add(...i),l.setAttribute("data-picobel-index",s.key.toString());let a=n("div",`${r}__loader`);return l.appendChild(a),v({key:s.key,container:l,components:t,namespace:r})}),S=(e,t,r)=>e.map(o=>{let s=t.querySelector(`[data-picobel-index='${o.key}']`);return o.elements={wrapper:s,playPauseButton:s.querySelector(`.${r}__play-pause`),playPauseButtonText:s.querySelector(`.${r}__play-pause__text`),muteButton:s.querySelector(`.${r}__mute`),playTimer:s.querySelector(`.${r}__timer`),durationDisplay:s.querySelector(`.${r}__duration`),titleDisplay:s.querySelector(`.${r}__title`),artistDisplay:s.querySelector(`.${r}__artist`),progressWrapper:s.querySelector(`.${r}__progress-slider__replacement`),progressRange:s.querySelector(`.${r}__progress-slider__range`),progressPlayhead:s.querySelector(`.${r}__progress-slider__playhead`),progressBackground:s.querySelector(`.${r}__progress-slider__background`),progressIndicator:s.querySelector(`.${r}__progress-slider__indicator`),volumeWrapper:s.querySelector(`.${r}__volume-slider__replacement`),volumeControl:s.querySelector(`.${r}__volume-slider__range`),volumeDisplay:s.querySelector(`.${r}__volume-label-value`),volumeIndicator:s.querySelector(`.${r}__volume-slider__indicator`),volumePlayhead:s.querySelector(`.${r}__volume-slider__playhead`)},o});var ie=e=>e.forEach(t=>{H(t)}),k=(e,t)=>{e.paused||e.currentTime===0?(ie(t),ae(e)):H(e)},ae=e=>{e.play();let t=e.elements.playPauseButton,r=e.elements.playPauseButtonText;t.classList.remove("paused"),r.innerHTML="Pause",t.classList.add("playing")},H=e=>{e.pause();let t=e.elements.playPauseButton,r=e.elements.playPauseButtonText;t.classList.remove("playing"),r.innerHTML="Play",t.classList.add("paused")},ue=e=>{e.pause();let t=e.elements.playPauseButton,r=e.elements.playPauseButtonText;t.classList.remove("playing"),r.innerHTML="Play"},w=e=>N(e.srcElement),N=e=>{let t=e.currentTime,r=e.duration;if(e.elements.playTimer){let s=g(t);e.elements.playTimer.innerHTML=s}t>=r&&ue(e);let o=(t/r*100).toFixed(2);e.elements.progressRange&&(e.elements.progressRange.value=o,e.elements.progressIndicator.style.width=o+"%",e.elements.progressPlayhead.style.left=o+"%")},B=e=>{$(e),c(e)},c=e=>{e.elements.wrapper.classList.remove("loading");let t=O(e);P(t,e.elements)},_=e=>{e.elements.wrapper.classList.add("error"),e.elements.wrapper.classList.remove("loading"),e.elements.wrapper.innerHTML='<div class="error" style="display:flex;height: 100%;align-items:  center;justify-content: center;"><span class="error__icon"></span><span class="error__message">Error loading audio file</span></div>'},F=(e,t)=>{let s=(t.duration*(e.srcElement.value/100)).toFixed(2);t.currentTime=s,N(t)},x=(e,t)=>e.elements.progressWrapper.classList.toggle("focus",t),q=(e,t)=>{let r=e.srcElement.value;t.tmpVolume=t.volume,t.mute=!1,I(t),y(t,r)},h=(e,t)=>e.elements.volumeWrapper.classList.toggle("focus",t),y=(e,t)=>{let r=t*10,o=(t*100).toFixed(2);e.volume=t,e.elements.volumeDisplay&&(e.elements.volumeDisplay.innerHTML=r),e.elements.volumeControl&&(e.elements.volumeControl.value=t),e.elements.volumeIndicator&&(e.elements.volumeIndicator.style.width=o+"%"),e.elements.volumePlayhead&&(e.elements.volumePlayhead.style.left=o+"%")},D=e=>{e.mute=!e.mute,I(e)},I=e=>{let t=e.elements.muteButton;e.mute?(e.tmpVolume=e.volume,y(e,0),t.classList.add("muted"),t.classList.remove("unmuted"),t.innerHTML="Unmute"):(typeof e.tmpVolume<"u"&&e.tmpVolume>0?y(e,e.tmpVolume):y(e,1),t.classList.remove("muted"),t.classList.add("unmuted"),t.innerHTML="Mute")},R=(e,t)=>{let r=e.duration,o=(t/r*100).toFixed(2);e.elements.progressBackground&&(e.elements.progressBackground.style.width=o+"%")};var G=e=>[...e.getElementsByTagName("audio")].map((r,o)=>({...r,key:o})),M=(e,t,r)=>[...`picobel loading picobel--index-${e} ${t}`.trim().split(" "),r],V=e=>e.map((t,r)=>(t.key=r,t.mute=!1,t.tmpVolume=1,t)),O=e=>{let t=e.currentSrc,r=E(t),o=A(t),s=e.title&&e.title!==""?e.title:`${o}.${r}`,l=e.dataset?.artist?e.dataset.artist:!1;return{url:t,fileType:r,fileName:o,title:s,artist:l}};var U=async(e,t)=>{let o=0,s=15,l=()=>{if(o++,e.buffered.length>0){let i=e.buffered.end(e.buffered.length-1),a=e.duration;R(e,i),i>=a&&clearInterval(t[e.currentSrc])}o>=s&&(e.buffered.length<=0&&e.readyState<=0&&_(e),clearInterval(t[e.currentSrc]))};t[e.currentSrc]=setInterval(l,1e3),window.addEventListener("unload",()=>clearInterval(t[e.currentSrc]))};var W=e=>e.map(t=>(t.addEventListener("timeupdate",w,!1),t.addEventListener("canplaythrough",()=>B(t),!1),t.addEventListener("loadedmetadata",()=>c(t),!1),t.addEventListener("error",()=>_(t),!1),t.elements?.playPauseButton&&t.elements?.playPauseButton.addEventListener("click",()=>k(t,e),!1),t.elements?.progressRange&&t.elements?.progressRange.addEventListener("input",r=>F(r,t),!1),t.elements?.progressRange&&t.elements?.progressRange.addEventListener("focus",()=>x(t,!0),!1),t.elements?.progressRange&&t.elements?.progressRange.addEventListener("blur",()=>x(t,!1),!1),t.elements?.volumeControl&&t.elements?.volumeControl.addEventListener("input",r=>q(r,t),!1),t.elements?.volumeControl&&t.elements?.volumeControl.addEventListener("focus",()=>h(t,!0),!1),t.elements?.volumeControl&&t.elements?.volumeControl.addEventListener("blur",()=>h(t,!1),!1),t.elements?.muteButton&&t.elements?.muteButton.addEventListener("click",()=>D(t),!1),t));var j=(e={})=>{let t=T(e),r={audioNodes:[],theme:t.theme,components:t.components},o=(i,a)=>{i.map((p,m)=>{p.parentNode.replaceChild(a[m],p)})};r.audioNodes=G(t.context),r.audioNodes=V(r.audioNodes);let s=C(r.audioNodes,r.components,r.theme);o(r.audioNodes,s),r.audioNodes=S(r.audioNodes,t.context,r.theme),r.audioNodes=W(r.audioNodes);let l={};return r.audioNodes.forEach(i=>{i.readyState>=1&&c(i),U(i,l)}),{state:r}};window.picobel=j;})();
