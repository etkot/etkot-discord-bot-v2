import { Client, REST, Routes } from 'discord.js'

const API = new REST({ version: '10' })

export async function deployCommands(client: Client) {
    API.setToken(client.token!)
    if (!client.user) throw new Error('Client user is not defined. Please login first')

    const commands = client.commands.map((command) => command.data.toJSON())

    await API.put(Routes.applicationCommands(client.user.id), {
        body: commands,
    })

    console.log('Successfully registered application commands.')
}
