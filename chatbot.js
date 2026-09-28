/* =========================================================
   CHATBOT KONSULTASI AROMA - IM PARFUM
   Cukup tambahkan di HTML (sebelum </body>):
   <link rel="stylesheet" href="chatbot.css">
   <script src="chatbot.js"></script>
   ========================================================= */
(function () {
  const NOMOR_WA = "6287749397910";

  // ====== PENGATURAN AI ======
  // Tempel URL Cloudflare Worker di sini, contoh:
  // const AI_URL = "https://im-parfum-ai.namakamu.workers.dev";
  // Kalau dikosongkan (""), chatbot tetap jalan tanpa AI.
  const AI_URL = "https://imparfumstore-ai.rendy-xlr.workers.dev/";
  // ===========================

  // Data parfum + label untuk rekomendasi
  // g: P = Pria, W = Wanita, U = Unisex
  // a: fresh, manis, floral, woody
  // o: harian, malam, spesial
  const PARFUM = [
    { n: "SL Black", g: "W", h: 100000, img: "img/SL Black.png", a: ["manis", "floral"], o: ["malam", "spesial"], d: "Manis floral elegan dengan kesan hangat" },
    { n: "Lo Vely", g: "W", h: 100000, img: "img/Lo Vely.png", a: ["floral", "fresh"], o: ["harian"], d: "Floral lembut, feminin, fresh dan ringan" },
    { n: "Chiffon Pink", g: "W", h: 100000, img: "img/Chiffon Pink.png", a: ["manis"], o: ["harian"], d: "Manis seperti kue, girly dan lembut" },
    { n: "Berry for Her", g: "W", h: 100000, img: "img/Berry.png", a: ["fresh", "manis"], o: ["harian", "malam"], d: "Berry segar yang agak strong dan standout" },
    { n: "Swift Rose", g: "W", h: 100000, img: "img/Swift Rose.png", a: ["floral"], o: ["spesial", "malam"], d: "Aroma bunga yang cukup strong dan elegan" },
    { n: "Scandal", g: "W", h: 100000, img: "img/Scandal.png", a: ["manis"], o: ["malam", "spesial"], d: "Manis creamy yang kuat dan menggoda" },
    { n: "Flora Pastellia", g: "W", h: 100000, img: "img/Flora Pastellia.png", a: ["floral"], o: ["harian"], d: "Floral soft yang halus dan mewah" },
    { n: "Orchid", g: "W", h: 100000, img: "img/Orchid.png", a: ["floral", "fresh"], o: ["harian"], d: "Floral dengan sentuhan asam segar yang unik" },
    { n: "Purple Platinum", g: "W", h: 100000, img: "img/Purple.png", a: ["fresh", "floral"], o: ["harian", "spesial"], d: "Wangi feminin clean dan classy" },
    { n: "Bergamot Black Men", g: "P", h: 100000, img: "img/Bergamot.png", a: ["fresh"], o: ["harian"], d: "Citrus segar yang maskulin dan ringan" },
    { n: "XXXX Man", g: "P", h: 100000, img: "img/XXXX.png", a: ["fresh"], o: ["harian"], d: "Fruity fresh tanpa manis berlebihan" },
    { n: "CH Sexy Men", g: "P", h: 100000, img: "img/CH.png", a: ["manis"], o: ["malam", "spesial"], d: "Manis hangat yang maskulin dan menarik" },
    { n: "Light Man", g: "P", h: 100000, img: "img/Light.png", a: ["fresh"], o: ["harian"], d: "Fresh clean yang ringan dan adem" },
    { n: "VIP Black", g: "P", h: 100000, img: "img/VIP.png", a: ["manis", "woody"], o: ["spesial", "malam"], d: "Manis gelap yang elegan dan kuat" },
    { n: "Blue Hill", g: "P", h: 100000, img: "img/Blue.png", a: ["fresh"], o: ["harian"], d: "Fresh aquatic yang bersih dan maskulin" },
    { n: "Explorer", g: "P", h: 100000, img: "img/Explorer.png", a: ["woody"], o: ["harian", "spesial"], d: "Woody maskulin modern dan elegan" },
    { n: "Intense", g: "U", h: 100000, img: "img/Intense.png", a: ["woody", "manis"], o: ["malam"], d: "Kayu manis hangat dengan kesan dalam" },
    { n: "Amber Wood", g: "U", h: 100000, img: "img/Amber Wood.png", a: ["woody"], o: ["spesial", "malam"], d: "Oriental kuat tapi tetap halus" },
    { n: "LV Smoky Oud", g: "U", h: 100000, img: "img/Smoky Oud.png", a: ["woody"], o: ["spesial", "malam"], d: "Kayu bakar yang bold dan mewah" },
    { n: "LV NYC", g: "U", h: 100000, img: "img/NYC.png", a: ["woody"], o: ["harian", "spesial"], d: "Woody smoky yang lebih lembut dan classy" },
    { n: "Tea Aromatic", g: "U", h: 100000, img: "img/Tea.png", a: ["fresh"], o: ["harian"], d: "Aroma teh yang fresh dan menenangkan" }
  ];

  const rupiah = (x) => "Rp " + x.toLocaleString("id-ID");
  const linkWA = (teks) => `https://api.whatsapp.com/send?phone=${NOMOR_WA}&text=${encodeURIComponent(teks)}`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- Tampilan ----------
  const root = document.createElement("div");
  root.id = "imc-root";
  root.innerHTML = `
    <div id="imc-tip" role="status">Bingung pilih aroma? Konsultasi di sini</div>
    <button id="imc-fab" aria-label="Buka konsultasi aroma" aria-expanded="false">
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2zm3 6.5a1.5 1.5 0 1 0 0 .01zm5 0a1.5 1.5 0 1 0 0 .01zm5 0a1.5 1.5 0 1 0 0 .01z"/></svg>
    </button>
    <section id="imc-panel" aria-label="Konsultasi Aroma IM Parfum" hidden>
      <header id="imc-head">
        <div class="imc-logo">IM</div>
        <div class="imc-title"><strong>Konsultasi Aroma</strong><span>${AI_URL ? "Asisten AI 24 jam" : "Asisten otomatis 24 jam"}</span></div>
        <button id="imc-reset" title="Mulai ulang" aria-label="Mulai ulang">↺</button>
        <button id="imc-close" title="Tutup" aria-label="Tutup">×</button>
      </header>
      <div id="imc-body" aria-live="polite"></div>
      <div id="imc-chips"></div>
      <form id="imc-form" autocomplete="off">
        <input id="imc-input" type="text" placeholder="${AI_URL ? "Tanya apa saja soal parfum..." : "Tulis pertanyaan..."}" aria-label="Tulis pertanyaan">
        <button type="submit" aria-label="Kirim">➤</button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const $ = (id) => document.getElementById(id);
  const body = $("imc-body"), chips = $("imc-chips"), panel = $("imc-panel"), fab = $("imc-fab"), tip = $("imc-tip");
  let jawaban = {};
  let sudahMulai = false;

  function scrollBawah() { body.scrollTop = body.scrollHeight; }

  function pesanBot(html, delay = 450) {
    return new Promise((res) => {
      const t = document.createElement("div");
      t.className = "imc-msg imc-bot imc-typing";
      t.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(t); scrollBawah();
      setTimeout(() => { t.classList.remove("imc-typing"); t.innerHTML = html; scrollBawah(); res(); }, delay);
    });
  }
  function pesanUser(teks) {
    const m = document.createElement("div");
    m.className = "imc-msg imc-user"; m.textContent = teks;
    body.appendChild(m); scrollBawah();
  }
  function setChips(list) {
    chips.innerHTML = "";
    list.forEach(([label, fn]) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = label;
      b.onclick = () => { pesanUser(label); chips.innerHTML = ""; fn(); };
      chips.appendChild(b);
    });
  }
  const menuUtama = () => setChips([
    ["Bantu pilih aroma", mulaiKonsultasi],
    ["Lihat harga", jawabHarga],
    ["Cara pesan", jawabCaraPesan],
    ["Chat admin", jawabAdmin]
  ]);

  function kartu(p) {
    const teks = `Halo, saya ingin memesan parfum ${p.n}` + (jawaban.ringkas ? ` (hasil konsultasi: ${jawaban.ringkas})` : "");
    return `<div class="imc-card">
      <img src="${esc(p.img)}" alt="${esc(p.n)}" loading="lazy" onerror="this.style.display='none'">
      <div class="imc-card-info">
        <strong>${esc(p.n)}</strong>
        <small>${esc(p.d)}</small>
        <span class="imc-price">${rupiah(p.h)}</span>
        <a href="${linkWA(teks)}" target="_blank" rel="noopener">Pesan via WhatsApp</a>
      </div></div>`;
  }

  // ---------- Alur konsultasi ----------
  async function mulaiKonsultasi() {
    jawaban = {};
    await pesanBot("Siap, aku bantu carikan aroma yang pas. Cuma 3 pertanyaan singkat.<br><br><b>1/3</b> Parfumnya untuk siapa?");
    setChips([
      ["Untuk pria", () => { jawaban.g = "P"; q2(); }],
      ["Untuk wanita", () => { jawaban.g = "W"; q2(); }],
      ["Bebas / unisex", () => { jawaban.g = "U"; q2(); }]
    ]);
  }
  async function q2() {
    await pesanBot("<b>2/3</b> Suka wangi yang seperti apa?");
    setChips([
      ["Segar & ringan", () => { jawaban.a = "fresh"; q3(); }],
      ["Manis", () => { jawaban.a = "manis"; q3(); }],
      ["Bunga / floral", () => { jawaban.a = "floral"; q3(); }],
      ["Kayu / woody", () => { jawaban.a = "woody"; q3(); }]
    ]);
  }
  async function q3() {
    await pesanBot("<b>3/3</b> Paling sering dipakai untuk apa?");
    setChips([
      ["Harian & kerja", () => { jawaban.o = "harian"; jawaban.b = 999999; hasil(); }],
      ["Malam & kencan", () => { jawaban.o = "malam"; jawaban.b = 999999; hasil(); }],
      ["Acara spesial", () => { jawaban.o = "spesial"; jawaban.b = 999999; hasil(); }]
    ]);
  }
  async function q4() {
    await pesanBot("<b>4/4</b> Budget-nya berapa?");
    setChips([
      ["Rp 100.000", () => { jawaban.b = 100000; hasil(); }],
      ["Sampai Rp 110.000", () => { jawaban.b = 110000; hasil(); }],
      ["Bebas", () => { jawaban.b = 999999; hasil(); }]
    ]);
  }
  function rekomendasi() {
    const { g, a, o, b } = jawaban;
    return PARFUM
      .filter((p) => g === "U" || p.g === g || p.g === "U")
      .map((p) => {
        let s = 0;
        if (p.a[0] === a) s += 4; else if (p.a.includes(a)) s += 3;
        if (p.o.includes(o)) s += 2;
        if (p.h <= b) s += 2;
        if (g !== "U" && p.g === g) s += 0.5; // utamakan sesuai gender
        return { p, s };
      })
      .sort((x, y) => y.s - x.s || x.p.h - y.p.h)
      .slice(0, 3)
      .map((x) => x.p);
  }
  async function hasil() {
    const label = { P: "pria", W: "wanita", U: "unisex", fresh: "segar", manis: "manis", floral: "floral", woody: "woody", harian: "harian", malam: "malam", spesial: "acara spesial" };
    jawaban.ringkas = `${label[jawaban.g]}, ${label[jawaban.a]}, ${label[jawaban.o]}`;
    const list = rekomendasi();
    await pesanBot(`Ini 3 aroma yang paling cocok untuk kamu (${esc(jawaban.ringkas)}):`, 700);
    await pesanBot(list.map(kartu).join(""), 300);
    await pesanBot("Masih ragu? Admin bisa bantu pilihkan langsung, atau coba aroma tester-nya di lokasi.");
    setChips([
      ["Ulangi konsultasi", mulaiKonsultasi],
      ["Chat admin", jawabAdmin],
      ["Menu", async () => { await pesanBot("Ada lagi yang bisa aku bantu?"); menuUtama(); }]
    ]);
  }

  // ---------- Jawaban umum ----------
  async function jawabHarga() {
    await pesanBot("Semua parfum IM Parfum harganya sama: <b>Rp 100.000</b> untuk semua aroma (21 pilihan pria, wanita, dan unisex).<br><br>Beli lebih dari 1 botol dapat <b>diskon 10%</b>.");
    menuUtama();
  }
  async function jawabCaraPesan() {
    await pesanBot("Caranya gampang:<br>1. Pilih aroma di katalog (atau pakai konsultasi ini)<br>2. Tekan tombol <b>Pesan</b>, nanti otomatis terbuka WhatsApp<br>3. Kirim pesannya, admin akan konfirmasi stok, pembayaran, dan pengiriman");
    menuUtama();
  }
  async function jawabAdmin() {
    const teks = "Halo admin IM Parfum, saya mau konsultasi aroma" + (jawaban.ringkas ? ` (preferensi: ${jawaban.ringkas})` : "");
    await pesanBot(`Klik tombol ini untuk chat langsung dengan admin:<br><a class="imc-btn" href="${linkWA(teks)}" target="_blank" rel="noopener">Chat Admin di WhatsApp</a>`);
    menuUtama();
  }

  // ---------- AI ----------
  const riwayatAI = [];
  function formatAI(teks) {
    return esc(teks)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/^\s*[-*•]\s+/gm, "• ")
      .replace(/\n/g, "<br>");
  }
  function produkDisebut(teks) {
    const t = " " + norm(teks) + " ";
    return PARFUM.filter((p) => t.includes(norm(p.n))).slice(0, 3);
  }
  async function tanyaAI(teks) {
    riwayatAI.push({ role: "user", text: teks });
    const ketik = document.createElement("div");
    ketik.className = "imc-msg imc-bot imc-typing";
    ketik.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(ketik); scrollBawah();
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: riwayatAI.slice(-12),
          produk: PARFUM.map(({ n, g, h, d }) => ({ n, g, h, d }))
        }),
        signal: ctrl.signal
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(data.error || "HTTP " + res.status);
      ketik.classList.remove("imc-typing");
      ketik.innerHTML = formatAI(data.reply);
      riwayatAI.push({ role: "model", text: data.reply });
      const kartuList = produkDisebut(data.reply);
      if (kartuList.length) await pesanBot(kartuList.map(kartu).join(""), 250);
      scrollBawah();
      return true;
    } catch (e) {
      console.warn("AI tidak tersedia:", e.message);
      ketik.remove();
      riwayatAI.pop();
      return false;
    }
  }

  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  async function jawabTeks(teks) {
    const t = " " + norm(teks) + " ";
    const ada = (...k) => k.some((x) => t.includes(x));
    const jumlahKata = t.trim().split(" ").filter(Boolean).length;

    // Pertanyaan panjang atau lanjutan obrolan AI -> langsung ke AI
    if (AI_URL && (jumlahKata > 4 || riwayatAI.length)) {
      if (await tanyaAI(teks)) return menuUtama();
    }

    // Cari nama parfum di pertanyaan
    const cocok = PARFUM.filter((p) => {
      const nama = norm(p.n).replace(/\b(lv|men|man|for her|black)\b/g, "").trim();
      return t.includes(norm(p.n)) || (nama.length > 2 && t.includes(nama));
    });
    if (cocok.length) {
      await pesanBot("Ini info aromanya:");
      await pesanBot(cocok.slice(0, 3).map(kartu).join(""), 300);
      return menuUtama();
    }
    if (t.trim().split(" ").filter(Boolean).length <= 3 && ada("halo", "hai", "hi ", "pagi", "siang", "sore", "malam", "assalam", "permisi", "p ")) {
      await pesanBot("Halo, selamat datang di IM Parfum. Mau aku bantu pilihkan aroma yang cocok?");
      return menuUtama();
    }
    if (ada("rekomen", "saran", "pilih", "cocok", "bingung", "konsul", "bagus", "terlaris", "best")) return mulaiKonsultasi();
    if (ada("tahan", "awet", "lama", "berapa jam")) {
      await pesanBot("Wangi IM Parfum tahan sekitar <b>6–8 jam</b>. Tips biar lebih awet: semprot di titik nadi (pergelangan tangan, leher, belakang telinga) setelah mandi, dan jangan digosok.");
      return menuUtama();
    }
    if (ada("harga", "berapa", "price", "murah", "mahal", "diskon", "promo")) return jawabHarga();
    if (ada("pesan", "order", "beli", "cara", "bayar", "transfer", "cod")) return jawabCaraPesan();
    if (ada("kirim", "ongkir", "antar", "lokasi", "alamat", "dimana", "di mana", "ketemu", "ambil")) {
      await pesanBot("Untuk pengiriman, ongkir, atau ambil langsung, silakan tanya admin ya, nanti dibantu sesuai lokasimu.");
      return jawabAdmin();
    }
    if (ada("pria", "cowok", "laki", "suami", "pacar cowok")) {
      await pesanBot("Pilihan untuk pria: Bergamot Black Men, XXXX Man, CH Sexy Men, Light Man, VIP Black, Blue Hill, Explorer. Unisex juga cocok: Intense, Amber Wood, LV Smoky Oud, LV NYC, Tea Aromatic.");
      return menuUtama();
    }
    if (ada("wanita", "cewek", "perempuan", "istri", "pacar cewek")) {
      await pesanBot("Pilihan untuk wanita: SL Black, Lo Vely, Chiffon Pink, Berry for Her, Swift Rose, Scandal, Flora Pastellia, Orchid, Purple Platinum. Unisex juga cocok: Intense, Amber Wood, LV Smoky Oud, LV NYC, Tea Aromatic.");
      return menuUtama();
    }
    if (ada("hadiah", "kado", "gift")) {
      await pesanBot("Parfum cocok banget buat kado. Yuk aku bantu pilihkan sesuai orang yang mau dikasih.");
      return mulaiKonsultasi();
    }
    if (ada("makasih", "terima kasih", "thanks", "thx", "oke", "ok ")) {
      await pesanBot("Sama-sama. Kalau sudah pilih aromanya, tinggal tekan tombol Pesan ya.");
      return menuUtama();
    }
    if (AI_URL && !riwayatAI.length && (await tanyaAI(teks))) return menuUtama();
    await pesanBot("Maaf, aku belum bisa jawab itu. Pertanyaanmu bisa langsung ditanyakan ke admin ya.");
    return jawabAdmin();
  }

  // ---------- Event ----------
  async function buka() {
    panel.hidden = false; fab.setAttribute("aria-expanded", "true");
    root.classList.add("imc-open"); tip.classList.remove("imc-show");
    if (!sudahMulai) {
      sudahMulai = true;
      await pesanBot("Halo, selamat datang di <b>IM Parfum</b>. Aku bisa bantu kamu menemukan aroma yang paling pas dengan karaktermu.");
      menuUtama();
    }
    setTimeout(() => $("imc-input").focus({ preventScroll: true }), 50);
  }
  function tutup() { panel.hidden = true; fab.setAttribute("aria-expanded", "false"); root.classList.remove("imc-open"); }

  fab.onclick = () => (panel.hidden ? buka() : tutup());
  tip.onclick = buka;
  $("imc-close").onclick = tutup;
  $("imc-reset").onclick = () => { body.innerHTML = ""; chips.innerHTML = ""; jawaban = {}; riwayatAI.length = 0; sudahMulai = false; buka(); };
  $("imc-form").onsubmit = (e) => {
    e.preventDefault();
    const inp = $("imc-input"); const v = inp.value.trim();
    if (!v) return;
    inp.value = ""; chips.innerHTML = ""; pesanUser(v); jawabTeks(v);
  };

  // Tombol lain di halaman bisa membuka chatbot: tambahkan class "buka-konsultasi"
  document.addEventListener("click", (e) => {
    const el = e.target.closest(".buka-konsultasi");
    if (el) { e.preventDefault(); buka(); }
  });

  // Tooltip muncul sekali setelah 4 detik
  setTimeout(() => { if (panel.hidden) tip.classList.add("imc-show"); }, 4000);
  setTimeout(() => tip.classList.remove("imc-show"), 12000);
})();
