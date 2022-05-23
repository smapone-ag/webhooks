<template>
    <div id="settings" class="box">
        <input type="text" v-model="filter.name" placeholder="Search smap name">
        <span
            class="filter"
            :class="{'active': filter.group===false}"
            @click="setFilterGroup(false)">all</span>
        <span
            class="filter"
            :class="{'active': filter.group=='webhook'}"
            @click="setFilterGroup('webhook')">with webhook</span>
        <span
            class="filter"
            :class="{'active': filter.group=='post'}"
            @click="setFilterGroup('post')"><code class="method method-post">post</code></span>
        <span
            class="filter"
            :class="{'active': filter.group=='get'}"
            @click="setFilterGroup('get')"><code class="method method-get">get</code></span>
        <span
            class="filter"
            :class="{'active': filter.group=='no-webhook'}"
            @click="setFilterGroup('no-webhook')">no webhook</span>
    </div>
    <div class="box">
        <smap-item
            v-for="smap in filteredSmaps"
            :key="smap.smapId"
            :smap="smap"
            :api="api"
            class="smap"
            @setWebhook="onSetWebhook"
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
            filter: {
                name: null,
                group: false
            },
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
    computed: {
        filteredSmaps() {
            const filter = this.filter
            return this.smaps.filter(function(smap) {
                let group = false
                if(!filter.group) {
                    group = true
                }
                else if(filter.group == 'webhook' && smap.webhook !== false && smap.webhook !== null) {
                    group = true
                }
                else if(filter.group == 'no-webhook' && smap.webhook === false) {
                    group = true
                }
                else if(filter.group == 'get' && smap.webhook && smap.webhook.options == 'HttpGet') {
                    group = true
                }
                else if(filter.group == 'post' && smap.webhook && smap.webhook.options == 'HttpPost') {
                    group = true
                }

                let name = false
                if(filter.name === null || smap.name.toLowerCase().includes(filter.name.toLowerCase())) {
                    name = true
                }
                return group && name
            })
        }
    },
    methods: {
        setFilterGroup: function(group) {
            this.filter.group = group
        },
        onSetWebhook: function(smapId, webhook) {
            console.log('child has called parent', smapId)
            let find = this.smaps.find(smap => smap.smapId == smapId)
            console.log({find})
            if(typeof find !== 'undefined') {
                find.webhook = webhook
            }
        }
    }
}
</script>

<style scoped>
#settings {
    display: flex;
    font-size: .75rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}

#settings > input {
    cursor: pointer;
    font-size: .6rem;
    color: #444;
    padding: 0.2rem 0.4rem;
}

#settings > .filter {
    cursor: pointer;
    margin-left: 1rem;
    margin-right: 1rem;
}

#settings > .filter.active {
    border-bottom: 3px solid white;
}
</style>
