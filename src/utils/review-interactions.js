const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');

module.exports = async function handleReviewInteraction(interaction) {
  if (interaction.isButton() && interaction.customId === 'pw_review_open') {
    const modal = new ModalBuilder().setCustomId('pw_review_submit').setTitle('Donner votre avis');
    const rating = new TextInputBuilder().setCustomId('rating').setLabel('Note de 1 à 5 étoiles').setStyle(TextInputStyle.Short).setPlaceholder('5').setMinLength(1).setMaxLength(1).setRequired(true);
    const review = new TextInputBuilder().setCustomId('review').setLabel('Votre avis').setStyle(TextInputStyle.Paragraph).setPlaceholder('Racontez votre expérience...').setMinLength(3).setMaxLength(1000).setRequired(true);
    modal.addComponents(new ActionRowBuilder().addComponents(rating), new ActionRowBuilder().addComponents(review));
    await interaction.showModal(modal);
    return true;
  }
  if (interaction.isModalSubmit() && interaction.customId === 'pw_review_submit') {
    const ratingText = interaction.fields.getTextInputValue('rating').trim();
    const review = interaction.fields.getTextInputValue('review').trim();
    if (!/^[1-5]$/.test(ratingText)) {
      await interaction.reply({ content: '❌ La note doit être un chiffre de 1 à 5. Réessayez avec le bouton.', ephemeral: true });
      return true;
    }
    if (review.length < 3) {
      await interaction.reply({ content: '❌ Votre avis est trop court.', ephemeral: true });
      return true;
    }
    await interaction.deferReply({ ephemeral: true });
    const stars = '⭐'.repeat(Number(ratingText));
    const embed = new EmbedBuilder()
      .setColor(0xFF8C32)
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTitle(stars)
      .setDescription('« ' + review.replace(/@/g, '@\u200b') + ' »')
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: 'PlayWise • Avis de membre' })
      .setTimestamp();
    try {
      await interaction.channel.send({ embeds: [embed], allowedMentions: { parse: [] } });
      await interaction.editReply('✅ Votre avis a été publié dans ce salon. Merci !');
    } catch (error) {
      console.error('Erreur publication avis :', error);
      await interaction.editReply('❌ Impossible de publier cet avis. Vérifiez les permissions du bot.');
    }
    return true;
  }
  return false;
};
