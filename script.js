/* ============================================================
   SCRIPT.JS — SORRY PAGE
   ============================================================ */

/* ─── MUSIC ─────────────────────────────────────────────────── */
const bgMusic   = document.getElementById("bgMusic");
const musicBtn  = document.getElementById("musicBtn");
let   musicStarted = false;

function startMusic() {
  if (musicStarted) return;
  bgMusic.volume = 0;
  bgMusic.play().then(() => {
    musicStarted = true;
    musicBtn.classList.add("playing");
    musicBtn.classList.remove("muted");
    // Fade in volume gently
    let vol = 0;
    const fadeIn = setInterval(() => {
      vol = Math.min(vol + 0.04, 0.55);
      bgMusic.volume = vol;
      if (vol >= 0.55) clearInterval(fadeIn);
    }, 120);
  }).catch(() => {
    // Autoplay blocked — just update UI so user can tap button
    musicBtn.classList.remove("playing");
  });
}

function toggleMusic() {
  if (!musicStarted) {
    startMusic();
    return;
  }
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.classList.add("playing");
    musicBtn.classList.remove("muted");
  } else {
    bgMusic.pause();
    musicBtn.classList.remove("playing");
    musicBtn.classList.add("muted");
  }
}

/* ─── PASSWORD ─────────────────────────────────────────────── */
const PASSWORD = "142006";

function checkPassword() {
  const val = document.getElementById("pwdInput").value.trim();
  const err = document.getElementById("pwdError");
  if (val === PASSWORD) {
    err.textContent = "";
    startMusic();   // ← start music on user interaction (button click)
    unlockPage();
  } else {
    err.textContent = "💔 Wrong code, babuu! Try again…";
    document.getElementById("pwdInput").value = "";
    document.getElementById("pwdInput").focus();
  }
}

document.getElementById("pwdInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkPassword();
});

function unlockPage() {
  const ps = document.getElementById("passwordScreen");
  const ms = document.getElementById("mainScreen");
  ps.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  ps.style.opacity = "0";
  ps.style.transform = "scale(1.04)";
  setTimeout(() => {
    ps.classList.remove("active");
    ps.style.display = "none";
    ms.classList.add("active");
    ms.style.display = "block";
    ms.style.opacity = "0";
    ms.style.transition = "opacity 0.8s ease";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { ms.style.opacity = "1"; });
    });
    startPetalRain();
    buildGallery();
  }, 800);
}

/* ─── STAR CANVAS ───────────────────────────────────────────── */
(function initStars() {
  const canvas = document.getElementById("starCanvas");
  const ctx = canvas.getContext("2d");
  let stars = [];
  const COUNT = 320;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.2,
        alpha: Math.random(),
        delta: (Math.random() * 0.012 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
        color: starColor(),
        shootingTimer: Math.random() * 600
      });
    }
  }

  function starColor() {
    const palette = [
      "255,255,255",
      "255,200,220",
      "220,180,255",
      "255,230,140",
      "180,220,255"
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  let shootingStars = [];

  function maybeShoot() {
    if (Math.random() < 0.007) {
      shootingStars.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        len: Math.random() * 120 + 60,
        speed: Math.random() * 8 + 6,
        alpha: 1,
        angle: Math.PI / 6 + Math.random() * 0.3
      });
    }
  }

  function drawShootingStars() {
    shootingStars = shootingStars.filter(s => s.alpha > 0);
    shootingStars.forEach(s => {
      ctx.save();
      ctx.globalAlpha = s.alpha;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.len * Math.cos(s.angle), s.y + s.len * Math.sin(s.angle));
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(1, "rgba(255,230,180,1)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + s.len * Math.cos(s.angle), s.y + s.len * Math.sin(s.angle));
      ctx.stroke();
      ctx.restore();
      s.x += s.speed * Math.cos(s.angle);
      s.y += s.speed * Math.sin(s.angle);
      s.alpha -= 0.018;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.alpha += s.delta;
      if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color},${s.alpha})`;
      ctx.shadowBlur = s.r > 1.2 ? 8 : 0;
      ctx.shadowColor = `rgba(${s.color},0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    maybeShoot();
    drawShootingStars();
    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();
  window.addEventListener("resize", () => { resize(); createStars(); });
})();

/* ─── FLOATING HEARTS BG ────────────────────────────────────── */
(function initHearts() {
  const container = document.getElementById("heartsBg");
  const emojis = ["💕", "💖", "💗", "💓", "🌸", "✨", "💞", "🌹", "🥀"];
  function spawnHeart() {
    const el = document.createElement("div");
    el.className = "heart-particle";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = Math.random() * 14 + 12 + "px";
    el.style.opacity = "0";
    const dur = Math.random() * 12 + 10;
    el.style.animationDuration = dur + "s";
    el.style.animationDelay = Math.random() * 4 + "s";
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 4) * 1000);
  }
  // Initial batch
  for (let i = 0; i < 18; i++) setTimeout(spawnHeart, i * 600);
  setInterval(spawnHeart, 1200);
})();

/* ─── PETAL RAIN (main screen) ──────────────────────────────── */
function startPetalRain() {
  const container = document.getElementById("petalRain");
  const petals = ["🌸", "🌺", "🌷", "🥀", "💮", "🌼"];
  function spawnPetal() {
    const el = document.createElement("div");
    el.className = "petal";
    el.textContent = petals[Math.floor(Math.random() * petals.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = Math.random() * 16 + 12 + "px";
    const dur = Math.random() * 8 + 7;
    el.style.animationDuration = dur + "s";
    el.style.animationDelay = Math.random() * 3 + "s";
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 3) * 1000);
  }
  for (let i = 0; i < 22; i++) setTimeout(spawnPetal, i * 400);
  setInterval(spawnPetal, 900);
}

/* ─── GALLERY ───────────────────────────────────────────────── */
// Our beautiful memories together 💕
const photos = [
  "photos/memory1.jpg",
  "photos/memory2.jpg",
  "photos/memory3.jpg",
  "photos/memory4.jpg",
  "photos/memory5.jpg",
];

// Romantic captions for each photo
const captions = [
  "My favourite person in the whole world 💕",
  "Every moment with you is magic ✨",
  "You are my everything, my babuu 🌙",
  "Stolen kisses & stolen hearts 🥺💖",
  "My world, my smile, my life 🌹",
];

function buildGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;
  grid.innerHTML = ""; // clear placeholders
  console.log("Building gallery with", photos.length, "photos");

  photos.forEach((src, i) => {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.overflow = "hidden";
    wrapper.style.borderRadius = "20px";

    const img = document.createElement("img");
    img.src = src;
    img.alt = captions[i] || "Our memory";
    img.className = "gallery-photo";
    img.loading = "lazy";

    const caption = document.createElement("div");
    caption.style.cssText = `
      position: absolute; bottom: 0; left: 0; right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      color: #fff; text-align: center; padding: 20px 10px 14px;
      font-family: 'Dancing Script', cursive; font-size: 1.1rem;
      transform: translateY(100%); transition: transform 0.3s ease;
    `;
    caption.textContent = captions[i] || "";

    wrapper.addEventListener("mouseenter", () => { caption.style.transform = "translateY(0)"; });
    wrapper.addEventListener("mouseleave", () => { caption.style.transform = "translateY(100%)"; });

    img.addEventListener("click", () => openLightbox(src));

    wrapper.appendChild(img);
    wrapper.appendChild(caption);
    grid.appendChild(wrapper);
  });
}

/* ─── LIGHTBOX ──────────────────────────────────────────────── */
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = `<span class="lightbox-close" id="lbClose">✕</span><img id="lbImg" src="" alt="photo"/>`;
document.body.appendChild(lightbox);
document.getElementById("lbClose").onclick = () => lightbox.classList.remove("open");
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });

function openLightbox(src) {
  document.getElementById("lbImg").src = src;
  lightbox.classList.add("open");
}

/* ─── FORGIVE BUTTON ────────────────────────────────────────── */
function onForgive() {
  const overlay = document.getElementById("forgiveOverlay");
  overlay.classList.add("show");
  launchHeartBurst();
}

function launchHeartBurst() {
  const container = document.getElementById("forgiveHearts");
  const hearts = ["💖", "💕", "💗", "💓", "🌸", "✨", "🥰", "💞", "🌹", "💝", "💘", "🌺"];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const el = document.createElement("span");
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      el.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        font-size: ${Math.random() * 20 + 14}px;
        animation: floatHeart ${Math.random() * 5 + 4}s linear forwards;
        pointer-events: none;
        z-index: 99999;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 9000);
    }, i * 80);
  }
}

/* ─── INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ───────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = "1";
      e.target.style.transform = "translateY(0) translateX(0)";
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.sorry-card, .love-item, .letter-card').forEach(el => {
  el.style.opacity = "0";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

/* ─── PRE-BUILD GALLERY ON LOAD ─────────────────────────────── */
// Build gallery immediately so it's ready when the screen is revealed
document.addEventListener("DOMContentLoaded", () => {
  buildGallery();
});
