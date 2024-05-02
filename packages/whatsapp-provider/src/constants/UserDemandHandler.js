"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDemandHandler = void 0;
class UserDemandHandler {
    constructor() {
        this.userDemandMap = new Map();
    }
    get(user) {
        return this.userDemandMap.get(user);
    }
    set(user, value) {
        return this.userDemandMap.set(user, value);
    }
    add(user, value) {
        const demand = this.get(user);
        if (!demand) {
            return this.set(user, value);
        }
        return this.set(user, demand + value);
    }
    reduce(user, value) {
        const demand = this.get(user);
        if (!demand) {
            return this.set(user, 0);
        }
        return this.set(user, demand - value);
    }
}
exports.UserDemandHandler = UserDemandHandler;
