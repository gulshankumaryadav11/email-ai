const API_URL = import.meta.env.VITE_API_URL;

export async function generateReply(email, instructions, tone) {

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/email/generate`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },

    body: JSON.stringify({
      email,
      instructions,
      tone
    })

  });

  if (!response.ok) {
    throw new Error("Backend error");
  }

  return response.text();
}