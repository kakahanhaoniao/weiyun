/**********封装类jquery对象(精简版)**********/
/*
 *获取元素不匹配$('p>c|p~c')等中间有连接符的，只匹配空格断开
 */
(function(window){
    function Jq(obj) {
        return new Jq.fn.init(obj);
    }
    Jq.fn=Jq.prototype={
        constructor:Jq,
        init:function(obj){
            var type=typeof obj;
            this.timer=null;
            this.length=0;
            this.element=[];
            this.queue=[];
            switch(type){
                case 'string':
                    var temp=obj.split(' ');
                    var ele=undefined;
                    var select=temp[0].charAt(0);
                    switch(select){
                        case '.':
                            ele=this.getEleByClass(temp[0].substring(1),ele);
                            break;
                        case '#':
                            ele=this.getEleById(temp[0].substring(1),ele);
                            break;
                        case'[':
                            ele=this.getEleByAttr(temp[0].substring(1,temp[0].length-1),ele);
                            break;
                        default:
                            ele=this.getEleByName(temp[0],ele);
                    }
                    ele?this.objPush(ele):null;
                    break;
                case 'function':
                    window.onload=obj;
                    break;
                case 'object':
                    this.element.push(obj);
                    this.length=1;
                    this[0]=obj;
                    break;
                case 'undefined':
                    return this;
                    break;
            }

        },
        // 通过id获取dom
        getEleById:function(id){
            return [document.getElementById(id)];
        },
        // 通过class获取dom
        getEleByClass:function(className,parents){
            var parent,cloneElements=elements=[];
            parent=parents||document;
            cloneElements=parent.getElementsByTagName('*');
            // this.cloneElements=parent.getElementsByTagName('*');
            for(var i=0;i<cloneElements.length;i++){
                var temClass=cloneElements[i].getAttribute('class');
                if(!temClass)continue;
                var aClass=Jq.trim(temClass);
                // var reg=new RegExp('\\b'+className+'\\b');
                var reg=new RegExp('\(\^\|\\s+\)\\b'+className+'\\b','g');
                if(aClass && aClass.match(reg)){                
                    elements.push(cloneElements[i]);
                }
            }
            return elements;
        },
        // 通过标签获取dom
        getEleByName:function(tagName,parents){
            var parent=elements=[];
            parent=this.getEleParentToArr(parents);
            for(var m=0;m<parent.length;m++){
                elements.push.apply(elements,parent[m].getElementsByTagName(tagName));
            }
            return elements;
        },
        // 通过属性获取dom
        getEleByAttr:function(attr,parents){
            var parent=cloneElements=elements=[];
            var aAttr=attr.split('='),attrstr;
            var reg=new RegExp('\(\^\|\\s+\)\\b'+aAttr[1]+'\\b','g');
            parent=parents||document;
            cloneElements=parent.getElementsByTagName('*');
            for(var i=0;i<cloneElements.length;i++){
                attrstr=cloneElements[i].getAttribute(aAttr[0]);
                if( attrstr && attrstr.match(reg)){
                    elements.push(cloneElements[i]);
                }
            }    
            return elements;            
        },
        find:function(tagname){
            if(typeof tagname=='undefined') throw "选择器名称不能为空";
            var i=0,first,temElement=[];
            for(;i<this.length;i++){
                first=tagname.split(' ')[0].charAt(0);
                switch(first){
                        case '.':
                            temElement.push.apply(temElement,this.getEleByClass(tagname.substring(1),this.element[i]));
                            break;
                        case '#':
                            temElement.push.apply(temElement,this.getEleById(tagname.substring(1),this.element[i]));
                            break;
                        case '[':
                            temElement.push.apply(temElement,this.getEleByAttr(tagname.substring(1,tagname.length-1),this.element[i]));
                            break;
                        default:
                            temElement.push.apply(temElement,this.getEleByName(tagname,this.element[i]));
                    }
                    
            }
            var newObj=this.delNumEle();
            temElement?newObj.objPush(temElement):null;
            return newObj;
        },
        eq:function(index){
            if(index<0 || isNaN(index)) return null;
            var ele=this.element.length?this.element[index]:null;
            var newObj=this.delNumEle();
            ele?newObj.objPush(ele):null;
            return newObj;
        },
        parent:function(){
            ele=this.element[0].parentNode;
            var newObj=this.delNumEle();
            ele?newObj.objPush(ele):null;
            return newObj;
        },
        getEleParentToArr:function(parents){
            var parent=[];
            if(parents instanceof Array && typeof parents =='object'){
                // 传入父级是一组对象
                parent=parents;
            }else if(typeof parents=='object'){
                // 传入单个对象
                parent.push(parents);
            }else if(typeof parents=='undefined'){
                // 未传入父级
                parent.push(document);
            }        
            return parent;
        },
        // 将查找到的dom加入到this对象中，同时更新element
        objPush:function(aobj){
            if(typeof aobj=='object'&& aobj instanceof Array){
                var len=aobj.length+this.length;
                for(var i=this.length;i<len;i++){
                    this[i]=aobj[i-this.length];
                    this.element.push(this[i]);
                }
                this.length=len;
            }else{
                this[this.length]=aobj;
                this.element.push(this[this.length]);
                this.length+=1;
            }
        },
        // 删除this对象的数字索引
        delNumEle:function(){
            // this=new Jq();
            // this.element.length=this.length=0;
            // for(var i in this){
            //     isNaN(i)?null:delete this[i];
            // }
            return Jq();
        },
        // 获取或者设置属性
        attr:function(attrName,attrVal){
            if(typeof attrName=='undefined') throw "属性名称不能为空";
            if(typeof attrVal!='undefined' ){
                for(var i=0;i<this.length;i++){
                    this.element[i].setAttribute(attrName,attrVal);
                }
            }else if(this.length==1){
                return this.element[0].getAttribute(attrName)
            }else{
                return undefined;
            }
            
        },
        removeAttr:function(attr){
            if(typeof attr=='undefined') throw "属性名称不能为空";
            for(var i=0;i<this.length;i++){
                this.element[i].removeAttribute(attr);
            }
        },
        // 获取行内css样式
        css:function (attr,value) {
            if(typeof attr=='undefined') throw "样式名称不能为空";
            if(value){
               for(var i=0;i<this.length;i++){
                    this.element[i].style[attr]=value;
                } 
                return this;
            }else if(this.length==1){
                return this.getStyle(this.element[0],attr);
            }else{
                return undefined;
            }
        },
        // 添加class
        addClass:function(name){
            if(typeof name=='undefined') throw "样式名称不能为空";
            var reg=new RegExp('\\b'+name+'\\b');
            for(var i=0;i<this.length;i++){
               if(!this.element[i].className.match(reg)){
                    this.element[i].className=Jq.trim(this.element[i].className)+' '+name;
               }
            }
            return this;
        },
        // 移除class
        removeClass:function(name){
            if(typeof name=='undefined') throw "样式名称不能为空";
            var reg=new RegExp('\(\^\|\\s+\)\\b'+name+'\\b','g');
            var allClass='';
            for(var i=0;i<this.length;i++){
                allClass=this.element[i].className;
                this.element[i].className=Jq.trim(allClass.replace(reg,'')).replace(/(\s{2,})/g,' ');
            }
            return this;
        },
        hasClass:function(name){
            if(typeof name=='undefined') throw "样式名称不能为空";
            var reg=new RegExp('\(\^\|\\s+\)\\b'+name+'\\b','g');
            if(this.element[0].className.match(reg)){
                return true;
            }
            return false;
        },
        //返回第一个element的所有同级元素的索引值
        index:function(){
            var siblings=this.element[0].parentNode.children;
            for(var i=0;i<siblings.length;i++){
                if(siblings[i]==this.element[0]){
                    return i;
                    break;
                }
            }
        },
        // 事件绑定
        on:function(type,fn,isbulle) {
            for(var i=0;i<this.length;i++){
                this.tiggerHander(this.element[i],type,fn);
            }
            return this;
        },
        // 取消事件绑定
        off:function(type) {
            for(var i=0;i<this.length;i++){
                this.cancelHander(this.element[i],type);
            }
            return this;
        },
        // 单个对象事件绑定
        tiggerHander:function(obj,type,fn){
            if(typeof obj.fn =='undefined') obj.fn=[];
            if( obj.addEventListener  ){
                obj.addEventListener(type,fn,false);
            }else{
                obj.attachEvent('on'+type,fn);
            }
            obj.fn.push(fn);

        },
        // 取消单个对象事件绑定
        cancelHander:function(obj,type){
            var i=0;
            if(typeof obj.fn=='undefined') return;
            if( obj.removeEventListener  ){
                for(;i<obj.fn.length;i++){
                    obj.removeEventListener(type,obj.fn[i],false);
                }                
            }else{
                for(;i<obj.fn.length;i++){
                    obj.detachEvent('on'+type,obj.fn[i]);
                }
            }
            delete obj.fn;
        },
        // 获取innerHTML
        html:function(val){
            if(typeof val=='undefined'){
                return this.element[0].innerHTML;
            }else{
                for(var i=0;i<this.length;i++){
                    this.element[i].innerHTML=val;
                }
            }
        },
        // 获取innerText
        text:function (val) {
            if(typeof val=='undefined')
            {
                var text='';
                for(var i=0;i<this.length;i++){
                    text+=this.element[i].innerText;
                }
                return text;
            }else{
                for(var i=0;i<this.length;i++){
                    this.element[i].innerText=val;
                }
            }
        },
        val:function(val){
            if(typeof val=='undefined')
            {
                return this.element[0].value;
            }else{
               for(var i=0;i<this.length;i++){
                    this.element[i].value=val;
               } 
               return this;
            }
        },
        appendChild:function(obj){
            for(var i=0;i<this.length;i++){
                this.element[i].appendChild(obj);
            }
        },
        insertBefore:function(newObj,childObj){
            for(var i=0;i<this.length;i++){
                this.element[i].insertBefore(newObj, childObj);
            }
        },
        removeChild:function(oldchild){
            for(var i=0;i<this.length;i++){
                this.element[i].removeChild(oldchild);
            }
        },
        animate:function(props,times,fx,callback){
            if(typeof times=='undefined'){
                times=500;
                fx='linear';
            }else if(typeof times=='string'){
                typeof fx=='function'?fn=fx:null;
                fx=times;
                times=500;
            }else if(typeof times=='function'){
                callback=times;
                times=500;
                fx='linear';
            }
            if(typeof fx=='function'){
                callback=fx;
                fx='linear';
            }else if(typeof fx=='undefined'){
                fx='linear';
            }
            for(var i=0;i<this.length;i++){
                this.element[i].cur={};
                for(var m in props){
                    var val=this.getStyle(this.element[i],m);
                    this.element[i].cur[m] = m=='opacity'?Math.round(val*100):parseFloat(val);
                    this.queue.push(this.element[i]);
                }
            }
            clearInterval(this.timer);
            var startTime=new Date(),_this=this;
            this.timer=setInterval(function(){
                var nowTime=new Date(),t=times-Math.max(0,startTime-nowTime+times);
                for(var i=0;i<_this.queue.length;i++){
                    for(m in props){
                        var val=Tween[fx](t,_this.queue[i].cur[m],props[m]-_this.queue[i].cur[m],times);
                        if(m=='opacity'){
                            _this.queue[i].style.opacity=val/100;
                            _this.queue[i].style.filter='alpha(opacity='+val+')';
                        }else{
                            _this.queue[i].style[m]=val+'px';
                        }
                    }
                }
                if(t==times){
                    clearInterval(_this.timer);
                    _this.queue.length=0;
                    callback && callback.call(this);
                }
            },30);
        },
        stop:function(){
            clearInterval(this.timer);
        },
        // stop:function(){
        //     for(var m=0;m<this.length;m++){
        //         for(var i=0;i<this.queue.length;i++){
        //             if(this.queue[i]==this.element[m]){
        //                 this.queue.splice(i,1);
        //                 break;
        //             }
        //         }                
        //     }
        // },
        // 获取元素样式
        getStyle:function(obj,attr){
            return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
        }
    };

    // 复制对象的属性方法，obj1复制obj2的属性或者方法。（简单复制，不包含深度复制）
    Jq.extend=function(obj1,obj2){
        for(var i in obj2){
            obj1[i]=obj2[i];
        }
    };

    // 增加Jq的构造函数的方法
    Jq.extend(Jq,{
        // ajax方法
        ajax:function(option){
            var opt={
                'method':(option.method || 'get').toLowerCase(),
                'url':option.url || '',
                'asyn':typeof option.asyn=='undefined'?true:option.asyn,
                'data':option.data || '',
                'dataType':(option.dataType  || '').toLowerCase(),
                'success':option.success,
                'fail':option.fail
            };
            var xhr=null;
            if(window.XMLHttpRequest){
                xhr=new XMLHttpRequest();
            }else{
                xhr=new ActiveXObject("Microsoft.XMLHTTP");
            }
            if(opt.method=='get') {
                opt.url+='?'+encodeURI(opt.data);
                opt.data=null;
            }
            xhr.open(opt.method,opt.url,opt.asyn);
            if(opt.method=='post') {
                xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
            }

            xhr.onreadystatechange=function(){
                if(xhr.readyState==4){
                    if(xhr.status==200){
                        var response=xhr.responseText;
                        if(opt.dataType=='json') {
                            response=eval(response);
                        }else if(opt.dataType=='xml'){
                            response=xhr.responseXML;
                        }
                        if(typeof opt.success =='function'){
                            opt.success(response);
                        }
                    }else{
                        if(typeof opt.fail =='function') opt.fail(xhr.status,xhr.responseText);
                    }
                }
            }

            xhr.send(opt.data);
        },
        // 去除字符串左右两侧空格
        trim:function(str){
            return str.replace(/^\s+|\s+$/,'');
        },
        version:'0.0.1',
        author:'xiaoshao'
    });

    // 修改Jq原型链上的init的原型链 为 Jq的原型链
    Jq.fn.init.prototype=Jq.prototype;
    window.$=window.Jq=Jq;

    var Tween = {
        /** 
         参数列表 
         
        t: current time(当前时间) 
        b: beginning value(初始值) 
        c: change in value(变化量//不懂看下边的解释) 
        d: duration(持续时间) 
         
        */  
        linear: function (t, b, c, d){  //匀速
            return c*t/d + b;
        },
        easeIn: function(t, b, c, d){  //加速曲线
            return c*(t/=d)*t + b;
        },
        easeOut: function(t, b, c, d){  //减速曲线
            return -c *(t/=d)*(t-2) + b;
        },
        easeBoth: function(t, b, c, d){  //加速减速曲线
            if ((t/=d/2) < 1) {
                return c/2*t*t + b;
            }
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInStrong: function(t, b, c, d){  //加加速曲线
            return c*(t/=d)*t*t*t + b;
        },
        easeOutStrong: function(t, b, c, d){  //减减速曲线
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
            if ((t/=d/2) < 1) {
                return c/2*t*t*t*t + b;
            }
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
            if (t === 0) { 
                return b; 
            }
            if ( (t /= d) == 1 ) {
                return b+c; 
            }
            if (!p) {
                p=d*0.3; 
            }
            if (!a || a < Math.abs(c)) {
                a = c; 
                var s = p/4;
            } else {
                var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
            if (t === 0) {
                return b;
            }
            if ( (t /= d) == 1 ) {
                return b+c;
            }
            if (!p) {
                p=d*0.3;
            }
            if (!a || a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else {
                var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },    
        elasticBoth: function(t, b, c, d, a, p){
            if (t === 0) {
                return b;
            }
            if ( (t /= d/2) == 2 ) {
                return b+c;
            }
            if (!p) {
                p = d*(0.3*1.5);
            }
            if ( !a || a < Math.abs(c) ) {
                a = c; 
                var s = p/4;
            }
            else {
                var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            if (t < 1) {
                return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
                        Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            }
            return a*Math.pow(2,-10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
        },
        backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
            if (typeof s == 'undefined') {
               s = 1.70158;
            }
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        backOut: function(t, b, c, d, s){
            if (typeof s == 'undefined') {
                s = 3.70158;  //回缩的距离
            }
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        }, 
        backBoth: function(t, b, c, d, s){
            if (typeof s == 'undefined') {
                s = 1.70158; 
            }
            if ((t /= d/2 ) < 1) {
                return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            }
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
            return c - Tween['bounceOut'](d-t, 0, c, d) + b;
        },       
        bounceOut: function(t, b, c, d){
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
            }
            return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
        },      
        bounceBoth: function(t, b, c, d){
            if (t < d/2) {
                return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
            }
            return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
        }
    }
    
    
})(window)



