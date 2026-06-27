// Tambahkan library Google Gen AI lewat CDN (Script Type Module)
import { GoogleGenAI } from "https://esm.run/@google/generative-ai";

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

// ==========================================
// BAGIAN CHATBOT AROMABOT (Taruh paling bawah)
// ==========================================

// Inisialisasi API dengan Key kamu
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6KGCDzBkiFlBpVAtnf5HDXqPqu8f_BxYkquO_BWfisTSg" });

// Daftarkan Element HTML ke Variabel JS
const chatToggle = document.getElementById('chat-toggle-btn');
const chatClose = document.getElementById('chat-close-btn');
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('chat-send');
const inputField = document.getElementById('chat-input');
const contentEl = document.getElementById('chat-content');

// Fungsi Menampilkan Jendela Chat
if (chatToggle && chatBox) {
    chatToggle.addEventListener('click', () => {
        chatBox.style.display = 'flex';
    });
}

// Fungsi Menyembunyikan Jendela Chat (Tombol x)
if (chatClose && chatBox) {
    chatClose.addEventListener('click', () => {
        chatBox.style.display = 'none';
    });
}

// Fungsi Utama Mengirim Pesan ke Gemini AI Studio
async function kirimPesan() {
    if (!inputField || !contentEl) return;
    
    const pesan = inputField.value.trim();
    if (!pesan) return;

    // 1. Tampilkan pesan user ke layar chat
    contentEl.innerHTML += `<div style="text-align: right; margin-bottom: 10px;"><strong>Anda:</strong> ${pesan}</div>`;
    inputField.value = '';
    contentEl.scrollTop = contentEl.scrollHeight;

    try {
        // 2. Beri efek loading "sedang mengetik..."
        const loadingId = "loading-" + Date.now();
        contentEl.innerHTML += `<div id="${loadingId}" style="margin-bottom: 10px; color: #888;"><em>AromaBot sedang berpikir...</em></div>`;
        contentEl.scrollTop = contentEl.scrollHeight;

        // 3. Request ke Google AI Studio
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: pesan,
            config: {
                systemInstruction: "Kamu adalah 'AromaBot', seorang ahli parfum profesional dan asisten belanja virtual untuk toko IM Parfum Premium Store. Bantu pelanggan menemukan parfum terbaik berdasarkan preferensi mereka dengan ramah dan elegan."
            }
        });

        // Hapus efek loading setelah AI merespons
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        // 4. Tampilkan balasan dari AromaBot
        contentEl.innerHTML += `<div style="margin-bottom: 10px; color: #333;"><strong>AromaBot:</strong> ${response.text}</div>`;
        contentEl.scrollTop = contentEl.scrollHeight;
    } catch (error) {
        console.error("Error AI Studio:", error);
        contentEl.innerHTML += `<div style="color: red; margin-bottom: 10px;"><strong>AromaBot:</strong> Maaf, ada gangguan koneksi ke Google AI Studio.</div>`;
    }
}

// Pasang Event Klik ke Tombol Kirim & Tombol Enter Keyboard
if (sendBtn) {
    sendBtn.addEventListener('click', kirimPesan);
}
if (inputField) {
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') kirimPesan();
    });
}
