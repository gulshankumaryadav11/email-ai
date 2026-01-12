# Java 17 base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy maven wrapper and pom
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Give permission to mvnw
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build application
RUN ./mvnw clean package -DskipTests

# Run Spring Boot app
CMD ["java", "-jar", "target/*.jar"]
