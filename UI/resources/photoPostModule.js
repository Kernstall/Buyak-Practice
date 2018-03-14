var feedList = document.getElementsByClassName("feedList")[0];

const POST_API = (function(){
        var lastPostCounter = 0;

        const photoPosts = [
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
        ];

        const hashTagAgregator = new Set([]);

        photoPosts.forEach(function (photoPost) {
            photoPost.hashTags.forEach(function (tag) {
                hashTagAgregator.add(tag);
            })
        });
        updateTagDataList()

        photoPosts.sort((a, b)=> b.createdAt.getTime()-a.createdAt.getTime());

        function addZero(i) { //for date-formating purpose
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        function validatePhotoPost(photoPost) {
            return photoPost && Object.keys(photoPost).length < 9 && typeof photoPost.id === "string" &&
                typeof photoPost.description === "string" && photoPost.description.length < 200 && photoPost.createdAt instanceof Date &&
                typeof photoPost.author === "string" && photoPost.author.length > 0 && typeof photoPost.photoLink === "string" && photoPost.photoLink.length > 0 ;
        }

        function drawBackPostOnScreen(photoPost){
                feedList.appendChild(assemblePhotoPost(photoPost));
           }

        function drawFrontPostOnScreen(photoPost) {
            feedList.insertBefore( assemblePhotoPost(photoPost) , feedList.firstChild);
        }

        function assemblePhotoPost(photoPost){
            if( validatePhotoPost(photoPost)) {
                var feedPost = document.createElement('section');
                feedPost.setAttribute('class', 'postWrapper');
                feedPost.setAttribute('id', photoPost.id);
                var postInfo = document.createElement('div');
                postInfo.setAttribute('class', 'posterInfo');
                var ownerName = document.createElement('h5');
                ownerName.setAttribute('class', 'posterName');
                ownerName.textContent = photoPost.author;

                var postTime = document.createElement('p');
                postTime.setAttribute('class', 'postTime');
                postTime.textContent = addZero(photoPost.createdAt.getHours()) + ':' + addZero(photoPost.createdAt.getMinutes());

                var postBody = document.createElement('div');
                postBody.setAttribute('class', 'postBodyHolder');

                var picAndDescr = document.createElement('div');
                picAndDescr.setAttribute('class', 'picAndDescrHolder');

                var postImg = document.createElement('img');
                postImg.setAttribute('class', 'postImg');
                postImg.setAttribute('src', photoPost.photoLink);
                var description = document.createElement('article');
                description.setAttribute('class', 'postDescription');
                description.textContent = photoPost.description;

                var likePanel = document.createElement('div');
                likePanel.setAttribute('class', 'likePanel');
                var editMask = document.createElement('div');
                editMask.setAttribute('class', 'editMask');
                editMask.setAttribute('id', photoPost.id);
                var removeMask = document.createElement('div');
                removeMask.setAttribute('class', 'removeMask');
                removeMask.setAttribute('id', photoPost.id);
                var likeMask = document.createElement('div');
                likeMask.setAttribute('onclick','POST_API.likePost(\'' + photoPost.id + '\')');
                if(photoPost.likes.indexOf(username)!=-1){
                    likeMask.setAttribute('class', 'likeMask liked');
                }else{
                    likeMask.setAttribute('class', 'likeMask');
                }
                likeMask.setAttribute('id', photoPost.id);
                var likeCount = document.createElement('div');
                likeCount.setAttribute('class', 'likeCount');
                likeCount.textContent = photoPost.likes.length;
                likePanel.appendChild(editMask);
                likePanel.appendChild(removeMask);
                likePanel.appendChild(likeMask);
                likePanel.appendChild(likeCount);

                var hashTagHolder = document.createElement('div');
                hashTagHolder.setAttribute('class', 'hashTagHolder');
                photoPost.hashTags.forEach(function (tag) {
                    var hashTag = document.createElement('div');
                    hashTag.setAttribute('class', 'hashTag');
                    hashTag.textContent = tag;
                    hashTagHolder.appendChild(hashTag);
                });


                postInfo.appendChild(postTime);
                postInfo.appendChild(ownerName);
                feedPost.appendChild(postInfo);
                picAndDescr.appendChild(postImg);
                picAndDescr.appendChild(description);
                postBody.appendChild(picAndDescr);
                feedPost.appendChild(postBody);
                postBody.appendChild(likePanel);
                feedPost.appendChild(hashTagHolder);
                return feedPost;
            }
        }

        function drawList(postList){
            for(var i=0; i < postList.length; ++i){
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
            while(feedList.firstChild){
                feedList.removeChild(feedList.firstChild);
            }
            drawList(getPhotoPosts(0, number, filterConfig));
        }

        function updateTagDataList(){
            var datalist = document.getElementById('tagOptions');
            while(datalist.firstChild){
                datalist.removeChild(datalist.firstChild);
            }
            hashTagAgregator.forEach(function (tag) {
                var tagOption = document.createElement("option");
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
                if (el.id == id) {
                ind = i;
                return true;
            }
            return false;
        });
            if (post) {
                var temp = {};
                var onScreenPost = document.getElementById(id);
                for (var k in post) {
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
                if (photoPost.photoLink) {
                    temp.photoLink = photoPost.photoLink;
                    if(onScreenPost!==undefined){
                        onScreenPost.getElementsByClassName('postImg')[0].setAttribute('src',photoPost.photoLink);
                    }
                }
                if (photoPost.hashTags && photoPost.hashTags.length > 0) {
                    temp.hashTags = photoPost.hashTags.slice();
                    if(onScreenPost!==undefined){
                        var hashTagHolder = onScreenPost.getElementsByClassName('hashTagHolder')[0];
                        while (hashTagHolder.firstChild) {
                            hashTagHolder.removeChild(hashTagHolder.firstChild);
                        }
                        for(var k = 0; k<photoPost.hashTags.length; ++k){
                            var tag = document.createElement('div');
                            tag.setAttribute('class','hashTag');
                            tag.textContent = photoPost.hashTags[k];
                            hashTagHolder.appendChild(tag);
                        }
                    }
                }
                if (this.validatePhotoPost(temp)) {
                    photoPost.hashTags.forEach(function (tag) {
                        hashTagAgregator.add(tag);
                    });
                    updateTagDataList();
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
            var postList = getPhotoPosts(lastPostCounter, postNum, filterConfig);
            lastPostCounter = postList.length;
            drawList(postList);
        },
        
        likePost: function (id) {
            if(username == undefined){
                return;
            }
            var likedPost = photoPosts.find(function(post){
                return post.id===id;
            });
            if(likedPost!= undefined ){
                var index = likedPost.likes.indexOf(username);
                if(index!= -1){
                    likedPost.likes.splice(index);
                }else{
                    likedPost.likes.push(username);
                }
                var likeMask = document.getElementById(id).getElementsByClassName('likeMask liked')[0];
                var likeCount = document.getElementById(id).getElementsByClassName('likeCount')[0];
                if(likeMask!=undefined) {
                    likeMask.setAttribute('class', 'likeMask');
                    if(likeCount!=undefined) {
                        likeCount.textContent = Number(likeCount.textContent)-1;
                    }
                }else{
                    let likeMask = document.getElementById(id).getElementsByClassName('likeMask')[0];
                    if(likeMask!=undefined){
                        likeMask.setAttribute('class', 'likeMask liked');
                        if(likeCount!=undefined) {
                            likeCount.textContent = Number(likeCount.textContent) + 1;
                        }
                    }
                }
                }
            },

        applyFilterAndRedraw: function (filterConfig) {
            redraw(lastPostCounter, filterConfig);
        }
        }
    }
)();

POST_API.loadMorePosts(5, filterConfig);