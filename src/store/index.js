// Import Vue
import Vue from 'vue'
import Vuex from 'vuex'

import sampleState from './sampleState'

Vue.use(Vuex)

console.log('process.env.LOAD_SAMPLE_STATE')
console.log(process.env.LOAD_SAMPLE_STATE)
const state = process.env.LOAD_SAMPLE_STATE ? sampleState : {
  workouts: [],
  completed: {}
}

const store = new Vuex.Store({
  state,
  mutations: {
    addWorkout (state, { name, exercises, rounds }) {
      state.workouts.push(
        Object.assign(
          { id: name.replace(/[^a-z0-9]/gi, '_').toLowerCase() }, { name, exercises, rounds }
        )
      )
    },
    startActiveWorkout (state, { workoutId, startTime }) {
      if (!(workoutId in state.completed)) {
        state.completed[workoutId] = {}
      }
      state.completed[workoutId][startTime] = { exercises: [] }
      state.completed[workoutId].lastWorkoutTime = startTime
    },
    addCompletedExercise (state, { workoutId, startTime, exercise, round, completedTime }) {
      state.completed[workoutId][startTime].exercises.push({
        exercise: exercise.name,
        weight: exercise.weight,
        reps: exercise.reps,
        round,
        completedTime
      })
    },
    addCompletedSet (state, { workoutId, workoutTime, time, weight, reps }) {
      const matching = state.completed[workoutId][workoutTime].exercises.filter(ex => ex.completedTime === time)
      if (matching.length > 0) {
        matching[0].weight = weight
        matching[0].reps = reps
      } else {
        console.error(`Exercise with completed time ${time} could not be found.`)
      }
    }
  }
})

export default store
