const KEYS = {
    THEME: 'scms-theme',
    SAVED_ANNOUNCEMENTS: 'scms-saved-announcements',
    REGISTERED_EVENTS: 'scms-registered-events',
    JOINED_CLUBS: 'scms-joined-clubs',
    LAST_VISITED: 'scms-last-visited'
};

export const Storage = {
    get(key, defaultValue = null) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    },
    
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    addItem(listKey, id) {
        const list = this.get(listKey, []);
        if (!list.includes(id)) {
            list.push(id);
            this.set(listKey, list);
            return true;
        }
        return false;
    },

    KEYS
};