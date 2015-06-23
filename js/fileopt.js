
// 将数据转成目录树
function jsonToTree(json,parentNode,childNode,newChilName){
    var newJson={};
    parentNode?null:parentNode='parentId';
    childNode?null:childNode='id';
    newChilName?null:newChilName='_child';
    // 初始化清除对象的newChilName属性
    for(var m in json){
        typeof json[m][newChilName]=='undefined'?null:delete json[m][newChilName];
    }
    for(var i in json){
        if(newJson[i]) continue;
        if(json[i][parentNode]=='0'){
            newJson[i]=json[i];
        }else{
            var parent=json[json[i][parentNode]];
            typeof parent[newChilName]=='undefined'?parent[newChilName]=[]:null;
            parent[newChilName].push(json[i]);
            // 是否有子集文件夹
            if(json[i].type=='folder') parent.hasfolder=true;
        }
    }
    return newJson;
}

/**
 * 对数据进行排序
 */
function listSortBy(list,field,sortby) {
    sortby=typeof sortby=='undefined'?'desc':sortby;
     var resultSet = {},tepArr=[];
     for(var i in list){
        tepArr.push(list[i]);
    }       
     tepArr.sort(function(a,b){
        var result;
        switch (sortby) {
           case 'asc': // 正向排序
            return b[field]>a[field];
            break;
           case 'desc':// 逆向排序
            return a[field]>b[field];
            break;
         }
     })
     for(var m=0;m<tepArr.length;m++){
        resultSet[tepArr[m].id]=tepArr[m];
     }
     return resultSet?resultSet:false;
}

// 生成日期对象
function dateFormat(time,splitChar){
    var date=typeof time=='undefined'?new Date():new Date(time);
    splitChar?splitChar:splitChar='-';
    var arr=[addZero(date.getFullYear()),addZero(date.getMonth()+1),addZero(date.getDate())];
    var hour=addZero(date.getHours());
    var min=addZero(date.getMinutes());
    return arr.join(splitChar)+' '+hour+':'+min;
}
// 自动补0
function addZero(str){
    if(str.length==1){
        str='0'+str;
    }
    return str;
}

// 获取文件的所有父级
function getParentId(id,arr){
    arr?arr:arr=[];
    arr.push(id);
    if(id!='0'){
        if(file[id]){
            getParentId(file[id].parentId,arr);
        }
    }    
    return arr;
}

// 添加目录(isNoShowFile 用来设置文件展示区域是否也随着变化，该值设置的话，文件 区域不显示)
function addDictory(data,addToObj,isNoShowFile){
    var oldchild=addToObj.children;
    // 判断是不是根目录
    if(oldchild[0].getAttribute('data-id')=='0'){
        oldchild[0].children[0].onclick=function (ev) {
                if(this.parentNode.className){
                    dtToggle(this,this.parentNode,isNoShowFile);
                }
        }
    }
    
    oldchild.length>1?addToObj.removeChild(oldchild[1]):null;
    var odd=document.createElement('dd');
    for(var i in data){
        if(data[i].type!='folder') continue;
        var ndl=document.createElement('dl');
        var ndt=document.createElement('dt');
        ndt.setAttribute('data-id',data[i].id);
        if(data[i].hasfolder) {
            ndt.className='haschild';
            ndt.innerHTML='<i></i>';
        }
        ndt.onclick=function(ev){
            if(this.className){
                dtToggle(this,ev,isNoShowFile);
            }
            typeof isNoShowFile=='undefined'?showFiles(this.getAttribute('data-id')):null;
        }
        ndt.innerHTML+='<p class="filename">'+data[i].name+'</p>';
        ndl.appendChild(ndt);
        odd.appendChild(ndl);
    }
    addToObj.appendChild(odd);
}

// 有子集的dt的click
function dtToggle(obj,ev,isNoShowFile){
    ev=ev||window.event;
    var siblings=obj.parentNode.children;
    // 判断父集的子集长度大于1且对象是dt
    if(siblings.length>1 && obj.nodeName.toLowerCase()=='dt'){
        //已经添加过子集
        if(obj.children[0].className){
            obj.children[0].className='';
            siblings[1].style.display='none';
        }else{
            obj.children[0].className='show';
            siblings[1].style.cssText='';
        }
    }else if(obj.parentNode.getAttribute('data-id')=='0'){
        // 微云的i标签click
        if(obj.className=='show'){
            obj.className='';
            obj.parentNode.parentNode.children[1].style.display='none';
        }else{
            obj.className='show';
            obj.parentNode.parentNode.children[1].style.display='block';
        }
    }else{
      // 获取子集
      obj.children[0].className='show';
      //添加目录
      addDictory(file[obj.getAttribute('data-id')]._child,obj.parentNode,isNoShowFile);  
    }
}

// 获取文件列表
function showFiles(parentId){
    var data;
    if(parentId=='0' || !parentId){
        data=fileJson;
    }else if(typeof file[parentId]._child=='undefined'){
        data=null;
    }else{
        data=file[parentId]._child;
    }
    var container=$('#folderList');
    container.html('');
    if(data){
        var text='',oli;
        for(var i in data){
            oli=$(document.createElement('li'));
            oli.attr('data-id',data[i].id);
            oli.html("<div class='con'><i class='file filetype-"+data[i].type+"'></i><p class='filename'>"+data[i].name+"</p><span class='check'></span></div>");
            // oli 绑定事件
            bindEvent(oli,data[i].type);
            container.appendChild(oli[0]);
        }
    }else{
        // no data
        container.html('<div class="empty-box"><div class="ico-empty"></div><p class="top">暂无文件</p><p>请点击左上角的“添加”按钮添加</p></div>');
    }
    // 显示文件的绝对路径
    showPath(parentId);
}

// 为文件展示中的文件添加内容
function bindEvent(obj,fileType){
    // 文件夹查看内容
    if(fileType=='folder'){
        obj.on('click',function(ev){
            showFiles(this.getAttribute('data-id'));
        })
    }
    // 右键菜单
    obj.on('contextmenu',contextMenu);   
    // checkbox 选中取消
    obj.find('.check').on('click',function(ev){
        var oli=obj;
        ev=ev||window.event;
        if(this.className.match(/(^|\s+)\bchecked\b/)){
            $(this).removeClass('checked');
            oli.removeClass('checked');
        }else{
            $(this).addClass('checked');
            oli.addClass('checked');
        }
        ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
        ev.preventDefault();
        return false;
    });
}

// 获取文件路径
function showPath(id){
    if(!id) return;
    var aPath=getParentId(id).reverse(),oA;
    var mainbox=$('#mainPath');
    mainbox.html('');
    for(var i=0;i<aPath.length;i++){
        oA=$(document.createElement('a'));
        oA.attr('data-id',aPath[i]);
        if(aPath[i]=='0'){
            oA.attr('class','topPath');            
        }
        if(i==aPath.length-1){
            oA.attr('class','isNow'); 
        }
        oA.html(aPath[i]=='0'?'微云':file[aPath[i]].name);
        oA.on('click',function(){
            showFiles(this.getAttribute('data-id'));
            return false;
        })
        mainbox.appendChild(oA[0]);
    }
}

// 文件右键菜单
function contextMenu(ev){
    ev=ev||window.event;
    var _this=this;
    var oW=160,oH=175;
    var winW=document.documentElement.clientWidth,winH=document.documentElement.clientHeight;
    var x=ev.clientX,y=ev.clientY,dialogX=dialogY=0;
    if(!this.className.match(/(^|\s+)\bchecked\b/)){
        $("#folderList").find('.checked').removeClass('checked');
        $(this).addClass('checked').find('.check').addClass('checked');
    }    
    if(x+oW>winW){
        dialogX=winW-oW-5;
    }else{
        dialogX=x;
    }
    if(y+oH>winH){
        dialogY=winH-oH-5;
    }else{
        dialogY=y;
    }
    $.ajax({
            method:'get',
            url:'../disk/dialog/contextmenu.html',
            success:function(data){
                typeof window.contextMenudialog=='undefined'?window.contextMenudialog=document.createElement('div'):window.contextMenudialog=contextMenudialog;
                contextMenudialog.id='contextmenu';
                contextMenudialog.innerHTML=data;
                contextMenudialog.dataid=_this.getAttribute('data-id');
                document.body.appendChild(contextMenudialog);
                contextMenudialog.style.left=dialogX+'px';
                contextMenudialog.style.top=dialogY+'px';
                optClick(contextMenudialog);
            }
        })    
    ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
    ev.preventDefault();
    return false;
}

/* 删除页面上不需要显示的dom
*fileIsShow boolean 设置选中的文件夹是否取消
*/
function removeOtherDom(fileIsShow){
    if(!fileIsShow){
        $("#folderList").find('.checked').removeClass('checked');
    }
    if(window.contextMenudialog){
        document.body.removeChild(contextMenudialog);
        delete window.contextMenudialog;
    }
}


/*
 *判断文件有没有在拖拽框里面(参数为拖拽框的上右下左位置)
 *l => left ,r=>right
 *t=>top ,b => bottom
 */
function checkFileInDraw(l,t,r,b){
    var aFile=document.getElementById('folderList').children;
    var aIndex=[],ol=or=ot=ob=0;
    for(var i=0;i<aFile.length;i++){
        ol=aFile[i].offsetLeft;
        or=ol+aFile[i].offsetWidth;
        ot=aFile[i].offsetTop;
        ob=ot+aFile[i].offsetHeight;
        if(!(r<ol || l>or || b<ot || t>ob )){
            aIndex.push(i);
        }
    }
    return aIndex;
}

// document 拖拽事件
function documentDraw(ev){
    // 鼠标拖拽功能 1 鼠标按下
    ev=ev||window.event;
    var x=ev.clientX,y=ev.clientY,oH=oW=ox=oy=0,aIndex;
    var oFolderbox=$('#folderList');
    var aFiles=oFolderbox.find('li');
    typeof window.screenCap=='undefined'?window.screenCap=document.createElement('div'):window.screenCap=screenCap;
    if(this.setCapture) this.setCapture();    
    screenCap.id='screenCap';
    // 右键自定义菜单取消
    removeOtherDom(1);
    this.onmousemove=function(ev){
        // 鼠标拖拽功能 2 鼠标移动
        ev=ev||window.event;
        ox=ev.clientX<x?ev.clientX:x;
        oy=ev.clientY<y?ev.clientY:y;
        oW=Math.abs(ev.clientX-x);
        oH=Math.abs(ev.clientY-y);
        // 修复li点击是复发move事件的bug
        if(oW<10 && oH<10)return;
        // 移除所有被选中的file
        oFolderbox.find('.checked').removeClass('checked');
        screenCap.style.left=ox+'px';
        screenCap.style.top=oy+'px';
        screenCap.style.width=oW+'px';
        screenCap.style.height=oH+'px';
        
        document.body.appendChild(screenCap);
        // 计算被框选中的file
        aIndex=checkFileInDraw(ox,oy,ox+oW,oy+oH);
        while(aIndex.length>0){
            aFiles.eq(aIndex.shift()).addClass('checked').find('.check').addClass('checked');
        }
    }
    this.onmouseup=function(ev){
        // 鼠标拖拽功能 3 鼠标松开
        this.onmousemove=this.onmouseup=null;
        if(document.getElementById('screenCap')){
            this.body.removeChild(screenCap);
        }        
        delete window.screenCap;
        if(this.releaseCapture) this.releaseCapture();
    };
    ev.preventDefault();
    return false;
}

// 文件重命名
function rename(){
    // 重命名只能命名一个
    var aId=checkFileIschecked();
    if(aId.length==0){
        new Tips({showText:'请选择文件',type:'error'});
        return;
    }
    if(aId.length>1){
        new Tips({showText:'只能对单个文件(夹)命名',type:'error'});
        return;
    }
    var id=aId[0];
    var obj=$('#folderList').find('[data-id='+id+']');
    var input=$(document.createElement('input'));
    var oFilename=obj.find('.filename');
    var oldVal=oFilename.html();
    oFilename.html('');
    input.val(oldVal).addClass('editName').attr('data-name-id',id);
    input.attr('type','text');
    // 取消拖拽事件
    $(document).off('mousedown');
    // 鼠标输入(确定输入)
    input.on('keydown',function(ev){
        ev=ev||window.event;
        var id=$.trim($(this).attr('data-name-id'));
        var keycode=ev.keyCode;
        var value=$.trim(this.value);
        if(!value) return;
        this.oldvalue=value;
        if(keycode==13){
            oFilename.html(value);
            file[id].name=value;
            syncName(id,value);
        }
    }).on('click',function(ev){
        ev=ev||window.event;
        ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
        ev.preventDefault();
        return false;
    })
    oFilename.appendChild(input[0]);
    input[0].select();
}

// click的文件确认重命名
function sureRename(){
    var obj=$('#folderList');
    var aNeedsure=obj.find('.editName');
    if(aNeedsure.length==0) return;
    var value=$.trim(aNeedsure.val());
    var id=aNeedsure.attr('data-name-id');
    if(id){
        value=value?value:aNeedsure[0].oldvalue;
        file[id].name=value;
        aNeedsure.parent().html(value);
        syncName(id,value);
    }else{
        var pLi=aNeedsure.parent().parent().parent();
        // 有值就新建文件夹 没有就删除
        if(value){
            creatNewFolder(pLi,value);
            // 为文件夹绑定事件
            bindEvent(pLi,'folder');
        }else{
           obj.removeChild(pLi[0]); 
       }        
    }
    // 绑定拖拽事件
    $(document).on('mousedown',documentDraw);
}

// 重命名文件夹同步名称
function syncName(id,value){
    var aObj=$('[data-id='+id+']');
    for(var i=0;i<aObj.length;i++){
        if(aObj[i].nodeName.toLowerCase()=='dt'){
            aObj.eq(i).find('.filename').html(value);
        }else if(aObj[i].nodeName.toLowerCase()=='a'){
            aObj.eq(i).html(value);
        }
    }
    new Tips({showText:'更名成功',type:'success'});
}

// 获取选中文件，返回所有选中的id
function checkFileIschecked(){
    var aObj=$('#folderList').find('li');
    var arr=[];
    for(var i=0;i<aObj.length;i++){
        if($(aObj[i]).hasClass('checked')){
            arr.push($(aObj[i]).attr('data-id'));
        }
    }
    return arr;

}


// 下载 分享 移动到 重命名 删除 新建文件夹 按钮的操作
function optClick(box){
    var oBox=$(box);
    aA=oBox.find('a');
    for(var i=0;i<aA.length;i++){
        aA.eq(i).on('click',function(ev){
            ev=ev||window.event;
            if(this.className=='rename'){       
                // 重命名         
                rename();                    
            }else if(this.className=='makedir'){
                // 新建文件夹
                makeDirectory();
            }else if(this.className=='del'){
                // 删除文件夹
                delFile();
            }else if(this.className=='refresh'){
                // 刷新文件目录和文件展示
                refreshFile();
            }else if(this.className=='share'){
                // 分享
                shareFile();
            }else if(this.className=='move'){
                // 移动到
                moveFile();
            }
            // 判断是页面按钮还是弹框
            if(!oBox.hasClass('optLeft')){
                document.body.removeChild(box);
            }
            ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
            ev.preventDefault();
            return false;
        }).on('mousedown',function (ev) {
            ev=ev||window.event;
            ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
            ev.preventDefault();
            return false;
        });
    }
}




// 新建文件夹
function makeDirectory(){
    var oLi=$(document.createElement('li'));
    var box=$('#folderList');
    sureRename();
    oLi.html('<div class="con"><i class="file filetype-folder"></i><p class="filename"><input class="editName" type="text"></p><span class="check checked"></span></div>');
    $(document).off('mousedown');
    var oInput=oLi.find('input');
    oInput.on('keydown',function(ev){
        ev=ev||window.event;
        var value=$.trim(this.value);
        if(!value) return;
        var keycode=ev.keyCode;
        if(keycode==13){
            creatNewFolder(oLi,value);
            // 为文件夹绑定事件
            bindEvent(oLi,'folder');
            // 绑定拖拽事件
            $(document).on('mousedown',documentDraw);
        }
    }).on('click',function(ev){
        ev=ev||window.event;
        ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
        ev.preventDefault();
        return false;
    })
    box.insertBefore(oLi[0],box[0].childNodes[0]);
    oInput[0].focus();
}

// 确认生成新文件夹
function creatNewFolder(obj,value){
    // 验证文件名是否存在
    for(var i in file){
        if(file[i].name==value && file[i].type=='folder'){
            new Tips({showText:'文件夹名有冲突，请重新命名',type:'error'});
            return;
        }
    }
    var id=newId();
    var pid=$('.isNow').attr('data-id');
    obj.find('.filename').html(value);
    obj.attr('data-id',id);
    // 添加新文件夹
    file[id]={
        id:id,
        type:'folder',
        name:value,
        parentId:pid,
        size:0,
        createtime:dateFormat()
    };
    new Tips({showText:'新建文件夹成功',type:'success'});
    // 更新目录树
    fileJson=jsonToTree(listSortBy(file,'createtime','asc'));
    addDictory(fileJson,document.getElementById('newDictory'));
}

// 生成file的递增id
function newId(){
    var maxid=reNum=0;
    for(var i in file){
        maxid=Math.max(maxid,i);
    }
    maxid=maxid+1+'';
    return new Array(7-maxid.length).join('0')+maxid;
}


// 删除文件夹
function delFile(){
    // 判断选中的file的id
    var aId=checkFileIschecked();
    var oBox=$('#folderList');
    if(aId.length==0){
        // 错误提示
        new Tips({showText:'请选择文件',type:'error'});
        return;
    }else if(!confirm('确定要删除文件吗？')){
        return;
    }

    for(var i=0;i<aId.length;i++){
        oBox.removeChild(oBox.find('[data-id='+aId[i]+']')[0]);
        delFiles(aId[i]);
    }
    new Tips({showText:'删除文件成功',type:'success'});
    // 更新目录树
    fileJson=jsonToTree(listSortBy(file,'createtime','asc'));
    addDictory(fileJson,document.getElementById('newDictory'));
}

// 删除某个id的所有子孙集
function delFiles(id){
    if(id=='0') return;
    var stack=[];
    stack.push(file[id]);
    while(stack.length){
        var node=stack.shift();
        node._child?stack.push.apply(stack,node._child):null;
        delete file[node.id];
    }
}

// 刷新文件目录和文件展示
function refreshFile(){
     // 更新目录树
    fileJson=jsonToTree(listSortBy(file,'createtime','asc'));
    addDictory(fileJson,document.getElementById('newDictory'));
    // 显示文件(顶级目录)
    showFiles($('.isNow').attr('data-id'));
}

// 分享文件
function shareFile() {
    // 判断选中的file的id
    var aId=checkFileIschecked();
    if(aId.length==0){
        // 错误提示
        new Tips({showText:'请选择文件',type:'error'});
        return;
    }
    $.ajax({
        method:'get',
        url:'../disk/dialog/share.html?'+new Date().getTime(),
        success:function(data){
            var title='"'+file[aId[0]].name+'"'+(aId.length>1?'等'+aId.length+'个文件(夹)':'');
            var dialog=new Dialog({
                content:data,
                title:'分享：'+title,
            });
            var shareBox=$('#share');
            var oTab=shareBox.find('.tab');
            var oShareBox=shareBox.find('.sharebox');
            // 设置分享链接
            var url='http://'+window.location.host+'/'+aId.join('');
            shareBox.find('.copy').html('<a href="'+url+'" target="_blank">'+url+'</a>');
            shareBox.find('.copyLink').on('click',function(ev){
                // window.clipboardData.setData("Text", url);
                shareBox.find('.copyMeg').html('复制链接成功');
            });
            // 邮件链接
            shareBox.find('textarea').val('我通过微云给你分享了'+title+'\n'+url);

            // tab键切换
            oTab.find('a').on('click',function(ev){
                ev=ev||window.event;
                oTab.find('a').removeClass('on');
                oShareBox.css('display','none');
                this.className='on';
                oShareBox.eq($(this).index()).css('display','block');
                ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
            });
            // Todo 添加联系人 

            // 发送邮件
            shareBox.find('.sendEmail').on('click',function(ev){
                // Todo 验证邮件联系人地址是否正确
                shareBox.find('.sendEmailMsg').html('邮件发送成功');
            });
        }
    })
}


// 移动文件夹
function moveFile() {
    // 判断选中的file的id
    var aId=checkFileIschecked();
    if(aId.length==0){
        // 错误提示
        new Tips({showText:'请选择文件',type:'error'});
        return;
    }
    $.ajax({
        method:'get',
        url:'../disk/dialog/move.html?'+new Date().getTime(),
        success:function (data) {
            var moveFile=file[aId[0]].name+(aId.length>1?'<span>等'+aId.length+'个文件(夹)</span>':'');
            var dialog=new Dialog({
                content:data,
                title:'选择存储位置',
                sureBtn:true,
                cancleBtn:true,
                sureFn:function() {
                    
                    var pId=$('#moveFile').find('.showPath').attr('data-id');
                    if(!pId) return;
                    for(var i=0;i<aId.length;i++){
                        file[aId[i]].parentId=pId;
                    }
                    // 更新目录
                    fileJson=jsonToTree(file);
                    addDictory(fileJson,document.getElementById('newDictory'));
                    // 显示文件(顶级目录)
                    showFiles($('.isNow').attr('data-id'));
                    // 关闭弹框
                    this.close();
                    new Tips({showText:'文件移动成功',type:'success'});
                }
            });
            var box=$('#moveFile');
            var title=box.find('.movetitle');
            var path=box.find('.showPath');
            var dir=box.find('.newDictory');
            title.find('.file').addClass('fileSmall-'+file[aId[0]].type);
            title.find('.titlename').html(moveFile);
            addDictory(fileJson,box.find('.newDictory')[0],true);
            // 添加移动的位置
            dir.on('click',function (ev) {
                ev=ev||window.event;
                var target=ev.target||ev.srcElement;
                if(target.parentNode.nodeName.toLowerCase()=='dt'){
                    var selectId=target.parentNode.getAttribute('data-id');
                   if(!selectId) return;
                   var aPath=getParentId(selectId).reverse();
                   var text='';
                   for(var i=0;i<aPath.length;i++){
                        text+=(aPath[i]=='0'?'微云':file[aPath[i]].name)+((i==aPath.length-1)?'':'\\');
                   }
                   path.html(text);
                   path.attr('data-id',selectId);
                }
               
               // Todo 判断相同路径 和确定按钮是否可以被点击
            })
        }
    })
}
