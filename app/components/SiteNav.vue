<script setup lang="ts">
const links = ref([
  [{
    label: 'Wahlergbenisse',
    children: [
      {
        label: 'Bundestagswahl 2025',
        to: '/wahlergebniss/bundestagswahl-2025',
      },
      {
        label: 'Europawahl 2024',
        to: '/wahlergebniss/europawahl-2024',
      },
      {
        label: 'Landtagswahl 2022',
        to: '/wahlergebniss/landtagswahl-2022',
      },
      {
        label: 'Bundestagswahl 2021',
        to: '/wahlergebniss/bundestagswahl-2021',
      },
      {
        label: 'Kommunalwahl 2020',
        to: '/wahlergebniss/kommunalwahl-2020',
      },
      {
        label: 'Europawahl 2019',
        to: '/wahlergebniss/europawahl-2019',
      },
      {
        label: 'Bundestagswahl 2017',
        to: '/wahlergebniss/bundestagswahl-2017',
      },
      {
        label: 'Landtagswahl 2017',
        to: '/wahlergebniss/landtagswahl-2017',
      },
      {
        label: 'Kommunalwahl 2014',
        to: '/wahlergebniss/kommunalwahl-2014',
      },
      {
        label: 'Europawahl 2014',
        to: '/wahlergebniss/europawahl-2014',
      },
      {
        label: 'Bundestagswahl 2013',
        to: '/wahlergebniss/bundestagswahl-2013',
      },
      {
        label: 'Landtagswahl 2012',
        to: '/wahlergebniss/landtagswahl-2012',
      },
      {
        label: 'Landtagswahl 2010',
        to: '/wahlergebniss/landtagswahl-2010',
      },
      {
        label: 'Bundestagswahl 2009',
        to: '/wahlergebniss/bundestagswahl-2009',
      },
      {
        label: 'Kommunalwahl 2009',
        to: '/wahlergebniss/kommunalwahl-2009',
      }
    ],
  },
    {
      label: 'Struckturdaten',
      children: [
        {
          label: 'Wohnungsbaugeselschafften Bonn',
          value: 'Wohnungsbaugeselschafften Bonn',
          to: '/struckturdaten/wohnungsbaugesellschaften_bonn'
        }
      ]
    },
    {
      label: 'Wahl Verlauf',
      to: '/dive',
    }],
  [{
    label: 'Colormode',
    slot: 'colormode',
  }]
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
    >
      <template #colormode>
        <ClientOnly>
          <ColorModeButton/>
        </ClientOnly>
      </template>
    </UNavigationMenu>
  </div>
</template>

<style scoped>

</style>