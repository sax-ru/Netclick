'use strict';
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
// const SERVER = 'https://api.themoviedb.org/3';
// const API_KEY = '420d567de246d4891450ff16447c475e';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');

const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');

const tvShows = document.querySelector('.tv-shows');

const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');

const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');

// preloader
const loading = document.createElement('div');
loading.className = 'loading';

// запрос через класс с использованием fetch
const DBService = class {

    constructor() {
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = '420d567de246d4891450ff16447c475e';
    }

    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            // console.log(res.json());
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url} ошибка ${res.status}`);
        }
    };

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = query => {
        return this.getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU&page=1`)
    }

    getTvShow = id => this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
};

// console.log(new DBService().getSearchResult('Няня'));

// создание карточек
const renderCard = response => {
    console.log(response);
    console.log(response.results);
    tvShowList.textContent = '';
    if (response.total_results) {

        response.results.forEach(item => {
            console.log(item);
            const {
                backdrop_path: backdrop,
                name: title,
                poster_path: poster,
                vote_average: vote,
                id,
            } = item;

            const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
            const backdropIMG = backdrop ? IMG_URL + backdrop : ''; // если нет backdrop то не добавляем ничего
            const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : ''; // если нет voteElem не выводим span tv-card__vote

            const card = document.createElement('li');

            card.className = 'tv-shows__item';
            card.innerHTML = `
                    <a href="#" id="${id}" class="tv-card">
                        ${voteElem}
<!--                        <span class="tv-card__vote">${voteElem}</span>-->
                        <img class="tv-card__img"
                             src="${posterIMG}"
                             data-backdrop="${backdropIMG}"
                             alt="${title}">
                        <h4 class="tv-card__head">${title}</h4>
                    </a>
        `;

            loading.remove(); // убираем прелоадер
            tvShowList.append(card);  // добавляем карточки на страницу
            // tvShowList.prepend(card);
            // tvShowList.insertAdjacentElement('afterbegin', card);
            // console.log(card);
        })
    } else {                                                        // если ничего не найдено
        loading.remove();
        const card = document.createElement('span');
        card.style.color = 'red';
        card.innerText = 'По Вашему запросу ничего не найдено!';
        tvShowList.append(card);
    }
};

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();

    if (value) {
        tvShows.append(loading); // добавляем прелоадер
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
});


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
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

// открытие модального окна
tvShowList.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {
        tvShows.append(loading); // добавляем прелоадер

        new DBService().getTvShow(card.id)
            .then(({
                       poster_path: posterPath,
                       name: title,
                       genres,
                       vote_average: voteAverage,
                       overview,
                       homepage
                   }) => {

                // console.log(data);
                tvCardImg.src = IMG_URL + posterPath;
                tvCardImg.alt = title;
                modalTitle.textContent = title;
                // получение жанров через reduce
                // genresList.innerHTML = data.genres.reduce((acc, item) => {
                //     return `${acc}<li>${item.name}</li>`
                // }, '');
                // через for of
                // genresList.textContent = '';
                // for (const item of data.genres) {
                //     genresList.innerHTML += `<li>${item.name}</li>`;
                // }
                // через forEach
                genresList.textContent = '';
                genres.forEach(item => {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                });

                rating.textContent = voteAverage;
                description.textContent = overview;
                modalLink.href = homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
    }
});

// закрытие модального окна
modal.addEventListener('click', event => {
    if (event.target.closest('.cross') ||
        event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
        loading.remove();
    }
});

// смена карточки
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');

        // const changeImg = img.dataset.backdrop;
        // if (changeImg) {
        //     img.dataset.backdrop = img.src;
        //     img.src = changeImg;
        // }
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]  // с помощью деструктуризации МАГИЯ!
        }
    }

    // if (target.matches('.tv-card__img')) {
    //
    // }
};

tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);


// классы

// class Human {
//     constructor(name, age) {
//         this.name = name;
//         this.age = age;
//     }
//     run() {
//         console.log(this.name + ' Go');
//     }
//     sleep() {
//         console.log(`${this.name} hrrrr`);
//     }
// }
//
// const mike = new Human('Mike', 43);
// const alex = new Human('Alex', 15);
//
// // const mike = {
// //     name: 'Nikolay',
// //     age: 43,
// //     run() {
// //         console.log(mike.name + ' Go');
// //     },
// //     sleep() {
// //         console.log(`${mike.name} hrrrr`);
// //     }
// // };
//
// console.log(mike);
//
// mike.run();
// mike.sleep();

// const cb = (item, index, arr) => {
//     console.log(item, index, arr);
// };
//
// [11, 22, 33].forEach(cb);