<template>
  <f7-page>
    <f7-navbar
      title="Gains Tracker"
      large
    />

    <f7-block-title>
      Workouts
    </f7-block-title>

    <f7-block
      v-if="workouts.length > 0"
      strong
    >
      <f7-row
        v-for="(workout, i) in workouts"
        :key="i"
        tag="p"
      >
        <f7-button
          :href="'/workout/'+workout.id"
          class="col"
          large
          fill
          raised
        >
          {{ workout.name }}
        </f7-button>
      </f7-row>
    </f7-block>

    <f7-block>
      <f7-row tag="p">
        <f7-button
          href="/newWorkout/"
          class="col"
          large
          fill
          raised
          color="green"
        >
          New Workout
        </f7-button>
      </f7-row>
    </f7-block>
  </f7-page>
</template>
<script>
import { f7Page, f7Navbar, f7Block, f7BlockTitle, f7Row, f7Button } from 'framework7-vue'

export default {
  components: { f7Page, f7Navbar, f7Block, f7BlockTitle, f7Row, f7Button },

  computed: {
    workouts () {
      return this.$store.state.workouts
    }
  }
}
</script>
