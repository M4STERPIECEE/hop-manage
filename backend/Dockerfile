
FROM gradle:8.5-jdk21-alpine AS build

WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle/ gradle/
COPY gradlew .
RUN chmod +x ./gradlew
RUN gradle dependencies --configuration compileClasspath --no-daemon 2>/dev/null || true
COPY src/ src/
RUN gradle build --no-daemon -x test
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
RUN addgroup -S javagroup && adduser -S javauser -G javagroup
USER javauser
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]