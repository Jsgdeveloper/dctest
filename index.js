const { Client, GatewayIntentBits } = require('discord.js');
const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const firebaseConfig = require('./lib/firebase');
const express = require('express');
const path = require('path');
const fs = require('fs');

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Inisialisasi Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] });

// Definisikan Admin ID
const AdminID = '1250940447325421663'; // Ganti dengan ID Discord pembuat (JsCoders)

// Mengambil semua plugin dari folder 'plugins'
const commandFiles = fs.readdirSync('./plugins').filter(file => file.endsWith('.js'));
const commands = {};

// Memuat semua plugin ke dalam objek commands
for (const file of commandFiles) {
    const command = require(`./plugins/${file}`);
    commands[file.split('.')[0]] = command; // Menyimpan command dengan nama file
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag} - JsBots by JsCoders!`);
});

// Command handler sederhana
client.on('messageCreate', async (message) => {
    if (!message.author.bot) { // Mengabaikan pesan dari bot lain
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (commands[commandName]) {
            await commands[commandName].execute(message.author.id, message);
        }

        client.on('messageCreate', (message) => {
    if (message.content === '!ping') {
        pingCommand.execute(message);
    }
});

        // Contoh penggunaan AdminID
        if (commandName === 'admin') {
            if (message.author.id === AdminID) {
                message.channel.send(`Halo Admin! Anda dikenal sebagai pencipta JsBots.`);
            } else {
                message.channel.send(`Anda tidak dikenali sebagai admin.`);
            }
        }
    }
});

// Login bot menggunakan Discord Token dari environment variable bawaan Render.com
client.login(process.env.DISCORD_TOKEN);

// Setup server HTTP untuk menampilkan index.html
const appExpress = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk menyajikan file statis
appExpress.use(express.static(path.join(__dirname, 'public')));

// Endpoint untuk menampilkan index.html
appExpress.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Server untuk menerima permintaan
appExpress.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
