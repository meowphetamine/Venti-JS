const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the queue like a deck o' cards"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply(":no_entry: There are no songs in the queue")

		queue.shuffle()
        await interaction.editReply(`:twisted_rightwards_arrows: Shuffling ${queue.tracks.length} songs in the queue!`)
	},
}