/* ═══════════════════════════════════════════════════════════
   Projects pages — shared interactions + grid rendering
════════════════════════════════════════════════════════════ */
'use strict';
const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];
const lerp=(a,b,t)=>a+(b-a)*t, rand=(a,b)=>Math.random()*(b-a)+a;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* cursor */
(()=>{const c=qs('#cursor'),t=qs('#cursor-trail');if(!c||!t)return;
  if(!window.matchMedia('(pointer: fine)').matches){c.style.display='none';t.style.display='none';return}
  let mx=-100,my=-100,tx=-100,ty=-100;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;c.style.left=mx+'px';c.style.top=my+'px'});
  document.addEventListener('mouseleave',()=>{c.style.opacity='0';t.style.opacity='0'});
  document.addEventListener('mouseenter',()=>{c.style.opacity='1';t.style.opacity='1'});
  (function loop(){tx=lerp(tx,mx,.12);ty=lerp(ty,my,.12);t.style.left=tx+'px';t.style.top=ty+'px';requestAnimationFrame(loop)})();
})();

/* progress + nav + back-to-top */
(()=>{const bar=qs('#scroll-progress'),nav=qs('#topnav'),btt=qs('#backToTop');
  window.addEventListener('scroll',()=>{
    const sc=window.scrollY,total=document.documentElement.scrollHeight-window.innerHeight;
    if(bar)bar.style.width=(total>0?sc/total*100:0)+'%';
    if(nav)nav.classList.toggle('scrolled',sc>40);
    if(btt)btt.classList.toggle('visible',sc>700);
  },{passive:true});
  if(btt)btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
})();

/* mobile menu */
(()=>{const t=qs('#navToggle'),m=qs('#navMenu');if(!t||!m)return;
  t.addEventListener('click',()=>{const open=m.classList.toggle('open');t.classList.toggle('open',open);t.setAttribute('aria-expanded',open)});
  qsa('a',m).forEach(a=>a.addEventListener('click',()=>{m.classList.remove('open');t.classList.remove('open');t.setAttribute('aria-expanded','false')}));
})();

/* reveal */
(()=>{const els=qsa('.reveal-up');if(!els.length)return;
  const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>ob.observe(el));
  setTimeout(()=>els.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.95)el.classList.add('visible')}),250);
})();

/* particle canvas */
(()=>{const cv=qs('#bgCanvas');if(!cv)return;const ctx=cv.getContext('2d');let W,H,pts=[];
  function resize(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;
    const n=Math.min(58,Math.floor(W/26));
    pts=Array.from({length:n},()=>({x:rand(0,W),y:rand(0,H),vx:rand(-.25,.25),vy:rand(-.25,.25),r:rand(.5,1.7)}));
  }
  const col=getComputedStyle(document.documentElement).getPropertyValue('--acc-rgb').trim()||'34,211,238';
  function draw(){ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba('+col+',.5)';ctx.fill()});
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;
      if(d<130*130){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle='rgba('+col+','+(.1*(1-d/(130*130)))+')';ctx.lineWidth=.6;ctx.stroke()}
    }
    if(!reduced)requestAnimationFrame(draw);
  }
  resize();window.addEventListener('resize',resize,{passive:true});draw();
})();

/* counters */
(()=>{const cs=qsa('.count');if(!cs.length)return;
  const ob=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=+el.dataset.target,start=performance.now();ob.unobserve(el);
    (function step(now){const p=Math.min((now-start)/1500,1);el.textContent=Math.round((1-Math.pow(1-p,3))*target);if(p<1)requestAnimationFrame(step)})(start);
  }),{threshold:.5});
  cs.forEach(c=>ob.observe(c));
})();

const yEl=qs('#year'); if(yEl) yEl.textContent=new Date().getFullYear();

/* ── PROJECT GRID RENDERING ─────────────────────────────── */
(()=>{
  const grid=qs('#grid');
  const data=window.PROJECT_DATA;
  if(!grid||!data) return;

  const ICON=`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const ARR=`<svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

  // build category list
  const cats=[...new Set(data.map(d=>d.cat))].sort();
  const filterWrap=qs('#filters');
  let activeCat='All', query='';

  function buildFilters(){
    if(!filterWrap)return;
    const mk=(label,val)=>`<button class="chip-btn${val===activeCat?' active':''}" data-cat="${esc(val)}">${esc(label)}</button>`;
    filterWrap.innerHTML=mk('All','All')+cats.map(c=>mk(c,c)).join('');
    qsa('.chip-btn',filterWrap).forEach(b=>b.addEventListener('click',()=>{activeCat=b.dataset.cat;buildFilters();render();}));
  }

  function cardHTML(p,idx){
    const feat=p.featured?'<span class="featbadge">Featured</span>':`<span class="cat">${esc(p.cat)}</span>`;
    const link=p.url?`<a class="open-link" href="${esc(p.url)}">View project ${ARR}</a>`:'';
    const tags=(p.tags||[]).slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('');
    return `<article class="pcard${p.featured?' featured':''}" data-i="${idx}">
      <div class="pcard-top"><span class="picon">${ICON}</span>${feat}</div>
      <span class="pno">${p.no||''}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      <div class="tags">${tags}</div>
      ${link}
    </article>`;
  }

  function render(){
    const q=query.trim().toLowerCase();
    const filtered=data.filter(p=>{
      const okCat=activeCat==='All'||p.cat===activeCat;
      const hay=(p.title+' '+p.desc+' '+p.cat+' '+(p.tags||[]).join(' ')).toLowerCase();
      return okCat && (!q || hay.includes(q));
    });
    const countEl=qs('#count');
    if(countEl)countEl.textContent=filtered.length+' / '+data.length+' projects';
    if(!filtered.length){grid.innerHTML='<p class="no-results">No projects match your search. Try a different term or category.</p>';return;}
    grid.innerHTML=filtered.map(cardHTML).join('');
    // staggered reveal
    const cards=qsa('.pcard',grid);
    const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){
      const el=e.target;const i=[...cards].indexOf(el);
      setTimeout(()=>el.classList.add('in'),Math.min(i,12)*35);ob.unobserve(el);}}),{threshold:.05,rootMargin:'0px 0px -30px 0px'});
    cards.forEach(c=>ob.observe(c));
    setTimeout(()=>cards.forEach(c=>{if(c.getBoundingClientRect().top<innerHeight)c.classList.add('in')}),60);
  }

  const searchEl=qs('#search');
  if(searchEl)searchEl.addEventListener('input',e=>{query=e.target.value;render();});

  buildFilters();
  render();
})();
