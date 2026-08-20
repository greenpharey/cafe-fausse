import React from "react";
import { menu } from "../data/menu.js";

export default function Menu() {
  return (
    <div className="section">
      <div className="container section-heading">
        <p className="eyebrow">Café Fausse</p>
        <h1>Menu</h1>
        <p>Our kitchen works with Italian technique and local suppliers. 
          The menu below earned two Michelin stars, though it changes often enough that your 
          server is the best guide to any given evening. Prices reflect a single course.</p>
      </div>

      <div className="container">
        {menu.map((category) => (
          <div className="menu-category" key={category.category}>
            <h2 className="menu-category__title">— {category.category} —</h2>
            <div className="menu-items">
              {category.items.map((item) => (
                <div className="menu-item" key={item.name}>
                  <div className="menu-item__name-wrap">
                    <div className="menu-item__name">{item.name}</div>
                    <div className="menu-item__desc">{item.description}</div>
                  </div>
                  <div className="menu-item__leader" aria-hidden="true"></div>
                  <div className="menu-item__price">${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p>Menu items rotate with the season. Call (202) 555-4567 for current availability.</p>
      </div>
    </div>
  );
}
