package com.email.email_writer_sb;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class EmailGeneratorService {

    private final WebClient.Builder webClientBuilder;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String baseUrl;

    @Value("${groq.model}")
    private String model;

    public String generateEmailReply(EmailRequest emailRequest) {

        WebClient webClient = webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();

        String prompt = buildPrompt(emailRequest);

        String body = """
        {
          "model": "%s",
          "messages": [
            { "role": "user", "content": "%s" }
          ]
        }
        """.formatted(model, prompt.replace("\"", "\\\""));

        String response = webClient.post()
                .uri("/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractText(response);
    }

    private String extractText(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            return root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();
        } catch (Exception e) {
            throw new RuntimeException("Groq response parse failed", e);
        }
    }

    private String buildPrompt(EmailRequest req) {
        return """
        Write a professional email reply.

        Tone: %s

        Original email:
        %s

        Instructions:
        %s
        """.formatted(
                req.getTone(),
                req.getEmailContent(),
                req.getInstructions()
        );
    }
}
