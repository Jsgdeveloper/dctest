const { EmbedBuilder } = require('discord.js');
const db = require('../lib/firebase'); // Pastikan sudah ada koneksi ke Firebase

module.exports = {
    name: 'addcoin',
    description: 'Menambah coin untuk pengguna tertentu (hanya untuk pembuat bot)',
    async execute(message, args) {
        // Cek jika yang menjalankan adalah pembuat bot
        const creatorId = '1250940447325421663'; // Ganti dengan ID Discord pembuat bot (JsCoders)

        if (message.author.id !== creatorId) {
            return message.reply('Anda tidak memiliki izin untuk menggunakan perintah ini.');
        }

        const username = args[0]; // Username dari pengguna
        const amount = parseInt(args[1]); // Jumlah coin yang ingin ditambahkan

        if (!username || isNaN(amount) || amount <= 0) {
            return message.reply('Silakan masukkan username dan jumlah coin yang valid.');
        }

        // Cari pengguna berdasarkan username
        const userRef = db.ref(`users`).orderByChild('username').equalTo(username);
        const snapshot = await userRef.once('value');

        if (!snapshot.exists()) {
            return message.reply(`Pengguna dengan username ${username} tidak ditemukan.`);
        }

        // Mendapatkan ID pengguna dari snapshot
        const userId = Object.keys(snapshot.val())[0];
        const userData = snapshot.val()[userId];

        // Tambahkan coin
        await db.ref(`users/${userId}`).update({
            coin: (userData.coin || 0) + amount,
        });

        // Kirimkan pesan konfirmasi
        const embedSuccess = new EmbedBuilder()
            .setColor('#6BFF6B')
            .setTitle('🎉 Coin Berhasil Ditambahkan!')
            .setDescription(`Anda telah menambahkan **${amount}** coin untuk pengguna **${username}**.`)
            .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
            .setTimestamp();

        message.channel.send({ embeds: [embedSuccess] });
    },
};
            
