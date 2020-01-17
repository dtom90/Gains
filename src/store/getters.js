const getters = {
  getWorkout: state => (workoutId) => state.workouts.find(w => w.id === workoutId),
  getExercise: state => (workoutId, exerciseName) => state.workouts.find(w => w.id === workoutId)
    .exercises.find(ex => ex.name === exerciseName)
}

export default getters
