/* ═══════════════════════════════════════════
   ESTRELLA — For You  |  main.js
═══════════════════════════════════════════ */

/* ══════════════════════════════
   LOGIN
══════════════════════════════ */
(function () {
  // Scatter decorative stars on login screen
  const bg = document.querySelector('.login-star-bg');
  if (bg) {
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('div');
      s.className = 'login-star';
      const size = Math.random() * 2.5 + 0.8;
      s.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        --dur:${(Math.random()*3+2).toFixed(1)}s;
        --delay:${(Math.random()*3).toFixed(1)}s;
        opacity:${Math.random()*0.5+0.1};
      `;
      bg.appendChild(s);
    }
  }

  const input = document.getElementById('login-input');
  const btn   = document.getElementById('login-btn');
  const err   = document.getElementById('login-error');
  const screen = document.getElementById('login-screen');

  function attempt() {
    const val = (input.value || '').trim().toLowerCase();
    const accepted = ['estrella','eniola','fifehanmi','arike','fatiah'];
    if (accepted.includes(val)) {
      screen.classList.add('fade-out');
      setTimeout(() => screen.classList.add('hidden'), 950);
    } else {
      input.classList.add('error');
      err.classList.add('show');
      setTimeout(() => input.classList.remove('error'), 450);
      input.value = '';
      input.focus();
    }
  }

  if (btn)   btn.addEventListener('click', attempt);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
})();


/* ══════════════════════════════
   STAR BACKGROUND
══════════════════════════════ */
const starCanvas = document.getElementById('star-canvas');
const sCtx = starCanvas.getContext('2d');
let stars = [];

function resizeStars() {
  starCanvas.width  = window.innerWidth;
  starCanvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < 220; i++) {
    stars.push({
      x: Math.random() * starCanvas.width,
      y: Math.random() * starCanvas.height,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.008 + 0.003,
      offset: Math.random() * Math.PI * 2
    });
  }
}

function drawStars(t) {
  sCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach(s => {
    const a = s.alpha * (0.7 + 0.3 * Math.sin(t * s.speed + s.offset));
    sCtx.beginPath();
    sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sCtx.fillStyle = `rgba(200,212,232,${a})`;
    sCtx.fill();
  });
  requestAnimationFrame(drawStars);
}

resizeStars(); initStars(); requestAnimationFrame(drawStars);
window.addEventListener('resize', () => { resizeStars(); initStars(); });


/* ══════════════════════════════
   SCROLL NAV DOTS
══════════════════════════════ */
const sections = document.querySelectorAll('section');
const dots     = document.querySelectorAll('.nav-dot');

function scrollToSection(i) {
  sections[i].scrollIntoView({ behavior: 'smooth' });
}
window.scrollTo = scrollToSection;

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const idx = [...sections].indexOf(e.target);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  });
}, { threshold: 0.4 }).observe
  ? (() => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = [...sections].indexOf(e.target);
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));
          }
        });
      }, { threshold: 0.4 });
      sections.forEach(s => obs.observe(s));
    })()
  : null;


/* ══════════════════════════════
   SCROLL REVEAL
══════════════════════════════ */
new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 })
  .observe
  ? (() => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.15 });
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    })()
  : null;


/* ══════════════════════════════
   MEMORY POPUP
══════════════════════════════ */
function openMemory({ title, text }) {
  document.getElementById('popup-title').textContent = title;
  document.getElementById('popup-text').textContent  = text;
  document.getElementById('memory-popup').classList.add('open');
}
function closeMemory() {
  document.getElementById('memory-popup').classList.remove('open');
}
window.openMemory  = openMemory;
window.closeMemory = closeMemory;


/* ══════════════════════════════
   CONSTELLATION
══════════════════════════════ */

// ✏️ Customize your memories here
const memories = [
  { name: "The Day We Met",  text: "Some days change everything. That day changed me." },
  { name: "First Laugh",     text: "The first time you laughed at something I said, I knew I was in trouble." },
  { name: "The Beach",       text: "We sang Heavens together by the water. I will never forget that." },
  { name: "Your Faith",      text: "Watching you carry your faith so quietly reminded me that grace is real." },
  { name: "Your Strength",   text: "You carry mountains without making a sound. I see you." },
  { name: "Her Smile",       text: "The smile that rewrites the whole sky." },
  { name: "Best Part",       text: "You are the best part. Of everything." },
  { name: "My Star",         text: "I always find my way by looking at you." },
];

const cCanvas = document.getElementById('constellation-canvas');
const cCtx    = cCanvas.getContext('2d');
let cStars    = [];

function setupConstellation() {
  cCanvas.width  = cCanvas.offsetWidth;
  cCanvas.height = cCanvas.offsetHeight;
  const W = cCanvas.width, H = cCanvas.height;
  cStars = memories.map((m, i) => {
    const angle  = (i / memories.length) * Math.PI * 2 - Math.PI / 2;
    const R      = Math.min(W, H) * 0.36;
    const jitter = (Math.random() - 0.5) * R * 0.4;
    return {
      x: W / 2 + Math.cos(angle) * (R + jitter),
      y: H / 2 + Math.sin(angle) * (R * 0.7 + jitter * 0.5),
      r: Math.random() * 2.5 + 3,
      memory: m,
      hovered: false
    };
  });
}

function drawConstellation(t) {
  cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
  cCtx.strokeStyle = 'rgba(200,212,232,0.12)';
  cCtx.lineWidth   = 0.8;
  cCtx.setLineDash([4, 6]);
  for (let i = 0; i < cStars.length; i++) {
    const a = cStars[i], b = cStars[(i + 1) % cStars.length];
    cCtx.beginPath(); cCtx.moveTo(a.x, a.y); cCtx.lineTo(b.x, b.y); cCtx.stroke();
  }
  cCtx.setLineDash([]);
  cStars.forEach(s => {
    const pulse = 0.85 + 0.15 * Math.sin(t * 0.001 + s.x);
    cCtx.beginPath();
    cCtx.arc(s.x, s.y, s.r * (s.hovered ? 1.8 : 1) * pulse, 0, Math.PI * 2);
    const grad = cCtx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.5);
    grad.addColorStop(0, s.hovered ? 'rgba(201,169,110,0.9)' : 'rgba(232,240,255,0.9)');
    grad.addColorStop(1, 'rgba(200,212,232,0)');
    cCtx.fillStyle = grad; cCtx.fill();
    if (s.hovered) {
      cCtx.font      = '12px Lato, sans-serif';
      cCtx.fillStyle = 'rgba(201,169,110,0.9)';
      cCtx.textAlign = 'center';
      cCtx.fillText(s.memory.name, s.x, s.y - s.r - 10);
    }
  });
  requestAnimationFrame(drawConstellation);
}

cCanvas.addEventListener('mousemove', e => {
  const rect = cCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  cStars.forEach(s => { s.hovered = Math.hypot(mx - s.x, my - s.y) < 20; });
});
cCanvas.addEventListener('click', e => {
  const rect = cCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  cStars.forEach(s => {
    if (Math.hypot(mx - s.x, my - s.y) < 22) openMemory({ title: s.memory.name, text: s.memory.text });
  });
});
cCanvas.addEventListener('touchstart', e => {
  const rect  = cCanvas.getBoundingClientRect();
  const touch = e.touches[0];
  const mx = touch.clientX - rect.left, my = touch.clientY - rect.top;
  cStars.forEach(s => {
    if (Math.hypot(mx - s.x, my - s.y) < 28) openMemory({ title: s.memory.name, text: s.memory.text });
  });
}, { passive: true });

setupConstellation();
requestAnimationFrame(drawConstellation);
window.addEventListener('resize', setupConstellation);


/* ══════════════════════════════
   CONFETTI — FINALE
══════════════════════════════ */
const confCanvas = document.getElementById('confetti-canvas');
const confCtx    = confCanvas.getContext('2d');
let particles    = [];
let confettiRunning = false;

function launchConfetti() {
  confCanvas.width  = confCanvas.offsetWidth;
  confCanvas.height = confCanvas.offsetHeight;
  particles = [];
  const colors = ['#c8d4e8','#e8f0ff','#c9a96e','#d4b483','#8899bb'];
  for (let i = 0; i < 90; i++) {
    particles.push({
      x: Math.random() * confCanvas.width, y: -20,
      vx: (Math.random() - 0.5) * 2, vy: Math.random() * 3 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 5 + 3,
      rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.1
    });
  }
  if (!confettiRunning) animateConfetti();
}

function drawStarShape(ctx, x, y, r, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function animateConfetti() {
  confettiRunning = true;
  confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.rot += p.rotSpeed;
    confCtx.fillStyle = p.color;
    drawStarShape(confCtx, p.x, p.y, p.size, p.rot);
  });
  particles = particles.filter(p => p.y < confCanvas.height + 20);
  if (particles.length > 0) requestAnimationFrame(animateConfetti);
  else confettiRunning = false;
}

new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) launchConfetti(); });
}, { threshold: 0.3 })
  .observe(document.getElementById('s8'));


/* ══════════════════════════════
   NAV DOTS SETUP (clean version)
══════════════════════════════ */
(() => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = [...sections].indexOf(e.target);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));

  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
})();