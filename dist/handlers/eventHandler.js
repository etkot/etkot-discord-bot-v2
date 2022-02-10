"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFiles_1 = __importDefault(require("../utils/getFiles"));
const path_1 = __importDefault(require("path"));
const eventsPath = path_1.default.join(__dirname, '../events');
const handler = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield (0, getFiles_1.default)(eventsPath);
    console.log(`Loading ${events.length} events`);
    for (const path of events) {
        const event = require(path).default;
        if (event.eventName) {
            client.on(event.eventName, (e) => event.execute(client, e));
        }
    }
});
exports.default = handler;
