/* =========================================
   LOGIC SESUAI BENCHMARK INDEXX.HTML
   ========================================= */

// 1. CLASS SLIDER (Support Dots & AutoPlay)
class Slider {
    constructor(elementId, dotsId = null, autoPlay = true) {
        this.container = document.getElementById(elementId);
        if(!this.container) return; // Safety check
        
        this.track = this.container.querySelector('.slider-track');
        this.slides = this.track.children;
        this.total = this.slides.length;
        this.index = 0;
        this.dotsContainer = dotsId ? document.getElementById(dotsId) : null;
        
        if(this.dotsContainer) this.initDots();
        if(autoPlay) this.startAutoPlay();
        
        // Add Swipe Support for Mobile
        this.touchStartX = 0;
        this.container.addEventListener('touchstart', e => this.touchStartX = e.changedTouches[0].screenX);
        this.container.addEventListener('touchend', e => {
            if (e.changedTouches[0].screenX < this.touchStartX - 50) this.next();
            if (e.changedTouches[0].screenX > this.touchStartX + 50) this.prev();
        });
    }

    initDots() {
        this.dotsContainer.innerHTML = '';
        for(let i=0; i<this.total; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateDots() {
        if(!this.dotsContainer) return;
        const dots = this.dotsContainer.children;
        for(let d of dots) d.classList.remove('active');
        if(dots[this.index]) dots[this.index].classList.add('active');
    }

    goTo(index) {
        this.index = (index + this.total) % this.total;
        this.track.style.transform = `translateX(-${this.index * 100}%)`;
        this.updateDots();
    }

    next() { this.goTo(this.index + 1); }
    prev() { this.goTo(this.index - 1); }
    startAutoPlay() { setInterval(() => this.next(), 4000); }
}

// 2. CLASS VEHICLE TEXT (Vertical Slide)
class VehicleTextSlider {
    constructor(elementId) {
        this.el = document.getElementById(elementId);
        if(!this.el) return;
        
        this.texts = ["Sedan", "SUV", "MPV", "Pick Up", "Truck", "Motor"];
        this.index = 0;
        // Text awal sudah ada di HTML, kita override/start loop
        this.start();
    }
    
    start() {
        setInterval(() => {
            this.el.style.transform = 'translateY(120%)'; // Slide Out Down
            setTimeout(() => {
                this.index = (this.index + 1) % this.texts.length;
                this.el.innerText = this.texts[this.index];
                this.el.style.transform = 'translateY(-120%)'; // Prep Top
                setTimeout(() => {
                    this.el.style.transform = 'translateY(0)'; // Slide In
                }, 50);
            }, 500);
        }, 2500);
    }
}

// 3. CLASS SOCIAL PROOF (Fade)
class SocialProofSlider {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
        if(!this.container) return;

        this.data = [
            "Bapak Andi (Jaksel) baru saja cair Rp 150 Juta",
            "Ibu Rina (Bogor) disetujui unit Avanza 2018",
            "Pencairan Rp 50 Juta sukses ke rek BCA a/n Budi",
            "Unit Innova Reborn 2019 berhasil di-takedown"
        ];
        this.index = 0;
        this.render();
        this.start();
    }

    render() {
        this.container.innerHTML = '';
        this.data.forEach((text, i) => {
            const div = document.createElement('div');
            div.className = 'proof-item' + (i === 0 ? ' active' : '');
            div.innerText = text;
            this.container.appendChild(div);
        });
        this.items = this.container.querySelectorAll('.proof-item');
    }

    start() {
        setInterval(() => {
            this.items[this.index].classList.remove('active');
            this.index = (this.index + 1) % this.data.length;
            this.items[this.index].classList.add('active');
        }, 3500);
    }
}

// 4. FUNCTION KECAMATAN SEARCH
function initKecamatanSearch() {
    const searchInput = document.getElementById('kecamatanInput');
    const searchResults = document.getElementById('kecamatanResults');
    if(!searchInput || !searchResults) return;

    const kecamatans = [
        "Tebet, Jakarta Selatan", "Kebayoran Baru, Jakarta Selatan", "Pasar Minggu, Jakarta Selatan",
        "Gambir, Jakarta Pusat", "Tanah Abang, Jakarta Pusat", "Menteng, Jakarta Pusat",
        "Kelapa Gading, Jakarta Utara", "Penjaringan, Jakarta Utara",
        "Kebon Jeruk, Jakarta Barat", "Cengkareng, Jakarta Barat",
        "Bekasi Barat", "Bekasi Timur", "Serpong, Tangerang", "Ciputat, Tangerang Selatan"
    ];
    
    searchInput.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        searchResults.innerHTML = '';
        
        if (val.length < 3) {
            searchResults.classList.remove('active');
            return;
        }

        const filtered = kecamatans.filter(k => k.toLowerCase().includes(val));
        
        if (filtered.length > 0) {
            searchResults.innerHTML = filtered.slice(0, 5).map(k => 
                `<div class="search-result-item" data-value="${k}">${k}</div>`
            ).join('');
            searchResults.classList.add('active');
            
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
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });
}

// INIT ALL
document.addEventListener('DOMContentLoaded', () => {
    new Slider('promoSlider', 'promoDots');
    new Slider('simSlider', 'simDots'); // PENTING: Sesuai ID benchmark
    new Slider('testiSlider'); 
    new VehicleTextSlider('vehicleSlider'); // PENTING: Sesuai ID benchmark
    new SocialProofSlider('socialProofSlider');
    initKecamatanSearch();
});
