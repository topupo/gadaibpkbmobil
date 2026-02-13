// Data Merk Kendaraan
const merkKendaraan = {
    mobil: [
        // Jepang
        'Daihatsu', 'Honda', 'Isuzu', 'Mazda', 'Mitsubishi', 'Nissan', 'Suzuki', 'Toyota',
        // Korea
        'Hyundai', 'Kia',
        // Eropa
        'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Volvo',
        // China
        'Chery', 'DFSK', 'MG', 'Wuling'
    ],
    motor: [
        // Jepang only
        'Honda', 'Kawasaki', 'Suzuki', 'Yamaha'
    ],
    truk: [
        // Jepang
        'Daihatsu', 'Hino', 'Isuzu', 'Mitsubishi Fuso', 'Nissan', 'Toyota',
        // Korea
        'Hyundai',
        // Eropa
        'Mercedes-Benz', 'Scania', 'Volvo',
        // China
        'DFSK', 'Dongfeng', 'FAW', 'Foton', 'Howo', 'JAC', 'JMC', 'Shacman'
    ]
};

// Populate Tahun Dropdown (2005-2025)
function populateTahun() {
    const tahunSelect = document.getElementById('tahunKendaraan');
    const currentYear = 2025;
    const startYear = 2005;
    
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        tahunSelect.appendChild(option);
    }
}

// Update Merk Dropdown based on BPKB type
function updateMerkDropdown(type) {
    const merkSelect = document.getElementById('merkKendaraan');
    merkSelect.innerHTML = '<option value="">Pilih Merk</option>';
    
    const merks = merkKendaraan[type] || [];
    merks.forEach(merk => {
        const option = document.createElement('option');
        option.value = merk;
        option.textContent = merk;
        merkSelect.appendChild(option);
    });
}

        radio.addEventListener('change', function() {
            updateMerkDropdown(this.value);
        });
    });
});

// Form Validation & WhatsApp Integration
document.getElementById('pengajuanForm').addEventListener('submit', function(e) {
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
    
    if (isValid) {
        // Get form data
        const nama = this.querySelector('input[name="nama"]').value;
        const hp = this.querySelector('input[name="hp"]').value;
        const bpkb = this.querySelector('input[name="bpkb"]:checked').value;
        const merk = this.querySelector('select[name="merk"]').value;
        const tipe = this.querySelector('input[name="tipe"]').value;
        const tahun = this.querySelector('select[name="tahun"]').value;
        const provinsi = this.querySelector('select[name="provinsi"] option:checked').textContent;
        const kota = this.querySelector('select[name="kota"] option:checked').textContent;
        const kecamatan = this.querySelector('select[name="kecamatan"]').value;
        
        // Format WhatsApp message
        const message = `*PENGAJUAN FASILITAS DANA BPKB*%0A%0A` +
                      `📝 *Nama:* ${nama}%0A` +
                      `📞 *No. HP:* ${hp}%0A%0A` +
                      `🚗 *INFORMASI KENDARAAN*%0A` +
                      `Jenis: ${bpkb.charAt(0).toUpperCase() + bpkb.slice(1)}%0A` +
                      `Merk: ${merk}%0A` +
                      `Tipe: ${tipe}%0A` +
                      `Tahun: ${tahun}%0A%0A` +
                      `📍 *LOKASI*%0A` +
                      `Kecamatan: ${kecamatan}%0A` +
                      `Kota: ${kota}%0A` +
                      `Provinsi: ${provinsi}%0A%0A` +
                      `_Mohon konfirmasi untuk proses selanjutnya. Saya siap mengirim foto BPKB, STNK, dan kendaraan melalui WhatsApp. Terima kasih!_`;
        
        // WhatsApp number
        const waNumber = '6282299999036';
        
        // Redirect to WhatsApp
        window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
    } else {
        alert('Mohon lengkapi semua field yang wajib diisi.');
    }
});

// Slider Class (without dots for testi slider)
class Slider {
    constructor(containerId, dotsId = null) {
        this.container = document.getElementById(containerId);
        this.wrapper = this.container.querySelector('.slider-wrapper');
        this.slides = this.wrapper.querySelectorAll('.slider-slide');
        this.dotsContainer = dotsId ? document.getElementById(dotsId) : null;
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        // Create dots only if dotsContainer exists
        if (this.dotsContainer) {
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dotsContainer.appendChild(dot);
            }
            this.dots = this.dotsContainer.querySelectorAll('.slider-dot');
        }
        
        // Touch events
        this.wrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.wrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.wrapper.addEventListener('touchend', () => this.handleTouchEnd());
        
        // Mouse events
        this.wrapper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.wrapper.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.wrapper.addEventListener('mouseup', () => this.handleMouseUp());
        this.wrapper.addEventListener('mouseleave', () => this.handleMouseUp());
        
        // Auto play
        this.startAutoPlay();
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
        this.updateDots();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
        this.updateDots();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
        this.updateDots();
    }
    
    updateSlider() {
        this.wrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
    
    updateDots() {
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
        }
    }
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.stopAutoPlay();
    }
    
    handleTouchMove(e) {
        this.currentX = e.touches[0].clientX;
    }
    
    handleTouchEnd() {
        const diff = this.startX - this.currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
        this.startAutoPlay();
    }
    
    handleMouseDown(e) {
        this.startX = e.clientX;
        this.isDragging = true;
        this.stopAutoPlay();
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.clientX;
    }
    
    handleMouseUp() {
        if (!this.isDragging) return;
        this.isDragging = false;
        const diff = this.startX - this.currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
        this.startAutoPlay();
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Vehicle Type Text Slider (Hero Section)
class VehicleTextSlider {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;
        
        this.vehicles = ['Mobil', 'Motor', 'Truk'];
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        this.startAutoPlay();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.vehicles.length;
        this.element.textContent = this.vehicles[this.currentIndex];
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 3000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Social Proof Slider (Vertical) with auto-incrementing numbers
class SocialProofSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.wrapper = this.container.querySelector('.social-proof-wrapper');
        this.slides = this.wrapper.querySelectorAll('.social-proof-slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        
        // Base numbers
        this.baseSim = 456;
        this.baseProcess = 189;
        this.baseApprove = 99;
        
        this.init();
    }
    
    init() {
        this.startAutoPlay();
        this.startNumberIncrement();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    updateSlider() {
        this.wrapper.style.transform = `translateY(-${this.currentSlide * 32}px)`;
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 4000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // Auto increment numbers every 10 minutes
    startNumberIncrement() {
        setInterval(() => {
            this.baseSim++;
            this.baseProcess++;
            this.baseApprove++;
            
            // Update DOM
            const simEl = document.getElementById('simCount');
            const processEl = document.getElementById('processCount');
            const approveEl = document.getElementById('approveCount');
            
            if (simEl) simEl.textContent = this.baseSim;
            if (processEl) processEl.textContent = this.baseProcess;
            if (approveEl) approveEl.textContent = this.baseApprove;
        }, 600000); // 10 minutes = 600000 ms
    }
}

// Kecamatan Search List (Simple)
const kecamatanList = [
    "Cengkareng", "Grogol Petamburan", "Taman Sari", "Tambora", "Kebon Jeruk",
    "Kalideres", "Palmerah", "Kembangan", "Tanah Abang", "Menteng",
    "Senen", "Johar Baru", "Cempaka Putih", "Kemayoran", "Sawah Besar",
    "Gambir", "Pasar Rebo", "Ciracas", "Cipayung", "Makasar",
    "Kramat Jati", "Jatinegara", "Duren Sawit", "Cakung", "Pulo Gadung",
    "Matraman", "Koja", "Tanjung Priok", "Penjaringan", "Pademangan",
    "Kelapa Gading", "Cilincing", "Kebayoran Baru", "Kebayoran Lama", 
    "Pesanggrahan", "Cilandak", "Pancoran", "Jagakarsa", "Mampang Prapatan"
];

function initKecamatanSearch() {
    const searchInput = document.getElementById('kecamatanSearch');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.classList.remove('active');
            return;
        }
        
        const filtered = kecamatanList.filter(k => k.toLowerCase().includes(query));
        
        if (filtered.length > 0) {
            searchResults.innerHTML = filtered.slice(0, 5).map(k => 
                `<div class="search-result-item" data-value="${k}">${k}</div>`
            ).join('');
            searchResults.classList.add('active');
            
            // Add click handlers
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
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
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });
}

// WhatsApp Form Handler
function initWhatsAppForm() {
    const form = document.getElementById('pengajuanForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate required fields
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
        
        // Get form data
        const nama = this.querySelector('input[name="nama"]').value;
        const whatsapp = this.querySelector('input[name="whatsapp"]').value;
        const nopol = this.querySelector('input[name="nopol"]').value;
        const bpkb = this.querySelector('input[name="bpkb"]:checked').value;
        const atasnama = this.querySelector('input[name="atasnama"]:checked').value;
        const pengajuan = this.querySelector('input[name="pengajuan"]:checked').value;
        const merk = this.querySelector('select[name="merk"]').value;
        const tipe = this.querySelector('input[name="tipe"]').value;
        const tahun = this.querySelector('select[name="tahun"]').value;
        const kecamatan = this.querySelector('input[name="kecamatan"]').value;
        const nominal = this.querySelector('select[name="nominal"]').value;
        
        // Format WhatsApp message
        const message = `*PENGAJUAN FASILITAS DANA BPKB*%0A%0A` +
                      `👤 *Nama:* ${nama}%0A` +
                      `📱 *WhatsApp:* ${whatsapp}%0A` +
                      `🚗 *No. Plat:* ${nopol}%0A%0A` +
                      `*DETAIL KENDARAAN:*%0A` +
                      `📋 *Jenis:* ${bpkb.charAt(0).toUpperCase() + bpkb.slice(1)}%0A` +
                      `📝 *Atas Nama:* ${atasnama.charAt(0).toUpperCase() + atasnama.slice(1)}%0A` +
                      `🏷️ *Merk:* ${merk}%0A` +
                      `🔖 *Tipe:* ${tipe}%0A` +
                      `📅 *Tahun:* ${tahun}%0A%0A` +
                      `*PENGAJUAN:*%0A` +
                      `💼 *Jenis:* ${pengajuan.charAt(0).toUpperCase() + pengajuan.slice(1)}%0A` +
                      `💰 *Nominal:* ${nominal}%0A` +
                      `📍 *Domisili:* ${kecamatan}%0A%0A` +
                      `_Mohon proses lebih lanjut. Terima kasih!_`;
        
        // WhatsApp number
        const waNumber = '6282299999036';
        
        // Redirect to WhatsApp
        window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
    });
}

// Initialize all on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sliders
    new Slider('promoSlider', 'promoDots');
    new Slider('simSlider', 'simDots');
    new Slider('testiSlider'); // No dots for testi slider
    new VehicleTextSlider('vehicleSlider');
    new SocialProofSlider('socialProofSlider');
    
    // Initialize form
    populateTahun();
    updateMerkDropdown('mobil'); // Default to mobil
    initKecamatanSearch();
    initWhatsAppForm();
});
