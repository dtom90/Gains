<template>
  <f7-block class="rest-block">
    <p
      v-if="countdown > 0"
      class="large-text text-align-center"
    >
      Rest: {{ countdown }}
    </p>
    <div
      class="display-flex justify-content-space-between large-text"
    >
      <div
        class="display-flex align-items-center"
      >
        <span>Next:&nbsp;&nbsp;</span>
      </div>
      <strong style="font-size: 36px; text-align: center;">{{ nextExercise.name }}</strong>
      <span style="flex-basis: 68.2px;" />
    </div>
    <div class="display-flex justify-content-center">
      <SetNumbers
        :weight="nextExercise.weight"
        :reps="nextExercise.reps"
        class="large-text"
      />
    </div>
    <f7-button
      class="col big-button"
      large
      fill
      raised
      color="red"
      @click="endRest"
    >
      <span>Skip Rest</span>
    </f7-button>
  </f7-block>
</template>

<script>
import { f7Block, f7Button } from 'framework7-vue'
import SetNumbers from './SetNumbers'

export default {
  name: 'RestPanel',
  
  components: { SetNumbers, f7Block, f7Button },
  
  props: {
    restTime: {
      type: Number,
      default: 30
    },
    onEndRest: {
      type: Function,
      default: () => {
      }
    },
    nextExercise: {
      type: Object,
      default: () => ({})
    }
  },
  
  data: () => ({
    timer: null,
    countdown: null
  }),
  
  created () {
    this.countdown = this.restTime
    this.timer = setInterval(this.decrementCountdown, 1000)
  },
  
  methods: {
    
    // Countdown function during rest
    decrementCountdown () {
      if (this.countdown > 1) {
        this.countdown -= 1
      } else {
        this.endRest()
      }
    },
    
    // Finish countdown, clear timer, call onEndRest
    endRest () {
      clearInterval(this.timer)
      this.countdown = 0
      this.onEndRest()
    }
  }
}
</script>

<style scoped>
p {
  margin-top: 12px;
  margin-bottom: 12px;
}

.big-button {
  margin: 12px;
}

.rest-block {
  background-color: darkred;
  border-radius: 5px;
  padding: 16px;
  margin-top: 28px;
  margin-bottom: 28px;
}
</style>
