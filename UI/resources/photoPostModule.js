if(!localStorage.photoPosts){
    localStorage.photoPosts = JSON.stringify([
        {
            id: '1',
            visible: true,
            description: 'Lorem ipsum dolor sit amet, consectetur.',
            createdAt: new Date('2019-08-23T23:59:59'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/801x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen', 'Roman']
        },
        {
            id: '2',
            visible: true,
            description: 'Cras vel erat ut nunc tincidunt vulputate ut eu ante.',
            createdAt: new Date('2019-08-23T23:58:58'),
            author: 'Alex C.',
            photoLink: 'https://source.unsplash.com/random/799x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen', 'Roman']
        },
        {
            id: '3',
            visible: true,
            description: 'Etiam ac facilisis arcu, ac fringilla lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;',
            createdAt: new Date('2019-08-23T23:57:57'),
            author: 'Alex B.',
            photoLink: 'resources/Adam.jpg',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '4',
            visible: true,
            description: 'Donec sollicitudin, justo eu feugiat pulvinar, ipsum orci rhoncus magna, vitae tristique lorem felis a nunc.',
            createdAt: new Date('2019-08-23T23:56:56'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/802x600',
            hashTags: ['like4like', 'goodDay', 'happy'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '5',
            visible: true,
            description: 'Sed ac lorem nec ante suscipit molestie. In a mattis velit.',
            createdAt: new Date('2019-08-23T23:55:55'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/803x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '6',
            visible: true,
            description: 'Sed ac lorem nec ante suscipit molestie. In a mattis velit.',
            createdAt: new Date('2007-08-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/804x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '7',
            visible: true,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus nibh ac arcu tincidunt, vel consequat velit gravida. Ut malesuada libero varius, tincidunt ante eu, dignissim sapien. Morbi dapibus arcu magna, a efficitur quam tincidunt ut. Quisque at auctor orci. Phasellus vitae urna et metus faucibus congue. Cras molestie dui in blandit lobortis. Pellentesque quis sollicitudin enim. Pellentesque vitae libero tristique, gravida nisl ac, sagittis lectus. Cras et ornare justo.',
            createdAt: new Date('2018-02-23T23:00:00'),
            author: 'Ivan Ivanov',
            photoLink: 'https://source.unsplash.com/random/805x600',
            hashTags: ['HelloWorld'],
            likes: []
        },
        {
            id: '8',
            visible: true,
            description: 'Aenean sapien justo, tristique vitae tristique eu, elementum at magna. Integer tempor enim vel scelerisque viverra. Phasellus vulputate purus a convallis pulvinar. Aenean euismod commodo turpis ut porta.',
            createdAt: new Date('2007-08-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/805x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '9',
            visible: true,
            description: 'Nulla facilisi. Aliquam diam lacus, fermentum eu porta eget, dapibus vitae nulla. ',
            createdAt: new Date('2007-02-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/806x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '10',
            visible: true,
            description: 'Vestibulum tempus maximus nibh in faucibus. Vivamus finibus ac odio vitae scelerisque. Nunc maximus venenatis eros, at varius metus pulvinar vel. Duis gravida facilisis pretium.',
            createdAt: new Date('2007-02-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/807x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '11',
            visible: false,
            description: 'Lorem ipsum dolor sit amet, consectetur.',
            createdAt: new Date('2007-08-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/801x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '12',
            visible: true,
            description: 'Cras vel erat ut nunc tincidunt vulputate ut eu ante.',
            createdAt: new Date('2008-08-23T23:00:00'),
            author: 'Alex C.',
            photoLink: 'https://source.unsplash.com/random/799x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '13',
            visible: true,
            description: 'Etiam ac facilisis arcu, ac fringilla lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;',
            createdAt: new Date('2007-08-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'resources/Adam.jpg',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '14',
            visible: true,
            description: 'Donec sollicitudin, justo eu feugiat pulvinar, ipsum orci rhoncus magna, vitae tristique lorem felis a nunc.',
            createdAt: new Date('2018-08-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/802x600',
            hashTags: ['like4like', 'goodDay', 'happy'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '15',
            visible: true,
            description: 'Sed ac lorem nec ante suscipit molestie. In a mattis velit.',
            createdAt: new Date('2007-08-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/803x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '16',
            visible: true,
            description: 'Sed ac lorem nec ante suscipit molestie. In a mattis velit.',
            createdAt: new Date('2007-08-28T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/804x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '17',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus nibh ac arcu tincidunt, vel consequat velit gravida. Ut malesuada libero varius, tincidunt ante eu, dignissim sapien. Morbi dapibus arcu magna, a efficitur quam tincidunt ut. Quisque at auctor orci. Phasellus vitae urna et metus faucibus congue. Cras molestie dui in blandit lobortis. Pellentesque quis sollicitudin enim. Pellentesque vitae libero tristique, gravida nisl ac, sagittis lectus. Cras et ornare justo.',
            createdAt: new Date('2018-02-23T23:00:00'),
            author: 'Ivan Ivanov',
            photoLink: 'https://source.unsplash.com/random/805x600',
            hashTags: ['HelloWorld'],
            likes: []
        },
        {
            id: '18',
            visible: true,
            description: 'Aenean sapien justo, tristique vitae tristique eu, elementum at magna. Integer tempor enim vel scelerisque viverra. Phasellus vulputate purus a convallis pulvinar. Aenean euismod commodo turpis ut porta.',
            createdAt: new Date('2007-08-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/805x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '19',
            visible: true,
            description: 'Nulla facilisi. Aliquam diam lacus, fermentum eu porta eget, dapibus vitae nulla. ',
            createdAt: new Date('2007-02-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/806x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        },
        {
            id: '20',
            visible: true,
            description: 'Vestibulum tempus maximus nibh in faucibus. Vivamus finibus ac odio vitae scelerisque. Nunc maximus venenatis eros, at varius metus pulvinar vel. Duis gravida facilisis pretium.',
            createdAt: new Date('2007-02-23T23:00:00'),
            author: 'Alex B.',
            photoLink: 'https://source.unsplash.com/random/807x600',
            hashTags: ['like4like'],
            likes: ['Ivan', 'Semen']
        }
    ]);
}
let feedList = document.getElementsByClassName("feedList")[0];
const postTemplate = document.getElementById('postTemplate');

const POST_API = (function(){

        let lastPostCounter = 0;

        const photoPosts = getFromLocalStorage();

        const hashTagAgregator = new Set([]);

        photoPosts.sort((a, b)=> b.createdAt.getTime()-a.createdAt.getTime());

        window.addEventListener("beforeunload", function (event) {
            setToLocalStorage();
        });

        function getFromLocalStorage(){
            let posts = JSON.parse(localStorage.photoPosts);
            posts.forEach( function(post){
                post.createdAt = new Date(post.createdAt);
            });
            return posts;
        }

        function setToLocalStorage(){
            localStorage.photoPosts = JSON.stringify(photoPosts);
        }

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
                let editMask = post.querySelector('.editMask');
                editMask.setAttribute('id', photoPost.id);
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
            while(feedList.firstChild){
                feedList.removeChild(feedList.firstChild);
            }
            drawList(getPhotoPosts(0, number, filterConfig));
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
                let onScreenPost = document.getElementById(id);
                for (let k in post) {
                    if (Array.isArray(post[k]))
                        temp[k] = post[k].slice();
                    else
                        temp[k] = post[k];
                }
                if (photoPost.description) {
                    temp.description = photoPost.description;
                    if(onScreenPost!==undefined){
                        onScreenPost.getElementsByClassName('postDescription')[0].textContent=photoPost.description;
                    }
                }
                if (photoPost.hashTags && photoPost.hashTags.length > 0) {
                    temp.hashTags = photoPost.hashTags.slice();
                    if(onScreenPost!==undefined){
                        let hashTagHolder = onScreenPost.getElementsByClassName('hashTagHolder')[0];
                        while (hashTagHolder.firstChild) {
                            hashTagHolder.removeChild(hashTagHolder.firstChild);
                        }
                        for(let k = 0; k<photoPost.hashTags.length; ++k){
                            let tag = document.createElement('div');
                            tag.setAttribute('class','hashTag');
                            tag.textContent = photoPost.hashTags[k];
                            hashTagHolder.appendChild(tag);
                        }
                    }
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
                    var onScreenPost = document.getElementById(id);
                    if(onScreenPost!=undefined){
                        feedList.removeChild(onScreenPost);
                        lastPostCounter --;
                    }
                    post.visible = false;
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