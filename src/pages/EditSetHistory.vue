<template>
  <f7-page>
    <f7-navbar
      :title="`Edit ${workout.name} ${startTime}`"
      back-link
      back-link-force
      :back-link-url="`/workout/${workout.id}/editHistory`"
    />

    <f7-block>
      <div class="data-table data-table-init card">
        <table>
          <thead>
            <tr>
              <th class="label-cell">
                Exercise
              </th>
              <th class="label-cell">
                Weight
              </th>
              <th class="label-cell">
                Reps
              </th>
            </tr>
          </thead>
          <tbody v-if="completedWorkout">
            <tr
              v-for="(exercise, i) in completedWorkout.exercises"
              :key="i"
            >
              <td class="label-cell">
                <span>{{ exercise.exercise }} {{ exercise.round }}</span>
              </td>
              <td class="input-cell">
                <f7-list>
                  <f7-list-input
                    :id="'weight-picker-'+i"
                    class="color-white"
                    inline-label
                    type="text"
                    readonly
                    outline
                  >
                    <div
                      slot="inner"
                      class="item-label"
                    >
                      <span>&nbsp;&nbsp;&nbsp;lbs.</span>
                    </div>
                  </f7-list-input>
                </f7-list>
              </td>
              <td class="input-cell">
                <f7-list>
                  <f7-list-input
                    :id="'reps-picker-'+i"
                    class="color-white"
                    inline-label
                    type="text"
                    readonly
                    outline
                  >
                    <div
                      slot="inner"
                      class="item-label"
                    >
                      <span>&nbsp;&nbsp;&nbsp;reps</span>
                    </div>
                  </f7-list-input>
                </f7-list>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </f7-block>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar, f7Block, f7List, f7ListInput } from 'framework7-vue'
import { mapState, mapMutations } from 'vuex'
import picker from '../js/picker'

export default {
  name: 'EditSetHistory',
  components: { f7Page, f7Navbar, f7Block, f7List, f7ListInput },
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
        ? this.workouts.filter(w => w.id === this.$f7route.params.workoutId)[0]
        : null
    },
    startTime () {
      if (this.workout && 'workoutTime' in this.$f7route.params) {
        return (new Date(parseInt(this.$f7route.params.workoutTime))).toLocaleString()
      }
      return null
    },
    completedWorkout () {
      if (this.workout && 'workoutTime' in this.$f7route.params) {
        return this.completed[this.workout.id][this.$f7route.params.workoutTime]
      }
      return null
    }
  },
  mounted () {
    const self = this

    const openPicker = picker => { picker.$inputEl.trigger('focus') }

    const saveNubmer = function (picker) {
      const listInput = picker.$inputEl[0].parentNode.parentNode.parentNode.parentNode
      if (listInput) {
        const id = listInput.id
        const [type, setIndexStr] = id.split('-picker-')
        self.modifyCompletedSet({
          workoutId: self.workout.id,
          workoutStartTime: self.$f7route.params.workoutTime,
          setIndex: parseInt(setIndexStr),
          type,
          value: parseInt(picker.$inputEl[0].value)
        })
        picker.$inputEl.trigger('blur')
      }
    }

    this.$nextTick(() => {
      this.completedWorkout.exercises.forEach((exercise, i) => {
        picker.weightPicker(this.$f7, `#weight-picker-${i} input`, exercise.weight,
          openPicker, saveNubmer
        )
        picker.repPicker(this.$f7, `#reps-picker-${i} input`, exercise.reps,
          openPicker, saveNubmer
        )
      })
    })
  },
  methods: {
    ...mapMutations([
      'modifyCompletedSet'
    ])
  }
}
</script>

<style scoped>
.input-cell {
  padding: 0;
}
</style>
