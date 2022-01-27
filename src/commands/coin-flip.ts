import Command from '../types/command';

const heads: string[] = ['heads', 'h', '0'];
const tails: string[] = ['tails', 't', '1'];

const flip: Command = {
    name: 'flip',
    aliases: ['f', '(╯°□°）╯︵ ┻━┻'],
    description: 'Flips a coin for you',
    execute: async (message, args, cmd, client) => {
        if (args[0] !== undefined) args[0] = args[0].toLocaleLowerCase();

        if (!heads.includes(args[0]) && !tails.includes(args[0])) {
            message.reply(`You have to also guess **heads** or **tails**\n!flip <heads/tails>`).catch(console.error);
            return;
        }

        const guess = heads.includes(args[0]) ? 0 : 1;
        message.reply('Flipping coin...').then((msg) => {
            setTimeout(() => {
                const result = Math.floor(Math.random() * 2);
                msg.edit(
                    `${message.author}, You got **${result === 0 ? 'heads' : 'tails'}**! ${
                        result === guess
                            ? 'You can leave if you want to'
                            : 'You have to spend another 30 minutes on the computer'
                    }`,
                );
            }, 1500);
        });
    },
};

export default flip;
