FROM amazoncorretto:17-alpine-jdk
ARG JAR_FILE=./build/libs/*.jar
ENV TZ=Asia/Seoul
RUN apk add tzdata && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
COPY ${JAR_FILE} /dawata.jar
EXPOSE 8080
ENTRYPOINT ["java","-Duser.timezone=Asia/Seoul","-jar","/dawata.jar"]
