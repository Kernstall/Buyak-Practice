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

app.put('/edit', function (req, res) {
    let result = editPhotoPost(req.body.id, req.body);
    if(result){
        res.status(200);
        res.end();
    }else{
        res.status(404);
        res.end();
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
                let firstDate = value.createdAt;
                let secondDate = req.body.filterConfig.createdAt;
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
    res.send('Sorry, this page was not found', 404);
});

//app.post('/test', (req, res)=>{
//    console.log(req.body.postData);
//});

app.post('/add', upload.single('img'), (req, res, next) => {
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
            res.status(200);
            res.end();
        });
        src.on('error', function (err) { res.status(520); res.end()});

        fs.unlink(tmp_path);
    }else{
        res.status(400);
        res.end();
    }
});

app.listen(3000, () => {
    console.log('Server is running');
});