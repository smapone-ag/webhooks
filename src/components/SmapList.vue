<template>
    <div id="settings" class="box">
        <span class="filter" @click="setFilter(false)">all smaps</span>
        <span class="filter" @click="setFilter('webhook')">smaps with webhooks</span>
        <span class="filter" @click="setFilter('post')"><code class="method method-post">post</code> webhooks</span>
        <span class="filter" @click="setFilter('get')"><code class="method method-get">get</code> webhooks</span>
        <span class="filter" @click="setFilter('no-webhook')">smaps without webhook</span>
    </div>
    <div class="box">
        <smap-item
            v-for="smap in smaps"
            :key="smap.smapId"
            :smap="smap"
            :api="api"
            :filter="filter"
            class="smap"
        >
        </smap-item>
    </div>
</template>

<script>
import SmapItem from './SmapItem.vue'

export default {
    name: 'SmapList',
    components: {
        SmapItem
    },
    data() {
        return {
            filter: false,
            smaps: []
        }
    },
    props: {
        api: Object
    },
    async created() {
        let data = await this.api.getSmaps()
        if(data !== null) {
            this.smaps = data.sort((a, b) => {
                return a.name.localeCompare(b.name)
            })
        }
    },
    methods: {
        setFilter: function(filter) {
            this.filter = filter
        }
    }
}
</script>

<style scoped>
#settings {
    place-content: center;
    display: flex;
    font-size: .75rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}

.settings span {
    cursor: default;
}
</style>
