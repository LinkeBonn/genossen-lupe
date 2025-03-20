<template>
  <div class="content-box">
    <div class="content">
      <ClientOnly fallback="Map Loading...">
        <Map :poll="poll" :votes="votes" @on-vote-change="geodata.onVoteChange" @on-area-change="geodata.onAreaChange"/>
      </ClientOnly>
      <ClientOnly fallback="Diagrams Loading...">
        <div class="barchart-box">
          <div class="barchart">
            <MinMaxBarChart :data="geodata.geoDatasource.value"/>
          </div>
          <div class="barchart">
            <ResultBarChart :data="geodata.geoDatasource.value"/>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import Map from "~/components/Map.vue";
import MinMaxBarChart from "~/components/MinMaxBarChart.vue";
import ResultBarChart from "~/components/ResultBarChart.vue";
import {useGeoData} from "~/useGeoData";


const route = useRoute()
const poll = computed(() => `${route.params.wahl}-${route.params.jahr}`)
const votes = computed(() => route.params.wahl === "europawahl" ? ["Europawahl"] : route.params.wahl === "kommunalwahl" ? ["Ratswahl"] : ["Erststimme", "Zweitstimme"]);

const geodata = useGeoData(`${route.params.wahl}-${route.params.jahr}`);
geodata.setGeoDataSource(String(votes.value[0]), "Stimmbezirk")
</script>

<style scoped>

.content {
  width: 90%;
}

.barchart {
  width: 100%;
}

.barchart-box {
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 25px;
}

@media (min-width: 1250px) {
  .content {
    width: 50%;
  }
}
</style>