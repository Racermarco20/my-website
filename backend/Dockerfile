
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml .
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Dependencies cachen (schnellerer Build)
RUN ./mvnw -q -DskipTests dependency:go-offline

COPY src ./src

RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar
CMD ["java","-jar","app.jar"]
