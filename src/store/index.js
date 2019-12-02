// Import Vue
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist/dist/umd'

import sampleState from './sampleState'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage
})

const state = process.env.LOAD_SAMPLE_STATE ? sampleState : {
  workouts: [],
  completed: {},
  numbersEntered: false
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
    editWorkout (state, { id, name, exercises, rounds }) {
      const workout = state.workouts.filter(w => w.id === id)[0]
      if (workout.name !== name) {
        Vue.set(workout, 'id', name.replace(/[^a-z0-9]/gi, '_').toLowerCase())
        Vue.set(workout, 'name', name)
      }
      Vue.set(workout, 'exercises', exercises)
      Vue.set(workout, 'rounds', rounds)
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
        weight: null,
        reps: null,
        round,
        completedTime
      })
    },
    addCompletedSet (state, { workoutId, workoutTime, completedTime, weight, reps }) {
      const idx = state.completed[workoutId][workoutTime].exercises.findIndex(ex => ex.completedTime === completedTime)
      if (idx >= 0) {
        state.completed[workoutId][workoutTime].exercises[idx].weight = weight
        state.completed[workoutId][workoutTime].exercises[idx].reps = reps
        state.numbersEntered = true
      }
    },
    resetNumbersEntered (state) {
      state.numbersEntered = false
    }
  },
  plugins: [vuexLocalStorage.plugin]
})

export default store
