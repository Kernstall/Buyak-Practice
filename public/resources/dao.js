const DAO = (function () {
  let lastPostCounter = 0;

  function sendImage() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/images', false);
    const formData = new FormData();
    formData.append('img', image);
    xhr.send(formData);
    if (xhr.response) {
      ph_src = xhr.response;
      return true;
    }
    return false;
  }

  return {
    subscribeUpdates() {
      const body = JSON.stringify({
        continue: true,
        username
      });
      const xhr = new XMLHttpRequest();
      // xhr.onload = ()=>{
      //   VIEW.drawPostFront(JSON.parse(xhr.response));
      //   //CONTROLLER.subscribeToUpdates();
      // };
      xhr.open('POST', '/subscribe', true);
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          // alert("error with server response");
        } else {
          VIEW.drawPostFront(JSON.parse(xhr.response));
        }
        CONTROLLER.subscribeToUpdates();
      };
      xhr.send(body);
    },

    async getPhotoPosts(top = 10, filterConfig) {
      return new Promise((resolve, reject) => {
        const body = JSON.stringify({
          skip: lastPostCounter,
          top,
          filterConfig
        });
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', '/load');
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(body);
        xhr.onload = () => {
          if (xhr.status === 200) {
            const postList = JSON.parse(xhr.response);
            if (postList) {
              lastPostCounter = +postList.length;
            }
            resolve(postList);
          } else {
            reject();
          }
        };
      });
    },

    removePhotoPost(id) {
      const body = JSON.stringify({
        id
      });
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', '/remove', false);
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.send(body);

      if (xhr.status === 200) {
        return true;
      }
      return false;
    },
    addPhotoPost(photoPost, blobFile) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('img', blobFile);
        formData.append('postData', JSON.stringify(photoPost));
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/add');
        xhr.send(formData);
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(true);
          } else {
            reject(false);
          }
        };
      });
    },

    editPhotoPost(editData, blobFile) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        if (blobFile) {
          formData.append('img', blobFile);
        }
        formData.append('editData', JSON.stringify(editData));
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/edit');
        xhr.send(formData);
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(true);
          } else {
            reject(false);
          }
        };
      });
    },

    likePost(id) {
      return new Promise((resolve, reject) => {
        const body = JSON.stringify({
          id,
          username
        });
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/like');
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(body);
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(Number.parseInt(xhr.response));
          } else {
            resolve(-1);
          }
        };
      });
    },

    flushPostCounter() {
      lastPostCounter = 0;
    }
  };
}());
