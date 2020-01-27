<template>
  <div>
    <p>You surpassed your target in the following exercise{{ Object.keys(bumpSuggestions).length > 1 ? 's' : '' }}</p>
    <p>Select the set numbers to update the target</p>
    <div
      v-for="(exerciseNumbers, exerciseName, i) in bumpSuggestions"
      :key="i"
    >
      <table>
        <tr>
          <th>{{ exerciseName }}</th>
          <td>&nbsp;&nbsp;</td>
          <td style="padding: 5px;">
            <span>{{ displayAdj(exerciseName) }} Target:</span>
            <set-numbers
              :weight="exercise(exerciseName).weight"
              :reps="exercise(exerciseName).reps"
            />
          </td>
        </tr>
        <tr
          v-for="(set, j) in (exerciseName in oldNumbers ? [exerciseNumbers.sets[0]] : exerciseNumbers.sets)"
          :key="j"
        >
          <td>{{ buttonLabel(exerciseName, set.rounds) }}</td>
          <td />
          <td>
            <f7-button
              large
              fill
              raised
              @click="updateTarget(exerciseName, buttonNum(exerciseName, set, 'weight'), buttonNum(exerciseName, set, 'reps'))"
            >
              <set-numbers
                :weight="buttonNum(exerciseName, set, 'weight')"
                :reps="buttonNum(exerciseName, set, 'reps')"
              />
            </f7-button>
          </td>
        </tr>
      </table>
    </div>
    <br>
  </div>
</template>

<script>
import SetNumbers from './SetNumbers'
import { f7Button } from 'framework7-vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'BumpSuggestions',
  components: { SetNumbers, f7Button },
  props: {
    bumpSuggestions: {
      type: Object,
      default: () => null
    },
    workoutId: {
      type: String,
      default: null
    }
  },
  data: () => ({
    oldNumbers: {}
  }),
  computed: {
    ...mapGetters([
      'getExercise'
    ])
  },
  methods: {
    ...mapMutations([
      'updateExerciseTarget'
    ]),
    displayAdj (exerciseName) {
      return exerciseName in this.oldNumbers ? 'New' : 'Current'
    },
    exercise (exerciseName) { return this.getExercise(this.workoutId, exerciseName) },
    buttonLabel (exerciseName, rounds) {
      if (exerciseName in this.oldNumbers) {
        return 'Old Target:'
      }
      return `Round ${rounds.length > 1 ? 's ' + rounds.join(' & ') : ' ' + rounds[0]}:`
    },
    buttonNum (exerciseName, set, type) {
      return exerciseName in this.oldNumbers
        ? this.oldNumbers[exerciseName][type]
        : set[type]
    },
    updateTarget (exerciseName, weight, reps) {
      this.updateExerciseTarget({
        workoutId: this.workoutId,
        exerciseName,
        weight,
        reps
      })
      if (exerciseName in this.oldNumbers) {
        this.$delete(this.oldNumbers, exerciseName)
      } else {
        this.$set(this.oldNumbers, exerciseName, {
          weight: this.bumpSuggestions[exerciseName].current.weight,
          reps: this.bumpSuggestions[exerciseName].current.reps
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
