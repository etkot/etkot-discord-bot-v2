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
const axios_1 = __importDefault(require("axios"));
const host = 'https://translate.google.com';
const url = '/_/TranslateWebserverUi/data/batchexecute';
const detectLanguage = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, axios_1.default)({
        method: 'post',
        baseURL: host,
        url,
        data: 'f.req=' +
            encodeURIComponent(JSON.stringify([[['MkEWBc', JSON.stringify([[text, 'auto', 'fi', true], [1]]), null, 'generic']]])),
    });
    try {
        const json = JSON.parse(data.slice(5))[0][2];
        const response = JSON.parse(json);
        return response[0][2];
    }
    catch (error) {
        console.log(error);
        return 'fi';
    }
});
exports.default = detectLanguage;
