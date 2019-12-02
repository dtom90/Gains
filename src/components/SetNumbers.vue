<template>
  <span v-if="weight !== NaN || reps !== NaN">
    <span v-if="weight > 0">{{ weight }} lbs. &times; </span>
    <span>{{ reps }} rep{{ reps > 1 ? 's' : '' }}</span>
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
