"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getValueByPath;
// Utility function
function getValueByPath(obj, path) {
    return path.split('.').reduce((o, p) => o?.[p], obj);
}
