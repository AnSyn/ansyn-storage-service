'use strict';

class JsonUtils {
    static prettyStringify(json) {
        return `${JSON.stringify(json, null, 2)}\n`;
    }
}

module.exports = JsonUtils;