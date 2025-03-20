<script setup lang="ts">
const links = ref([
  {
    label: 'Wahlergbenisse',
    children: [
      {
        label: 'Kommunalwahl 2020',
        to: '/wahlergebniss/kommunalwahl-2020',
      },
      {
        label: 'Bundestagswahl 2021',
        to: '/wahlergebniss/bundestagswahl-2021',
      },
      {
        label: 'Landtagswahl 2022',
        to: '/wahlergebniss/landtagswahl-2022',
      },
      {
        label: 'Europawahl 2024',
        to: '/wahlergebniss/europawahl-2024',
      },
      {
        label: 'Bundestagswahl 2025',
        to: '/wahlergebniss/bundestagswahl-2025',
      }
    ],
  },
  {
    label: 'Wahl Verlauf',
    to: '/dive',
  }
])
</script>

<template>
  <div>
    <UNavigationMenu
        :items="links"
        class="data-[orientation=horizontal]:border-b border-(--ui-border) data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48"
        highlight
        highlight-color="primary"
        orientation="horizontal"
    />
  </div>
</template>

<style scoped>

</style>