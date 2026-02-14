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
// SIMPLE KECAMATAN INPUT (NO API, SMART PLACEHOLDER)
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
// FORM SUBMIT WITH PROPER CORS & USER FEEDBACK
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
            token: "X7mK29aPqL8zR4vBc9D2tY6wFh81JsQ"
        };

        // 5. SHOW LOADING STATE
        const submitBtn = this.querySelector('.btn-submit');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Mengirim data...';
        submitBtn.style.opacity = '0.7';

        try {
            // 6. SEND TO GOOGLE SHEETS (PROPER CORS - NO MORE no-cors!)
            const response = await fetch("https://script.google.com/macros/s/AKfycbw46m7cy8_UMf7Q5Q9n9897o_019MbUcvbeR67Wko0kgu4pr996eTPZi5DU7CUb51g5dg/exec", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(leadData)
            });

            const result = await response.json();

            // 7. HANDLE RESPONSE
            if (result.success) {
                // SUCCESS - Track conversions
                if (window.fbq) fbq('track', 'Lead');
                if (window.gtag) gtag('event', 'generate_lead');

                // Show success message based on status
                let successMsg = '✅ Data berhasil dikirim!';
                if (result.status === 'updated') {
                    successMsg = '✅ Data Anda berhasil diupdate!';
                }
                successMsg += '\n\nAnda akan diarahkan ke WhatsApp.';
                
                alert(successMsg);

                // 8. REDIRECT TO WHATSAPP
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

                // Reset form after short delay
                setTimeout(() => {
                    form.reset();
                    // Reset to step 1
                    if (typeof currentStep !== 'undefined') {
                        currentStep = 0;
                        if (typeof updateSlider === 'function') updateSlider();
                    }
                }, 1000);

            } else {
                // ERROR FROM SERVER
                throw new Error(result.error || 'Terjadi kesalahan di server');
            }

        } catch (error) {
            console.error('Submission error:', error);
            
            // SHOW USER-FRIENDLY ERROR MESSAGE
            let errorMsg = '❌ Gagal mengirim data.\n\n';
            
            if (error.message.includes('Too many requests') || error.message.includes('rate_limited')) {
                errorMsg += 'Anda terlalu sering mengirim pengajuan.\nMohon tunggu 1 menit sebelum mencoba lagi.';
            } else if (error.message.includes('Invalid token') || error.message.includes('forbidden')) {
                errorMsg += 'Sesi Anda telah berakhir.\nSilakan refresh halaman dan coba lagi.';
            } else if (error.message.includes('Missing required field')) {
                errorMsg += 'Ada field yang belum terisi.\nMohon lengkapi semua field yang wajib diisi.';
            } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                errorMsg += 'Koneksi internet bermasalah.\nCek koneksi Anda dan coba lagi.';
            } else if (error.message.includes('Invalid WhatsApp')) {
                errorMsg += 'Format nomor WhatsApp tidak valid.\nGunakan format: 08xxxxxxxxxx';
            } else {
                errorMsg += 'Silakan coba lagi atau hubungi admin jika masalah berlanjut.';
            }
            
            alert(errorMsg);

        } finally {
            // 9. RESTORE BUTTON STATE
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

    // 🔥 TAMBAHKAN INI LAGI
    new Slider('promoSlider', 'promoDots');
    new Slider('simSlider', 'simDots');
    new Slider('testiSlider');
}); 
