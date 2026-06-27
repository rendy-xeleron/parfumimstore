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

// Inisialisasi API dengan Key kamu
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6KGCDzBkiFlBpVAtnf5HDXqPqu8f_BxYkquO_BWfisTSg" });

// Logika Buka/Tutup Jendela Chat
const chatToggle = document.getElementById('chat-toggle-btn');
const chatBox = document.getElementById('chat-box');
chatToggle.addEventListener('click', () => {
    chatBox.style.display = chatBox.style.display === 'none' ? 'flex' : 'none';
});

// Fungsi Mengirim Pesan ke Gemini Studio
async function kirimPesan() {
    const inputEl = document.getElementById('chat-input');
    const contentEl = document.getElementById('chat-content');
    const pesan = inputEl.value.trim();
    
    if (!pesan) return;

    // Tampilkan pesan user di layar
    contentEl.innerHTML += `<div><strong>Anda:</strong> ${pesan}</div>`;
    inputEl.value = '';
    contentEl.scrollTop = contentEl.scrollHeight;

    try {
        // Panggil model sesuai yang diatur di AI Studio
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: pesan,
            config: {
                systemInstruction: "Kamu adalah 'AromaBot', seorang ahli parfum profesional dan asisten belanja virtual untuk toko IM Parfum Premium Store. Bantu pelanggan menemukan parfum terbaik seperti Amber Wood, SL Black, atau Smoky Oud berdasarkan preferensi mereka."
            }
        });

        // Tampilkan balasan chatbot
        contentEl.innerHTML += `<div style="margin-top: 5px; color: #555;"><strong>AromaBot:</strong> ${response.text}</div><br>`;
        contentEl.scrollTop = contentEl.scrollHeight;
    } catch (error) {
        console.error("Error AI Studio:", error);
        contentEl.innerHTML += `<div style="color: red;"><strong>AromaBot:</strong> Maaf, ada gangguan koneksi.</div>`;
    }
}

// Trigger tombol kirim dan tombol Enter
document.getElementById('chat-send').addEventListener('click', kirimPesan);
document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') kirimPesan();
});
