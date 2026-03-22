/* ========================================
   ONEPACK SOLUTIONS — NOSOTROS PAGE JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Floating geometric shapes for page hero background
  initAboutParticles();
});

function initAboutParticles() {
  const container = document.getElementById('aboutParticles');
  if (!container) return;

  // Create floating geometric shapes
  const shapes = [];
  const count = 20;

  for (let i = 0; i < count; i++) {
    const shape = document.createElement('div');
    const size = Math.random() * 60 + 20;
    const isCircle = Math.random() > 0.5;

    shape.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border: 1px solid rgba(255, 103, 29, ${Math.random() * 0.12 + 0.03});
      border-radius: ${isCircle ? '50%' : '4px'};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      pointer-events: none;
      animation: floatShape${i % 3} ${Math.random() * 10 + 15}s ease-in-out infinite;
      animation-delay: ${Math.random() * -15}s;
    `;

    container.appendChild(shape);
    shapes.push(shape);
  }

  // Add a few filled dots
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 4 + 2;

    dot.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 103, 29, ${Math.random() * 0.3 + 0.1});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      pointer-events: none;
      animation: floatShape${i % 3} ${Math.random() * 8 + 10}s ease-in-out infinite;
      animation-delay: ${Math.random() * -10}s;
    `;

    container.appendChild(dot);
  }

  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatShape0 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(30px, -20px) rotate(45deg); }
      50% { transform: translate(-10px, -40px) rotate(90deg); }
      75% { transform: translate(-30px, -10px) rotate(135deg); }
    }
    @keyframes floatShape1 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(-25px, 25px) rotate(-60deg); }
      66% { transform: translate(20px, -30px) rotate(60deg); }
    }
    @keyframes floatShape2 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(15px, 35px) rotate(180deg); }
    }
  `;
  document.head.appendChild(style);
}
