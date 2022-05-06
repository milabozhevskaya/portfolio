import { i18Obj } from './assets/locales/translate.js';

const htmlElement = document.getElementsByTagName("html")[0];
const currentTheme = (
  (
    localStorage.getItem('portfolio_theme') ? localStorage.getItem('portfolio_theme') : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light')
);
htmlElement.dataset.theme = currentTheme;

let currentSeason = (localStorage.getItem('portfolio_season') ? localStorage.getItem('portfolio_season') : 'winter');
localStorage.setItem('portfolio_season', currentSeason);

const data = document.querySelector('.footer__date');
const wrapper = document.querySelector('.wrapper');
const header = document.querySelector('.header');
const form = document.querySelector('.form');
const portfolioBtns = document.querySelectorAll('.portfolio__btn');
const hireMe = document.querySelector('._hire-me');
const navTabs = document.querySelectorAll('.nav__item');
const hamb = document.querySelector('.hamburger-menu');
const hambInput = document.querySelector('.hamburger-menu__input');
const portfolioBtnsList = document.querySelector('.portfolio__btn-list');
const writingData = new Date();
const portfolioImages = document.querySelectorAll('.portfolio__pic');
const languages = document.querySelector('.languages');
const languageList = document.querySelectorAll('.languages button');
const translateList = document.querySelectorAll('[data-i18n]');

(function() {
  let storageLanguage = localStorage.getItem('portfolio_lang');
  const currentLanguage = htmlElement.dataset.lang;
  const LANGUAGES = ['en', 'ru'];

  if (!storageLanguage) {
    let browserLanguage = window.navigator.language.slice(0, 2);
    browserLanguage = (LANGUAGES.includes(browserLanguage) ? browserLanguage : 'en');
    localStorage.setItem('portfolio_lang', browserLanguage);

    if (browserLanguage !== currentLanguage) {
      getTranslate(translateList, i18Obj[browserLanguage]);
      htmlElement.dataset.lang = browserLanguage;
    }
  } else if (storageLanguage && (storageLanguage !== currentLanguage)) {
    storageLanguage = (LANGUAGES.includes(storageLanguage) ? storageLanguage : 'en');
    localStorage.setItem('portfolio_lang', storageLanguage);
    getTranslate(translateList, i18Obj[storageLanguage]);
    htmlElement.dataset.lang = storageLanguage;
  }

  languageList.forEach(lang => {
    if (lang.dataset.lang === htmlElement.dataset.lang) {
      lang.classList.add('active');
    }
  });
})();

let lastOffset = window.pageYOffset;

if (window.pageYOffset > 80) {
  header.classList.add('float');
  wrapper.setAttribute('data-header', 'float');
}

const seasons = ['winter', 'spring', 'summer', 'autumn'];
preloadImages(seasons);
setImage(portfolioImages, currentSeason);
portfolioBtns.forEach(btn => {
  if (btn.dataset.season === currentSeason) btn.classList.add('btn--active');
})

window.addEventListener('load', () => {
  wrapper.classList.remove('hide');

  document.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
      header.classList.add('float');
      wrapper.setAttribute('data-header', 'float');
    } else if (window.pageYOffset <= 0) {
      header.classList.remove('float');
      wrapper.setAttribute('data-header', '');
    }
  
    if (lastOffset > window.pageYOffset) {
      header.classList.add('active');
    } else {
      header.classList.remove('active');
    }
  
    lastOffset = window.pageYOffset;
  });

  const btns = document.querySelectorAll('.btn');
  btns.forEach(btn => {
    btn.onmousemove = function(e) {
      const x = e.clientX - btn.getBoundingClientRect().left;
      const y = e.clientY - btn.getBoundingClientRect().top;
      btn.style.setProperty('--x', x + 'px');
      btn.style.setProperty('--y', y + 'px');
      btn.style.setProperty('--size', 60 + 'px');
    };
    btn.onmouseleave = function(e) {
      btn.style.setProperty('--size', 0 + 'px');
    };
    btn.onclick = function(e) {
      btn.style.setProperty('--size', 600 + 'px');
    }
  });

  const themeTabs = document.querySelector('.theme');
  themeTabs.addEventListener('click', function(event) {
    event.preventDefault();
    const theme = (htmlElement.dataset.theme === 'dark') ? 'light' : 'dark';
    htmlElement.dataset.theme = theme;
    localStorage.setItem('portfolio_theme', theme);
  });

  languages.addEventListener('click', event => {
    if (event.target.dataset.lang === htmlElement.dataset.lang) return;

    translateList.forEach(item => item.classList.add('slowChanges'));
    setTimeout(() => translateList.forEach(item => item.classList.remove('slowChanges')), 1200);
    setTimeout(() => getTranslate(translateList, i18Obj[event.target.dataset.lang]), 700);
    changeClassActive(languageList, event.target, 'active');
    htmlElement.dataset.lang = event.target.dataset.lang;
    localStorage.setItem('portfolio_lang', htmlElement.dataset.lang);
  });

  data.innerText = writingData.getFullYear();

  form.addEventListener('submit', e => e.preventDefault());

  portfolioBtnsList.addEventListener('click', event => {
    if (event.target.classList.contains('btn--active')) return;
  
    if (!seasons.includes(event.target.dataset.season)) return;

    currentSeason = event.target.dataset.season;
    portfolioImages.forEach(img => img.classList.add('slowChanges'));

    setTimeout(() => portfolioImages.forEach(img => img.classList.remove('slowChanges')), 1200);

    setTimeout(() => setImage(portfolioImages, currentSeason), 700);

    changeClassActive(portfolioBtns, event.target, 'btn--active');
    localStorage.setItem('portfolio_season', currentSeason);
  });

  hamb.addEventListener('click', (event) => {
    event.preventDefault();
    if (htmlElement.getAttribute('data-hamb') !== 'open') {
      htmlElement.setAttribute('data-hamb', 'open');
      hambInput.checked = true;
    } else {
      htmlElement.setAttribute('data-hamb', 'close');
      hambInput.checked = false;
    }
  });

  navTabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      const sectionTo = document.getElementById(`${e.target.getAttribute('data-scroll')}`);
      if (htmlElement.getAttribute('data-hamb') === 'open') {
        htmlElement.setAttribute('data-hamb', 'close');
        hambInput.checked = false;
        setTimeout(() => {scrollToSection(sectionTo);}, 450);
        return;
      }
        scrollToSection(sectionTo);
    }, {capture: true});
  });

  hireMe.addEventListener('click', e => {
    e.preventDefault();
    const sectionTo = document.getElementById(`contacts`);
    setTimeout(() => {scrollToSection(sectionTo);}, 350);
  });

  console.log(`
  Оценка за задание 75 баллов:
  
    Смена изображений в секции portfolio +25
    Перевод страницы на два языка +25
    Переключение светлой и тёмной темы +25
    Дополнительный функционал: выбранный пользователем язык отображения страницы и светлая или тёмная тема сохраняются при перезагрузке страницы +5
    Дополнительный функционал: сложные эффекты для кнопок при наведении и/или клике +5

  УВАЖАЕМЫЕ РЕВЬЮЕРЫ))
    Не забудьте: если Вы не насчитываете 75 баллов, то у Вас есть еще 10 запасных!
    Заранее благодарю :)
  `);
})

function preloadImages(seasons) {
  seasons.forEach(season => {
    for(let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `./assets/img/${season}/${i}.jpg`;
    }
  });
}

function changeClassActive(list, element, activeClass) {
  list.forEach(el => el.classList.remove(activeClass));
  element.classList.add(activeClass);
}

function setImage(list, season) {
  list.forEach((img, index) => {
    img.src = `./assets/img/${season}/${index + 1}.jpg`;
    img.alt = `${index} of ${season}`;
  });
}

function scrollToSection(sectionTo) {
  sectionTo.scrollIntoView({behavior: "smooth"});
}

function getTranslate(list, lang) {
  list.forEach(item => {
    if (item.placeholder) {
      item.placeholder = lang[item.dataset.i18n] ?? item.placeholder;
      return;
    }
    item.innerHTML = lang[item.dataset.i18n] ?? item.innerHTML;
  });
}