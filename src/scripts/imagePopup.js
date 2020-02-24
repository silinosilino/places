export default class ImagePopup extends Popup{
    constructor(element, link) {
        super(element);
        this.link = link;
        this.popup.classList.add('popup_picture');
        this.popupContent.classList.add("popup__content_picture");
        this.popupPicture = document.createElement('img');
        this.popupPicture.classList.add('place-card__image_inlarged');
        this.popupContent.appendChild(this.popupPicture);
    }
}