import HomePage from './pages/Home.vue'
import FormPage from './pages/NewWorkout.vue'
import WorkoutPage from './pages/Workout.vue'
import ActiveWorkout from './pages/ActiveWorkout/ActiveWorkout.vue'
import NotFoundPage from './pages/NotFound.vue'

export default [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/newWorkout/',
    component: FormPage
  },
  {
    path: '/workout/:workoutId',
    component: WorkoutPage
  },
  {
    path: '/workout/:workoutId/go',
    component: ActiveWorkout
  },
  {
    path: '(.*)',
    component: NotFoundPage
  }
]
