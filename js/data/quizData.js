/**
 * Quiz Data Module
 * 
 * Stores the educational content for the game interactions.
 * - Questions per sign.
 * - Multiple choice options.
 * - Correct answer indices.
 * 
 * Used by the UI/Popup module to generate quizzes dynamically.
 */

// Master list of all available sign IDs
export const SIGN_IDS = [
    "parking", "schoolzone", "noparking", "speedlimit", "stop",
    "intersection", "noleft", "noright", "noovertake", "slippery"
];

// Quiz Content Database
// Structure:
// {
//    signId: [
//       { 
//          q: "Question Text",
//          a: ["Option 0", "Option 1", "Option 2", "Option 3"],
//          c: CorrectOptionIndex (0-3)
//       }, ...
//    ]
// }
export const quizData = {
    parking: [
        {
            q: "Apa arti dari rambu dengan huruf 'P' putih berlatar biru kotak ini?",
            a: ["Dilarang Parkir", "Tempat Parkir", "Dilarang Berhenti", "Parkir Khusus Bus"],
            c: 1,
        },
        {
            q: "Siapa yang diperbolehkan memarkir kendaraan di area ini?",
            a: ["Hanya Truk", "Hanya Motor", "Semua jenis kendaraan bermotor", "Hanya Pejalan Kaki"],
            c: 2,
        },
        {
            q: "Manakah tindakan yang BENAR saat melihat rambu ini?",
            a: ["Memarkir kendaraan dengan rapi", "Menambah kecepatan", "Dilarang berhenti sama sekali", "Membunyikan klakson"],
            c: 0,
        },
        {
            q: "Rambu 'P' biasanya dipasang di area mana?",
            a: ["Tengah jalan tol", "Area perbelanjaan atau kantor", "Tikungan tajam", "Jembatan layang"],
            c: 1,
        },
        {
            q: "Warna dominan pada rambu petunjuk tempat parkir adalah...",
            a: ["Merah", "Kuning", "Biru", "Hijau"],
            c: 2,
        },
    ],
    schoolzone: [
        {
            q: "Apa makna dari rambu 'School Zone'?",
            a: ["Area bebas ngebut", "Area Sekolah / Zona Selamat Sekolah", "Area terminal bus", "Area pasar malam"],
            c: 1,
        },
        {
            q: "Apa yang harus dilakukan pengendara saat memasuki zona ini?",
            a: ["Meningkatkan kecepatan", "Membunyikan klakson panjang", "Mengurangi kecepatan dan waspada", "Berhenti mendadak"],
            c: 2,
        },
        {
            q: "Mengapa kecepatan harus dikurangi di area ini?",
            a: ["Banyak anak sekolah menyeberang", "Jalanan rusak parah", "Ada polisi tidur saja", "Supaya mobil tidak cepat panas"],
            c: 0,
        },
        {
            q: "Prioritas utama di zona sekolah adalah...",
            a: ["Kenyamanan supir", "Keselamatan pejalan kaki (siswa)", "Kecepatan sampai tujuan", "Keindahan mobil"],
            c: 1,
        },
        {
            q: "Warna dasar rambu peringatan seperti Zona Sekolah biasanya...",
            a: ["Biru", "Kuning", "Merah", "Hitam"],
            c: 1,
        },
    ],
    noparking: [
        {
            q: "Apa arti rambu lingkaran merah dengan huruf 'P' dicoret?",
            a: ["Boleh Parkir", "Dilarang Parkir", "Dilarang Berhenti", "Parkir Khusus Pejabat"],
            c: 1,
        },
        {
            q: "Apakah boleh berhenti sebentar (drop-off) di area dilarang parkir?",
            a: ["Boleh, asalkan pengemudi tidak turun", "Tidak boleh sama sekali", "Boleh memarkir motor saja", "Hanya boleh saat malam"],
            c: 0,
        },
        {
            q: "Jika Anda memarkir kendaraan di area ini, sanksi apa yang mungkin diterima?",
            a: ["Diberi hadiah", "Ditilang atau diderek petugas", "Dipuji warga", "Jalanan jadi lancar"],
            c: 1,
        },
        {
            q: "Rambu Dilarang Parkir bertujuan untuk...",
            a: ["Menghias trotoar", "Mencegah kemacetan akibat bahu jalan tertutup", "Melarang orang lewat", "Mempersulit pengemudi"],
            c: 1,
        },
        {
            q: "Perbedaan 'Dilarang Parkir' dan 'Dilarang Berhenti' (S coret) adalah...",
            a: ["Sama saja", "P coret boleh berhenti sebentar, S coret tidak boleh berhenti sama sekali", "P coret lebih galak", "S coret boleh parkir"],
            c: 1,
        },
    ],
    speedlimit: [
        {
            q: "Angka '40' dalam lingkaran merah artinya...",
            a: ["Kecepatan minimal 40 km/jam", "Kecepatan maksimal 40 km/jam", "Jarak 40 meter lagi", "Harus berjalan tepat 40 km/jam"],
            c: 1,
        },
        {
            q: "Mengapa ada pembatasan kecepatan 40 km/jam di dalam kota?",
            a: ["Agar bensin boros", "Untuk keselamatan di area padat", "Karena jalanan jelek", "Supaya polisi senang"],
            c: 1,
        },
        {
            q: "Apa yang terjadi jika melaju 80 km/jam di area ini?",
            a: ["Aman-aman saja", "Melanggar aturan dan berbahaya", "Lebih cepat sampai", "Mendapat pujian"],
            c: 1,
        },
        {
            q: "Rambu batas kecepatan termasuk jenis rambu...",
            a: ["Petunjuk", "Larangan/Perintah", "Peringatan", "Lokasi"],
            c: 1,
        },
        {
            q: "Jika jalanan sepi, apakah boleh melanggar batas kecepatan ini?",
            a: ["Boleh saja", "Tergantung mood", "Tidak boleh, tetap patuhi aturan", "Boleh jika buru-buru"],
            c: 2,
        },
    ],
    stop: [
        {
            q: "Apa tindakan wajib saat melihat rambu STOP?",
            a: ["Jalan terus pelan-pelan", "Berhenti total sejenak, tengok kanan-kiri", "Membunyikan klakson", "Langsung gas pol"],
            c: 1,
        },
        {
            q: "Rambu STOP memiliki bentuk khas, yaitu...",
            a: ["Lingkaran", "Segitiga Terbalik", "Segi Delapan (Oktagon)", "Persegi Panjang"],
            c: 2,
        },
        {
            q: "Siapa yang memiliki prioritas di persimpangan rambu STOP?",
            a: ["Anda yang melihat rambu", "Kendaraan di jalur utama / jalur lain", "Yang mobilnya lebih besar", "Yang klaksonnya paling keras"],
            c: 1,
        },
        {
            q: "Warna dominan rambu STOP adalah...",
            a: ["Merah dengan tulisan putih", "Kuning dengan tulisan hitam", "Biru dengan tulisan putih", "Hijau dengan tulisan putih"],
            c: 0,
        },
        {
            q: "Meski jalan terlihat kosong, apakah harus tetap berhenti di rambu STOP?",
            a: ["Tidak perlu", "Ya, wajib berhenti total", "Cukup kurangi gigi", "Cukup lihat spion"],
            c: 1,
        },
    ],
    intersection: [
        {
            q: "Rambu kuning dengan simbol panah pertigaan/perempatan berarti...",
            a: ["Dilarang masuk", "Peringatan ada persimpangan di depan", "Jalan buntu", "Wajib belok"],
            c: 1,
        },
        {
            q: "Apa yang harus disiapkan pengemudi saat melihat rambu ini?",
            a: ["Mengurangi kecepatan dan waspada kendaraan lain", "Menambah kecepatan agar lolos", "Menutup mata", "Berhenti di tengah jalan"],
            c: 0,
        },
        {
            q: "Persimpangan adalah tempat rawan kecelakaan karena...",
            a: ["Banyak pohon", "Pertemuan arus kendaraan dari berbagai arah", "Jalanan lurus", "Aspalnya beda"],
            c: 1,
        },
        {
            q: "Simbol 'T' pada rambu berarti...",
            a: ["Jalan terus", "Persimpangan Tiga (Pertigaan)", "Terminal", "Tanjakan"],
            c: 1,
        },
        {
            q: "Rambu peringatan persimpangan biasanya berwarna dasar...",
            a: ["Merah", "Biru", "Kuning", "Hijau"],
            c: 2,
        },
    ],
    noleft: [
        {
            q: "Apa arti rambu panah belok kiri dicoret?",
            a: ["Wajib belok kiri", "Dilarang belok kiri", "Jalan kiri rusak", "Boleh belok kiri jika sepi"],
            c: 1,
        },
        {
            q: "Jika Anda ingin ke kiri tapi ada rambu ini, apa solusinya?",
            a: ["Tetap belok kiri pelan-pelan", "Cari jalan lain atau putar balik di tempat legal", "Melawan arus", "Marah-marah"],
            c: 1,
        },
        {
            q: "Rambu larangan belok kiri dipasang untuk...",
            a: ["Mencegah kemacetan atau kecelakaan", "Hiasan jalan", "Mempersulit pengemudi", "Menunjukkan jalan buntu"],
            c: 0,
        },
        {
            q: "Apakah sepeda motor boleh melanggar aturan ini?",
            a: ["Boleh karena kecil", "Tidak boleh, aturan berlaku untuk semua", "Boleh jika tidak ada polisi", "Boleh di hari Minggu"],
            c: 1,
        },
        {
            q: "Warna garis coret pada rambu larangan adalah...",
            a: ["Putih", "Hitam", "Merah", "Kuning"],
            c: 2,
        },
    ],
    noright: [
        {
            q: "Apa arti rambu panah belok kanan dicoret?",
            a: ["Wajib belok kanan", "Dilarang belok kanan", "Jalan kanan sedang diperbaiki", "Area parkir kanan"],
            c: 1,
        },
        {
            q: "Bahaya memaksakan belok kanan di area terlarang adalah...",
            a: ["Menabrak arus berlawanan", "Bensin cepat habis", "Ban jadi kempes", "Tidak ada bahaya"],
            c: 0,
        },
        {
            q: "Rambu ini termasuk dalam kategori rambu...",
            a: ["Peringatan", "Petunjuk", "Larangan", "Perintah"],
            c: 2,
        },
        {
            q: "Jika tujuan Anda ada di sebelah kanan jalan ini, Anda harus...",
            a: ["Langsung belok saja", "Mencari tempat putar balik yang diizinkan", "Mundur", "Parkir di tengah jalan"],
            c: 1,
        },
        {
            q: "Rambu larangan berlaku selama...",
            a: ["Ada polisi saja", "24 jam kecuali ada keterangan waktu khusus", "Siang hari saja", "Malam hari saja"],
            c: 1,
        },
    ],
    noovertake: [
        {
            q: "Apa maksud rambu dengan dua mobil merah-hitam berdampingan?",
            a: ["Boleh balapan", "Area parkir paralel", "Dilarang Menyalip / Mendahului", "Jalan dua arah"],
            c: 2,
        },
        {
            q: "Di lokasi mana rambu Dilarang Mendahului sering dipasang?",
            a: ["Jalan tol lurus", "Tikungan tajam, tanjakan, atau jembatan sempit", "Lapangan parkir", "Komplek perumahan"],
            c: 1,
        },
        {
            q: "Mengapa dilarang menyalip di tikungan?",
            a: ["Blind spot (titik buta) tinggi, bahaya tabrakan", "Supaya ban awet", "Pemandangan bagus", "Supaya tidak cepat sampai"],
            c: 0,
        },
        {
            q: "Garis marka jalan yang mendukung rambu ini biasanya...",
            a: ["Garis putus-putus", "Garis lurus bersambung (tanpa putus)", "Tidak ada garis", "Garis zig-zag"],
            c: 1,
        },
        {
            q: "Jika ada kendaraan lambat di depan saat ada rambu ini, Anda harus...",
            a: ["Menyalip dari bahu jalan", "Membunyikan klakson terus menerus", "Bersabar antre di belakangnya", "Menabrak dari belakang"],
            c: 2,
        },
    ],
    slippery: [
        {
            q: "Apa arti rambu dengan gambar mobil berkelok-kelok?",
            a: ["Jalan berliku", "Jalan Licin", "Area drifting", "Mobil sedang mabuk"],
            c: 1,
        },
        {
            q: "Apa yang harus dilakukan saat melihat rambu Jalan Licin?",
            a: ["Menambah kecepatan", "Pengereman mendadak", "Kurangi kecepatan, hindari rem mendadak", "Lepas tangan dari setir"],
            c: 2,
        },
        {
            q: "Kondisi apa yang sering membuat jalan menjadi licin?",
            a: ["Panas terik", "Hujan deras atau tumpahan minyak", "Angin kencang", "Jalan baru diaspal"],
            c: 1,
        },
        {
            q: "Rambu Jalan Licin termasuk rambu...",
            a: ["Larangan", "Perintah", "Peringatan", "Petunjuk"],
            c: 2,
        },
        {
            q: "Saat jalan licin, jarak pengereman kendaraan akan...",
            a: ["Lebih pendek (cepat berhenti)", "Tetap sama", "Lebih panjang (sulit berhenti)", "Menjadi nol"],
            c: 2,
        },
    ],
};

// Calculate total quiz questions
export function getTotalQuizQuestions() {
    let total = 0;
    Object.keys(quizData).forEach((id) => {
        total += quizData[id].length;
    });
    return total;
}
