import React, { useRef, useEffect } from 'react';
import { ThemeId, PointerState } from '../types';

interface BackgroundCanvasProps {
  themeId: ThemeId;
}

interface Scene {
  init(w: number, h: number): void;
  update(ctx: CanvasRenderingContext2D, w: number, h: number, pointer: PointerState): void;
}

// Helper: Random range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// 1. India: Sunrise & Taj Mahal Silhouette with Morning Haze
class IndiaScene implements Scene {
  particles: Array<{ x: number; y: number; r: number; vy: number; vx: number; alpha: number }> = [];
  birds: Array<{ x: number; y: number; speed: number; offset: number }> = [];
  
  init(w: number, h: number) {
    this.particles = [];
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: random(0, w),
        y: random(0, h),
        r: random(1, 4),
        vy: random(-0.2, -0.8), // Float up
        vx: random(-0.2, 0.2),
        alpha: random(0.1, 0.5)
      });
    }
    
    this.birds = [];
    for (let i=0; i<6; i++) {
        this.birds.push({ 
          x: random(0, w), 
          y: random(h * 0.1, h * 0.4), 
          speed: random(0.8, 2), 
          offset: random(0, 100) 
        });
    }
  }

  update(ctx: CanvasRenderingContext2D, w: number, h: number, pointer: PointerState) {
    // 1. Sky Gradient (Vibrant Sunrise)
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#2e1042'); // Deep purple
    grad.addColorStop(0.3, '#7a2850'); // Magenta
    grad.addColorStop(0.6, '#ff6b35'); // Vibrant Orange
    grad.addColorStop(1, '#ffdf9e'); // Pale Gold
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Sun (Soft Glow)
    const sunY = h * 0.65;
    const sunGrad = ctx.createRadialGradient(w/2, sunY, 0, w/2, sunY, 300);
    sunGrad.addColorStop(0, 'rgba(255, 240, 200, 0.4)');
    sunGrad.addColorStop(1, 'rgba(255, 200, 100, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w/2, sunY, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffdf9e'; // Actual sun disk
    ctx.beginPath();
    ctx.arc(w/2, sunY, 60, 0, Math.PI * 2);
    ctx.fill();

    // 3. Taj Mahal Silhouette (Procedural)
    ctx.fillStyle = '#2a0a1a'; // Dark, warm silhouette
    const centerX = w / 2;
    const scale = Math.min(w, h) / 1000;

    ctx.beginPath();
    ctx.moveTo(0, h);
    
    // Platform
    const platformH = 40 * scale;
    ctx.lineTo(w, h);
    ctx.lineTo(w, h - platformH);
    ctx.lineTo(0, h - platformH);
    
    // Main Dome
    const domeW = 180 * scale;
    const domeH = 180 * scale;
    const baseH = 120 * scale;
    const domeBaseY = h - platformH;
    
    // Central Structure Base
    ctx.rect(centerX - domeW/2, domeBaseY - baseH, domeW, baseH);
    
    // Onion Dome
    ctx.moveTo(centerX - domeW/2, domeBaseY - baseH);
    ctx.bezierCurveTo(
      centerX - domeW*0.6, domeBaseY - baseH - domeH, 
      centerX + domeW*0.6, domeBaseY - baseH - domeH, 
      centerX + domeW/2, domeBaseY - baseH
    );

    // Minarets (4)
    [ -300, -180, 180, 300 ].forEach(offset => {
      const mx = centerX + offset * scale;
      const mw = 12 * scale;
      const mh = 250 * scale;
      ctx.rect(mx - mw/2, domeBaseY - mh, mw, mh);
      // Minaret dome
      ctx.arc(mx, domeBaseY - mh, mw, Math.PI, 0);
    });

    ctx.fill();

    // 4. Birds
    ctx.strokeStyle = 'rgba(50, 10, 30, 0.8)';
    ctx.lineWidth = 2;
    this.birds.forEach(b => {
        b.x += b.speed;
        if (b.x > w + 50) b.x = -50;
        const wingY = Math.sin((Date.now() / 150) + b.offset) * 8;
        ctx.beginPath();
        // Simple V shape with flapping
        ctx.moveTo(b.x - 10, b.y - 5 + wingY);
        ctx.quadraticCurveTo(b.x, b.y + 5, b.x + 10, b.y - 5 + wingY);
        ctx.stroke();
    });

    // 5. Pollen/Dust Particles
    ctx.fillStyle = 'rgba(255, 230, 180, 0.6)';
    this.particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      
      // Mouse wind
      if (pointer.moving) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 200) {
              p.x += (dx / d) * 3;
              p.y += (dy / d) * 3;
          }
      }

      if (p.y < 0) p.y = h;
      if (p.x > w) p.x = 0;
      if (p.x < 0) p.x = w;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

// 2. New York: Night Skyline + Traffic + Reflection
class NewYorkScene implements Scene {
  buildings: Array<{ x: number; w: number; h: number; windows: Array<{x: number, y: number, on: boolean}> }> = [];
  stars: Array<{ x: number; y: number; alpha: number }> = [];
  traffic: Array<{ x: number; type: 'head' | 'tail'; speed: number }> = [];

  init(w: number, h: number) {
    this.buildings = [];
    this.stars = [];
    this.traffic = [];
    
    // Stars
    for(let i=0; i<80; i++) {
        this.stars.push({ x: random(0, w), y: random(0, h * 0.6), alpha: random(0.2, 0.9) });
    }

    // Skyline
    let currentX = -50;
    while (currentX < w + 50) {
        const width = random(40, 100);
        const height = random(h * 0.25, h * 0.65);
        const b = { x: currentX, w: width, h: height, windows: [] };
        
        // Windows
        const rows = Math.floor(height / 12);
        const cols = Math.floor(width / 10);
        for(let r=1; r<rows; r++) {
            for(let c=1; c<cols; c++) {
                if (Math.random() > 0.4) {
                    // @ts-ignore
                    b.windows.push({ x: c * 10, y: r * 12, on: Math.random() > 0.3 });
                }
            }
        }
        this.buildings.push(b);
        currentX += width - 2; 
    }

    // Traffic
    for(let i=0; i<30; i++) {
        this.traffic.push({
            x: random(0, w),
            type: Math.random() > 0.5 ? 'head' : 'tail',
            speed: random(2, 5)
        });
    }
  }

  update(ctx: CanvasRenderingContext2D, w: number, h: number, pointer: PointerState) {
    const waterLevel = h * 0.85;

    // Sky
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#020024');
    grad.addColorStop(0.7, '#0a0a3a');
    grad.addColorStop(1, '#1a1a5a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Stars
    ctx.fillStyle = 'white';
    this.stars.forEach(s => {
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });

    // Skyline
    ctx.fillStyle = '#1a1a2e';
    this.buildings.forEach(b => {
        ctx.fillRect(b.x, h - b.h, b.w, b.h);
    });

    // Windows
    this.buildings.forEach(b => {
        b.windows.forEach((w: any) => {
            ctx.fillStyle = w.on ? '#ffff99' : '#1a1a2e';
            ctx.fillRect(b.x + w.x, h - b.h + w.y, 8, 8);
        });
    });

    // Traffic lights on road
    ctx.fillStyle = 'rgba(255, 100, 100, 0.6)';
    this.traffic.forEach(t => {
        t.x += t.speed;
        if (t.x > w) t.x = -20;
        if (t.type === 'head') {
            ctx.beginPath();
            ctx.arc(t.x, waterLevel - 5, 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(t.x - 3, waterLevel - 3, 6, 6);
        }
    });

    // Water reflection
    ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
    ctx.fillRect(0, waterLevel, w, h - waterLevel);

    // Mouse glow
    if (pointer.moving) {
        const mouseGrad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 100);
        mouseGrad.addColorStop(0, 'rgba(100, 200, 255, 0.3)');
        mouseGrad.addColorStop(1, 'rgba(100, 200, 255, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 100, 0, Math.PI * 2);
        ctx.fill();
    }
  }
}

// 3. Tokyo: Neon & Rain
class TokyoScene implements Scene {
  raindrops: Array<{ x: number; y: number; length: number; speed: number }> = [];
  neonLines: Array<{ x: number; y: number; angle: number; length: number; color: string }> = [];

  init(w: number, h: number) {
    this.raindrops = [];
    this.neonLines = [];
    
    for (let i = 0; i < 200; i++) {
      this.raindrops.push({
        x: random(0, w),
        y: random(0, h),
        length: random(5, 15),
        speed: random(5, 15)
      });
    }

    for (let i = 0; i < 20; i++) {
      this.neonLines.push({
        x: random(0, w),
        y: random(0, h),
        angle: random(0, Math.PI * 2),
        length: random(30, 100),
        color: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080'][Math.floor(Math.random() * 4)]
      });
    }
  }

  update(ctx: CanvasRenderingContext2D, w: number, h: number, pointer: PointerState) {
    // Dark background
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, w, h);

    // Neon lines
    this.neonLines.forEach(line => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(line.x, line.y);
      ctx.lineTo(
        line.x + Math.cos(line.angle) * line.length,
        line.y + Math.sin(line.angle) * line.length
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Rain
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
    ctx.lineWidth = 2;
    this.raindrops.forEach(drop => {
      drop.y += drop.speed;
      if (drop.y > h) {
        drop.y = -20;
        drop.x = random(0, w);
      }
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.stroke();
    });

    // Mouse interaction
    if (pointer.moving) {
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 50, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// 4. London: Rain + Fog Animation
class LondonScene implements Scene {
  raindrops: Array<{ x: number; y: number; length: number; speed: number; wobble: number }> = [];
  fogParticles: Array<{ x: number; y: number; size: number; alpha: number; speed: number }> = [];

  init(w: number, h: number) {
    this.raindrops = [];
    this.fogParticles = [];
    
    // Heavy rain
    for (let i = 0; i < 150; i++) {
      this.raindrops.push({
        x: random(0, w),
        y: random(0, h),
        length: random(8, 20),
        speed: random(8, 15),
        wobble: random(0, 0.5)
      });
    }

    // Fog layers
    for (let i = 0; i < 60; i++) {
      this.fogParticles.push({
        x: random(0, w),
        y: random(h * 0.2, h * 0.7),
        size: random(100, 300),
        alpha: random(0.1, 0.3),
        speed: random(0.3, 0.8)
      });
    }
  }

  update(ctx: CanvasRenderingContext2D, w: number, h: number, pointer: PointerState) {
    // Dark rainy sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#2a2a3e');
    grad.addColorStop(0.5, '#4a4a5e');
    grad.addColorStop(1, '#5a5a6e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Fog base layer
    this.fogParticles.forEach(fog => {
      fog.x += fog.speed;
      if (fog.x > w + fog.size) {
        fog.x = -fog.size;
        fog.y = random(h * 0.2, h * 0.7);
      }
      
      const fogGrad = ctx.createRadialGradient(fog.x, fog.y, 0, fog.x, fog.y, fog.size);
      fogGrad.addColorStop(0, `rgba(200, 200, 220, ${fog.alpha * 0.8})`);
      fogGrad.addColorStop(1, 'rgba(200, 200, 220, 0)');
      ctx.fillStyle = fogGrad;
      ctx.beginPath();
      ctx.arc(fog.x, fog.y, fog.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Rain streaks
    ctx.strokeStyle = 'rgba(150, 180, 220, 0.5)';
    ctx.lineWidth = 1.5;
    this.raindrops.forEach(drop => {
      drop.y += drop.speed;
      drop.x += Math.sin(Date.now() * 0.001 + drop.wobble) * 0.3;
      
      if (drop.y > h) {
        drop.y = -20;
        drop.x = random(0, w);
      }
      
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - drop.speed * 0.3, drop.y + drop.length);
      ctx.stroke();
    });

    // Street light reflection glow
    const streetLightGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
    streetLightGrad.addColorStop(0, 'rgba(255, 200, 100, 0)');
    streetLightGrad.addColorStop(1, 'rgba(255, 150, 50, 0.2)');
    ctx.fillStyle = streetLightGrad;
    ctx.fillRect(0, h * 0.6, w, h * 0.4);
  }
}

// 5. Dubai: Desert Heat Shimmer + Sand Drift
class DubaiScene implements Scene {
  sandParticles: Array<{ x: number; y: number; size: number; speed: number; drift: number }> = [];
  heatWaves: Array<{ y: number; amplitude: number; frequency: number }> = [];

  init(w: number, h: number) {
    this.sandParticles = [];
    this.heatWaves = [];
    
    // Sand particles
    for (let i = 0; i < 100; i++) {
      this.sandParticles.push({
        x: random(0, w),
        y: random(0, h),
        size: random(1, 3),
        speed: random(1, 3),
        drift: random(-1, 1)
      });
    }

    // Heat wave layers
    for (let i = 0; i < 5; i++) {
      this.heatWaves.push({
        y: h * (0.3 + i * 0.12),
        amplitude: random(5, 15),
        frequency: random(0.005, 0.01)
      });
    }
  }

  update(ctx: CanvasRenderingContext2D, w: number, h: number, pointer: PointerState) {
    // Desert gradient - golden to reddish
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1a0f00');     // Dark sky
    grad.addColorStop(0.3, '#8b4513');   // Saddle brown
    grad.addColorStop(0.6, '#cd853f');   // Peru
    grad.addColorStop(1, '#daa520');     // Goldenrod
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Heat shimmer effect with distortion
    const time = Date.now() * 0.001;
    
    this.heatWaves.forEach((wave, idx) => {
      ctx.strokeStyle = `rgba(255, 200, 0, ${0.15 - idx * 0.03})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < w; i += 10) {
        const y = wave.y + Math.sin(i * wave.frequency + time) * wave.amplitude;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();
    });

    // Sand drift particles
    ctx.fillStyle = 'rgba(210, 180, 140, 0.6)';
    this.sandParticles.forEach(sand => {
      sand.x += sand.speed;
      sand.y += sand.drift * 0.5;
      sand.drift += (Math.random() - 0.5) * 0.2;
      sand.drift = Math.max(-2, Math.min(2, sand.drift));
      
      if (sand.x > w) sand.x = 0;
      if (sand.y > h) sand.y = 0;
      if (sand.y < 0) sand.y = h;
      
      ctx.beginPath();
      ctx.arc(sand.x, sand.y, sand.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Sun glow
    const sunGrad = ctx.createRadialGradient(w * 0.8, h * 0.2, 0, w * 0.8, h * 0.2, 250);
    sunGrad.addColorStop(0, 'rgba(255, 220, 100, 0.3)');
    sunGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w * 0.8, h * 0.2, 250, 0, Math.PI * 2);
    ctx.fill();

    // Mouse interaction - wind effect
    if (pointer.moving) {
      const windGrad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 120);
      windGrad.addColorStop(0, 'rgba(255, 200, 100, 0.3)');
      windGrad.addColorStop(1, 'rgba(255, 200, 100, 0)');
      ctx.fillStyle = windGrad;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 120, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

const scenes: Record<ThemeId, new () => Scene> = {
  INDIA: IndiaScene,
  NEW_YORK: NewYorkScene,
  LONDON: LondonScene,
  DUBAI: DubaiScene,
  TOKYO: TokyoScene
};

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ themeId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, moving: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SceneClass = scenes[themeId];
    if (!SceneClass) return;
    
    sceneRef.current = new SceneClass();
    sceneRef.current.init(canvas.width, canvas.height);

    const handleMouseMove = (e: MouseEvent) => {
      pointerRef.current = {
        x: e.clientX - canvas.getBoundingClientRect().left,
        y: e.clientY - canvas.getBoundingClientRect().top,
        moving: true
      };
    };

    const handleMouseLeave = () => {
      pointerRef.current.moving = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      sceneRef.current?.update(ctx, canvas.width, canvas.height, pointerRef.current);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [themeId]);

  return (
    <canvas 
      ref={canvasRef} 
      width={window.innerWidth} 
      height={window.innerHeight}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        display: 'block'
      }}
    />
  );
};

export { BackgroundCanvas };