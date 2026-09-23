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
  let current = 0;
  setInterval(() => {
    frames[current].classList.remove('is-active');
    current = (current + 1) % frames.length;
    frames[current].classList.add('is-active');
    if(urlEl) urlEl.textContent = urls[current];
  }, 4200);
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
