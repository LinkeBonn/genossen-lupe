<template>
  <div class="content-box">
    <div class="content">
      <div class="select-section">
        <div class="select-box">
          <USelect v-model="area" :items="areas" class="w-full"/>
        </div>
      </div>
      <ResultLinechart v-if="datasource" :data="datasource"/>
      <div v-if="areaDatasource" class="detailed-box">
        <div v-for="(areapoint, index) in areaDatasource" :key="index" class="detail">
          <ResultLinechart :data="areapoint"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const datasource = ref(undefined)
const areaDatasource = ref([])

const areas = ['Bonn', "Bonn-Zentrum", "Bonn-Castell / Rheindorf-Süd", "Innere Nordstadt", "Baumschulviertel / Südstadt", "Neu-Tannenbusch / Buschdorf", "Auerberg / Graurheindorf", "Tannenbusch", "Dransdorf / Lessenich / Meßdorf", "Endenich I", "Poppelsdorf", "Kessenich", "Dottendorf / Gronau", "Äußere Nordstadt", "Endenich II", "Venusberg / Ippendorf", "Röttgen / Ückesdorf", "Friesdorf", "Villenviertel / Rüngsdorf", "Plittersdorf / Hochkreuz", "Bad Godesberg-Mitte", "Heiderhof / Muffendorf", "Pennenfeld / Lannesdorf", "Mehlem", "Beuel-Zentrum", "Pützchen / Bechlinghoven / Holtorf / Ungarten", "Beuel-Süd / Limperich", "Holzlar / Hoholz", "Küdinghoven / Ramersdorf / Oberkassel", "Vilich / Geislar / Vilich-Müldorf", "Lengsdorf / Brüser Berg", "Duisdorf / Finkenhof / Lengsdorf", "Duisdorf / Medinghoven",]

const area = ref(areas[0])

watch(area, (newVal) => {
  generatedAreaDatasource(newVal)
})


const fetchDataSource = async () => {
  const response = await useFetch('/data/deep-dive.json');
  datasource.value = response.data.value as any;
  generatedAreaDatasource(area.value);
}

const generatedAreaDatasource = (area: string) => {
  areaDatasource.value = [];
  if (datasource.value) {
    if (area === 'Bonn') {
      const areaNumbers = generateAreaList(datasource.value[0].results);
      areaNumbers.forEach((areaNumber: any) => {
        const areaResults = [];
        datasource.value.forEach((element: any) => {
          element.results.forEach((result: any) => {
            if (result.area === areaNumber) {
              areaResults.push({result: result.result, name: element.poll, areaname: result.name});
            }
          })
        })
        areaDatasource.value.push(areaResults);
      })
    } else {
      const areaFound = datasource.value[0].results.find((probe: any) => probe.name === area);
      const areaNumbers = generateAreaList(areaFound.areas);
      areaNumbers.forEach((areaNumber: any) => {
        const areaResults = [];
        datasource.value.forEach((element: any) => {
          element.results.forEach((result: any) => {
            result.areas.forEach((resultArea: any) => {
              if (resultArea.area === areaNumber) {
                areaResults.push({result: resultArea.result, name: element.poll, areaname: resultArea.name});
              }
            })
          })
        })
        areaDatasource.value.push(areaResults);
      })
    }
  }
}

const generateAreaList = (datasource: any) => {
  return datasource.map((datapoint: any) => datapoint.area)
}

onMounted(async () => {
  await fetchDataSource();
})
</script>
<style scoped>
.content {
  width: 90%;
  justify-content: center;
}

@media (min-width: 1250px) {
  .content {
    width: 70%;
  }
}

.detailed-box {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.detail {
  width: 50%;
  margin-top: 25px;
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
</style>