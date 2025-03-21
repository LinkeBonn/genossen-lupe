<template>
  <Download link="/data/deep-dive.json"/>
  <div class="content-box">
    <ClientOnly>
      <div class="content">
        <ResultLinechart v-if="datasource" :data="datasource"/>
        <div class="detailed-box">
          <div v-if="areaDatasource" v-for="areapoint in areaDatasource" class="detail">
            <ResultLinechart :data="areapoint"/>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const datasource = ref(undefined)
const areaDatasource = ref([])

const fetchDataSource = async () => {
  const response = await useFetch('/data/deep-dive.json');
  datasource.value = response.data.value as any;
  generatedAreaDatasource();
}

const generatedAreaDatasource = () => {
  if (datasource.value) {
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
</style>