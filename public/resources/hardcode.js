if (!localStorage.username){
    localStorage.username = "Alex B.";
}
let username = localStorage.username;

let filterConfig = {};

let tagFilterHolder = document.getElementsByClassName('filterHashTagContainer')[0];

function removeMyTag(id){
    tagFilterHolder.removeChild(document.getElementById(id).parentNode);
}
function removeTagFromContainer(node){
    node.parentNode.parentNode.removeChild(node.parentNode);
}

function assembleFilterConfig(inputForm){

    filterConfig = {};

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
    CONTROLLER.applyFilterAndRedraw(assembleFilterConfig(inputForm));
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