<template>
  <div class="card-info row no-gutters">
    <div class="text col-11" v-if="!enableInput" @click="showInput">
      {{ card.title }}
    </div>
    <div class="input col-11" v-if="enableInput">
      <input class="form-control" placeholder="card-title" ref="title" v-model="cardTitle" @blur="hideInput"
             v-on:keyup.enter="updateCard">
    </div>
    <div class="remove col-1" @click="remove">
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
      updateCard () {
        this.enableInput = false
        if (this.card.title !== this.cardTitle) {
          this.card.title = this.cardTitle
          this.$emit('updateCard', this.card)
        }
      },
      hideInput () {
        // 삭제 버튼 때문에 셋타임아웃을 걸어 놓는다.
        this.enableInput = false
        this.updateCard()
      },
      remove () {
        this.isRemove = true
        this.$emit('remove', this.card.id)
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
