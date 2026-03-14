export const landingStyles = `

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

:root{
  --teal:#2f8f8b;
  --teal-light:#4fd1c5;
  --dark:#0a1f1e;
  --card:#102826;
  --text:#e0f4f2;
  --muted:#7bbab6;
}

/* NAVBAR */

.lp-nav{
  position:fixed;
  top:0;
  left:0;
  right:0;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:20px 60px;
  background:rgba(10,31,30,0.8);
  backdrop-filter:blur(12px);
  z-index:100;
}

.lp-nav-logo{
  font-family:'Playfair Display',serif;
  font-size:26px;
  font-weight:900;
  color:var(--teal-light);
}

.lp-nav-links{
  display:flex;
  gap:30px;
}

.lp-nav-link{
  color:var(--muted);
  font-size:14px;
  cursor:pointer;
  text-decoration:none;
}

.lp-nav-link:hover{
  color:var(--teal-light);
}

/* BUTTONS */

.lp-btn-primary{
  padding:10px 26px;
  border-radius:999px;
  border:none;
  background:linear-gradient(90deg,var(--teal),var(--teal-light));
  color:#fff;
  cursor:pointer;
}

.lp-btn-hero{
  padding:16px 40px;
  border-radius:999px;
  border:none;
  background:linear-gradient(90deg,var(--teal),var(--teal-light));
  color:white;
  font-size:16px;
  cursor:pointer;
}

/* HERO */

.lp-hero{
  min-height:100vh;
  background:var(--dark);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:120px 20px;
}

.lp-title{
  font-family:'Playfair Display',serif;
  font-size:70px;
  font-weight:900;
  color:var(--text);
}

.lp-title span{
  background:linear-gradient(135deg,var(--teal-light),#fff);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.lp-sub{
  margin-top:20px;
  font-size:18px;
  color:var(--muted);
  max-width:600px;
}

/* STATS */

.lp-stats{
  padding:80px 20px;
  background:rgba(47,143,139,0.05);
}

.lp-stats-inner{
  max-width:900px;
  margin:auto;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  text-align:center;
  gap:40px;
}

.lp-stat-num{
  font-size:50px;
  font-family:'Playfair Display',serif;
  font-weight:900;
  color:var(--teal-light);
}

.lp-stat-label{
  font-size:14px;
  color:var(--muted);
}

/* FEATURES */

.lp-features{
  padding:100px 20px;
  background:var(--dark);
}

.lp-section-title{
  font-family:'Playfair Display',serif;
  font-size:42px;
  text-align:center;
  color:var(--text);
  margin-bottom:60px;
}

.lp-feature-grid{
  max-width:1000px;
  margin:auto;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:30px;
}

.lp-feature-card{
  background:var(--card);
  padding:30px;
  border-radius:16px;
  border:1px solid rgba(79,209,197,0.15);
}

.lp-feature-name{
  font-size:20px;
  color:var(--text);
  margin-bottom:10px;
}

.lp-feature-desc{
  font-size:14px;
  color:var(--muted);
}

/* CTA */

.lp-cta{
  padding:120px 20px;
  text-align:center;
  background:var(--dark);
}

.lp-cta-title{
  font-size:50px;
  font-family:'Playfair Display',serif;
  color:var(--text);
  margin-bottom:30px;
}

/* FOOTER */

.lp-footer{
  padding:40px;
  background:#081716;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.lp-footer-logo{
  font-size:20px;
  color:var(--teal-light);
  font-family:'Playfair Display',serif;
}

.lp-footer-copy{
  color:var(--muted);
  font-size:13px;
}

/* MOBILE */

@media(max-width:768px){

  .lp-title{
    font-size:48px;
  }

  .lp-nav{
    padding:16px 20px;
  }

  .lp-nav-links{
    display:none;
  }

  .lp-footer{
    flex-direction:column;
    gap:10px;
    text-align:center;
  }

}

`;