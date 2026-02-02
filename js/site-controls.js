
// --- Translations Data ---
const translations = {
    en: {
        nav_about: "About",
        nav_services: "Services",
        nav_work: "Work",
        nav_contact: "Contact",
        hero_title: "Digital creator focused on clean design and strong online presence.",
        hero_desc: "I craft simple, modern websites and visual designs that help people present themselves professionally.",
        hero_btn_work: "View My Work",
        hero_btn_contact: "Get in Touch",
        about_title: "Designing with clarity and purpose.",
        services_title: "Specialized Services",
        portfolio_title: "Recent Projects",
        contact_title: "Let's work together"
    },
    fr: {
        nav_about: "À propos",
        nav_services: "Services",
        nav_work: "Projets",
        nav_contact: "Contact",
        hero_title: "Créateur numérique spécialisé dans le design épuré et la présence en ligne.",
        hero_desc: "Je conçois des sites web modernes et des identités visuelles pour vous présenter professionnellement.",
        hero_btn_work: "Voir mes projets",
        hero_btn_contact: "Me contacter",
        about_title: "Concevoir avec clarté et objectif.",
        services_title: "Services Spécialisés",
        portfolio_title: "Projets Récents",
        contact_title: "Travaillons ensemble"
    },
    ar: {
        nav_about: "من أنا",
        nav_services: "خدماتي",
        nav_work: "أعمالي",
        nav_contact: "تواصل معي",
        hero_title: "مصمم رقمي يركز على التصميم النظيف والحضور القوي.",
        hero_desc: "أقوم ببناء مواقع حديثة وتصاميم بصرية تساعدك على تقديم نفسك باحترافية.",
        hero_btn_work: "شاهد أعمالي",
        hero_btn_contact: "تواصل معي",
        about_title: "التصميم بوضوح وهدف.",
        services_title: "خدمات متخصصة",
        portfolio_title: "أحدث المشاريع",
        contact_title: "لنعمل معاً"
    }
};

// --- Global Actions for AI ---
window.siteActions = {
    setLang: function (lang) {
        if (!translations[lang]) return;

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Loop through all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });

        // RTL adjustment for Arabic
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        // Save preference
        localStorage.setItem('preferred_lang', lang);
    },

    setTheme: function (mode) {
        if (mode === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    },

    navigate: function (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create Lang Switcher
    const langContainer = document.createElement('div');
    langContainer.className = 'lang-switcher-container';
    ['en', 'fr', 'ar'].forEach(lang => {
        const btn = document.createElement('button');
        btn.className = 'lang-btn';
        btn.innerText = lang.toUpperCase();
        btn.dataset.lang = lang;
        btn.onclick = () => window.siteActions.setLang(lang);
        langContainer.appendChild(btn);
    });
    document.body.appendChild(langContainer);

    // 2. Load Defaults
    const savedLang = localStorage.getItem('preferred_lang') || 'en';
    window.siteActions.setLang(savedLang);
});
