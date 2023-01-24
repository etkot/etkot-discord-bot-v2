import type { ChatInputCommandInteraction } from 'discord.js'

export function getVoiceChannel(interaction: ChatInputCommandInteraction) {
    const sender = interaction.member
    if (!sender || !('voice' in sender) || !sender.voice.channel) {
        interaction.reply({
            content: 'You need to be in a voice channel to use this command!',
            ephemeral: true,
        })
        return
    }
    const voiceChannel = sender.voice.channel
    return voiceChannel
}
