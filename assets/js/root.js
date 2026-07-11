const root = document.documentElement;
const stored = localStorage.getItem('theme');

function toggleTheme() {
    console.log("Toggling theme...");
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

window.addEventListener("load", (event) => {
    if (stored) root.setAttribute('data-theme', stored);
    
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