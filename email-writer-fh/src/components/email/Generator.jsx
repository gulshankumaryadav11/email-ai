import { useState } from "react";
import { generateReply } from "../../api/emailApi";

export default function Generator() {

  const [email,setEmail] = useState("");
  const [instructions,setInstructions] = useState("");
  const [tone,setTone] = useState("Professional");
  const [reply,setReply] = useState("");
  const [loading,setLoading] = useState(false);

  const handleGenerate = async () => {

    if(!email) return;

    setLoading(true);

    try {

      const result = await generateReply(email,instructions,tone);

      setReply(result);

    } catch(err) {

      alert("Backend connection error");

    }

    setLoading(false);
  };

  return (

    <div style={{padding:40,width:"100%"}}>

      <h2>Email Generator</h2>

      <textarea
      rows="5"
      placeholder="Paste original email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      style={{width:"100%",marginBottom:20}}
      />

      <textarea
      rows="3"
      placeholder="Additional instructions"
      value={instructions}
      onChange={(e)=>setInstructions(e.target.value)}
      style={{width:"100%",marginBottom:20}}
      />

      <select
      value={tone}
      onChange={(e)=>setTone(e.target.value)}
      style={{marginBottom:20}}
      >

        <option>Professional</option>
        <option>Friendly</option>
        <option>Casual</option>

      </select>

      <br/>

      <button onClick={handleGenerate}>
        {loading ? "Generating..." : "Generate Reply"}
      </button>

      {reply && (

        <div style={{marginTop:30}}>

          <h3>Generated Reply</h3>

          <p>{reply}</p>

        </div>

      )}

    </div>
  );
}