class Api {
    constructor(token) {
        this.token = token
    }

    async getSmaps() {
        let url = `https://platform.smapone.com/Backend/v1/Smaps`
        return await this.get(url)
    }

    async getWebhook(smapId) {
        let url = `https://platform.smapone.com/Backend/intern/Smaps/${smapId}/Notification/Data/Webhook`
        return await this.get(url)
    }

    async get(url) {
        url = `${url}?accessToken=${this.token}`
        let response = await fetch(url)
        return await response.json()
    }

    async setWebhook(smapId, target, method) {
        let url = `https://platform.smapone.com/Backend/intern/Smaps/${smapId}/Notification/Data/Webhook?accessToken=${this.token}`
        let options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ServerUrl: target,
                Options: method
            }),
        }
        try {
            let response = await fetch(url, options)
            return response
        } catch (error) {
            console.log({ error });
        }
    }

    async removeWebhook(smapId) {
        let url = `https://platform.smapone.com/Backend/intern/Smaps/${smapId}/Notification/Data/Webhook?accessToken=${this.token}`
        let options = {
            method: 'DELETE',
            // headers: { 'Content-Type': 'application/json' }
        }
        try {
            let response = await fetch(url, options)
            return response
        } catch (error) {
            console.log({ error })
        }
    }
}

module.exports = Api