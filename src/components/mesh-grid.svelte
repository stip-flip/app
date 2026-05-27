<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  const gridSize = 44;
  const sampleStep = 12;

  onMount(() => {
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let width = 0;
    let height = 0;
    let frame = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new MutationObserver(() => draw(performance.now()));

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    }

    function themeIsDark() {
      return document.documentElement.dataset.theme === "dark";
    }

    function pressurePoint(time: number) {
      if (reducedMotion) {
        return { x: width * 0.62, y: height * 0.42 };
      }

      const t = time * 0.00008;
      return {
        x: width * (0.5 + Math.sin(t * 1.7) * 0.32 + Math.sin(t * 3.1) * 0.08),
        y: height * (0.5 + Math.cos(t * 1.35) * 0.28 + Math.sin(t * 2.2) * 0.07),
      };
    }

    function warpPoint(x: number, y: number, pressure: { x: number; y: number }) {
      const dx = x - pressure.x;
      const dy = y - pressure.y;
      const distance = Math.hypot(dx, dy);
      const radius = Math.min(180, Math.max(120, Math.min(width, height) * 0.22));

      if (distance >= radius || distance === 0) {
        return { x, y };
      }

      const normalized = 1 - distance / radius;
      const falloff = normalized * normalized * (3 - 2 * normalized);
      const push = falloff * 26;
      const pull = Math.sin(normalized * Math.PI) * 9;

      return {
        x: x + (dx / distance) * push,
        y: y + (dy / distance) * push + pull,
      };
    }

    function drawPolyline(points: Array<{ x: number; y: number }>) {
      if (!points.length) {
        return;
      }

      context.beginPath();
      context.moveTo(points[0].x, points[0].y);

      for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const current = points[index];
        context.quadraticCurveTo(previous.x, previous.y, (previous.x + current.x) / 2, (previous.y + current.y) / 2);
      }

      const last = points[points.length - 1];
      context.lineTo(last.x, last.y);
      context.stroke();
    }

    function draw(time: number) {
      const dark = themeIsDark();
      const pressure = pressurePoint(time);

      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.strokeStyle = dark ? "rgba(255, 255, 255, 0.035)" : "rgba(36, 36, 36, 0.045)";

      for (let y = 0; y <= height + gridSize; y += gridSize) {
        const points = [];
        for (let x = 0; x <= width + sampleStep; x += sampleStep) {
          points.push(warpPoint(x, y, pressure));
        }
        drawPolyline(points);
      }

      context.strokeStyle = dark ? "rgba(255, 255, 255, 0.03)" : "rgba(36, 36, 36, 0.04)";

      for (let x = 0; x <= width + gridSize; x += gridSize) {
        const points = [];
        for (let y = 0; y <= height + sampleStep; y += sampleStep) {
          points.push(warpPoint(x, y, pressure));
        }
        drawPolyline(points);
      }

      if (!reducedMotion) {
        frame = requestAnimationFrame(draw);
      }
    }

    function updateMotionPreference() {
      reducedMotion = motionQuery.matches;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    }

    resize();
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    motionQuery.addEventListener("change", updateMotionPreference);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      motionQuery.removeEventListener("change", updateMotionPreference);
    };
  });
</script>

<canvas bind:this={canvas} class="mesh-grid-canvas" aria-hidden="true"></canvas>
