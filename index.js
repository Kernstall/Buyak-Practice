const http = require('url');
const fs = require('fs');
const multer = require('multer');

const imgPath = './public/data/img/';
const serverPath = 'data/img/';

const upload = multer({ dest: imgPath });
const express = require('express');
const bodyParser = require('body-parser');

const staticBasePath = './public';
const app = express();

const SYNC_LIST = (function () { // list for storing httpResponses, stores pairs username/response, will be changed into session/response later
  const container = {};
  const accessibilityFlag = true;
  return {
    add(username, httpResponse) { // TODO:: make synchronous
      container[username] = httpResponse;
    },
    closeConnection(username, statusCode) {
      container[username].sendStatus(statusCode);
      delete container[username];
    },
    forEach(callbackFunction) {
      for (const username in container) {
        callbackFunction(container[username], username);
      }
    }
  };
}());

function validateEditInput(editForm) {
  if (editForm) {
    const isDescriptionValid = editForm.description ? (typeof editForm.description === 'string' && editForm.description.length < 200) : true;
    const isAuthorValid = editForm.author ? (typeof editForm.author === 'string' && editForm.author.length > 0) : true;
    const isTagsValid = editForm.hashTags ? Array.isArray(editForm.hashTags) : true;
    return isDescriptionValid && isAuthorValid && isTagsValid;
  }
  return false;
}

function validatePhotoPost(photoPost) {
  if (photoPost) {
    const isDescriptionValid = typeof photoPost.description === 'string' && photoPost.description.length < 200;
    const isAuthorValid = typeof photoPost.author === 'string' && photoPost.author.length > 0;
    const isTagsValid = Array.isArray(photoPost.hashTags);
    return isDescriptionValid && isAuthorValid && isTagsValid;
  }
  return false;
}

function addPhotoPost(photoPost) {
  let photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
  photoPosts = photoPosts.concat(photoPost);
  photoPosts.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  fs.writeFileSync('server/data/posts.json', JSON.stringify(photoPosts));
}

function editPhotoPost(id, photoPost, imagePath) {
  const photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
  let ind;
  const post = photoPosts.find((el, i) => {
    if (el.id === id) {
      ind = i;
      return true;
    }
    return false;
  });
  if (post) {
    const temp = {};
    for (const k in post) {
      if (Array.isArray(post[k])) { temp[k] = post[k].slice(); } else { temp[k] = post[k]; }
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
      fs.writeFileSync('server/data/posts.json', JSON.stringify(photoPosts));
      return true;
    }
    return false;
  }
  return false;
}

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  const url = (req.url === '/') ? '/index.html' : req.url;
  fs.readFile(staticBasePath + url, (err, data) => {
    if (err) { res.end('error'); } else { res.end(data); }
  });
});

app.post('/edit', upload.single('img'), (req, res, next) => {
  const jsonEdit = JSON.parse(req.body.editData);
  if (!jsonEdit) {
    res.status(400);
    res.end();
    return;
  }
  const result = validateEditInput(jsonEdit);
  if (result) {
    let clentPath;
    if (req.file) {
      const tmp_path = req.file.path;
      const target_path = `${tmp_path}.${req.file.originalname.split('.').pop()}`;
      clentPath = serverPath + target_path.split('\\').pop();
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on('error', (err) => { res.sendStatus(500); });
      fs.unlink(tmp_path);
    }
    const hasEditSucceed = editPhotoPost(jsonEdit.id, jsonEdit, clentPath);
    if (hasEditSucceed) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(404);
  }
});

app.delete('/remove', (req, res) => {
  const photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
  const postIndex = photoPosts.findIndex((element) => {
    if (element.id === req.body.id) {
      return true;
    }
    return false;
  });

  if (postIndex !== -1) {
    photoPosts[postIndex].visible = false;
    res.status(200);
    res.end();
    fs.writeFileSync('server/data/posts.json', JSON.stringify(photoPosts));
  } else {
    res.status(404);
    res.end();
  }
});

app.put('/load', (req, res) => {
  let skip,
    top;
  if (req.body.skip) {
    skip = req.body.skip;
  } else {
    skip = 0;
  }
  if (req.body.top) {
    top = req.body.top;
  } else {
    top = 10;
  }
  const photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
  const sentPosts = photoPosts.filter(((value) => {
    if (!validatePhotoPost(value)) {
      return false;
    }
    if (value.visible === false) {
      return false;
    }
    if (req.body.filterConfig) {
      if (req.body.filterConfig.author && value.author !== req.body.filterConfig.author) {
        return false;
      }
      if (req.body.filterConfig.createdAt) {
        const firstDate = new Date(value.createdAt);
        const secondDate = new Date(req.body.filterConfig.createdAt);

        if (!(firstDate.getDate() === secondDate.getDate() && firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth())) { return false; }
      }
      if (req.body.filterConfig.hashTags) {
        const postHashTags = value.hashTags;
        const configHashTags = req.body.filterConfig.hashTags;
        let isSubSet = true;
        configHashTags.forEach((checkedHash) => {
          if (postHashTags.indexOf(checkedHash) === -1) {
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

app.get('*', (req, res) => {
  res.status(404).send('Sorry, this page was not found');
});

app.post('/like', (req, res) => {
  const photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
  const postIndex = photoPosts.findIndex((element) => {
    if (element.id === req.body.id) {
      return true;
    }
    return false;
  });
  if (postIndex !== -1) {
    const post = photoPosts[postIndex];
    const usernameIndex = post.likes.indexOf(req.body.username);
    if (usernameIndex !== -1) {
      post.likes.splice(usernameIndex);
    } else {
      post.likes.push(req.body.username);
    }
    fs.writeFileSync('server/data/posts.json', JSON.stringify(photoPosts));
    res.status(200).end(post.likes.length.toString());
  } else {
    res.status(404);
  }
});

app.post('/add', upload.single('img'), (req, res, next) => {
  if (!req.file) {
    res.sendStatus(400);
    return;
  }

  const picUploadResult = false;

  const jsonPost = JSON.parse(req.body.postData);

  if (validatePhotoPost(jsonPost)) { // check request post data for validity
    const tmp_path = req.file.path;
    const targetPath = `${tmp_path}.${req.file.originalname.split('.').pop()}`;
    const clentPath = serverPath + targetPath.split('\\').pop(); // target_path.replace(/\\/g, '/');
    const src = fs.createReadStream(tmp_path);
    const dest = fs.createWriteStream(targetPath);

    src.pipe(dest); // Try to upload picture on server
    src.on('end', () => { // if we succeed - add photo post
      jsonPost.id = new Date().getTime().toString();
      jsonPost.visible = true;
      jsonPost.createdAt = (new Date()).toUTCString();
      jsonPost.likes = [];
      jsonPost.photoLink = clentPath;
      addPhotoPost(jsonPost);
      SYNC_LIST.forEach((subscriberRes, subscriber) => { // we update every client subscribed
        if (subscriber !== jsonPost.author) {
          subscriberRes.send(JSON.stringify(jsonPost));
        }
      });
      res.status(200);
      res.end();
    });
    src.on('error', (err) => { res.status(500); res.end(); });

    fs.unlink(tmp_path);
  } else {
    res.status(400);
    res.end();
  }
});

app.post('/subscribe', (req, res) => {
  if (!req.body.username) {
    res.sendStatus(400);
  }
  if (req.body.continue) {
    SYNC_LIST.add(req.body.username, res);
  } else {
    SYNC_LIST.closeConnection(req.body.username, 200);
  }
});

app.listen(3000, () => {
  console.log('Server is running');
});
