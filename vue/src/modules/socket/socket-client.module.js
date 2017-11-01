import eventEmiter from '../event-emiter/event-emiter.module'

class SocketClient {
  constructor () {
    const host = location.hostname === 'localhost' ? `${location.hostname}:3000` : 'socket.toclick.net'
    this.url = `ws://${host}`
    this.reconnectDelay = [300, 1000, 5, 1.3]
    this.retries = this.reconnectDelay[2] || Infinity
    this.subscribes = new Set()
  }

  reconnect () {
    if (!this.reconnecting && this.reconnect && this.retries) {
      this.retries--
      this.reconnecting = true
      const reconnectDelay = this.reconnectDelay
      const retries = this.retries
      const initialDelay = Math.round(reconnectDelay[0] + Math.random() * reconnectDelay[1])

      // connect를 할때 딜레이를 준다.
      const delay = initialDelay + initialDelay * ~~(reconnectDelay[2] - retries) ^ reconnectDelay[3]
      setTimeout(() => {
        console.log(`[syncro] reconnecting(delayed ${delay}ms)... (${retries} retries left)`)
        this.connect()
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
      this.retries = this.reconnectDelay[2] || Infinity

      eventEmiter.emit('@connected')
      if (this.reconnecting) {
        this.resubscribe()
      }
      this.reconnecting = false
    }

    ws.onclose = async event => {
      console.log('[socket] websocket disconnected')
      this.reconnecting = false
      this.reconnect()
    }

    ws.onmessage = event => {
      const params = JSON.parse(event.data)
      /* 메세지 온것들은 모두 store의 plugin에서 처리한다. */
      eventEmiter.emit('@onMessage', params)
    }
  }

  send (route, action, payload) {
    return this.ws.send(JSON.stringify({route, action, payload}))
  }

  subscribe (route) {
    this.subscribes.add(route)
    this.send(route, 'subscribe')
  }

  unsubscribe (route) {
    this.send(route, 'unsubscribe')
  }

  resubscribe () {
    this.subscribes.forEach(route => this.send(route, 'subscribe'))
  }
}

const socketClient = new SocketClient()

export default socketClient
