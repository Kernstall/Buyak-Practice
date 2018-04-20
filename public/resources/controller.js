const postTemplate = document.getElementById('postTemplate');

const CONTROLLER = (function(){

        const photoPosts = []; //getFromLocalStorage();

        const hashTagAgregator = new Set([]);

        photoPosts.sort((a, b)=> b.createdAt.getTime()-a.createdAt.getTime());

        function validatePhotoPost(photoPost) {
        if(photoPost){
            let isIdValid = typeof photoPost.id === "string";
            let isDescriptionValid = typeof photoPost.description === "string" && photoPost.description.length < 200;
            let parsedData = Date.parse( photoPost.createdAt);
            let isDateValid = !isNaN(parsedData);
            let isAuthorValid = typeof photoPost.author === "string" && photoPost.author.length > 0;
            let isPhotoLinkValid = typeof photoPost.photoLink === "string" && photoPost.photoLink.length > 0 ;
            return isIdValid && isDescriptionValid && isDateValid && isAuthorValid && isPhotoLinkValid;
        }
        return false;
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
                    CONTROLLER.applyFilterAndRedraw();
                    return true;
                }
                else
                    return false;
            }
            return false;
        },

        removePhotoPost: function (id) {
            let status = DAO.removePhotoPost(id);
            if(status){
                VIEW.redraw(filterConfig);
            }else{
                //TODO::add error response;
            }
        },

        loadMorePosts: function(postNum = 10, filterConfig){
            let postList = DAO.getPhotoPosts(postNum, filterConfig);
            VIEW.drawList(postList);
        },
        
        likePost: function (id) {
            if(!username) {
                return;
            }
            let likeCount = DAO.likePost(id);
            if( likeCount === -1 ){
                alert('Like action failed');
                //TODO error message
                return;
            }
            let likeMask = document.getElementById(id).getElementsByClassName('likeMask liked')[0];
            let likeCountDiv = document.getElementById(id).getElementsByClassName('likeCount')[0];
            if(likeMask!==undefined) {
                likeMask.setAttribute('class', 'likeMask');
                    if(likeCountDiv!==undefined) {
                        likeCountDiv.textContent = likeCount;
                    }
            }else{
                let likeMask = document.getElementById(id).getElementsByClassName('likeMask')[0];
                if(likeMask!==undefined){
                    likeMask.setAttribute('class', 'likeMask liked');
                    if(likeCountDiv!==undefined) {
                        likeCountDiv.textContent = likeCount;
                    }
                }
            }
        },

        applyFilterAndRedraw: function (filterConfig) {
            VIEW.redraw(filterConfig);
        },

        addPostSubmitAction: function (submitForm) {
            let descrTextArea = submitForm.querySelector("#addPostDescription");
            let imagePostArea = submitForm.querySelector("#postImage");
            if (descrTextArea)
                if (descrTextArea.value !== '') {
                    let photoPost = {};
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
                    if(imagePostArea.files.length === 1 ){
                        if(DAO.addPhotoPost(photoPost, imagePostArea.files[0])){
                            VIEW.toPostFeed();
                        }else{
                            //TODO
                            alert("problem happened when tried to add new post");
                        }
                    }else{
                        imagePostArea.classList.add('wrong-entry');
                        setTimeout(function () {
                            imagePostArea.classList.remove('wrong-entry');
                        }, 3000);
                    }
                } else {
                    descrTextArea.classList.add('wrong-entry');
                    setTimeout(function () {
                        descrTextArea.classList.remove('wrong-entry');
                    }, 3000);
                }
            return false;
        },

        updateFilterHashTagHints: function () {
            photoPosts.forEach(function (photoPost) {
                photoPost.hashTags.forEach(function (tag) {
                    hashTagAgregator.add(tag);
                })
            });
            updateTagDataList();
        },

        editPostSubmitAction: function (id, submitForm) {
            let postData = { id: id, hashTags:[]};
            let descrTextArea = submitForm.querySelector("#editPostDescription");
            if(descrTextArea){
                postData.description = descrTextArea.value;
            }

            let editPostTagHolder = submitForm.querySelector('.filterHashTagContainer');
            if (editPostTagHolder) {
                let NodeArray = Array.from(editPostTagHolder.childNodes);
                NodeArray.forEach(function (element) {
                    postData.hashTags.push(element.firstChild.textContent);
                })
            }

            let imagePostArea = submitForm.querySelector("#postImage");
            let result = DAO.editPhotoPost(postData, imagePostArea.files[0]);

            if(result){
                VIEW.toPostFeed();
            }else{
                alert("Error from server");
                //TODO::error window
            }

            return false;

        },

        subscribeToUpdates(){
            DAO.subscribeUpdates();
        }

    }
})();