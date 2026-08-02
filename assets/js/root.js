const root = document.documentElement;
const stored = localStorage.getItem('theme');

function toggleTheme() {
    const darkThemeMediaQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const current = root.getAttribute('data-theme') ?? (darkThemeMediaQuery ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

async function injectIconSprite() {
    const res = await fetch('/assets/img/expander.svg');
    const div = document.createElement('div');
    div.innerHTML = await res.text();
    document.body.prepend(div.firstElementChild);
}

function registerExpandables() {
    document.body.addEventListener('click', (e) => {
        const summary = e.target.closest('.expandable > .summary');
        if (summary) summary.parentElement.classList.toggle('open');
    });
}

window.addEventListener("load", (event) => {
    if (stored) root.setAttribute('data-theme', stored);

    injectIconSprite();
    registerExpandables();
    
    const header = document.querySelector('header');
    function updateHeaderShadow() {
        header.classList.toggle('scrolled', window.scrollY > 0);
    }
    window.addEventListener('scroll', updateHeaderShadow, { passive: true });
    updateHeaderShadow();
    
    const logo = document.getElementById("logo-rotator");
    const cx = 107.95, cy = 139.7;
    const degreesPerPixel = 0.2; // higher = faster rotation

    let ticking = false;

    function updateRotation() {
        const angle = window.scrollY * degreesPerPixel;
        logo.setAttribute("transform", `rotate(${angle} ${cx} ${cy})`);
        ticking = false;
    }

    document.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateRotation);
            ticking = true;
        }
    }, { passive: true });

    updateRotation();
});

// random quote selection