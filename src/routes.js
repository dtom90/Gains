import HomePage from './pages/home.vue';
import AboutPage from './pages/about.vue';
import FormPage from './pages/form.vue';
import WorkoutPage from './pages/workout.vue';
import NotFoundPage from './pages/not-found.vue';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/about/',
    component: AboutPage,
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
