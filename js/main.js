const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// menu mobile
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if(toggle && links){
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    links.style.cssText = open
      ? 'display:flex; flex-direction:column; position:fixed; top:64px; left:0; right:0; background:#0b0e1c; padding:24px 28px; gap:20px; border-bottom:1px solid rgba(255,255,255,0.08);'
      : '';
  });
}

// hero HUD cycling (solo se presente in pagina)
const frames = document.querySelectorAll('.hud-frame');
const urlEl = document.getElementById('hud-url');
if(frames.length){
  const urls = Array.from(frames).map(f => f.dataset.url || '');
  const dotsWrap = document.querySelector('.hud-dots');
  const prevBtn = document.querySelector('.hud-arrow.prev');
  const nextBtn = document.querySelector('.hud-arrow.next');
  const stage = document.querySelector('.hud-stage');
  const DELAY = 4200;
  let current = 0;
  let timer = null;

  // pallini generati in automatico: se aggiungi un progetto, compare da solo
  const dots = Array.from(frames).map((frame, i) => {
    if(!dotsWrap) return null;
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Vai al progetto ' + (i + 1));
    if(i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(index){
    frames[current].classList.remove('is-active');
    if(dots[current]) dots[current].classList.remove('is-active');
    current = (index + frames.length) % frames.length;
    frames[current].classList.add('is-active');
    if(dots[current]) dots[current].classList.add('is-active');
    if(urlEl) urlEl.textContent = urls[current];
  }
  function start(){ if(!timer) timer = setInterval(() => goTo(current + 1), DELAY); }
  function stop(){ clearInterval(timer); timer = null; }
  function restart(){ stop(); start(); }

  if(prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); restart(); });
  if(nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); restart(); });

  // swipe con il dito su telefono
  if(stage){
    let startX = null;
    stage.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
    stage.addEventListener('touchend', e => {
      if(startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx) > 40){ goTo(current + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    }, {passive:true});
    // pausa quando il mouse è sopra, così si può guardare con calma
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', start);
  }

  // si ferma quando la scheda non è visibile, riparte quando torni
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  start();
}

// starfield
(function starfield(){
  const canvas = document.getElementById('starfield');
  if(!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({length: count}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.15 + 0.03,
      twinkle: Math.random() * Math.PI * 2
    }));
  }
  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.y += s.speed;
      s.twinkle += 0.02;
      if(s.y > canvas.height) s.y = 0;
      const alpha = 0.35 + Math.sin(s.twinkle) * 0.35;
      ctx.fillStyle = `rgba(230,236,255,${Math.max(alpha,0.08)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// cursore glow
(function cursorGlow(){
  const glow = document.getElementById('cursor-glow');
  if(!glow || reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
  window.addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
  });
})();

// barra di progresso scroll
(function scrollProgress(){
  const bar = document.getElementById('scroll-progress');
  if(!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  });
})();

// bottoni magnetici
if(!reduceMotion){
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// scroll reveal
const revealEls = document.querySelectorAll('.reveal-up');
if(revealEls.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

// filtro categorie progetti
const tabs = document.querySelectorAll('.category-tab');
const cards = document.querySelectorAll('.project-card[data-category]');
if(tabs.length && cards.length){
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'tutti' || card.dataset.category === filter;
        card.style.display = show ? 'flex' : 'none';
      });
    });
  });
}

// anno corrente nel footer
const yearEl = document.getElementById('footer-year');
if(yearEl) yearEl.textContent = new Date().getFullYear();
