<template>
  <div>
    <p>You surpassed your target in the following exercise{{ Object.keys(bumpSuggestions).length > 1 ? 's' : '' }}</p>
    <p>Select the set numbers to update the target</p>

    <div class="data-table">
      <table>
        <template
          v-for="(exerciseNumbers, exerciseName, i) in bumpSuggestions"
        >
          <thead :key="i">
            <tr>
              <th class="exercise-name">
                {{ exerciseName }}
              </th>
              <th>
                <span>{{ displayAdj(exerciseName) }} Target: </span>
                <set-numbers
                  :weight="exercise(exerciseName).weight"
                  :reps="exercise(exerciseName).reps"
                  class="current-numbers"
                />
              </th>
            </tr>
          </thead>
          <tbody :key="i">
            <tr
              v-for="(set, j) in (exerciseName in oldNumbers ? [exerciseNumbers.sets[0]] : exerciseNumbers.sets)"
              :key="j"
            >
              <td>{{ buttonLabel(exerciseName, set.rounds) }}</td>
              <td>
                <f7-button
                  fill
                  raised
                  :color="exerciseName in oldNumbers ? 'red' : ''"
                  @click="updateTarget(exerciseName, buttonNum(exerciseName, set, 'weight'), buttonNum(exerciseName, set, 'reps'))"
                >
                  <set-numbers
                    :weight="buttonNum(exerciseName, set, 'weight')"
                    :reps="buttonNum(exerciseName, set, 'reps')"
                  />
                </f7-button>
              </td>
            </tr>
          </tbody>
        </template>
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
      return `Round${rounds.length > 1 ? 's ' + rounds.join(' & ') : ' ' + rounds[0]}:`
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

<style scoped lang="scss">
  .data-table thead th {
    font-size: 16px;
    white-space: normal;
  }
  .exercise-name {
    font-weight: bold;
  }
  .current-numbers {
    font-weight: bold;
    white-space: nowrap;
  }
  .data-table th, .data-table td {
    padding-left: 12px;
    padding-right: 0;
  }
</style>
