 
        // Cursor
        const cursor = document.getElementById('cursor');
        const cursorRing = document.getElementById('cursorRing');
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        (function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        })();

        document.querySelectorAll('a, button, .project-item, .exp-nav-item, .form-input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorRing.classList.add('hover'); });
            el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorRing.classList.remove('hover'); });
        });

        // Scroll animations
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

        setTimeout(() => {
            document.querySelectorAll('.hero .fade-in').forEach(el => el.classList.add('visible'));
        }, 100);

        // Exp nav
        document.querySelectorAll('.exp-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.exp-nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Nav scroll shrink
        const nav = document.querySelector('nav');
        window.addEventListener('scroll', () => {
            nav.style.padding = window.scrollY > 40 ? '18px 60px' : '28px 60px';
        });

        // Parallax bg text
        const bgText = document.querySelector('.hero-bg-text');
        if (bgText) {
            window.addEventListener('scroll', () => {
                bgText.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.3}px))`;
            });
        }

        // Hamburger
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
        document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('active')));
        document.addEventListener('click', e => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) navLinks.classList.remove('active');
        });

        // Flash message
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        const flash = document.getElementById('flash-message');
        const msgs = {
            success: { text: "Message sent! I'll get back to you soon.", bg: '#22c55e' },
            required: { text: 'All fields are required.', bg: '#5B6CF9' },
            error: { text: 'Something went wrong. Please try again.', bg: '#ef4444' },
        };
        if (status && msgs[status]) {
            const { text, bg } = msgs[status];
            flash.textContent = text;
            flash.style.cssText = `display:block;position:fixed;top:28px;right:28px;background:${bg};color:#E8EAF0;padding:16px 28px;border-radius:2px;font-family:'DM Mono',monospace;font-size:12px;letter-spacing:.08em;z-index:99999;animation:flashFadeIn .35s ease;max-width:320px;line-height:1.5;border:1px solid rgba(255,255,255,0.1);`;
            setTimeout(() => {
                flash.style.transition = 'opacity .5s, transform .5s';
                flash.style.opacity = '0';
                flash.style.transform = 'translateY(-8px)';
                setTimeout(() => flash.remove(), 500);
            }, 4000);
            window.history.replaceState({}, '', '/#contact');
        }
    