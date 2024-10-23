const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { initializeApp, getApps } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBKMvTYVmd9t3_BAhuGkqW57umgXAco82c",
    authDomain: "jamasantuy-d22b2.firebaseapp.com",
    databaseURL: "https://jamasantuy-d22b2-default-rtdb.firebaseio.com",
    projectId: "jamasantuy-d22b2",
    storageBucket: "jamasantuy-d22b2.appspot.com",
    messagingSenderId: "734414764994",
    appId: "1:734414764994:web:cde068f7bdde79116e745b",
    measurementId: "G-M1P0CGWNNQ"
};

// Inisialisasi Firebase hanya jika belum diinisialisasi
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

// Mengakses database Firebase
const db = getDatabase();

// Inisialisasi Discord client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Membuat koleksi commands untuk menyimpan semua perintah
client.commands = new Collection();

// Membaca semua file plugin dari folder "plugins"
const commandFiles = fs.readdirSync('./plugins').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./plugins/${file}`);
    // Menggunakan nama file sebagai nama perintah
    client.commands.set(file.replace('.js', ''), command);
}

// Definisikan Admin ID (ganti dengan ID admin yang sesuai)
const AdminID = '1250940447325421663'; // Ganti dengan ID Discord pembuat (JsCoders)

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag} - JsBots by JsCoders!`);
});

// Event listener untuk messageCreate
client.on('messageCreate', async (message) => {
    // Abaikan pesan dari bot sendiri atau tanpa prefix
    if (message.author.bot) return;
    
    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Cek apakah perintah ada di koleksi commands
    const command = client.commands.get(commandName);
    if (!command) {
        message.channel.send("Perintah tidak dikenali.");
        return;
    }

    // Jalankan perintah
    try {
        await command.execute(message, args, db); // Tambahkan argumen db jika diperlukan
    } catch (error) {
        console.error(error);
        message.reply('Ada kesalahan saat mencoba mengeksekusi perintah ini!');
    }

    // Contoh penggunaan AdminID
    if (commandName === 'admin') {
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
    
