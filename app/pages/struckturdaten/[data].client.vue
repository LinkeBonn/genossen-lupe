<template>
  <div class="content-box">
    <div class="content">
      <h2 class="title">{{ sitetitle }}</h2>
      <ClientOnly fallback="Map Loading...">
        <SimpleMap :datasource-name="route.params.data"/>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import SimpleMap from "~/components/SimpleMap.vue";

const route = useRoute()

const sitetitle = computed(() => {
  const pathparts = route.fullPath.split('/')
  if(pathparts.length >= 3) {
    const titleparts = pathparts[2].split('_')
    return `${capital(pathparts[1])}: ${capital(titleparts[0])} ${capital(titleparts[1])}`
  }
  return ''
})

const capital = (val: string) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
</script>

<style scoped>
.content {
  width: 90%;
}

@media (min-width: 1250px) {
  .content {
    width: 50%;
  }
}
</style>