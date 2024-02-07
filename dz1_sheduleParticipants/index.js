// Изначальные данные JSON
const scheduleData = [
    {
        "id": 1,
        "name": "Йога",
        "time": "10:00 - 11:00",
        "maxParticipants": 15,
        "currentParticipants": 8
    },
    {
        "id": 2,
        "name": "Пилатес",
        "time": "11:30 - 12:30",
        "maxParticipants": 10,
        "currentParticipants": 5
    },
    {
        "id": 3,
        "name": "Кроссфит",
        "time": "13:00 - 14:00",
        "maxParticipants": 20,
        "currentParticipants": 15
    },
    {
        "id": 4,
        "name": "Танцы",
        "time": "14:30 - 15:30",
        "maxParticipants": 12,
        "currentParticipants": 10
    },
    {
        "id": 5,
        "name": "Бокс",
        "time": "16:00 - 17:00",
        "maxParticipants": 8,
        "currentParticipants": 6
    }
];

// Получение элемента таблицы
const scheduleTable = document.getElementById('schedule').getElementsByTagName('tbody')[0];

// Функция для создания строки расписания
function createScheduleRow(data) {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${data.name}</td>
            <td>${data.time}</td>
            <td>${data.maxParticipants}</td>
            <td>${data.currentParticipants}</td>
            <td>
                <button class="btn-signup" data-id="${data.id}">Записаться</button>
                <button class="btn-cancel" data-id="${data.id}">Отменить запись</button>
            </td>
        `;
    return row;
}

// Функция обновления состояния кнопок
function updateButtonState() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        const id = parseInt(button.getAttribute('data-id'));
        const data = scheduleData.find(item => item.id === id);
        const my = data.my ? data.my : false;
        if (button.classList.contains('btn-signup')) {
            button.disabled = data.currentParticipants >= data.maxParticipants || my === true;
        } else {
            button.disabled = my === false;
        }
    });
}

// Функция обновления текущего количества участников
function updateCurrentParticipants(id, index) {
    const currentParticipants = scheduleData[index].currentParticipants;
    let currentParticipantsPage = document.querySelectorAll('tr')[id].children[3];
    currentParticipantsPage.innerHTML = currentParticipants;
}

// Функция для записи пользователя на занятие
function signUp(id) {
    const index = scheduleData.findIndex(item => item.id === id);
    if (index !== -1) {
        scheduleData[index].currentParticipants++;
        scheduleData[index]["my"] = true;
        updateButtonState();
        saveDataToLocalStorage();
        updateCurrentParticipants(id, index);
    }
}

// Функция для отмены записи пользователя на занятие
function cancelSignUp(id) {
    const index = scheduleData.findIndex(item => item.id === id);
    if (index !== -1) {
        scheduleData[index].currentParticipants--;
        scheduleData[index]["my"] = false;
        updateButtonState();
        saveDataToLocalStorage();
        updateCurrentParticipants(id, index);
    }
}

// Функция для сохранения данных в LocalStorage
function saveDataToLocalStorage() {
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
}

// Инициализация расписания
function initializeSchedule() {
    // Проверка наличия данных в LocalStorage
    const storedData = localStorage.getItem('scheduleData');
    if (storedData) {
        // Если есть сохраненные данные, используем их
        Object.assign(scheduleData, JSON.parse(storedData));
    } else {
        // Иначе используем изначальные данные
        saveDataToLocalStorage();
    }

    // Создаем строки расписания и добавляем их в таблицу
    scheduleData.forEach(item => {
        const row = createScheduleRow(item);
        scheduleTable.appendChild(row);
    });

    // Обновляем состояние кнопок
    updateButtonState();
}

// Инициализация расписания при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeSchedule);

// Обработчик нажатия на кнопку "Записаться"
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-signup')) {
        const id = parseInt(event.target.getAttribute('data-id'));
        signUp(id);
    }
});

// Обработчик нажатия на кнопку "Отменить запись"
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-cancel')) {
        const id = parseInt(event.target.getAttribute('data-id'));
        cancelSignUp(id);
    }
});