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
}

module.exports = Api;