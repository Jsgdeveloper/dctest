const { EmbedBuilder } = require('discord.js');
const { getDatabase, ref, get, update } = require('firebase/database');

// ID Admin (ganti dengan ID Admin yang sesuai)
const AdminID = '1250940447325421663'; // Ganti dengan ID Discord Admin

module.exports = {
    name: 'addcoin',
    description: 'Menambahkan coin ke user (Admin Only)',
    execute: async (message, args) => {
        // Cek apakah user adalah admin
        if (message.author.id !== AdminID) {
            return message.reply("❌ Kamu tidak diizinkan menggunakan perintah ini. Hanya Admin yang bisa!");
        }

        // Cek apakah argumen benar
        if (args.length < 2) {
            return message.reply("❌ Format salah! Gunakan `!addcoin <userID> <jumlahCoin>`");
        }

        const userID = args[0];
        const jumlahCoin = parseInt(args[1]);

        if (isNaN(jumlahCoin)) {
            return message.reply("❌ Jumlah coin harus berupa angka!");
        }

        // Ambil database Firebase
        const db = getDatabase();
        const userRef = ref(db, `users/${userID}`);

        try {
            const snapshot = await get(userRef);
            if (!snapshot.exists()) {
                return message.reply("❌ Pengguna tidak ditemukan di database.");
            }

            const userData = snapshot.val();
            const updatedCoin = (userData.coin || 0) + jumlahCoin;

            // Update coin pengguna
            await update(userRef, { coin: updatedCoin });

            // Membuat embed keren untuk notifikasi
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('💰 Coin Ditambahkan!')
                .setDescription(`**Admin** telah berhasil menambahkan **${jumlahCoin} coin** kepada **${userData.username}**.`)
                .addFields(
                    { name: 'Total Coin Sekarang', value: `${updatedCoin} coin` }
                )
                .setThumbnail('https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg')
                .setFooter({ text: 'Powered by JsBots', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply("❌ Terjadi kesalahan saat menambahkan coin.");
        }
    }
};
