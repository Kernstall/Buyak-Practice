const postTemplate = document.getElementById('postTemplate');

let filterConfig = {};

let username;

let tagFilterHolder = document.getElementsByClassName('filterHashTagContainer')[0];

const CONTROLLER = (function () {
  const photoPosts = [];

  const hashTagAgregator = new Set([]);

  photoPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  function validatePhotoPost(photoPost) {
    if (photoPost) {
      const isIdValid = typeof photoPost.id === 'string';
      const isDescriptionValid = typeof photoPost.description === 'string' && photoPost.description.length < 200;
      const parsedData = Date.parse(photoPost.createdAt);
      const isDateValid = !isNaN(parsedData);
      const isAuthorValid = typeof photoPost.author === 'string' && photoPost.author.length > 0;
      const isPhotoLinkValid = typeof photoPost.photoLink === 'string' && photoPost.photoLink.length > 0;
      return isIdValid && isDescriptionValid && isDateValid && isAuthorValid && isPhotoLinkValid;
    }
    return false;
  }

  function updateTagDataList() {
    const datalist = document.getElementById('tagOptions');
    while (datalist.firstChild) {
      datalist.removeChild(datalist.firstChild);
    }
    hashTagAgregator.forEach((tag) => {
      const tagOption = document.createElement('option');
      tagOption.text = tag;
      datalist.appendChild(tagOption);
    });
  }

  return {

    onSubmitWrapper(inputForm) {
      CONTROLLER.applyFilterAndRedraw(VIEW.assembleFilterConfig(inputForm));
      return false;
    },

    getPhotoPost(id) {
      return photoPosts.find(element => element.id === id);
    },

    validatePhotoPost,

    editPhotoPost(id, photoPost) {
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
        if (this.validatePhotoPost(temp)) {
          if (photoPost.hashTags) {
            photoPost.hashTags.forEach((tag) => {
              hashTagAgregator.add(tag);
            });
            updateTagDataList();
          }
          photoPosts.splice(ind, 1, temp);
          CONTROLLER.applyFilterAndRedraw();
          return true;
        }
        return false;
      }
      return false;
    },

    removePhotoPost(id) {
      const status = DAO.removePhotoPost(id);
      if (status) {
        VIEW.redraw(filterConfig);
      } else {
        // TODO::add error response;
      }
    },

    async loadMorePosts(postNum = 10, filterConfig) {
      const postList = await DAO.getPhotoPosts(postNum, filterConfig);
      if (postList) {
        VIEW.drawList(postList);
      } else {
        // error message;
      }
    },

    async likePost(id) {
      if (!username) {
        return;
      }
      const likeCount = await DAO.likePost(id);
      if (likeCount === -1) {
        alert('Like action failed');
        // TODO error message
        return;
      }
      const likeMask = document.getElementById(id).getElementsByClassName('likeMask liked')[0];
      const likeCountDiv = document.getElementById(id).getElementsByClassName('likeCount')[0];
      if (likeMask !== undefined) {
        likeMask.setAttribute('class', 'likeMask');
        if (likeCountDiv !== undefined) {
          likeCountDiv.textContent = likeCount;
        }
      } else {
        const likeMask = document.getElementById(id).getElementsByClassName('likeMask')[0];
        if (likeMask !== undefined) {
          likeMask.setAttribute('class', 'likeMask liked');
          if (likeCountDiv !== undefined) {
            likeCountDiv.textContent = likeCount;
          }
        }
      }
    },

    applyFilterAndRedraw(filterConfig) {
      VIEW.redraw(filterConfig);
    },

    async addPostSubmitAction(submitForm) {
      const descrTextArea = submitForm.querySelector('#addPostDescription');
      const imagePostArea = submitForm.querySelector('#postImage');
      if (descrTextArea) {
        if (descrTextArea.value !== '') {
          const photoPost = {};
          photoPost.description = descrTextArea.value;
          photoPost.author = username;
          photoPost.hashTags = [];
          const addPostTagHolder = document.querySelector('.filterHashTagContainer');
          if (addPostTagHolder.childNodes.length > 0) {
            const NodeArray = Array.from(addPostTagHolder.childNodes);
            NodeArray.forEach((element) => {
              photoPost.hashTags.push(element.firstChild.textContent);
            });
          }
          if (imagePostArea.files.length === 1) {
            const daoResult = await DAO.addPhotoPost(photoPost, imagePostArea.files[0]);
            if (daoResult) {
              VIEW.toPostFeed();
            } else {
              // TODO
              alert('problem happened when tried to add new post');
            }
          } else {
            imagePostArea.classList.add('wrong-entry');
            setTimeout(() => {
              imagePostArea.classList.remove('wrong-entry');
            }, 3000);
          }
        } else {
          descrTextArea.classList.add('wrong-entry');
          setTimeout(() => {
            descrTextArea.classList.remove('wrong-entry');
          }, 3000);
        }
      }
      return false;
    },

    updateFilterHashTagHints() {
      photoPosts.forEach((photoPost) => {
        photoPost.hashTags.forEach((tag) => {
          hashTagAgregator.add(tag);
        });
      });
      updateTagDataList();
    },

    async editPostSubmitAction(id, submitForm) {
      const postData = { id, hashTags: [] };
      const descrTextArea = submitForm.querySelector('#editPostDescription');
      if (descrTextArea) {
        postData.description = descrTextArea.value;
      }

      const editPostTagHolder = submitForm.querySelector('.filterHashTagContainer');
      if (editPostTagHolder) {
        const NodeArray = Array.from(editPostTagHolder.childNodes);
        NodeArray.forEach((element) => {
          postData.hashTags.push(element.firstChild.textContent);
        });
      }

      const imagePostArea = submitForm.querySelector('#postImage');
      const result = await DAO.editPhotoPost(postData, imagePostArea.files[0]);

      if (result) {
        VIEW.toPostFeed();
      } else {
        alert('Error from server');
        // TODO::error window
      }
      return false;
    },

    async subscribeToUpdates() {
      DAO.subscribeUpdates();
    },

  };
}());
