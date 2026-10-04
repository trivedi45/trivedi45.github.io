document.querySelectorAll('[data-copy]').forEach(b=>{
  b.addEventListener('click',()=>{
    const label=b.textContent, done=()=>{b.textContent='Copied';setTimeout(()=>b.textContent=label,1500)};
    const fallback=()=>{const s=document.querySelector('.email code');const r=document.createRange();r.selectNodeContents(s);const g=getSelection();g.removeAllRanges();g.addRange(r);b.textContent='Press Ctrl+C'};
    if(navigator.clipboard){navigator.clipboard.writeText(b.dataset.copy).then(done).catch(fallback)}else fallback();
  });
});

// Neural-network style background in the hero
(function(){
  const c=document.getElementById('net'), ctx=c.getContext('2d');
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W,H,pts=[],dpr=Math.min(devicePixelRatio||1,2);
  function size(){
    const r=c.getBoundingClientRect(); W=r.width; H=r.height;
    c.width=W*dpr; c.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.round(Math.min(70,Math.max(24,W*H/14000)));
    pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3}));
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const max=130;
    for(let i=0;i<pts.length;i++){
      const a=pts[i];
      for(let j=i+1;j<pts.length;j++){
        const b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
        if(d<max){ctx.strokeStyle=`rgba(126,162,255,${(1-d/max)*.28})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
      }
    }
    for(const p of pts){ctx.fillStyle='rgba(126,162,255,.6)';ctx.beginPath();ctx.arc(p.x,p.y,1.8,0,Math.PI*2);ctx.fill()}
  }
  function step(){
    for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
    draw(); if(!document.hidden) requestAnimationFrame(step);
  }
  size(); draw();
  addEventListener('resize',()=>{size();draw()});
  if(!still){requestAnimationFrame(step);document.addEventListener('visibilitychange',()=>{if(!document.hidden)requestAnimationFrame(step)})}
})();
