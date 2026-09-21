# Stage 1: Build Java Spring Boot Backend using Maven
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/pom.xml backend/
COPY backend/src backend/src
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Stage 2: Minimal Java Runtime environment
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
