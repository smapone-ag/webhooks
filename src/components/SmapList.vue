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
                this.smaps = data.sort((a, b) => {
                    let nameA = a.name.toLowerCase(),
                        nameB = b.name.toLowerCase();

                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });

            })
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
