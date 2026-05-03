/* ============================================================
   ✨ SPACE ENGINE - Օպտիմալացված Աստղային Տիեզերք
   ============================================================ */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Աստղերի ստեղծում՝ ավելացրել ենք 'z' շերտ՝ խորության համար
const STAR_COUNT = 250;
const stars = [];

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 2, // Խորության շերտ (0-ից 2)
    r: Math.random() * 1.5 + 0.5, // Շառավիղ
    speed: Math.random() * 0.4 + 0.1, // Շարժման արագություն
    opacity: Math.random() * 0.8 + 0.2,
  });
}

// Մկնիկի հետապնդում (Mouse Parallax)
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener("mousemove", (e) => {
  // Հաշվում ենք մկնիկի դիրքը կենտրոնից (-1-ից 1 միջակայքում)
  targetX = (e.clientX / w - 0.5) * 40;
  targetY = (e.clientY / h - 0.5) * 40;
});

function drawStars() {
  // Մեղմացնում ենք մկնիկի շարժումը (Smoothing)
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;

  stars.forEach((s) => {
    // Աստղերի դանդաղ շարժում դեպի ներքև
    s.y += s.speed;
    if (s.y > h) {
      s.y = -10;
      s.x = Math.random() * w;
    }

    // Պարալաքս էֆեկտ՝ կախված 'z' խորությունից
    const px = s.x + mouseX * s.z;
    const py = s.y + mouseY * s.z;

    ctx.beginPath();
    ctx.arc(px, py, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
    ctx.fill();

    // Ավելացնում ենք թեթև շողք հեռավոր աստղերին
    if (s.z > 1.5) {
      ctx.shadowBlur = 5;
      ctx.shadowColor = "white";
    } else {
      ctx.shadowBlur = 0;
    }
  });
}

/* ✨ NEBULA EFFECT - Գալակտիկայի շողք ✨ */
let glow = 0;
let glowDir = 1;

function drawNebula() {
  glow += 0.005 * glowDir;
  if (glow > 1 || glow < 0) glowDir *= -1;

  const grad = ctx.createRadialGradient(
    w * 0.5 + mouseX,
    h * 0.5 + mouseY,
    100,
    w * 0.5,
    h * 0.5,
    w * 0.8,
  );

  grad.addColorStop(0, `rgba(96, 165, 250, ${0.05 + glow * 0.02})`);
  grad.addColorStop(0.5, `rgba(167, 139, 250, ${0.03})`);
  grad.addColorStop(1, "transparent");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  drawNebula();
  drawStars();
  requestAnimationFrame(animate);
}

animate();

/* ============================================================
   🚀 INTERSECTION OBSERVER - Քարտերի սահուն հայտնվելը
   ============================================================ */

const cards = document.querySelectorAll(".card, .event, .video-box");

const appearanceOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const appearanceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      appearanceObserver.unobserve(entry.target); // Մեկ անգամ աշխատելու համար
    }
  });
}, appearanceOptions);

cards.forEach((card) => {
  // Նախնական վիճակ՝ սկրիպտի միջոցով (որպեսզի եթե JS-ը չաշխատի, կայքը դատարկ չմնա)
  card.style.opacity = "0";
  card.style.transform = "translateY(40px)";
  card.style.transition = "all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
  appearanceObserver.observe(card);
});
