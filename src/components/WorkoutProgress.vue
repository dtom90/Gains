<template>
  <f7-block style="margin-top: 8px;">
    <div class="display-flex">
      <!-- Round Counter -->
      <div id="workout-round">
        Round {{ currentRound }} of {{ totalRounds }}
      </div>
      <!-- Time Elapsed -->
      <div id="time-elapsed">
        {{ elapsedWorkoutTime }}
      </div>
    </div>
    <div id="progress-container">
      <span class="progress-text">Progress: {{ workoutPercentage }} %</span>
      <span
        class="progress-bar"
        :style="`width: ${workoutPercentage}%;`"
      />
    </div>
  </f7-block>
</template>

<script>
import { f7Block } from 'framework7-vue'

export default {
  name: 'WorkoutProgress',
  components: { f7Block },
  props: {
    currentRound: {
      type: Number,
      default: 0
    },
    totalRounds: {
      type: Number,
      default: 0
    },
    elapsedWorkoutTime: {
      type: String,
      default: '00:00'
    },
    workoutPercentage: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
    #workout-round {
        font-size: 24px;
        font-weight: bold;
    }
    #time-elapsed {
        flex: 1;
        text-align: right;
        font-weight: bold;
        font-size: 24px;
    }
    #progress-container {
        background-color: #A6A6A6;
        margin-top: 10px;
        border-radius: 5px;
        position: relative;
        text-align: center;
        font-weight: bold;
        font-size: 24px;
    }
    .progress-bar {
        background-color: #27AE60;
        position: absolute;
        left: 0;
        height: 100%;
        border-top-left-radius: inherit;
        border-bottom-left-radius: inherit;
    }
    .progress-text {
        position: relative;
        z-index: 1;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
</style>
