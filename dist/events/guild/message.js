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
const handler = {
    eventName: 'messageCreate',
    execute: (client, message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!message.content.startsWith(process.env.PREFIX || '/') || message.author.bot)
            return;
        const args = message.content.slice((process.env.PREFIX || '/').length).split(/ +/);
        const commandName = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!commandName)
            return;
        const command = client.commands.get(commandName) || client.commands.find((a) => { var _a; return (_a = a.aliases) === null || _a === void 0 ? void 0 : _a.includes(commandName); });
        if (!command) {
            message.reply('Nyt en ymmärrä,, keitän teetä itselleni t. spagetbot');
            return;
        }
        try {
            command.execute(message, args, commandName, client);
        }
        catch (err) {
            message.reply('Jotain meni pieleen, kokeile uudestaan');
            console.error(err);
        }
    }),
};
exports.default = handler;
