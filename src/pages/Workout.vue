<template>
  <f7-page>
    <f7-navbar
      :title="'Workout: '+workout.name"
      back-link="Back"
    />

    <f7-block>
      <f7-block-title>
        Exercises:
      </f7-block-title>

      <f7-list>
        <f7-list-item
          v-for="(exercise, i) in workout.exercises"
          :key="i"
          class="workout-exercise"
        >
          <f7-list-item-cell>
            {{ exercise.name }}
          </f7-list-item-cell>
          <f7-list-item-cell>
            Weight: {{ exercise.weight }} lbs.
          </f7-list-item-cell>
          <f7-list-item-cell>
            Reps: {{ exercise.reps }}
          </f7-list-item-cell>
          <f7-list-item
            v-if="'rest' in exercise"
            slot="root"
          >
            Rest: {{ exercise.rest }} seconds
          </f7-list-item>
        </f7-list-item>
      </f7-list>

      <f7-block-footer>
        <p>x {{ workout.rounds }} Round{{ workout.rounds === 1 ? '' : 's' }}</p>
      </f7-block-footer>
    </f7-block>
    <f7-block>
      <f7-button
        :href="`/workout/${workout.id}/go`"
        class="col"
        big
        fill
        raised
        color="green"
      >
        Start Workout
      </f7-button>
    </f7-block>
    <f7-block v-if="lastWorkout">
      <f7-block-title>
        Last Workout:
      </f7-block-title>
      <p>{{ (new Date(lastWorkout.lastWorkoutTime)).toLocaleString() }}</p>
      <f7-list>
        <f7-list-item
          v-for="(exercise, i) in lastWorkout.exercises"
          :key="i"
        >
          {{ exercise.exercise }}: {{ exercise.weight }} lbs. x {{ exercise.reps }} rep{{ exercise.reps > 1 ? 's' : '' }}
        </f7-list-item>
      </f7-list>

      <f7-block-title>
        Workout History:
      </f7-block-title>
      <div class="data-table card">
        <table>
          <thead>
            <tr>
              <th />
              <th
                v-for="(_, time) in displayCompleted"
                :key="time"
              >
                {{ (new Date(parseInt(time))).toLocaleString() }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(exercise, i) in lastWorkout.exercises"
              :key="i"
            >
              <td>{{ exercise.exercise }} Round {{ exercise.round }}</td>
              <td
                v-for="(sequence, time) in displayCompleted"
                :key="time"
              >
                {{ sequence.exercises[i].weight }} lbs. x {{ sequence.exercises[i].reps }} rep{{ sequence.exercises[i].reps > 1 ? 's' : '' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </f7-block>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar, f7Block, f7BlockTitle, f7List, f7BlockFooter, f7ListItem, f7ListItemCell, f7Button } from 'framework7-vue'

export default {
  components: { f7Page, f7Navbar, f7Block, f7BlockTitle, f7BlockFooter, f7List, f7ListItem, f7ListItemCell, f7Button },

  computed: {
    workout () {
      return this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
    },
    allCompleted () {
      if (this.workout.id in this.$store.state.completed) {
        return this.$store.state.completed[this.workout.id]
      }
      return null
    },
    displayCompleted () {
      return Object.keys(this.allCompleted)
        .filter(key => key !== 'lastWorkoutTime')
        .slice().sort()
        .reduce((obj, key) => ({
          ...obj,
          [key]: this.allCompleted[key]
        }), {})
    },
    lastWorkout () {
      if (this.allCompleted) {
        const lastWorkoutTime = this.allCompleted.lastWorkoutTime
        const lastCompleted = this.allCompleted[lastWorkoutTime]
        return { lastWorkoutTime, exercises: lastCompleted.exercises }
      }
      return null
    }
  }
}
</script>
