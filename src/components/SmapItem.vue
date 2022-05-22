<template>
    <div v-if="smap" class="smap" :class="{
        webhook: smap.webhook,
        fetching: smap.webhook === null,
        'no-webhook': smap.webhook === false,
    }">
        <div class="smap-name" @click="showMeta = !showMeta">
            {{ smap.name }}
            <span class="info-no-webhook" v-if="smap.webhook === false">no webhook</span>
        </div>
        
        <div class="info-fetching" v-if="smap.webhook === null">fetching...</div>

        <div class="smap-meta" v-if="showMeta">
            <div><code>{{ smap.smapId }}</code></div>
            <hr>
            <div>Last changed: {{ smap.lastChanged }}</div>
            <div v-if="smap.lastPublishedVersion">Version: {{ smap.lastPublishedVersion.version }}</div>
            <hr>
            <div>Installations: {{ smap.installationsCount }}</div>
            <div>User licenses: {{ smap.userLicenseCount }}</div>
            <div>Data entries: {{ smap.totalDataCount }}</div>
            <div v-if="smap.webhook">
                <hr>
                <div>Webhook URL</div>
                <div><input type="text" :value="smap.webhook.serverUrl"></div>
            </div>
        </div>

        <div v-if="smap.webhook">
            <div v-if="smap.webhook.options">
                <div>
                    <code v-if="smap.webhook.options === 'HttpGet'" class="method method-get">get</code>
                    <code v-if="smap.webhook.options === 'HttpPost'" class="method method-post">post</code>
                    <span class="webhook-url">{{ getReadableUrl(smap.webhook.serverUrl) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SmapItem',
    emits: ["setWebhook"],
    // components: {},
    data() {
        return {
            showMeta: false
        }
    },
    props: {
        api: Object,
        smap: Object
    },
    async created() {
        let data = await this.api.getWebhook(this.smap.smapId)
        console.log(this.smap.name, {data})
        if(data === null) {
            this.$emit('setWebhook', this.smap.smapId, false)
        } else {
            this.$emit('setWebhook', this.smap.smapId, data)
        }
    },
    methods: {
        getReadableUrl(url) {
            const lead = url.substr(0, 32)
            const trail = url.substr(url.length-16, url.length)
            return `${lead}...${trail}`
        }
    }
}
</script>

<style scoped>
.smap {
    padding: 4rem 3rem;
    width: 100%;
}

.smap:hover {
    background-color: rgba(0, 0, 0, .5);
}

.smap-name {
    font-size: 1.5rem;
    cursor: default;
    margin-bottom: .5rem;
}

.smap-meta {
    background: #666;
    color: white;
    padding: 2rem;
    margin-bottom: 2rem;
}

.smap-meta input {
    width: 100%;
}

/* .webhook {} */

.fetching, .no-webhook {
    color: #999;
}

.info-no-webhook {
    font-size: 1rem;
    color: #666;
}

.info-fetching {
    font-size: 1rem;
    color: #666;
}

.webhook-url {
    margin-left: .4rem;
    font-size: 1.2rem;
}
</style>