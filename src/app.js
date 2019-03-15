// Import Vue
import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

// Import F7
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import F7 Styles
import Framework7Styles from 'framework7/css/framework7.bundle.min.css';

// Import Icons and App Custom Styles
import IconsStyles from './css/icons.css';
import AppStyles from './css/app.css';

// Import App Component
import App from './App.vue';

// Init F7 Vue Plugin
Framework7.use(Framework7Vue);

// Declare the store before initializing the App
const store = new Vuex.Store({
  state: {
    workouts: [
      {
        id: 'circuit',
        name: 'Circuit',
        exercises: [ "Push-Ups", "Pull-Ups", "Dips", "Squats" ],
        rounds: 4
      },
      {
        id: 'hiit',
        name: 'HIIT',
        exercises: [ "High Knees", "Burpees", "Jumping Jacks" ],
        rounds: 3
      }
    ],
    completed: {}
  },
  mutations: {
    addWorkout (state, newWorkout) {
      state.workouts.push(
        Object.assign(
          {id: newWorkout.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}, newWorkout
        )
      )
    },
    addCompletedExercise (state, {exercise, completedTime}) {
      state.completed[completedTime] = {
        exercise
      }
    },
    addCompletedReps(state, {time, reps}) {
      state.completed[time].reps = reps
    }
  }
});

// Init App
new Vue({
  el: '#app',
  template: '<app/>',

  // Register App Component
  components: {
    app: App
  },

  // Use Vuex store
  store,
});

