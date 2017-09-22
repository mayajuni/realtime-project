import eventEmiter from '../../modules/event-emiter/event-emiter.module'
import socketClient from '../../modules/socket/socket-client.module'

const socketPlugin = store => {
  /* 저장소가 초기화 될 때 실행 */
  eventEmiter.on('@onMessage', ({router, action, payload}) => {

  })

  /**
   * event sourcing 방식 처럼 store의 state중 events라는 친구를 구독한다.
   * send 메소드를 호출후 해당 events를 삭제 하는 엑션을 실행한다
   */
  store.subscribe((mutation, state) => {
    if (mutation.type === '') {
      const payload = mutation.payload
      socketClient.send(payload.router, payload.action, payload.payload)
      store.dispatch('', state.events.length - 1)
    }
  })
}

export default socketPlugin
