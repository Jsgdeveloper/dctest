const { EmbedBuilder } = require('discord.js');

module.exports = {
    execute(message) {
        // Log untuk melihat objek message
        console.log('Pesan diterima:', message);

        // Pastikan message terdefinisi dan channel terdefinisi
        if (!message || !message.channel) {
            console.error('Pesan tidak valid atau channel tidak terdefinisi');
            return;
        }

        // Mengukur latency
        const latency = Date.now() - message.createdTimestamp;
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
        message.channel.send({ embeds: [embed] })
            .catch(err => {
                console.error('Error mengirim pesan:', err);
            });
    }
};
            
