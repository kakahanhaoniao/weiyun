// tips组件
function Tips(opt){
    this.init(opt);
}
Tips.prototype={
    constructor:Tips,
    init:function(opt){
        this.opt={
            type:'success',
            showText:'请输入内容...',
            successClass:'success',
            errorClass:'error',
            callback:null,
            tipId:'messageTips'
        };
        $.extend(this.opt,opt);
        this.createBox();
        this.show();
        this.hide();
    },
    show:function(){
        this.width=this.tipBox.offsetWidth;
        this.height=this.tipBox.offsetWidth;
        $(this.tipBox).css('magin-left',-this.width/2+'px').css('top',-this.height+'px').animate({'top':0},500);
    },
    hide:function(){
        var _this=this;
        clearTimeout(this.timer);
        this.timer=setTimeout(function(){
            $(_this.tipBox).animate({'top':-_this.height},500,function(){
                 document.body.appendChild(_this.tipBox);
            });
        },2000)        
    },
    createBox:function(){
        this.tipBox=document.createElement('div');
        this.tipBox.id=this.opt.tipId;
        this.showTextBox=document.createElement('div');
        this.showTextBox.className='content '+this.opt[this.opt.type+'Class'];
        this.showTextBox.innerHTML='<i class="ico"></i>'+this.opt.showText;
        this.tipBox.appendChild(this.showTextBox);
        document.body.appendChild(this.tipBox);
    }
}














