class Methods {
    static load(key) {
        const data = localStorage[key];
        if (typeof data === "undefined") {
            return null;
        }
        return data;
    }
    static save(key, data) {
        localStorage[key] = data;
        return true;
    }
    static sendRuntime(data) {
        chrome.runtime.sendMessage(data);
    }
    static getLocalizedText(key) {
        return chrome.i18n.getMessage(key)
    }
    static setIcon(state) {
        chrome.browserAction.setIcon({path: "/style/" + state + ".png"})
    }
    static version() {
        return chrome.runtime.getManifest().version;
    }
    static returnState(module){
        return Methods.load(module);
    }
}
