const nomorWA = "6287749397910"; 

const daftarParfum = [
    {
        nama: "Amber Wood",
        deskripsi: "Oriental soft tapi tetap strong. Kesan: mahal & luxury",
        harga: "Rp. 120.000",
        gambar: "img/Amber Wood.png" // Ganti dengan nama fotomu
    },
    {
        nama: "SL Black",
        deskripsi: "Manis - floral. Kesan: sexy, dewasa, night vibes",
        harga: "Rp. 120.000",
        gambar: "img/SL Black.png"
    },
    {
        nama: "Smoky Oud",
        deskripsi: "Aroma kayu bakar (oud kuat). Kesan: mahal & bold",
        harga: "Rp. 120.000",
        gambar: "img/Smoky Oud.png"
    }
];

const container = document.getElementById('katalog-parfum');

function tampilkanKatalog() {
    container.innerHTML = "";
    daftarParfum.forEach(p => {
        const pesan = `Halo, saya ingin memesan parfum ${p.nama}`;
        const linkWA = `https://api.whatsapp.com/send?phone=${nomorWA}&text=${encodeURIComponent(pesan)}`;
        
        container.innerHTML += `
            <div class="kartu-parfum">
                <img src="${p.gambar}" class="gambar-produk" onerror="this.src='https://via.placeholder.com/300x400/000000/d4af37?text=${p.nama}'">
                <h3 class="nama-produk">${p.nama}</h3>
                <p class="deskripsi">${p.deskripsi}</p>
                <p class="harga">${p.harga}</p>
                <a href="${linkWA}" class="btn-wa">Pesan via WhatsApp</a>
            </div>
        `;
    });
}

tampilkanKatalog();

const API_KEY = "AQ.Ab8RN6IvBF1meoQl8yKub8k1GxRUj22kuywfraz3Bs2aZRb2JA";
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

async function getGeminiResponse(userPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: "Kamu adalah asisten Parfum IM Store. Jawab dengan singkat dan ramah." }] }
        })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

sendBtn.onclick = async () => {
    const text = chatInput.value;
    if (!text) return;

    // Tampilkan pesan user
    chatWindow.innerHTML += `<div class="user-msg">${text}</div>`;
    chatInput.value = "";

    // Ambil respon dari AI
    const botReply = await getGeminiResponse(text);
    chatWindow.innerHTML += `<div class="bot-msg">${botReply}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
};
