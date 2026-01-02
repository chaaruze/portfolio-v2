class PortfolioManager {
  constructor() {
    // Detect browser theme preference
    this.theme = localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
      if (!localStorage.getItem("theme")) {
        this.theme = e.matches ? "dark" : "light";
        this.applyTheme();
      }
    });

    this.init();
  }

  init() {
    this.applyTheme();
    this.setupThemeToggle();
    this.setupLoading();
    this.setupScrollProgress();
    this.setupNavigation();
    this.setupHeroTyping();
    this.setupEmailJS();
    this.setupForm();
    this.setupAOS();
    this.setupMatrixRain();
    this.setupStatCounters();
    this.setupProgressLog();
  }

  setupMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Binary characters - 0s and 1s only
    const chars = '01';
    const charArray = chars.split('');

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);

    // Array to track the y position and speed of each column
    let drops = [];
    let speeds = [];

    const initDrops = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      speeds = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
        speeds[i] = 0.5 + Math.random() * 1.5; // Variable speeds for 3D depth effect
      }
    };
    initDrops();
    window.addEventListener('resize', initDrops);

    // Parallax scroll multiplier
    let parallaxOffset = 0;
    window.addEventListener('scroll', () => {
      parallaxOffset = window.pageYOffset * 0.3;
    });

    // Get the rain color - yellow to match accent
    const getMatrixColor = () => {
      return '#ffc107';
    };

    // Get background color for fade effect
    const getBackgroundColor = () => {
      const theme = document.body.getAttribute('data-theme');
      return theme === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    };

    const draw = () => {
      // Semi-transparent background to create fade effect
      ctx.fillStyle = getBackgroundColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const baseColor = getMatrixColor();

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // Calculate y position with parallax offset
        const yPos = (drops[i] * fontSize) + (parallaxOffset * speeds[i] * 0.1);

        // Vary opacity based on speed (creates depth/3D effect)
        const opacity = 0.3 + (speeds[i] / 2) * 0.7;
        ctx.fillStyle = baseColor.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('#000000', 'rgba(0,0,0').replace('#ffffff', 'rgba(255,255,255');

        // Vary font size slightly based on speed for depth
        const depthFontSize = fontSize * (0.8 + speeds[i] * 0.2);
        ctx.font = `${depthFontSize}px monospace`;

        // Draw the character
        ctx.fillText(char, i * fontSize, yPos);

        // Reset drop to top with random delay when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.5 + Math.random() * 1.5;
        }

        // Move drop down based on individual speed
        drops[i] += speeds[i];
      }
    };

    // Run animation at ~30fps for performance
    setInterval(draw, 33);
  }

  applyTheme() {
    document.body.setAttribute("data-theme", this.theme);
    const sunIcon = document.querySelector(".sun-icon");
    const moonIcon = document.querySelector(".moon-icon");

    if (this.theme === "dark") {
      sunIcon?.classList.remove("d-none");
      moonIcon?.classList.add("d-none");
    } else {
      sunIcon?.classList.add("d-none");
      moonIcon?.classList.remove("d-none");
    }
  }

  setupThemeToggle() {
    document.getElementById("theme-toggle")?.addEventListener("click", () => {
      this.theme = this.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", this.theme);
      this.applyTheme();
    });
  }

  setupLoading() {
    const loadingScreen = document.getElementById("loading-screen");
    const mainContent = document.getElementById("main-content");

    // Terminal commands to type
    const commands = [
      { id: 'terminal-command-1', text: 'cd ~/portfolio', delay: 0 },
      { id: 'terminal-command-2', text: 'npm run build', delay: 1200, showLine: 'terminal-line-2' },
      { id: 'terminal-command-3', text: './start-server.sh', delay: 2400, showLine: 'terminal-line-3' }
    ];

    const typeCommand = (element, text, callback) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(interval);
          if (callback) callback();
        }
      }, 50);
    };

    // Start terminal animation
    commands.forEach((cmd, index) => {
      setTimeout(() => {
        if (cmd.showLine) {
          document.getElementById(cmd.showLine).style.display = 'flex';
        }
        const element = document.getElementById(cmd.id);
        typeCommand(element, cmd.text, () => {
          if (index === commands.length - 1) {
            // Show output after last command
            setTimeout(() => {
              const outputLine = document.getElementById('terminal-line-4');
              const output = document.getElementById('terminal-output');
              outputLine.style.display = 'block';
              output.textContent = '✓ Portfolio ready! Launching...';
              output.style.color = '#00ff41';
            }, 500);
          }
        });
      }, cmd.delay);
    });

    // Hide loading screen after animation completes
    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
        mainContent.classList.remove("d-none");
      }, 500);
    }, 4500);
  }

  setupScrollProgress() {
    const progressBar = document.getElementById("scroll-progress");
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + "%";
    });
  }

  setupNavigation() {
    const navbarCollapse = document.querySelector('.navbar-collapse');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });

          // Close hamburger menu on mobile after clicking a link
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
          }
        }
      });
    });

    window.addEventListener("scroll", () => {
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-link");
      let current = "";
      const headerHeight = document.querySelector('.header').offsetHeight;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    });
  }

  setupHeroTyping() {
    setTimeout(() => {
      if (typeof Typed !== 'undefined') {
        new Typed('#hero-typing-text', {
          strings: ['Web Developer', 'College Student', 'Lifelong Learner', 'Future Cybersecurity Specialist'],
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000,
          loop: true,
          cursorChar: '|'
        });
      }
    }, 4500);
  }

  setupEmailJS() {
    emailjs.init('nyvjlQiyipmUqGw1n');
  }

  setupForm() {
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");

    form?.addEventListener("submit", (e) => {
      e.preventDefault();

      const btnText = submitBtn.querySelector(".btn-text");
      const btnSpinner = submitBtn.querySelector(".btn-spinner");

      btnText.classList.add("d-none");
      btnSpinner.classList.remove("d-none");
      submitBtn.disabled = true;

      emailjs.sendForm('service_qple79z', 'template_2ia5xor', form)
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          this.showToast("Message Sent!", "Thank you for your message. I'll get back to you soon!", "success");
          form.reset();
        })
        .catch((error) => {
          console.log('FAILED...', error);
          this.showToast("Error", "Failed to send message. Please try again or email me directly.", "error");
        })
        .finally(() => {
          btnText.classList.remove("d-none");
          btnSpinner.classList.add("d-none");
          submitBtn.disabled = false;
        });
    });
  }

  setupAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        delay: 200
      });
    }
  }

  showToast(title, description, type = "success") {
    const toast = document.getElementById("toast");
    const toastTitle = toast.querySelector(".toast-title");
    const toastDescription = toast.querySelector(".toast-description");
    const toastContent = toast.querySelector(".toast-content");

    if (type === "error") {
      toastContent.classList.remove("bg-success");
      toastContent.classList.add("bg-danger");
    } else {
      toastContent.classList.remove("bg-danger");
      toastContent.classList.add("bg-success");
    }

    toastTitle.textContent = title;
    toastDescription.textContent = description;

    toast.classList.remove("d-none");
    setTimeout(() => toast.classList.add("show"), 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("d-none"), 300);
    }, 5000);
  }

  setupStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const animateCounter = (element) => {
      const target = parseInt(element.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
        }
      };

      updateCounter();
    };

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  setupProgressLog() {
    const MARKDOWN_FILE = 'PROGRESS_LOG.md';
    const markdownContainer = document.getElementById('progress-markdown-content');
    const lastUpdated = document.getElementById('progress-last-updated');
    const reloadBtn = document.getElementById('progress-reload');

    if (!markdownContainer) return;

    // Load markdown on page load
    loadMarkdown();

    // Reload button
    reloadBtn?.addEventListener('click', () => {
      loadMarkdown();
    });

    async function loadMarkdown() {
      markdownContainer.innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-spinner fa-spin fa-3x text-primary mb-3"></i>
          <p class="text-secondary">Loading progress log...</p>
        </div>
      `;

      try {
        const response = await fetch(MARKDOWN_FILE + '?t=' + Date.now());

        if (!response.ok) {
          throw new Error('Failed to load');
        }

        const markdown = await response.text();

        if (typeof marked !== 'undefined') {
          marked.setOptions({ gfm: true, breaks: true });
          const html = marked.parse(markdown);
          markdownContainer.innerHTML = html;
          convertCheckboxes();
          lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
        } else {
          throw new Error('Marked.js not loaded');
        }
      } catch (error) {
        console.error('Error loading markdown:', error);
        markdownContainer.innerHTML = `
          <div class="text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
            <h4>Failed to load progress log</h4>
            <p class="text-secondary">Make sure PROGRESS_LOG.md exists in the portfolio folder.</p>
          </div>
        `;
      }
    }

    function convertCheckboxes() {
      const listItems = markdownContainer.querySelectorAll('li');
      listItems.forEach(li => {
        const text = li.innerHTML;
        if (text.startsWith('[ ] ')) {
          li.innerHTML = '<input type="checkbox" disabled> ' + text.substring(4);
        } else if (text.startsWith('[x] ') || text.startsWith('[X] ')) {
          li.innerHTML = '<input type="checkbox" checked disabled> ' + text.substring(4);
        } else if (text.startsWith('[/] ')) {
          li.innerHTML = '<input type="checkbox" disabled style="opacity: 0.5;"> <em>(In Progress)</em> ' + text.substring(4);
        }
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PortfolioManager();
});