package com.email.email_writer_sb;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

   
    @PostMapping("/generate")
    public ResponseEntity<?> generateEmail(@RequestBody EmailRequest emailRequest) {
        try {
            String response = emailGeneratorService.generateEmailReply(emailRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); //
            return ResponseEntity
                    .status(500)
                    .body("Error generating email: " + e.getMessage());
        }
    }


    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("API is working");
    }
}
