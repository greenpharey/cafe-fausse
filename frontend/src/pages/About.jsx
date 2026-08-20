import React from "react";
import Recognition from "../components/Recognition";

export default function About() {
  return (
    <div className="section">
      <div className="container section-heading">
        <p className="eyebrow">Since 2010</p>
        <h1>About Café Fausse</h1>
        <h2>Our story</h2>
        <p>
          Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez,
           Café Fausse blends traditional Italian flavors with modern culinary innovation. 
           Our mission is to provide an unforgettable dining experience that reflects both quality and creativity.
The room on Culinary Avenue started as a thirty-seat trattoria with one wood oven. 
Sixteen years later the dining room has grown, and the Michelin Guide has awarded it two stars, though the working principle has held steady: cook honestly, source carefully, and let the ingredient lead.

        </p>
      </div>

      <div className="container">
        <h2>The founders</h2>
        <div className="founder-grid">
          
          <div className="founder-card">
            
            <img
              src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=900&q=80"
              alt="Chef Antonio Rossi plating a dish in the kitchen"
            />
            <p className="eyebrow">Executive Chef & Co-Founder</p>
            <h3>Antonio Rossi</h3>
            <p>
              Antonio trained in Bologna before spending a decade in kitchens across Emilia-Romagna and New York. He came to Washington with a conviction that Italian cooking travels best when it adapts to local soil. His menus change with what regional farms send through the back door, and he still works the pass most nights. The two Michelin stars Café Fausse holds belong, in his telling, to the line cooks who show up at two in the afternoon.
            </p>
          </div>
          <div className="founder-card">
            <img
              src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=900&q=80"
              alt="Maria Lopez greeting guests in the dining room"
            />
            <p className="eyebrow">Co-Founder and Managing Partner</p>
            <h3>Maria Lopez</h3>
            <p>
              Maria spent fifteen years building restaurants in Chicago and Washington before opening Café Fausse with Antonio. She shapes the hospitality standard that guests notice from the moment they arrive: unhurried service, an informed floor team, and a wine list chosen to sit alongside the food rather than compete with it. Both the Washington Post and the New York Times singled out the service in their five-star reviews, which she takes as the compliment that matters most.
            </p>
          </div>
        </div>

        <hr className="rule" />

        <div className="section-heading">
          <p className="eyebrow">Our Commitment</p>
          <h2>What we promise</h2>
          <p>
            Every dish leaves our kitchen because it earned its place on the plate. We buy produce, dairy, and meat from growers within a day’s drive whenever the season allows, and we name those suppliers on request. Guests come to Café Fausse for an evening worth remembering, so we treat the details as the whole point.
          </p>
        </div>
        <Recognition />
        <center>
          <p>Photographs only go so far. Book a table and see the room for yourself.</p>
          <button className="btn btn__reservation"><a href="/reservations" >
                Reserve a Table
            </a></button>
        </center>
      </div>
    </div>
  );
}
