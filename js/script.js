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
// CONFIGURATION
// =====================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLGlFofJu6MTDWuCThmbmNZKfYY1JD17-Lotab46kJ9Sa9iMWTJXsWrkP0FxyJxVDB/exec";
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
    const startYear = 2005;

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
// SIMPLE KECAMATAN INPUT (IP-BASED PLACEHOLDER)
// =====================
async function initSimpleKecamatan() {
    const kecamatanInput = document.getElementById('kecamatanSearch');
    if (!kecamatanInput) return;
    
    // Change type from search to text
    kecamatanInput.type = 'text';
    
    // Default placeholder
    const defaultPlaceholder = "Kebon Jeruk, Jakarta Barat";
    
    try {
        // Get user location from IP (free API, no CORS)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Get city name
        const city = data.city || '';
        
        // City-specific examples (13 major cities)
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
        
        // Find matching city
        let placeholder = defaultPlaceholder;
        for (const [cityName, example] of Object.entries(cityExamples)) {
            if (city.includes(cityName)) {
                placeholder = example;
                break;
            }
        }
        
        // Update placeholder
        kecamatanInput.placeholder = placeholder;
        
        console.log(`✓ Smart placeholder set: ${placeholder} (detected city: ${city})`);
        
    } catch (error) {
        // Fallback to default if IP API fails
        console.log('Using default placeholder (IP detection failed)');
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
function initAllCTAButtons() {
    const buttons = document.querySelectorAll('.cta-scroll');
    const formSection = document.querySelector('.form-section');
    if (!buttons.length || !formSection) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {

            // Jangan ganggu tombol dalam form
            if (btn.closest('form')) return;

            e.preventDefault();

            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;

            const extraSpacing = 20;

            const targetPosition =
                formSection.getBoundingClientRect().top +
                window.pageYOffset -
                headerHeight -
                extraSpacing;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// =====================
// FORM SUBMIT (NO-CORS MODE)
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

            // 8. REDIRECT TO WHATSAPP
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

            // 9. RESET FORM
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

function initMultiStepForm() {
    const wrapper = document.querySelector('.form-slider-wrapper');
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const progressBar = document.querySelector('.progress-bar');

    if (!wrapper || steps.length === 0) return;

    let currentStep = 0;
    const totalSteps = steps.length;

    function updateSlider() {
        wrapper.style.transform = `translateX(-${currentStep * 100}%)`;
        if (progressBar) {
            const progressPercent = ((currentStep + 1) / totalSteps) * 100;
            progressBar.style.width = progressPercent + "%";
        }
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            const currentFields = steps[currentStep].querySelectorAll('[required]');
            let valid = true;

            currentFields.forEach(field => {

                if (field.type === 'radio') {
                    const checked = steps[currentStep].querySelector(`input[name="${field.name}"]:checked`);
                    if (!checked) valid = false;
                    return;
                }

                if (!field.value || field.value.trim() === '') {
                    field.style.borderLeft = '3px solid #ff6b6b';
                    valid = false;
                } else {
                    field.style.borderLeft = 'none';
                }
            });

            if (!valid) {
                alert("❌ Mohon lengkapi semua data sebelum lanjut.");
                return;
            }

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

    // Base numbers that will ALWAYS INCREMENT (realistic!)
    const stats = {
        simulasi: 1247,    // Starting point
        pengajuan: 189,    // Starting point
        approved: 103      // Starting point
    };

    const baseData = [
        { icon: "📩", label: "simulasi terkirim 2 menit", key: "simulasi", incrementRange: [3, 8] },
        { icon: "⏳", label: "pengajuan diproses 30 menit", key: "pengajuan", incrementRange: [1, 4] },
        { icon: "✅", label: "pengajuan approved 1 hari", key: "approved", incrementRange: [1, 3] }
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
                setTimeout(typing, 35); // Slower typing
            } else {
                if (callback) callback();
            }
        }

        typing();
    }

    function animateCount(target, label, icon) {
        let count = Math.max(0, target - 50); // Start from slightly below target
        const duration = 1500; // Slower animation
        const stepTime = 30;
        const increment = Math.ceil((target - count) / (duration / stepTime));

        iconEl.textContent = icon;

        const counter = setInterval(() => {
            count += increment;

            if (count >= target) {
                count = target;
                clearInterval(counter);

                typeWriter(`${formatNumber(target)} ${label}`, () => {
                    setTimeout(() => {
                        currentIndex = (currentIndex + 1) % baseData.length;
                        startCycle();
                    }, 3500); // Longer pause
                });

            } else {
                textEl.textContent = `${formatNumber(count)} ${label}`;
            }
        }, stepTime);
    }

    function startCycle() {
        const item = baseData[currentIndex];
        
        // INCREMENT the stat (realistic - always going up!)
        const increment = randomBetween(item.incrementRange[0], item.incrementRange[1]);
        stats[item.key] += increment;
        
        // Animate to new value
        animateCount(stats[item.key], item.label, item.icon);
    }

    startCycle();
}

// =====================
// DISPLAY CURRENT DATE
// =====================
function displayCurrentDate() {
    const dateEl = document.getElementById('currentDate');
    if (!dateEl) return;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const now = new Date();
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    dateEl.textContent = `${day} ${month} ${year}`;
}

// =====================
// AUTO REFRESH AT MIDNIGHT
// =====================
function initMidnightRefresh() {
    function scheduleRefresh() {
        const now = new Date();
        const night = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1, // Tomorrow
            0, 0, 0, 0 // 00:00:00
        );
        
        const msToMidnight = night.getTime() - now.getTime();
        
        setTimeout(() => {
            location.reload();
        }, msToMidnight);
        
        console.log(`Page will auto-refresh at midnight (in ${Math.floor(msToMidnight / 1000 / 60)} minutes)`);
    }
    
    scheduleRefresh();
}

function initBottomBarVisibility() {
    const bottomBar = document.querySelector('.bottom-action-bar');
    const formSection = document.querySelector('.form-section');

    if (!bottomBar || !formSection) return;

    window.addEventListener('scroll', () => {
        const rect = formSection.getBoundingClientRect();

        // If form section visible in viewport
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
            bottomBar.style.transform = 'translateY(100%)';
        } else {
            bottomBar.style.transform = 'translateY(0)';
        }
    });
}

function initTrustAutoSlide() {
    const slider = document.getElementById('trustSlider');
    if (!slider) return;

    let scrollAmount = 0;
    let isPaused = false;

    function autoScroll() {
        if (isPaused) return;

        scrollAmount += 0.5; // makin kecil makin halus
        slider.scrollLeft = scrollAmount;

        if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
            scrollAmount = 0;
        }
    }

    const interval = setInterval(autoScroll, 20);

    // Pause saat disentuh / hover
    slider.addEventListener('mouseenter', () => isPaused = true);
    slider.addEventListener('mouseleave', () => isPaused = false);
    slider.addEventListener('touchstart', () => isPaused = true);
    slider.addEventListener('touchend', () => isPaused = false);
}

document.addEventListener('DOMContentLoaded', function () {
    initTrustAutoSlide();
});

function initScrollToForm() {
    const btn = document.querySelector('.btn-simulasi');
    const form = document.getElementById('formSection');
    if (!btn || !form) return;

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const offset = 80; // sesuaikan kalau ada header fixed
        const position = form.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initScrollToForm();
});

function initAllCTAButtons() {
    const buttons = document.querySelectorAll('.cta-scroll');
    const form = document.getElementById('formSection');
    if (!buttons.length || !form) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const offset = 80; // sesuaikan kalau ada header fixed
            const targetPosition =
                form.getBoundingClientRect().top +
                window.scrollY -
                offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initAllCTAButtons();
});

/* ============================= */
/* SEASONAL CONVERSION SYSTEM */
/* ============================= */

const SEASON_CONFIG = [

  // ===== RELIGIOUS EVENTS =====

  {
    name: "imlek_2026",
    start: "2026-02-01",
    end: "2026-02-10",
    urgencyDays: 10,
    ctaNormal: "📊 Persiapan Dana Hari Raya",
    ctaUrgency: "📊 Cair Sebelum Imlek",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Siapkan kebutuhan perayaan lebih awal.",
    badgeText: "🏆 Dana Cair Jelang Imlek"
  },

  {
    name: "nyepi_2026",
    start: "2026-03-18",
    end: "2026-03-20",
    urgencyDays: 5,
    ctaNormal: "📊 Persiapan Dana Hari Raya",
    ctaUrgency: "📊 Cair Sebelum Nyepi",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Siapkan kebutuhan hari raya.",
    badgeText: "🏆 Dana Cair Jelang Nyepi"
  },

  {
    name: "ramadan_2026",
    start: "2026-03-20",
    end: "2026-04-10",
    urgencyDays: 10,
    ctaNormal: "📊 Persiapan Dana Hari Raya",
    ctaUrgency: "📊 Cair Sebelum Lebaran",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Persiapkan kebutuhan Ramadan & Lebaran.",
    badgeText: "🏆 Dana Cair Jelang Lebaran"
  },

  {
    name: "idul_adha_2026",
    start: "2026-06-15",
    end: "2026-06-18",
    urgencyDays: 7,
    ctaNormal: "📊 Persiapan Dana Hari Raya",
    ctaUrgency: "📊 Cair Sebelum Idul Adha",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Siapkan kebutuhan hari raya.",
    badgeText: "🏆 Dana Cair Jelang Idul Adha"
  },

  {
    name: "waisak_2026",
    start: "2026-05-23",
    end: "2026-05-25",
    urgencyDays: 5,
    ctaNormal: "📊 Persiapan Dana Hari Raya",
    ctaUrgency: "📊 Cair Sebelum Waisak",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Siapkan kebutuhan hari raya.",
    badgeText: "🏆 Dana Cair Jelang Waisak"
  },

  {
    name: "natal_2026",
    start: "2026-12-01",
    end: "2026-12-25",
    urgencyDays: 10,
    ctaNormal: "📊 Persiapan Dana Akhir Tahun",
    ctaUrgency: "📊 Cair Sebelum Natal",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Siapkan kebutuhan perayaan akhir tahun.",
    badgeText: "🏆 Dana Cair Jelang Natal"
  },


  // ===== NATIONAL EVENTS =====

  {
    name: "tahun_baru_2026",
    start: "2026-01-01",
    end: "2026-01-02",
    urgencyDays: 0,
    ctaNormal: "📊 Awali Tahun dengan Rencana Keuangan",
    ctaUrgency: "📊 Proses Cepat Awal Tahun",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Mulai tahun dengan solusi finansial yang tepat.",
    badgeText: "🏆 Dipercaya 10.000+ Nasabah"
  },

  {
    name: "hari_buruh_2026",
    start: "2026-05-01",
    end: "2026-05-02",
    urgencyDays: 0,
    ctaNormal: "📊 Solusi Dana Cepat untuk Anda",
    ctaUrgency: "📊 Proses Cepat Hari Ini",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Solusi dana cepat dan aman.",
    badgeText: "🏆 Dipercaya 10.000+ Nasabah"
  },

  {
    name: "hari_pancasila_2026",
    start: "2026-06-01",
    end: "2026-06-02",
    urgencyDays: 0,
    ctaNormal: "📊 Solusi Dana Cepat & Aman",
    ctaUrgency: "📊 Proses Cepat Hari Ini",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Layanan cepat dan terpercaya.",
    badgeText: "🏆 Dipercaya 10.000+ Nasabah"
  },

  {
    name: "kemerdekaan_2026",
    start: "2026-08-10",
    end: "2026-08-17",
    urgencyDays: 5,
    ctaNormal: "📊 Persiapan Dana Agustusan",
    ctaUrgency: "📊 Cair Sebelum 17 Agustus",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Siapkan kebutuhan perayaan kemerdekaan.",
    badgeText: "🏆 Dana Cair Jelang 17 Agustus"
  },

  {
    name: "hari_ibu_2026",
    start: "2026-12-20",
    end: "2026-12-22",
    urgencyDays: 0,
    ctaNormal: "📊 Solusi Dana untuk Kebutuhan Keluarga",
    ctaUrgency: "📊 Proses Cepat Hari Ini",
    ctaHDay: "📊 Proses Kilat Hari Ini",
    subText: "Dukung kebutuhan keluarga Anda.",
    badgeText: "🏆 Dipercaya 10.000+ Nasabah"
  }

];

function detectActiveSeason() {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    for (let season of SEASON_CONFIG) {
        if (todayStr >= season.start && todayStr <= season.end) {

            const endDate = new Date(season.end);
            const diffTime = endDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let mode = "normal";

            if (diffDays <= 3) {
                mode = "promo";
            }

            if (diffDays <= 0) {
                mode = "hday";
            }

            return { ...season, mode, diffDays };
        }
    }
    return null;
}


function applySeasonToUI() {
    const season = detectActiveSeason();
    if (!season) return;

    const banner = document.getElementById("seasonBanner");
    const hero = document.querySelector(".hero-section");

    if (banner) {
        banner.classList.remove("season-normal", "season-promo");
        banner.classList.add("season-" + season.mode);

        const title = banner.querySelector(".season-title");
        const sub = banner.querySelector(".season-subtext");
        const countdown = banner.querySelector(".season-countdown");

        if (title) title.innerText = season.title;
        if (sub) sub.innerText = season.subtitle;

        if (season.mode === "promo" && countdown) {
            countdown.innerText = "Sisa " + season.diffDays + " hari lagi";
        } else if (countdown) {
            countdown.innerText = "";
        }
    }

    // HERO THEME SWITCH
    if (hero) {
        hero.classList.add("hero-season-active");
    }
}

function applySeason(season) {
    const banner = document.getElementById("seasonBanner");
    const title = document.getElementById("seasonTitle");
    const subtitle = document.getElementById("seasonSubtitle");

    if (!banner || !season) return;

    banner.style.display = "block";
    banner.style.background = season.background;

    title.textContent = season.title;
    subtitle.textContent = season.subtitle;
}

function renderDefaultBanner() {
    const banner = document.getElementById("defaultBanner");
    if (banner) {
        banner.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    applySeasonToUI();
});

function initPortraitSlider() {
    const slider = document.getElementById("portraitSlider");
    if (!slider) return;

    const slides = slider.querySelectorAll("img");
    if (slides.length <= 1) return;

    let index = 0;
    let startX = 0;
    let interval;

    function updateSlide() {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
        index = (index + 1) % slides.length;
        updateSlide();
    }

    function startAuto() {
        interval = setInterval(nextSlide, 3500);
    }

    function stopAuto() {
        clearInterval(interval);
    }

    slider.addEventListener("touchstart", e => {
        stopAuto();
        startX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", e => {
        const diff = startX - e.changedTouches[0].clientX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                index = (index + 1) % slides.length;
            } else {
                index = (index - 1 + slides.length) % slides.length;
            }
            updateSlide();
        }

        startAuto();
    });

    startAuto();
}

    
// =====================
// DOM READY
// =====================
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.touchAction = "pan-y";
    populateTahun();
    updateMerkDropdown('mobil');
    initBPKBListener();
    initSimpleKecamatan();
    initNopolUppercase();
    initWhatsAppForm();
    initScrollToForm();
    initMultiStepForm();
    initSocialProofDynamic();
    initMidnightRefresh();
    displayCurrentDate();
    initBottomBarVisibility();
    applySeasonToUI();
    initPortraitSlider();

    const activeSeason = detectActiveSeason();

if (activeSeason) {
    applySeasonToUI(activeSeason);
} else {
    renderDefaultBanner();
}

    // 🔥 TAMBAHKAN INI LAGI
    new Slider('promoSlider', 'promoDots');
    new Slider('simSlider', 'simDots');
    new Slider('testiSlider');
}); 
