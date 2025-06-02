const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder() 
        .setName("members")
        .setDescription("Zeige dir alle aktiven Member an")
    ,
    async execute(interaction) {
        const members = require("../data/members.json");
        let output = [
            "Das sind die atuellen Mitglieder des FIR EDWW Eventteams (Leiter **fett**): ",
            ...members.map(m => "- " + (m.chief ? `**${m.name}**` : `${m.name}`))
        ];

        await interaction.reply(
            {
                content: output.join("\n"),
            }
        );
    }
}