<template>
    <div id="settings" class="box">
        <input type="text" v-model="filter.name">
        <span
            class="filter"
            :class="{'active': filter.group==false}"
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
    methods: {
        setFilterGroup: function(group) {
            this.filter.group = group
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
    font-size: .6rem;
    color: #444;
    padding: 0.2rem 0.4rem;
}

#settings > .filter {
    cursor: default;
    margin-left: 1rem;
    margin-right: 1rem;
}

#settings > .filter.active {
    border-bottom: 3px solid white;
}
</style>
