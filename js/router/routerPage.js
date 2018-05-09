$(function () {
    console.log(sessionStorage.html);
    $("#beforePageGrant").after(sessionStorage.html);
    $("#navDiv").append(sessionStorage.navHtml);
    $("#content-main").append(sessionStorage.iframeHtml);
    $("#loginname").text('欢迎用户：' + sessionStorage.loginname);
});