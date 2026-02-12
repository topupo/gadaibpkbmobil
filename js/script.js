// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
    });
});

// Slider Class
class Slider {
    constructor(sliderId, dotsId = null) {
        this.container = document.getElementById(sliderId);
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
        if (this.dotsContainer) {
            this.createDots();
        }
        this.addEventListeners();
        this.startAutoPlay();
    }
    
    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
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
    
    addEventListeners() {
        // Touch events
        this.wrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.wrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.wrapper.addEventListener('touchend', () => this.handleTouchEnd());
        
        // Mouse events
        this.wrapper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.wrapper.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.wrapper.addEventListener('mouseup', () => this.handleMouseUp());
        this.wrapper.addEventListener('mouseleave', () => this.handleMouseUp());
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

// Social Proof Slider (Vertical) with auto-incrementing numbers
class SocialProofSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
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

// Kecamatan Search
const kecamatanList = [
    "Cengkareng", "Grogol Petamburan", "Taman Sari", "Tambora", "Kebon Jeruk",
    "Kalideres", "Palmerah", "Kembangan", "Tanah Abang", "Menteng",
    "Senen", "Johar Baru", "Cempaka Putih", "Kemayoran", "Sawah Besar",
    "Gambir", "Pasar Rebo", "Ciracas", "Cipayung", "Makasar",
    "Kramat Jati", "Jatinegara", "Duren Sawit", "Cakung", "Pulo Gadung",
    "Matraman", "Koja", "Tanjung Priok", "Penjaringan", "Pademangan",
    "Kelapa Gading", "Cilincing", "Sukapura", "Rorotan", "Marunda",
    "Warakas", "Cipinang", "Jatinegara Kaum", "Pondok Bambu", "Duren Sawit",
    "Bambu Apus", "Ceger", "Ciracas", "Susukan", "Balekambang",
    "Pekayon", "Rawamangun", "Pisangan Baru", "Utan Kayu", "Kayu Putih",
    "Pulo Gebang", "Ujung Menteng", "Cakung Barat", "Cakung Timur", "Jatinegara",
    "Kebayoran Baru", "Kebayoran Lama", "Pesanggrahan", "Bintaro", "Pondok Aren",
    "Ciputat", "Ciputat Timur", "Pamulang", "Pondok Cabe Ilir", "Serpong",
    "Serpong Utara", "Setu", "Cisauk", "Cisoka", "Curug",
    "Kelapa Dua", "Legok", "Pagedangan", "Pakuhaji", "Panongan",
    "Sukadiri", "Sukamulya", "Teluknaga", "Kresek", "Kronjo",
    "Mauk", "Mekar Baru", "Sindang Jaya", "Solear", "Sukatani",
    "Tigaraksa", "Jambe", "Ciomas", "Cisoka", "Gunung Kaler",
    "Jalancagak", "Kemiri", "Kosambi", "Kronjo", "Legok",
    "Pasar Kemis", "Pondok Aren", "Rajeg", "Sepatan", "Sepatan Timur",
    "Sindang Jaya", "Solear", "Sukadiri", "Sukamulya", "Teluknaga",
    "Tigaraksa", "Balaraja", "Cikupa", "Cisauk", "Cisoka",
    "Curug", "Gunung Kaler", "Jambe", "Jayanti", "Kelapa Dua",
    "Kemiri", "Kosambi", "Kresek", "Kronjo", "Labuan",
    "Mauk", "Mekar Baru", "Pagedangan", "Pakuhaji", "Panongan",
    "Pasar Kemis", "Rajeg", "Sepatan", "Sepatan Timur", "Sindang Jaya",
    "Sukatani", "Tigaraksa", "Balaraja", "Cikupa", "Cisauk",
    "Curug", "Gunung Kaler", "Jambe", "Jayanti", "Kelapa Dua",
    "Kemiri", "Kosambi", "Kresek", "Kronjo", "Labuan",
    "Mauk", "Mekar Baru", "Pagedangan", "Pakuhaji", "Panongan"
];

function initKecamatanSearch() {
    const searchInput = document.getElementById('kecamatanSearch');
    const searchResults = document.getElementById('searchResults');
    
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

// Initialize sliders
document.addEventListener('DOMContentLoaded', () => {
    new Slider('promoSlider', 'promoDots');
    new Slider('simSlider', 'simDots');
    new Slider('testiSlider'); // No dots for testi slider
    new VehicleTextSlider('vehicleSlider'); // Vehicle type text slider
    new SocialProofSlider('socialProofSlider');
    initKecamatanSearch();
});
