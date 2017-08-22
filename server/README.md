## 소개
Express + Mongodb 프로젝트의 개발을 위한 스타터입니다.

이 seed는 다음과 같은 기능을 제공합니다.
 - Log 처리
 - Lint를 통한 통합 컨벤션 처리
 - 개발 속도 향상과 에러처리.
 - Live server Reload
 - mongoDB 연결 및 개발 지원
 - redis session storage 사용(dev 환경에서는 기존 session 사용)
 - prod 모드에서 자동 process.env.NODE_ENV 설정
 
## 시작
이 프로젝트는 node >= V6.0과 npm >= 3.10.3혹은 yarn을 추천합니다.

seed 시작하기:
```bash
$ git clone --depth 1 https://github.com/o2palm/node-server-seed.git
$ cd node-server-deed

# seed에 필요한 패지키 설치
$ npm install
# 좀더 빠르게 설치 하려면 yarn을 사용하면 됩니다
$ yarn install

# 서버 구동(개발할때)
$ npm start

# prod build
$ npm run build-prod
# dev build
$ npm run build-dev

# test (추후 추가)
$ npm test
```

## .env 설정
.env 파일은 app의 기본 설정들이 들어가 있는 파일입니다. 기본 구조는 아래와 같습니다.

추가적으로 app의 설정이 필요한 부분은 아래와 같은 방식으로 추가 하여 사용하시면됩니다.
```bash
# Port the server will run under
PORT=3000

#production or development
NODE_ENV=development

# Redis
REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PASSWORD=redis-password

# Session
SESSION_NAME=session-name
SESSION_SECRET=session-secret

# Mongo
# MONGO_URL=mongodb://[userId]:[password]@localhost:27017/blog?authSource=admin
MONGO_URL=mongodb://localhost:27017/mongoTest

# Key
PASSWORD_KEY=passwordKey
TOKEN_KEY=token_key
COMMON_KEY=common_key
```

## Log 
로그 파일도 자동으로 생성하여 만들어 주고 있습니다. 
 - rest의 모든 정상 로그 및 에러로그를 file 저장
 - file말고도 custom하게 변경 처리 가능(db 저장, s3업로드 등)
 - data type은 json
 - src/module/logger.module.ts에서 수정가능
 - 현재 dev에서는 파일 생성을 안한다.(prod에서만 함)

## Test 
추후 진행 예정

## Directory Structure
```bash
.
├── src
│   ├── module 
│   │    ├── crypto.module.ts <- 암호화 모듈
│   │    ├── error.module.ts  <- error 관련한 모듈
│   │    ├── logger.module.ts <- Log 관련 모듈
│   │    └── utils.module.ts  <- util 관련 모듈
│   ├── mongo   
│   │    └── login.mongo.ts   <- mongo관련 스키마와 모델 예제
│   ├── router
│   │    └── login.router.ts  <- Router 예제
│   └── service
│        └── login.service.ts <- service(비지니스 로직 영역) 예제
├── test
├── .env          <- app의 설정이 관련 파일 (env.NODE_ENV 이와 같이 설정하는 것들에 대한 정보)
├── .gitignore
├── gulpfile.ts   <- gulp task 설정
├── pacakage.ts   <- 프로젝트 dependencies
├── tsconfig.json <- typescript 설정
└── tslint.json   <- lint 설정
```
 1. module: app의 module
 2. mongo: mongoose의 스키마와 모델 설정
 3. router: java의 controller 역활과 비슷
 4. service: mongodb의 연결 및 로직, java의 service + DAO
  
`해당 디렉토리 구조는 입맛에 맞게 수정 하셔도 됩니다.`
