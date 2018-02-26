function filterDispel(){
    var filter =document.getElementsByClassName('filter')[0];

    var display = filter.style.opacity;

    if(display == 0){
        filter.style.opacity =1;
    }
    else{
        filter.style.opacity =0;
    }
}