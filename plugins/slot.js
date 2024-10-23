const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'slot',
    description: 'Slot game dengan animasi keren!',
    async execute(message, args) {
        // Ambil taruhan dari args
        const bet = parseInt(args[0]);
        if (!bet || isNaN(bet) || bet <= 0) {
            return message.reply('Taruhan tidak valid, silakan masukkan angka yang valid!');
        }

        // Daftar emoji buah
        const fruits = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🍍'];

        // Pilih 3 buah acak
        const spinResult = [];
        for (let i = 0; i < 3; i++) {
            spinResult.push(fruits[Math.floor(Math.random() * fruits.length)]);
        }

        // Pesan awal dengan animasi emoji yang "muter"
        let currentMessage = await message.channel.send('🎰 **Slotting...** 🎰\n' + '🔄 🔄 🔄');

        // Animasi "muter" dari emoji
        for (let i = 0; i < 5; i++) {  // 5 putaran
            let spinning = [];
            for (let j = 0; j < 3; j++) {
                spinning.push(fruits[Math.floor(Math.random() * fruits.length)]);
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1 detik
            await currentMessage.edit(`🎰 **Slotting...** 🎰\n${spinning.join(' ')}`);
        }

        // Mengganti buah secara bertahap dengan hasil akhir
        await new Promise(resolve => setTimeout(resolve, 1000));
        await currentMessage.edit(`🎰 **Slotting...** 🎰\n${spinResult[0]} 🔄 🔄`);

        await new Promise(resolve => setTimeout(resolve, 1000));
        await currentMessage.edit(`🎰 **Slotting...** 🎰\n${spinResult[0]} ${spinResult[1]} 🔄`);

        await new Promise(resolve => setTimeout(resolve, 1000));
        await currentMessage.edit(`🎰 **Slotting...** 🎰\n${spinResult.join(' ')}`);

        // Mengecek apakah pemain menang
        const win = spinResult[0] === spinResult[1] && spinResult[1] === spinResult[2];

        // Hasil akhir
        const resultEmbed = new MessageEmbed()
            .setColor(win ? '#00FF00' : '#FF0000')
            .setTitle(win ? '🎉 KAMU MENANG! 🎉' : '😢 KAMU KALAH 😢')
            .setDescription(`Hasil: ${spinResult.join(' ')}`)
            .setFooter({ text: 'Powered by JsBots', iconURL: 'https://raw.githubusercontent.com/Jsgdeveloper/dctest/refs/heads/main/profile.jpg' });

        message.channel.send({ embeds: [resultEmbed] });
    }
};
        
