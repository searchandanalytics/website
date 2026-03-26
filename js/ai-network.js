/*
  AI Neural Network Background — Premium particle system
  - Responsive multi-layer particles
  - Mouse interaction (attraction field)
  - Respects prefers-reduced-motion
  - Performance-optimized with RAF
*/
(() => {
  const canvas = document.getElementById("ai-bg");
  if (!canvas) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d", { alpha: true });

  let w = 0, h = 0;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const nodeCount = reduced ? 30 : 80;
  const nodes = [];
  const maxLinkDist = 160;
  const speed = reduced ? 0.15 : 0.32;

  // Mouse tracking
  let mouse = { x: -9999, y: -9999 };
  const mouseInfluence = 200;

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  canvas.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  }, { passive: true });

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function init() {
    nodes.length = 0;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-speed, speed),
        vy: rand(-speed, speed),
        r: rand(1, 3),
        layer: Math.random() > 0.7 ? 2 : 1, // depth layers
        pulse: rand(0, Math.PI * 2) // phase for pulsing
      });
    }
  }

  let frame = 0;

  function tick() {
    ctx.clearRect(0, 0, w, h);
    frame++;

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxLinkDist) {
          const alpha = (1 - dist / maxLinkDist);

          // Gradient from cyan to violet
          const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          gradient.addColorStop(0, `rgba(0, 212, 255, ${alpha * 0.15})`);
          gradient.addColorStop(1, `rgba(124, 58, 237, ${alpha * 0.1})`);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = alpha * 1.2;
          ctx.stroke();
        }
      }
    }

    // Draw & move nodes
    for (const n of nodes) {
      // Mouse attraction
      const mdx = mouse.x - n.x;
      const mdy = mouse.y - n.y;
      const mDist = Math.hypot(mdx, mdy);

      if (mDist < mouseInfluence && mDist > 0) {
        const force = (1 - mDist / mouseInfluence) * 0.02;
        n.vx += mdx / mDist * force;
        n.vy += mdy / mDist * force;
      }

      // Damping
      n.vx *= 0.998;
      n.vy *= 0.998;

      // Clamp speed
      const maxSpeed = speed * 1.5;
      const currentSpeed = Math.hypot(n.vx, n.vy);
      if (currentSpeed > maxSpeed) {
        n.vx = (n.vx / currentSpeed) * maxSpeed;
        n.vy = (n.vy / currentSpeed) * maxSpeed;
      }

      n.x += n.vx;
      n.y += n.vy;

      // Wrap around
      if (n.x < -30) n.x = w + 30;
      if (n.x > w + 30) n.x = -30;
      if (n.y < -30) n.y = h + 30;
      if (n.y > h + 30) n.y = -30;

      // Pulse effect
      const pulse = 1 + Math.sin(frame * 0.015 + n.pulse) * 0.3;
      const radius = n.r * pulse;

      // Glow for layer 2 nodes (bigger, brighter)
      if (n.layer === 2) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, 0.03)`;
        ctx.fill();
      }

      // Node
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);

      if (n.layer === 2) {
        ctx.fillStyle = `rgba(0, 212, 255, 0.85)`;
        ctx.shadowColor = 'rgba(0, 212, 255, 0.4)';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = `rgba(124, 58, 237, 0.55)`;
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }

      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (!reduced) requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(() => { resize(); init(); });
  ro.observe(canvas);

  window.addEventListener("resize", () => { resize(); init(); }, { passive: true });

  resize(); init();

  if (!reduced) {
    tick();
  } else {
    // Draw one static frame for reduced-motion users
    tick();
  }
})();
