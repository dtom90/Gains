import Vue from 'vue'

import getters from './getters'

const mutations = {
  addWorkout (state, { name, exercises, rounds }) {
    state.workouts.push(
      Object.assign(
        { id: name.replace(/[^a-z0-9]/gi, '_').toLowerCase() }, { name, exercises, rounds }
      )
    )
  },
  editWorkout (state, { id, name, exercises, rounds }) {
    const workout = getters.getWorkout(state)(id)
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
  updateExerciseTarget (state, { workoutId, exerciseName, weight, reps }) {
    const exercise = getters.getExercise(state)(workoutId, exerciseName)
    exercise.weight = weight
    exercise.reps = reps
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
  },
  deleteWorkout (state, { workoutId }) {
    const index = state.workouts.findIndex(w => w.id === workoutId)
    if (index > -1) {
      state.workouts.splice(index, 1)
    }
    if (workoutId in state.completed) {
      Vue.delete(state.completed, workoutId)
    }
  }
}

export default mutations
