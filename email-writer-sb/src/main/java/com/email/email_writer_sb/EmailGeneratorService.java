package com.email.email_writer_sb;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;

    public EmailGeneratorService(
            WebClient.Builder webClientBuilder,
            @Value("${groq.api.key}") String apiKey
    ) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.groq.com")
                .build();
        this.apiKey = apiKey;
    }

    // ================= MAIN METHOD =================
    public String generateEmailReply(EmailRequest emailRequest) {

        String prompt = buildPrompt(emailRequest);

        String requestBody = """
        {
          "model": "llama-3.1-8b-instant",
          "messages": [
            {
              "role": "user",
              "content": "%s"
            }
          ]
        }
        """.formatted(prompt.replace("\"", "\\\""));

        String rawResponse = webClient.post()
                .uri("/openai/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractEmailText(rawResponse);
    }

    // ================= JSON PARSER =================
    private String extractEmailText(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            return root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText()
                    .trim();

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Groq response", e);
        }
    }

    // ================= PROMPT BUILDER =================
    private String buildPrompt(EmailRequest emailRequest) {

        return """
        You are a professional email reply generator.

        STRICT RULES:
        - Generate ONLY ONE email reply
        - Do NOT give options
        - Do NOT explain anything
        - Output ONLY the email text

        Tone: %s

        Original email:
        %s

        Instructions:
        %s
        """.formatted(
                safe(emailRequest.getTone()),
                safe(emailRequest.getEmailContent()),
                safe(emailRequest.getInstructions())
        );
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
