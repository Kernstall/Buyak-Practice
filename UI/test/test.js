console.log("Валидность поста:");
var post1={
    id: '11',
    description: 'lorem ipsum dolor',
    createdAt: new Date('2018-02-23T23:00:00'),
    author: 'Ivan',
    photoLink: 'http://google.com',
    hashTags:['google'],
    likes:['']
};
var post2={
    id: '11',
    description: 'lorem ipsum dolor',
    createdAt: new Date('2018-02-23T23:00:00'),
    likes:['']
}
console.log(post1);
console.log("Валидный: "+POST_API.validatePhotoPost(post1));
console.log(post2);
console.log("Валидный: "+POST_API.validatePhotoPost(post2));
console.log("Редактирование поста:");
console.log('editPhotoPost(2,{description:"COOOOL",hashTags:["aww","nice"]}):'+POST_API.editPhotoPost('2',{description:"COOOOL",hashTags:["aww","nice"]}));
console.log("Удаление поста:");
console.log('removePhotoPost("4"):'+POST_API.removePhotoPost('4'));
console.log("Добавление поста:");
console.log('addPhotoPost({\n' +
    '                id: \'100\',\n' +
    '                visible: true,\n' +
    '                description: \'Lorem ipsum dolor sit amet, consectetur.\',\n' +
    '                createdAt: new Date(\'2021-08-23T23:59:59\'),\n' +
    '                author: \'Alex D.\',\n' +
    '                photoLink: \'https://source.unsplash.com/random/801x600\',\n' +
    '                hashTags: [\'like4like\'],\n' +
    '                likes: [\'Ivan\', \'Semen\', \'Roman\']\n' +
    '            }):'+POST_API.addPhotoPost({
        id: '100',
        visible: true,
        description: 'Lorem ipsum dolor sit amet, consectetur.',
        createdAt: new Date('2021-08-23T04:00:00'),
        author: 'Alex D.',
        photoLink: 'https://source.unsplash.com/random/810x601',
        hashTags: ['like4like', 'addedPhotoPost'],
        likes: ['Ivan', 'Semen', 'Roman', 'Jesus']}));