// Unsplash INFO
const accessKey = "aJjwpXMKsWZdD7INgTGR0zW2FnC483mqD1dCWibdMzI";

// Кнопка обновления картинки
const btnReload = document.querySelector('.btn-reload');
btnReload.addEventListener('click', () => {
    init();
});

// Элементы
const btnLike = document.querySelector('.likeButton');
const likeCountElement = document.querySelector('.likes');
const imageElement = document.querySelector('.randomImage');
const photographerElement = document.querySelector('.photographer');
const imageViewedElement = document.querySelector('.imageViewed');


// Запрос картинки
async function getRandomImage() {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching random image:', error);
    }
}

// Показываем картинку, автора, кол-ва лайков, кнопка лайков
function renderImage(imageData) {

    imageElement.src = imageData.urls.regular;
    updateLocalStorage(imageData.id, null, imageData.urls.regular); // Сохраняем в локаль инфу о фото
    photographerElement.textContent = `Photographer: ${imageData.user.name}`;

    const likesThis = getValueFromLocalStorage(imageData.id);
    likeCountElement.textContent = likesThis;
    likesThis ? btnLike.textContent = 'dislike' : btnLike.textContent = 'like'; // тут надпись на кнопке лайк/дизлайк

    btnLike.addEventListener('click', () => {
        likeImage(imageData.id);
    });
    addViewedImage(imageData); // Добавляем просмотренные фоточки
}

// лайк/дизлайк
function likeImage(id) {
    let currentLikes = parseInt(getValueFromLocalStorage(id));
    currentLikes ? currentLikes-- : currentLikes++; // тут лайк/дизлайк
    likeCountElement.textContent = currentLikes;
    updateLocalStorage(id, currentLikes, null);
    currentLikes ? btnLike.textContent = 'dislike' : btnLike.textContent = 'like'; // тут надпись на кнопке лайк/дизлайк
}

// Начало
async function init() {
    const imageData = await getRandomImage();
    renderImage(imageData);
}

// Получаем текущие данные из локального хранилища
function getValueFromLocalStorage(id) {

    const currentData = JSON.parse(localStorage.getItem('unsplash')) || {};
    return currentData[id]['likes'] ? currentData[id]['likes'] : 0;
}

// Обновляем значение для переданного id
function updateLocalStorage(id, value, url) {
    let data = JSON.parse(localStorage.getItem('unsplash')) || {};

    if (!data[id]) data[id] = {'likes': 0, 'url': null};

    if (value !== null) data[id]['likes'] = value; // Если реально передаются данные о лайке/дизлайке
    if (url) data[id]['url'] = url; // если передаётся url (при рендере).

    localStorage.setItem('unsplash', JSON.stringify(data));
}


// добавление всех просмотренных ранее фоток из Storage.
function addAllViewedImages() {
    const data = JSON.parse(localStorage.getItem('unsplash')) || {};
    if (data) {
        for (const imagesKey in data) {
            const newImage = document.createElement("img");
            newImage.src = data[imagesKey]['url'];
            newImage.classList.add('imgSmall');
            imageViewedElement.append(newImage);
        }
    }
}

// Добавляем просмотренные фоточки
function addViewedImage (image) {
    const newImage = document.createElement("img");
    newImage.src = image.urls.regular;
    newImage.alt = image.user.name;
    newImage.classList.add('imgSmall');
    imageViewedElement.append(newImage);
}

init();
addAllViewedImages(); // При обновлении всей страницы показываем все просмотренные фотки из Storage