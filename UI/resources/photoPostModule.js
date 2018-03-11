const POST_API = (function(){
        const photoPosts = [
            {
                id: '1',
                visible: false,
                description: 'Lorem ipsum dolor sit amet, consectetur.',
                createdAt: new Date('2007-08-23T23:00:00'),
                author: 'Alex B.',
                photoLink: 'https://source.unsplash.com/random/800x600',
                hashTags: ['like4like'],
                likes: ['Ivan', 'Semen']
            },
            {
                id: '2',
                visible: true,
                description: 'Cras vel erat ut nunc tincidunt vulputate ut eu ante.',
                createdAt: new Date('2007-08-23T23:00:00'),
                author: 'Alex C.',
                photoLink: 'https://source.unsplash.com/random/800x600',
                hashTags: ['like4like'],
                likes: ['Ivan', 'Semen']
            },
            {
                id: '3',
                visible: true,
                description: 'Etiam ac facilisis arcu, ac fringilla lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;',
                createdAt: new Date('2007-08-23T23:00:00'),
                author: 'Alex B.',
                photoLink: 'https://source.unsplash.com/random/800x600',
                hashTags: ['like4like'],
                likes: ['Ivan', 'Semen']
            },
            {
                id: '4',
                visible: true,
                description: 'Donec sollicitudin, justo eu feugiat pulvinar, ipsum orci rhoncus magna, vitae tristique lorem felis a nunc.',
                createdAt: new Date('2018-08-23T23:00:00'),
                author: 'Alex B.',
                photoLink: 'https://source.unsplash.com/random/800x600',
                hashTags: ['like4like'],
                likes: ['Ivan', 'Semen']
            },
            {
                id: '5',
                visible: true,
                description: 'Sed ac lorem nec ante suscipit molestie. In a mattis velit.',
                createdAt: new Date('2007-08-23T23:00:00'),
                author: 'Alex B.',
                photoLink: 'https://source.unsplash.com/random/800x600',
                hashTags: ['like4like'],
                likes: ['Ivan', 'Semen']
            },
            {
                id: '6',
                visible: true,
                description: 'Sed ac lorem nec ante suscipit molestie. In a mattis velit.',
                createdAt: new Date('2007-08-23T23:00:00'),
                author: 'Alex B.',
                photoLink: 'https://source.unsplash.com/random/800x600',
                hashTags: ['like4like'],
                likes: ['Ivan', 'Semen']
            },
            {
                id: '7',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus nibh ac arcu tincidunt, vel consequat velit gravida. Ut malesuada libero varius, tincidunt ante eu, dignissim sapien. Morbi dapibus arcu magna, a efficitur quam tincidunt ut. Quisque at auctor orci. Phasellus vitae urna et metus faucibus congue. Cras molestie dui in blandit lobortis. Pellentesque quis sollicitudin enim. Pellentesque vitae libero tristique, gravida nisl ac, sagittis lectus. Cras et ornare justo.',
                createdAt: new Date('2018-02-23T23:00:00'),
                author: 'Ivan Ivanov',
                photoLink: 25,
                hashTags: ['HelloWorld'],
                likes: []
            },
            {
                id: '8',
                visible: true,
                description: 'Aenean sapien justo, tristique vitae tristique eu, elementum at magna. Integer tempor enim vel scelerisque viverra. Phasellus vulputate purus a convallis pulvinar. Aenean euismod commodo turpis ut porta.',
                createdAt: new Date('2007-08-23T23:00:00'),
                author: 'Alex B.',
                photoLink: 'https://source.unsplash.com/random/800x600',
                hashTags: ['like4like'],
                likes: ['Ivan', 'Semen']
            },
            {
                id: '9',
                visible: true,
                description: 'Nulla facilisi. Aliquam diam lacus, fermentum eu porta eget, dapibus vitae nulla. ',
                createdAt: new Date('2007-02-23T23:00:00'),
                author: 'Alex B.',
                photoLink: 'https://source.unsplash.com/random/800x600',
                hashTags: ['like4like'],
                likes: ['Ivan', 'Semen']
            },
            {
                id: '10',
                visible: true,
                description: 'Vestibulum tempus maximus nibh in faucibus. Vivamus finibus ac odio vitae scelerisque. Nunc maximus venenatis eros, at varius metus pulvinar vel. Duis gravida facilisis pretium.',
                createdAt: new Date('2007-02-23T23:00:00'),
                author: 'Alex B.',
                photoLink: 'https://source.unsplash.com/random/800x600',
                hashTags: ['like4like'],
                likes: ['Ivan', 'Semen']
            }
        ];

    return{
        getPhotoPosts: function (skip = 0, top = 10, filterConfig) {
            return photoPosts.filter((function (value) {
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
                        let configHashTags = value.hashTags;
                        let postHashTags = filterConfig.hashTags;
                        let isTagsSetsEqual = true;
                        postHashTags.forEach(function(checkedHash){
                            if(photoPosts.indexOf(configHashTags) != -1) {
                                isTagsSetsEqual = false;
                            }
                        });
                        return isTagsSetsEqual;
                    }
                }
                return true;
            })).slice(skip, skip + top);
        },

        getPhotoPost: function (id) {
            return photoPosts.find(function(element){
                return element.id === id;
            });
        },

        validatePhotoPost: function (photoPost) {
            return photoPost && Object.keys(photoPost).length < 9 && typeof photoPost.id === "string" &&
                typeof photoPost.description === "string" && photoPost.description.length < 200 && photoPost.createdAt instanceof Date &&
                typeof photoPost.author === "string" && photoPost.author.length > 0 && typeof photoPost.photoLink === "string" && photoPost.photoLink.length > 0 ;
        },

        addPhotoPost: function (photoPost) {
            if (this.validatePhotoPost(photoPost) && !this.getPhotoPost(photoPost.id)) {
                photoPost.visible = true;
                photoPosts.push(photoPost);
                photoPosts.sort(function(a, b){
                    return a.createdAt - b.createdAt;
                });
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
                var temp = {};
                for (var k in post) {
                    if (Array.isArray(post[k]))
                        temp[k] = post[k].slice();
                    else
                        temp[k] = post[k];
                }
                if (photoPost.description) {
                    temp.description = photoPost.description;
                }
                if (photoPost.photoLink) {
                    temp.photoLink = photoPost.photoLink;
                }
                if (photoPost.hashTags && photoPost.hashTags.length > 0) {
                    temp.hashTags = photoPost.hashTags.slice();
                }
                if (this.validatePhotoPost(temp)) {
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
                    post.visible = false;
                    return true;
            }
            return false;
        }
    }
}
)();