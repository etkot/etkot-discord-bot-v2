"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
class Client extends discord_js_1.default.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.default.Collection();
        this.events = new discord_js_1.default.Collection();
    }
}
exports.default = Client;
