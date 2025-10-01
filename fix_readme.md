## 주석 처리 구간
- backend/destinations/services/weather_service.py:198-215 - 기존 정리 루프를 주석 처리하여 CSV 파일을 임시로 유지
- backend/destinations/services/weather_service.py:222-228 - 동일한 이유로 CSV 삭제 헬퍼 루프를 주석 처리 완료
- backend/destinations/management/commands/collect_weather.py:28-31 - 정리 명령 호출과 성공 메시지를 주석 처리 완료
- bat/cleanup_csv.bat:17,21,25 - CSV 삭제를 막기 위해 docker 정리 명령을 주석 처리 완료

------
- return 뒤에 
> ### 추후 주석처리 원복할 때 삭제 예정
------ 
이라 적어둔 것은 추후 api 복구 시 주석 원복과 함께 다시 삭제 


----------------
# 첫 실행시 해야되는 것들 
1. npm install 안 한 사람은 꼭 npm install 먼저 
2. ```docker-compose up --build -d``` (docker build도 안 했으면) 그후부터 수정은 ```docker-compose up -d``` 인데 현재 Dockerfile 내용이 변경됐으므로 ```docker-compose up --build -d``` 부탁드립니다. 

