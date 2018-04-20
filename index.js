const http = require('url');
const fs = require('fs');
const multer = require('multer');
const imgPath='./public/data/img/';
const serverPath = 'data/img/';

const upload = multer({ dest : imgPath });
const express = require('express');
const bodyParser  = require('body-parser');

const staticBasePath = './public';
const app = express();

const SYNC_LIST = (function(){ //list for storing httpResponses, stores pairs username/response, will be changed into session/response later
    let container = {};
    let accessibilityFlag = true;
    return{
        add: function(username, httpResponse){ //TODO:: make synchronous
            container[username] = httpResponse;
        },
        closeConnection:function (username, statusCode) {
            container[username].sendStatus(statusCode);
            delete container[username]
        },
        forEach: function (callbackFunction) {
            for(let username in container){
                callbackFunction(container[username]);
            }
        }
    }
})();

function validateEditInput(editForm){
    if(editForm){
        let isDescriptionValid =  editForm.description ? ( typeof editForm.description === "string" && editForm.description.length < 200) : true;
        let isAuthorValid = editForm.author ? (typeof editForm.author === "string" && editForm.author.length > 0) : true;
        let isTagsValid = editForm.hashTags ?  Array.isArray(editForm.hashTags) : true;
        return isDescriptionValid && isAuthorValid && isTagsValid;
    }
    return false;
}

function validatePhotoPost(photoPost) {
    if(photoPost){
        let isDescriptionValid = typeof photoPost.description === "string" && photoPost.description.length < 200;
        let isAuthorValid = typeof photoPost.author === "string" && photoPost.author.length > 0;
        let isTagsValid = Array.isArray(photoPost.hashTags);
        return isDescriptionValid && isAuthorValid && isTagsValid;
    }
    return false;
}

function addPhotoPost(photoPost){
    let photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
    photoPosts = photoPosts.concat(photoPost);
    photoPosts.sort(function (a, b) {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });
    fs.writeFileSync('server/data/posts.json', JSON.stringify(photoPosts) );
}

function editPhotoPost (id, photoPost, imagePath) {
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
        if (imagePath) {
            temp.photoLink = imagePath;
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

app.post('/edit', upload.single('img'), (req, res, next)=>{
    let jsonEdit = JSON.parse(req.body.editData);
    if(!jsonEdit){
        res.status(400);
        res.end();
        return;
    }
    let result = validateEditInput(jsonEdit);
    if(result){
        let clentPath;
        if(req.file){
            let tmp_path = req.file.path;
            let target_path = tmp_path + '.' + req.file.originalname.split('.').pop();
            clentPath = serverPath + target_path.split('\\').pop();
            let src = fs.createReadStream(tmp_path);
            let dest = fs.createWriteStream(target_path);
            src.pipe(dest);
            src.on('error', function (err) {res.sendStatus(500);});
            fs.unlink(tmp_path);
        }
        let hasEditSucceed = editPhotoPost(jsonEdit.id, jsonEdit, clentPath);
        if(hasEditSucceed){
            res.sendStatus(200);
        }else{
            res.sendStatus(400);
        }
    }else{
        res.sendStatus(404);
    }
});

app.delete('/remove', function (req, res) {
    let photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
    let postIndex = photoPosts.findIndex(function (element) {
        if(element.id===req.body.id) {
            return true;
        }
        return false;

    });

    if(postIndex!==-1){
        photoPosts[postIndex].visible = false;
        res.status(200);
        res.end();
        fs.writeFileSync('server/data/posts.json', JSON.stringify(photoPosts) );
    }else{
        res.status(404);
        res.end();
    }
});

app.put('/load', function (req, res) {
    let skip, top;
    if(req.body.skip){
        skip = req.body.skip;
    }else{
        skip = 0;
    }
    if(req.body.top){
        top = req.body.top;
    }else{
        top = 10;
    }
    let photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
    let sentPosts =photoPosts.filter((function (value) {
        if(!validatePhotoPost(value)){
            return false;
        }
        if(value.visible===false){
            return false;
        }
        if (req.body.filterConfig) {

            if (req.body.filterConfig.author && value.author !== req.body.filterConfig.author) {
                return false;
            }
            if (req.body.filterConfig.createdAt) {
                let firstDate = new Date(value.createdAt);
                let secondDate = new Date(req.body.filterConfig.createdAt);

                if (!(firstDate.getDate() === secondDate.getDate() && firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth()))
                    return false;
            }
            if (req.body.filterConfig.hashTags) {
                let postHashTags = value.hashTags;
                let configHashTags = req.body.filterConfig.hashTags;
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
    res.end(JSON.stringify(sentPosts));
});

app.get('*', function(req, res){
    res.status(404).send('Sorry, this page was not found');
});

app.post('/like', (req, res)=>{
    let photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
    let postIndex = photoPosts.findIndex(function (element) {
        if(element.id===req.body.id) {
            return true;
        }
        return false;
    });
    if(postIndex!==-1){
        let post = photoPosts[postIndex];
        let usernameIndex = post.likes.indexOf(req.body.username);
        if(usernameIndex!== -1){
            post.likes.splice(usernameIndex);
        }else{
            post.likes.push(req.body.username);
        }
        fs.writeFileSync('server/data/posts.json', JSON.stringify(photoPosts) );
        res.status(200).end(post.likes.length.toString());
    }else{
        res.status(404);
    }
});

app.post('/add', upload.single('img'), (req, res, next) => {

    if(!req.file){
        res.sendStatus(400);
        return;
    }

    let picUploadResult = false;

    let jsonPost = JSON.parse(req.body.postData);

    if(validatePhotoPost(jsonPost)) { //check request post data for validity

        let tmp_path = req.file.path;
        let target_path = tmp_path + '.' + req.file.originalname.split('.').pop();
        let clentPath = serverPath + target_path.split('\\').pop(); //target_path.replace(/\\/g, '/');
        let src = fs.createReadStream(tmp_path);
        let dest = fs.createWriteStream(target_path);

        src.pipe(dest); //Try to upload picture on server
        src.on('end', function () { //if we succeed - add photo post
            jsonPost.id = new Date().getTime().toString();
            jsonPost.visible = true;
            jsonPost.createdAt = (new Date()).toUTCString();
            jsonPost.likes = [];
            jsonPost.photoLink = clentPath;
            addPhotoPost(jsonPost);
            SYNC_LIST.forEach((subscriberRes)=>{//we update every client subscribed
                subscriberRes.send(JSON.stringify(jsonPost));
            });
            res.status(200);
            res.end();
        });
        src.on('error', function (err) { res.status(500); res.end()});

        fs.unlink(tmp_path);
    }else{
        res.status(400);
        res.end();
    }
});

app.post('/subscribe', (req, res)=>{
    if(req.body.username===undefined){
        res.sendStatus(400);
    }
    if(req.body.continue === true){
        SYNC_LIST.add(req.body.username, res);
    }else{
        SYNC_LIST.closeConnection(req.body.username, 200);
    }
});

app.listen(3000, () => {
    console.log('Server is running');
});