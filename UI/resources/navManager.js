const SPA_MANAGER = (function(){
    if(!localStorage.users){
        localStorage.users = JSON.stringify([{
            username: 'Alex B.',
            password: 'admin'
        }]);
    }

    let tagIdCounter = 0;

    function initializeFilter(){
        let tagInput = document.getElementById('tagInput');
        tagFilterHolder = document.getElementsByClassName('filterHashTagContainer')[0];
        tagInput.addEventListener('keypress', function (event) {
            if(event.charCode === 13){
                event.preventDefault();
                if(tagInput.value!==''){
                    let checkTagInContainer = Array.from(tagFilterHolder.childNodes).find(function(element){
                        return element.textContent === tagInput.value;
                    });

                    if(checkTagInContainer === undefined){
                        let hashTag = document.createElement('div');
                        hashTag.setAttribute('class', 'hashTag');
                        hashTag.textContent = tagInput.value;
                        let tagCancel = document.createElement('div');
                        tagCancel.setAttribute('class', 'cancelMask');
                        tagCancel.setAttribute('id', 'cancelTag'+tagIdCounter);
                        tagCancel.setAttribute('onclick', 'removeMyTag(\''+'cancelTag'+tagIdCounter++ +'\')');
                        hashTag.appendChild(tagCancel);
                        tagFilterHolder.appendChild(hashTag);
                    }else{
                        alert('You already added this tag into filter');
                    }
                }
            }
        } );
        POST_API.updateFilterHashTagHints();
    }

    return {
        loginAction : function () {
            let feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
            if(username!==''){
                username = '';
                localStorage.username = '';
                POST_API.applyFilterAndRedraw(filterConfig);
                updateHeader();
            }
            else{
                while(feedHolder.firstChild){
                    feedHolder.removeChild(feedHolder.firstChild);
                }
                let loginTemplate = document.getElementById('loginFormTemplate');
                let loginForm = loginTemplate.content.cloneNode(true);
                let loginButton = loginForm.querySelector('.loginButton')[0];
                filterConfig = new Object();
                feedHolder.appendChild(loginForm);
            }
            return false;
        },

        loginSubmitAction: function(){
            let usersArr = JSON.parse(localStorage.users);
            let formHTML = document.querySelector('.login-form');
            let formData = new FormData(formHTML);
            let foundUser = usersArr.find(function (element) {
                if(element.username === formData.get('username') && element.password === formData.get('password')){
                    return true;
                }
                return false;
            });
            if(foundUser!==undefined){
                username = foundUser.username;
                SPA_MANAGER.toPostsAction();
                updateHeader();
            }else{
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
        },

        toPostsAction: function () {
            let feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
            if(feedHolder!==undefined){
                document.body.removeChild(feedHolder);
            }

            let feedAndFilterTemplate = document.getElementById('feedAndFilterTemplate');
            feedHolder = feedAndFilterTemplate.content.cloneNode(true);

            document.body.insertBefore(feedHolder, document.getElementsByClassName("footer")[0]);
            initializeFilter();
            POST_API.applyFilterAndRedraw();
            return false;
        }
    }
})();