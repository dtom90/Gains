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
    addWorkout (state, newWorkout) {
      state.workouts.push(
        Object.assign(
          { id: newWorkout.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() }, newWorkout
        )
      )
    },
    addCompletedExercise (state, { exercise, completedTime }) {
      state.completed[completedTime] = {
        exercise
      }
    },
    addCompletedReps (state, { time, reps }) {
      state.completed[time].reps = reps
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
