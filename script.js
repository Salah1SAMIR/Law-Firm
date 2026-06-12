document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');

  function handleNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('transparent');
    }
  }

  handleNavbar();
  window.addEventListener('scroll', handleNavbar, { passive: true });

  // ===== SLIDING NAV INDICATOR =====
  const navLinksContainer = document.getElementById('nav-links');
  let isScrollingFromClick = false;

  if (navLinksContainer) {
    const indicator = navLinksContainer.querySelector('.nav-indicator');
    const links = navLinksContainer.querySelectorAll('a');

    function updateIndicator(activeLink) {
      if (!indicator) return;
      
      // If mobile view, hide indicator
      if (window.innerWidth <= 768) {
        indicator.style.opacity = '0';
        return;
      }

      if (!activeLink) {
        indicator.style.opacity = '0';
        return;
      }

      // Calculate relative position to container
      const containerRect = navLinksContainer.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      
      const left = linkRect.left - containerRect.left;
      const width = linkRect.width;

      indicator.style.width = `${width}px`;
      indicator.style.transform = `translateX(${left}px)`;
      indicator.style.opacity = '1';
    }

    // Set initial position
    setTimeout(() => {
      const activeLink = navLinksContainer.querySelector('a.active');
      updateIndicator(activeLink);
    }, 150);

    // Hover slide effect
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
          updateIndicator(link);
        }
      });
      link.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
          const activeLink = navLinksContainer.querySelector('a.active');
          updateIndicator(activeLink);
        }
      });
      
      // Immediate click highlight and indicator snap
      link.addEventListener('click', function() {
        links.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        updateIndicator(this);
        
        isScrollingFromClick = true;
        setTimeout(() => {
          isScrollingFromClick = false;
        }, 800);
      });
    });

    // Resize updates
    window.addEventListener('resize', () => {
      const activeLink = navLinksContainer.querySelector('a.active');
      updateIndicator(activeLink);
    });

    window.updateNavIndicator = () => {
      const activeLink = navLinksContainer.querySelector('a.active');
      updateIndicator(activeLink);
    };
  }

  // ===== SCROLLSPY (ACTIVE LINK ON SCROLL) =====
  const sections = document.querySelectorAll('section[id]');
  const scrollSpyLinks = document.querySelectorAll('.nav-links a');

  function scrollSpy() {
    if (isScrollingFromClick) return;
    if (sections.length === 0 || scrollSpyLinks.length === 0) return;

    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140; // Offset for header padding

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      let activeChanged = false;
      scrollSpyLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}` || href.endsWith(`#${currentSectionId}`)) {
          if (!link.classList.contains('active')) {
            scrollSpyLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            activeChanged = true;
          }
        }
      });
      
      if (activeChanged && window.updateNavIndicator) {
        window.updateNavIndicator();
      }
    }
  }

  // ScrollSpy listener
  window.addEventListener('scroll', scrollSpy, { passive: true });

  // ===== PARALLAX HERO BACKGROUND =====
  const heroBg = document.getElementById('hero-parallax-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.16}px)`;
      }
    }, { passive: true });
  }

  // ===== MOBILE MENU NAVIGATION =====
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainerMobile = document.getElementById('nav-links');
  const lines = mobileToggle ? mobileToggle.querySelectorAll('.hamburger-line') : [];

  if (mobileToggle && navLinksContainerMobile) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navLinksContainerMobile.classList.toggle('active');
      mobileToggle.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';

      // Animate hamburger to X
      if (isActive) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        lines[0].style.transform = '';
        lines[1].style.opacity = '';
        lines[2].style.transform = '';
      }
    });

    navLinksContainerMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainerMobile.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
        lines.forEach(l => { l.style.transform = ''; l.style.opacity = ''; });
      });
    });
  }

  // ===== FORM TO WHATSAPP REDIRECTION =====
  const form = document.getElementById('consultation-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const type = document.getElementById('type').value;

      const message = `السلام عليكم، أرغب في حجز استشارة قانونية:\n\n• الاسم: ${name}\n• الهاتف: ${phone}\n• نوع الاستشارة: ${type}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/201001914083?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
    });
  }

  // ===== SMOOTH SCROLLING FOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        const navbarHeight = 72; // matched with new scrolled header height
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
