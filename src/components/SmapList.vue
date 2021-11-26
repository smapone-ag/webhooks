<template>
    <div v-if="token !== null">
        <smap-item
            v-for="smap in smaps"
            :key="smap.smapId"
            :smap="smap"
            :token="token"
            class="smap"
        >
        </smap-item>
    </div>
</template>

<script>
// import moment from 'moment';
import SmapItem from './SmapItem.vue';

export default {
    name: 'SmapList',
    components: {
        SmapItem
    },
    data() {
        return {
            smaps: []
        }
    },
    props: {
        token: String
    },
    async created() {
        console.log('Fetching smaps ...')
        fetch(`https://platform.smapone.com/Backend/v1/Smaps?accessToken=${this.token}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched smaps data', {data})
                this.smaps = data
            })
    }
}
</script>

<style scoped>
</style>
