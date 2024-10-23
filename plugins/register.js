const { EmbedBuilder } = require('discord.js');
const { getDatabase, ref, get, set } = require('firebase/database');
const crypto = require('crypto');

// ID Admin (ganti dengan ID Admin yang sesuai)
const AdminID = '1250940447325421663'; // Ganti dengan ID Discord Admin

module.exports = {
    name: 'register',
    description: 'Daftar user ke database Firebase',
    async execute(message) {
        const userID = message.author.id;
        const username = message.author.username;

        // Cek jika sudah terdaftar
        const db = getDatabase();
        const userRef = ref(db, `users/${userID}`);

        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            return message.reply('❌ Kamu sudah terdaftar!');
        }

        // Generate kode verifikasi unik
        const verificationCode = crypto.randomBytes(4).toString('hex');

        // Simpan data ke Firebase
        await set(userRef, {
            id: userID,
            username: username,
            coin: 0,
            banned: false,
            dailyClaimed: false,
            verificationCode: verificationCode,
            isVerified: false,
            isAdmin: userID === AdminID // Cek apakah user adalah admin
        });

        // Embed pesan registrasi
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('📋 Pendaftaran Berhasil!')
            .setDescription(`Hai **${username}**, kamu telah terdaftar. Silakan cek pesan pribadimu untuk kode verifikasi.`)
            .setThumbnail('https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg')
            .setFooter({ text: 'Powered by JsBots', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });

        // Kirim kode verifikasi ke DM user
        try {
            await message.author.send(`Halo **${username}**! Ini adalah kode verifikasi kamu: \`${verificationCode}\`. Gunakan perintah \`!verify <kode>\` di server untuk memverifikasi akun kamu.`);
        } catch (error) {
            console.error('Gagal mengirim pesan pribadi:', error);
            message.reply('❌ Gagal mengirim kode verifikasi ke pesan pribadi.');
        }
    }
};
    
