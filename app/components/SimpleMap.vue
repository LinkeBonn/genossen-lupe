<template>
  <div>
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
    </LMap>
  </div>
</template>

<script setup lang="ts">
import L from 'leaflet'

const props = defineProps({
  datasourceName: {
    type: String,
    default: ""
  }
})

const map = ref(null)
const geojson = ref(undefined)

var geoclient: any;

const onEachFeature = (feature: any, layer: any) => {
  if (feature.properties && feature.properties.name) {
    let featureString = ""
    Object.keys(feature.properties).forEach((key: any) => {
      featureString += `${key}: ${feature.properties[key]}<br/>`;
    })
    layer.bindPopup(`<p>${featureString}</p>`)
  }
}

var geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

const companyColors = {
  "LEG": "#377eb8",
  "Sahle Wohnen": "#ffff33",
  "ENKAS": "#ff7f00",
  "Vonovia": "#e41a1c",
  "Net Zero Properties Group": "#e41a1c",
  "Heimstaden": "#999999",
  "Viva West": "#984ea3",
  "RheinHaus": "#f781bf",
  "DERR Wohnbau": "#4daf4a",
}

const loadGeoJson = async () => {
  if (geoclient) {
    map.value.leafletObject.removeLayer(geoclient)
  }
  const response = await useFetch(`/data/${props.datasourceName}.json`);
  geojson.value = response.data.value as any;
  if (geojson.value) {
    geoclient = L.geoJSON(geojson.value, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        if(feature.properties && feature.properties.wohnungsbaugesellschaft) {
          const styledMarker = geojsonMarkerOptions;
          styledMarker.fillColor = companyColors[feature.properties.wohnungsbaugesellschaft];
          return L.circleMarker(latlng, styledMarker);
        }
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    }).addTo(map.value.leafletObject);
  }
}

const onMapReady = async () => {
  //create map
  await loadGeoJson()
}
</script>

<style scoped>

span {
  color: #fff;
}
</style>
