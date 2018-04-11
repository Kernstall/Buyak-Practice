const VIEW = (function(){
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
        CONTROLLER.updateFilterHashTagHints();
    }

    return{
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

        toPostsAction: function () {
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
    }
})();