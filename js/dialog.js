// 对话框组件
function Dialog(opt){
    this.init(opt);
}
Dialog.prototype={
    constructor:Dialog,
    init:function(opt){
         this.opt={
            dialogId:'dialog',
            modal:true,
            closeBtn:'closeDialog',
            move:true,
            content:'请输入内容...',
            title:'请输入标题',
            sureBtn:false,
            cancleBtn:false,
            sureFn:null,
            cancleFn:null
        };
        $.extend(this.opt,opt);
        // 创建对象
        this.createBox();
        var _this=this;
        $(this.title).on('mousedown',function(ev) {
            _this.movedown.call(_this,ev);
        });
        // 阻止dialog的冒泡到document的事件
        this.dialog.onmousedown=this.dialog.onclick=function(ev) {
            ev=ev||window.event;
            ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
        }

    },
    close:function(ev){
        ev=ev||window.event;
        this.dialog.style.display='none';
        document.body.removeChild(this.dialog);
        document.body.removeChild(this.mask);
        ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
        ev.preventDefault();
        return false;
    },
    movedown:function(ev){
        ev=ev||window.event;
        var _this=this;
        this.px=ev.clientX;
        this.py=ev.clientY;
        this.disx=this.px-this.dialog.offsetLeft;
        this.disy=this.py-this.dialog.offsetTop;
        if(this.setCapture) this.setCapture();   
        document.onmousemove=function (ev) {
            _this.move.call(_this,ev);
        };
        document.onmouseup=function (ev) {
            _this.moveup.call(_this,ev);
        };
        ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
    },
    move:function(ev){
        ev=ev||window.event;
        this.nx=ev.clientX-this.disx;
        this.ny=ev.clientY-this.disy;
        this.screenW=this.screenoffset().w;
        this.screenH=this.screenoffset().h;
        // 限制范围，不能超过可视窗
        if(this.nx<0) this.nx=0;
        if(this.nx>this.screenW-this.dialog.offsetWidth) this.nx=this.screenW-this.dialog.offsetWidth;
        if(this.ny<0) this.ny=0;
        if(this.ny>this.screenH-this.dialog.offsetHeight) this.ny=this.screenH-this.dialog.offsetHeight;
        $(this.dialog).css('left',this.nx+'px').css('top',this.ny+'px');
    },
    moveup:function(ev){
        ev=ev||window.event;
        if(this.releaseCapture) this.releaseCapture();
        document.onmousemove=document.onmouseup=null;
    },
    screenoffset:function(){
        return {
          w:window.innerWidth||document.documentElement.clientWidth,
          h:window.innerHeight||document.documentElement.clientHeight
       }
    },
    createBox:function(){
        // 回话模式
        if(this.opt.modal){
            this.mask=document.createElement('div');
            this.mask.id='dialogmask';
            document.body.appendChild(this.mask);
        }
        this.dialog=document.createElement('div');
        this.dialog.id=this.opt.dialogId;
        // 标题
        this.title=document.createElement('div');
        this.title.innerHTML=this.opt.title;
        this.title.className='title';
        this.dialog.appendChild(this.title);
        // 内容
        this.content=document.createElement('div');
        this.content.innerHTML=this.opt.content;
        this.content.className='dialogContent';
        this.dialog.appendChild(this.content);
        // 关闭按钮
        var _this=this;
        this.closeBtn=document.createElement('a');
        this.closeBtn.innerHTML='X';
        this.closeBtn.className='closeDialog';
        this.closeBtn.onclick=function(ev) {
            _this.close.call(_this,ev);
        };
        this.dialog.appendChild(this.closeBtn);
        this.btnBox=document.createElement('div');
        this.btnBox.className='dialogBtn';
        // 按钮
        if(this.opt.sureBtn || this.opt.cancleBtn){
            
            if(this.opt.sureBtn){
                this.sure=document.createElement('a');
                this.sure.className='sureBtn';
                this.sure.innerHTML='确定';
                this.btnBox.appendChild(this.sure);
                if(this.opt.sureFn && typeof this.opt.sureFn=='function'){
                    this.sure.onclick=function (ev) {
                        _this.opt.sureFn.call(_this,ev);
                    };
                }
            }
           if(this.opt.cancleBtn){
                this.cancle=document.createElement('a');
                this.cancle.className='cancle';
                this.cancle.innerHTML='取消';
                this.btnBox.appendChild(this.cancle);
                this.cancle.onclick=function (ev) {
                    _this.close.call(_this,ev);
                    if(_this.opt.cancleFn && typeof _this.opt.cancleFn=='function'){
                        _this.opt.cancleFn();
                    }
                }          

           }           

        }     
        this.dialog.appendChild(this.btnBox);
        document.body.appendChild(this.dialog);
        var dialogBox=$(this.dialog);
        dialogBox.css('left',this.screenoffset().w/2-dialogBox[0].offsetWidth/2+'px').css('top',this.screenoffset().h/2-dialogBox[0].offsetHeight/2+'px');
    }
}














