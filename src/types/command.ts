import type {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'

type possibleData =
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>

export interface Command {
    data: possibleData
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>
}
