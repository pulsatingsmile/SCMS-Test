const KEYS = {
    THEME: 'scms-theme',
    SAVED_ANNOUNCEMENTS: 'scms-saved-announcements',
    REGISTERED_EVENTS: 'scms-registered-events',
    JOINED_CLUBS: 'scms-joined-clubs',
    LAST_VISITED: 'scms-last-visited'
};

// These are the keys that should be unique to each user
const USER_SPECIFIC_KEYS = [
    KEYS.SAVED_ANNOUNCEMENTS,
    KEYS.REGISTERED_EVENTS,
    KEYS.JOINED_CLUBS,
    KEYS.LAST_VISITED
];

export const Storage = {
    // Helper to get the real key (e.g., "scms-joined-clubs-B2025001")
    _getScopedKey(key) {
        if (USER_SPECIFIC_KEYS.includes(key)) {
            const userId = localStorage.getItem('scms-user-id');
            if (userId) {
                return `${key}-${userId}`;
            }
        }
        return key;
    },

    get(key, defaultValue = null) {
        const realKey = this._getScopedKey(key);
        const value = localStorage.getItem(realKey);
        return value ? JSON.parse(value) : defaultValue;
    },
    
    set(key, value) {
        const realKey = this._getScopedKey(key);
        localStorage.setItem(realKey, JSON.stringify(value));
    },

    addItem(listKey, id) {
        // _getScopedKey is handled automatically by this.get and this.set
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