const nomorWA = "6287749397910"; 

const koleksiSemua = [
    { nama: "SL Black", kategori: "Wanita", harga: "Rp. 120.000", gambar: "img/SL Black.png", deskripsi: "Manis floral elegan dengan kesan hangat. Cocok untuk malam & acara spesial" },
    { nama: "Lo Vely", kategori: "Wanita", harga: "Rp. 100.000", gambar: "img/Lo Vely.png", deskripsi: "Floral lembut dan feminin, fresh dan ringan. Cocok untuk daily & wangi soft" },
    { nama: "Chiffon Pink", kategori: "Wanita", harga: "Rp. 100.000", gambar: "img/Chiffon Pink.png", deskripsi: "Aroma manis seperti kue, girly dan lembut. Cocok untuk suka aroma manis" },
    { nama: "Berry for Her", kategori: "Wanita", harga: "Rp. 110.000", gambar: "img/Berry.png", deskripsi: "Berry segar yang agak strong dan standout. Cocok untuk kamu yang mau tampil beda" },
    { nama: "Swift Rose", kategori: "Wanita", harga: "Rp. 110.000", gambar: "img/Swift Rose.png", deskripsi: "Aroma bunga yang cukup strong dan elegan. Cocok untuk wanita dewasa" },
    { nama: "Scandal", kategori: "Wanita", harga: "Rp. 100.000", gambar: "img/Scandal.png", deskripsi: "Manis creamy yang kuat dan menggoda. Cocok untuk kamu yang suka wangi bold" },
    { nama: "Flora Pastellia", kategori: "Wanita", harga: "Rp. 100.000", gambar: "img/Flora Pastellia.png", deskripsi: "Floral soft yang halus dan mewah. Cocok untuk daily elegan" },
    { nama: "Orchid", kategori: "Wanita", harga: "Rp. 100.000", gambar: "img/Orchid.png", deskripsi: "Floral dengan sentuhan asam segar yang unik. Cocok untuk yang suka wangi beda" },
    { nama: "Purple Platinum", kategori: "Wanita", harga: "Rp. 110.000", gambar: "img/Purple.png", deskripsi: "Wangi feminin clean dan classy. Cocok untuk tampil simpel tapi berkelas" },
    { nama: "Bergamot Black Men", kategori: "Pria", harga: "Rp. 100.000", gambar: "img/Bergamot.png", deskripsi: "Citrus segar yang maskulin dan ringan. Cocok untuk kerja & aktivitas siang" },
    { nama: "XXXX Man", kategori: "Pria", harga: "Rp. 100.000", gambar: "img/XXXX.png", deskripsi: "Fruity fresh tanpa manis berlebihan. Cocok untuk santai & daily" }, // <-- Tanda koma ditambahkan di sini
    { nama: "CH Sexy Men", kategori: "Pria", harga: "Rp. 120.000", gambar: "img/CH.png", deskripsi: "Manis hangat yang maskulin dan menarik. Cocok untuk malam & kencan" },
    { nama: "Light Man", kategori: "Pria", harga: "Rp. 100.000", gambar: "img/Light.png", deskripsi: "Fresh clean yang ringan dan adem. Cocok untuk semua situasi" },
    { nama: "VIP Black", kategori: "Pria", harga: "Rp. 110.000", gambar: "img/VIP.png", deskripsi: "Manis gelap yang elegan dan kuat. Cocok untuk tampil berkelas" },
    { nama: "Blue Hill", kategori: "Pria", harga: "Rp. 110.000", gambar: "img/Blue.png", deskripsi: "Fresh aquatic yang bersih dan maskulin. Aman untuk semua aktivitas" },
    { nama: "Explorer", kategori: "Pria", harga: "Rp. 100.000", gambar: "img/Explorer.png", deskripsi: "Woody maskulin modern dan elegan. Cocok untuk pria aktif" },
    { nama: "Intense", kategori: "Unisex", harga: "Rp. 110.000", gambar: "img/Intense.png", deskripsi: "Kayu manis hangat dengan kesan dalam. Cocok untuk malam & santai" },
    { nama: "Amber Wood", kategori: "Unisex", harga: "Rp. 120.000", gambar: "img/Amber Wood.png", deskripsi: "Oriental kuat tapi tetap halus. Cocok untuk yang suka wangi elegan" },
    { nama: "LV Smoky Oud", kategori: "Unisex", harga: "Rp. 100.000", gambar: "img/Smoky Oud.png", deskripsi: "Kayu bakar yang bold dan mewah. Cocok untuk yang suka wangi strong" },
    { nama: "LV NYC", kategori: "Unisex", harga: "Rp. 120.000", gambar: "img/NYC.png", deskripsi: "Woody smoky yang lebih lembut dan classy. Cocok untuk daily elegan" },
    { nama: "Tea Aromatic", kategori: "Unisex", harga: "Rp. 110.000", gambar: "img/Tea.png", deskripsi: "Aroma teh yang fresh dan menenangkan. Cocok untuk wangi clean & unik" }
];

const container = document.getElementById('katalog-semua');

function renderProduk(data) {
    if (!container) return;
    container.innerHTML = "";
    data.forEach(p => {
        const pesan = `Halo, saya ingin memesan parfum ${p.nama}`;
        const linkWA = `https://api.whatsapp.com/send?phone=${nomorWA}&text=${encodeURIComponent(pesan)}`;
        container.innerHTML += `
            <div class="kartu-parfum">
                <img src="${p.gambar}" class="gambar-produk" onerror="this.src='https://via.placeholder.com/200x250/333?text=${p.nama}'">
                <h3 class="nama-produk">${p.nama}</h3>
                <p class="deskripsi">${p.deskripsi}</p>
                <p class="harga">${p.harga}</p>
                <a href="${linkWA}" class="btn-wa">Pesan</a>
            </div>
        `;
    });
}

function filterKatalog(kategori) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.trim() === kategori) btn.classList.add('active');
    });

    const filtered = kategori === 'Semua' ? koleksiSemua : koleksiSemua.filter(p => p.kategori === kategori);
    renderProduk(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    filterKatalog('Semua');
});
