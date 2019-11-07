// Import Vue
import Vue from 'vue'
import Vuex from 'vuex'

// Import F7
import Framework7 from 'framework7'

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue'

// Import F7 Styles
import 'framework7/css/framework7.bundle.min.css'

// Import Icons and App Custom Styles
import './css/icons.css'
import './css/app.css'

// Import App Component
import App from './App.vue'

Vue.use(Vuex)

// Init F7 Vue Plugin
Framework7.use(Framework7Vue)

// Declare the store before initializing the App
const store = new Vuex.Store({
  state: {
    // TODO: Add customizable rest time
    workouts: [
      {
        id: 'circuit',
        name: 'Circuit',
        exercises: [ 'Push-Ups', 'Pull-Ups', 'Dips', 'Squats' ],
        rounds: 4
      },
      {
        id: 'hiit',
        name: 'HIIT',
        exercises: [ 'High Knees', 'Burpees', 'Jumping Jacks' ],
        rounds: 3
      },
      {
        id: 'test',
        name: 'Test',
        exercises: ['A', 'B'],
        rounds: 2
      }
    ],
    completed: {}
  },
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

// Init App
export default new Vue({
  el: '#app',

  // Register App Component
  components: {
    app: App
  },

  template: '<app/>',

  // Use Vuex store
  store
})
