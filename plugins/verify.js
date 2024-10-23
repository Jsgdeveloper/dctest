const { EmbedBuilder } = require('discord.js');
const { getDatabase, ref, get, update } = require('firebase/database');

module.exports = {
    name: 'verif',
    description: 'Memverifikasi akun pengguna',
    async execute(message, args) {
        const userID = message.author.id;
        const inputCode = args[0]; // Ambil kode verifikasi yang diinputkan user

        if (!inputCode) {
            return message.reply('❌ Format salah! Gunakan: `!verif <kode>`');
        }

        const db = getDatabase();
        const userRef = ref(db, `users/${userID}`);

        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
            return message.reply('❌ Kamu belum terdaftar! Gunakan `!register` untuk mendaftar.');
        }

        const userData = snapshot.val();
        if (userData.isVerified) {
            return message.reply('❌ Kamu sudah diverifikasi.');
        }

        // Cek kode verifikasi
        if (userData.verificationCode === inputCode) {
            await update(userRef, { isVerified: true });

            // Embed tampilan verifikasi berhasil
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Verifikasi Berhasil!')
                .setDescription(`Selamat **${userData.username}**, akunmu telah diverifikasi!`)
                .setThumbnail('https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg')
                .setFooter({ text: 'Powered by JsBots', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } else {
            message.reply('❌ Kode verifikasi salah!');
        }
    }
};
                            
