// === CAPTURE CLICK IDS ===
(function captureClickIds() {
    const params = new URLSearchParams(window.location.search);

    const fbclid = params.get('fbclid');
    const gclid = params.get('gclid');

    if (fbclid) {
        localStorage.setItem('fbclid', fbclid);
    }

    if (gclid) {
        localStorage.setItem('gclid', gclid);
    }
})();

'use strict';

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
// DATA KECAMATAN
// =====================
const kecamatanList = [
    "Cengkareng","Grogol Petamburan","Taman Sari","Tambora","Kebon Jeruk",
    "Kalideres","Palmerah","Kembangan","Tanah Abang","Menteng",
    "Senen","Johar Baru","Cempaka Putih","Kemayoran","Sawah Besar",
    "Gambir","Pasar Rebo","Ciracas","Cipayung","Makasar",
    "Kramat Jati","Jatinegara","Duren Sawit","Cakung","Pulo Gadung",
    "Matraman","Koja","Tanjung Priok","Penjaringan","Pademangan",
    "Kelapa Gading","Cilincing","Kebayoran Baru","Kebayoran Lama",
    "Pesanggrahan","Cilandak","Pancoran","Jagakarsa","Mampang Prapatan",
    "Pasar Minggu","Tebet","Setiabudi","Cibubur","Cipete"
];

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

// LISTENER RADIO BPKB
function initBPKBListener() {
    const radios = document.querySelectorAll('input[name="bpkb"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateMerkDropdown(this.value);
        });
    });
}

// =====================
// SEARCH KECAMATAN
// =====================
function initKecamatanSearch() {
    const searchInput = document.getElementById('kecamatanSearch');
    const searchResults = document.getElementById('searchResults');
    if (!searchInput || !searchResults) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();

        if (!query) {
            searchResults.classList.remove('active');
            return;
        }

        const filtered = kecamatanList.filter(k =>
            k.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
            searchResults.innerHTML = filtered.slice(0,5).map(k =>
                `<div class="search-result-item" data-value="${k}">${k}</div>`
            ).join('');

            searchResults.classList.add('active');

            searchResults.querySelectorAll('.search-result-item')
                .forEach(item => {
                    item.addEventListener('click', function() {
                        searchInput.value = this.dataset.value;
                        searchResults.classList.remove('active');
                    });
                });

        } else {
            searchResults.innerHTML = '<div class="search-result-item">Tidak ditemukan</div>';
            searchResults.classList.add('active');
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });
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
    const buttons = document.querySelectorAll('.btn-cta-hero');
    const formSection = document.querySelector('.form-section');

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            formSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// =====================
// FORM SUBMIT
// =====================
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
            token: "X8dk04sK12Abc82"

        };

        fetch("https://script.google.com/macros/s/AKfycbxLGlFofJu6MTDWuCThmbmNZKfYY1JD17-Lotab46kJ9Sa9iMWTJXsWrkP0FxyJxVDB/exec", {
            method: "POST",
            mode: "no-cors",
            keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(leadData)
        });

        if (window.fbq) fbq('track', 'Lead');
        if (window.gtag) gtag('event', 'generate_lead');

        const waNumber = '6282299999036';
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


        window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
    });
}

function initMultiStepForm() {
    const wrapper = document.querySelector('.form-slider-wrapper');
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const progressBar = document.querySelector('.progress-bar');

    if (!wrapper) return;

    let currentStep = 0;
    const totalSteps = steps.length;

    function updateSlider() {
        wrapper.style.transform = `translateX(-${currentStep * 100}%)`;
        const progressPercent = ((currentStep + 1) / totalSteps) * 100;
        progressBar.style.width = progressPercent + "%";
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentFields = steps[currentStep].querySelectorAll('[required]');
            let valid = true;

            currentFields.forEach(field => {
                if (!field.value) {
                    field.style.borderLeft = '3px solid #ff6b6b';
                    valid = false;
                } else {
                    field.style.borderLeft = 'none';
                }
            });

            if (!valid) return;

            if (currentStep < totalSteps - 1) {
                currentStep++;
                updateSlider();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateSlider();
            }
        });
    });

    updateSlider();
}

class Slider {
    constructor(sliderId, dotsId = null) {
        this.slider = document.getElementById(sliderId);
        if (!this.slider) return;

        this.wrapper = this.slider.querySelector('.slider-wrapper');
        this.slides = this.slider.querySelectorAll('.slider-slide');
        this.dotsContainer = dotsId ? document.getElementById(dotsId) : null;

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;

        this.init();
    }

    init() {
        if (!this.wrapper || this.totalSlides === 0) return;

        this.createDots();
        this.update();
        this.autoSlide();
    }

    createDots() {
        if (!this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                this.currentIndex = i;
                this.update();
            });
            this.dotsContainer.appendChild(dot);
        }
    }

    update() {
        this.wrapper.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
    }

    autoSlide() {
        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
            this.update();
        }, 4000);
    }
}

function initSocialProofDynamic() {
    const textEl = document.getElementById("socialText");
    const iconEl = document.getElementById("socialIcon");
    if (!textEl || !iconEl) return;

    const baseData = [
        {
            icon: "📩",
            label: "simulasi terkirim hari ini",
            min: 1200,
            max: 1500
        },
        {
            icon: "⏳",
            label: "pengajuan diproses hari ini",
            min: 150,
            max: 300
        },
        {
            icon: "✅",
            label: "pengajuan approved hari ini",
            min: 80,
            max: 150
        }
    ];

    let currentIndex = 0;

    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function formatNumber(num) {
        return num.toLocaleString("id-ID");
    }

    function typeWriter(text, callback) {
        let i = 0;
        textEl.textContent = "";

        function typing() {
            if (i < text.length) {
                textEl.textContent += text.charAt(i);
                i++;
                setTimeout(typing, 20);
            } else {
                if (callback) callback();
            }
        }

        typing();
    }

    function animateCount(target, label, icon) {
    let count = 0;
    const duration = 800;
    const stepTime = 20;
    const increment = Math.ceil(target / (duration / stepTime));

    iconEl.textContent = icon;

    const counter = setInterval(() => {
        count += increment;

        if (count >= target) {
            count = target;
            clearInterval(counter);

            // setelah angka full, lanjut ketik label
            typeWriter(` ${formatNumber(target)} ${label}`, () => {
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % baseData.length;
                    startCycle();
                }, 1800);
            });

        } else {
            // 🔥 tampilkan angka realtime saat count naik
            textEl.textContent = ` ${formatNumber(count)} ${label}`;
        }

    }, stepTime);
}

// =====================
// DOM READY
// =====================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.touchAction = "pan-y";
    populateTahun();
    updateMerkDropdown('mobil');
    initBPKBListener();
    initKecamatanSearch();
    initNopolUppercase();
    initWhatsAppForm();
    initScrollToForm();
    initMultiStepForm();
    initSocialProofDynamic();

    // 🔥 TAMBAHKAN INI LAGI
    new Slider('promoSlider', 'promoDots');
    new Slider('simSlider', 'simDots');
    new Slider('testiSlider');
});
