const { getDatabase, ref, get, child, update } = require('firebase/database');
const { MessageEmbed } = require('discord.js');

module.exports = {
    async execute(message, args) {
        const db = getDatabase();
        const userId = message.author.id;
        const userRef = ref(db, `users/${userId}`);

        // Cek apakah pengguna terdaftar
        try {
            const snapshot = await get(child(userRef, '/'));
            if (!snapshot.exists()) {
                message.channel.send(`😢 Anda belum terdaftar. Silakan daftar terlebih dahulu!`);
                return;
            }

            const userData = snapshot.val();
            const verificationCode = userData.verificationCode;

            // Cek kode verifikasi
            if (args[0] === verificationCode.toString()) {
                await update(userRef, { verified: true });

                // Kirim pesan verifikasi yang lebih keren
                const embed = new MessageEmbed()
                    .setColor('#FFD700') // Warna emas
                    .setTitle('✅ Verifikasi Berhasil!')
                    .setDescription(`🎊 Selamat, **${userData.username}**! Anda telah berhasil diverifikasi! 🌟`)
                    .addField('🎉 Selamat Bergabung!', 'Anda sekarang dapat menggunakan semua fitur yang tersedia di **JsBots**!')
                    .setFooter({ text: 'Terima kasih telah bergabung!', iconURL: 'https://i.imgur.com/AfFp7pu.png' }) // Icon optional
                    .setTimestamp(); // Timestamp sekarang

                message.channel.send({ embeds: [embed] });
            } else {
                const embed = new MessageEmbed()
                    .setColor('#FF0000') // Warna merah
                    .setTitle('❌ Kode Verifikasi Salah!')
                    .setDescription(`😔 Kode yang Anda masukkan tidak valid. Silakan coba lagi dengan kode yang benar.`)
                    .setFooter({ text: 'Kami di sini untuk membantu!', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' }) // Icon optional
                    .setTimestamp(); // Timestamp sekarang

                message.channel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error verifying user:', error);
            message.channel.send('❌ Terjadi kesalahan saat memverifikasi. Silakan coba lagi nanti.');
        }
    }
};
