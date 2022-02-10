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
Object.defineProperty(exports, "__esModule", { value: true });
const heads = ['heads', 'h', '0'];
const tails = ['tails', 't', '1'];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const flip = {
    name: 'flip',
    aliases: ['f', '(╯°□°）╯︵ ┻━┻'],
    description: 'Flips a coin for you',
    execute: (message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (args[0] !== undefined)
            args[0] = args[0].toLocaleLowerCase();
        if (!heads.includes(args[0]) && !tails.includes(args[0])) {
            message.reply(`You have to also guess **heads** or **tails**\n!flip <heads/tails>`).catch(console.error);
            return;
        }
        const guess = heads.includes(args[0]) ? 0 : 1;
        const msg = yield message.reply('Flipping coin...');
        yield sleep(1000);
        const result = Math.floor(Math.random() * 2);
        msg.edit(`${message.author}, You got **${result === 0 ? 'heads' : 'tails'}**! ${result === guess
            ? 'You can leave if you want to'
            : 'You have to spend another 30 minutes on the computer'}`);
    }),
};
exports.default = flip;
