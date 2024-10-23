const { EmbedBuilder } = require('discord.js');
const db = require('../lib/firebase'); // Pastikan sudah ada koneksi ke Firebase

module.exports = {
    name: 'verify',
    description: 'Verifikasi akun dengan kode yang diberikan',
    async execute(message, args) {
        // Cek jika command dikirim di DM
        if (message.channel.type !== 'DM') {
            return message.reply('Perintah ini hanya dapat digunakan di pesan pribadi.');
        }

        const code = args[0];
        const userId = message.author.id;

        if (!code) {
            const embedError = new EmbedBuilder()
                .setColor('#FF6B6B')
                .setTitle('💔 Kode Verifikasi Tidak Ditemukan')
                .setDescription('Harap masukkan kode verifikasi yang diberikan oleh bot ke pesan pribadi Anda.')
                .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                .setTimestamp();

            return message.channel.send({ embeds: [embedError] });
        }

        try {
            const userRef = db.ref(`users/${userId}`);
            const snapshot = await userRef.once('value');
            const userData = snapshot.val();

            if (!userData) {
                const embedNoUser = new EmbedBuilder()
                    .setColor('#FF6B6B')
                    .setTitle('🚫 Akun Tidak Ditemukan')
                    .setDescription('Anda belum mendaftar. Silakan daftar terlebih dahulu menggunakan perintah !register.')
                    .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                    .setTimestamp();

                return message.channel.send({ embeds: [embedNoUser] });
            }

            if (userData.verificationCode === code) {
                await userRef.update({ verified: true });

                const embedSuccess = new EmbedBuilder()
                    .setColor('#6BFF6B')
                    .setTitle('🎉 Verifikasi Berhasil!')
                    .setDescription(`Selamat, **${userData.username}**! Akun Anda telah berhasil diverifikasi. Anda sekarang bisa menikmati semua fitur!`)
                    .setThumbnail('https://i.imgur.com/N20hHqT.png') // Thumbnail lucu
                    .addFields(
                        { name: '🎈 Selamat Datang!', value: 'Anda sudah menjadi bagian dari komunitas JsBots!', inline: false },
                        { name: '✨ Nikmati Fitur Menarik', value: 'Jangan ragu untuk menjelajahi semua fitur yang tersedia.', inline: false }
                    )
                    .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                    .setTimestamp();

                message.channel.send({ embeds: [embedSuccess] });
            } else {
                const embedWrongCode = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('🔍 Kode Verifikasi Salah')
                    .setDescription('Kode verifikasi yang Anda masukkan salah. Silakan cek pesan pribadi Anda lagi.')
                    .setThumbnail('https://i.imgur.com/XgXl0XO.png') // Thumbnail kece
                    .addFields(
                        { name: '❓ Periksa Kembali', value: 'Pastikan Anda memasukkan kode yang tepat.', inline: false }
                    )
                    .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                    .setTimestamp();

                message.channel.send({ embeds: [embedWrongCode] });
            }
        } catch (error) {
            console.error('Error verifying user:', error);

            const embedError = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('⚠️ Kesalahan Sistem')
                .setDescription('Terjadi kesalahan saat mencoba memverifikasi akun Anda. Silakan coba lagi nanti.')
                .setThumbnail('https://i.imgur.com/tP69pB1.png') // Thumbnail yang menyenangkan
                .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                .setTimestamp();

            message.channel.send({ embeds: [embedError] });
        }
    },
};
                                
