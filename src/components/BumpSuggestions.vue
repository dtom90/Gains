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
              :weight="displayNum(exerciseName, 'weight')"
              :reps="displayNum(exerciseName, 'reps')"
            />
          </td>
        </tr>
        <tr
          v-for="(set, j) in exerciseNumbers.sets"
          :key="j"
        >
          <td>Round {{ set.round }}: </td>
          <td />
          <td>
            <f7-button
              large
              fill
              raised
              @click="updateTarget(exerciseName, set.weight, set.reps)"
            >
              <set-numbers
                :weight="set.weight"
                :reps="set.reps"
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

export default {
  name: 'BumpSuggestions',
  components: { SetNumbers, f7Button },
  props: {
    bumpSuggestions: {
      type: Object,
      default: () => null
    }
  },
  data: () => ({
    oldNumbers: {}
  }),
  methods: {
    displayNum (exerciseName, type) {
      return exerciseName in this.oldNumbers
        ? this.oldNumbers[exerciseName][type]
        : this.bumpSuggestions[exerciseName].current[type]
    },
    displayAdj (exerciseName) {
      return exerciseName in this.oldNumbers ? 'New' : 'Current'
    },
    updateTarget (exerciseName, weight, reps) {
      this.$set(this.oldNumbers, exerciseName, {
        weight,
        reps
      })
    }
  }
}
</script>

<style scoped>

</style>
