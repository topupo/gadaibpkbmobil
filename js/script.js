// =============================
// UTIL
// =============================

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

// =============================
// SOCIAL PROOF DYNAMIC
// =============================

function initSocialProofDynamic() {

    const textEl = document.getElementById("socialText");
    const iconEl = document.getElementById("socialIcon");

    if (!textEl || !iconEl) return;

    const baseData = [
        {
            icon: "📨",
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

                typeWriter(`${formatNumber(target)} ${label}`, () => {
                    setTimeout(() => {
                        currentIndex = (currentIndex + 1) % baseData.length;
                        startCycle();
                    }, 1800);
                });

            } else {
                textEl.textContent = `${formatNumber(count)} ${label}`;
            }

        }, stepTime);
    }

    function startCycle() {
        const item = baseData[currentIndex];
        const value = randomBetween(item.min, item.max);
        animateCount(value, item.label, item.icon);
    }

    startCycle();
}


// =============================
// DOM READY
// =============================

document.addEventListener('DOMContentLoaded', () => {

    document.body.style.touchAction = "pan-y";

    if (typeof populateTahun === "function") populateTahun();
    if (typeof updateMerkDropdown === "function") updateMerkDropdown('mobil');
    if (typeof initBPKBListener === "function") initBPKBListener();
    if (typeof initKecamatanSearch === "function") initKecamatanSearch();
    if (typeof initNopolUppercase === "function") initNopolUppercase();
    if (typeof initWhatsAppForm === "function") initWhatsAppForm();
    if (typeof initScrollToForm === "function") initScrollToForm();
    if (typeof initMultiStepForm === "function") initMultiStepForm();

    initSocialProofDynamic();

    if (typeof Slider === "function") {
        new Slider('promoSlider', 'promoDots');
        new Slider('simSlider', 'simDots');
        new Slider('testiSlider');
    }

});
