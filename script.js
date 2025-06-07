class PortfolioManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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
    
    const texts = ["Loading Portfolio...", "Preparing Experience...", "Almost Ready...", "Welcome!"];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    const typingElement = document.getElementById("typing-text");

    const type = () => {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 1000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    };

    type();

    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
        mainContent.classList.remove("d-none");
      }, 500);
    }, 4000);
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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
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
}

document.addEventListener("DOMContentLoaded", () => {
  new PortfolioManager();
});