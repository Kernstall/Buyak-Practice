const AUTH = (function () {
  const tagIdCounter = 0;

  return {
    loginAction() {
      const feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
      if (username !== '') {
        username = '';
        localStorage.username = '';
        VIEW.toPostFeed();
        VIEW.updateHeader();
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

    loginSubmitAction() {
      const usersArr =
                [
                  { username: 'Alex B.', password: 'admin' },
                  { username: 'simpleUser', password: 'user' }
                ]; // JSON.parse(localStorage.users);TODO::change auth
      const formHTML = document.querySelector('.login-form');
      const formData = new FormData(formHTML);
      const foundUser = usersArr.find((element) => {
        if (element.username === formData.get('username') && element.password === formData.get('password')) {
          return true;
        }
        return false;
      });
      if (foundUser !== undefined) {
        username = foundUser.username;
        // CONTROLLER.subscribeToUpdates();
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
    }
  };
}());
