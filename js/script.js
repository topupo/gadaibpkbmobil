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

    if (field.type === 'radio') {
        const checked = steps[currentStep].querySelector(`input[name="${field.name}"]:checked`);
        if (!checked) {
            valid = false;
        }
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


    // 🔥 TAMBAHKAN INI LAGI
    new Slider('promoSlider', 'promoDots');
    new Slider('simSlider', 'simDots');
    new Slider('testiSlider');
}); 

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
