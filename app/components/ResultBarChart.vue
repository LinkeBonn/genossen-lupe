<template>
  <Bar :data="dataTransformed" :options="options"/>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {Bar} from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

const getData = () => {
  let votes: number[] = [];
  let names: string[] = [];
  if (data.value && data.value.features) {
    data.value.features.forEach((feature: any) => {
      votes.push(Number(feature.properties['votes-in-percent-resultPdl']));
      names.push(feature.properties['area-name']);
    });
  }
  return {
    labels: names,
    datasets: [{
      label: 'Alle Ergebnisse',
      data: votes,
      backgroundColor: ['#FF0000', '#6F003C'],
      borderColor: ['#FF9494', '#FFA0E3'],
      borderWidth: 2,
    }]
  }
}

const data = computed(() => props.data)
const dataTransformed = computed(() => getData());

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const options = computed(() => {
  return {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: isDark.value ? '#ddd3' : '#1113',
        },
        ticks: {
          color: isDark.value ? '#ddd' : '#111',
        }
      },
      y: {
        grid: {
          color: isDark.value ? '#ddd3' : '#1113',
        },
        title: {
          text: 'Wahlergebnis in Prozent',
          color: isDark.value ? '#ddd' : '#111',
          display: true
        },
        ticks: {
          callback: function (value: any) {
            return value + '%';
          },
          color: isDark.value ? '#ddd' : '#111'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: isDark.value ? '#ddd' : '#111',
        }
      }
    }
  }
})
</script>

<style scoped>

</style>