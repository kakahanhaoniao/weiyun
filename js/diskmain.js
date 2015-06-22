/*
 *页面初始化
 */
// 判断是否登陆
if(!window.localStorage.getItem('isLogin')) location.href='../disk/login.html';
// 添加目录树
file=listSortBy(file,'createtime','asc');
var fileJson=jsonToTree(file);
addDictory(fileJson,document.getElementById('newDictory'));
// 显示文件(顶级目录)
showFiles();

// 目录列表展开
$('#twocollum').on('click',function(){
    if($(this).attr('class')=='select'){
        $('.treebox').css('display','none');
        $(this).attr('class','');
    }else{
        $('.treebox').css('display','block');
        $(this).attr('class','select');
    }
    return false;
})

// 用户信息下拉列表
$('.icon-user').on('mouseenter',function(){
    $('.user').attr('class','user on');
    $('.userInfo').css('display','block');
})
$('.user').on('mouseleave',function(ev){
    $('.userInfo').css('display','none');
    $('.user').attr('class','user');
})

// 添加文件 下拉列表
$('.upload').on('mouseenter',function(){
    $('.addFileList').css('display','block');
})
$('.upload').on('mouseleave',function(){
    $('.addFileList').css('display','none');
})

// 阻止右键默认菜单，和删除自定义右键菜单
$(document).on('contextmenu',function(ev){
    ev=ev||window.event;

    // 取消自定义菜单（选中文件不取消）
    removeOtherDom(1);

    // 阻止默认事件
    ev.preventDefault();
    return false;

}).on('click',function(){
    // click的文件确认重命名
    sureRename();
    // 取消选中文件及自定义菜单
    removeOtherDom(0);
    
}).on('mousedown',documentDraw)

// 操作按钮组的事件组
optClick('.optLeft');







