<template>
  <div>
    <div class="header row no-gutters">
      <div class="list-title col-11">
        <div class="text" v-if="!enableInput" @click="toggleInput">
          {{ listTitle }}
        </div>
        <div class="input" v-if="enableInput">
          <input class="form-control" placeholder="list-title" ref="title" v-model="listTitle" @blur="toggleInput">
        </div>
      </div>
      <div class="remove col-1">
        x
      </div>
    </div>
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
        listTitle: '',
        enableInput: false
      }
    },
    created () {
      this.listTitle = this.list.title
    },
    methods: {
      toggleInput () {
        this.enableInput = !this.enableInput
        if (this.enableInput) {
          this.listTitle = this.list.title
          this.$nextTick(() => this.$refs.title.focus())
        } else {
          this.list.title = this.listTitle
        }
      }
    },
    components: {
      kanbanCard,
      draggable
    }
  }
</script>

<style scoped lang='scss'>
  .header {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    color: #dddddd;
    background-color: #252b74;

    .list-title {
      cursor: pointer;

      .text {
        padding: 6px 10px;
      }

      .input {
        padding: 5px 5px;

        input {
          padding: 3px 6px;
          line-height: 1;
          border-radius: .2rem;
        }
      }
    }

    .remove {
      cursor: pointer;
      text-align: center;
      padding: 6px 5px 6px 0;
      font-weight: 600;
    }
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
