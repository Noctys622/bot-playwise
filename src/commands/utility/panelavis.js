const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panelavis')
    .setDescription('Publier le panneau des avis dans ce salon.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async run({ interaction }) {
    if (!interaction.inGuild() || !interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({ content: '❌ Permission Gestion du serveur requise.', ephemeral: true });
    }
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('⭐ Avis de la communauté')
      .setDescription('Votre expérience compte ! Cliquez sur le bouton ci-dessous pour partager votre avis. Les avis seront publiés dans ce salon.')
      .setFooter({ text: 'PlayWise • Avis des membres' });
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('pw_review_open').setLabel('⭐ Laisser mon avis').setStyle(ButtonStyle.Primary)
    );
    await interaction.channel.send({ embeds: [embed], components: [row] });
    return interaction.reply({ content: '✅ Panneau des avis publié.', ephemeral: true });
  }
};
