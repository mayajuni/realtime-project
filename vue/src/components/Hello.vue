<template>
  <div>
    <draggable :list="lanes" :options="{group:'lanes'}">
      <div v-for="lane in lanes" class="test">

        <span class="lane-title">{{ lane.title }}</span>

        <div class="wrapper">
          <draggable :list="lane.tasks" :options="{group:'tasks'}" class="tasks" :lane-id="lane.id">
            <div v-for="task in lane.tasks" :task-id="task.id" class="task">
              <span>{{ task.title }}</span>
            </div>
          </draggable>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'hello',
    data () {
      return {
        lanes: [
          {
            id: 1,
            title: 'lane 1',
            tasks: [
              {id: 1, title: 'Task 1'},
              {id: 2, title: 'Task 2'},
              {id: 3, title: 'Task 3'}
            ]
          },
          {
            id: 2,
            title: 'lane 2',
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
  .test {
    width: 30%;
    border: 1px solid #ddd;
    margin: 5px;
    float: left;

    div {
      border: 1px solid #ddd;
    }
  }

  .sortable-ghost {
    opacity: .2;
  }
</style>
