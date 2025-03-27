<template>
  <div>
  <div class="select-section">
    <div class="select-box">
      <USelect v-model="vote" :items="votes" />
      <USelect v-model="area" :items="areas" />
      <USelect v-model="mode" :items="modes"/>
    </div>
    <!--<UCheckbox v-model="potential" label="Potential Nichtwähler" />-->
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
        <span>{{infoTextParty}}</span>
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

const modes = ["Die Linke", "Gewinner"]

const map = ref(null)
const geojson = ref(undefined)
const infoTextNumber = ref("")
const infoTextName = ref("")
const infoTextParty = ref("")
const infoTextPercent = ref("")
const infoLegendMax = ref("0")
const infoLegendMin = ref("0")
const vote = ref(votes.value[0])
const area = ref(areas[0])
const mode = ref(modes[0])
const potential = ref(false)

const resultkeys = [
  'Pdl',
  'CDU',
  'SPD',
  'B90',
  'AfD',
  'BSW',
  'FDP',
]

var geoclient: any;

const geoStyler = (feature: any) => {
  let fillColor = "#fff"
  if(mode.value === 'Die Linke'){
    fillColor = getFillColor("Pdl", feature.properties['votes-in-percent-resultPdl'])
  }else if(mode.value === "Gewinner"){
    fillColor = getFillColor(getWinner(feature), feature.properties[`votes-in-percent-result${getWinner(feature)}`])
  }
  return {
    fillOpacity: 0.8,
    fillColor: fillColor,
    weight: 1.2,
    color: '#fff',
  }
}

const getWinner = (feature: any) => {
  let winnerResult = 0;
  let winnerParty = ""
  resultkeys.forEach((key) => {
    console.log(feature.properties)
    if(Number(feature.properties[`votes-in-percent-result${key}`]) > Number(winnerResult)) {
      console.log(winnerResult)
      winnerResult = Number(feature.properties[`votes-in-percent-result${key}`]);
      winnerParty = key;
    }
  })
  return winnerParty
}

function highlightFeature(e: any) {
  var layer = e.target;

  infoTextName.value = layer.feature.properties['area-name'];
  infoTextNumber.value = layer.feature.properties['area-number'];
  if(mode.value === "Die Linke"){
    infoTextPercent.value = potential.value ? layer.feature.properties['potential'].toFixed(2) : layer.feature.properties['votes-in-percent-resultPdl'];
    infoTextParty.value = "PdL"
  }else if(mode.value === "Gewinner"){
    infoTextPercent.value = layer.feature.properties[`votes-in-percent-result${getWinner(layer.feature)}`];
    infoTextParty.value = getWinner(layer.feature);
  }

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

watch(mode, (newVal) => {
  loadGeoJson(vote.value, area.value, potential.value)
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

const getFillColor = (party: string, result: number) => {
  const coefficient = 100 / Number(infoLegendMax.value);
  const newOpacity = Math.round(((result * coefficient) / 100) * 10) / 10;
  if(party === "Pdl"){
    return hslToHex(300, 100, 100 - 50 * newOpacity)
  }else if(party === "CDU"){
    return hslToHex(28, 100, 100 - 50 * newOpacity)
  }else if(party === "SPD"){
    return hslToHex(360, 100, 100 - 50 * newOpacity)
  }else if(party === "B90"){
    return hslToHex(120, 100, 100 - 50 * newOpacity)
  }else if(party === "BSW"){
    return hslToHex(275, 100, 100 - 50 * newOpacity)
  }else if(party === "FDP"){
    return hslToHex(58, 100, 100 - 50 * newOpacity)
  }else if(party === "AfD"){
    return hslToHex(225, 100, 100 - 50 * newOpacity)
  }
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}



const loadGeoJson = async (vote: string, area: string, potential = false) => {
  if (geoclient) {
    map.value.leafletObject.removeLayer(geoclient)
  }
  const response = await useFetch(`/data/${vote}_${area}_${props.poll}.json`);
  geojson.value = response.data.value as any;
  if (geojson.value) {

    if(potential) {
      const dataset = geojson.value.features.map((feature: any) => feature.properties['participation'] * 100)
      infoLegendMax.value = getMax(dataset).toFixed(2);
      infoLegendMin.value = getMin(dataset).toFixed(2);
      const coefficient = 100 / Number(infoLegendMax.value);
      geojson.value.features.forEach((feature: any) => {
        const newOpacity = Math.round(((feature.properties['participation'] * coefficient) / 100) * 10) / 10;
        feature.properties['fill'] = hslToHex(360, 100, 100 - 50 * newOpacity)
      })
    }else{
      if(mode.value === "Die Linke"){
        const dataset = geojson.value.features.map((feature: any) => feature.properties['votes-in-percent-resultPdl']);
        infoLegendMax.value = getMax(dataset).toFixed(2);
        infoLegendMin.value = getMin(dataset).toFixed(2);
      }else if(mode.value === "Gewinner"){
        const dataset = geojson.value.features.map((feature: any) => feature.properties[`votes-in-percent-result${getWinner(feature)}`]);
        infoLegendMax.value = getMax(dataset).toFixed(2);
        infoLegendMin.value = getMin(dataset).toFixed(2);
      }
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
  min-width: 450px;
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