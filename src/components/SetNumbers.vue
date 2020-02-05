<template>
  <span v-if="!isNaN(weight) || !isNaN(reps)">
    <span v-if="weight > 0">{{ weight }}&nbsp;lbs.&nbsp;&times;&nbsp;</span>
    <span>{{ reps }}&nbsp;rep{{ reps > 1 ? 's' : '' }}</span>
  </span>
</template>

<script>
export default {
  name: 'SetNumbers',
  props: {
    weight: {
      type: Number,
      default: NaN
    },
    reps: {
      type: Number,
      default: NaN
    }
  }
}
</script>

<style scoped>

</style>
