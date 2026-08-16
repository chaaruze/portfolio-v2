(() => {
  document.documentElement.classList.add("js");

  const header = document.getElementById("site-header");
  const nav = document.getElementById("primary-nav");
  const toggle = document.querySelector(".nav-toggle");
  const internalNavLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const closeNavigation = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  toggle?.addEventListener("click", () => {
    if (!nav) return;
    const willOpen = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(willOpen));
    toggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("nav-open", willOpen);
  });

  internalNavLinks.forEach((link) => link.addEventListener("click", closeNavigation));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeNavigation();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = [...document.querySelectorAll(".reveal")];
  const revealAll = () => revealItems.forEach((item) => item.classList.add("is-visible"));

  if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -32px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const numberFormatter = new Intl.NumberFormat("en-US");
  const countTargets = [...document.querySelectorAll("[data-count-up]")];
  const finishCount = (element) => {
    const value = Number(element.dataset.countTarget || 0);
    const suffix = element.dataset.countSuffix || "";
    const output = element.querySelector("[aria-hidden='true']") || element;
    output.textContent = `${numberFormatter.format(value)}${suffix}`;
  };

  const animateCount = (element) => {
    if (element.dataset.countComplete === "true") return;
    element.dataset.countComplete = "true";
    const target = Number(element.dataset.countTarget || 0);
    const suffix = element.dataset.countSuffix || "";
    const output = element.querySelector("[aria-hidden='true']") || element;
    const startedAt = performance.now();
    const duration = 1050;
    const step = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      output.textContent = `${numberFormatter.format(Math.round(target * eased))}${suffix}`;
      if (progress < 1) window.requestAnimationFrame(step);
      else finishCount(element);
    };
    output.textContent = `0${suffix}`;
    window.requestAnimationFrame(step);
  };

  if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
    countTargets.forEach(finishCount);
  } else {
    const countOwners = [...new Set(countTargets.map((target) => target.closest(".reveal") || target))];
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const targets = entry.target.matches("[data-count-up]")
          ? [entry.target]
          : [...entry.target.querySelectorAll("[data-count-up]")];
        window.setTimeout(() => targets.forEach(animateCount), 140);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.32, rootMargin: "0px 0px -8%" });
    countOwners.forEach((owner) => countObserver.observe(owner));
  }

  const mediaModal = document.getElementById("media-modal");
  const modalImage = mediaModal?.querySelector(".media-modal-canvas img");
  const modalTitle = mediaModal?.querySelector("#media-modal-title");
  const modalClose = mediaModal?.querySelector(".media-modal-close");
  const openMediaModal = (trigger) => {
    if (!mediaModal || !modalImage || !trigger.dataset.modalSrc) return;
    modalImage.src = trigger.dataset.modalSrc;
    modalImage.alt = trigger.dataset.modalAlt || "Expanded project evidence";
    if (modalTitle) modalTitle.textContent = trigger.dataset.modalAlt || "Project evidence";
    mediaModal.showModal();
  };

  modalClose?.addEventListener("click", () => mediaModal.close());
  mediaModal?.addEventListener("click", (event) => {
    if (event.target === mediaModal) mediaModal.close();
  });

  document.querySelectorAll("[data-media-carousel]").forEach((carousel) => {
    const cards = [...carousel.querySelectorAll("[data-carousel-card]")];
    let activeIndex = Math.max(0, cards.findIndex((card) => card.classList.contains("is-active")));
    const renderCarousel = () => {
      carousel.classList.toggle("is-single", cards.length === 1);
      cards.forEach((card, index) => {
        const relation = (index - activeIndex + cards.length) % cards.length;
        const isActive = index === activeIndex;
        const isLeft = cards.length === 2 ? index < activeIndex : relation === cards.length - 1;
        const isRight = cards.length === 2 ? index > activeIndex : relation === 1;
        card.classList.toggle("is-active", isActive);
        card.classList.toggle("is-single", cards.length === 1);
        card.classList.toggle("is-right", !isActive && isRight);
        card.classList.toggle("is-left", !isActive && isLeft);
        card.setAttribute("aria-pressed", String(isActive));
      });
    };
    cards.forEach((card, index) => card.addEventListener("click", () => {
      if (index === activeIndex) openMediaModal(card);
      else {
        activeIndex = index;
        renderCarousel();
      }
    }));
    carousel.addEventListener("keydown", (event) => {
      if (cards.length < 2 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      activeIndex = (activeIndex + direction + cards.length) % cards.length;
      renderCarousel();
      cards[activeIndex].focus();
    });
    renderCarousel();
  });

  document.querySelectorAll(".modal-text-trigger, .credential-thumb").forEach((trigger) => {
    trigger.addEventListener("click", () => openMediaModal(trigger));
  });

  const mobileProjectIntroQuery = window.matchMedia("(max-width: 900px)");
  const mobileProjectSections = [...document.querySelectorAll("[data-project-sequence]")];
  let mobileProjectIntroObserver;
  const setMobileProjectIntros = () => {
    mobileProjectIntroObserver?.disconnect();
    if (!mobileProjectIntroQuery.matches || reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
      mobileProjectSections.forEach((section) => section.classList.add("is-mobile-intro-visible"));
      return;
    }
    mobileProjectIntroObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-mobile-intro-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.24, rootMargin: "0px 0px -12%" });
    mobileProjectSections.forEach((section) => {
      section.classList.remove("is-mobile-intro-visible");
      mobileProjectIntroObserver.observe(section);
    });
  };
  setMobileProjectIntros();
  if (typeof mobileProjectIntroQuery.addEventListener === "function") {
    mobileProjectIntroQuery.addEventListener("change", setMobileProjectIntros);
  } else {
    mobileProjectIntroQuery.addListener(setMobileProjectIntros);
  }

  const pageSections = internalNavLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && pageSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        internalNavLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-26% 0px -64%", threshold: 0 });
    pageSections.forEach((section) => sectionObserver.observe(section));
  }

  const storyGroups = [...document.querySelectorAll("[data-story]")];
  let storyFrame = 0;
  const updateStoryChapters = () => {
    storyFrame = 0;
    storyGroups.forEach((group) => {
      const chapters = [...group.querySelectorAll(".story-chapter")];
      if (!chapters.length) return;
      const summary = group.querySelector(".project-story-summary");
      const summaryBottom = summary?.getBoundingClientRect().bottom || window.innerHeight * 0.34;
      const readingLine = Math.min(window.innerHeight - 48, Math.max(summaryBottom + 24, window.innerHeight * 0.38));
      let activeChapter = chapters[0];
      chapters.forEach((chapter) => {
        if (chapter.getBoundingClientRect().top <= readingLine) activeChapter = chapter;
      });
      chapters.forEach((chapter) => chapter.classList.toggle("is-active", chapter === activeChapter));
    });
  };
  const queueStoryUpdate = () => {
    if (storyFrame) return;
    storyFrame = window.requestAnimationFrame(updateStoryChapters);
  };
  if (!reduceMotionQuery.matches) {
    updateStoryChapters();
    window.addEventListener("scroll", queueStoryUpdate, { passive: true });
    window.addEventListener("resize", queueStoryUpdate);
  }

  const projectSequences = [...document.querySelectorAll("[data-project-sequence] .project-scroll-track")];
  const projectSequenceQuery = window.matchMedia("(min-width: 901px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
  const presentationPause = 1400;
  const settleFallback = 840;
  const lockFailsafe = 3200;
  const blockedScrollKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Spacebar", "Home", "End"]);
  const completedProjectSequences = new WeakSet();
  const projectSequenceTimers = new Map();
  let projectSequenceObserver;
  let activeProjectLock = null;

  const setStoryAvailability = (track, available) => {
    const story = track.querySelector(".project-story-layout");
    if (!story) return;
    story.inert = !available;
    if (available) story.removeAttribute("aria-hidden");
    else story.setAttribute("aria-hidden", "true");
  };

  const measureProjectSummaries = () => {
    projectSequences.forEach((track) => {
      const summary = track.querySelector(".project-story-summary");
      if (summary) track.style.setProperty("--project-summary-height", `${Math.ceil(summary.getBoundingClientRect().height)}px`);
    });
  };

  const updateProjectSequenceOffsets = () => {
    measureProjectSummaries();
    if (!projectSequenceQuery.matches) return;
    projectSequences.forEach((track) => {
      const layout = track.querySelector(".project-sequence-layout");
      const media = track.querySelector(".project-sequence-media");
      if (!layout || !media) return;
      const layoutRect = layout.getBoundingClientRect();
      const finalCenter = layoutRect.left + media.offsetLeft + (media.offsetWidth / 2);
      media.style.setProperty("--sequence-center-shift", `${(window.innerWidth / 2) - finalCenter}px`);
    });
  };

  const preventLockedScroll = (event) => {
    if (!activeProjectLock) return;
    event.preventDefault();
  };

  const maintainLockedPosition = () => {
    if (!activeProjectLock || Math.abs(window.scrollY - activeProjectLock.scrollY) < 1) return;
    window.scrollTo(0, activeProjectLock.scrollY);
  };

  const releaseProjectLock = () => {
    if (!activeProjectLock) return;
    document.documentElement.classList.remove("project-presentation-locked");
    window.removeEventListener("wheel", preventLockedScroll);
    window.removeEventListener("touchmove", preventLockedScroll);
    window.removeEventListener("scroll", maintainLockedPosition);
    document.removeEventListener("keydown", handleLockedKey);
    activeProjectLock = null;
  };

  const clearProjectTimers = (track) => {
    const timers = projectSequenceTimers.get(track);
    if (!timers) return;
    timers.forEach((timer) => window.clearTimeout(timer));
    projectSequenceTimers.delete(track);
  };

  const finishProjectSequence = (track) => {
    if (!track) return;
    clearProjectTimers(track);
    const lockedScrollY = activeProjectLock?.track === track ? activeProjectLock.scrollY : null;
    track.classList.add("is-sequence-active", "is-sequence-settled", "is-sequence-complete");
    completedProjectSequences.add(track);
    setStoryAvailability(track, true);
    const trigger = track.querySelector(".project-sequence-trigger");
    if (trigger) projectSequenceObserver?.unobserve(trigger);
    if (lockedScrollY !== null) {
      window.scrollTo(0, lockedScrollY);
      window.requestAnimationFrame(() => {
        window.scrollTo(0, lockedScrollY);
        releaseProjectLock();
      });
    }
  };

  function handleLockedKey(event) {
    if (!activeProjectLock) return;
    if (event.key === "Escape") {
      event.preventDefault();
      finishProjectSequence(activeProjectLock.track);
      return;
    }
    if (blockedScrollKeys.has(event.key)) event.preventDefault();
  }

  const lockProjectSequence = (track) => {
    if (activeProjectLock || completedProjectSequences.has(track)) return;
    const cover = track.querySelector(".project-sequence-cover");
    const targetY = Math.max(0, window.scrollY + (cover?.getBoundingClientRect().top || 0));
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, targetY);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    activeProjectLock = { track, scrollY: targetY };
    document.documentElement.classList.add("project-presentation-locked");
    window.addEventListener("wheel", preventLockedScroll, { passive: false });
    window.addEventListener("touchmove", preventLockedScroll, { passive: false });
    window.addEventListener("scroll", maintainLockedPosition, { passive: true });
    document.addEventListener("keydown", handleLockedKey);
    setStoryAvailability(track, false);
    track.classList.add("is-sequence-active");

    const timers = new Set();
    projectSequenceTimers.set(track, timers);

    timers.add(window.setTimeout(() => {
      const media = track.querySelector(".project-sequence-media");
      let settled = false;
      const finishAfterSettle = (event) => {
        if (settled || (event && event.propertyName !== "transform")) return;
        settled = true;
        media?.removeEventListener("transitionend", finishAfterSettle);
        finishProjectSequence(track);
      };
      media?.addEventListener("transitionend", finishAfterSettle);
      track.classList.add("is-sequence-settled");
      timers.add(window.setTimeout(() => finishAfterSettle(), settleFallback));
    }, presentationPause));

    timers.add(window.setTimeout(() => finishProjectSequence(track), lockFailsafe));
  };

  const observeProjectSequences = () => {
    projectSequenceObserver?.disconnect();
    if (!projectSequenceQuery.matches || !projectSequences.length || !("IntersectionObserver" in window)) return;

    projectSequenceObserver = new IntersectionObserver((entries) => {
      const candidate = entries
        .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.88)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!candidate || activeProjectLock) return;
      const track = candidate.target.closest(".project-scroll-track");
      if (!track || completedProjectSequences.has(track)) return;
      lockProjectSequence(track);
    }, { threshold: [0.88, 0.92, 1] });

    projectSequences.forEach((track) => {
      if (completedProjectSequences.has(track)) return;
      const trigger = track.querySelector(".project-sequence-trigger");
      if (trigger) projectSequenceObserver.observe(trigger);
    });
  };

  const setProjectSequenceEligibility = () => {
    const enabled = projectSequenceQuery.matches && projectSequences.length > 0 && "IntersectionObserver" in window;
    document.documentElement.classList.toggle("project-sequences-enabled", enabled);

    if (enabled) {
      projectSequences.forEach((track) => {
        const complete = completedProjectSequences.has(track);
        track.classList.toggle("is-sequence-active", complete);
        track.classList.toggle("is-sequence-settled", complete);
        track.classList.toggle("is-sequence-complete", complete);
        setStoryAvailability(track, complete);
      });
      window.requestAnimationFrame(updateProjectSequenceOffsets);
      observeProjectSequences();
      return;
    }

    if (activeProjectLock) finishProjectSequence(activeProjectLock.track);
    releaseProjectLock();
    projectSequenceObserver?.disconnect();
    projectSequences.forEach((track) => {
      clearProjectTimers(track);
      track.classList.remove("is-sequence-active", "is-sequence-settled", "is-sequence-complete");
      track.querySelector(".project-sequence-media")?.style.removeProperty("--sequence-center-shift");
      setStoryAvailability(track, true);
    });
  };

  const summaryResizeObserver = "ResizeObserver" in window ? new ResizeObserver(measureProjectSummaries) : null;
  projectSequences.forEach((track) => {
    const summary = track.querySelector(".project-story-summary");
    if (summary) summaryResizeObserver?.observe(summary);
  });

  setProjectSequenceEligibility();
  window.addEventListener("load", () => {
    updateProjectSequenceOffsets();
    observeProjectSequences();
  }, { once: true });
  window.addEventListener("resize", updateProjectSequenceOffsets);
  window.addEventListener("pageshow", () => {
    releaseProjectLock();
    setProjectSequenceEligibility();
  });
  window.addEventListener("pagehide", releaseProjectLock);
  if (typeof projectSequenceQuery.addEventListener === "function") {
    projectSequenceQuery.addEventListener("change", setProjectSequenceEligibility);
  } else {
    projectSequenceQuery.addListener(setProjectSequenceEligibility);
  }

  const indicator = document.querySelector(".page-scroll-indicator");
  const indicatorDots = indicator ? [...indicator.querySelectorAll("[data-indicator-for]")] : [];
  const indicatorSections = indicatorDots
    .map((dot) => ({ dot, section: document.getElementById(dot.dataset.indicatorFor) }))
    .filter(({ section }) => section);
  const toneSections = [...document.querySelectorAll("[data-indicator-tone]")];
  let indicatorFrame = 0;

  const updateScrollIndicator = () => {
    indicatorFrame = 0;
    if (!indicator || !indicatorSections.length) return;
    const center = window.innerHeight / 2;
    const toneSection = toneSections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= center && rect.bottom > center;
    });
    document.documentElement.dataset.indicatorTone = toneSection?.dataset.indicatorTone || "dark";

    let active = indicatorSections[0];
    indicatorSections.forEach((item) => {
      if (item.section.getBoundingClientRect().top <= center) active = item;
    });
    indicatorSections.forEach(({ dot }) => dot.classList.toggle("is-active", dot === active.dot));
  };

  const queueScrollIndicatorUpdate = () => {
    if (indicatorFrame) return;
    indicatorFrame = window.requestAnimationFrame(updateScrollIndicator);
  };

  updateScrollIndicator();
  window.addEventListener("scroll", queueScrollIndicatorUpdate, { passive: true });
  window.addEventListener("resize", queueScrollIndicatorUpdate);

  const caseLinks = [...document.querySelectorAll(".case-toc nav a")];
  const caseSections = caseLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && caseSections.length) {
    const caseObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        caseLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-18% 0px -70%", threshold: 0 });
    caseSections.forEach((section) => caseObserver.observe(section));
  }

  const progressBar = document.getElementById("reading-progress-bar");
  if (progressBar) {
    const updateReadingProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progressBar.style.width = `${progress * 100}%`;
    };
    updateReadingProgress();
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
    window.addEventListener("resize", updateReadingProgress);
  }

  // Future video-ready media frames load sources only after explicit user activation.
  document.querySelectorAll("[data-video-loader]").forEach((button) => {
    button.addEventListener("click", () => {
      const frame = button.closest("[data-media-frame]");
      const video = frame?.querySelector("video");
      if (!video || video.dataset.loaded === "true") return;

      const sources = [
        [button.dataset.webm, "video/webm"],
        [button.dataset.mp4, "video/mp4"]
      ].filter(([src]) => Boolean(src));

      sources.forEach(([src, type]) => {
        const source = document.createElement("source");
        source.src = src;
        source.type = type;
        video.append(source);
      });
      video.dataset.loaded = "true";
      video.load();
      video.play().catch(() => undefined);
    });
  });

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
