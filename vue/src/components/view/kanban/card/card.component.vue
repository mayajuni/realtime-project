<template>
  <div class="card-info row no-gutters">
    <div class="text col-11" v-if="!enableInput" @click="showInput">
      {{ card.title }}
    </div>
    <div class="input col-11" v-if="enableInput">
      <input class="form-control" placeholder="card-title" ref="title" v-model="cardTitle" @blur="hideInput"
             v-on:keyup.enter="updateCardTitle">
    </div>
    <div class="remove col-1" @click="deleteCard">
      x
    </div>
  </div>
</template>

<script>
  export default {
    name: 'kanvan-list',
    props: {
      card: Object
    },
    data () {
      return {
        cardTitle: '',
        enableInput: false
      }
    },
    methods: {
      showInput () {
        this.enableInput = true
        this.cardTitle = this.card.title
        this.$nextTick(() => this.$refs.title.focus())
      },
      updateCardTitle () {
        this.enableInput = false
        if (this.card.title !== this.cardTitle) {
          this.card.title = this.cardTitle
          this.$emit('updateCardTitle', this.card)
        }
      },
      hideInput () {
        this.enableInput = false
        this.updateCardTitle()
      },
      deleteCard () {
        this.$emit('deleteCard', this.card.id)
      }
    }
  }
</script>

<style scoped lang='scss'>
  .card-info {
    cursor: pointer;
    position: relative;

    .text {
      padding: 1px 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .input {
      padding: 0px 0px;

      input {
        padding: 3px 3px;
        line-height: 1;
        border-radius: .2rem;
      }
    }

    .remove {
      display: none;
      cursor: pointer;
      text-align: center;
      font-weight: 600;
    }

    &:hover {
      .remove {
        display: block;
      }
    }
  }
</style>
