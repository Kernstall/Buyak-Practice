const DAO = (function () {
    const guestUsername = "guest" + Date();
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
          username: username ? username : guestUsername
      });
      const xhr = new XMLHttpRequest();

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
          xhr.send(body);
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
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(true);
          } else {
            reject(false);
          }
        };

          xhr.send(formData);
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
        xhr.onload = () => {
              if (xhr.status === 200) {
                  resolve(true);
              } else {
                  reject(false);
              }
          };
          xhr.send(formData);
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
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(Number.parseInt(xhr.response));
          } else {
            resolve(-1);
          }
        };

          xhr.send(body);
      });
    },

      sendLoginRequest(username, passwordHash) {
          return new Promise((resolve, reject) => {
              const body = JSON.stringify({
                  username: username,
                  password: passwordHash
              });
              const xhr = new XMLHttpRequest();
              xhr.open('POST', '/login');
              xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
              xhr.onload = () => {
                  if (xhr.status === 200) {
                      resolve(xhr.response);
                  } else {
                      resolve(undefined);
                  }
              };

              xhr.send(body);
          });
      },

      sendLogoutRequest(){

          return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('POST', '/logout');
              xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
              xhr.onload = () => {
                  if (xhr.status === 200) {
                      resolve(true);
                  } else {
                      resolve(false);
                  }
              };
              xhr.send();
          });
      },

      checkSession() {

          return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('POST', '/checkSession');
              xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
              xhr.onload = () => {
                  if (xhr.status === 200) {
                      resolve(xhr.response);
                  } else {
                      resolve("");
                  }
              };
              xhr.send();
          });
      },

      flushPostCounter() {
          lastPostCounter = 0;
      }
  };
}());
