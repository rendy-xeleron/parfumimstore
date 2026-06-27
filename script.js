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

// Inisialisasi API dengan Key kamu (Ganti dengan API Key asli kamu)
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6KGCDzBkiFlBpVAtnf5HDXqPqu8f_BxYkquO_BWfisTSg" });

// Fungsi Buka Tutup Chat (Dipasang lewat JavaScript agar aman dari error module)
const chatToggle = document.getElementById('chat-toggle-btn');
const chatBox = document.getElementById('chat-box');

if (chatToggle && chatBox) {
    chatToggle.addEventListener('click', toggleChatBox);
}

function toggleChatBox() {
    if (chatBox.style.display === 'none' || chatBox.style.display === '') {
        chatBox.style.display = 'flex';
    } else {
        chatBox.style.display = 'none';
    }
}

// Daftarkan fungsi ke window agar tombol 'x' di HTML juga bisa menutup
window.toggleChatBox = toggleChatBox;

// Fungsi Mengirim Pesan ke Gemini
async function kirimPesan() {
    const inputEl = document.getElementById('chat-input');
    const contentEl = document.getElementById('chat-content');
    
    if (!inputEl || !contentEl) return;
    
    const pesan = inputEl.value.trim();
    if (!pesan) return;

    // 1. Tampilkan pesan user di layar
    contentEl.innerHTML += `<div style="text-align: right; margin-bottom: 10px;"><strong>Anda:</strong> ${pesan}</div>`;
    inputEl.value = '';
    contentEl.scrollTop = contentEl.scrollHeight;

    try {
        // 2. Beri efek "sedang mengetik..."
        const loadingId = "loading-" + Date.now();
        contentEl.innerHTML += `<div id="${loadingId}" style="margin-bottom: 10px; color: #888;"><em>AromaBot sedang berpikir...</em></div>`;
        contentEl.scrollTop = contentEl.scrollHeight;

        // 3. Panggil Gemini API Studio
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: pesan,
            config: {
                systemInstruction: "Kamu adalah 'AromaBot', seorang ahli parfum profesional dan asisten belanja virtual untuk toko IM Parfum Premium Store. Bantu pelanggan menemukan parfum terbaik berdasarkan preferensi mereka dengan ramah dan elegan."
            }
        });

        // Hapus efek loading
        document.getElementById(loadingId)?.remove();

        // 4. Tampilkan balasan chatbot
        contentEl.innerHTML += `<div style="margin-bottom: 10px; color: #333;"><strong>AromaBot:</strong> ${response.text}</div>`;
        contentEl.scrollTop = contentEl.scrollHeight;
    } catch (error) {
        console.error("Error AI Studio:", error);
        contentEl.innerHTML += `<div style="color: red; margin-bottom: 10px;"><strong>AromaBot:</strong> Maaf, ada gangguan koneksi ke Google AI Studio.</div>`;
    }
}

// Pasang Event Listener ke Tombol Kirim & Tombol Enter
const sendBtn = document.getElementById('chat-send');
const inputField = document.getElementById('chat-input');

if (sendBtn) sendBtn.addEventListener('click', kirimPesan);
if (inputField) {
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') kirimPesan();
    });
}
