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
