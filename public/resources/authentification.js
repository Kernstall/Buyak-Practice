const AUTH = (function () {
  const tagIdCounter = 0;
  return {
    async loginAction() {
      const feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
      if (username !== '') {
          let isLoggedOut = await DAO.sendLogoutRequest();
          if(isLoggedOut){
              username = "";
              VIEW.toPostFeed();
              VIEW.updateHeader();
          }else{
              //TODO::error message
          }
      } else {
        while (feedHolder.firstChild) {
          feedHolder.removeChild(feedHolder.firstChild);
        }
        const loginTemplate = document.getElementById('loginFormTemplate');
        const loginForm = loginTemplate.content.cloneNode(true);
        const loginButton = loginForm.querySelector('.loginButton')[0];
        filterConfig = {};
        feedHolder.appendChild(loginForm);
      }
      return false;
    },

    async loginSubmitAction() {
      const formHTML = document.querySelector('.login-form');
      const formData = new FormData(formHTML);

      const serverResponse = await DAO.sendLoginRequest(formData.get('username'), formData.get('password'));

        //console.log(serverResponse);
      if (serverResponse !== undefined) {
        username = serverResponse;
        VIEW.toPostFeed();
        VIEW.updateHeader();
      } else {
        formHTML.querySelector('#loginPassword').classList.add('wrong-entry');
        formHTML.querySelector('#loginUsername').classList.add('wrong-entry');
        document.getElementsByClassName('wrongInput')[0].style.display = 'inline';
        setTimeout(() => {
          formHTML.querySelector('#loginPassword').classList.remove('wrong-entry');
          formHTML.querySelector('#loginUsername').classList.remove('wrong-entry');
          document.getElementsByClassName('wrongInput')[0].style.display = 'none';
        }, 3000);
      }
      return false;
    },

      async checkSession(){
        username = await DAO.checkSession();
        VIEW.updateHeader();
      }
  };
}());
