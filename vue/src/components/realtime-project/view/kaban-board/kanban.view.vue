<template>
  <div class="kanban">
    <div class="kanban-wrapper">
      <header>
        <div class="github">
          <iframe src="https://ghbtns.com/github-btn.html?user=mayajuni&repo=realtime-project&type=star" frameborder="0"
                  scrolling="0" width="170px" height="20px"></iframe>
        </div>
        <div class="icon">
          <a href="https://nodejs.org/en/" target="_blank"><img
            src="https://img.shields.io/badge/node-8.1.2-brightgreen.svg"></a>
          <a href="https://vuejs.org/" target="_blank"><img src="https://img.shields.io/badge/vue-2.x-brightgreen.svg"></a>
          <a href="https://www.rethinkdb.com/" target="_blank"><img
            src="https://img.shields.io/badge/rethinkDB-2.x-brightgreen.svg"></a>
          <a href="https://en.wikipedia.org/wiki/MIT_License" target="_blank"><img
            src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
        </div>

        <h3>
          Kanban-board
        </h3>
      </header>
      <div class="board-canvas">
        <div class="board">
          <draggable :list="lists" :options="{group:'lists'}">
            <div v-for="list in lists" class="list">

              <div class="list-title">{{ list.title }}</div>

              <div class="content">
                <draggable :list="list.tasks" :options="{group:'tasks', draggable: '.task'}" class="tasks" :list-id="list.id">
                  <div v-for="task in list.tasks" :task-id="task.id" class="task">
                    <span>{{ task.title }}</span>
                  </div>
                </draggable>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'kanvan',
    data () {
      return {
        lists: [
          {
            id: 1,
            title: 'list 1',
            tasks: [
              {id: 1, title: 'Task 1'},
              {id: 2, title: 'Task 2'},
              {id: 3, title: 'Task 3'}
            ]
          },
          {
            id: 2,
            title: 'list 2',
            tasks: [
              {id: 4, title: 'Task 4'},
              {id: 5, title: 'Task 5'},
              {id: 6, title: 'Task 6'}
            ]
          }
        ]
      }
    },
    components: {
      draggable
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

      header {
        padding: 0 8px;
        .github {
          padding-top: 15px;
        }

        h3 {
          text-align: center;
          padding: 5px 0;
          margin: 0;
        }
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

            .list-title {
              padding: 5px;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
              color: #dddddd;
              background-color: #252b74;
            }

            .content {
              padding: 10px;
              background-color: white;
              border: 1px solid #252b74;
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;

              .tasks {
                min-height: 10px;
              }
            }
          }
        }
      }

      .sortable-ghost {
        opacity: .2;
      }
    }
  }
</style>
