<template>
  <div class="kanban">
    <div class="kanban-wrapper">
      <div class="icons">
        <div>
          <a href="https://nodejs.org/en/" target="_blank"><img
            src="https://img.shields.io/badge/node-8.1.2-brightgreen.svg"></a>
          <a href="https://vuejs.org/" target="_blank"><img src="https://img.shields.io/badge/vue-2.x-brightgreen.svg"></a>
          <a href="https://www.rethinkdb.com/" target="_blank"><img
            src="https://img.shields.io/badge/rethinkDB-2.x-brightgreen.svg"></a>
          <a href="https://en.wikipedia.org/wiki/MIT_License" target="_blank"><img
            src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
          <a href="https://github.com/mayajuni/realtime-project" target="_blank"><img
            src="https://img.shields.io/badge/github-repositories-blue.svg"></a>
        </div>
      </div>
      <h3>
        Kanban-board
      </h3>
      <div class="board-canvas">
        <div class="board">
          <draggable :list="lists" :options="{group:'lists'}">
            <div v-for="list, index in lists" :key="index" class="list">
              <kanban-list :list="list"></kanban-list>
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

  export default {
    name: 'kanvan',
    data () {
      return {
        enableInput: false,
        lists: [
          {
            id: 1,
            title: 'list 1',
            cards: [
              {id: 1, title: 'Task 1'},
              {id: 2, title: 'Task 2'},
              {id: 3, title: 'Task 3'}
            ]
          },
          {
            id: 2,
            title: 'list 2',
            cards: [
              {id: 4, title: 'Task 4'},
              {id: 5, title: 'Task 5'},
              {id: 6, title: 'Task 6'}
            ]
          }
        ]
      }
    },
    methods: {
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
