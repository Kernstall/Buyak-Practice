const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const express = require('express');
const bodyParser  = require('body-parser');

const staticBasePath = './public';
const app = express();

function validatePhotoPost(photoPost) {
    if(photoPost){
        let isDescriptionValid = typeof photoPost.description === "string" && photoPost.description.length < 200;
        let isAuthorValid = typeof photoPost.author === "string" && photoPost.author.length > 0;
        let isPhotoLinkValid = typeof photoPost.photoLink === "string" && photoPost.photoLink.length > 0 ;
        let isTagsValid = Array.isArray(photoPost.hashTags);
        return isDescriptionValid && isAuthorValid && isPhotoLinkValid && isTagsValid;
    }
    return false;
}

function addPhotoPost(photoPost){
    let photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
    photoPosts = photoPosts.concat(photoPost);
    fs.writeFileSync('server/data/posts.json', JSON.stringify(photoPosts) );
}

function removePhotoPost(id){
    let photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
    photoPosts.find(function (element) {
        if(element.id === id){
            element.visible = false;
            return true;
        }
        return false;
    });
    fs.writeFileSync('server/data/posts.json', JSON.stringify(photoPosts) );
}

function editPhotoPost (id, photoPost) {
    let photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
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
        if (validatePhotoPost(temp)) {
            photoPosts.splice(ind, 1, temp);
            fs.writeFileSync('server/data/posts.json', JSON.stringify(photoPosts) );
            return true;
        }
        else
            return false;
    }
    return false;
}

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res) {
    const url = (req.url === '/') ? '/index.html' : req.url;
    fs.readFile(staticBasePath + url, function(err, data) {
        if (err)
            res.end('error');
        else
            res.end(data);
    });
});
app.post('/add',function (req, res) {
    if(validatePhotoPost(req.body)){
        let post = req.body;
        post.id = new Date().getTime().toString();
        post.visible = true;
        post.createdAt = new Date();
        addPhotoPost(post);
        res.end('ok');
    }else{
        res.end('fail');
    }
});

app.post('/edit', function (req, res) {
    let result = editPhotoPost(req.body.id, req.body);
    if(result){
        res.end('ok');
    }else{
        res.end('fail');
    }
});

app.put('/', function (req, res) {

});

app.get('*', function(req, res){
    res.send('Sorry, this page was not found', 404);
});

app.listen(3000);