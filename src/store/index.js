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
    addCompletedSet (state, { workoutId, workoutStartTime, exerciseName, round, weight, reps, completedTime }) {
      state.completed[workoutId][workoutStartTime].exercises.push({
        exercise: exerciseName,
        weight,
        reps,
        round,
        completedTime
      })
    },
    modifyCompletedSet (state, { workoutId, workoutStartTime, setIndex, type, value }) {
      if (['weight', 'reps'].includes(type)) {
        Vue.set(state.completed[workoutId][workoutStartTime].exercises[setIndex], type, value)
      }
    },
    deleteWorkoutRecords (state, { workoutId, times }) {
      times.forEach(time => {
        Vue.delete(state.completed[workoutId], time)
      })
    }
  },
  plugins: [vuexLocalStorage.plugin]
})

export default store
