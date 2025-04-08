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
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const getData = () => {
  let votes: string[] = [];
  let names: string[] = [];
  let areaname: string = "Gesamtergebniss";
  props.data.forEach((datapoint: any) => {
    votes.push(datapoint.result);
    names.push(datapoint.poll ? datapoint.poll : datapoint.name);
    areaname = datapoint.areaname ? datapoint.areaname : "Gesamtergebniss";
  });
  return {
    labels: names,
    datasets: [
      {
        label: areaname,
        data: votes,
        backgroundColor: ["#FF0000", "#6F003C"],
        borderColor: ["#FF9494", "#FFA0E3"],
        borderWidth: 2,
      },
    ],
  };
};

const data = computed(() => getData());

const options = computed(() => {
  return {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: isDark.value ? "#ddd3" : "#1113",
        },
        ticks: {
          color: isDark.value ? "#ddd" : "#111",
        },
      },
      y: {
        title: {
          text: "Wahlergebnis in Prozent",
          color: isDark.value ? "#ddd" : "#111",
          display: true,
        },
        grid: {
          color: isDark.value ? "#ddd3" : "#1113",
        },
        ticks: {
          callback: function (value: any) {
            return value + "%";
          },
          color: isDark.value ? "#ddd" : "#111",
        },
        beginAtZero: true,
        max: 40,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isDark.value ? "#ddd" : "#111",
        },
      },
    },
  };
});
</script>

<style scoped></style>
