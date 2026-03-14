import { useNavigate } from "react-router-dom";

export default function CTA(){

  const navigate=useNavigate()

  return(

    <section className="lp-cta">

      <h2 className="lp-cta-title">
        Start sending smarter emails
      </h2>

      <button
        className="lp-btn-hero"
        onClick={()=>navigate("/app")}
      >
        Try Now
      </button>

    </section>

  )
}