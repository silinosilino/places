export default class CardList {
    constructor(container, createCard, openImageCallback, api) {
        this.container = container;
        this.createCard = createCard;
        this.openImageCallback = openImageCallback;
        this.api = api;
    }

    render(arr, addDeleteIcon){
        arr.forEach(cardData => {
            const card = this.addCard(cardData);
            if (addDeleteIcon){
                card.placeCard.querySelector(".place-card__delete-icon").style.display = 'block';
            }
        });
    }

    addCard(cardData) {
        const card = this.createCard(cardData, this.openImageCallback, this.api);
        card.create();
        card.setEventListeners();
        this.container.appendChild(card.placeCard);
        return card;
    }   
}