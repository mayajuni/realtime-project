<template>
  <div class="kanban">
    <div class="kanban-wrapper">
      <div class="icons">
        <div>
          <a href="https://nodejs.org/en/" target="_blank">
            <img src="https://img.shields.io/badge/node-8.1.2-brightgreen.svg">
          </a>
          <a href="https://vuejs.org/" target="_blank">
            <img src="https://img.shields.io/badge/vue-2.x-brightgreen.svg">
          </a>
          <a href="https://www.rethinkdb.com/" target="_blank">
            <img src="https://img.shields.io/badge/rethinkDB-2.x-brightgreen.svg">
          </a>
          <a href="https://github.com/uNetworking/uWebSockets" target="_blank">
            <img src="https://img.shields.io/badge/uws-8.x-brightgreen.svg">
          </a>
          <a href="https://www.typescriptlang.org/" target="_blank">
            <img src="https://img.shields.io/badge/typescript-2.x-brightgreen.svg">
          </a>
          <a href="https://en.wikipedia.org/wiki/MIT_License" target="_blank">
            <img src="https://img.shields.io/badge/license-MIT-blue.svg">
          </a>
          <a href="https://github.com/mayajuni/realtime-project" target="_blank">
            <img src="https://img.shields.io/badge/github-repositories-blue.svg">
          </a>
        </div>
      </div>
      <h3>
        Kanban-board
      </h3>
      <div class="add-list">
        <div class="input-group input-group-sm">
          <input class="form-control" placeholder="list title" v-model="listTitle" v-on:keyup.enter="addList">
          <span class="input-group-addon" id="basic-addon2" @click="addList">ADD</span>
        </div>
      </div>
      <div class="board-canvas">
        <div class="board">
          <draggable :list="lists" :options="{group:'lists'}" @change="change">
            <div v-for="list, index in lists" :key="index" class="list">
              <kanban-list :list="list" @removeList="removeList" @updateList="updateList"
                           @removeCard="removeCard" @addCard='addCard' @moveCard="moveCard" @updateCard="updateCard"></kanban-list>
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import kanbanList from './list/list.component.vue'
  import { mapGetters } from 'vuex'
  import socketClient from '../../../modules/socket/socket-client.module'

  export default {
    name: 'kanvan',
    data () {
      return {
        enableInput: false,
        listTitle: ''
      }
    },
    created () {
      socketClient.subscribe('Kanban')
    },
    beforeDestroy () {
      socketClient.unsubscribe('Kanban')
    },
    methods: {
      change (event) {
        if (event.moved) {
          const moved = event.moved
          const list = {...moved.element, order: moved.newIndex}
          this.addEvent('moveList', list)
        }
      },
      removeList (listId) {
        this.addEvent('removeList', {id: listId})
      },
      addList () {
        if (this.listTitle) {
          const order = this.$store.getters.lists.length
          this.addEvent('addList', {title: this.listTitle, cards: [], order})
          this.listTitle = ''
        }
      },
      updateList (list) {
        this.addEvent('updateList', list)
      },
      moveCard (card) {
        this.addEvent('moveCard', card)
      },
      addCard (card) {
        this.addEvent('addCard', card)
      },
      removeCard (ids) {
        this.addEvent('removeCard', ids)
      },
      updateCard (card) {
        this.addEvent('updateCard', card)
      },
      addEvent (action, payload) {
        this.$store.dispatch('addEvent', {
          router: 'Kanban',
          action: action,
          payload: payload
        })
      }
    },
    computed: {
      ...mapGetters([
        'lists'
      ])
    },
    components: {
      draggable,
      kanbanList
    }
  }
</script>

<style scoped lang='scss'>
  .kanban {
    position: absolute;
    left: 0;
    right: 0;
    top: 134px;
    bottom: 0;

    .kanban-wrapper {
      height: 100%;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      flex-direction: column;
      margin-right: 0;
      transition: margin .1s ease-in;

      .icons {
        padding: 15px 8px 0;
      }

      h3 {
        text-align: center;
        padding: 15px 0;
      }

      .add-list {
        max-width: 350px;
        padding: 10px;
        margin-bottom: 10px;
      }

      .board-canvas {
        position: relative;
        -webkit-box-flex: 1;
        -webkit-flex-grow: 1;
        flex-grow: 1;

        .board {
          user-select: none;
          white-space: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          padding: 0 8px;

          .list {
            width: 270px;
            margin: 0 5px;
            height: 100%;
            box-sizing: border-box;
            display: inline-block;
            vertical-align: top;
            white-space: nowrap;
          }
        }
      }

      .sortable-ghost {
        opacity: .2;
      }
    }
  }
</style>
