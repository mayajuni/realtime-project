# Reatime-Project

  <img src="https://img.shields.io/badge/node-8.x-brightgreen.svg">
  <img src="https://img.shields.io/badge/vue-2.x-brightgreen.svg">
  <img src="https://img.shields.io/badge/rethinkDB-2.x-brightgreenk">
  <img src="https://img.shields.io/badge/uws-8.x-brightgreen.svg">
  <img src="https://img.shields.io/badge/typescript-2.x-brightgreen.svg">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg">

실시간 처리에 대해서 공부를 하다가 간단하게 프로젝트를 해보자라는 생각으로 시작했다. 간단한 kanban board를 만들어 보았다. 이 프로젝트는 재미로 시작한 것이고 진행 사항은 [여기](https://github.com/mayajuni/realtime-project/projects)를 보면 된다 

[Server 설명](https://github.com/mayajuni/realtime-project/tree/master/server)

Client 설명(준비중)

### 실행

실행 전에 nodeJs, GitHub, rethinkdb가 설치되어 있어야된다.

```bash
# git clone https://github.com/mayajuni/realtime-project.git
# cd realtime-project
# npm run dev
```



### 사용기술

| Division          | My solution                              | Remarks                                  |
| ----------------- | ---------------------------------------- | ---------------------------------------- |
| Database          | [RethinkDB](https://rethinkdb.com)       | The open-source database for the realtime web |
| Validation        | [Json-schema](http://json-schema.org/)   | 유효성 체크를 위한 api                           |
| Client-side cache | [Vuex](https://vuex.vuejs.org/en/intro.html) | Redux와 비슷한 Vue 라이브러리                     |
| Socket server     | [uWebSocket](https://github.com/uNetworking/uWebSockets) | 가장 빠르다는 소캣 기술                            |
| Front-end         | [Vue](https://vuejs.org/)                | 회사에서 vue를 써서…(angular로도 만들까 고민중..)       |
| css               | [Sass](http://sass-lang.com/guide)       | css를 좀더 편하게 쓰기 위해서..                     |
| Testing           | [Mocha](https://mochajs.org/), [Chai](http://chaijs.com/) | 아직 서버쪽만 테스트코드 있음.                        |
| Server            | Node 8.x                                 | 최신 버젼 따라가자~                              |



### 설계 목표

아래와 같이 단반향 순환 방식을 생각했다. 

1. 클라이언트에서 action 발생
2. action을 vuex store의 Events State에 등록
3. Events State에 등록된 순서대로(선입선출 queue) socket server 전달
4. socket서버에서 RethinkDB 등록/수정/삭제
5. rethinkDB의 changes api의 등록/수정/삭제 트리거 이벤트 발생
6. chagnes를 통한 변경 사항을 client에 전달.
7. socket server에서 전달 받은 데이터를 vuex store의 kanban state에 등록
8. Kanban state 변경 사항 kanban component에 적용

![설계 사진](https://raw.githubusercontent.com/mayajuni/realtime-project/master/readme.png)
