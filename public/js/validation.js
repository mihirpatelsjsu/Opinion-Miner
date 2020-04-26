function formValidation(form){
    if (form.username.value == "" || form.password.value == "") {
        document.getElementById("error").innerHTML = "Please Enter Credentials";
        form.username.focus();
        return false;
    }

    var re = /^[\w ]+$/;

    if (!re.test(form.username.value)) {
        document.getElementById("error").innerHTML = "Only characters are allowed";
        form.username.focus();
        return false;
    }

    if (!re.test(form.password.value)) {
        document.getElementById("error").innerHTML = "Only characters are allowed";
        form.password.focus();
        return false;
    }

    return true;
}