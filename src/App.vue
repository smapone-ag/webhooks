<template>
    <div class="container">
        <div class="box token-input" :class="{'token-entered': api}">
            Enter your smapOne API token here<br>
            <input type="text" v-model="token">
            
            <div v-if="token === null" class="token-info">
                Is it safe to enter token here?

                <ul>
                    <li>This script runs on github, only allows frontend, no backend services, you can track all calls done by the frontend.</li>
                    <li>If you don't trust, feel free to <a href="https://github.com/moritzhesse/webhooks">download the script</a> and to compile and run by yourself.</li>
                </ul>    
            </div>
        </div>
        <smap-list v-if="api" :api="api"></smap-list>
    </div>
</template>

<script>
import SmapList from './components/SmapList.vue';
import Api from './smapjs/Api.js';

export default {
    name: 'App',
    components: {
        SmapList
    },
    data() {
        return {
            token: null,
            api: null
        }
    },
    async created() {
        // Parse URL param
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        
        // Parse token parameter
        if(urlParams.has('token')) {
            this.token = urlParams.get('token')
        }
    },
    watch: {
        // If token entered manually, not via URL
        // eslint-disable-next-line no-unused-vars
        token(newToken, oldToken) {
            this.api = new Api(this.token)
        }
    },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');

/* Reset CSS */
*, *::before, *::after {
    box-sizing: border-box;
}

body {
    background-color: #000;
    color: #efefef;
    font-family: 'Fira Code', 'Courier new', monospace;
    font-size: 20px;
    letter-spacing: -2px;
    overflow-x: hidden;
    margin: 0;
    padding: 1rem;
    padding-bottom: 0;
}

a {
    color: var(--smapone-blue-color);
    text-decoration: none;
}
a:hover {
    border-bottom: 1px solid var(--smapone-blue-color);
}

:root {
    /* Colors */
    --smapone-blue-color: #249fcd;
    --background-color: #1b1b1b;
    --background-light-color: #888;
    --text-gray-color: #444;
    --text-color: #fff;
    
    /* Widths */
    --message-border-width: .5rem;
}

.container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    place-items: center;
}

.box {
    display: flex;
    background-color: #444;
    margin-bottom: .3rem;
    padding: 0;
    overflow-x: hidden;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: flex-start;
    max-width: 680px;
    width: 100%;
}

.box.token-input {
    place-content: center;
    padding: 4rem;
}

.box.token-entered {
    color: #999;
    font-size: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.token-info {
    color: #999;
    font-size: 1rem;
    margin-top: 3rem;
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

/* Responsiveness */
/* @media (max-width: 420px) {
    .message > .body {
        font-size: 1rem;
    }
} */

/*
CSS Breakpoints
@media (min-width:320px)  { smartphones, iPhone, portrait 480x320 phones }
@media (min-width:481px)  { portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. }
@media (min-width:641px)  { portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones }
@media (min-width:961px)  { tablet, landscape iPad, lo-res laptops ands desktops }
@media (min-width:1025px) { big landscape tablets, laptops, and desktops }
@media (min-width:1281px) { hi-res laptops and desktops }
*/
</style>
