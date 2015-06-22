// 判断是否登陆
var oCheckLoginUrl=$('.toMain').find('a');
if(window.localStorage.getItem('isLogin')){
    oCheckLoginUrl.attr('href','../disk/index.html');
}else{
    oCheckLoginUrl.attr('href','../disk/login.html');
}










