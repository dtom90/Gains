import HomePage from '../pages/Home.vue'
import FormPage from '../pages/NewWorkout.vue'
import WorkoutPage from '../pages/Workout.vue'
import ActiveWorkout from '../pages/ActiveWorkout.vue'
import EditWorkoutHistory from '../pages/EditWorkoutHistory.vue'
import EditSetHistory from '../pages/EditSetHistory.vue'
import NotFoundPage from '../pages/NotFound.vue'

const routes = [
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
    component: EditWorkoutHistory
  },
  {
    path: '/workout/:workoutId/editHistory/:workoutTime',
    component: EditSetHistory
  },
  {
    path: '(.*)',
    component: NotFoundPage
  }
]

export default routes
