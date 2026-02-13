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
// KECAMATAN API - SELURUH INDONESIA
// =====================
let kecamatanData = [];
let dataLoaded = false;
let isLoading = false;

async function loadKecamatanData(forceReload = false) {
    if (isLoading) return;
    
    // Clear old cache if force reload
    if (forceReload) {
        localStorage.removeItem('kecamatanCache');
        localStorage.removeItem('kecamatanCacheTime');
        console.log('Cache cleared');
    }
    
    // Check cache first
    const cached = localStorage.getItem('kecamatanCache');
    const cacheTime = localStorage.getItem('kecamatanCacheTime');
    
    // Cache valid for 30 days
    if (cached && cacheTime && (Date.now() - parseInt(cacheTime) < 30 * 24 * 60 * 60 * 1000)) {
        try {
            kecamatanData = JSON.parse(cached);
            dataLoaded = true;
            console.log(`✓ Loaded ${kecamatanData.length} kecamatan from cache`);
            return;
        } catch (e) {
            console.error('Cache parse error, reloading...', e);
            localStorage.removeItem('kecamatanCache');
        }
    }
    
    isLoading = true;
    
    try {
        console.log('Loading kecamatan from API...');
        
        // Load all districts from API
        const response = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/districts.json');
        if (!response.ok) throw new Error('Failed to fetch districts');
        const districts = await response.json();
        
        // Load all regencies to get names
        const regResponse = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/regencies.json');
        if (!regResponse.ok) throw new Error('Failed to fetch regencies');
        const regencies = await regResponse.json();
        
        // Create lookup map for regencies
        const regencyMap = {};
        regencies.forEach(reg => {
            regencyMap[reg.id] = reg.name;
        });
        
        // Format data: "Kecamatan, Kabupaten/Kota"
        kecamatanData = districts.map(dist => {
            const regencyId = dist.regency_id;
            const regencyName = regencyMap[regencyId] || '';
            return {
                id: dist.id,
                name: dist.name,
                regency: regencyName,
                display: `${dist.name}, ${regencyName}`
            };
        });
        
        // Cache the data
        localStorage.setItem('kecamatanCache', JSON.stringify(kecamatanData));
        localStorage.setItem('kecamatanCacheTime', Date.now().toString());
        
        dataLoaded = true;
        isLoading = false;
        console.log(`✓ Loaded ${kecamatanData.length} kecamatan from API and cached`);
        
    } catch (error) {
        console.error('Error loading kecamatan data:', error);
        isLoading = false;
        
        // Fallback to comprehensive basic list if API fails
        kecamatanData = [
            {display: "Cengkareng, Jakarta Barat"},
            {display: "Grogol Petamburan, Jakarta Barat"},
            {display: "Taman Sari, Jakarta Barat"},
            {display: "Tambora, Jakarta Barat"},
            {display: "Kebon Jeruk, Jakarta Barat"},
            {display: "Menteng, Jakarta Pusat"},
            {display: "Tanah Abang, Jakarta Pusat"},
            {display: "Senen, Jakarta Pusat"},
            {display: "Kebayoran Baru, Jakarta Selatan"},
            {display: "Kebayoran Lama, Jakarta Selatan"},
            {display: "Tebet, Jakarta Selatan"},
            {display: "Pasar Minggu, Jakarta Selatan"},
            {display: "Kelapa Gading, Jakarta Utara"},
            {display: "Penjaringan, Jakarta Utara"},
            {display: "Pademangan, Jakarta Utara"},
            {display: "Bekasi Barat, Bekasi"},
            {display: "Bekasi Timur, Bekasi"},
            {display: "Bandung Wetan, Bandung"},
            {display: "Bandung Kulon, Bandung"},
            {display: "Surabaya, Surabaya"}
        ];
        dataLoaded = true;
        console.log('Using fallback data');
    }
}

function initKecamatanSearch() {
    const searchInput = document.getElementById('kecamatanSearch');
    const searchResults = document.getElementById('searchResults');
    if (!searchInput || !searchResults) return;
    
    // Load data on first focus with force reload to clear old cache
    let loadAttempted = false;
    searchInput.addEventListener('focus', async function() {
        if (!loadAttempted) {
            loadAttempted = true;
            this.placeholder = 'Loading data...';
            this.disabled = true;
            
            // Force reload to clear any old cache
            await loadKecamatanData(true);
            
            this.disabled = false;
            this.placeholder = 'Cari kecamatan...';
            
            // Show ready message
            if (dataLoaded) {
                searchResults.innerHTML = `<div class="search-result-item" style="color: green;">✓ ${kecamatanData.length} kecamatan siap dicari</div>`;
                searchResults.classList.add('active');
                setTimeout(() => {
                    searchResults.classList.remove('active');
                }, 2000);
            }
        }
    });

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();

        if (!query) {
            searchResults.classList.remove('active');
            return;
        }
        
        if (!dataLoaded || isLoading) {
            searchResults.innerHTML = '<div class="search-result-item">⏳ Loading data...</div>';
            searchResults.classList.add('active');
            return;
        }

        // Search in both kecamatan name and kabupaten/kota name
        const filtered = kecamatanData.filter(k => 
            k.display.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
            const resultCount = filtered.length;
            const showing = Math.min(resultCount, 10);
            
            searchResults.innerHTML = 
                `<div class="search-result-item" style="background: #f0f0f0; font-weight: bold; font-size: 11px;">Showing ${showing} of ${resultCount} results</div>` +
                filtered.slice(0, 10).map(k => 
                    `<div class="search-result-item" data-value="${k.display}">${k.display}</div>`
                ).join('');

            searchResults.classList.add('active');

            searchResults.querySelectorAll('.search-result-item[data-value]')
                .forEach(item => {
                    item.addEventListener('click', function() {
                        searchInput.value = this.dataset.value;
                        searchResults.classList.remove('active');
                    });
                });

        } else {
            searchResults.innerHTML = '<div class="search-result-item">❌ Tidak ditemukan</div>';
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

    // Base numbers that will ALWAYS INCREMENT (realistic!)
    const stats = {
        simulasi: 1247,    // Starting point
        pengajuan: 189,    // Starting point
        approved: 103      // Starting point
    };

    const baseData = [
        { icon: "📩", label: "simulasi terkirim hari ini", key: "simulasi", incrementRange: [3, 8] },
        { icon: "⏳", label: "pengajuan diproses hari ini", key: "pengajuan", incrementRange: [1, 4] },
        { icon: "✅", label: "pengajuan approved hari ini", key: "approved", incrementRange: [1, 3] }
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
    initKecamatanSearch();
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
