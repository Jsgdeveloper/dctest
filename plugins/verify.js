const { EmbedBuilder } = require('discord.js');
const db = require('../lib/firebase'); // Pastikan sudah ada koneksi ke Firebase

module.exports = {
    name: 'verify',
    description: 'Verifikasi akun dengan kode yang diberikan',
    async execute(message, args) {
        const code = args[0];
        const userId = message.author.id;

        if (!code) {
            const embedError = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Kode Verifikasi Tidak Ditemukan')
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
                    .setColor('#FF0000')
                    .setTitle('Akun Tidak Ditemukan')
                    .setDescription('Anda belum mendaftar. Silakan daftar terlebih dahulu menggunakan perintah !register.')
                    .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                    .setTimestamp();

                return message.channel.send({ embeds: [embedNoUser] });
            }

            if (userData.verificationCode === code) {
                await userRef.update({ verified: true });

                const embedSuccess = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('Verifikasi Berhasil!')
                    .setDescription('Selamat! Akun Anda telah berhasil diverifikasi.')
                    .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                    .setTimestamp();

                message.channel.send({ embeds: [embedSuccess] });
            } else {
                const embedWrongCode = new EmbedBuilder()
                    .setColor('#FFA500')
                    .setTitle('Kode Verifikasi Salah')
                    .setDescription('Kode verifikasi yang Anda masukkan salah. Silakan cek pesan pribadi Anda lagi.')
                    .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                    .setTimestamp();

                message.channel.send({ embeds: [embedWrongCode] });
            }
        } catch (error) {
            console.error('Error verifying user:', error);

            const embedError = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Kesalahan Sistem')
                .setDescription('Terjadi kesalahan saat mencoba memverifikasi akun Anda. Silakan coba lagi nanti.')
                .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                .setTimestamp();

            message.channel.send({ embeds: [embedError] });
        }
    },
};
                                            
