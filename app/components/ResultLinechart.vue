<template>
  <Line :data="data" :options="options" />
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import {Line} from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

const getData = () => {
  let votes: string[] = [];
  let names: string[] = [];
  let areaname: string = "Gesamtergebniss";
  props.data.forEach((datapoint: any) => {
    votes.push(datapoint.result);
    names.push(datapoint.poll ? datapoint.poll : datapoint.name);
    areaname = datapoint.areaname ? datapoint.areaname : 'Gesamtergebniss';
  });
  return {
    labels: names,
    datasets: [{
      label: areaname,
      data: votes,
      backgroundColor: ['#FF0000', '#6F003C'],
      borderColor: ['#FF9494', '#FFA0E3'],
      borderWidth: 2,
    }]
  }
}

const data = computed(() => getData());

const options = {
  responsive: true,
  scales: {
    x: {
      grid: {
        color: '#fff5',
      },
      ticks: {
        color: '#ffff',
      }
    },
    y: {
      grid: {
        color: '#fff5',
      },
      title: {
        text: 'Wahlergebnis in Prozent',
        color: '#ffff',
        display: true
      },
      ticks: {
        callback: function (value: any) {
          return value + '%';
        },
        color: '#ffff',
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: '#fff',
      }
    }
  }
}
</script>

<style scoped>

</style>