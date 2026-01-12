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
            @Value("${gemini.api.url}") String baseUrl,
            @Value("${gemini.api.key}") String geminiApiKey
    ) {
        // ✅ baseUrl MUST be: https://generativelanguage.googleapis.com/v1beta
        this.webClient = webClientBuilder
                .baseUrl(baseUrl)
                .build();

        this.apiKey = geminiApiKey;
    }

    public String generateEmailReply(EmailRequest emailRequest) {

        String prompt = buildPrompt(emailRequest);

        String requestBody = String.format("""
        {
          "contents": [
            {
              "parts": [
                {
                  "text": "%s"
                }
              ]
            }
          ]
        }
        """, prompt.replace("\"", "\\\""));

        String response = webClient.post()
                // ✅ DO NOT repeat /v1beta here
                .uri("/models/gemini-1.5-flash:generateContent")
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractResponseContent(response);
    }

    /* ================= RESPONSE PARSER ================= */

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            String text = root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            return text.trim();

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }

    /* ================= PROMPT BUILDER ================= */

    private String buildPrompt(EmailRequest emailRequest) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
You are a professional email reply generator.

STRICT RULES (DO NOT BREAK):
- Generate ONLY ONE final email reply.
- Do NOT provide multiple options.
- Do NOT include headings like "Option 1", "Option 2".
- Do NOT explain your reasoning.
- Output ONLY the email reply text.

""");

        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Tone: ")
                    .append(emailRequest.getTone())
                    .append("\n");
        }

        prompt.append("""
Tone meanings:
- Professional: formal, business-like language
- Friendly: warm and polite language
- Casual: relaxed and conversational language

Original email:
""");

        prompt.append(emailRequest.getEmailContent());

        if (emailRequest.getInstructions() != null &&
                !emailRequest.getInstructions().isEmpty()) {

            prompt.append("\n\nAdditional instructions:\n")
                    .append(emailRequest.getInstructions());
        }

        return prompt.toString();
    }
}
