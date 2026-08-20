import React, { useEffect, useCallback } from "react";

export default function Lightbox({ images, index, onClose, onNavigate }) {
  const image = images[index];

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    },
    [index, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!image) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose}>
        Close
      </button>
      <button
        className="lightbox__nav lightbox__nav--prev"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + images.length) % images.length);
        }}
        aria-label="Previous image"
      >
        ‹
      </button>
      <div onClick={(e) => e.stopPropagation()}>
        <img src={image.src} alt={image.alt} />
        <p className="lightbox__caption">{image.caption}</p>
      </div>
      <button
        className="lightbox__nav lightbox__nav--next"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % images.length);
        }}
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  );
}
