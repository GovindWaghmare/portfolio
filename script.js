(function() {
        'use strict';

        // 1. Dynamic Copyright Year
        const yearEl = document.getElementById('copyrightYear');
        if (yearEl) {
          yearEl.textContent = new Date().getFullYear();
        }

        // 2. Custom Toast Notification (Identical to React-Toastify)
        function showToast(message) {
          const container = document.getElementById('toastContainer');
          if (!container) return;

          const toast = document.createElement('div');
          toast.className = 'Toastify__toast Toastify__toast-theme--dark Toastify__toast--success Toastify--animate Toastify__bounce-enter--bottom-left';
          toast.setAttribute('role', 'alert');
          toast.innerHTML = `
            <div class="Toastify__toast-icon Toastify--animate-icon Toastify__zoom-enter">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#22c55e">
                <path d="M12 0a12 12 0 1 0 12 12A12.014 12.014 0 0 0 12 0zm6.927 8.2-6.845 9.289a1.011 1.011 0 0 1-1.43.188l-4.888-3.908a1 1 0 1 1 1.25-1.562l4.076 3.261 6.227-8.451a1 1 0 1 1 1.61 1.183z"></path>
              </svg>
            </div>
            <div class="Toastify__toast-body" role="status" aria-live="polite">
              <div style="font-size: 13.5px; font-weight: 500;">${message}</div>
            </div>
            <button class="Toastify__close-button Toastify__close-button--dark" type="button" aria-label="close">
              <svg aria-hidden="true" viewBox="0 0 14 16" width="14" height="16" fill="currentColor">
                <path fill-rule="evenodd" d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"></path>
              </svg>
            </button>
            <div class="Toastify__progress-bar Toastify__progress-bar--animated Toastify__progress-bar-theme--dark Toastify__progress-bar--success" style="animation-duration: 2500ms;"></div>
          `;

          const closeBtn = toast.querySelector('.Toastify__close-button');
          function closeToast() {
            if (!toast.parentNode) return;
            toast.className = toast.className.replace('Toastify__bounce-enter--bottom-left', 'Toastify__bounce-exit--bottom-left');
            setTimeout(() => {
              if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
              }
            }, 400);
          }

          if (closeBtn) closeBtn.onclick = closeToast;
          container.appendChild(toast);
          setTimeout(closeToast, 2500);
        }

        // 3. Smooth Navigation Handler
        function smoothScrollTo(targetId) {
          if (targetId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.pushState(null, '', '#home');
            return;
          }
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            const headerOffset = 85;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'smooth'
            });
            window.history.pushState(null, '', '#' + targetId);
          }
        }

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
          anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
              const targetId = href.substring(1);
              if (document.getElementById(targetId)) {
                e.preventDefault();
                smoothScrollTo(targetId);
              }
            }
          });
        });

        // 4. Header Sticky, Scrollspy & Scroll Progress Bar
        const header = document.getElementById('header-main');
        const progressBar = document.getElementById('headerScrollProgress');
        const SECTION_IDS = ['home', 'about', 'skills', 'experience', 'education', 'portfolio', 'contacts'];
        const navSectionIds = ['home', 'about', 'portfolio', 'contacts'];
        let sectionPositions = [];
        function updateSectionPositions() {
          sectionPositions = navSectionIds.map((id) => {
            const el = document.getElementById(id);
            return el ? { id, top: el.offsetTop, height: el.offsetHeight } : null;
          }).filter(Boolean);
        }
        window.addEventListener('resize', updateSectionPositions, { passive: true });

        let ticking = false;
        function handleScroll() {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              const scrollY = window.scrollY;

              // Header sticky
              if (header) {
                if (scrollY > 80) {
                  header.classList.add('sticky');
                } else {
                  header.classList.remove('sticky');
                }
              }

              // Scroll progress
              const docHeight = document.documentElement.scrollHeight - window.innerHeight;
              const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
              if (progressBar) {
                progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
              }

              // Scrollspy (Zero forced reflow using cached offsets)
              const scrollPosition = scrollY + 180;
              let currentSection = 'home';
              for (let i = 0; i < sectionPositions.length; i++) {
                const sec = sectionPositions[i];
                if (scrollPosition >= sec.top && scrollPosition < sec.top + sec.height) {
                  currentSection = sec.id;
                  break;
                }
              }

              // Update nav active classes
              document.querySelectorAll('.tmp-mainmenu a').forEach((link) => {
                const linkHref = link.getAttribute('href');
                if (linkHref === '#' + currentSection) {
                  link.classList.add('active');
                } else if (linkHref && linkHref.startsWith('#')) {
                  link.classList.remove('active');
                }
              });

              // Scroll to Top Water wave update
              const scrollToTopBox = document.getElementById('scrollToTopBtn');
              const water = document.getElementById('scrollWater');
              if (scrollToTopBox) {
                if (scrollY >= 150) {
                  scrollToTopBox.style.display = 'block';
                  scrollToTopBox.classList.add('active-progress');
                } else {
                  scrollToTopBox.style.display = 'none';
                  scrollToTopBox.classList.remove('active-progress');
                }
              }
              if (water) {
                const percent = docHeight > 0 ? Math.min(Math.floor((scrollY / docHeight) * 100), 100) : 0;
                water.style.transform = `translate(0, ${100 - percent}%)`;
              }

              ticking = false;
            });
            ticking = true;
          }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateSectionPositions();
        handleScroll();

        // 5. Scroll to Top Click
        const scrollToTopBox = document.getElementById('scrollToTopBtn');
        if (scrollToTopBox) {
          scrollToTopBox.addEventListener('click', () => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          });
        }

        // 6. Hero Typer Animation (Exact replication of TyperComponent)
        const typerWrapper = document.getElementById('heroTyperWrapper');
        if (typerWrapper) {
          const typerItems = typerWrapper.querySelectorAll('b');
          let activeTyperIndex = 0;

          function updateTyperWidth() {
            const activeEl = typerItems[activeTyperIndex];
            if (typerWrapper && activeEl) {
              typerWrapper.style.width = activeEl.scrollWidth + 'px';
            }
          }

          setTimeout(() => {
            updateTyperWidth();
            setInterval(() => {
              if (typerWrapper) {
                typerWrapper.style.width = '0px';
              }

              setTimeout(() => {
                typerItems[activeTyperIndex].classList.remove('is-visible');
                typerItems[activeTyperIndex].classList.add('is-hidden');

                activeTyperIndex = (activeTyperIndex + 1) % typerItems.length;

                typerItems[activeTyperIndex].classList.remove('is-hidden');
                typerItems[activeTyperIndex].classList.add('is-visible');

                setTimeout(updateTyperWidth, 20);
              }, 600);
            }, 3000);
          }, 1500);
        }

        // 7. Copy Code Snippet (Hero Card)
        const copyCodeBtn = document.getElementById('copyCodeBtn');
        if (copyCodeBtn) {
          const codeSnippet = `const govind = {
  name: "Govind Waghmare",
  title: "Head Web Dev @ Flashlab Creative",
  location: "Goa, India",
  experience: "2+ years",
  stack: ["React", "WordPress", "PHP", "Ads & GA4", "AI Tools"],
  passion: "Building the web 🚀",
  openToHire: true
};`;

          copyCodeBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(codeSnippet).then(() => {
              const icon = document.getElementById('copyCodeIcon');
              const text = document.getElementById('copyCodeText');
              if (icon && text) {
                icon.className = 'fa-solid fa-check';
                icon.style.color = '#22c55e';
                text.textContent = 'Copied';
                text.style.color = '#22c55e';

                setTimeout(() => {
                  icon.className = 'fa-regular fa-copy';
                  icon.style.color = '';
                  text.textContent = 'Copy';
                  text.style.color = '';
                }, 2000);
              }
            });
          });
        }

        // 8. Copy Phone & Email (Contact Section)
        const phone = '+91 9850978489';
        const email = 'gov.wagh25@gmail.com';

        const copyPhoneBtn = document.getElementById('copyPhoneBtn');
        if (copyPhoneBtn) {
          copyPhoneBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(phone).then(() => {
              const icon = document.getElementById('copyPhoneIcon');
              const text = document.getElementById('copyPhoneText');
              if (icon) icon.className = 'fa-solid fa-check';
              if (text) text.textContent = 'Copied';
              copyPhoneBtn.style.color = '#22c55e';
              showToast('Phone number copied to clipboard!');

              setTimeout(() => {
                if (icon) icon.className = 'fa-regular fa-copy';
                if (text) text.textContent = 'Copy';
                copyPhoneBtn.style.color = '';
              }, 2500);
            });
          });
        }

        const copyPhoneBtn2 = document.getElementById('copyPhoneBtn2');
        if (copyPhoneBtn2) {
          copyPhoneBtn2.addEventListener('click', () => {
            navigator.clipboard.writeText(phone).then(() => {
              const icon = document.getElementById('copyPhoneIcon2');
              const text = document.getElementById('copyPhoneText2');
              if (icon) icon.className = 'fa-solid fa-check';
              if (text) text.textContent = 'Copied';
              copyPhoneBtn2.style.color = '#22c55e';
              showToast('Phone number copied to clipboard!');

              setTimeout(() => {
                if (icon) icon.className = 'fa-regular fa-copy';
                if (text) text.textContent = 'Copy Number';
                copyPhoneBtn2.style.color = '';
              }, 2500);
            });
          });
        }

        const copyEmailBtn = document.getElementById('copyEmailBtn');
        if (copyEmailBtn) {
          copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(email).then(() => {
              const icon = document.getElementById('copyEmailIcon');
              const text = document.getElementById('copyEmailText');
              if (icon) icon.className = 'fa-solid fa-check';
              if (text) text.textContent = 'Copied';
              copyEmailBtn.style.color = '#22c55e';
              showToast('Email copied to clipboard!');

              setTimeout(() => {
                if (icon) icon.className = 'fa-regular fa-copy';
                if (text) text.textContent = 'Copy Email';
                copyEmailBtn.style.color = '';
              }, 2500);
            });
          });
        }

        // 9. Desktop Sidebar Drawer
        const sidebarDrawer = document.getElementById('sidebarDrawer');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

        function openSidebar() {
          if (sidebarDrawer) sidebarDrawer.classList.add('tmp_side_bar_open');
          document.body.style.overflow = 'hidden';
        }

        function closeSidebar() {
          if (sidebarDrawer) sidebarDrawer.classList.remove('tmp_side_bar_open');
          document.body.style.overflow = '';
        }

        if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
        if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
        if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

        document.querySelectorAll('#sidebarDrawer a[href^="#"]').forEach((link) => {
          link.addEventListener('click', closeSidebar);
        });

        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            closeSidebar();
            closeMobileMenu();
          }
        });

        // 10. Mobile Menu Drawer
        const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuCloseBtn = document.getElementById('mobileMenuCloseBtn');
        const mobileMenuInner = document.getElementById('mobileMenuInner');

        function openMobileMenu() {
          if (mobileMenuDrawer) mobileMenuDrawer.classList.add('active');
          document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
          if (mobileMenuDrawer) mobileMenuDrawer.classList.remove('active');
          document.body.style.overflow = '';
        }

        if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileMenu);
        if (mobileMenuCloseBtn) mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);

        if (mobileMenuDrawer) {
          mobileMenuDrawer.addEventListener('click', (e) => {
            if (mobileMenuInner && !mobileMenuInner.contains(e.target)) {
              closeMobileMenu();
            }
          });
        }

        document.querySelectorAll('.mobile-nav-link, #mobileLogoLink').forEach((link) => {
          link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            closeMobileMenu();
            if (href && href.startsWith('#')) {
              e.preventDefault();
              setTimeout(() => {
                smoothScrollTo(href.substring(1));
              }, 150);
            }
          });
        });

        // 11. Portfolio Data, Filtering & Load More
        const portfolioData = [
  {
    "id": 1,
    "title": "Flashlab Creative",
    "technologies": "HTML, CSS, JavaScript, React, Node.js & MySQL",
    "tags": [
      "React",
      "Node.js",
      "MySQL",
      "HTML / CSS / JS"
    ],
    "categories": [
      "React",
      "Frontend",
      "Business Websites"
    ],
    "liveUrl": "https://flashlabcreative.com/",
    "description": "Parent business website for Flashlab Creative. Built using HTML, CSS and JavaScript and also developed using React with a Node.js backend and MySQL database.",
    "imageSrc": "Assets/flashlabcreative.png",
    "width": 410,
    "height": 457,
    "animationOrder": 1,
    "slug": "-",
    "category": "React",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Flashlab Creative"
  },
  {
    "id": 2,
    "title": "Parashoot Studio",
    "technologies": "WordPress, React, Node.js & MySQL",
    "tags": [
      "WordPress",
      "React",
      "Node.js",
      "MySQL"
    ],
    "categories": [
      "WordPress",
      "React",
      "Portfolio Websites"
    ],
    "liveUrl": "https://parashootstudio.com/",
    "description": "Portfolio website for photography and videography services. Current version built using WordPress; also developed a React version with Node.js backend and MySQL database.",
    "imageSrc": "Assets/parashootstudio.png",
    "width": 410,
    "height": 457,
    "animationOrder": 2,
    "slug": "--",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Parashoot Studio"
  },
  {
    "id": 3,
    "title": "Cyber Creative",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Portfolio"
    ],
    "categories": [
      "Frontend",
      "Portfolio Websites"
    ],
    "liveUrl": "https://cybercreative.in/",
    "description": "Sub-brand website under Flashlab Creative focused on showcasing website development work and portfolio projects.",
    "imageSrc": "Assets/cybercreative.png",
    "width": 410,
    "height": 457,
    "animationOrder": 3,
    "slug": "",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Cyber Creative"
  },
  {
    "id": 4,
    "title": "Mike's Place",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Restaurant",
      "Hospitality"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://mikes-place-website.netlify.app/",
    "description": "Restaurant & hospitality website deployed on Netlify with responsive layout and interactive digital menu.",
    "imageSrc": "Assets/mikesplace.png",
    "width": 410,
    "height": 457,
    "animationOrder": 4,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Mike's Place"
  },
  {
    "id": 5,
    "title": "AREA 51 Goa",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Interior Design"
    ],
    "categories": [
      "Frontend",
      "Business Websites",
      "Portfolio Websites"
    ],
    "liveUrl": "https://area51goa.netlify.app/",
    "description": "Portfolio website for an interior and exterior design and project execution business in Goa.",
    "imageSrc": "Assets/Area51goa.png",
    "width": 410,
    "height": 457,
    "animationOrder": 1,
    "slug": "",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "AREA 51 Goa"
  },
  {
    "id": 6,
    "title": "Strobe Nightlife",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Nightlife",
      "DJ Portfolio"
    ],
    "categories": [
      "Frontend",
      "Portfolio Websites"
    ],
    "liveUrl": "https://www.strobenightlife.com/",
    "description": "DJ & nightlife portfolio website featuring immersive media showcases and event schedules.",
    "imageSrc": "Assets/strobnightlife.png",
    "width": 410,
    "height": 457,
    "animationOrder": 2,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Strobe Nightlife"
  },
  {
    "id": 7,
    "title": "Deck88",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Restaurant",
      "Hospitality"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://deck-88.netlify.app/",
    "description": "Restaurant website deployed on Netlify with modern styling and responsive dining showcase.",
    "imageSrc": "Assets/deck88.png",
    "width": 550,
    "height": 396,
    "animationOrder": 3,
    "slug": "",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Deck88"
  },
  {
    "id": 8,
    "title": "The Blue Heaven",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Hospitality"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://blue-heaven-goa.netlify.app/",
    "description": "Hospitality website deployed on Netlify with booking inquiry integration.",
    "imageSrc": "Assets/blueheaven.png",
    "width": 1920,
    "height": 1572,
    "animationOrder": 4,
    "slug": "",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "The Blue Heaven"
  },
  {
    "id": 9,
    "title": "The Olive Tree",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Restaurant",
      "Hospitality"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://the-olive-tree.netlify.app/",
    "description": "Restaurant website deployed on Netlify featuring rich culinary showcase.",
    "imageSrc": "Assets/theolivetress_11zon.png",
    "width": 1939,
    "height": 1572,
    "animationOrder": 1,
    "slug": "",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "The Olive Tree"
  },
  {
    "id": 10,
    "title": "Astra Azul Goa",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Villa",
      "Real Estate"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://astraazulgoa.com/",
    "description": "Luxury villa and accommodation website in Goa.",
    "imageSrc": "Assets/astraazul.png",
    "width": 410,
    "height": 457,
    "animationOrder": 2,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Astra Azul Goa"
  },
  {
    "id": 11,
    "title": "Antara Aerosystems",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Aerospace"
    ],
    "categories": [
      "Frontend",
      "Business Websites"
    ],
    "liveUrl": "https://antaraaerosystems.com/",
    "description": "Website for an aircraft and aerospace maintenance engineering business based in Goa.",
    "imageSrc": "Assets/antaraaerosystem.png",
    "width": 1920,
    "height": 1572,
    "animationOrder": 3,
    "slug": "---",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Antara Aerosystems"
  },
  {
    "id": 12,
    "title": "Paradip Beverages",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Water Supplier"
    ],
    "categories": [
      "Frontend",
      "Business Websites"
    ],
    "liveUrl": "https://www.paradipbeverages.com/",
    "description": "Corporate business website for an industrial water supply provider.",
    "imageSrc": "Assets/paradipbeverages.png",
    "width": 1939,
    "height": 1572,
    "animationOrder": 4,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Paradip Beverages"
  },
  {
    "id": 13,
    "title": "Finance Goal",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Finance",
      "Portfolio"
    ],
    "categories": [
      "Frontend",
      "Business Websites",
      "Portfolio Websites"
    ],
    "liveUrl": "https://financegoal.in/",
    "description": "Financial advisory and wealth planning portfolio website.",
    "imageSrc": "Assets/financegoal.png",
    "width": 550,
    "height": 396,
    "animationOrder": 1,
    "slug": "",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Finance Goal"
  },
  {
    "id": 14,
    "title": "Ninety9 Production",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Media",
      "Photography"
    ],
    "categories": [
      "Frontend",
      "Portfolio Websites"
    ],
    "liveUrl": "https://ninety9productions.com/",
    "description": "Portfolio website for photography and videography studio.",
    "imageSrc": "Assets/ninety9productions.png",
    "width": 410,
    "height": 457,
    "animationOrder": 2,
    "slug": "",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Ninety9 Production"
  },
  {
    "id": 15,
    "title": "Robin's Ark",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Hospitality"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://robinsark.netlify.app/",
    "description": "Restaurant & hospitality website deployed with responsive gallery.",
    "imageSrc": "Assets/robinsark.png",
    "width": 1939,
    "height": 1572,
    "animationOrder": 4,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Robin's Ark"
  },
  {
    "id": 16,
    "title": "Tiki Bab",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Hospitality"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://marvelous-biscotti-45aed7.netlify.app/",
    "description": "Hospitality & beach cocktail lounge website deployed on Netlify.",
    "imageSrc": "Assets/tikibab.png",
    "width": 1939,
    "height": 1572,
    "animationOrder": 1,
    "slug": "",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Tiki Bab"
  },
  {
    "id": 17,
    "title": "Babs Hideout",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Hospitality"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://calm-dragon-acd65e.netlify.app/",
    "description": "Hospitality website with interactive menus and location maps.",
    "imageSrc": "Assets/babshideout.png",
    "width": 550,
    "height": 396,
    "animationOrder": 2,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Babs Hideout"
  },
  {
    "id": 18,
    "title": "The Camron Restaurant & Bar",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Restaurant & Bar"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://camron-resturant-majorda.netlify.app/",
    "description": "Restaurant & bar website deployed on Netlify for Majorda, Goa dining.",
    "imageSrc": "Assets/thecamronrestaurant&bar.png",
    "width": 550,
    "height": 396,
    "animationOrder": 3,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "The Camron Restaurant & Bar"
  },
  {
    "id": 19,
    "title": "Hotel Colva Plaza",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Hotel",
      "Hospitality"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://the-colva-plaza.netlify.app/",
    "description": "Hotel & resort website showcasing rooms, amenities, and reservation contacts.",
    "imageSrc": "Assets/hotelcolvaplaza.png",
    "width": 550,
    "height": 396,
    "animationOrder": 4,
    "slug": "",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Hotel Colva Plaza"
  },
  {
    "id": 20,
    "title": "Anoshka Family Restaurant",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Family Restaurant"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://anoshka-restaurant.netlify.app/",
    "description": "Family restaurant website with menu gallery and party booking form.",
    "imageSrc": "Assets/anoshka.png",
    "width": 550,
    "height": 396,
    "animationOrder": 1,
    "slug": "--",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Anoshka Family Restaurant"
  },
  {
    "id": 21,
    "title": "The Origin Goa",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Hospitality"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://theorigin-goa.netlify.app/",
    "description": "Hospitality website deployed on Netlify with modern responsive UI.",
    "imageSrc": "Assets/theorigin.png",
    "width": 550,
    "height": 396,
    "animationOrder": 2,
    "slug": "",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "The Origin Goa"
  },
  {
    "id": 22,
    "title": "Masale Goa",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Restaurant"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://masalegoa.netlify.app/",
    "description": "Restaurant website deployed on Netlify showcasing Indian cuisine specialties.",
    "imageSrc": "Assets/masalegoa.png",
    "width": 410,
    "height": 457,
    "animationOrder": 3,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Masale Goa"
  },
  {
    "id": 23,
    "title": "Southern Coast",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Hospitality"
    ],
    "categories": [
      "Frontend",
      "Hospitality"
    ],
    "liveUrl": "https://salmankhan919803.github.io/Southern-Coast/",
    "description": "Coastal seafood restaurant and bar website deployed on Netlify.",
    "imageSrc": "Assets/southern coast.png",
    "width": 410,
    "height": 457,
    "animationOrder": 4,
    "slug": "--",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Southern Coast"
  },
  {
    "id": 24,
    "title": "Boatcraft",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "Manufacturing"
    ],
    "categories": [
      "WordPress",
      "Business Websites"
    ],
    "liveUrl": "https://boatcraft.in/",
    "description": "Main parent business website for Boatcraft, focused on boat manufacturing. The website showcases the company's boats, products and work.",
    "imageSrc": "Assets/boatcraft.png",
    "width": 1920,
    "height": 1572,
    "animationOrder": 1,
    "slug": "",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Boatcraft"
  },
  {
    "id": 25,
    "title": "Ahilo Charters",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "Hospitality"
    ],
    "categories": [
      "WordPress",
      "Hospitality"
    ],
    "liveUrl": "https://ahilocharters.com/",
    "description": "Website for Ahilo yacht chartering on the Mandovi River in Goa.",
    "imageSrc": "Assets/ahilocharters.png",
    "width": 1939,
    "height": 1572,
    "animationOrder": 2,
    "slug": "-",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Ahilo Charters"
  },
  {
    "id": 26,
    "title": "Sunset Holidays",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "OTA Integration"
    ],
    "categories": [
      "WordPress",
      "Hospitality"
    ],
    "liveUrl": "https://sunsetholidays.in/",
    "description": "Hotel accommodation website. Worked on website implementation, integrations and OTA-related management involving platforms such as MakeMyTrip, Booking.com and Airbnb.",
    "imageSrc": "Assets/sunsetholidays.png",
    "width": 1939,
    "height": 1572,
    "animationOrder": 3,
    "slug": "---",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Sunset Holidays"
  },
  {
    "id": 27,
    "title": "Ahilo Yachts",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "Luxury Yachts"
    ],
    "categories": [
      "WordPress",
      "Business Websites"
    ],
    "liveUrl": "https://ahiloyachts.com/",
    "description": "Website for showcasing luxury yachts under the Boatcraft business.",
    "imageSrc": "Assets/ahiloyachts.png",
    "width": 1939,
    "height": 1572,
    "animationOrder": 4,
    "slug": "-",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Ahilo Yachts"
  },
  {
    "id": 28,
    "title": "Leomar",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "Meta Ads"
    ],
    "categories": [
      "WordPress",
      "Hospitality"
    ],
    "liveUrl": "https://leomar.in/",
    "description": "Yachting business operating on the Mandovi River in Goa, offering yacht experiences for parties, celebrations and events. Worked on the website and Meta Ads activities.",
    "imageSrc": "Assets/leomar.png",
    "width": 550,
    "height": 396,
    "animationOrder": 1,
    "slug": "",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Leomar"
  },
  {
    "id": 29,
    "title": "The Lounge Goa",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "Beach Shack"
    ],
    "categories": [
      "WordPress",
      "Hospitality"
    ],
    "liveUrl": "https://theloungegoa.com/",
    "description": "Website for a beach shack business located at Utorda Beach, Goa.",
    "imageSrc": "Assets/theloungegoa.png",
    "width": 550,
    "height": 396,
    "animationOrder": 2,
    "slug": "",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "The Lounge Goa"
  },
  {
    "id": 30,
    "title": "Ocean8",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "Yacht Investment"
    ],
    "categories": [
      "WordPress",
      "Business Websites"
    ],
    "liveUrl": "https://ocean8.in/",
    "description": "Website for a yacht ownership/investment business where multiple owners participate in the yacht investment model and receive returns according to the business arrangement.",
    "imageSrc": "Assets/ocean8.png",
    "width": 550,
    "height": 396,
    "animationOrder": 3,
    "slug": "",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Ocean8"
  },
  {
    "id": 31,
    "title": "Andaman Explorers",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "Ticketing & Ads"
    ],
    "categories": [
      "WordPress",
      "Business Websites"
    ],
    "liveUrl": "https://andamanexplorers.com/",
    "description": "Website for a semi-submarine tourism business in Andaman, including business showcase and ticket-booking functionality. Worked on Google Ads and Meta Ads.",
    "imageSrc": "Assets/andamanexplorers.png",
    "width": 550,
    "height": 396,
    "animationOrder": 4,
    "slug": "-",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Andaman Explorers"
  },
  {
    "id": 32,
    "title": "Adventure Watersport",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "Water Sports"
    ],
    "categories": [
      "WordPress",
      "Hospitality"
    ],
    "liveUrl": "https://adventurewatersport.in/",
    "description": "Website for a beach water-sports business operating at Colva Beach, Goa.",
    "imageSrc": "Assets/adventurewatersport.png",
    "width": 550,
    "height": 396,
    "animationOrder": 1,
    "slug": "w-",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Adventure Watersport"
  },
  {
    "id": 33,
    "title": "Andaman GT Fishing",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "Game Fishing"
    ],
    "categories": [
      "WordPress",
      "Business Websites"
    ],
    "liveUrl": "https://andamangtfishingclub.com/",
    "description": "Website for a game-fishing business in Andaman.",
    "imageSrc": "Assets/Andaman GT Fishing.png",
    "width": 550,
    "height": 396,
    "animationOrder": 2,
    "slug": "-",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Andaman GT Fishing"
  },
  {
    "id": 34,
    "title": "Game Fishing",
    "technologies": "WordPress",
    "tags": [
      "WordPress",
      "Tourism"
    ],
    "categories": [
      "WordPress",
      "Business Websites"
    ],
    "liveUrl": "https://gamefishing.in/",
    "description": "Website for a game-fishing business in Andaman.",
    "imageSrc": "Assets/Game Fishing.png",
    "width": 550,
    "height": 396,
    "animationOrder": 3,
    "slug": "-",
    "category": "WordPress",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Game Fishing"
  },
  {
    "id": 35,
    "title": "The Goa Monitor",
    "technologies": "React frontend, WordPress backend",
    "tags": [
      "React",
      "WordPress",
      "News Portal"
    ],
    "categories": [
      "React",
      "WordPress"
    ],
    "liveUrl": "https://thegoamonitor.com/",
    "description": "News website where the frontend is built using React and the backend/content management system is powered by WordPress.",
    "imageSrc": "Assets/thegoamonitor.png",
    "width": 410,
    "height": 457,
    "animationOrder": 1,
    "slug": "",
    "category": "React",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "The Goa Monitor"
  },
  {
    "id": 36,
    "title": "Vision Hospital Goa",
    "technologies": "React",
    "tags": [
      "React",
      "Healthcare"
    ],
    "categories": [
      "React",
      "Business Websites"
    ],
    "liveUrl": "https://visionhospitalgoa.com/",
    "description": "Hospital website built using React.",
    "imageSrc": "Assets/visionhospital.png",
    "width": 410,
    "height": 457,
    "animationOrder": 2,
    "slug": "--",
    "category": "React",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Vision Hospital Goa"
  },
  {
    "id": 37,
    "title": "The Weekend Circle",
    "technologies": "React",
    "tags": [
      "React",
      "Entertainment"
    ],
    "categories": [
      "React",
      "Other"
    ],
    "liveUrl": "https://theweekendcircle.netlify.app/",
    "description": "React-based website for events and lifestyle.",
    "imageSrc": "Assets/theweekendcircle.png",
    "width": 410,
    "height": 457,
    "animationOrder": 3,
    "slug": "w",
    "category": "React",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "The Weekend Circle"
  },
  {
    "id": 38,
    "title": "Club Rickys Goa",
    "technologies": "Django",
    "tags": [
      "Django",
      "Nightlife"
    ],
    "categories": [
      "Hospitality",
      "Other"
    ],
    "liveUrl": "https://clubrickysgoa.com/",
    "description": "Nightclub website for a nightlife business in North Goa.",
    "imageSrc": "Assets/clubrickysgoa.png",
    "width": 410,
    "height": 457,
    "animationOrder": 4,
    "slug": "-",
    "category": "Hospitality",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Club Rickys Goa"
  },
  {
    "id": 39,
    "title": "Beach Paradise Miramar",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Hospitality",
      "Hotel"
    ],
    "categories": [
      "Frontend",
      "Hospitality",
      "Business Websites"
    ],
    "liveUrl": "https://www.beachparadisemiramar.com/",
    "description": "Boutique hotel and hospitality website near Caranzalem Beach, Goa showcasing rooms, amenities, and coastal stays.",
    "imageSrc": "Assets/beachparadisemirama.png",
    "width": 550,
    "height": 396,
    "animationOrder": 1,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Beach Paradise Miramar"
  },
  {
    "id": 40,
    "title": "Lifestyle Realiity",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Real Estate",
      "Luxury Living"
    ],
    "categories": [
      "Frontend",
      "Business Websites"
    ],
    "liveUrl": "https://lifestylerealiity.com/",
    "description": "Premium real estate and luxury development website showcasing modern residential and commercial living spaces.",
    "imageSrc": "Assets/lifestylerealiity.png",
    "width": 550,
    "height": 396,
    "animationOrder": 2,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Lifestyle Realiity"
  },
  {
    "id": 41,
    "title": "Imprint Verse",
    "technologies": "HTML / CSS / JavaScript",
    "tags": [
      "HTML / CSS / JS",
      "Music",
      "DJ Portfolio"
    ],
    "categories": [
      "Frontend",
      "Portfolio Websites"
    ],
    "liveUrl": "https://imprintverse.com/",
    "description": "DJ portfolio and audio production showcase website.",
    "imageSrc": "Assets/imprintverse.png",
    "width": 410,
    "height": 457,
    "animationOrder": 3,
    "slug": "-",
    "category": "Frontend",
    "likes": 120,
    "animationDelay": null,
    "buttonText": "Live Website",
    "marginClass": "",
    "imageAlt": "Imprint Verse"
  }
];

        let activeCategory = 'All';
        let visibleCount = 6;

        const projectsGrid = document.getElementById('portfolioProjectsGrid');
        const loadMoreContainer = document.getElementById('portfolioLoadMoreContainer');
        const loadMoreBtn = document.getElementById('portfolioLoadMoreBtn');
        const loadMoreText = document.getElementById('portfolioLoadMoreText');

        function renderPortfolio() {
          if (!projectsGrid) return;

          const filtered = activeCategory === 'All'
            ? portfolioData
            : portfolioData.filter((item) => item.categories && item.categories.includes(activeCategory));

          const displayed = filtered.slice(0, visibleCount);

          let html = '';
          displayed.forEach((item, index) => {
            const liveUrlAttr = item.liveUrl
              ? `href="${item.liveUrl}" target="_blank" rel="noopener noreferrer"`
              : '';

            const liveBtnHtml = item.liveUrl
              ? `<a href="${item.liveUrl}" target="_blank" rel="noopener noreferrer" class="tmp-btn hover-icon-reverse radius-round btn-border btn-sm" style="padding: 6px 16px; font-size: 12px; display: inline-flex; align-items: center; text-decoration: none;">
                   <span class="icon-reverse-wrapper">
                     <span class="btn-text">Live Website</span>
                     <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
                     <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
                   </span>
                 </a>`
              : `<span style="font-size: 12px; color: var(--color-body); opacity: 0.7; font-style: italic;">In Development</span>`;

            const extIconHtml = item.liveUrl
              ? `<a href="${item.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-ext-icon" style="color: var(--color-body); font-size: 14px; transition: all 0.25s ease; padding: 6px; display: inline-flex; align-items: center; justify-content: center;" title="Open ${item.title} in new tab" aria-label="Open ${item.title} in new tab">
                   <i class="fa-solid fa-arrow-up-right-from-square"></i>
                 </a>`
              : '';

            const tagsHtml = (item.tags || []).map((t) => 
              `<span style="font-size: 11px; padding: 3px 9px; border-radius: 4px; background: rgba(255, 255, 255, 0.04); color: var(--color-heading); opacity: 0.85; border: 1px solid rgba(255, 255, 255, 0.06); font-weight: 500;">${t}</span>`
            ).join('');

            const titleLinkHtml = item.liveUrl
              ? `<a href="${item.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-title-link" style="color: inherit; transition: color 0.25s ease; text-decoration: none;">${item.title}</a>`
              : `<span>${item.title}</span>`;

            const imgContainerContent = item.liveUrl
              ? `<a href="${item.liveUrl}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; height: 100%;" aria-label="Visit live website of ${item.title}">
                   <img loading="lazy" alt="${item.title}" src="${item.imageSrc}" class="project-thumb-img" width="410" height="256" decoding="async" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" />
                 </a>`
              : `<img loading="lazy" decoding="async" width="410" height="256" alt="${item.title}" src="${item.imageSrc}" style="width: 100%; height: 100%; object-fit: cover;" />`;

            html += `
              <div class="col-lg-4 col-md-6 col-12">
                <div
                  class="skill-category-card project-card-enhanced tmp-scroll-trigger tmp-fade-in animation-order-${(index % 3) + 1}"
                  style="background: var(--color-card, #1b1b1c); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; height: 100%; display: flex; flex-direction: column;"
                >
                  <div
                    class="project-thumb-container"
                    style="position: relative; width: 100%; aspect-ratio: 16 / 10; overflow: hidden; background: #141416;"
                  >
                    ${imgContainerContent}
                    <div
                      style="position: absolute; top: 12px; right: 12px; background: rgba(10, 10, 15, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: #ffffff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.12); letter-spacing: 0.4px; max-width: 80%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                    >
                      ${item.technologies}
                    </div>
                  </div>

                  <div style="padding: 22px 20px; display: flex; flex-direction: column; flex: 1;">
                    <h3 style="font-size: 18px; font-weight: 700; color: var(--color-heading); margin-bottom: 8px; line-height: 1.35;">
                      ${titleLinkHtml}
                    </h3>
                    <p style="font-size: 13.5px; line-height: 1.6; color: var(--color-body); margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      ${item.description}
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px;">
                      ${tagsHtml}
                    </div>
                    <div style="margin-top: auto; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.06); display: flex; justify-content: space-between; align-items: center;">
                      ${liveBtnHtml}
                      ${extIconHtml}
                    </div>
                  </div>
                </div>
              </div>
            `;
          });

          projectsGrid.innerHTML = html;

          if (window.observeScrollTriggers) {
            window.observeScrollTriggers(projectsGrid);
          }

          // Load more visibility
          if (filtered.length > visibleCount) {
            if (loadMoreContainer) loadMoreContainer.style.display = 'block';
            if (loadMoreText) {
              const remaining = filtered.length - visibleCount;
              loadMoreText.textContent = `Load More Projects (${remaining} remaining)`;
            }
          } else {
            if (loadMoreContainer) loadMoreContainer.style.display = 'none';
          }
        }

        // Initial render
        renderPortfolio();

        // Category tabs click
        const filterTabBtns = document.querySelectorAll('#portfolioFilterTabs button');
        filterTabBtns.forEach((btn) => {
          btn.addEventListener('click', function() {
            filterTabBtns.forEach((b) => {
              b.classList.remove('active');
              b.style.border = '1px solid rgba(255, 255, 255, 0.08)';
              b.style.background = 'rgba(255, 255, 255, 0.03)';
              b.style.color = 'var(--color-heading)';
              b.style.boxShadow = 'none';
            });

            this.classList.add('active');
            this.style.border = '1px solid var(--color-btn-primary, #d80042)';
            this.style.background = 'var(--color-btn-primary, #d80042)';
            this.style.color = '#ffffff';
            this.style.boxShadow = '0 4px 20px rgba(255, 1, 79, 0.4)';

            activeCategory = this.getAttribute('data-category') || 'All';
            visibleCount = 6;
            renderPortfolio();
          });
        });

        // Load More click
        if (loadMoreBtn) {
          loadMoreBtn.addEventListener('click', () => {
            visibleCount += 6;
            renderPortfolio();
          });
        }

        // 12. Card Mouse Move Position Tracking (--x, --y)
        document.querySelectorAll('.tmponhover').forEach((card) => {
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--y', `${e.clientY - rect.top}px`);
          });
        });

        // 13. High-Performance IntersectionObserver for Entrance Animations (.tmp-scroll-trigger)
        if ('IntersectionObserver' in window) {
          document.documentElement.classList.add('js-scroll-active');

          const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add('tmp-in-view');
                target.classList.add('tmp-animated');
                target.classList.remove('tmp-scroll-trigger--offscreen');
                scrollObserver.unobserve(target);
              }
            });
          }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
          });

          function observeScrollTriggers(container) {
            const root = container || document;
            root.querySelectorAll('.tmp-scroll-trigger').forEach((el) => {
              scrollObserver.observe(el);
            });
          }

          observeScrollTriggers();
          window.observeScrollTriggers = observeScrollTriggers;
        }

      })();
