'use strict';

// Data Merk Kendaraan
const merkKendaraan = {
    mobil: [
        'Daihatsu','Honda','Isuzu','Mazda','Mitsubishi','Nissan','Suzuki','Toyota',
        'Hyundai','Kia',
        'Audi','BMW','Mercedes-Benz','Volkswagen','Volvo',
        'Chery','DFSK','MG','Wuling'
    ],
    motor: ['Honda','Kawasaki','Suzuki','Yamaha'],
    truk: [
        'Daihatsu','Hino','Isuzu','Mitsubishi Fuso','Nissan','Toyota',
        'Hyundai',
        'Mercedes-Benz','Scania','Volvo',
        'DFSK','Dongfeng','FAW','Foton','Howo','JAC','JMC','Shacman'
    ]
};

// Populate Tahun Dynamic
function populateTahun() {
    const tahunSelect = document.getElementById('tahunKendaraan');
    if (!tahunSelect) return;

    const currentYear = new Date().getFullYear();
    const startYear = 2010;

    tahunSelect.innerHTML = '<option value="">Pilih Tahun</option>';

    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        tahunSelect.appendChild(option);
    }
}

// Update Merk Dropdown
function updateMerkDropdown(type) {
    const merkSelect = document.getElementById('merkKendaraan');
    if (!merkSelect) return;

    merkSelect.innerHTML = '<option value="">Pilih Merk</option>';

    (merkKendaraan[type] || []).forEach(merk => {
        const option = document.createElement('option');
        option.value = merk;
        option.textContent = merk;
        merkSelect.appendChild(option);
    });
}

// Uppercase Nopol
function initNopolUppercase() {
    const input = document.getElementById('nopolInput');
    if (!input) return;
    input.addEventListener('input', function () {
        this.value = this.value.toUpperCase();
    });
}

// Scroll To Form
function initScrollToForm() {
    const buttons = document.querySelectorAll('.btn-cta-hero');
    const formSection = document.querySelector('.form-section');

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            formSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

const utmParams = new URLSearchParams(window.location.search);

const leadData = {
    nama: data.get('nama'),
    whatsapp: cleanWA,
    nopol: data.get('nopol'),
    pengajuan: data.get('pengajuan'),
    bpkb: data.get('bpkb'),
    atasnama: data.get('atasnama'),
    statustinggal: data.get('statustinggal'),
    merk: data.get('merk'),
    tipe: data.get('tipe'),
    tahun: data.get('tahun'),
    kecamatan: data.get('kecamatan'),
    nominal: data.get('nominal'),
    utm_source: utmParams.get('utm_source') || '',
    utm_campaign: utmParams.get('utm_campaign') || '',
    utm_content: utmParams.get('utm_content') || '',
    utm_term: utmParams.get('utm_term') || ''
};

fetch("https://script.google.com/macros/s/AKfycbxLGlFofJu6MTDWuCThmbmNZKfYY1JD17-Lotab46kJ9Sa9iMWTJXsWrkP0FxyJxVDB/exec", {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    body: JSON.stringify(leadData),
    headers: {
        "Content-Type": "application/json"
    }
}).then(res => res.json())
  .then(response => {
      if (response.status === "success") {
          window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
      } else {
          alert("Terjadi kesalahan. Silakan coba lagi.");
      }
  }).catch(err => {
      alert("Gagal mengirim data.");
  });

// Tracking tetap jalan
if (window.fbq) fbq('track', 'Lead');
if (window.gtag) gtag('event', 'generate_lead');

// Redirect WA langsung
window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');

// WhatsApp Handler
function initWhatsAppForm() {
    const form = document.getElementById('pengajuanForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const requiredFields = this.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value || (field.type === 'checkbox' && !field.checked)) {
                isValid = false;
                field.style.borderLeft = '3px solid #ff6b6b';
            } else {
                field.style.borderLeft = 'none';
            }
        });

        if (!isValid) {
            alert('Mohon lengkapi semua field yang wajib diisi.');
            return;
        }

        const whatsappInput = this.querySelector('input[name="whatsapp"]').value;
        const waRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;

        if (!waRegex.test(whatsappInput.replace(/\s+/g, ''))) {
            alert('Nomor WhatsApp tidak valid.');
            return;
        }

        let cleanWA = whatsappInput.replace(/\D/g, '');
        if (cleanWA.startsWith('0')) {
            cleanWA = '62' + cleanWA.substring(1);
        }

        const submitBtn = this.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';

        const data = new FormData(this);

        const message = `*PENGAJUAN FASILITAS DANA BPKB*%0A%0A` +
            `👤 *Nama:* ${data.get('nama')}%0A` +
            `📱 *WhatsApp:* ${cleanWA}%0A` +
            `🚗 *No. Plat:* ${data.get('nopol')}%0A%0A` +
            `*DETAIL PENGAJUAN:*%0A` +
            `💼 *Jenis Pengajuan:* ${data.get('pengajuan')}%0A` +
            `📋 *Jenis Kendaraan:* ${data.get('bpkb')}%0A` +
            `📝 *Atas Nama:* ${data.get('atasnama')}%0A` +
            `🏠 *Status Tinggal:* ${data.get('statustinggal')}%0A%0A` +
            `*DETAIL KENDARAAN:*%0A` +
            `🏷️ *Merk:* ${data.get('merk')}%0A` +
            `🔖 *Tipe:* ${data.get('tipe')}%0A` +
            `📅 *Tahun:* ${data.get('tahun')}%0A%0A` +
            `*INFORMASI LAINNYA:*%0A` +
            `📍 *Domisili:* ${data.get('kecamatan')}%0A` +
            `💰 *Nominal:* ${data.get('nominal')}%0A%0A` +
            `_Mohon proses lebih lanjut. Terima kasih!_`;

        // Tracking hooks
        if (window.fbq) fbq('track', 'Lead');
        if (window.gtag) gtag('event', 'generate_lead');

        const waNumber = '6282299999036';
        window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
    });
}

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.touchAction = "pan-y";
    populateTahun();
    updateMerkDropdown('mobil');
    initNopolUppercase();
    initWhatsAppForm();
    initScrollToForm();
});
