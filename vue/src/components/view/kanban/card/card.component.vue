<template>
  <div class="card-info">
    <div class="text" v-if="!enableInput" @click="showInput">
      {{ card.title }}
    </div>
    <div class="input row no-gutters" v-if="enableInput">
      <input class="form-control col-11" placeholder="card-title" ref="title" v-model="cardTitle" @blur="closeInput">
      <div class="remove col-1" @click="remove" v-show="enableInput">
        x
      </div>
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
        enableInput: false,
        isRemove: false
      }
    },
    methods: {
      showInput () {
        this.enableInput = true
        this.cardTitle = this.card.title
        this.$nextTick(() => this.$refs.title.focus())
      },
      closeInput () {
        // 삭제 버튼 때문에 셋타임아웃을 걸어 놓는다.
        setTimeout(() => {
          this.enableInput = false
          if (!this.isRemove) {
            this.card.title = this.cardTitle
          } else {
            this.isRemove = false
          }
        }, 10)
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
  }

  .remove {
    cursor: pointer;
    text-align: center;
    font-weight: 600;
  }
</style>
