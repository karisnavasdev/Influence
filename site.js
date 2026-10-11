(function () {
  const canvas = document.getElementById("field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  let w = 0;
  let h = 0;
  let dpr = 1;
  let mx = 0;
  let my = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    mx = event.clientX / w - 0.5;
    my = event.clientY / h - 0.5;
  });

  const cols = 78;
  const rows = 42;

  function frame(time) {
    ctx.fillStyle = "#050604";
    ctx.fillRect(0, 0, w, h);
    const t = time * 0.00032;
    const originX = w * (0.48 + mx * 0.04);
    const originY = h * (0.06 + my * 0.03);

    for (let row = 0; row <= rows; row++) {
      const v = row / rows;
      const depth = v * v;
      for (let col = 0; col <= cols; col++) {
        const u = col / cols;
        const spread = 0.28 + depth * 1.25;
        const xNorm = (u - 0.5) * 2;
        const wave =
          Math.sin(xNorm * 2.1 + t * 1.4 + v * 4) * (0.04 + depth * 0.16) +
          Math.cos(v * 9 - t) * 0.03 * depth;
        const bow = xNorm * xNorm * (0.08 + depth * 0.34);
        const px = originX + xNorm * w * 0.78 * spread;
        const py = originY + h * (v * 1.02 - bow * 0.55 - wave);
        const size = 1.15 + depth * 6.2;
        const alpha = 0.08 + depth * 0.82;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#ccff00";
        ctx.fillRect(px - size / 2, py, size, size);
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) frame(0);
  else requestAnimationFrame(frame);
})();

document.addEventListener("click", (event) => {
  document.querySelectorAll("details.menu[open]").forEach((menu) => {
    if (!menu.contains(event.target)) menu.removeAttribute("open");
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy") || "0xa6b4be1f75af4f09c8d25a46a322109036a6da9b";
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch (error) {
      const input = document.createElement("textarea");
      input.value = value;
      document.body.appendChild(input);
      input.select();
      ok = document.execCommand("copy");
      input.remove();
    }
    const previous = button.textContent;
    button.textContent = ok ? "Copied" : "Copy";
    button.classList.add("copied");
    window.setTimeout(() => {
      button.textContent = previous;
      button.classList.remove("copied");
    }, 1400);
  });
});
