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
    
    // Support high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: {x: number, y: number, z: number, size: number, color: string}[] = [];
    const particleCount = 2000;
    const sphereRadius = Math.min(width, height) * 0.4;
    
    // Teal/Greenish colors for the particles to match the semantic green
    const colors = ['#10b981', '#34d399', '#059669', '#6ee7b7'];

    for (let i = 0; i < particleCount; i++) {
      // Golden ratio spiral for even distribution
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      // Add a bit of noise to the radius so it's not a perfect shell
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

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;

      // Slow rotation
      rotationY += 0.002;
      rotationX += 0.001;

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);

      // Sort particles by Z so closer ones are drawn last (and larger)
      const projected = particles.map(p => {
        // Rotate around X
        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.y * sinX + p.z * cosX;

        // Rotate around Y
        const x2 = p.x * cosY + z1 * sinY;
        const z2 = -p.x * sinY + z1 * cosY;

        return {
          x: x2,
          y: y1,
          z: z2,
          size: p.size,
          color: p.color
        };
      });

      projected.sort((a, b) => a.z - b.z);

      projected.forEach(p => {
        // Perspective projection
        const scale = (sphereRadius * 2) / (sphereRadius * 2 - p.z);
        
        // Don't draw if too far behind
        if (scale < 0.2) return;

        const x = centerX + p.x * scale;
        const y = centerY + p.y * scale;
        
        // Size changes with perspective
        const s = p.size * scale;
        
        // Alpha changes with perspective (fade in back)
        const alpha = Math.max(0.1, Math.min(1, (p.z + sphereRadius) / (sphereRadius * 1.5)));

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
      });

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