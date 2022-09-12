const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Time to go home"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply(":no_entry: There are no songs in the queue")

		queue.destroy()
        await interaction.editReply(":wave: See ya next time!")
	},
}