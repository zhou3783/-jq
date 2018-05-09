$(function () {
    var userid = window.sessionStorage.userId;

    if (userid == "" || userid == undefined) {
        window.location.href = "login.html";
    }

    $(".J_tabExit").click(function () {
        window.sessionStorage.removeItem("userId");
        window.sessionStorage.removeItem("loginname");
    });
});