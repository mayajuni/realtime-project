<template>
  <div class="row no-gutters">
    <div class="card-info col-11">
      <div class="text" v-if="!enableInput" @click="toggleInput">
        {{ card.title }}
      </div>
      <div class="input" v-if="enableInput">
        <input class="form-control" placeholder="card-title" ref="title" v-model="cardTitle" @blur="toggleInput">
      </div>
    </div>
    <div class="remove col-1" v-show="enableInput">
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
      toggleInput () {
        this.enableInput = !this.enableInput
        if (this.enableInput) {
          this.cardTitle = this.card.title
          this.$nextTick(() => this.$refs.title.focus())
        } else {
          this.card.title = this.cardTitle
        }
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
