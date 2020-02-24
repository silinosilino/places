export default class PopupEditUserInfo extends Popup {
    constructor(element, userInfoData, api) {
        super(element);
        this.userInfoData = userInfoData;
        this.api = api;

        if (element.classList.contains('user-info__edit-button')) {
            this.popup.classList.add('popup_edit');
            this.popupContent.insertAdjacentHTML('afterbegin', `
                <h3 class="popup__title">Редактировать профиль</h3>
                <form class="popup__form" name="profile">
                    <input type="text" name="username" class="popup__input popup__input_type_name" placeholder="Имя">
                    <span id="error-username" class="error-message"></span>
                    <input type="text" name="userjob" class="popup__input popup__input_type_name" placeholder="О себе">
                    <span id="error-userjob" class="error-message"></span>
                    <button type="submit" class="button popup__button">Сохранить</button>
                </form>
            `);
            this.userInfoData.getUserInfo().then(result => {
                this.popupContent.querySelector(".popup__form").elements.username.value = result.name;
                this.popupContent.querySelector(".popup__form").elements.userjob.value = result.about;
            })
            
        }
        if (element.classList.contains('user-info__photo')) {
            this.popup.classList.add('popup_edit');
            this.popupContent.insertAdjacentHTML('afterbegin', `
                <h3 class="popup__title">Обновить аватар</h3>
                <form class="popup__form" name="formAvatar">
                    <input type="link" name="useravatar" class="popup__input popup__input_type_link-url" placeholder="Ссылка на аватар">
                    <span id="error-useravatar" class="error-message"></span>
                    <button type="submit" class="button popup__button">Сохранить</button>
                </form>
            `);
        }
    }

    setFormEventListeners(){
        this.form.addEventListener('submit', this.updateHandler.bind(this));
    }

    updateHandler(event) {
        event.preventDefault();
        this.renderLoading(true);
        if (event.currentTarget.name === "profile"){
            const formProfile = event.currentTarget;

            /*Done REVIEW1 задание 9. Надо исправить. Для обновления информации на странице после редактирования формы профиля, нужно использовать
            не значения полей ввода формы профиля, а значения свойств (name и about) объекта, который вернул сервер при отправке данных формы
            профиля на сервер методом PATCH (это будет надёжней, так как ответ сервера может быть положительным, но данные могут быть не сохранены -
            ошибка серверной программы, например, и тело ответа может быть пустым.).
            То есть для обновления данных на странице метод updateUserInfo должен использовать
            не formProfile.elements.username.value, formProfile.elements.userjob.value,
            а res.name и res.about ( предварительно нужно обработать ответ от сервера: res = res.json();). Объект ответа сервера, о котором идет речь,
            описан в задании в пункте "3. Редактирование профиля".
            */
            
            const uploadUserInfoPromise = this.api.uploadUserInfo(formProfile.elements.username.value, formProfile.elements.userjob.value);
            uploadUserInfoPromise.then(res => {
                if (!res.ok) {
                    return Promise.reject(`Ошибка: ${res.status}`);
                } else {
                    return res.json();
                    }
                })
                .then(res => {
                    this.userInfoData.setUserInfo(res.name, res.about);
                    this.renderLoading(false);
                    this.close();
                })
                
                 /* Done 
                 REVIEW1 задание 9. Нужно исправить, закрытие формы профиля вы должны предусмотреть в этом месте (в методе then возвращённого
                 из Api промиса), так как форма должна закрыться не раньше, чем придет успешный ответ от сервера и вы его обработаете в updateUserInfo.
                 Закрытие в любом другом месте кода выполнится раньше, чем придет ответ, так как fetch выполняется асинхронно.*/
                
            
                .catch((err) => {
                console.log(err);
                })
                // .finally(function(){
                //     this.renderLoading(false);
                //     this.close();
                //     }.bind(this))

        }else {
            const photolink = formAvatar.elements.useravatar.value;
            this.userInfoData.updateAvatar(photolink);
            const uploadUserAvatarPromise = this.api.setUserAvatar(photolink);
            uploadUserAvatarPromise.then(res => {
                if (!res.ok) {
                return Promise.reject(`Ошибка: ${res.status}`);
                }
            })
          .catch((err) => {
            console.log(err);
          })
          .finally(function(){
            this.renderLoading(false);
            this.close();
            }.bind(this))

        }
    }
}