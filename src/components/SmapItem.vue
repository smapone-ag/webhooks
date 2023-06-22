<template>
    <div
        v-if="smap"
        class="smap"
        :class="{
            webhook: smap.webhook,
            fetching: smap.webhook === null,
            'no-webhook': smap.webhook === false,
        }"
    >
        <div class="smap-name" @click="showMeta = !showMeta">
            {{ smap.name }}
            <span class="info-no-webhook" v-if="smap.webhook === false">no webhook</span>
        </div>

        <div class="info-fetching" v-if="smap.webhook === null">fetching...</div>

        <div class="smap-meta" v-if="showMeta">
            <div class="smap-meta-box">
                smapID <code>{{ smap.smapId }}</code>
            </div>

            <div class="smap-meta-box">
                <div>
                    Last changed <code>{{ getDate(smap.lastChanged) }}</code>
                </div>
                <div v-if="smap.lastPublishedVersion">
                    Version <code>{{ smap.lastPublishedVersion.version }}</code>
                </div>
            </div>

            <div class="smap-meta-box smap-meta-cols">
                <div class="smap-meta-box">
                    Licenses <code>{{ smap.userLicenseCount }}</code>
                </div>
                <div class="smap-meta-box">
                    Installations <code>{{ smap.installationsCount }}</code>
                </div>
                <div class="smap-meta-box">
                    Data entries <code>{{ smap.totalDataCount }}</code>
                </div>
            </div>

            <div v-if="smap.webhook" class="smap-meta-box">
                <div>Webhook URL</div>
                <div><input type="text" :value="smap.webhook.serverUrl" /></div>
            </div>

            <div class="smap-meta-box smap-meta-cols">
                <div class="set-webhook smap-meta-box" @click="setWebhook()">
                    Set new webhook
                </div>

                <div
                    v-if="smap.webhook"
                    class="remove-webhook smap-meta-box"
                    @click="removeWebhook()"
                >
                    Remove webhook
                </div>
            </div>
        </div>

        <div v-if="smap.webhook">
            <div v-if="smap.webhook.options">
                <div>
                    <code
                        v-if="smap.webhook.options === 'HttpGet'"
                        class="method method-get"
                        >get</code
                    >
                    <code
                        v-if="smap.webhook.options === 'HttpPost'"
                        class="method method-post"
                        >post</code
                    >
                    <span class="webhook-url">{{
                        getReadableUrl(smap.webhook.serverUrl)
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SmapItem',
    emits: ['displayWebhook'],
    // components: {},
    data() {
        return {
            showMeta: false,
        };
    },
    props: {
        api: Object,
        smap: Object,
    },
    async created() {
        let data = await this.api.getWebhook(this.smap.smapId);
        if (data === null) {
            this.$emit('displayWebhook', this.smap.smapId, false);
        } else {
            this.$emit('displayWebhook', this.smap.smapId, data);
        }
    },
    methods: {
        getReadableUrl(url) {
            let readableUrl = url;
            if (url.length > 32 + 16) {
                const lead = url.substr(0, 32);
                const trail = url.substr(url.length - 16, url.length);
                readableUrl = `${lead}...${trail}`;
            }
            return readableUrl;
        },
        getDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString('en-US', options);
        },
        async setWebhook() {
            const method = 'HttpPost';
            const target = prompt('Target URL (must be https)');

            if (this.isValidHttpUrl(target) !== false && target != null) {
                const result = await this.api.setWebhook(
                    this.smap.smapId,
                    target,
                    method
                );
                if (result.status == 204) {
                    this.$emit('displayWebhook', this.smap.smapId, {
                        serverUrl: target,
                        options: method,
                    });
                }
            } else {
                alert('Sorry, this is no valid URL. Please try again.');
            }
        },
        async removeWebhook() {
            if (confirm('Sure?') == true) {
                const result = await this.api.removeWebhook(this.smap.smapId);
                if (result.status == 204) {
                    this.$emit('displayWebhook', this.smap.smapId, false);
                }
            }
        },
        isValidHttpUrl(string) {
            let url;

            try {
                url = new URL(string);
            } catch (_) {
                return false;
            }

            return url.protocol === 'https:';
        },
    },
};
</script>

<style scoped>
.smap {
    padding: 4rem 3rem;
    width: 100%;
}

.smap:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.smap-name {
    font-size: 1.5rem;
    cursor: pointer;
    margin-bottom: 0.5rem;
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
    font-size: 2.3rem;
}

.smap-meta-box {
    padding: 1rem;
    background: black;
    margin: 0.5rem 0;
}

.smap-meta-cols .smap-meta-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    padding: 0;
}

/* .webhook {} */
.set-webhook,
.remove-webhook {
    padding: 1rem;
    cursor: pointer;
}

.set-webhook {
    background: rgba(255, 255, 255, 0.15);
}

.remove-webhook {
    background: red;
}

.fetching,
.no-webhook {
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
    margin-left: 0.4rem;
    font-size: 1.2rem;
}
</style>