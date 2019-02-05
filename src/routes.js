import HomePage from './pages/Home.vue';
import FormPage from './pages/NewWorkout.vue';
import WorkoutPage from './pages/Workout.vue';
import NotFoundPage from './pages/not-found.vue';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/workout/:workoutId',
    component: WorkoutPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
