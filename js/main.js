document.addEventListener('DOMContentLoaded', () => {
  initTickerBanner();
  initBrandsMarquee();
  initHeroSlider();
  initHeader();
  initContactForm();
});

function initTickerBanner() {
  const banner = document.getElementById('tickerBanner');
  const track = document.getElementById('tickerTrack');
  if (!banner || !track) return;

  const template = track.innerHTML.trim();
  if (!template) return;

  const speed = 1.35;
  let itemWidth = 0;
  let offset = 0;
  let paused = false;

  const fillTrack = () => {
    track.innerHTML = template;
    while (track.scrollWidth < banner.offsetWidth * 2) {
      track.insertAdjacentHTML('beforeend', template);
    }
    const first = track.firstElementChild;
    itemWidth = first ? first.getBoundingClientRect().width : 0;
  };

  fillTrack();
  track.classList.add('ticker-banner__track--running');

  banner.addEventListener('mouseenter', () => { paused = true; });
  banner.addEventListener('mouseleave', () => { paused = false; });

  window.addEventListener('resize', () => {
    offset = 0;
    fillTrack();
  });

  const step = () => {
    if (itemWidth <= 0) fillTrack();
    if (!paused && itemWidth > 0) {
      offset -= speed;
      if (Math.abs(offset) >= itemWidth) offset += itemWidth;
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    }
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function initBrandsMarquee() {
  const track = document.getElementById('brandsMarqueeTrack');
  const marquee = track?.closest('.brands-marquee');
  if (!track || !marquee) return;

  const speed = 1.15;
  let offset = 0;
  let loopWidth = 0;
  let paused = false;
  let jsActive = false;

  const measure = () => {
    const half = Math.floor(track.children.length / 2);
    if (half < 1) return false;

    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    let width = 0;

    for (let i = 0; i < half; i += 1) {
      width += track.children[i].getBoundingClientRect().width;
    }
    width += gap * Math.max(half - 1, 0);

    if (width > 0) {
      loopWidth = width;
      return true;
    }
    return false;
  };

  const enableJsScroll = () => {
    if (jsActive) return;
    if (!measure()) return;
    jsActive = true;
    track.classList.add('brands-marquee__track--running');
  };

  marquee.addEventListener('mouseenter', () => { paused = true; });
  marquee.addEventListener('mouseleave', () => { paused = false; });

  window.addEventListener('resize', () => {
    offset = 0;
    jsActive = false;
    track.classList.remove('brands-marquee__track--running');
    track.style.transform = '';
    enableJsScroll();
  });

  window.addEventListener('load', enableJsScroll);

  track.querySelectorAll('img').forEach((img) => {
    img.addEventListener('load', enableJsScroll, { once: true });
    img.addEventListener('error', enableJsScroll, { once: true });
  });

  const step = () => {
    if (!jsActive) enableJsScroll();

    if (!paused && loopWidth > 0) {
      offset -= speed;
      if (Math.abs(offset) >= loopWidth) offset += loopWidth;
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    }

    requestAnimationFrame(step);
  };

  enableJsScroll();
  requestAnimationFrame(step);
}

function initHeroSlider() {
  const heroSlider = document.querySelector('.hero__slider');
  if (!heroSlider) return;

  const slides = heroSlider.querySelectorAll('.hero__slide');
  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('hero__slide--active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('hero__slide--active');
  }, 2000);
}

function initHeader() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const WHATSAPP_NUMBER = '212764958502';

  const serviceLabels = {
    depannage: 'Dépannage batterie à domicile',
    remplacement: 'Remplacement de batterie',
    diagnostic: 'Diagnostic batterie',
    autre: 'Autre demande'
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!service) {
      document.getElementById('service').focus();
      return;
    }

    const serviceLabel = serviceLabels[service] || service;

    let text = 'Bonjour, je vous contacte depuis le site Batterie dépannage à domicile.\n\n';
    text += '*Demande de renseignements*\n';
    text += `Nom : ${name}\n`;
    text += `Téléphone : ${phone}\n`;
    text += `Localisation : ${location}\n`;
    text += `Service : ${serviceLabel}`;

    if (message) {
      text += `\nMessage : ${message}`;
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    contactForm.reset();
  });
}
