# 다와따
![Image](https://github.com/user-attachments/assets/47999df4-7c8d-44e9-b9b3-78b2bd3e433f)
2025.01 ~ 2024.02 (7주)

## 개요

실시간 위치 공유 및 최적 장소 추천을 통해 약속 시간을 효율적으로 조율하는 서비스

## 팀 규모

6명

## 기술 스택

- Frontend: **React**, **React Native**, Redux Toolkit, NativeWind, TypeScript
- Backend: **Java**, **Spring Boot**, WebSocket, Amazon S3, Firebase FCM,JWT
- CI/CD & DevOps: Android Gradle, Custom Build Pipeline
- 협업 툴 : GitLab, Mattermost, Notion, Figma

## 코드 품질 개선 전략

- Git PR 리뷰
- ESLint/Prettier 적용
- 모듈화된 컴포넌트 구조 유지

## 결과/성과

- React Native로 iOS / Android / Web 통합 애플리케이션 개발
- 실시간 위치 공유 및 도착 예정 시간 안내
- Amazon S3의 presigned URL 사용을 통한 이미지 업로드 서버 부담 개선

## 트러블 슈팅

### 🔹 **Redux 기반 비동기 UI 적용으로 장소 추천 API 응답 속도 99.8% 개선 (240초 → 0.5초)**

- 장소 추천 API 응답이 4분 걸려 UX 저하 문제 발생
- 사용자가 기다리지 않도록 먼저 약속 기본 정보를 입력하도록 개선
- **Redux 캐싱**을 활용해 기존 추천 장소를 즉시 노출, 이후 백그라운드에서 최신 데이터 갱신
- **Redux Persist Storage**를 적용하여 재접속 시에도 추천 내역 유지, 중복 API 요청 방지

### **🔹 Amazon S3 Presigned URL을 활용한 이미지 업로드 개선**

- Presigned URL을 사용한 프로필 이미지 업로드 과정에서 바이너리 데이터 인증 오류 발생
- 업로드 전 이미지 리사이징 및 PNG 변환 적용 → 서버가 요구하는 확장자 규격을 준수하도록 수정

### **🔹 CI/CD 자동화 및 APK 빌드 속도 개선**

- Android Native Module, FCM, Kakao SDK 추가 후 빌드 시간이 급격히 증가(38분 소요)
- Gradle 빌드 최적화 적용 →APK 빌드 시간 94.7% 단축 (38분 → 2분)
