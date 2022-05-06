<template>
    <div v-if="smap" class="smap" :class="{
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
        smap: Object,
        token: String
    },
    async created() {
        let url = `https://platform.smapone.com/Backend/intern/Smaps/${this.smap.smapId}/Notification/Data/Webhook?accessToken=${this.token}`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data === null) {
                    this.webhook = false
                } else {
                    this.webhook = data
                }
            })
    },
    methods: {
        getReadableUrl(url) {
            const lead = url.substr(0, 32)
            const trail = url.substr(url.length-16, url.length)
            return `${lead}...${trail}`;
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

.method {
    display: inline-block;
    font-size: 1rem;
    padding: 0.2rem 0.5rem;
}

.method-get {
    background-color: blue;
}

.method-post {
    background-color: green;
}
</style>