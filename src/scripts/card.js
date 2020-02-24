class Card {
    constructor (cardData, openImageCallback, api) {
        this.name = cardData.name;
        this.link = cardData.link;
        this.like = cardData.likes;
        this.api = api;
        this.cardId = cardData._id;
        this.openImageCallback = openImageCallback;
        this.openImage = this.openImage.bind(this);
        this.markLiked = this.markLiked.bind(this);  
        this.updateLikes = this.updateLikes.bind(this);    
    }
    
    create() {
        this.placeCard = document.createElement('div');
        this.placeCard.insertAdjacentHTML('afterbegin', `
            <div class="place-card__image">
                <button class="place-card__delete-icon"></button>
            </div>
            <div class="place-card__description"> 
                <h3 class="place-card__name"></h3>
                <div class="place-card__likes">
                    <button class="place-card__like-icon"></button>
                    <span class="place-card__likes-counter"></span>
                </div>
            </div>
            
            `);
    
        this.placeCard.classList.add('place-card');
        const cardName = this.placeCard.querySelector('.place-card__name');
        const placeCardImage = this.placeCard.querySelector('.place-card__image');
        cardName.textContent = this.name;
        placeCardImage.setAttribute('style', `background-image: url(${this.link})`);
        this.cardLikeCounter = this.placeCard.querySelector(".place-card__likes-counter");
        if (this.like.length === undefined){
            this.like.length = 0;
        }
        this.cardLikeCounter.textContent = this.like.length;
        this.checkLikes();
    }

    updateLikes(){
        const initialCardsPromise = this.api.getInitialCards();
        initialCardsPromise.then(result => {
            const cardItem = result.cardsArray.find(item => 
                this.cardId === item._id
            )
            return cardItem;
        })
        .then(item => {
            this.cardLikeCounter.textContent = item.likes.length; 
        })      
    }   

    markLiked(event) {
        if (event.target.classList.contains('place-card__like-icon_liked')){
            event.target.classList.remove('place-card__like-icon_liked');
            this.api.unlikeCard(this.cardId);
            this.updateLikes(); 
        } else {
            event.target.classList.add('place-card__like-icon_liked');
            this.api.likeCard(this.cardId);
            this.updateLikes();
        }
    }
    
    checkLikes(){
        if (this.like.some(like => like._id === this.api.userId)){
            this.placeCard.querySelector(".place-card__like-icon").classList.add('place-card__like-icon_liked');
        } else {
            this.placeCard.querySelector(".place-card__like-icon").classList.remove('place-card__like-icon_liked');
        }
    }

    remove(event) {
        this.placeCard.parentNode.removeChild(this.placeCard);
    }

    setEventListeners(){
        this.placeCard.querySelector('.place-card__like-icon').addEventListener('click', this.markLiked);
        this.placeCard.querySelector('.place-card__delete-icon').addEventListener('click', function(event) {
            if (window.confirm("Вы действительно хотите удалить эту карточку?")) { 
                const deletePromise = this.api.deleteCard(this.cardId);
                deletePromise.then(res => {
                    if (!res.ok) {
                        return Promise.reject(`Ошибка: ${res.status}`);
                        }
                    this.remove();
                })
                    .catch((err) => {
                        console.log(err);
                    });      
            }
        }.bind(this));
        this.placeCard.querySelector('.place-card__image').addEventListener('click', this.openImage);
    }

    openImage(event) { 
        if (event.target.classList.contains('place-card__image')){
            this.openImageCallback(this.link);
        }
    }
}