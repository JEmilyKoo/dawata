FROM amazoncorretto:17-alpine-jdk
ARG JAR_FILE=./build/libs/*.jar
COPY ${JAR_FILE} /dawata.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/dawata.jar"]
