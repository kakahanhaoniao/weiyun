$('.submitBtn').on('click',function() {
    var aLi=$('#loginbox').find('input');
    var name=aLi[0].value;
    var pwd=aLi[1].value;
    window.localStorage.setItem('userName',name);
    window.localStorage.setItem('userPwd',pwd);
    // 这里做的验证不好
    var reg=new RegExp(aLi[0].getAttribute('pattern'));
    if(name.match(reg) && pwd){
        window.localStorage.setItem('isLogin',1);
    }
})










