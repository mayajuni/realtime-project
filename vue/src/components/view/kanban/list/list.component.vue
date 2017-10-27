<template>
  <div>
    <div class="header row no-gutters">
      <div class="list-title col-11">
        <div class="text" v-if="!enableInput" @click="showInput">
          {{ this.list.title }}
        </div>
        <div class="input" v-if="enableInput">
          <input class="form-control" placeholder="list title" ref="title" v-model="listTitle" @blur="hideInput"
                 v-on:keyup.enter="hideInput">
        </div>
      </div>
      <div class="remove col-1" @click="removeList">
        x
      </div>
    </div>
    <div class="content">
      <div class="input-group input-group-sm">
        <input class="form-control" placeholder="card title" v-model="cardTitle" v-on:keyup.enter="addCard">
        <span class="input-group-addon" id="basic-addon2" @click="addCard">+</span>
      </div>
      <draggable :list="list.cards" :options="{group:'cards'}" class="cards" :list-id="list.id" @change="moved">
        <div v-for="card, index in list.cards" :key="index" class="task">
          <kanban-card :card="card" @remove="removeCard" @changeCard="changeCard"></kanban-card>
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
        cardTitle: '',
        enableInput: false
      }
    },
    methods: {
      moved (test) {
        console.log(test)
      },
      showInput () {
        this.enableInput = true
        this.listTitle = this.list.title
        this.$nextTick(() => this.$refs.title.focus())
      },
      hideInput () {
        this.enableInput = false
        if (this.list.title !== this.listTitle) {
          this.list.title = this.listTitle
          /* 무언가 변경이 이루어진다는 것을 최상위에 알린다. */
          this.$emit('updateList', this.list)
        }
      },
      removeList () {
        this.$emit('removeList', this.list.id)
      },
      addCard () {
        if (this.cardTitle) {
          this.list.cards.unshift({id: Date.now().toString(), title: this.cardTitle})
          this.cardTitle = ''
          this.$emit('changeList')
        }
      },
      changeCard () {
        this.$emit('changeList')
      },
      removeCard (cardId) {
        this.list.cards = this.list.cards.filter(card => card.id !== cardId)
        /* 무언가 변경이 이루어진다는 것을 최상위에 알린다. */
        this.$emit('changeList')
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

    .input-group {
      margin-bottom: 10px;
    }

    .cards {
      min-height: 10px;
    }

    .sortable-ghost {
      opacity: .2;
    }
  }
</style>
