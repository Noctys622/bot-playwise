const { SlashCommandBuilder, PermissionFlagsBits, Routes } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('resetpdp').setDescription('Restaure la photo globale du bot sur ce serveur.')
    .setDMPermission(false).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async run({ client, interaction }) {
    if (!interaction.inGuild() || !interaction.memberPermissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({ content: '❌ Réservé aux administrateurs.', ephemeral: true });
    await interaction.deferReply({ ephemeral: true });
    try {
      await client.rest.patch(Routes.guildMember(interaction.guildId, '@me'), { body: { avatar: null } });
      await interaction.editReply('✅ Avatar du serveur réinitialisé.');
    } catch (err) {
      console.error('resetpdp:', err);
      await interaction.editReply('❌ Impossible de réinitialiser cet avatar.');
    }
  }
};