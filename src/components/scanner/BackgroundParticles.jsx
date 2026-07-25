"use client";

import { useEffect, useRef } from "react";

export default function BackgroundParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    
    // Theme colors
    const colors = [
      "rgba(82, 196, 82, 0.4)", // secondary green
      "rgba(255, 102, 51, 0.35)", // accent orange
      "rgba(0, 51, 102, 0.3)",  // primary light blue
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.reset();
        // Distribute across screen initially
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20; // Start below screen
        this.size = Math.random() * 3 + 1.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = -(Math.random() * 0.5 + 0.2); // Slow upward float
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.6 + 0.2;
        this.life = Math.random() * 1000 + 500;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulse alpha
        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha > 0.8) {
          this.alpha = 0.8;
          this.pulseDir = -1;
        } else if (this.alpha < 0.2) {
          this.alpha = 0.2;
          this.pulseDir = 1;
        }

        // Reset if offscreen or expired
        if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // Add subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      const density = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000));
      particles = [];
      for (let i = 0; i < density; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      const maxDistance = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            // Draw a line connecting the points
            ctx.save();
            const alpha = (1 - dist / maxDistance) * 0.08;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = "rgba(82, 196, 82, 0.5)"; // green-accent connections
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
