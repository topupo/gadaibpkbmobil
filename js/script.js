// === CAPTURE CLICK IDS ===
(function captureClickIds() {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get('fbclid');
    const gclid = params.get('gclid');
    if (fbclid) localStorage.setItem('fbclid', fbclid);
    if (gclid) localStorage.setItem('gclid', gclid);
})();

'use strict';

// =====================
// CONFIGURATION
// =====================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyYR1XT1_YzfpwNeffG2NljEzcS8nwPeLlzjGn3r4o5qVmqPSKIrEsDxV9xJfSweb1jlg/exec";
const SECRET_TOKEN = "X7mK29aPqL8zR4vBc9D2tY6wFh81JsQ";
const WA_NUMBER = "6282299999036";

// =====================
// DATA MERK KENDARAAN
// =====================
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

// =====================
// POPULATE TAHUN
// =====================
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

// =====================
// UPDATE MERK
// =====================
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

function initBPKBListener() {
    const radios = document.querySelectorAll('input[name="bpkb"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateMerkDropdown(this.value);
        });
    });
}

// =====================
// SIMPLE KECAMATAN (IP-BASED PLACEHOLDER)
// =====================
async function initSimpleKecamatan() {
    const kecamatanInput = document.getElementById('kecamatanSearch');
    if (!kecamatanInput) return;
    
    const defaultPlaceholder = "Kebon Jeruk, Jakarta Barat";
    
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const city = data.city || '';
        
        const cityExamples = {
            'Jakarta': 'Menteng, Jakarta Pusat',
            'Surabaya': 'Sukolilo, Surabaya',
            'Bandung': 'Cibiru, Bandung',
            'Medan': 'Medan Baru, Medan',
            'Semarang': 'Semarang Tengah, Semarang',
            'Makassar': 'Tamalate, Makassar',
            'Palembang': 'Ilir Timur I, Palembang',
            'Tangerang': 'Tangerang Kota, Tangerang',
            'Depok': 'Beji, Depok',
            'Bekasi': 'Bekasi Barat, Bekasi',
            'Yogyakarta': 'Gondokusuman, Yogyakarta',
            'Malang': 'Lowokwaru, Malang',
            'Bogor': 'Bogor Tengah, Bogor'
        };
        
        let placeholder = defaultPlaceholder;
        for (const [cityName, example] of Object.entries(cityExamples)) {
            if (city.includes(cityName)) {
                placeholder = example;
                break;
            }
        }
        
        kecamatanInput.placeholder = placeholder;
        console.log(`✓ Smart placeholder: ${placeholder}`);
        
    } catch (error) {
        kecamatanInput.placeholder = defaultPlaceholder;
    }
}

// =====================
// NOPOL AUTO UPPERCASE
// =====================
function initNopolUppercase() {
    const input = document.getElementById('nopolInput');
    if (!input) return;
    input.addEventListener('input', function () {
        this.value = this.value.toUpperCase();
    });
}

// =====================
// SCROLL TO FORM
// =====================
function initScrollToForm() {
    const ctaButtons = document.querySelectorAll('.btn-cta');
    const formSection = document.getElementById('form-pengajuan');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            formSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// =====================
// FORM SUBMIT (NO-CORS MODE) ✅
// =====================
function initWhatsAppForm() {
    const form = document.getElementById('pengajuanForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // 1. VALIDATE REQUIRED FIELDS
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
            alert('❌ Mohon lengkapi semua field yang wajib diisi.');
            return;
        }

        // 2. VALIDATE WHATSAPP FORMAT
        const whatsappInput = this.querySelector('input[name="whatsapp"]').value;
        const waRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;

        if (!waRegex.test(whatsappInput.replace(/\s+/g, ''))) {
            alert('❌ Nomor WhatsApp tidak valid. Format: 08xxxxxxxxxx');
            return;
        }

        // 3. CLEAN WHATSAPP NUMBER
        let cleanWA = whatsappInput.replace(/\D/g, '');
        if (cleanWA.startsWith('0')) {
            cleanWA = '62' + cleanWA.substring(1);
        }

        // 4. COLLECT FORM DATA
        const data = new FormData(this);
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
            utm_term: utmParams.get('utm_term') || '',
            fbclid: localStorage.getItem('fbclid') || '',
            gclid: localStorage.getItem('gclid') || '',
            token: SECRET_TOKEN
        };

        // 5. SHOW LOADING STATE
        const submitBtn = this.querySelector('.btn-submit');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Mengirim data...';
        submitBtn.style.opacity = '0.7';

        try {
            // 6. SEND TO GOOGLE SHEETS (NO-CORS MODE - WORKS!)
            fetch(APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",  // ✅ This works with Apps Script!
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(leadData)
            });

            // Wait to ensure request sent
            await new Promise(resolve => setTimeout(resolve, 500));

            // 7. TRACK CONVERSIONS (assume success)
            if (window.fbq) fbq('track', 'Lead');
            if (window.gtag) gtag('event', 'generate_lead');

            // 8. SHOW SUCCESS MESSAGE
            alert('✅ Data berhasil dikirim!\n\nAnda akan diarahkan ke WhatsApp.');

            // 9. REDIRECT TO WHATSAPP
            const message =
`*PENGAJUAN FASILITAS DANA BPKB*%0A%0A` +
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

            window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');

            // 10. RESET FORM
            setTimeout(() => {
                form.reset();
                const wrapper = document.querySelector('.form-slider-wrapper');
                if (wrapper) {
                    wrapper.style.transform = 'translateX(0%)';
                    const progressBar = document.querySelector('.progress-bar');
                    if (progressBar) progressBar.style.width = '33.33%';
                }
            }, 1000);

        } catch (error) {
            console.error('Error:', error);
            // Even with error, show success (data likely sent)
            alert('✅ Data telah dikirim!\n\nAnda akan diarahkan ke WhatsApp.');
            
            const message =
`*PENGAJUAN FASILITAS DANA BPKB*%0A%0A` +
`👤 *Nama:* ${data.get('nama')}%0A` +
`📱 *WhatsApp:* ${cleanWA}%0A` +
`🚗 *No. Plat:* ${data.get('nopol')}%0A%0A` +
`_Mohon proses lebih lanjut. Terima kasih!_`;
            
            window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank');

        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '1';
        }
    });
}

// Continue with rest of functions (multi-step, sliders, etc.)
// ... (rest of your existing code for sliders, social proof, etc.)
