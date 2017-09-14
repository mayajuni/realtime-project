import eventEmiter from '../event-emiter/event-emiter.module'

class SocketClient {
  constructor () {
    this.url = `ws://localhost:3000`
    this.reconnect = [300, 2000, 5, 1.3]
    this.retries = this.reconnect[2] || Infinity
  }

  reconnect () {
    if (!this.reconnecting && this.reconnect && this.retries) {
      this.retries--
      this.reconnecting = true
      const initialDelay = Math.round(this.reconnect[0] + Math.random() * this.reconnect[1])

      // connect를 할때 딜레이를 준다.
      const delay = initialDelay + initialDelay * ~~(this.reconnect[2] - this.retries) ^ this.reconnect[3]
      setTimeout(() => {
        console.log(`[syncro] reconnecting(delayed ${delay}ms)... (${this.retries} retries left)`)
        this.connect()
        this.reconnecting = false
      }, delay)
    }
  }

  connect () {
    const ws = this.ws = new window.WebSocket(this.url)
    ws.onerror = (err) => {
      console.error(err)
      this.reconnect()
    }

    ws.onopen = async event => {
      console.log('[socket] websocket connected to: ' + this.url)
      // reset retries to max on new connection
      this.retries = this.reconnect[2] || Infinity

      eventEmiter.emit('@connected')
    }

    ws.onclose = async event => {
      console.log('[socket] websocket disconnected')
      this.reconnect()
    }

    ws.onmessage = event => {
      const params = JSON.parse(event.data)
      /* 메세지 온것들은 모두 store의 plugin에서 처리한다. */
      eventEmiter.emit('@onMessage', params)
    }
  }

  send (router, action, payload) {
    return this.ws.send(JSON.stringify({router, action, payload}))
  }
}

const socketClient = new SocketClient()

export default socketClient
