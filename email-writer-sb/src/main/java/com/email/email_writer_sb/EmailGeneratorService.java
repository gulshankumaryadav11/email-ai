package com.email.email_writer_sb;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.List;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;
    private final String model;

    public EmailGeneratorService(
            WebClient.Builder webClientBuilder,
            @Value("${groq.api.url}") String baseUrl,
            @Value("${groq.api.key}") String apiKey,
            @Value("${groq.model}") String model
    ) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.model = model;
    }

    public String generateEmailReply(EmailRequest emailRequest) {

        try {
            // ✅ Correct Groq/OpenAI compatible payload
            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of(
                                    "role", "user",
                                    "content", buildPrompt(emailRequest)
                            )
                    ),
                    "temperature", 0.7
            );

            String response = webClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return extractText(response);

        } catch (Exception e) {
            throw new RuntimeException("Groq API failed: " + e.getMessage(), e);
        }
    }

    private String extractText(String response) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response);

        return root.path("choices")
                .get(0)
                .path("message")
                .path("content")
                .asText();
    }

    private String buildPrompt(EmailRequest emailRequest) {
        return """
        You are a professional email reply generator.

        Tone: %s

        Original email:
        %s

        Instructions:
        %s
        """.formatted(
                emailRequest.getTone(),
                emailRequest.getEmailContent(),
                emailRequest.getInstructions()
        );
    }
}
