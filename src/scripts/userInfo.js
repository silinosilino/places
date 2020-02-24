class UserInfo{
    constructor(userInfo, api){
        this.userName = userInfo.querySelector('.user-info__name');
        this.userJob = userInfo.querySelector('.user-info__job');
        this.userPhoto = userInfo.querySelector('.user-info__photo');
        this.api = api;
    }
    
    getUserInfo(){
        const userInfoPromise = this.api.fetchUserInfo();
        return userInfoPromise.then(result => {
            this.userName.textContent = result.name;
            this.userJob.textContent = result.about;
            this.userPhoto.style.backgroundImage = `url('${result.avatar}')`;
            this.api.userId = result._id;
            return result;
        });
    }

    setUserInfo(name, job){
        this.userName.textContent = name;
        this.userJob.textContent = job;
    }  
    
    updateAvatar(photolink){
        this.userPhoto.style.backgroundImage = `url('${photolink}')`;
    }


} 