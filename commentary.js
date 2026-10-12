const Com={on:true,last:0,t:null,
 say(txt,pr){if(!this.on||!txt)return;const now=Date.now();if(!pr&&now-this.last<2800)return;this.last=now;
  const e=document.getElementById('cap');if(e){e.textContent=txt;clearTimeout(this.t);this.t=setTimeout(()=>{e.textContent=''},4500)}
  try{const ss=window.speechSynthesis;if(!ss||Sfx.vol<=0||!Sfx.on)return;if(pr)ss.cancel();else if(ss.speaking)return;
   const u=new SpeechSynthesisUtterance(txt);u.lang='de-DE';u.rate=pr?1.2:1.08;u.pitch=pr?1.25:1;u.volume=Math.min(1,Sfx.vol*1.4);
   const v=ss.getVoices().find(v=>/^de/i.test(v.lang));if(v)u.voice=v;ss.speak(u)}catch(e){}},
 stop(){try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}const e=document.getElementById('cap');if(e)e.textContent=''}};
