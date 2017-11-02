# Server

typescript를 사용하여 개발 진행하였다. Socket.io 혹은 socket cluster 등등의 websocket 프레임워크는 안쓰고 uws를 이용 네이티브 api를 사용해서 개발 진행했다.



## Router

현재 client/server send 인자값으로 route, action, payload로 받게 구성되어 있다. ([checkCode](https://github.com/mayajuni/realtime-project/blob/b71e4026f3a36c68fd2958022a8ab5ba5332ce6e/server/src/app.server.ts#L54)) 이것들의 각각의 역활은 아래와 같다.

1. route
   - 어떤 라우터로 이동할지 선언한다.
2. action
   - router 안에 있는 함수 명을 말한다.
3. payload
   - 흔히 말하는 pramemter를 말한다.

예)

```javascript
// client
ws.send(JSON.stringify({route: 'Board', action: 'addBoard', payload: {title: 'title', content: 'content'}}));

// server
@Router()
class Board {
  /**
   * ws: https://github.com/mayajuni/realtime-project/blob/master/server/src/models/definitions/websocket.d.ts 확인
   * send: client 전달
   * r: rethinkDB object
   */
  addBoard({route, action, payload, ws, send, r}) {
    console.log(payload) // {title: 'title', content: 'content'}
  }
}
```



#### 라우터 추가

라우터는 아래와 같이 구성 되어 있다. 만들고 나면 router 안에 있는 [index.ts](https://github.com/mayajuni/realtime-project/blob/b71e4026f3a36c68fd2958022a8ab5ba5332ce6e/server/src/router/index.ts)에 추가 하면 된다.

```javascript
@Router()
export class RouteName {
  actionName (){    
  }
}
```

#### 라우터 내부 구성

현재 서버는 기본 api만 사용 가능하다. 기본 api를 보면 모든 메세지는 한곳에서 받게 되어 있다.(onmessage) 그래서 socket.io와 같은 프레임워크의 내부를 보면 EventEmitter를 사용하고 있다.(node 내부 EventEmitter를 사용하진 않는다. 다른 모듈 사용) 나 또한 라우터는 필수적으로 필요하여 EventEmitter를 사용하게 되었고 좀더 편하게 쓰기 위해서 @Router라는 es7의 decorator를 만들어서 사용했다. 코드를 보면 좀더 이해하기 편할 것이라 생각이 든다. ([router.decorator.ts](https://github.com/mayajuni/realtime-project/blob/b71e4026f3a36c68fd2958022a8ab5ba5332ce6e/server/src/decorators/router.decorator.ts))



## Validation

Vailidation은 [Json-schema](http://json-schema.org/)의 사용하고 있다. action이 실행 되기 전에 유효성 체크를 하며, 개발시 좀더 쉽게 쓰기 위해서 es7의 decorator로 만들어져 있다. ([validation.decorator.ts](https://github.com/mayajuni/realtime-project/blob/b71e4026f3a36c68fd2958022a8ab5ba5332ce6e/server/src/decorators/validation.decorator.ts))

예) 

```javascript
const jsonSchema = {
  description: '좀더 제세한 api는 http://json-schema.org/를 참고 하면 좋다. 다양하게 지원한다.',
    properties: {
        id: {
            description: 'id',
            type: 'string'
        }
    },
    required: ['id']
}

@Router()
class Board {
  @Validation(jsonSchema)
  addBoard({route, action, payload, ws, send, r}) {
    console.log(payload) // {title: 'title', content: 'content'}
  }
}
```



## Error

모든 error는 아래와 같이 client로 보내진다.

```javascript
ws.send(JSON.stringify({route: 'error', payload: {error: {name: error.name, message: error.message, code: error.code}}}));
```

