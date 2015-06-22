function Slide(opt){
    this.init(opt);
}
Slide.prototype={
    constructor:Slide,
    init:function(prop){
        this.px=this.mx=this.disx=0,this.timer=null;
        this.index=0;
        this.obj=this.box=this.imgList=this.tabList=null;
        this.opt={
            container:'.banner',
            containBox:'ul',
            imgList:'li',
            tabBox:'.tab',
            tabList:'a',
            direction:'left'
        };
        $.extend(this.opt,prop);
        this.obj=$(this.opt.container);
        this.box=this.obj.find(this.opt.containBox);
        this.imgList=this.obj.find(this.opt.imgList);
        this.tabBox=this.obj.find(this.opt.tabBox);
        this.tabList=this.tabBox.find(this.opt.tabList);
        this.len=this.imgList.length;
        var _this=this;
        this.obj.on('mouseover',function() {
            _this.mouseover.call(_this);
        }).on('mouseout',function () {
            _this.auto.call(_this);
        })
        this.tabBox.on('click',function(ev) {
            _this.tab.call(_this,ev)
        })
        this.auto.call(this);
    },
    mouseover:function () {
        clearInterval(this.timer);
    },
    mouseout:function () {
        this.auto();
    },
    tab:function (ev) {
        ev=ev||window.event;
        var target=ev.target||ev.srcElement;
        if(target.nodeName.toLowerCase()=='a'){
            this.index=$(target).index();
            this.play();
        }
    },   
    play:function(){
        this.tabList.removeClass('on');
        this.tabList.eq(this.index).addClass('on');
        this.box.animate({'left':-parseFloat(this.obj.css('width'))*this.index},500);
    },
    auto:function(){    
        var _this=this;
        clearInterval(this.timer);
        this.timer=setInterval(function(){
            _this.index++;
            _this.index%=_this.len;
            _this.play();
        },5000);
        
    }
};

$(function () {
    // 轮播图
    new Slide();
})

