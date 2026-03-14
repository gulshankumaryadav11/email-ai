export default function Features(){

  const features=[
    {name:"AI Replies",desc:"Generate smart replies instantly"},
    {name:"Tone Control",desc:"Professional Friendly Casual"},
    {name:"Copy Export",desc:"Copy or download reply"}
  ]

  return(

    <section className="lp-features">

      <h2 className="lp-section-title">
        Features
      </h2>

      <div className="lp-feature-grid">

        {features.map(f=>(
          <div className="lp-feature-card" key={f.name}>

            <div className="lp-feature-name">
              {f.name}
            </div>

            <div className="lp-feature-desc">
              {f.desc}
            </div>

          </div>
        ))}

      </div>

    </section>
  )
}