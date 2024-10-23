const { getDatabase, ref, set, get } = require('firebase/database');
const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

// Fungsi untuk menghitung level berdasarkan XP
const getLevel = (xp) => {
    return Math.floor(Math.sqrt(xp)); // Formula sederhana untuk level
};

// Fungsi untuk mengupdate level pengguna
const updateLevel = async (userId, message) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    
    const snapshot = await get(userRef);
    const userData = snapshot.exists() ? snapshot.val() : { xp: 0, level: 0 };

    // Tambah XP
    userData.xp += 10; // Tambahkan 10 XP setiap kali pengguna berinteraksi
    const newLevel = getLevel(userData.xp);

    // Cek apakah level berubah
    if (newLevel > userData.level) {
        userData.level = newLevel;
        await set(userRef, userData);
        sendLevelUpImage(message.author, newLevel, userData.xp);
    } else {
        await set(userRef, userData);
    }
};

// Fungsi untuk mengirim gambar level up
const sendLevelUpImage = async (user, level, xp) => {
    // Membuat canvas untuk gambar level up
    const canvas = createCanvas(600, 300);
    const ctx = canvas.getContext('2d');

    // Gambar latar belakang
    const background = await loadImage('https://i.imgur.com/v3DgW5M.png'); // Gambar latar belakang yang lebih menarik
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Gambar bar level
    ctx.fillStyle = '#FFD700'; // Warna bar level
    ctx.fillRect(50, 230, (xp % 100) * 6, 30); // Bar level sesuai XP

    // Gambar border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.strokeRect(50, 230, 600 - 100, 30); // Border untuk bar level

    // Menambahkan teks
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Level Up!`, 200, 50);
    ctx.fillText(`Name: ${user.username}`, 50, 100);
    ctx.fillText(`Level: ${level}`, 50, 140);
    
    // Gambar foto pengguna
    const avatar = await loadImage(user.displayAvatarURL({ format: 'png', size: 128 }));
    ctx.drawImage(avatar, 450, 70, 100, 100); // Gambar avatar di pojok kanan

    // Menambahkan efek yang lebih menarik
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Overlay efek cahaya

    // Mengonversi canvas menjadi buffer dan mengirimnya sebagai lampiran
    const attachment = new MessageAttachment(canvas.toBuffer(), 'levelup.png');
    user.send({ files: [attachment] });
};

// Ekspor fungsi untuk digunakan dalam index.js
module.exports = {
    execute: updateLevel
};
