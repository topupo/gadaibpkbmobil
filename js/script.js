// --- DATA FOR DYNAMIC CONTENT ---

// Social Proof Data
const socialProofData = [
    { name: "Bapak Andi (Jakarta Selatan)", text: "baru saja cair", amount: "Rp 150 Juta" },
    { name: "Ibu Siti (Bekasi)", text: "disetujui unit", amount: "Avanza 2018" },
    { name: "Budi Santoso (Tangerang)", text: "dana cair", amount: "Rp 50 Juta" },
    { name: "Rina (Depok)", text: "pengajuan sukses", amount: "Tanpa Survei" },
    { name: "Ahmad (Bogor)", text: "cair tunai", amount: "Rp 85 Juta" }
];

// Kecamatan Data (Sample for Jabodetabek)
const kecamatanList = [
    "Batuceper", "Benda", "Cibodas", "Ciledug", "Cipondoh", "Jatiuwung", "Karangtengah", "Karawaci", "Larangan", "Neglasari", "Periuk", "Pinang", "Tangerang",
    "Beji", "Bojongsari", "Cilodong", "Cimanggis", "Cinere", "Cipayung", "Limo", "Pancoran Mas", "Sawangan", "Sukmajaya", "Tapos",
    "Bantar Gebang", "Bekasi Barat", "Bekasi Selatan", "Bekasi Timur", "Bekasi Utara", "Jatiasih", "Jatisampurna", "Medan Satria", "Mustika Jaya", "Pondok Gede", "Pondok Melati", "Rawalumbu",
    "Cengkareng", "Grogol Petamburan", "Taman Sari", "Tambora", "Kebon Jeruk", "Kalideres", "Palmerah", "Kembangan",
    "Cempaka Putih", "Gambir", "Johar Baru", "Kemayoran", "Menteng", "Sawah Besar", "Senen", "Tanah Abang",
    "Cilandak", "Jagakarsa", "Kebayoran Baru", "Kebayoran Lama", "Mampang Prapatan", "Pancoran", "Pasar Minggu", "Pesanggrahan", "Setiabudi", "Tebet",
    "Cakung", "Cipayung", "Ciracas", "Duren Sawit", "Jatinegara", "Kramat Jati", "Makasar", "Matraman", "Pasar Rebo", "Pulo Gadung",
    "Cilincing", "Kelapa Gading", "Koja", "Pademangan", "Penjaringan", "Tanjung Priok",
    "Babakan Madang", "Bojonggede", "Ciawi", "Cibinong", "Citeureup", "Gunung Putri", "Jonggol", "Parung", "Sukaraja", "Tajur Halang",
    "Balaraja", "Cikupa", "Cisauk", "Cisoka", "Gunung Kaler", "Jalancagak", "Kemiri", "Kosambi", "Kronjo", "Legok", "Pasar Kemis", "Pondok Aren", "Rajeg", "Sepatan", "Sepatan Timur", "Sindang Jaya", "Solear", "Teluknaga", "Tigaraksa"
];

// --- LOGIC ---

// Social Proof Slider Logic
function initSocialProof() {
    const container = document.getElementById('socialProof');
    let currentIndex = 0;

    function updateSocialProof() {
        const item = socialProofData[currentIndex];
        container.innerHTML = `
            <div class="social-proof-slide">
                <span>${item.name} ${item.text} <strong>${item.amount}</strong></span>
            </div>
        `;
        container.style.opacity = 0;
        setTimeout(() => {
            container.style.opacity = 1;
        }, 100);

        currentIndex = (currentIndex + 1) % socialProofData.length;
    }

    updateSocialProof();
    setInterval(updateSocialProof, 4000);
}

// Kecamatan Search Logic
function initKecamatanSearch() {
    setupSearch('kecamatanInput', 'kecamatanResults');
    setupSearch('kecamatanFormInput', 'kecamatanFormResults');
}

function setupSearch(inputId, resultsId) {
    const input = document.getElementById(inputId);
    const results = document.getElementById(resultsId);

    if (!input || !results) return;

    input.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        results.innerHTML = '';
        
        if (query.length < 3) {
            results.classList.remove('active');
            return;
        }

        const filtered = kecamatanList.filter(k => k.toLowerCase().includes(query));
        
        if (filtered.length > 0) {
            filtered.slice(0, 10).forEach(kec => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.textContent = kec;
                div.onclick = function() {
                    input.value = kec;
                    results.classList.remove('active');
                };
                results.appendChild(div);
            });
            results.classList.add('active');
        } else {
            results.classList.remove('active');
        }
    });

    // Close on click outside
    document.addEventListener('click', function(e) {
        if (e.target !== input && e.target !== results) {
            results.classList.remove('active');
        }
    });
}

// File Preview Logic
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            preview.src = e.target.result;
            preview.style.display = 'block';
            // Hide the icon/text behind it strictly or styled
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Lead Form Submission
document.getElementById('submissionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    
    // Simple Validation for required fields visual feedback
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
        alert('Form berhasil dikirim! Tim kami akan segera menghubungi Anda.');
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
        // Create dots only if container provided
        if (this.dotsContainer) {
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = i === 0 ? 'dot active' : 'dot';
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dotsContainer.appendChild(dot);
            }
        }

        // Touch Events
        this.wrapper.addEventListener('touchstart', (e) => this.touchStart(e));
        this.wrapper.addEventListener('touchmove', (e) => this.touchMove(e));
        this.wrapper.addEventListener('touchend', () => this.touchEnd());
        
        // AutoPlay
        this.startAutoPlay();
    }

    touchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        this.stopAutoPlay();
    }

    touchMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.touches[0].clientX;
    }

    touchEnd() {
        this.isDragging = false;
        const diff = this.startX - this.currentX;
        if (Math.abs(diff) > 50) { // Threshold
            if (diff > 0) this.nextSlide();
            else this.prevSlide();
        }
        this.startAutoPlay();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    updateSlider() {
        this.wrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
        }
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

// Vehicle Type Text Slider
class VehicleTextSlider {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
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

// Initialize sliders
document.addEventListener('DOMContentLoaded', () => {
    new Slider('promoSlider', 'promoDots');
    new Slider('simSlider', 'simDots');
    new Slider('testiSlider'); // No dots for testi slider
    new VehicleTextSlider('vehicleType'); // Vehicle type text slider
    initSocialProof();
    initKecamatanSearch();
});
