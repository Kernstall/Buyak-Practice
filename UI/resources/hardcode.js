
const username ="Alex B.";

(function() {
    let headers = document.getElementsByClassName('logOutH3');
    let signInText = headers[0];
    let guestText = headers[1];
    if (username === '') {
        signInText.textContent = 'Sign in';
        guestText.textContent = 'Guest';
    } else {
        signInText.textContent = ' Log Out';
        guestText.textContent = username;
        let avatarWrapper = document.createElement('div');
        avatarWrapper.setAttribute('class', 'userAvatarWrapper');
        let div = document.createElement('div');

        let avatar = document.createElement('img');
        avatar.setAttribute('class', 'userAvatarPic');
        avatar.setAttribute('src', 'resources/avatar.png');

        div.appendChild(avatar);
        avatarWrapper.appendChild(div);
        let userWrapper = document.getElementsByClassName('userWrapper')[0];
        userWrapper.insertBefore(avatarWrapper, userWrapper.firstChild );
    }
})();
const tagFilterHolder = document.getElementsByClassName('filterHashTagContainer')[0];
let filterConfig = new Object();

function removeMyTag(id){
    tagFilterHolder.removeChild(document.getElementById(id).parentNode);
}

let tagIdCounter = 0;
(function() {
    let tagInput = document.getElementById('tagInput');
    tagInput.addEventListener('keypress', function (event) {
        if(event.charCode === 13){
            event.preventDefault();
            if(tagInput.value!==''){
                let checkTagInContainer = Array.from(tagFilterHolder.childNodes).find(function(element){
                    return element.textContent === tagInput.value;
                });

                if(checkTagInContainer === undefined){
                    let hashTag = document.createElement('div');
                    hashTag.setAttribute('class', 'hashTag');
                    hashTag.textContent = tagInput.value;
                    let tagCancel = document.createElement('div');
                    tagCancel.setAttribute('class', 'cancelMask');
                    tagCancel.setAttribute('id', 'cancelTag'+tagIdCounter);
                    tagCancel.setAttribute('onclick', 'removeMyTag(\''+'cancelTag'+tagIdCounter++ +'\')');
                    hashTag.appendChild(tagCancel);
                    tagFilterHolder.appendChild(hashTag);
                }else{
                    alert('You already added this tag into filter');
                }
            }
        }
    } )
}());

function assembleFilterConfig(inputForm){

    filterConfig = new Object();

    if(document.getElementById("usernameFilterCheckbox").checked){
        filterConfig.author = inputForm.usernameFilter.value;
        if(filterConfig.author === ''){
            return;
        }
    }
    if(document.getElementById("dateFilterCheckbox").checked){
        filterConfig.createdAt = new Date(inputForm.dateFilter.value);
        if(!filterConfig.createdAt){
            return;
        }
    }

    if(tagFilterHolder.childNodes.length>0){
        filterConfig.hashTags =[];
        let NodeArray = Array.from(tagFilterHolder.childNodes);
        NodeArray.forEach(function (element) {
            filterConfig.hashTags.push(element.firstChild.textContent);
        })
    }
    return filterConfig;

}

function onSubmitWrapper(inputForm){
    POST_API.applyFilterAndRedraw(assembleFilterConfig(inputForm));
    return false;
}

function filterDispel(){
    let filter =document.getElementsByClassName('filter')[0];

    let display = filter.style.opacity;

    if(display == 0){
        filter.style.opacity =1;
        filter.style.display ="inherit";
    }
    else{
        filter.style.opacity =0;
        filter.style.display ="none";
    }
}