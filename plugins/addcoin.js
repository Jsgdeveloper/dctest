const { EmbedBuilder } = require('discord.js');
const { db, ref } = require('../lib/firebase'); // Pastikan mengarah ke file inisialisasi Firebase

module.exports = {
    name: 'addcoin',
    description: 'Menambahkan coin ke pengguna (admin only).',
    async execute(message, args) {
        if (message.author.id !== '1250940447325421663') { // Ganti dengan ID admin bot
            return message.reply('Hanya admin yang bisa menambahkan coin.');
        }

        const targetUser = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!targetUser || isNaN(amount) || amount <= 0) {
            return message.reply('Penggunaan: !addcoin @user <jumlah>');
        }

        const userRef = ref(db, `users/${targetUser.id}`);
        const userSnapshot = await userRef.get();

        if (!userSnapshot.exists()) {
            return message.reply('Pengguna belum terdaftar.');
        }

        const userData = userSnapshot.val();
        const newBalance = (userData.coin || 0) + amount;

        await userRef.update({ coin: newBalance });

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('💰 Coin Ditambahkan')
            .setDescription(`**${targetUser.username}** telah ditambahkan **${amount}** coins.\nSaldo sekarang: **${newBalance}** coins.`)
            .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' });

        message.channel.send({ embeds: [embed] });
    },
};
            
