<template>
  <div>
    <h4>You surpassed your target for the following exercises:</h4>
    <h4>Select the set numbers to update the target</h4>
    <div
      v-for="(exerciseNumbers, exerciseName, i) in surpassed"
      :key="i"
    >
      <table>
        <tr>
          <th>{{ exerciseName }}</th>
          <td>&nbsp;&nbsp;</td>
          <td>
            <span>Current Target:</span>
            <set-numbers
              :weight="exerciseNumbers.current.weight"
              :reps="exerciseNumbers.current.reps"
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
    {{ oldNumbers }}
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
    surpassed: {
      type: Object,
      default: () => null
    }
  },
  data: () => ({
    oldNumbers: {}
  }),
  methods: {
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
