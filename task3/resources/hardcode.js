function filterDispel(){
    var filter =document.getElementsByClassName('filter')[0];

    var display = filter.style.display;

    if(display == "none"){
        filter.style.display = "inherit";
    }
    else{
        filter.style.display = "none";
    }
}