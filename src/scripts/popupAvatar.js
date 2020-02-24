export default class PopupAvatar extends Popup {
    constructor(element, userInfoData) {
        super(element);
        this.userInfoData = userInfoData;
        this.popup.classList.add('popup_avatar');

        this.popupContent.insertAdjacentHTML('afterbegin', `
            <h3 class="popup__title">Обновить аватар</h3>
            <form class="popup__form" name="profile">
                <input type="link" name="useravatar" class="popup__input popup__input_type_link-url" placeholder="Ссылка на аватар">
                <span id="error-useravatar" class="error-message"></span>
                <button type="submit" class="button popup__button">Сохранить</button>
            </form>
        `);      
    }

    setFormEventListeners(){
        this.form.addEventListener('submit', this.updateHandler.bind(this));
        this.form.addEventListener('submit', this.close.bind(this));
    }

    updateHandler(event) {
        event.preventDefault();
        const formProfile = event.currentTarget;
        this.userInfoData.setUserInfo(formProfile.elements.username.value, formProfile.elements.userjob.value);
    }
}