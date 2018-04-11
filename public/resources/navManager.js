const SPA_MANAGER = (function () {
    let tagIdCounter = 0;

    return {
        loginAction: function () {
            let feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
            if (username !== '') {
                username = '';
                localStorage.username = '';
                VIEW.toPostsAction();
                updateHeader();
            }
            else {
                while (feedHolder.firstChild) {
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

        loginSubmitAction: function () {
            let usersArr = JSON.parse(localStorage.users);
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
                VIEW.toPostsAction();
                updateHeader();
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
        },

        addPostAction: function () {
            if (username !== '') {

                let feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
                while (feedHolder.firstChild) {
                    feedHolder.removeChild(feedHolder.firstChild);
                }

                let postAddTemplate = document.getElementById('postAddTemplate');
                let postAdd = postAddTemplate.content.cloneNode(true);
                let tagInput = postAdd.querySelector('#addPostTagInput');
                let addPostTagHolder = postAdd.querySelector('.filterHashTagContainer');
                tagInput.addEventListener('keypress', function (event) {
                    if (event.charCode === 13) {
                        event.preventDefault();
                        if (tagInput.value !== '') {
                            let checkTagInContainer = Array.from(addPostTagHolder.childNodes).find(function (element) {
                                return element.textContent === tagInput.value;
                            });

                            if (checkTagInContainer === undefined) {
                                let hashTag = document.createElement('div');
                                hashTag.setAttribute('class', 'hashTag');
                                hashTag.textContent = tagInput.value;
                                let tagCancel = document.createElement('div');
                                tagCancel.setAttribute('class', 'cancelMask');
                                tagCancel.setAttribute('id', 'cancelTag' + tagIdCounter);
                                tagCancel.setAttribute('onclick', 'removeTagFromContainer(this);');
                                hashTag.appendChild(tagCancel);
                                addPostTagHolder.appendChild(hashTag);
                                tagInput.value = '';
                            } else {
                                alert('You already added this tag into filter');
                            }
                        }
                    }
                });
                CONTROLLER.updateFilterHashTagHints();
                feedHolder.appendChild(postAdd);
                document.body.insertBefore(feedHolder, document.getElementsByClassName("footer")[0]);
            } else {
                alert('You must sign in to use this option');
            }
        },

        addPostSubmitAction: function (submitForm) {
            let descrTextArea = submitForm.querySelector("#addPostDescription");
            let imagePostArea = submitForm.querySelector("#postImage");
            if (descrTextArea)
                if (descrTextArea.value !== '') {
                    let photoPost = Object();
                    photoPost.description = descrTextArea.value;
                    photoPost.author = username;
                    photoPost.hashTags = [];
                    let addPostTagHolder = document.querySelector('.filterHashTagContainer');
                    if (addPostTagHolder.childNodes.length > 0) {
                        let NodeArray = Array.from(addPostTagHolder.childNodes);
                        NodeArray.forEach(function (element) {
                            photoPost.hashTags.push(element.firstChild.textContent);
                        })
                    }
                    DAO.addPhotoPost(photoPost, imagePostArea.files[0]);
                    VIEW.toPostsAction();
                } else {
                    descrTextArea.classList.add('wrong-entry');
                    setTimeout(function () {
                        descrTextArea.classList.remove('wrong-entry');
                    }, 3000);
                }
            return false;
        },

        toEditPost: function (id) {
            if (username !== '') {

                let feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
                while (feedHolder.firstChild) {
                    feedHolder.removeChild(feedHolder.firstChild);
                }

                let postEditTemplate = document.getElementById('postEditTemplate');
                let postEdit = postEditTemplate.content.cloneNode(true);
                let tagInput = postEdit.querySelector('#editPostTagInput');
                let addPostTagHolder = postEdit.querySelector('.filterHashTagContainer');
                postEdit.querySelector('.edit-form').setAttribute('onsubmit', 'return SPA_MANAGER.editPostSubmitAction(\'' + id + '\', this);');
                tagInput.addEventListener('keypress', function (event) {
                    if (event.charCode === 13) {
                        event.preventDefault();
                        if (tagInput.value !== '') {
                            let checkTagInContainer = Array.from(addPostTagHolder.childNodes).find(function (element) {
                                return element.textContent === tagInput.value;
                            });

                            if (checkTagInContainer === undefined) {
                                let hashTag = document.createElement('div');
                                hashTag.setAttribute('class', 'hashTag');
                                hashTag.textContent = tagInput.value;
                                let tagCancel = document.createElement('div');
                                tagCancel.setAttribute('class', 'cancelMask');
                                tagCancel.setAttribute('id', 'cancelTag' + tagIdCounter);
                                tagCancel.setAttribute('onclick', 'removeTagFromContainer(this);');
                                hashTag.appendChild(tagCancel);
                                addPostTagHolder.appendChild(hashTag);
                                tagInput.value = '';
                            } else {
                                alert('You already added this tag into filter');
                            }
                        }
                    }
                });

                let tagHolder = postEdit.querySelector('.filterHashTagContainer');
                let post = CONTROLLER.getPhotoPost(id);

                postEdit.querySelector('.textarea-form-control').value = post.description;

                post.hashTags.forEach(function (elem) {
                    let hashTag = document.createElement('div');
                    hashTag.setAttribute('class', 'hashTag');
                    hashTag.textContent = elem;
                    let tagCancel = document.createElement('div');
                    tagCancel.setAttribute('class', 'cancelMask');
                    tagCancel.setAttribute('onclick', 'removeTagFromContainer(this);');
                    hashTag.appendChild(tagCancel);
                    addPostTagHolder.appendChild(hashTag);
                });
                CONTROLLER.updateFilterHashTagHints();
                feedHolder.appendChild(postEdit);
                document.body.insertBefore(feedHolder, document.getElementsByClassName("footer")[0]);
            } else {
                alert('You must sign in to use this option');
            }
        },

        editPostSubmitAction: function (id, submitForm) {
            let descrTextArea = submitForm.querySelector("#editPostDescription");
            if (descrTextArea)
                if (descrTextArea.value !== '') {
                    let photoPost = Object();
                    photoPost.description = descrTextArea.value;
                    photoPost.hashTags = [];
                    let addPostTagHolder = document.querySelector('.filterHashTagContainer');
                    if (addPostTagHolder.childNodes.length > 0) {
                        let NodeArray = Array.from(addPostTagHolder.childNodes);
                        NodeArray.forEach(function (element) {
                            photoPost.hashTags.push(element.firstChild.textContent);
                        })
                    }
                    CONTROLLER.editPhotoPost(id, photoPost);
                    VIEW.toPostsAction();
                } else {
                    descrTextArea.classList.add('wrong-entry');
                    setTimeout(function () {
                        descrTextArea.classList.remove('wrong-entry');
                    }, 3000);
                }
            return false;

        }
    }
})();