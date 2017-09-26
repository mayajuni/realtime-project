<template>
  <div>
    <div class="list-title" v-if="!enableInput" @click="toggleInput">{{ list.title }}</div>
    <div class="list-title" v-if="enableInput" @click="toggleInput">213</div>
    <div class="content">
      <draggable :list="list.cards" :options="{group:'cards'}" class="cards" :list-id="list.id">
        <div v-for="card, index in list.cards" :key="index" class="task">
          <kanban-card :card="card"></kanban-card>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import kanbanCard from '../card/card.component.vue'

  export default {
    name: 'kanvan-list',
    props: {
      list: Object
    },
    data () {
      return {
        enableInput: false
      }
    },
    methods: {
      toggleInput () {
        this.enableInput = !this.enableInput
      }
    },
    components: {
      kanbanCard,
      draggable
    }
  }
</script>

<style scoped lang='scss'>
  .list-title {
    padding: 5px 10px;
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

    .cards {
      min-height: 10px;
    }

    .sortable-ghost {
      opacity: .2;
    }
  }
</style>
