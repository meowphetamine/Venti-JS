const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play sum sick tunes")
        .addStringOption((option) => option.setName("song").setDescription("I can accept URL or search queres!").setRequired(true)),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply(":no_entry: You need to be in a VC to use this command")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()
        let search = interaction.options.getString("song")
        if (search.match(/((open|play)\.spotify\.com\/)/)) { // Spotify query currently does not display song thumbnail or duration
            const result = await client.player.search(search, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setTitle(`:play_pause: **${song.title}** has been added to the queue`)
                .setDescription(`**Query**: ${search}\n**Duration**: ${song.duration}`)
                .setThumbnail(song.thumbnail)
        } else if (search.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
            const result = await client.player.search(search, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setTitle(`:play_pause: **${song.title}** has been added to the queue`)
                .setDescription(`**Query**: ${search}\n**Duration**: ${song.duration}`)
                .setThumbnail(song.thumbnail)
        } else {
            const result = await client.player.search(search, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setTitle(`:play_pause: **${song.title}** has been added to the queue`)
                .setDescription(`**Query**: ${search}\n**Duration**: ${song.duration}\n`)
                .setThumbnail(song.thumbnail)
        }
    
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}