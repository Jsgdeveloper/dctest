const { EmbedBuilder } = require('discord.js');

module.exports = {
    execute(message) {
        // Mengukur latency
        const latency = Date.now() - message.createdTimestamp;
        
        // Pastikan message.client dan ws terdefinisi sebelum mengaksesnya
        const apiLatency = message.client?.ws?.ping ? Math.round(message.client.ws.ping) : 'N/A';

        // Membuat embed yang lebih keren
        const embed = new EmbedBuilder()
            .setColor('#00FF00') // Warna hijau
            .setTitle('🏓 Pong!')
            .setDescription(`**JsBots by JsCoders** is online!`)
            .addFields(
                { name: 'Latency', value: `\`${latency}ms\``, inline: true },
                { name: 'API Latency', value: `\`${apiLatency}ms\``, inline: true }
            )
            .setFooter({ text: 'Powered by JsBots', iconURL: 'https://i.imgur.com/AfFp7pu.png' }) // Icon optional
            .setTimestamp(); // Timestamp sekarang
        
        // Mengirimkan embed ke channel
        message.channel.send({ embeds: [embed] });
    }
};
