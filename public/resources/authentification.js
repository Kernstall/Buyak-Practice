const AUTH = (function () {
    let tagIdCounter = 0;

    return {
        loginAction: function () {
            let feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
            if (username !== '') {
                username = '';
                localStorage.username = '';
                VIEW.toPostFeed();
                VIEW.updateHeader();
            }
            else {
                while (feedHolder.firstChild) {
                    feedHolder.removeChild(feedHolder.firstChild);
                }
                let loginTemplate = document.getElementById('loginFormTemplate');
                let loginForm = loginTemplate.content.cloneNode(true);
                let loginButton = loginForm.querySelector('.loginButton')[0];
                filterConfig = {};
                feedHolder.appendChild(loginForm);
            }
            return false;
        },

        loginSubmitAction: function () {
            let usersArr =
                [
                    {username:"Alex B.", password: "admin"},
                    {username: 'simpleUser', password:"user"}
                ]; //JSON.parse(localStorage.users);TODO::change auth
            let formHTML = document.querySelector('.login-form');
            let formData = new FormData(formHTML);
            let foundUser = usersArr.find(function (element) {
                if (element.username === formData.get('username') && element.password === formData.get('password')) {
                    return true;
                }
                return false;
            });
            if (foundUser !== undefined) {
                username = foundUser.username;
                VIEW.toPostFeed();
                VIEW.updateHeader();
            } else {
                formHTML.querySelector('#loginPassword').classList.add('wrong-entry');
                formHTML.querySelector('#loginUsername').classList.add('wrong-entry');
                document.getElementsByClassName('wrongInput')[0].style.display = 'inline';
                setTimeout(function () {
                    formHTML.querySelector('#loginPassword').classList.remove('wrong-entry');
                    formHTML.querySelector('#loginUsername').classList.remove('wrong-entry');
                    document.getElementsByClassName('wrongInput')[0].style.display = 'none';
                }, 3000)
            }
            return false;
        }
    }
})();