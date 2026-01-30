// Initialize Lucide Icons
lucide.createIcons();

// --- 0. Intro Animation Logic (Home Page Only) ---
document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('intro-overlay');
    if (introOverlay) {
        // Extended timeout to allow: Fuel (2s) + Car Accel (1s) + Text Read (2.5s) = ~5.5s
        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 6500); 
    }
});

// --- 1. Navbar Logic (Shared) ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  const isScrolled = window.scrollY > 50;
  
  if (isScrolled) {
    navbar.classList.add('shadow-md', 'py-3');
    navbar.classList.remove('py-6');
    // If it was transparent, give it a background
    if (navbar.classList.contains('bg-transparent')) {
         // Determine if we are on the dark theme page (participate) or light (index)
         if(document.body.classList.contains('bg-gray-950') || document.body.style.backgroundColor === 'rgb(3, 7, 18)') {
            navbar.classList.add('bg-black/90', 'backdrop-blur');
         } else {
            navbar.classList.add('bg-white/95', 'backdrop-blur');
         }
         navbar.classList.remove('bg-transparent');
    }
  } else {
    navbar.classList.remove('shadow-md', 'py-3');
    navbar.classList.add('py-6');
    if (document.title.includes("Home") || document.title.includes("Register")) {
        navbar.classList.remove('bg-white/95', 'bg-black/90', 'backdrop-blur');
        navbar.classList.add('bg-transparent');
    }
  }
});

// --- 2. Counter Animation (Shared) ---
const counters = document.querySelectorAll('.counter');
const speed = 50; // faster speed for smoother animation

const runCounter = (counter) => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        
        // Dynamic increment based on remaining distance
        const inc = Math.ceil((target - count) / 20);

        if (count < target) {
            counter.innerText = count + inc;
            setTimeout(updateCount, 30);
        } else {
            counter.innerText = target;
        }
    };
    updateCount();
};

if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                runCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// --- 3. Speedometer Logic (Participate Page) ---
const speedometerContainer = document.getElementById('speedometer-container');
const speedometerProgress = document.getElementById('speedometer-progress');
const speedometerNeedle = document.getElementById('speedometer-needle');
const speedometerValue = document.getElementById('speedometer-value');

if(speedometerContainer && speedometerProgress && speedometerNeedle && speedometerValue) {
    const targetValue = 5000;
    const maxValue = 6000;
    const totalDash = 251; // Adjusted for the new arc path

    const runSpeedometer = () => {
        let currentVal = 0;
        // Animation loop
        const interval = setInterval(() => {
            currentVal += 50; // Increment
            if(currentVal >= targetValue) {
                currentVal = targetValue;
                clearInterval(interval);
            }
            speedometerValue.innerText = currentVal;
            
            // Calculate visual progress
            const percentage = currentVal / maxValue;
            
            // Update Dash Offset (Stroke)
            const dashOffset = totalDash - (percentage * totalDash);
            speedometerProgress.style.strokeDashoffset = dashOffset;
            
            // Update Needle Rotation (-90 start, +90 end = 180 deg range)
            // But our SVG starts at 180 deg (left) to 0 (right) visually
            // Start angle -90 (left), End angle 90 (right) relative to center top? 
            // In SVG transform: rotate(-90) is left. 
            // Let's assume range is -90deg to +90deg
            const rotation = -90 + (percentage * 180);
            speedometerNeedle.style.transform = `translate(100px, 100px) rotate(${rotation}deg)`;
            
        }, 15);
    };

    const speedometerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                setTimeout(runSpeedometer, 200); 
                speedometerObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    speedometerObserver.observe(speedometerContainer);
}

// --- 4. Pricing Tab Logic (Participate Page) ---
const btnSponsors = document.getElementById('btn-sponsors');
const btnBooths = document.getElementById('btn-booths');
const sponsorsGrid = document.getElementById('sponsors-grid');
const boothsGrid = document.getElementById('booths-grid');

if (btnSponsors && btnBooths && sponsorsGrid && boothsGrid) {
    // Check if we are in Dark Mode (Fuel theme)
    const isDarkTheme = document.body.style.backgroundColor === 'rgb(3, 7, 18)' || document.title.includes("Register");
    const activeClass = isDarkTheme ? ['bg-red-600', 'text-white', 'shadow-lg'] : ['bg-iba-red', 'text-white', 'shadow-md'];
    const inactiveClass = isDarkTheme ? ['text-gray-400', 'hover:text-white'] : ['text-gray-500', 'hover:text-gray-900'];

    btnSponsors.addEventListener('click', () => {
        btnSponsors.classList.add(...activeClass);
        btnSponsors.classList.remove(...inactiveClass);
        
        btnBooths.classList.remove(...activeClass);
        btnBooths.classList.add(...inactiveClass);

        sponsorsGrid.classList.remove('hidden');
        sponsorsGrid.classList.add('grid');
        boothsGrid.classList.add('hidden');
        boothsGrid.classList.remove('grid');
    });

    btnBooths.addEventListener('click', () => {
        btnBooths.classList.add(...activeClass);
        btnBooths.classList.remove(...inactiveClass);
        
        btnSponsors.classList.remove(...activeClass);
        btnSponsors.classList.add(...inactiveClass);

        boothsGrid.classList.remove('hidden');
        boothsGrid.classList.add('grid');
        sponsorsGrid.classList.add('hidden');
        sponsorsGrid.classList.remove('grid');
    });
}

// --- 5. Pricing Content Injection (Participate Page) ---
const platList = document.getElementById('platinum-features');
if (platList) {
    const isDarkTheme = document.title.includes("Register");
    const textColor = isDarkTheme ? "text-gray-300" : "text-gray-600";
    const checkColor = isDarkTheme ? "text-green-400" : "text-green-600";
    const checkBg = isDarkTheme ? "bg-green-400/10" : "bg-green-50";

    const platinumFeatures = [
        "20 Days Pre-Fair Recruitment Data", "Prime Logo on Media Wall", "Speaking Opportunity at Arena", 
        "Special Mention in Welcome Note", "1-Minute Video Message Coverage", "Premium Stalls", "Closing Ceremony Guest of Honor"
    ];
    platinumFeatures.forEach(feat => {
        const li = document.createElement('li');
        li.className = `flex items-start text-sm ${textColor}`;
        li.innerHTML = `<div class="mt-0.5 mr-3 flex-shrink-0 w-5 h-5 rounded-full ${checkBg} flex items-center justify-center"><i data-lucide="check" class="w-3 h-3 ${checkColor}"></i></div><span class="leading-snug">${feat}</span>`;
        platList.appendChild(li);
    });

    // Dark Mode Styling Helpers
    const getCardClasses = (tier) => {
        if(isDarkTheme) {
             return {
                bg: 'bg-gray-900',
                border: 'border-white/10',
                text: 'text-white',
                subtext: 'text-gray-400',
                btn: 'bg-white/10 text-white hover:bg-white/20',
                iconColor: tier.color // passing color code directly for icon
             }
        }
        return {
            bg: 'bg-white',
            border: 'border-gray-100',
            text: 'text-gray-900',
            subtext: 'text-gray-500',
            btn: 'bg-white border border-gray-200 text-gray-700 hover:border-iba-red hover:text-iba-red hover:bg-iba-red hover:text-white',
            iconColor: 'text-white'
        }
    };

    const sponsorsData = [
        { 
            id: "gold-card", name: "Gold", price: "PKR 2.0M", color: "text-yellow-400", bgLight: "bg-gradient-to-br from-yellow-500 to-yellow-600",
            features: ["10 Days Pre-Fair Recruitment Data", "Logo on Media Wall", "Promotional Activity at Arena", "Logo on Backdrops", "Standees at Career Vista"]
        },
        { 
            id: "silver-card", name: "Silver", price: "PKR 1.5M", color: "text-gray-300", bgLight: "bg-gradient-to-br from-gray-400 to-gray-500",
            features: ["Logo on Media Wall", "Logo on Backdrops", "Visibility at Lunch Area", "Product Ads in Brochure"]
        },
        { 
            id: "bronze-card", name: "Bronze", price: "PKR 1.0M", color: "text-orange-400", bgLight: "bg-gradient-to-br from-orange-700 to-orange-800",
            features: ["Logo on Media Wall", "Logo on Banners", "Visibility at Lunch Area", "Souvenirs for Team"]
        }
    ];

    sponsorsData.forEach(tier => {
        const container = document.getElementById(tier.id);
        if(container) {
            const style = getCardClasses(tier);
            
            // Header Background Logic
            let headerBg = isDarkTheme ? 'bg-gradient-to-b from-gray-800 to-gray-900' : tier.bgLight;
            let headerText = isDarkTheme ? 'text-white' : 'text-white';
            
            container.innerHTML = `
                <div class="p-6 ${headerBg} ${headerText} relative overflow-hidden">
                     <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                     <div class="relative z-10">
                        <div class="flex justify-between items-start mb-4">
                             <i data-lucide="award" class="w-8 h-8 ${isDarkTheme ? tier.color : 'text-white'}"></i>
                        </div>
                        <h3 class="text-2xl font-bold">${tier.name}</h3>
                        <div class="mt-4">
                            <span class="text-3xl font-bold">${tier.price}</span>
                        </div>
                     </div>
                </div>
                <div class="p-6 flex-grow ${isDarkTheme ? 'bg-gray-900/50' : 'bg-white'}">
                    <ul class="space-y-4">
                        ${tier.features.map(f => `
                            <li class="flex items-start text-sm ${style.subtext}">
                                <div class="mt-0.5 mr-3 flex-shrink-0 w-5 h-5 rounded-full ${checkBg} flex items-center justify-center"><i data-lucide="check" class="w-3 h-3 ${checkColor}"></i></div>
                                <span class="leading-snug">${f}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="p-6 mt-auto">
                    <a href="mailto:shirazahmed@iba.edu.pk?subject=${tier.name}" class="block w-full text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 ${style.btn}">Choose ${tier.name}</a>
                </div>
            `;
        }
    });

    const booths = [
      { name: "Premium Booth", price: "PKR 175,000", dim: "3 x 3 x 2.4m", feat: ["Corner Location", "Two Sides Open", "Max Visibility", "Power & Internet"] },
      { name: "Standard Booth", price: "PKR 145,000", dim: "3 x 3 x 2.4m", feat: ["Standard Aisle", "One Side Open", "Standard Branding", "Power Access"] },
      { name: "Shell Scheme", price: "PKR 115,000", dim: "3 x 2 x 2.4m", feat: ["Compact Space", "Efficient Layout", "Wall Branding", "Budget Friendly"] }
    ];

    if (boothsGrid) {
        const boothsHtml = booths.map(b => `
           <div class="group ${isDarkTheme ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-100'} rounded-3xl shadow-xl border overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
              <div class="p-8 text-center relative">
                <div class="absolute inset-0 bg-gray-50 skew-y-3 transform origin-top-left -translate-y-12 z-0 group-hover:bg-red-50 transition-colors duration-500 opacity-50"></div>
                <div class="relative z-10">
                    <div class="w-16 h-16 mx-auto mb-6 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-md flex items-center justify-center text-iba-red group-hover:bg-iba-red group-hover:text-white transition-colors duration-300">
                        <i data-lucide="store" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}">${b.name}</h3>
                    <div class="flex items-baseline justify-center mt-4">
                        <span class="text-3xl font-bold text-iba-red">${b.price}</span>
                    </div>
                    <p class="text-sm ${isDarkTheme ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-100'} mt-2 font-medium inline-block px-3 py-1 rounded-full">${b.dim}</p>
                </div>
              </div>
              <div class="p-8 pt-0 flex-grow flex flex-col">
                <div class="space-y-4 mb-8 flex-grow">
                  ${b.feat.map(f => `
                    <div class="flex items-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'} text-sm">
                      <div class="w-1.5 h-1.5 rounded-full bg-iba-red mr-3"></div>
                      ${f}
                    </div>
                  `).join('')}
                </div>
                <a href="mailto:rshahid@iba.edu.pk" class="block w-full text-center ${isDarkTheme ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-iba-red'} font-bold py-4 rounded-xl transition-colors duration-300 shadow-lg mt-auto">
                  Reserve Booth
                </a>
              </div>
           </div>
        `).join('');

        boothsGrid.innerHTML = boothsHtml;
    }
}

// --- 6. Marquee Logic (Shared & Specific) ---
const marqueeContainer = document.getElementById('marquee-content');
const recruitersMarquee = document.getElementById('recruiters-marquee');

// Expanded List of Partners with Logos
const partnersList = [
      { name: "HBL", domain: "hbl.com" },
      { name: "Meezan Bank", domain: "meezanbank.com" },
      { name: "Bank Alfalah", domain: "bankalfalah.com" },
      { name: "NBP", domain: "nbp.com.pk" },
      { name: "Unilever", domain: "unilever.com" },
      { name: "Procter & Gamble", domain: "pg.com" },
      { name: "L'Oreal", domain: "loreal.com" },
      { name: "Engro", domain: "engro.com" },
      { name: "Jazz", domain: "jazz.com.pk" },
      { name: "Telenor", domain: "telenor.com" },
      { name: "Careem", domain: "careem.com" },
      { name: "Foodpanda", domain: "foodpanda.pk" },
      { name: "Shell", domain: "shell.com" },
      { name: "K-Electric", domain: "ke.com.pk" },
      { name: "Shan Foods", domain: "assets\images\shan.png" },
      { name: "National Foods", domain: "nfoods.com" },
      { name: "PepsiCo", domain: "pepsico.com" },
      { name: "Coca Cola", domain: "coca-colacompany.com" },
      { name: "Systems Ltd", domain: "systemsltd.com" },
      { name: "Folio3", domain: "folio3.com" },
      { name: "10Pearls", domain: "10pearls.com" },
      { name: "Ibex", domain: "ibex.co" },
      { name: "Gaditek", domain: "gaditek.com" },
      { name: "Martin Dow", domain: "martindow.com" },
      { name: "Tapal", domain: "tapaltea.com" },
      { name: "EBM", domain: "ebm.com.pk" },
      { name: "Indus Motor", domain: "toyota-indus.com" },
      { name: "Lucky Core", domain: "luckycoreindustries.com" },
      { name: "UBL", domain: "ubldigital.com" },
      { name: "MCB", domain: "mcb.com.pk" }
];

if (marqueeContainer) {
    // Basic Logo Marquee for Home Page (Gray -> Color)
    const logosHTML = partnersList.map(p => `
        <div class="flex flex-col items-center justify-center min-w-[120px] mx-8 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
            <img src="https://logo.clearbit.com/${p.domain}?size=100" alt="${p.name}" class="h-16 object-contain" onError="this.style.display='none'">
        </div>
    `).join('');
    marqueeContainer.innerHTML = logosHTML + logosHTML;
}

if (recruitersMarquee) {
    // Professional Dark Mode Marquee for Participate Page (White Logos + Names)
    // Uses local images from 'logos/' folder with a fallback to Clearbit API
    const recruitersHTML = partnersList.map(p => {
        // Create filename based on name (e.g. "Meezan Bank" -> "meezan-bank.png")
        const filename = p.name.toLowerCase().replace(/\s+/g, '-') + '.png';
        // Random animation duration for organic floating effect
        const animDuration = 4 + Math.random() * 4; 
        
        return `
        <div class="flex flex-col items-center justify-center gap-3 min-w-[160px] mx-6 group/item cursor-default relative">
            <div class="w-full h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-5 group-hover/item:border-red-500/30 group-hover/item:bg-white/10 transition-all duration-300 animate-float" style="animation-duration: ${animDuration}s">
                <!-- 'brightness-0 invert' turns black/colored logos to pure white. Opacity handles the 'gray' look until hover. -->
                <img src="logos/${filename}" 
                     alt="${p.name}" 
                     class="h-full w-full object-contain filter brightness-0 invert opacity-60 group-hover/item:opacity-100 transition-opacity duration-300"
                     onerror="this.onerror=null; this.src='https://logo.clearbit.com/${p.domain}?size=100';">
            </div>
            <span class="text-gray-500 text-[10px] font-bold uppercase tracking-widest group-hover/item:text-white transition-colors duration-300">${p.name}</span>
        </div>
    `}).join('');
    recruitersMarquee.innerHTML = recruitersHTML + recruitersHTML;
}

// Re-run icons for newly injected content
lucide.createIcons();