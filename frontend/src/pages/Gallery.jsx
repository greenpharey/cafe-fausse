import React, { useState } from "react";
import { galleryImages, awards, reviews } from "../data/gallery.js";
import Lightbox from "../components/Lightbox.jsx";

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div>
      <div className="section">
        <div className="container section-heading">
          <p className="eyebrow">A Look Inside</p>
          <h1>Gallery</h1>
          <p>The room, the plates, and a few moments in between.</p>
        </div>

        <div className="container gallery-grid">
          {galleryImages.map((image, i) => (
            <button
              key={image.src + i}
              className="gallery-item"
              onClick={() => setActiveIndex(i)}
              style={{ border: "none", padding: 0, textAlign: "left" }}
              aria-label={`View larger image: ${image.caption}`}
            >
              <img src={image.src} alt={image.alt} loading="lazy" />
              <span className="gallery-item__caption">{image.caption}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="section section--tight" style={{ background: "var(--cream-deep)" }}>
        <div className="container section-heading">
          <p className="eyebrow">Recognition</p>
          <h2>Awards</h2>
        </div>
        <div className="container grid grid--3">
          {awards.map((award) => (
            <div className="award-card" key={award.title}>
              <div className="award-card__year">{award.year}</div>
              <h3>{award.title}</h3>
              {award.source && <p style={{ color: "#6b6156" }}>{award.source}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container grid grid--2">
          {reviews.map((review) => (
            <div className="review-card" key={review.quote}>
              <blockquote>&ldquo;{review.quote}&rdquo;</blockquote>
              <cite>— {review.source}</cite>
            </div>
          ))}
        </div>
      </section>

      {activeIndex !== null && (
        <Lightbox
          images={galleryImages}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </div>
  );
}
