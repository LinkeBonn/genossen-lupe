export const useGeoData = (voteName: string) => {

    const geoDatasource = useState('geodata-wahlergebniss', () => null)

    const loading = ref<boolean>(true)

    const setGeoDataSource = async (vote: string, area: string) => {
        useFetch(`/data/${vote.toLowerCase()}_${area.toLowerCase()}_${voteName}.json`, {
            onResponse({response}) {
                geoDatasource.value = response._data
                loading.value = false
            }
        })
    }

    const onAreaChange = (newVal: any): void => {
        setGeoDataSource(newVal.vote, newVal.area)
    }

    const onVoteChange = (newVal: any): void => {
        setGeoDataSource(newVal.vote, newVal.area)
    }

    return {
        onVoteChange,
        onAreaChange,
        setGeoDataSource,
        geoDatasource,
        loading
    }
}