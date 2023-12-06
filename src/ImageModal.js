import React from 'react';

const ImageModal = ({ src, alt, onClose }) => {
    if (!src) return null;

    return (
        <div style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000
        }} onClick={onClose}>
            <img src={src} alt={alt} style={{ maxHeight: '90%', maxWidth: '90%' }} />
        </div>
    );
};

export default ImageModal;
