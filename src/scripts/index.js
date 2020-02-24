import Api from './api.js';
import Card from './card.js';
import CardList from './card.List.js';
import FormValidator from './formValidator.js';
import ImagePopup from './imagePopup.js';
import InitialCards from './initial-cards.js';
import Popup from './popup.js';
import PopupAddPlace from './popupAddPlace.js';
import popupAvatar from './popupAvatar.js';
import PopupEditUserInfo from './popupEditUserInfo.js';
import UserInfo from './userInfo.js';



(function () {

    const api = new Api('http://95.216.175.5/cohort7',
        {
            authorization: 'ea7c2e0c-a7d3-450e-bfaf-1f58f08cc436',
            'Content-Type': 'application/json'
        });
    const initialCardsPromise = api.getInitialCards();
    const createCard = (...args) => new Card(...args);
    function openImageCallback(imageLink) {
        popupImg.popupPicture.src = imageLink;
        popupImg.open();
    }
    const cardList = new CardList(document.querySelector('.places-list'), createCard, openImageCallback, api);
    const userInfo = document.querySelector('.user-info');
    const userInfoButton = userInfo.querySelector('.user-info__button');
    const editButton = userInfo.querySelector('.user-info__edit-button');
    const avatar = userInfo.querySelector('.user-info__photo');
    const userInfoData = new UserInfo(userInfo, api);
    userInfoData.getUserInfo();
    const createValidator = (...args) => new FormValidator(...args);
    const popupAddPlace = new PopupAddPlace(userInfoButton, cardList, api);
    popupAddPlace.setEventListeners();
    popupAddPlace.configureInputPopup(createValidator);
    const popupEditUserInfo = new PopupEditUserInfo(editButton, userInfoData, api);
    const popupAvatar = new PopupEditUserInfo(avatar, userInfoData, api);
    popupEditUserInfo.setEventListeners();
    popupEditUserInfo.configureInputPopup(createValidator);
    popupAvatar.setEventListeners();
    popupAvatar.configureInputPopup(createValidator);
    const popupImg = new ImagePopup();
    popupImg.setEventListeners();

    initialCardsPromise.then(result => {
            cardList.render(result.res, false);
            cardList.render(result.personalCards, true);
        })
        .catch((err) => {
            console.log(err);
          });
})();


/*
    Хорошая работа, рефактор выполнен и весь необходимый по заданию функционал работает верно.
    Отлично, что применено наследование и в классы PopupAddPlace и PopupEditUserInfo передаются
    инстансы для взаимодействия с другими классами.
    Но есть и несколько замечаний:

    Надо исправить:
    - не создавать внутри класса экземпляры другого класса
    - методы классов CardList и UserInfo не должны быть обработчиками событий отправки форм, это
    нарушает принцип единственной ответсвенности
    - в классе ImagePopup есть уязвимость XSS
    - в классе CardList использовать переданный контейнер для карточек, а не искать его на странице
    - initialCards также обернуть IIFE

    Можно лучше:
    - данные карточки в конструктор лучше передавать объектом
    - лучше не вызывать методы класса к конструкторе
    - вместо innerHTML использовать insertAdjacentHTML
    - привязывать обработчики событий в конструкторе
    - для перебора карточек использовать forEach или for .. of
    - ссылку на DOM элемент document.querySelector('.user-info') передавать в конструктор UserInfo
    - сделать закрытие попапа по нажатию на ESC или клику вне попапа
*/

/*
    Отлично, все замечания исправлены верно.

    Замечание по работе попапа профиля - при первом открытии попапа в его поля нужно подставлять данные
    пользователя, для этого в UserInfo можно сделать дополнительный метод getUserInfo
    который вернет текущие данные, вызывать его при открытии попапа профиля и подставлять
    в поля данные.

    Если будет свободное время полезно будет ознакомиться с принципами SOLID
    применяемые для проектирования ООП программ https://ota-solid.now.sh/ ,
    а если уж совсем захотите погрузиться в то, как правильно проектировать
    программы, можете почитать про паттерны проектирования, вот неплохое
    руководство https://refactoring.guru/ru/design-patterns и там же хорошо
    про рефакторинг https://refactoring.guru/ru/refactoring

    Успехов в дальнейшем обучении!
*/



/*REVIEW1 задание 9. Резюме1. (небольшое исправление и дополнение к ревью обновления данных на странице.)

Done

При попытке сабмита формы профиля в консоли появляется ошибка ReferenceError: job is not defined из popupEditUserInfo.js:52:43,
поэтому обновление информации о профиле на странице не работает.


В чём достигнут успех.

1. Сделаны дополнительные задания.
2. Почти для каждого запроса предусмотрена обработка всех видов ошибок при работе с сервером.
3. Взаимодействие с сервером (отправка данных и получение ответа) и обработка данных, полученных от сервера производятся в разных
   методах разных классов (соблюдён принцип единственной ответственности метода).


Что нужно исправить.
1. Нужно выполнить обязательные требования к заданию 7, иначе невозможно проверить и часть обязательных требований к заданию 9.
   А именно:
   а)Done данные со страницы с информацией о профиле всегда должны находиться в полях формы профиля при её открытии.
   б)Done при открытии формы профиля не должно присутствовать никаких сообщений об ошибках и кнопка 'Сохранить' должна быть доступна,
   поскольку форма при открытии всегда находится в валидном состоянии.

2. Done Сделать так, чтобы данные о пользователе, после редактирования в форме профиля, обновлялись на странице только после
   успешного ответа сервера (это выполнено), но
   из объекта его ответа (подробности в модуле popupEditUserInfo.js ).

3. Done Предусмотреть закрытие формы профиля после редактирования и нажатия на кнопку сабмита в нужном месте кода
  (подробности в ревью в модуле popupEditUserInfo.js).

4. Done Сделать проверку, пришёл ли положительный ответ от сервера в методе fetchUserInfo (подробности в модуле api.js)



/*REVIEW2 задание 9. Резюме2.
Ошибки по работе с сервером оперативно исправлены!

Но валидация формы профиля осталась выполненной неполностью (задание 7), а именно: при выходе из формы по значку close (без сохранения информации)
и при последующем входе в неё, валидная информация со страницы в поля формы не вносится, остаются видимыми сообщения об ошибках и кнопка сабмита
неактивна.
Поэтому рекомендации по исправлению валидпции формы профиля:
В слушателе события открытия формы (в слушателе клика по кнопке "Edit") нужно выполнить следующие действия (и в такой
последовательности как указано):
1. Внести в поля input формы информацию о профиле (имя и профессию) из элементов страницы.
2. Убрать все сообщения об ошибках, которые могут остаться от предыдущего открытия и закрытия формы,
   так как после внесения инфомации форма становится валидной. Убрать сообщения об ошибках можно с помощью
   вызова функции валидации.
3. Сделать кнопку "Сохранить" доступной.
4. После этих действий можно открывать форму пользователю, то есть добавлять в класс-лист всплывающего окна
   формы класс 'popup_is-opened'.

Задание принято, потому что функции работы с сервером сделаны на отлично.

*/