const { SlashCommandBuilder, PermissionFlagsBits, Routes } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('setpdp').setDescription('Change la photo du bot uniquement sur ce serveur.')
    .setDMPermission(false).setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption(o => o.setName('image').setDescription('Image PNG, JPG ou WEBP (max 2 Mo)').setRequired(true)),
  async run({ client, interaction }) {
    if (!interaction.inGuild() || !interaction.memberPermissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({ content: '❌ Réservé aux administrateurs.', ephemeral: true });
    const image = interaction.options.getAttachment('image');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(image.contentType) || image.size > 2 * 1024 * 1024)
      return interaction.reply({ content: '❌ Envoie une image PNG, JPG ou WEBP de moins de 2 Mo.', ephemeral: true });
    await interaction.deferReply({ ephemeral: true });
    try {
      const https = require('node:https');
      const buffer = await new Promise((resolve, reject) => {
        https.get(image.url, res => {
          if (res.statusCode !== 200) { res.resume(); return reject(new Error('Téléchargement impossible')); }
          const chunks = []; let length = 0;
          res.on('data', chunk => { length += chunk.length; if (length > 2 * 1024 * 1024) res.destroy(new Error('Image trop grande')); else chunks.push(chunk); });
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', reject);
        }).on('error', reject);
      });
      const avatar = `data:${image.contentType};base64,${buffer.toString('base64')}`;
      await client.rest.patch(Routes.guildMember(interaction.guildId, '@me'), { body: { avatar } });
      await interaction.editReply('✅ Photo de profil du bot modifiée pour ce serveur.');
    } catch (err) {
      console.error('setpdp:', err);
      await interaction.editReply('❌ Discord a refusé le changement de photo. Vérifie les permissions et les fonctionnalités disponibles pour le bot.');
    }
  }
};