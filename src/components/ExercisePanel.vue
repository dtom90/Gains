<template>
  <f7-block
    :class="'exercise-block bg-color-'+(rest ? 'green' : 'red')"
  >
    <!-- Status & Exercise -->
    <p
      class="exercise-target text-shadow"
      style="margin-bottom: 0;"
    >
      <span>{{ adjective }}:</span>
    </p>
    <p :class=" (rest && numbersEntered ? 'numbers-entered numbers-entered-' : '') + 'exercise-name text-shadow'">
      <span>{{ exercise.name }}</span>
    </p>

    <!-- Weight & Reps Target -->
    <div
      v-if="!rest"
      class="exercise-target text-shadow display-flex justify-content-center"
    >
      <div style="font-size: 40px;">
        <div v-if="weight > 0">
          <span>{{ weight }} lbs.</span>
        </div>
        <div>
          <span>{{ reps }} rep{{ reps > 1 ? 's' : '' }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="rest && numbersEntered"
      class="numbers-entered text-shadow"
      style="margin: 0;"
    >
      <div>
        <set-numbers
          :weight="weight"
          :reps="reps"
        />
      </div>
    </div>

    <!-- Weight & Reps Inputs -->
    <f7-block
      v-if="rest && !numbersEntered"
      class="input-block display-flex justify-content-center"
    >
      <f7-list
        class="input-list"
        no-hairlines-md
      >
        <f7-list-input
          id="weight-picker"
          class="input-item color-white"
          inline-label
          type="text"
          readonly
          error-message="Only positive numbers please!"
          validate
          min="0"
          pattern="[0-9]*"
          outline
          @change="weight = parseInt($event.target.value)"
        >
          <div
            slot="inner"
            class="item-label"
          >
            <span>&nbsp;&nbsp;&nbsp;lbs.</span>
          </div>
        </f7-list-input>

        <f7-list-input
          id="rep-picker"
          class="input-item color-white"
          inline-label
          type="text"
          readonly
          error-message="Only positive numbers please!"
          validate
          min="1"
          pattern="[0-9]*"
          outline
          @change="reps = parseInt($event.target.value)"
        >
          <div
            slot="inner"
            class="item-label"
          >
            <span>&nbsp;&nbsp;&nbsp;reps</span>
          </div>
        </f7-list-input>

        <f7-button
          id="enter-button"
          class="big-button submit-button"
          large
          fill
          raised
          @click="enterNumbers(weight, reps)"
        >
          Enter
        </f7-button>
      </f7-list>
    </f7-block>

    <!-- Done Button -->
    <f7-button
      v-if="!rest"
      class="big-button submit-button"
      large
      fill
      raised
      color="green"
      @click="onEndSet"
    >
      Done
    </f7-button>
  </f7-block>
</template>

<script>
import { f7Block, f7List, f7ListInput, f7Button } from 'framework7-vue'
import SetNumbers from './SetNumbers'
import picker from '../js/picker'

export default {

  name: 'ExercisePanel',
  components: { SetNumbers, f7Block, f7List, f7ListInput, f7Button },
  props: {
    exercise: {
      type: Object,
      default: () => null
    },
    rest: {
      type: Boolean,
      default: false
    },
    numbersEntered: {
      type: Boolean,
      default: false
    },
    onEndSet: {
      type: Function,
      default: () => null
    },
    enterNumbers: {
      type: Function,
      default: () => null
    }
  },
  data: () => ({
    reps: null,
    weight: null
  }),
  computed: {
    adjective () { return this.rest ? (this.rest ? 'Completed' : 'Next') : 'Now' }
  },
  watch: {
    exercise: function (newExercise) {
      this.weight = newExercise.weight
      this.reps = newExercise.reps
    },
    rest: function (rest) {
      if (rest) {
        this.$nextTick(() => {
          const self = this
          this.weightPicker = picker.weightPicker(this.$f7, '#weight-picker input', this.weight,
            function (picker) {
              picker.$inputEl.trigger('focus')
              picker.$el.find('.open-rep-picker').on('click', () => {
                picker.close()
                self.repPicker.open()
              })
            },
            function (picker) {
              picker.$inputEl.trigger('blur')
            },
            '#enter-button'
          )
          this.repPicker = picker.repPicker(this.$f7, '#rep-picker input', this.reps,
            function (picker) {
              picker.$inputEl.trigger('focus')
              picker.$el.find('.open-weight-picker').on('click', () => {
                picker.close()
                self.weightPicker.open()
              })
            },
            function (picker) {
              picker.$inputEl.trigger('blur')
            },
            '#enter-button'
          )
          this.repPicker.open()
        })
      }
    }
  },
  mounted () {
    if (this.exercise) {
      this.weight = this.exercise.weight
      this.reps = this.exercise.reps
    }
  },
  methods: {
    openWeightPicker () { this.weightPicker.open() },
    openRepsPicker () { this.repsPicker.open() }
  }
}
</script>

<style scoped>
  /*noinspection CssUnusedSymbol*/
  .exercise-block {
    margin-top: 28px;
    margin-bottom: 28px;
    border-radius: 5px;
    padding: 16px;
    font-size: 18px;
  }
  .text-shadow {
    text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }
  /*noinspection CssUnusedSymbol*/
  .exercise-name {
    margin: 0;
    font-size: 48px;
    font-weight: bold;
    text-align: center;
  }
  .exercise-target {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  /*noinspection CssUnusedSymbol*/
  .numbers-entered-exercise-name {
    font-size: 36px !important;
  }
  .numbers-entered {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin: 0;
  }
  .submit-button {
    max-width: 242px;
  }
  #enter-button {
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .input-block {
    margin-top: 16px;
    margin-bottom: 0;
  }
  .input-list {
    margin: 0;
    max-width: 200px;
  }
  .input-item:first-of-type {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .input-item {
    background-color: #2FD073;
  }
  .input-item * {
    font-size: 20px !important;
    font-weight: bold;
  }
  .item-label {
    line-height: 24px;
  }
</style>

<style>
  .big-button {
    height: auto;
    font-weight: bold !important;
    font-size: 32px !important;
    padding: 12px;
    margin: 12px auto 12px auto;
  }
  .input-list > ul {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .input-item {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
  .input-list input {
    font-size: 20px !important;
    font-weight: bold;
    text-align:right;
    background-color: #2FD073 !important;
  }
</style>
