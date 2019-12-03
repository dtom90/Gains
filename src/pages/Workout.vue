<template>
  <f7-page>
    <f7-navbar
      :title="workout ? workout.name : ''"
      :title-large="workout ? workout.name : ''"
      large
      inner-class="text-align-center"
      back-link
      back-link-force
      back-link-url="/"
    />

    <f7-block v-if="workout">
      <f7-block-title>
        Exercises:
      </f7-block-title>

      <f7-list>
        <f7-list-item
          v-for="(exercise, i) in workout.exercises"
          :key="i"
          class="workout-exercise"
        >
          <f7-list-item-cell class="exercise-name">
            <strong>{{ exercise.name }}</strong>
          </f7-list-item-cell>
          <f7-list-item-cell class="target-label text-align-right">
            <span>Target:</span>
          </f7-list-item-cell>
          <f7-list-item-cell class="target-numbers">
            <set-numbers
              :weight="exercise.weight"
              :reps="exercise.reps"
            />
          </f7-list-item-cell>
          <f7-list-item
            v-if="'rest' in exercise"
            slot="root"
          >
            <span
              style="width: 100%"
              class="text-align-center"
            >Rest: {{ exercise.rest }} seconds</span>
          </f7-list-item>
        </f7-list-item>
      </f7-list>

      <f7-block-footer>
        <p>x {{ workout.rounds }} Round{{ workout.rounds === 1 ? '' : 's' }}</p>
      </f7-block-footer>
      <br>
      <f7-button
        :href="`/editWorkout/${workout.id}`"
        class="col"
        large
        fill
        raised
      >
        Edit Workout
      </f7-button>
    </f7-block>

    <f7-block v-if="workout">
      <f7-button
        :href="`/workout/${workout.id}/go`"
        class="col big-button"
        large
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
          <f7-list-item-cell>
            <span>{{ exercise.exercise }}</span>
          </f7-list-item-cell>
          <f7-list-item-cell>
            <span>Round {{ exercise.round }}</span>
          </f7-list-item-cell>
          <f7-list-item-cell>
            <set-numbers
              :weight="exercise.weight"
              :reps="exercise.reps"
            />
          </f7-list-item-cell>
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
              v-for="i in workout.exercises.length * workout.rounds"
              :key="i"
            >
              <td>
                <span>{{ workout.exercises[(i-1) % workout.exercises.length].name.replace('-', '&#8209;') }}</span>
                <span> Round&nbsp;{{ Math.floor((i-1) / workout.exercises.length) + 1 }}</span>
              </td>
              <td
                v-for="(sequence, time) in displayCompleted"
                :key="time"
              >
                <set-numbers
                  v-if="i <= sequence.exercises.length"
                  :weight="sequence.exercises[i-1].weight"
                  :reps="sequence.exercises[i-1].reps"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <f7-button
        :href="`/workout/${workout.id}/editHistory`"
        class="col"
        large
        fill
        raised
      >
        Edit History
      </f7-button>
    </f7-block>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { f7Page, f7Navbar, f7Block, f7BlockTitle, f7List, f7BlockFooter, f7ListItem, f7ListItemCell, f7Button } from 'framework7-vue'
import SetNumbers from '../components/SetNumbers'

export default {
  components: { SetNumbers, f7Page, f7Navbar, f7Block, f7BlockTitle, f7BlockFooter, f7List, f7ListItem, f7ListItemCell, f7Button },

  computed: {
    ...mapState([
      'workouts',
      'completed'
    ]),
    workout () {
      return this.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
    },
    allCompleted () {
      if (this.workout && this.workout.id in this.completed) {
        return this.completed[this.workout.id]
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

<style>
  .exercise-name, .target-numbers {
    flex: 2
  }

  .target-label {
    flex: 1;
  }
</style>
