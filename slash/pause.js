const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Toggle playing the music"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply(":no_entry: There are no songs in the queue")

        if (queue.connection) {
            queue.setPaused(true);
            await interaction.editReply(":no_entry:")
        } else {
            queue.setPaused(false);
            await interaction.editReply(":play_pause:")
        }
	},
}