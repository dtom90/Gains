// Import Vue
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
