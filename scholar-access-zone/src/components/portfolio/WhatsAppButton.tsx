import React from 'react';

const WhatsAppButton: React.FC = () => {
    return (
        <a
            href="https://wa.me/94784800385"
            className="whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact on WhatsApp"
        >
            <i className="fab fa-whatsapp"></i>
        </a>
    );
};

export default WhatsAppButton;