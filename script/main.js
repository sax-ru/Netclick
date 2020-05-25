'use strict';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');


// открытие/закрытие меню

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.closest('.left-menu')) {  //closest - поднимается вверх по DOM дереву от того места куда кликнули и ищет указанный селектор и возвращает найденный элемент, если не находит то вернет null
        console.log('клик не в меню');
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

// drop-menu используя делегирование
leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});


const tvcardImg = document.querySelectorAll('.tv-card__img');

tvcardImg.forEach(function (elem) {
    elem.addEventListener('mouseover', (event) => {
        console.log('mouseenter');
        const target = event.target;
        // const src = target.getAttribute('src');
        // const src = target.src;
        // console.log(src);
        target.dataset.srcOrigin = target.src;

        // const data = target.dataset.backdrop;
        // target.setAttribute('src', `${data}`);
        target.src = target.dataset.backdrop;

    });

    elem.addEventListener('mouseout', (event) => {
        console.log('mouseout');
        const target = event.target;
        // const src = target.dataset.srcOrigin;
        target.src = target.dataset.srcOrigin;
    });
});

