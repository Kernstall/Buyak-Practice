const VIEW = (function(){
    let tagIdCounter = 0;
    function drawBackPostOnScreen(photoPost){
        let postHolder = document.body.querySelector('.feedList');
        let post = VIEW.assemblePhotoPost(photoPost);
        if(post){
            postHolder.appendChild(post);
        }
    }

    function drawList(postList){
        for(let i=0; i < postList.length; ++i){
            drawBackPostOnScreen(postList[i]);
        }
        return postList;
    }

    function initializeFilter() {
        let tagInput = document.getElementById('tagInput');
        tagFilterHolder = document.body.querySelector('.filterHashTagContainer');
        tagFilterHolder.addEventListener('click', (event)=>{
            if(event.target.classList.contains('cancelMask')){
                event.target.parentNode.parentNode.removeChild(event.target.parentNode);
            }
        });
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
                        hashTag.appendChild(tagCancel);
                        tagFilterHolder.appendChild(hashTag);
                        tagInput.value = '';
                    } else {
                        alert('You already added this tag into filter');
                    }
                }
            }
        });
        CONTROLLER.updateFilterHashTagHints();
    }

    return{


        drawPostFront: function (photoPost) {
            let postHolder = document.body.querySelector('.feedList');
            let post = VIEW.assemblePhotoPost(photoPost);
            if (post) {
                postHolder.insertBefore( post, postHolder.firstChild);
            }
        },

        assemblePhotoPost : function(photoPost){
            const dateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', };
        if( CONTROLLER.validatePhotoPost(photoPost)) {
            let post = postTemplate.content.cloneNode(true);
            post.querySelector('.postWrapper').setAttribute('id', photoPost.id);
            post.querySelector('.postTime').textContent= (new Date(photoPost.createdAt)).toLocaleDateString("en-US", dateFormatOptions);
            post.querySelector('.posterName').textContent=photoPost.author;
            post.querySelector('.postImg').setAttribute('src', photoPost.photoLink);
            post.querySelector('.postDescription').textContent =photoPost.description;
            let likeMask = post.querySelector('.likeMask');
            if(photoPost.likes.indexOf(username)!==-1){
                likeMask.setAttribute('class', 'likeMask liked');
            }
            likeMask.setAttribute('onclick','CONTROLLER.likePost(\'' + photoPost.id + '\')');
            post.querySelector('.editMask').setAttribute('id', photoPost.id);

            let removeMask = post.querySelector('.removeMask');
            removeMask.setAttribute('id', photoPost.id);
            removeMask.setAttribute('onclick', 'CONTROLLER.removePhotoPost(\"'+photoPost.id+'\");');
            let editMask = post.querySelector('.editMask');
            editMask.setAttribute('id', photoPost.id);
            editMask.setAttribute('onclick', 'VIEW.toEditPost(this);');
            if(username!==photoPost.author){
                removeMask.style='display: none;';
                editMask.style='display: none;';
            }
            post.querySelector('.likeCount').textContent=photoPost.likes.length;

            let hashTagHolder = post.querySelector('.hashTagHolder');
            photoPost.hashTags.forEach(function (tag) {
                let hashTag = document.createElement('div');
                hashTag.setAttribute('class', 'hashTag');
                hashTag.textContent = tag;
                hashTagHolder.appendChild(hashTag);
            });

            return post;
        }
    },

        drawList,

        redraw : function (filterConfig){
            let feedList = document.getElementsByClassName("feedList")[0];
            if(feedList){
                VIEW.clearFeed();
                let posts = DAO.getPhotoPosts(3 ,  filterConfig);
                VIEW.drawList(posts);
            }
        },

        clearFeed: function (){
            let feedHolder = document.body.querySelector('.feedList');
            while (feedHolder.firstChild) {
                feedHolder.removeChild(feedHolder.firstChild);
            }
            DAO.flushPostCounter();
        },

        toPostFeed: function () {
            let feedHolder = document.body.querySelector('.feedAndFilterHolder');
            let feedAndFilterTemplate = document.getElementById('feedAndFilterTemplate');
            let newFeedHolder = feedAndFilterTemplate.content.cloneNode(true);
            if(feedHolder){
                document.body.removeChild(feedHolder);
            }
            document.body.insertBefore(newFeedHolder, document.getElementsByClassName("footer")[0]);
            initializeFilter();
            CONTROLLER.applyFilterAndRedraw();
            return false;
        },

        toEditPost: function (editMask) {
            if (username !== '') {
                let post = {};
                let htmlPost = editMask.parentNode.parentNode.parentNode;
                post.id = htmlPost.id;
                post.description = htmlPost.querySelector('.postDescription').textContent;
                post.hashTags = [];
                let editPostTagHolder = htmlPost.querySelector('.hashTagHolder');
                let NodeArray = Array.from(editPostTagHolder.children);
                NodeArray.forEach(function (element) {
                    post.hashTags.push(element.textContent);
                });

                let postEditTemplate = document.getElementById('postEditTemplate');
                let postEdit = postEditTemplate.content.cloneNode(true);
                let tagInput = postEdit.querySelector('#editPostTagInput');
                let addPostTagHolder = postEdit.querySelector('.filterHashTagContainer');
                postEdit.querySelector('.edit-form').setAttribute('onsubmit', 'return CONTROLLER.editPostSubmitAction(\'' + post.id + '\', this);');

                addPostTagHolder.addEventListener('click', (event)=>{
                    if(event.target.classList.contains('cancelMask')){
                        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
                    }
                });
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

                postEdit.querySelector('.textarea-form-control').value = post.description;

                post.hashTags.forEach(function (elem) {
                    let hashTag = document.createElement('div');
                    hashTag.setAttribute('class', 'hashTag');
                    hashTag.textContent = elem;
                    let tagCancel = document.createElement('div');
                    tagCancel.setAttribute('class', 'cancelMask');
                    hashTag.appendChild(tagCancel);
                    addPostTagHolder.appendChild(hashTag);
                });
                postEdit.querySelector('.modalWrapper').addEventListener('click', (event)=>{
                    if(event.target.classList.contains('modalWrapper')){
                        VIEW.toPostFeed();
                    }
                });
                CONTROLLER.updateFilterHashTagHints();
                let feedHolder = document.body.querySelector('.feedAndFilterHolder');
                feedHolder.appendChild(postEdit);
                document.body.insertBefore(feedHolder, document.getElementsByClassName("footer")[0]);
            } else {
                alert('You must sign in to use this option');
                //TODO::ERROR MESSAGE
            }
        },

        toAddPost: function () {
            if (username !== '') {

                let feedHolder = document.getElementsByClassName('feedAndFilterHolder')[0];
                while (feedHolder.firstChild) {
                    feedHolder.removeChild(feedHolder.firstChild);
                }

                let postAddTemplate = document.getElementById('postAddTemplate');
                let postAdd = postAddTemplate.content.cloneNode(true);
                let tagInput = postAdd.querySelector('#addPostTagInput');
                let addPostTagHolder = postAdd.querySelector('.filterHashTagContainer');

                addPostTagHolder.addEventListener('click', (event)=>{
                    if(event.target.classList.contains('cancelMask')){
                        event.target.parentNode.parentNode.removeChild(event.target.parentNode);
                    }
                });
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

        updateHeader: function() {
        let headers = document.getElementsByClassName('logOutH3');
        let signInText = headers[0];
        let guestText = headers[1];
        if (username === '') {
            signInText.textContent = 'Sign in';
            guestText.textContent = 'Guest';
            document.getElementsByClassName('userWrapper')[0].removeChild( document.getElementsByClassName('userAvatarWrapper')[0]);
        } else {
            signInText.textContent = ' Log Out';
            guestText.textContent = username;

            let userWrapper = document.getElementsByClassName('userWrapper')[0];

            if(!userWrapper.querySelector('.userAvatarWrapper')){
                let avatarWrapper = document.createElement('div');
                avatarWrapper.setAttribute('class', 'userAvatarWrapper');
                let div = document.createElement('div');
                let avatar = document.createElement('img');
                avatar.setAttribute('class', 'userAvatarPic');
                avatar.setAttribute('src', 'resources/avatar.png');

                avatarWrapper.appendChild(div);
                userWrapper.insertBefore(avatarWrapper, userWrapper.firstChild );

                div.appendChild(avatar);
            }

        }
    }
    }
})();