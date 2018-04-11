const postTemplate = document.getElementById('postTemplate');

const CONTROLLER = (function(){

        const photoPosts = []; //getFromLocalStorage();

        const hashTagAgregator = new Set([]);

        photoPosts.sort((a, b)=> b.createdAt.getTime()-a.createdAt.getTime());

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
            VIEW.redraw(filterConfig);
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