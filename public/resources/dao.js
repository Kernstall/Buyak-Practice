const DAO = (function(){
    let lastPostCounter = 0;

    function sendImage() {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `/images`, false);
        let formData = new FormData();
        formData.append("img", image);
        xhr.send(formData);
        if (xhr.response) {
            ph_src = xhr.response;
            return true;
        }
        return false;
    }

    return{
        subscribeUpdates: function(){
            let body = JSON.stringify({
                continue: true,
                username: username
            });
            let xhr = new XMLHttpRequest();
            xhr.onload = ()=>{
                VIEW.drawPostFront(JSON.parse(xhr.response));
                CONTROLLER.subscribeToUpdates();
            };
            xhr.open('POST', '/subscribe', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(body);
        },

        getPhotoPosts : function  (top = 10, filterConfig) {
        let body = JSON.stringify({
            skip: lastPostCounter,
            top: top,
            filterConfig: filterConfig
        });
        let xhr = new XMLHttpRequest();
        xhr.open('PUT', '/load', false);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(body);
        let postList = JSON.parse(xhr.response);
        if(postList){
            lastPostCounter =+ postList.length;
        }
        return postList;
        },

        removePhotoPost: function (id) {
            let body = JSON.stringify({
                id: id
            });
            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/remove', false);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(body);

            if (xhr.status === 200) {
                return true;
            }
            return false;
        },

        addPhotoPost: function (photoPost, blobFile) {
            let formData = new FormData();
            formData.append('img', blobFile );
            formData.append('postData', JSON.stringify(photoPost) );
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/add', false);
            xhr.send(formData);
                if (xhr.status === 200) {
                    return true;
                }
            return false;
        },

        editPhotoPost: function(editData, blobFile ){
            let formData = new FormData();
            if(blobFile) {
                formData.append('img', blobFile);
            }
            formData.append('editData', JSON.stringify(editData) );
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/edit', false);
            xhr.send(formData);
            if (xhr.status === 200) {
                return true;
            }
            return false;
        },

        likePost: function(id){
            let body = JSON.stringify({
                id:id,
                username: username
            });
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/like', false);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(body);
            if(xhr.status === 200){
                return Number.parseInt(xhr.response);
            }else{
                return -1;
            }
        },

        flushPostCounter: function(){
            lastPostCounter = 0;
        }
    }
})();