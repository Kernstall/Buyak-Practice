let feedList = document.getElementsByClassName("feedList")[0];
const postTemplate = document.getElementById('postTemplate');

const POST_API = (function(){

        let lastPostCounter = 0;

        const photoPosts = []; //getFromLocalStorage();

        const hashTagAgregator = new Set([]);

        photoPosts.sort((a, b)=> b.createdAt.getTime()-a.createdAt.getTime());

        //window.addEventListener("beforeunload", function (event) {
        //    setToLocalStorage();
        //});

        //function setToLocalStorage(){
        //    localStorage.photoPosts = JSON.stringify(photoPosts);
        //}

        function addZero(i) { //for date-formating purpose
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        function validatePhotoPost(photoPost) {
        if(photoPost){
            let isIdValid = typeof photoPost.id === "string";
            let isDescriptionValid = typeof photoPost.description === "string" && photoPost.description.length < 200;
            let isDateValid = photoPost.createdAt instanceof Date;
            let isAuthorValid = typeof photoPost.author === "string" && photoPost.author.length > 0;
            let isPhotoLinkValid = typeof photoPost.photoLink === "string" && photoPost.photoLink.length > 0 ;
            return isIdValid && isDescriptionValid && isDateValid && isAuthorValid && isPhotoLinkValid;
        }
        return false;
    }

        function drawBackPostOnScreen(photoPost){
                feedList.appendChild(assemblePhotoPost(photoPost));
           }

        function drawFrontPostOnScreen(photoPost) {
            feedList.insertBefore( assemblePhotoPost(photoPost) , feedList.firstChild);
        }

        function assemblePhotoPost(photoPost){
            if( validatePhotoPost(photoPost)) {
                let post = postTemplate.content.cloneNode(true);
                post.querySelector('.postWrapper').setAttribute('id', photoPost.id);
                post.querySelector('.postTime').textContent=photoPost.createdAt.toLocaleString();
                post.querySelector('.posterName').textContent=photoPost.author;
                post.querySelector('.postImg').setAttribute('src', photoPost.photoLink);
                post.querySelector('.postDescription').textContent =photoPost.description;
                let likeMask = post.querySelector('.likeMask');
                if(photoPost.likes.indexOf(username)!==-1){
                    likeMask.setAttribute('class', 'likeMask liked');
                }
                likeMask.setAttribute('onclick','POST_API.likePost(\'' + photoPost.id + '\')');
                post.querySelector('.editMask').setAttribute('id', photoPost.id);

                let removeMask = post.querySelector('.removeMask');
                removeMask.setAttribute('id', photoPost.id);
                removeMask.setAttribute('onclick', 'POST_API.removePhotoPost(\"'+photoPost.id+'\");');
                let editMask = post.querySelector('.editMask');
                editMask.setAttribute('id', photoPost.id);
                editMask.setAttribute('onclick', 'SPA_MANAGER.toEditPost(\"'+photoPost.id+'\");');
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
        }

        function drawList(postList){
            for(let i=0; i < postList.length; ++i){
                drawBackPostOnScreen(postList[i]);
            }
            return postList;
        }

        function getPhotoPosts (skip = 0, top = 10, filterConfig) {
            return photoPosts.filter((function (value) {
                if(!validatePhotoPost(value)){
                    return false;
                }
                if(value.visible===false){
                    return false;
                }
                if (filterConfig) {

                    if (filterConfig.author && value.author !== filterConfig.author) {
                        return false;
                    }
                    if (filterConfig.createdAt) {
                        let firstDate = value.createdAt;
                        let secondDate = filterConfig.createdAt;
                        if (!(firstDate.getDate() === secondDate.getDate() && firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth()))
                            return false;
                    }
                    if (filterConfig.hashTags) {
                        let postHashTags = value.hashTags;
                        let configHashTags = filterConfig.hashTags;
                        let isSubSet = true;
                        configHashTags.forEach(function(checkedHash){
                            if(postHashTags.indexOf(checkedHash) === -1) {
                                isSubSet = false;
                            }
                        });
                        return isSubSet;
                    }
                }
                return true;
            })).slice(skip, skip + top);
        }

        function redraw(number, filterConfig){
            feedList = document.getElementsByClassName("feedList")[0];
            if(feedList){
                while(feedList.firstChild){
                    feedList.removeChild(feedList.firstChild);
                }
                drawList(getPhotoPosts(0, number, filterConfig));
            }
        }

        function updateTagDataList(){
            let datalist = document.getElementById('tagOptions');
            while(datalist.firstChild){
                datalist.removeChild(datalist.firstChild);
            }
            hashTagAgregator.forEach(function (tag) {
                let tagOption = document.createElement("option");
                tagOption.text = tag;
                datalist.appendChild(tagOption);
            });
        }

    return{

        getPhotoPost: function (id) {
            return photoPosts.find(function(element){
                return element.id === id;
            });
        },

        validatePhotoPost,

        addPhotoPost: function (photoPost) {
            if (this.validatePhotoPost(photoPost) && !this.getPhotoPost(photoPost.id)) {
                photoPost.visible = true;
                photoPosts.push(photoPost);
                photoPosts.sort((a, b)=> b.createdAt.getTime()-a.createdAt.getTime());
                if(photoPosts.indexOf(photoPost) < lastPostCounter){
                    ++lastPostCounter;
                }
                photoPost.hashTags.forEach(function (tag) {
                    hashTagAgregator.add(tag);
                });
                updateTagDataList();
                redraw(lastPostCounter);
                return true;
            }
            return false;
        },

        editPhotoPost: function (id, photoPost) {
            let ind;
            let post = photoPosts.find(function(el, i){
                if (el.id === id) {
                ind = i;
                return true;
            }
            return false;
        });
            if (post) {
                let temp = {};
                for (let k in post) {
                    if (Array.isArray(post[k]))
                        temp[k] = post[k].slice();
                    else
                        temp[k] = post[k];
                }
                if (photoPost.description) {
                    temp.description = photoPost.description;
                }
                if (photoPost.hashTags && photoPost.hashTags.length > 0) {
                    temp.hashTags = photoPost.hashTags.slice();
                }
                if (this.validatePhotoPost(temp)) {
                    if(photoPost.hashTags)
                    {
                        photoPost.hashTags.forEach(function (tag) {
                            hashTagAgregator.add(tag);
                        });
                        updateTagDataList();
                    }
                    photoPosts.splice(ind, 1, temp);
                    POST_API.applyFilterAndRedraw();
                    return true;
                }
                else
                    return false;
            }
            return false;
        },

        removePhotoPost: function (id) {
            var post = POST_API.getPhotoPost(id);
                if (post !== undefined) {
                    //var onScreenPost = document.getElementById(id);
                    //if(onScreenPost!=undefined){
                    //    feedList.removeChild(onScreenPost);
                    //    lastPostCounter --;
                    //}
                    post.visible = false;
                    POST_API.applyFilterAndRedraw();
                    return true;
            }
            return false;
        },

        loadMorePosts: function(postNum = 10, filterConfig){
            let postList = getPhotoPosts(lastPostCounter, postNum, filterConfig);
            lastPostCounter += postList.length;
            drawList(postList);
        },
        
        likePost: function (id) {
            if(username === undefined || username === ''){
                return;
            }
            let likedPost = photoPosts.find(function(post){
                return post.id===id;
            });
            if(likedPost!== undefined ){
                let index = likedPost.likes.indexOf(username);
                if(index!== -1){
                    likedPost.likes.splice(index);
                }else{
                    likedPost.likes.push(username);
                }
                let likeMask = document.getElementById(id).getElementsByClassName('likeMask liked')[0];
                let likeCount = document.getElementById(id).getElementsByClassName('likeCount')[0];
                if(likeMask!==undefined) {
                    likeMask.setAttribute('class', 'likeMask');
                    if(likeCount!==undefined) {
                        likeCount.textContent = Number(likeCount.textContent)-1;
                    }
                }else{
                    let likeMask = document.getElementById(id).getElementsByClassName('likeMask')[0];
                    if(likeMask!==undefined){
                        likeMask.setAttribute('class', 'likeMask liked');
                        if(likeCount!==undefined) {
                            likeCount.textContent = Number(likeCount.textContent) + 1;
                        }
                    }
                }
                }
            },

        applyFilterAndRedraw: function (filterConfig) {
            redraw(lastPostCounter, filterConfig);
        },

        updateFilterHashTagHints: function () {
            photoPosts.forEach(function (photoPost) {
                photoPost.hashTags.forEach(function (tag) {
                    hashTagAgregator.add(tag);
                })
            });
            updateTagDataList();
        }
    }
})();