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
            <div class="smap-meta-box">smapID <code>{{ smap.smapId }}</code></div>
            
            <div class="smap-meta-box">
                <div>Last changed <code>{{ getDate(smap.lastChanged) }}</code></div>
                <div v-if="smap.lastPublishedVersion">Version <code>{{ smap.lastPublishedVersion.version }}</code></div>
            </div>
            
            <div class="smap-meta-box smap-meta-cols">
                <div class="smap-meta-box">Licenses <code>{{ smap.userLicenseCount }}</code></div>
                <div class="smap-meta-box">Installations <code>{{ smap.installationsCount }}</code></div>
                <div class="smap-meta-box">Data entries <code>{{ smap.totalDataCount }}</code></div>
            </div>

            <div v-if="smap.webhook" class="smap-meta-box">
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
        },
        getDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' }
            return new Date(date).toLocaleDateString("en-US", options)
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
    cursor: pointer;
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

.smap-meta code {
    color: rgb(255, 140, 140);
}

.smap-meta-cols {
    display: flex;
}

.smap-meta-cols code {
    font-size: 2.3rem
}

.smap-meta-box {
    padding: 1rem;
    background: black;
    margin: .5rem 0;
}

.smap-meta-cols .smap-meta-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    padding: 0;
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

@import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";
</style>