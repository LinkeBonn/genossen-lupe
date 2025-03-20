<template>
  <div>
  <div class="select-section">
    <div class="select-box">
      <USelect v-model="vote" :items="votes" />
      <USelect v-model="area" :items="areas" />
    </div>
    <UCheckbox v-model="potential" label="Potential Nichtwähler" />
  </div>
  <LMap
      ref="map"
      style="height: 450px"
      :zoom="10.5"
      :center="[50.7074, 7.0982]"
      :use-global-leaflet="true"
      @ready="onMapReady"
  >
    <LTileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
    />
    <LControl position="bottomleft">
      <div class="legend-box">
        <span>{{ infoLegendMin }}%</span>
        <div class="gradient"/>
        <span>{{ infoLegendMax }}%</span>
      </div>
    </LControl>
    <LControl position="topright" v-if="infoTextPercent && infoTextName && infoTextNumber">
      <div class="legend-box">
        <span>{{ infoTextNumber }}</span>
        <span>{{ infoTextName }}</span>
        <span>{{ infoTextPercent }}%</span>
      </div>
    </LControl>
  </LMap>
  </div>
</template>

<script setup lang="ts">
import L from 'leaflet'

const emits = defineEmits(['onAreaChange', 'onVoteChange'])
const props = defineProps({
  poll: {
    type: String,
    default: ""
  },
  votes: {
    type: Array,
    default: () => []
  }
})

const votes = computed(() => {
  if(props.votes.length === 0) {
    return ["Erststimme", "Zweitstimme"]
  }else{
    return props.votes
  }
})
const areas = ["Stimmbezirk", "Wahlbezirk"]

const map = ref(null)
const geojson = ref(undefined)
const infoTextNumber = ref("")
const infoTextName = ref("")
const infoTextPercent = ref("")
const infoLegendMax = ref("0")
const infoLegendMin = ref("0")
const vote = ref(votes.value[0])
const area = ref(areas[0])
const potential = ref(false)

var geoclient: any;

const geoStyler = (feature: any) => {
  return {
    fillOpacity: 0.8,
    fillColor: feature.properties.fill,
    weight: 1.2,
    color: '#fff',
  }
}

function highlightFeature(e: any) {
  var layer = e.target;

  infoTextName.value = layer.feature.properties['area-name'];
  infoTextPercent.value = potential.value ? layer.feature.properties['potential'].toFixed(2) : layer.feature.properties['votes-in-percent'];
  infoTextNumber.value = layer.feature.properties['area-number'];

  layer.setStyle({
    weight: 2,
    color: '#666',
    fillOpacity: 1,
  });

  layer.bringToFront();
}

function resetHighlight(e: any) {
  geoclient.resetStyle(e.target);
}

function onEachFeature(feature: any, layer: any) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
  });
}

watch(vote, (newVal) => {
  loadGeoJson(newVal, area.value, potential.value);
  emits('onVoteChange', {vote: newVal, area: area.value})
})

watch(area, (newVal) => {
  loadGeoJson(vote.value, newVal, potential.value)
  emits('onAreaChange', {vote: vote.value, area: newVal})
})

watch(potential, (newVal) => {
  loadGeoJson(vote.value, area.value, newVal)
})

const getMax = (dataset: any) => {
  let maxVote = 0;
  dataset.forEach((data: any) => {
    if (Number(data) > maxVote) {
      maxVote = Number(data);
    }
  });
  return  maxVote;
}

const getMin = (dataset: any) => {
  let minVote = 100;
  dataset.forEach((data: any) => {
    if (Number(data) < minVote) {
      minVote = Number(data);
    }
  });
  return  minVote;
}



const loadGeoJson = async (vote: string, area: string, potential = false) => {
  if (geoclient) {
    map.value.leafletObject.removeLayer(geoclient)
  }
  const response = await useFetch(`/data/${vote}_${area}_${props.poll}.json`);
  geojson.value = response.data.value as any;
  if (geojson.value) {

    if(potential) {
      const dataset = geojson.value.features.map((feature: any) => feature.properties['potential'])
      infoLegendMax.value = getMax(dataset).toFixed(2);
      infoLegendMin.value = getMin(dataset).toFixed(2);

      geojson.value.features.forEach((feature: any) => {
        feature.properties['fill'] = feature.properties['potential-fill']
      })
    }else{
      const dataset = geojson.value.features.map((feature: any) => feature.properties['votes-in-percent'])
      infoLegendMax.value = getMax(dataset).toFixed(2);
      infoLegendMin.value = getMin(dataset).toFixed(2);
    }

    geoclient = L.geoJSON(geojson.value, {
      style: geoStyler,
      onEachFeature: onEachFeature,
    }).addTo(map.value.leafletObject);
  }
}

const onMapReady = async () => {
  //create map
  await loadGeoJson(String(vote.value), String(area.value))
}
</script>

<style scoped>
.gradient {
  width: 190px;
  height: 30px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(255, 0, 17, 0.9));
}

.legend-box {
  width: 300px;
  height: 40px;
  background-color: var(--color-linke-red-800);
  opacity: 1;
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  border-color: var(--color-tyrian-purple-800);
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
}

.select-box {
  width: 350px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
}

.select-section {
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 10px;
}

span {
  color: #fff;
}
</style>