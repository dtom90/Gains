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
    const app = self.$f7

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
      }
    }

    this.$nextTick(() => {
      this.completedWorkout.exercises.forEach((exercise, i) => {
        const maxWeight = Math.max(500, exercise.weight * 2)
        const step1 = '+/- 1'
        const step5 = '+/- 5'
        const weightOptions = {
          [step5]: [...Array(maxWeight / 5 + 1).keys()].map(x => x * 5),
          [step1]: [...Array(maxWeight + 1).keys()]
        }

        const maxReps = Math.max(500, exercise.reps * 2)

        app.picker.create({
          inputEl: `#weight-picker-${i} input`,
          formatValue: function (values) {
            return values[1]
          },
          cols: [
            {
              textAlign: 'left',
              values: Object.keys(weightOptions),
              onChange: function (picker, step) {
                if (picker.cols[1].replaceValues) {
                  let currentValue = parseInt(picker.value[1])
                  if (step === step5 && currentValue % 5 !== 0) {
                    currentValue = Math.round(currentValue / 5) * 5
                  }
                  picker.cols[1].replaceValues(weightOptions[step])
                  picker.cols[1].setValue(currentValue, 0)
                }
              }
            },
            {
              values: Object.values(weightOptions)[0],
              width: 160
            }
          ],
          value: [exercise.weight % 5 === 0 ? step5 : step1, exercise.weight],
          on: {
            closed: saveNubmer
          }
        })
        app.picker.create({
          inputEl: `#reps-picker-${i} input`,
          cols: [
            {
              textAlign: 'center',
              values: [...Array(maxReps).keys()].map(x => x + 1)
            }
          ],
          value: [exercise.reps],
          on: {
            closed: saveNubmer
          }
        })
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
