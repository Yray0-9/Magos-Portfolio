document.addEventListener('DOMContentLoaded', () => {
    // --- THEME SWITCHING (DARK/LIGHT MODE) ---
    const themeBtn = document.getElementById('theme-btn');
    
    // Check local storage or system preferences
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-mode');
    }
    
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    // --- SCROLL PROGRESS INDICATOR ---
    const scrollProgress = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        } else {
            scrollProgress.style.width = '0%';
        }
    });

    // --- STICKY NAV ON SCROLL ---
    const nav = document.getElementById('main-nav');
    
    const handleNavScroll = () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll(); // Initial check

    // --- MOBILE MENU HAMBURGER ---
    const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    const closeMobileMenu = () => {
        mobileToggleBtn.classList.remove('active');
        navMenu.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    mobileToggleBtn.addEventListener('click', () => {
        const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;
        mobileToggleBtn.setAttribute('aria-expanded', String(nextState));
        mobileToggleBtn.classList.toggle('active', nextState);
        navMenu.classList.toggle('active', nextState);
        document.body.style.overflow = nextState ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu on Escape key or desktop resize
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
            mobileToggleBtn.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // --- TYPING ANIMATION ---
    const typedTextSpan = document.getElementById('typed-output');
    const textArray = ["Software Developer.", "Web Developer.", "IT Professional."];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 1100);
        }
    }
    
    // Start typing animation promptly on load
    if (textArray.length) setTimeout(type, 300);

    // --- SCROLL REVEAL (INTERSECTION OBSERVER) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- ACTIVE LINK ON SCROLL (SCROLLSPY) ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    const handleActiveLink = () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Highlight a bit early before the section fills the viewport
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', handleActiveLink);
    handleActiveLink(); // Initial check

    // --- COPY EMAIL TO CLIPBOARD ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        let copyTimeout;
        copyEmailBtn.addEventListener('click', async () => {
            const email = 'romulomagos16@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
            } catch {
                const tempInput = document.createElement('input');
                tempInput.value = email;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
            }

            const icon = copyEmailBtn.querySelector('i');
            const label = copyEmailBtn.querySelector('span');
            copyEmailBtn.classList.add('copied');
            if (icon) icon.className = 'fa-solid fa-check';
            if (label) label.textContent = 'Copied!';

            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
                if (icon) icon.className = 'fa-regular fa-copy';
                if (label) label.textContent = 'Copy Email';
            }, 2000);
        });
    }
});
