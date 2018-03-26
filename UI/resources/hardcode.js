if (!localStorage.username){
    localStorage.username = "Alex B.";
}
let username = localStorage.username;

let filterConfig = new Object();

function updateHeader() {
    let headers = document.getElementsByClassName('logOutH3');
    let signInText = headers[0];
    let guestText = headers[1];
    if (username === '') {
        signInText.textContent = 'Sign in';
        guestText.textContent = 'Guest';
        document.getElementsByClassName('userWrapper')[0].removeChild( document.getElementsByClassName('userAvatarWrapper')[0]);
    } else {
        signInText.textContent = ' Log Out';
        guestText.textContent = username;

        let userWrapper = document.getElementsByClassName('userWrapper')[0];

        if(!userWrapper.querySelector('.userAvatarWrapper')){
            let avatarWrapper = document.createElement('div');
            avatarWrapper.setAttribute('class', 'userAvatarWrapper');
            let div = document.createElement('div');
            let avatar = document.createElement('img');
            avatar.setAttribute('class', 'userAvatarPic');
            avatar.setAttribute('src', 'resources/avatar.png');

            avatarWrapper.appendChild(div);
            userWrapper.insertBefore(avatarWrapper, userWrapper.firstChild );

            div.appendChild(avatar);
        }

    }
}
updateHeader();

let tagFilterHolder = document.getElementsByClassName('filterHashTagContainer')[0];

function removeMyTag(id){
    tagFilterHolder.removeChild(document.getElementById(id).parentNode);
}
function removeTagFromContainer(node){
    node.parentNode.parentNode.removeChild(node.parentNode);
}

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
        filter.classList.remove('fade');
        setTimeout(function () {
            if(display ==0)
                filter.style.opacity =1;
        }, 0);
    }
    else{
        filter.style.opacity =0;
        setTimeout(function () {
            if(filter.style.opacity ==0)
                filter.classList.add('fade');
        }, 750)
    }
}