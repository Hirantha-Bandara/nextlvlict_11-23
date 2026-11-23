import React, { useEffect } from 'react';

const Particles: React.FC = () => {
    useEffect(() => {
        const createParticles = () => {
            const particlesContainer = document.getElementById('particles');
            if (!particlesContainer) return;

            const particleCount = 15;
            particlesContainer.innerHTML = '';

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');

                const size = Math.random() * 10 + 5;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 15}s`;

                particlesContainer.appendChild(particle);
            }
        };

        createParticles();
    }, []);

    return <div className="particles-container" id="particles"></div>;
};

export default Particles;