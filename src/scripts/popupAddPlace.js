class PopupAddPlace extends Popup {
    constructor(element, cardList, api) {
        super(element);
        this.cardList = cardList;
        this.api = api;
        this.popup.classList.add('popup_add-place');
        this.popupContent.insertAdjacentHTML('afterbegin', `
            <h3 class="popup__title">Новое место</h3>
            <form class="popup__form" name="new">
                <input type="text" required name="name" class="popup__input popup__input_type_name" placeholder="Название">
                <span id="error-name" class="error-message"></span>
                <input type="text" required name="link" class="popup__input popup__input_type_link-url" placeholder="Ссылка на картинку">
                <span id="error-link" class="error-message"></span>
                <button type="submit" class="button popup__button">+</button>
            </form>
        `);       
    }

    setFormEventListeners(){
        this.form.addEventListener('submit', this.addCard.bind(this));
    }

    addCard(event) {
        event.preventDefault();
        this.renderLoading(true);
        const form = event.currentTarget;
        const UploadCardRequest = {
            name: form.elements.name.value, link: form.elements.link.value, likes: []
        }
        const uploadCardPromise = this.api.uploadCard(UploadCardRequest);
        uploadCardPromise.then(res => {
            if (!res.ok) {
              return Promise.reject(`Ошибка: ${res.status}`);
            } else {
                return res.json();
                }
            })
            .then (cardData => {
                const card = this.cardList.addCard(cardData);
                card.placeCard.querySelector(".place-card__delete-icon").style.display = 'block';
                this.renderLoading(false);
                this.close();
            })
            .catch((err) => {
            console.log(err);
            })
            // .finally(function(){
            //     this.renderLoading(false);
            //     this.close();
            //     }.bind(this))
    
        form.elements.name.value = ''; 
        form.elements.link.value = '';
    }
}