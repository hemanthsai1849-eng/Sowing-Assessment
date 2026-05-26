# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml and resolve dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the production JRE image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install standard utilities and system packages (e.g. curl for health check)
RUN apk add --no-cache curl

# Add a non-root group and user for security compliance
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the built jar from stage 1
COPY --from=build /app/target/crop-sowing-intelligence-1.0.0.jar app.jar

# Expose API port
EXPOSE 8080

# Environment variables with sensible defaults
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
