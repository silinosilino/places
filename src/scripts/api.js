class Api {
  constructor(baseUrl, headers) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
        headers: this.headers
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return Promise.reject(`Ошибка: ${res.status}`);
        }

    })
      .then((result) => {
        const personalCards = [];
        const res = [];
        Array.from(result).forEach(item => {
          if(item.owner._id === "b96eb7e28d1765d410d9103b"){
            personalCards.push(item);
          } else {
            res.push(item);
          }
        });
        return {res: res, personalCards: personalCards, cardsArray: Array.from(result)};
      })
  }

  uploadCard(cardData){
    return fetch(`${this.baseUrl}/cards`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
          name: cardData.name,
          link: cardData.link
      })
    })
}

  deleteCard(cardId){
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this.headers,
    })
  }

  likeCard(cardId){
    fetch(`${this.baseUrl}/cards/like/${cardId}`, {
      method: 'PUT',
      headers: this.headers,
    })
      .then(res => {
        if (!res.ok) {
          return Promise.reject(`Ошибка: ${res.status}`);
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  unlikeCard(cardId){
    fetch(`${this.baseUrl}/cards/like/${cardId}`, {
      method: 'DELETE',
      headers: this.headers,
    })
      .then(res => {
        if (!res.ok) {
          return Promise.reject(`Ошибка: ${res.status}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fetchUserInfo(){
    return fetch(`${this.baseUrl}/users/me`, {
        headers: this.headers
    })

    // Done REVIEW1 задание 9. Надо исправить. Нет проверки, пришёл ли положительный ответ от сервера (if (res.ok)...)
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      } else {
        return res.json();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  uploadUserInfo(name, job){
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
          name: name,
          about: job
      })
    })
  }

  setUserAvatar(photolink){
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
          avatar: photolink,
      })
    })
  }

}

