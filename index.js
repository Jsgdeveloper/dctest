const { Client, GatewayIntentBits } = require('discord.js');
const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const firebaseConfig = require('./lib/firebase');
const pingCommand = require('./plugins/ping');
const express = require('express');
const path = require('path');

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Inisialisasi Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Definisikan Admin ID (ganti dengan ID admin yang sesuai)
const AdminID = '1250940447325421663'; // Ganti dengan ID Discord pembuat (JsCoders)

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag} - JsBots by JsCoders!`);
});

// Command handler sederhana
client.on('messageCreate', (message) => {
    // Mengabaikan pesan dari bot itu sendiri
    if (message.author.bot) return;

    if (message.content === '!ping') {
        pingCommand.execute(message);
    }

    // Contoh penggunaan AdminID
    if (message.content === '!admin') {
        if (message.author.id === AdminID) {
            message.channel.send(`Halo Admin! Anda dikenal sebagai pencipta JsBots.`);
        } else {
            message.channel.send(`Anda tidak dikenali sebagai admin.`);
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
    
