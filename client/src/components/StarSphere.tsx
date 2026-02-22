import React, { useEffect, useRef } from 'react';

export default function StarSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: {x: number, y: number, z: number, size: number, color: string}[] = [];
    const particleCount = 2000;
    const sphereRadius = Math.min(width, height) * 0.4;
    
    const colors = ['#10b981', '#34d399', '#059669', '#6ee7b7'];

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const r = sphereRadius * (0.95 + Math.random() * 0.1);

      particles.push({
        x: r * Math.cos(theta) * Math.sin(phi),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(phi),
        size: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let rotationX = 0;
    let rotationY = 0;
    let animationFrameId: number;

    interface Connection {
      i: number;
      j: number;
      birth: number;
      duration: number;
    }

    let activeConnections: Connection[] = [];
    const connectionInterval = 10000;
    const connectionDuration = 3000;
    const connectionFraction = 0.05;
    let lastConnectionTime = performance.now() - connectionInterval + 2000;

    const spawnConnections = (now: number, projected: {x: number; y: number; z: number; idx: number}[]) => {
      const count = Math.floor(particleCount * connectionFraction * 0.5);
      const newConns: Connection[] = [];
      const maxDist = sphereRadius * 0.35;

      for (let c = 0; c < count; c++) {
        const i = Math.floor(Math.random() * projected.length);
        const pi = projected[i];
        let bestJ = -1;
        let bestDist = maxDist;

        for (let attempt = 0; attempt < 20; attempt++) {
          const j = Math.floor(Math.random() * projected.length);
          if (j === i) continue;
          const pj = projected[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < bestDist) {
            bestDist = dist;
            bestJ = j;
          }
        }

        if (bestJ >= 0) {
          newConns.push({
            i: pi.idx,
            j: projected[bestJ].idx,
            birth: now,
            duration: connectionDuration * (0.7 + Math.random() * 0.6)
          });
        }
      }

      activeConnections = activeConnections.concat(newConns);
    };

    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;

      rotationY += 0.002;
      rotationX += 0.001;

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);

      const projected = particles.map((p, idx) => {
        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.y * sinX + p.z * cosX;
        const x2 = p.x * cosY + z1 * sinY;
        const z2 = -p.x * sinY + z1 * cosY;

        return { x: x2, y: y1, z: z2, size: p.size, color: p.color, idx };
      });

      projected.sort((a, b) => a.z - b.z);

      const idxToScreen = new Map<number, {sx: number; sy: number; alpha: number}>();

      projected.forEach(p => {
        const scale = (sphereRadius * 2) / (sphereRadius * 2 - p.z);
        if (scale < 0.2) return;

        const sx = centerX + p.x * scale;
        const sy = centerY + p.y * scale;
        const s = p.size * scale;
        const alpha = Math.max(0.1, Math.min(1, (p.z + sphereRadius) / (sphereRadius * 1.5)));

        idxToScreen.set(p.idx, { sx, sy, alpha });

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, s, 0, Math.PI * 2);
        ctx.fill();
      });

      if (now - lastConnectionTime >= connectionInterval) {
        lastConnectionTime = now;
        spawnConnections(now, projected);
      }

      activeConnections = activeConnections.filter(c => now - c.birth < c.duration);

      if (activeConnections.length > 0) {
        for (const conn of activeConnections) {
          const a = idxToScreen.get(conn.i);
          const b = idxToScreen.get(conn.j);
          if (!a || !b) continue;

          const age = now - conn.birth;
          const t = age / conn.duration;
          let lineAlpha: number;
          if (t < 0.2) {
            lineAlpha = t / 0.2;
          } else if (t > 0.7) {
            lineAlpha = (1 - t) / 0.3;
          } else {
            lineAlpha = 1;
          }
          lineAlpha *= 0.25 * Math.min(a.alpha, b.alpha);

          ctx.globalAlpha = lineAlpha;
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
}
