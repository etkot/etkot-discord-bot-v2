import glob from 'glob'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Command } from '../types/command'

export async function loadCommands() {
    const __dirname = fileURLToPath(new URL('.', import.meta.url))
    const commandFolder = path.join(__dirname, '..', 'commands')
    const commandFiles = glob.sync(`${commandFolder}/**/*.js`)

    const commands: Command[] = []
    for (const file of commandFiles) {
        const { command } = (await import(file)) as { command?: Command }

        if (!command || !command.data || !command.execute) {
            throw new Error(`Command ${file} is missing data or execute`)
        }

        commands.push(command)
    }

    return commands
}
