<template>
    <!-- <div class="box settings">
        <select name="filter-webhooks" id="filter-webhooks">
            <option value="all">show all</option>
            <option value="all-webhooks">all webhooks</option>
            <option value="all-post-webhooks">all POST webhooks</option>
            <option value="all-get-webhooks">all GET webhooks</option>
            <option value="no-webhooks">smaps without webhook</option>
        </select>
    </div> -->
    <div class="box">
        <smap-item
            v-for="smap in smaps"
            :key="smap.smapId"
            :smap="smap"
            :api="api"
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
    }
}
</script>

<style scoped>
.settings {
    place-content: center;
    font-size: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
}
</style>
