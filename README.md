# EmailAI

EmailAI is a full-stack web application that helps users generate and improve emails using AI.
Users can either write a short prompt or paste an existing email into the input box.  
The system generates a complete, well-structured email based on the given context.
The application also allows users to select the tone of the email (for example: Formal, Casual, Professional, Friendly), and the AI adjusts the writing style accordingly.
The frontend is built using React, and the backend is developed with Spring Boot.  
Email generation is powered by the Groq LLM API.

---

## What This Project Does
- Generate emails from a short prompt  
- Improve or rewrite pasted emails  
- Adjust writing tone based on user selection  
- Provide structured and grammatically correct output  
This makes it useful for students, job seekers, professionals, and anyone who writes emails regularly.

---

## Tech Stack
Frontend:
- React (Vite)
- Axios
Backend:
- Spring Boot
- REST APIs
AI Integration:
- Groq API (Chat Completion endpoint)

---

## Project Structure
email-ai  
│  
├── email-writer-fh   → React frontend  
└── email-writer-sb   → Spring Boot backend  

---

## How It Works
1. User writes a prompt or pastes an email.
2. User selects the tone.
3. React sends the request to the backend.
4. Spring Boot calls the Groq API.
5. AI generates the final email.
6. The result is displayed on the screen.

---

## Backend Configuration
Add your Groq API key inside `application.properties`:
groq.api.key=YOUR_GROQ_API_KEY  
groq.api.url=https://api.groq.com/openai/v1/chat/completions  
Important: Do not commit your API key to GitHub.

---

## How to Run
Start backend:
cd email-writer-sb  
mvn spring-boot:run  

Start frontend:
cd email-writer-fh  
npm install  
npm run dev  

---

## Future Improvements
- Email history saving
- User authentication
- Multi-language support
- Template library
- Download as PDF option

---

## Author
Gulshan Kumar Yadav  
Full Stack Developer
