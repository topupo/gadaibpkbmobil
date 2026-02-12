/* --- SLIDER LOGIC --- */
class Slider {
    constructor(wrapperId, dotsId, autoPlay = true) {
        this.wrapper = document.querySelector(`#${wrapperId} .slider-wrapper`);
        this.dotsContainer = document.getElementById(dotsId);
        this.slides = this.wrapper.children;
        this.total = this.slides.length;
        this.index = 0;
        
        if(this.dotsContainer) this.initDots();
        if(autoPlay) setInterval(() => this.next(), 4000);

        // Basic Swipe
        let startX = 0;
        this.wrapper.addEventListener('touchstart', e => startX = e.touches[0].clientX);
        this.wrapper.addEventListener('touchend', e => {
            if(startX - e.changedTouches[0].clientX > 50) this.next();
            if(e.changedTouches[0].clientX - startX > 50) this.prev();
        });
    }

    initDots() {
        this.dotsContainer.innerHTML = '';
        for(let i=0; i<this.total; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i===0 ? ' active' : '');
            dot.onclick = () => this.goTo(i);
            this.dotsContainer.appendChild(dot);
        }
    }

    update() {
        this.wrapper.style.transform = `translateX(-${this.index * 100}%)`;
        if(this.dotsContainer) {
            Array.from(this.dotsContainer.children).forEach((d, i) => {
                d.classList.toggle('active', i === this.index);
            });
        }
    }

    goTo(i) {
        this.index = (i + this.total) % this.total;
        this.update();
    }

    next() { this.goTo(this.index + 1); }
    prev() { this.goTo(this.index - 1); }
}

/* --- SOCIAL PROOF & VEHICLE TEXT --- */
const socialTexts = [
    "Bapak Andi (Jaksel) baru cair Rp 150 Juta",
    "Pencairan Rp 50 Juta sukses ke rek BCA a/n Budi",
    "Ibu Rina (Bogor) disetujui unit Avanza 2018",
    "Dana Pendidikan cair 100% tanpa potongan"
];

const vehicleTexts = ["Sedan", "SUV", "MPV", "Pick Up", "Truck", "Motor"];

function initTextSliders() {
    // Social Proof
    const proofContainer = document.getElementById('socialProof');
    let proofIdx = 0;
    
    // Render first
    proofContainer.innerHTML = `<div class="social-proof-slide"><span>${socialTexts[0]}</span></div>`;
    
    setInterval(() => {
        proofIdx = (proofIdx + 1) % socialTexts.length;
        proofContainer.innerHTML = `<div class="social-proof-slide"><span>${socialTexts[proofIdx]}</span></div>`;
    }, 3000);

    // Vehicle Type
    const vehicleContainer = document.getElementById('vehicleType');
    let vehicleIdx = 0;
    vehicleContainer.innerText = vehicleTexts[0];
    
    setInterval(() => {
        vehicleIdx = (vehicleIdx + 1) % vehicleTexts.length;
        vehicleContainer.innerText = vehicleTexts[vehicleIdx];
    }, 2000);
}

/* --- KECAMATAN SEARCH --- */
const kecamatans = [
    "Tebet, Jakarta Selatan", "Kebayoran Baru, Jakarta Selatan", "Pasar Minggu, Jakarta Selatan",
    "Gambir, Jakarta Pusat", "Tanah Abang, Jakarta Pusat", "Menteng, Jakarta Pusat",
    "Kelapa Gading, Jakarta Utara", "Penjaringan, Jakarta Utara",
    "Kebon Jeruk, Jakarta Barat", "Cengkareng, Jakarta Barat",
    "Bekasi Barat", "Bekasi Timur", "Serpong, Tangerang", "Ciputat, Tangerang Selatan"
];

function initSearch() {
    const input = document.getElementById('kecamatanInput');
    const results = document.getElementById('kecamatanResults');
    
    input.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        results.innerHTML = '';
        if(val.length < 3) { results.classList.remove('active'); return; }
        
        const matches = kecamatans.filter(k => k.toLowerCase().includes(val));
        if(matches.length) {
            results.innerHTML = matches.slice(0,5).map(m => `<div class="search-result-item">${m}</div>`).join('');
            results.classList.add('active');
            
            results.querySelectorAll('.search-result-item').forEach(item => {
                item.onclick = () => {
                    input.value = item.innerText;
                    results.classList.remove('active');
                }
            });
        } else {
            results.classList.remove('active');
        }
    });
    
    document.addEventListener('click', e => {
        if(!e.target.closest('.search-container')) results.classList.remove('active');
    });
}

/* --- FORM HANDLING --- */
function previewImage(input, imgId) {
    const preview = document.getElementById(imgId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmit');
    const originalText = btn.innerText;
    
    btn.innerText = "MENGIRIM...";
    btn.disabled = true;
    
    setTimeout(() => {
        alert("Terima kasih! Data Anda berhasil dikirim.");
        btn.innerText = originalText;
        btn.disabled = false;
        e.target.reset();
    }, 1500);
}

// Initialize All
document.addEventListener('DOMContentLoaded', () => {
    // Sliders
    new Slider('promoSlider', 'promoDots');
    initTextSliders();
    initSearch();
});
