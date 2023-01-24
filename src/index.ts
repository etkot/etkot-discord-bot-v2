import * as dotenv from 'dotenv'
dotenv.config()

import { generateDependencyReport } from '@discordjs/voice'
import { Client, Collection, Events, IntentsBitField } from 'discord.js'
import { deployCommands } from './utils/deploayCommands'
import { loadCommands } from './utils/loadCommands'

console.log(generateDependencyReport())

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
})

client.commands = new Collection()

const commands = await loadCommands()
commands.forEach((command) => {
    client.commands.set(command.data.name, command)
})
console.log(`Loaded ${client.commands.size} commands.`)

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand() || interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`)
            return
        }

        try {
            if (interaction.isAutocomplete() && command.autocomplete) {
                await command.autocomplete(interaction)
            } else if (interaction.isChatInputCommand()) {
                await command.execute(interaction)
            }
        } catch (error) {
            console.error(error)
        }
    }
})

client.once(Events.ClientReady, async () => {
    console.log('✨ Bot Ready! ✨')
    await deployCommands(client)
})

client.login(process.env['DC_TOKEN'])
