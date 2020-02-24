export default class FormValidator{
    constructor(form){
        this.form = form;
        this.button = this.form.querySelector(".popup__button");
    }

    checkInputValidity(element){
        const errorElement = document.querySelector(`#error-${element.name}`);
        let isValid = false;
        if (element.name === "link" || element.name === "useravatar"){
            isValid = element.value.match(/^(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/)
            if (!isValid){
                errorElement.textContent = "Здесь должна быть ссылка";
            } else {
                errorElement.textContent = "";
            }
    
        } else {
            if (element.value.length < 1) {
                errorElement.textContent = "Это обязательное поле";
            }
            else if (element.value.length === 1 || element.value.length > 30) {
                errorElement.textContent = "Должно быть от 2 до 30 символов";
            }
    
            else if (element.value.length > 1 && element.value.length < 30) {
                errorElement.textContent = "";
                isValid = true;
            }
        }
        return isValid;
    }

    setSubmitButtonState(event){
        let isValid = true;
        const a = this;
        Array.from(this.form.elements).forEach(function(elem){
            if (elem.type === "text" && !a.checkInputValidity(elem)){
                isValid = false;
            }
        });
        if (!isValid){
            this.button.setAttribute('disabled', 'true');
            this.button.classList.remove('popup__button_is-active');
        } else{
            this.button.removeAttribute('disabled');
            this.button.classList.add('popup__button_is-active');
        }
    }

    setEventListeners(){
        const a = this;
        this.form.addEventListener('input', function(event){
            a.setSubmitButtonState();
        });
    }
}