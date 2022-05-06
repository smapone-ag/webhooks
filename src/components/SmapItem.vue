<template>
    <div v-if="smap && checkFilter" class="smap" :class="{
        webhook: webhook,
        fetching: webhook === null,
        'no-webhook': webhook === false,
    }">
        <div class="smap-name" @click="showMeta = !showMeta">
            {{ smap.name }}
            <span class="info-no-webhook" v-if="webhook === false">no webhook</span>
        </div>
        
        <div class="info-fetching" v-if="webhook === null">fetching...</div>

        <div class="smap-meta" v-if="showMeta">
            <div><code>{{ smap.smapId }}</code></div>
            <hr>
            <div>Last changed: {{ smap.lastChanged }}</div>
            <div v-if="smap.lastPublishedVersion">Version: {{ smap.lastPublishedVersion.version }}</div>
            <hr>
            <div>Installations: {{ smap.installationsCount }}</div>
            <div>User licenses: {{ smap.userLicenseCount }}</div>
            <div>Data entries: {{ smap.totalDataCount }}</div>
            <div v-if="webhook">
                <hr>
                <div>Webhook URL</div>
                <div><input type="text" :value="webhook.serverUrl"></div>
            </div>
        </div>

        <div v-if="webhook">
            <div v-if="webhook.options">
                <div>
                    <code v-if="webhook.options === 'HttpGet'" class="method method-get">get</code>
                    <code v-if="webhook.options === 'HttpPost'" class="method method-post">post</code>
                    <span class="webhook-url">{{ getReadableUrl(webhook.serverUrl) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SmapItem',
    // components: {},
    data() {
        return {
            webhook: null,
            showMeta: false
        }
    },
    props: {
        api: Object,
        filter: Object,
        smap: Object
    },
    async created() {
        let data = await this.api.getWebhook(this.smap.smapId)
        if(data === null) {
            this.webhook = false
        } else {
            this.webhook = data
        }
    },
    computed: {
        checkFilter() {
            let group = false
            if(!this.filter.group) {
                group = true
            }
            else if(this.filter.group == 'webhook' && this.webhook !== false && this.webhook !== null) {
                group = true
            }
            else if(this.filter.group == 'no-webhook' && this.webhook === false) {
                group = true
            }
            else if(this.filter.group == 'get' && this.webhook && this.webhook.options == 'HttpGet') {
                group = true
            }
            else if(this.filter.group == 'post' && this.webhook && this.webhook.options == 'HttpPost') {
                group = true
            }

            let name = false
            if(this.filter.name === null) {
                name = true
            }
            else if(this.smap.name.toLowerCase().includes(this.filter.name.toLowerCase())) {
                name = true
            }

            return group && name
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