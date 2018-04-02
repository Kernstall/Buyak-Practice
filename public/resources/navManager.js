const SPA_MANAGER = (function () {
    if (!localStorage.users) {
        localStorage.users = JSON.stringify([{
            username: 'Alex B.',
            password: 'admin'
        }]);
    }

    let tagIdCounter = 0;

    function initializeFilter() {
        let tagInput = document.getElementById('tagInput');
        tagFilterHolder = document.getElementsByClassName('filterHashTagContainer')[0];
        tagInput.addEventListener('keypress', function (event) {
            if (event.charCode === 13) {
                event.preventDefault();
                if (tagInput.value !== '') {
                    let checkTagInContainer = Array.from(tagFilterHolder.childNodes).find(function (element) {
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
                        tagFilterHolder.appendChild(hashTag);
                        tagInput.value = '';
                    } else {
                        alert('You already added this tag into filter');
                    }
                }
            }
        });
        POST_API.updateFilterHashTagHints();
    }

    return {
        loginAction: function () {
            let feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
            if (username !== '') {
                username = '';
                localStorage.username = '';
                SPA_MANAGER.toPostsAction();
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
                SPA_MANAGER.toPostsAction();
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

        toPostsAction: function () {
            let feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
            if (feedHolder !== undefined) {
                document.body.removeChild(feedHolder);
            }

            let feedAndFilterTemplate = document.getElementById('feedAndFilterTemplate');
            feedHolder = feedAndFilterTemplate.content.cloneNode(true);

            document.body.insertBefore(feedHolder, document.getElementsByClassName("footer")[0]);
            initializeFilter();
            POST_API.applyFilterAndRedraw();
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
                POST_API.updateFilterHashTagHints();
                feedHolder.appendChild(postAdd);
                document.body.insertBefore(feedHolder, document.getElementsByClassName("footer")[0]);
            } else {
                alert('You must sign in to use this option');
            }
        },

        addPostSubmitAction: function (submitForm) {
            let descrTextArea = submitForm.querySelector("#addPostDescription");
            if (descrTextArea)
                if (descrTextArea.value !== '') {
                    let photoPost = Object();
                    photoPost.description = descrTextArea.value;
                    photoPost.createdAt = new Date();
                    photoPost.author = username;
                    photoPost.visible = true;
                    photoPost.hashTags = [];
                    let addPostTagHolder = document.querySelector('.filterHashTagContainer');
                    if (addPostTagHolder.childNodes.length > 0) {
                        let NodeArray = Array.from(addPostTagHolder.childNodes);
                        NodeArray.forEach(function (element) {
                            photoPost.hashTags.push(element.firstChild.textContent);
                        })
                    }
                    photoPost.photoLink = "resources/Adam.jpg";
                    photoPost.likes = [];
                    photoPost.id = Date.now().toString();
                    POST_API.addPhotoPost(photoPost);
                    SPA_MANAGER.toPostsAction();
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
                let post = POST_API.getPhotoPost(id);

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
                POST_API.updateFilterHashTagHints();
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
                    POST_API.editPhotoPost(id, photoPost);
                    SPA_MANAGER.toPostsAction();
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