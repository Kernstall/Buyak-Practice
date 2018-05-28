const fs = require('fs');
const multer = require('multer');

const imgPath = './public/data/img/';
const serverPath = 'data/img/';
const passport = require('passport');

const upload = multer({ dest: imgPath });
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;

let MemoryStore = session.MemoryStore;

const staticBasePath = './public';
const app = express();

app.use(session({
    key: 'logInSession',
    secret: 'saltyHashString',
    store: new MemoryStore({reapInterval: 60000 * 10}),
    saveUninitialized: true,
    resave: true,
    cookie: {}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));

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

async function addPhotoPost(photoPost) {
    let textInput = await readInputFile('server/data/posts.json');
    let photoPosts = JSON.parse(textInput);
  photoPosts = photoPosts.concat(photoPost);
  photoPosts.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    fs.writeFile('server/data/posts.json', JSON.stringify(photoPosts));
}

function readInputFile(str) {
    return new Promise((resolve) => {
        resolve(fs.readFileSync(str, 'utf8'));
    });
}

async function editPhotoPost(id, photoPost, imagePath, author) {
    let textInput = await readInputFile('server/data/posts.json');
    const photoPosts = JSON.parse(textInput);
  let ind;
  const post = photoPosts.find((el, i) => {
    if (el.id === id) {
      ind = i;
      return true;
    }
    return false;
  });
  if (post) {
      if (post.author !== author) {
          return false;
      }
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
        await fs.writeFile('server/data/posts.json', JSON.stringify(photoPosts));
      return true;
    }
    return false;
  }
  return false;
}

async function findUserByUsername(username, callback) {
    let stringUsers = await readInputFile("server/data/users.json");
    let Users = JSON.parse(stringUsers);
    let foundUser = Users.find((user) => {
        return username === user.username;
    });
    if (foundUser) {
        callback(null, foundUser);
    } else {
        let error = new Error('User does not exist.');
        error.status = 404;
        callback(error);
    }
}

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    findUserByUsername(username, done);
});

app.use(bodyParser.json());

app.use(express.static('public'));

passport.use(new LocalStrategy(
    async function (username, password, done) {
        let textInput = await readInputFile('server/data/users.json');
        let Users = JSON.parse(textInput);
        let foundUser = Users.find((element) => {
            return username === element.username;
        });

        if (foundUser && password === foundUser.password) {
            return done(null, foundUser);
        }
        else {
            done(null, false,'Invalid username or password.');
        }
    }
));

app.get('/', (req, res) => {
  const url = (req.url === '/') ? '/index.html' : req.url;
  fs.readFile(staticBasePath + url, (err, data) => {
    if (err) { res.end('error'); } else { res.end(data); }
  });
});

app.post('/edit', upload.single('img'), (req, res, next) => {

    //console.log("user " + req.user.username + " called edit");
    //console.log(JSON.stringify(req.user));
    if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    }
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
      const hasEditSucceed = editPhotoPost(jsonEdit.id, jsonEdit, clentPath, req.user.username);
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
    if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    }
  const photoPosts = JSON.parse(fs.readFileSync('server/data/posts.json', 'utf8'));
  const postIndex = photoPosts.findIndex((element) => {
    if (element.id === req.body.id) {
      return true;
    }
    return false;
  });

  if (postIndex !== -1 && photoPosts[postIndex].author===req.user.username) {
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
    if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    }
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
    if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    }
  if (!req.file) {
    res.sendStatus(400);
    return;
  }

  const picUploadResult = false;

  const jsonPost = JSON.parse(req.body.postData);

  if (validatePhotoPost(jsonPost)) { // check request post data for validity
      if(jsonPost.author!==req.user.username){
          res.sendStatus(401);
          return;
      }
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

app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.sendStatus(401);
            return;
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            console.log("username: " + req.user.username + " authenticated.");
            return res.status(200).send(req.user.username);
        });
    })(req, res, next);
});

app.post('/logout', function(req, res){
    if(req.isAuthenticated()){
        req.session.destroy();
        req.logout();
    }
    res.status(200).send();
});

app.post('/checkSession', function (req, res) {
    res.status(200).send( req.isAuthenticated() ? req.user.username : "");
});

app.listen(3000, () => {
  console.log('Server is running');
});
