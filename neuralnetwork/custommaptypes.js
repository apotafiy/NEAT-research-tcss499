class ConnectionMap {

    static getConnectionString = (connection) => `${connection[0]},${connection[1]}`;

    constructor() {
        this.map = new Map();
    };

    set(key, value) {
        this.map.set(ConnectionMap.getConnectionString(key), value);
    };

    get(key) {
        return this.map.get(ConnectionMap.getConnectionString(key))
    };

    forEach(callback) {
        this.map.forEach(callback);
    };
};