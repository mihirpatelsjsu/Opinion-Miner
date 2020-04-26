function incrementValue(){
    var value = document.getElementById('number').innerHTML;
    console.log(document.getElementById('number').innerHTML);
    value++;
    document.getElementById('number').innerHTML = value;
}