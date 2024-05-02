"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHoursDifference = void 0;
function getHoursDifference(date1, date2) {
    const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return diffInHours;
}
exports.getHoursDifference = getHoursDifference;
