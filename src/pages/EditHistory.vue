<template>
  <f7-page>
    <f7-navbar
      :title="`Edit ${workout.name} History`"
      back-link
      back-link-force
      :back-link-url="'/workout/'+workout.id"
    />

    <f7-block>
      <div class="data-table data-table-init card">
        <table>
          <thead>
            <tr>
              <th class="checkbox-cell">
                <!--                <label class="checkbox">-->
                <!--                  <input type="checkbox">-->
                <!--                  <i class="icon-checkbox" />-->
                <!--                </label>-->
              </th>
              <th class="label-cell">
                Start Time
              </th>
              <th class="numeric-cell">
                Sets Completed
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(completedWorkout, startedTime) in completedWorkouts"
              :key="startedTime"
            >
              <td class="checkbox-cell">
                <label class="checkbox">
                  <input
                    v-model="selected"
                    :value="startedTime"
                    type="checkbox"
                  >
                  <i class="icon-checkbox needsclick" />
                </label>
              </td>
              <td class="label-cell">
                {{ (new Date(parseInt(startedTime))).toLocaleString() }}
              </td>
              <td class="numeric-cell">
                {{ completedWorkout.exercises.length }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <f7-button
        large
        fill
        raised
        :disabled="selected.length === 0"
        @click="deleteSelected"
      >
        <span>Delete</span><span v-if="selected.length > 0">{{ selected.length }} Workouts</span>
      </f7-button>
    </f7-block>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar, f7Block, f7Button } from 'framework7-vue'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'EditHistory',
  components: { f7Page, f7Navbar, f7Block, f7Button },
  data: () => ({
    selected: []
  }),
  computed: {
    ...mapState([
      'workouts',
      'completed'
    ]),
    workout () {
      return 'workoutId' in this.$f7route.params
        ? this.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
        : null
    },
    completedWorkouts () {
      if ('workoutId' in this.$f7route.params) {
        const completed = this.completed[this.$f7route.params['workoutId']]
        const { lastWorkoutTime, ...completedWorkouts } = completed
        return completedWorkouts
      }
      return null
    }
  },
  methods: {
    ...mapMutations([
      'deleteWorkoutRecords'
    ]),
    deleteSelected () {
      this.$f7.dialog.confirm(
        `Are you sure that you want to delete these ${this.selected.length} workout records?`,
        'Delete Workout History',
        () => {
          this.deleteWorkoutRecords({
            workoutId: this.workout.id,
            times: this.selected
          })
          this.selected = []
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
