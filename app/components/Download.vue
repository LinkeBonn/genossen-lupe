<template>
 <UButton @click="download">Download</UButton>
</template>

<script setup lang="ts">
const props = defineProps({
  link: {
    type: String,
    default: ""
  }
})

const download = () => {
  const link = document.createElement('a')
  link.href = props.link
  link.download = props.link.split('/')[2]
  link.target = '_blank'
  link.click()
}
</script>

<style scoped>

</style>