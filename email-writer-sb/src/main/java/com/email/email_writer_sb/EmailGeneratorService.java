package com.email.email_writer_sb;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;

    public EmailGeneratorService(
            WebClient.Builder webClientBuilder,
            @Value("${groq.api.key}") String apiKey
    ) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
        this.apiKey = apiKey;
    }

    public String generateEmailReply(EmailRequest request) {

        // ✅ STEP 1: Build FULL prompt text
        String prompt = buildPrompt(request);

        // ✅ STEP 2: Groq-compatible request body
        Map<String, Object> body = Map.of(
                "model", "llama-3.1-8b-instant",
                "messages", new Object[]{
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                }
        );

        // ✅ STEP 3: Call Groq API
        String response = webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractContent(response);
    }

    // ================= PROMPT BUILDER =================

    private String buildPrompt(EmailRequest r) {
        return """
You are a professional email reply generator.

STRICT RULES:
- Generate ONLY ONE final email reply
- No options
- No explanations
- Only email text

Tone: %s

Original Email:
%s

Additional Instructions:
%s
""".formatted(
                safe(r.getTone()),
                safe(r.getEmailContent()),
                safe(r.getInstructions())
        );
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }

    // ================= RESPONSE PARSER =================

    private String extractContent(String response) {
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
}
