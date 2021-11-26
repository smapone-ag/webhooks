<template>
    <div class="smap">
        <span>{{ smap.name }}</span>
        <code>{{ smap.smapId }}</code>
        <div class="fetching" v-if="webhook === null">fetching...</div>
        <div class="no-webhook" v-if="webhook === false">no webhook</div>
        <div v-if="typeof webhook === 'object'">
            <div v-if="webhook.options && (typeof webhook.options !== 'undefined')">
                <div v-if="webhook.options === 'HttpGet'">
                    <code class="method method-get">get</code> <input type="text" :value="webhook.serverUrl">
                </div>
                <div v-if="webhook.options === 'HttpPost'">
                    <code class="method method-post">post</code> <input type="text" :value="webhook.serverUrl">
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
            webhook: null
        }
    },
    props: {
        smap: Object,
        token: String
    },
    async created() {
        console.log({"smap": this.smap})
        console.log('TYPEOF', typeof this.webhook)
        console.log(`Checking webhook for smapId ${this.smap.smapId}`)
        let url = `https://platform.smapone.com/Backend/intern/Smaps/${this.smap.smapId}/Notification/Data/Webhook?accessToken=${this.token}`
        // console.log(url)
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('webhookdata', {data})
                if(data === null) {
                    this.webhook = false
                } else {
                    this.webhook = data
                }
            })
    }
}
</script>

<style scoped>
.smap {
    margin-bottom: 2rem;
}

.fetching, .no-webhook {
    font-size: 1rem;
    color: #c3c3c3;
}

.method {
    display: inline-block;
    background-color: green;
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