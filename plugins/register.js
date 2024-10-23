const { getDatabase, ref, set, get, child } = require('firebase/database');
const { MessageEmbed } = require('discord.js');

module.exports = {
    async execute(message) {
        const db = getDatabase();
        const userId = message.author.id;
        const username = message.author.username;
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // Kode verifikasi 6 digit

        // Referensi ke path pengguna di database
        const userRef = ref(db, `users/${userId}`);

        // Cek apakah pengguna sudah terdaftar
        try {
            const snapshot = await get(child(userRef, '/'));
            if (snapshot.exists()) {
                message.channel.send(`🌟 Anda sudah terdaftar sebagai **${username}**!`);
                return;
            }

            // Jika belum terdaftar, simpan data pengguna
            await set(userRef, {
                id: userId,
                username: username,
                coin: 0,
                banned: false,
                daily: 0,
                verified: false,
                verificationCode: verificationCode // Simpan kode verifikasi
            });

            // Kirim pesan verifikasi ke DM pengguna
            await message.author.send(`🎉 Selamat datang, **${username}**! Anda telah terdaftar. Kode verifikasi Anda adalah **${verificationCode}**. Silakan verifikasi dengan mengetik **!verif ${verificationCode}** di DM!`);

            // Kirim embed pesan pendaftaran
            const embed = new MessageEmbed()
                .setColor('#00FF00') // Warna hijau
                .setTitle('Pendaftaran Berhasil!')
                .setDescription(`👋 Halo, **${username}**! Silakan cek DM Anda untuk kode verifikasi. 😄`)
                .setFooter({ text: 'Powered by JsBots', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' }) // Icon optional
                .setTimestamp(); // Timestamp sekarang

            message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching user data:', error);
            message.channel.send('❌ Terjadi kesalahan saat mendaftar. Silakan coba lagi nanti.');
        }
    }
};
