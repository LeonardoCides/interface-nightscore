const glow = document.querySelector('.cursor-glow');

window.addEventListener('mousemove', (e) => {
    // Usa requestAnimationFrame para uma animação mais fluida
    requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });
});

// Efeito extra: o brilho aumenta quando você clica
window.addEventListener('mousedown', () => {
    glow.style.width = '600px';
    glow.style.height = '600px';
});

window.addEventListener('mouseup', () => {
    glow.style.width = '400px';
    glow.style.height = '400px';
});
