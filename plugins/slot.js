const { EmbedBuilder } = require('discord.js');
const db = require('../lib/firebase'); // Pastikan sudah ada koneksi ke Firebase

module.exports = {
    name: 'slot',
    description: 'Permainan slot sederhana dengan peluang 50% kemenangan.',
    async execute(message, args) {
        const bet = parseInt(args[0]);

        if (isNaN(bet) || bet <= 0) {
            return message.reply('Silakan masukkan jumlah taruhan yang valid.');
        }

        // Mengambil data pengguna dari Firebase
        const userId = message.author.id;
        const userRef = db.ref(`users/${userId}`);
        const userSnapshot = await userRef.once('value');

        if (!userSnapshot.exists()) {
            return message.reply('Anda belum terdaftar. Silakan daftar terlebih dahulu menggunakan !register.');
        }

        const userData = userSnapshot.val();

        // Cek saldo cukup
        if (userData.coin < bet) {
            return message.reply('Saldo coin Anda tidak cukup untuk taruhan ini.');
        }

        // Mengurangi saldo taruhan
        await userRef.update({ coin: userData.coin - bet });

        // Buah-buahan untuk permainan
        const fruits = ['🍎', '🍌', '🍉'];
        const results = [];

        // Mengirim pesan awal dengan efek gulir
        let embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🎰 Slot Game!')
            .setDescription(`**Taruhan:** ${bet} coins\n\n` + fruits.join(' ') + `\n\n**Menggulung...**`)
            .setFooter({ text: 'JsBots by JsCoders', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' });

        const slotMessage = await message.channel.send({ embeds: [embed] });

        // Tunggu sejenak sebelum menampilkan hasil
        setTimeout(async () => {
            // Mengambil hasil slot (acak)
            for (let i = 0; i < 3; i++) {
                results.push(fruits[Math.floor(Math.random() * fruits.length)]);
                embed.setDescription(`**Taruhan:** ${bet} coins\n\n` + results.join(' ') + `\n\n**Menggulung...**`);
                await slotMessage.edit({ embeds: [embed] });
                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1 detik antara tampilan buah
            }

            // Cek hasil kemenangan
            const uniqueFruits = [...new Set(results)];
            let winnings = 0;

            if (uniqueFruits.length === 1) {
                winnings = bet * 2; // Menang jika semua buah sama
            } else if (uniqueFruits.length === 2) {
                winnings = bet; // Menang jika ada 2 buah yang sama
            }

            // Menambah coin jika menang
            if (winnings > 0) {
                await userRef.update({ coin: userData.coin + winnings });
                embed.setDescription(`**Taruhan:** ${bet} coins\n\n**Hasil:** ${results.join(' ')}\n🎉 Anda menang **${winnings}** coins!`);
            } else {
                embed.setDescription(`**Taruhan:** ${bet} coins\n\n**Hasil:** ${results.join(' ')}\n😢 Anda kalah. Coba lagi!`);
            }

            await slotMessage.edit({ embeds: [embed] });
        }, 2000); // Delay total 2 detik sebelum mulai menampilkan hasil
    },
};
