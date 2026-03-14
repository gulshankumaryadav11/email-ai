import { useNavigate } from "react-router-dom";

export default function Navbar(){

  const navigate = useNavigate();

  return(

    <nav className="lp-nav">

      <div className="lp-nav-logo">
        EMIPI
      </div>

      <div className="lp-nav-links">

        <a className="lp-nav-link" onClick={()=>navigate("/features")}>
          Features
        </a>

        <a className="lp-nav-link" onClick={()=>navigate("/pricing")}>
          Pricing
        </a>

        <a className="lp-nav-link" onClick={()=>navigate("/blog")}>
          Blog
        </a>

      </div>

      <button
        className="lp-btn-primary"
        onClick={()=>navigate("/app")}
      >
        Get Started
      </button>

    </nav>
  )
}