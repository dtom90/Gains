import HomePage from './pages/Home.vue'
import FormPage from './pages/NewWorkout.vue'
import WorkoutPage from './pages/Workout.vue'
import ActiveWorkout from './pages/ActiveWorkout.vue'
import EditHistory from './pages/EditHistory.vue'
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
    path: '/editWorkout/:workoutId',
    component: FormPage
  },
  {
    path: '/workout/:workoutId/go',
    component: ActiveWorkout
  },
  {
    path: '/workout/:workoutId/editHistory',
    component: EditHistory
  },
  {
    path: '(.*)',
    component: NotFoundPage
  }
]
