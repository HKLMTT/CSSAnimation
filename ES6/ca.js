/*
 * $.ca({x,y,z ... , time , delay , cssEase } , complete , steping)
 *
 *
 *
 * */
"use strict";
(function($) {
    $.fn.ca_v = "0.0.1";
    
    var Browser = getBrowser();
    var transitions = {
        'transition'        : 'transitionend',
        '-moz-transition'   : 'transitionend',
        '-webkit-transition': 'webkitTransitionEnd'
    }
    var noanim      = {"perspective-origin":true,"transition":true};
    var aliasList   = {"x":"translateX","y":"translateY","z":"translateZ","origin":"perspective-origin","alpha":"opacity"};
    console.log("Browser " , Browser);
    $.fn.ca = function (ops , callback , step) {
        if(this[0].animList instanceof Array === false) this[0].animList = [];
        var run = function (e) {
            if(e === "complete") {
                this[0].animList.shift();
                if(this[0].anim) {
                    this[0].anim.clear();
                    this[0].anim = null;
                    delete this[0].anim;
                }
            }
            if(this[0].animList.length === 0) {
                delete this[0].animList;
                if(callback) callback(e);
            }else {
                this[0].anim = new CA(this , this[0].animList[0] , (e) => run.call(this , e) , step );
                setTimeout(() => this[0].anim.run() , 0);
            }
        }
        this[0].animList.push(ops);
        if(this[0].animList.length === 1) run.call(this);
        return this;
    }
    $.fn.caplay     = function () {
        this[0].anim.play();
        return this;
    }
    $.fn.castop     = function () {
        this[0].anim.stop();
        return this;
    }
    $.fn.capause    = function () {
        this[0].anim.pause();
        return this;
    }
    $.fn.cax        = function (e) {
    
    }
    $.fn.cay        = function (e) {
    
    }
    $.fn.caz        = function (e) {
    
    }
    class CA {
        constructor(){
            if(typeof arguments[0] != "object" || this.state === "pause") return ;
            
            this.state      = "init";
            this.transform  = {};
            this.obj        = arguments[0];
            this.time       = 400;//动画时间 ms 毫秒
            this.delay      = 0;//动画延迟 ms 毫秒
            this.ease       = 'ease';//贝赛尔曲线
            this.count      = 0;//动画循环次数
            this.reanim     = false;//是否显示反向动画 当count不等于0时生效
            this.css        = this.arrange(arguments[1]);
            this.complete   = typeof arguments[2] === "function" ? arguments[2] : null;
            this.steping    = typeof arguments[3] === "function" ? arguments[3] : null;
            //this.run();
        }
        //执行动画
        run(e){
            if(this.state === "pause") return;
            this.state = "playing";
            if(e != "re") this.css[`transition`] = this.getTransition(this.time , this.ease , this.delay);
            this.obj.css(this.css);
            this.step(true);
            this.obj.first().one(transitions[`${Browser}transition`] , (e)=> this.end.apply(this , arguments));
        }
        //动画记步
        step(b){
            clearInterval(this.Interval);
            if(b) {
                this.starTime = new Date();
                this.Interval = setInterval(() => {if(this.steping) this.steping();} , 1000 / 30);
            }
        }
        //拼接Transition
        getTransition(time , ease , delay){
            var transition = "";
            for (var k in this.css) {
                if(noanim[k]) continue;
                if (transition != "") transition += ",";
                transition += `${k} ${time}ms ${ease}` + (delay > 0 ? ` ${delay}ms` : "");
            }
            return transition;
        }
        //重置
        reset(callback){
            this.obj.css(this.lastcss);
            if(this.reanim) {
                this.step(true);
                this.obj.first().one(transitions[`${Browser}transition`] , ()=>{
                    callback.apply(this , arguments);
                });
            }else{
                this.obj.css("transition" , "");
                window.setTimeout(() => callback.call(this) , 0);
            }
        }
        //播放动画
        play(){
            if(this.state != "pause") return;
            this.state = "playing";
            this.obj.css(this.pauseCss).css("transition" , this.getTransition(this.pauseTime , this.ease , this.delay));
            this.step(true);
        }
        //暂停动画
        pause(){
            if(this.state === "pause") return;
            this.state = "pause";
            this.step(false);
            var css  = window.getComputedStyle ? window.getComputedStyle(this.obj[0]) : this.obj[0].currentStyle,
                pcss = {};
            this.pauseCss = {};
            for (var k in this.css) {
                pcss[k] = css[k];
                this.pauseCss[k] = this.obj[0].style[k];
            }
            var s = Number(css["transition-duration"].split("s")[0]) * 1000,
                d = this.starTime - new Date();
            this.pauseTime = s + d;
            pcss["transition"] = "";
            this.obj.css(pcss);
        }
        //停止动画
        stop(){
            if(this.state === "init") return;
            this.state = "stop";
            this.obj.css("transition" , "");
            this.clear();
        }
        //动画完成  complete(事件,剩余执行次数)
        end(){
            this.step(false);
            if(this.count === 0) {
                this.obj.css("transition" , "");
                this.state = "end";
                if(this.complete) window.setTimeout(() => this.complete("complete" , 0) , 0);
                return ;
            }
            if(this.steping) this.steping("replay" , this.count);
            this.count--;
            this.reset(()=>this.run("re"));
        }
        //整理CSS
        arrange(ops){
            var o = {"transform" : {}};//新建样式
            this.lastcss = {}; //备份初始样式
            this.oTf(this.obj);//转换transform
            for (var k in ops) {
                switch (k) {
                    case "time" :
                        if(!isNaN(ops[k])) this.time = ops[k];
                        break;
                    case "delay" :
                        if(!isNaN(ops[k])) this.delay = ops[k];
                        break;
                    case "ease" : //贝赛尔曲线 string
                        if($.cssEase[ops[k]]) this.ease = $.cssEase[ops[k]];
                        else this.ease = ops[k];
                        break;
                    case "count" :
                        if(!isNaN(ops[k])) this.count = ops[k];
                        break;
                    case "reanim" :
                        if(!isNaN(ops[k])) this.reanim = ops[k];
                        break;
                    default :
                        var css = this.alias(k);
                        
                        if(typeof this[css] === "function") {
                            if(ops[k] instanceof Array) { // [ ... ] array
                                this[css](ops[k]);
                            } else {
                                this[css]([ops[k]]);
                            }
                        } else {
                            o[css] = ops[k];
                            this.lastcss[css] = this.obj.css(css);
                        }
                }
            }
            o["transform"] = "";
            for (var k in this.transform){
                if(o["transform"] != "") o["transform"] += " ";
                o["transform"] += `${k}(${this.transform[k]})`;
            }
            this.lastcss["transform"] = this.obj.css("transform");
            return o;
        }
        //获取CSS
        oTf(obj){
            var tf = obj[0].style.transform;
            if(tf === "") return ;
            let f = {};
            tf.replace(/([a-zA-Z0-9]+)\((.*?)\)/g , (o , k , a) => {
                f[k] = a.split(",");
                this[k](f[k]);
            });
        }
        
        alias(s){
            var ss = aliasList[s];
            return typeof ss === "string" ? ss : s;
        }
        
        setTf(args , name , defaults) {
            //if(args instanceof Array === false) return;
            if(!this.transform[name]) this.transform[name] = defaults;
            if(args instanceof Array) {
                for(var i in args) {
                    if(args[i]) this.transform[name][i] = args[i];
                }
            }else{
                this.transform[name] = [args];
            }
            
        }
        clear() {
            for (var k in this){
                this[k] = null;
                delete this[k];
            }
        }
        
        /*transform属性*/
        matrix(arg) {
            delete this.transform["matrix3d"];
            this.transform["matrix"] = arg;
        }
        matrix3d(arg) {
            delete this.transform["matrix"];
            this.transform["matrix3d"] = arg;
        }
        //坐标移动
        translate3d(arg) {
            arg.forEach((k,i) => {if(!isNaN(k)) arg[i] += "px"});
            this.setTf(arg , "translate3d" , [0 , 0 , 0]);
        }
        translate(arg) {
            this.translate3d([arg[0], arg[1] , NaN]);
        }
        translateX(arg) {
            this.translate3d([arg[0] , NaN , NaN]);
        }
        translateY(arg) {
            this.translate3d([NaN , arg[0] , NaN]);
        }
        translateZ(arg) {
            this.translate3d([NaN , NaN , arg[0]]);
        }
        //缩放
        scale3d(arg) {
            this.setTf(arg , "scale3d" , [1 , 1 , 1]);
        }
        scale(arg) {
            if(arg.length === 1) this.scale3d([arg[0] , arg[0]]);
            else this.scale3d([arg[0] , arg[1] , NaN]);
        }
        scaleX(arg) {
            this.scale3d([arg[0] , NaN , NaN]);
        }
        scaleY(arg) {
            this.scale3d([NaN , arg[0] , NaN]);
        }
        scaleZ(arg) {
            this.scale3d([NaN , NaN , arg[0]]);
        }
        //旋转    rotate IE rotate3d(0,1,0,deg) deg>90<270 bug
        rotate3d(arg) {
            if(!isNaN(arg[3])) arg[3] = arg[3] + "deg";
            this.setTf(arg , "rotate3d" , [0 , 0 , 0 , 0]);
        }
        rotate(arg) {
            this.setTf(isNaN(arg[0]) ? arg : `${arg[0]}deg` , "rotate" , [0]);
        }
        rotateX(arg) {
            this.setTf(isNaN(arg[0]) ? arg : `${arg[0]}deg` , "rotateX" , [0]);
            //this.rotate3d([1 , NaN , NaN , arg[0]]);
        }
        rotateY(arg) {
            this.setTf(isNaN(arg[0]) ? arg : `${arg[0]}deg` , "rotateY" , [0]);
            //this.rotate3d([NaN , 1 , NaN , arg[0]]);
        }
        rotateZ(arg) {
            this.setTf(isNaN(arg[0]) ? arg : `${arg[0]}deg` , "rotateZ" , [0]);
            //this.rotate3d([NaN , NaN , 1 , arg[0]]);
        }
        //斜切
        skew(arg){
            if(arg.length === 1) arg = [arg[0] , arg[0]];
            arg.forEach((k,i) => {if(!isNaN(k)) arg[i] += "deg"});
            this.setTf(arg , "skew" , [0 , 0]);
        }
        skewX(arg){
            this.skew([arg[0]]);
        }
        skewY(arg){
            this.skew([NaN , arg[0]]);
        }
        //3D样式
        perspective(arg){
            this.setTf(isNaN(arg[0]) ? arg : `${arg[0]}px` , "perspective" , [0]);
        }
    }
    
    /*贝赛尔曲线*/
    $.cssEase = {
        'ease'          : 'ease',
        'in'            : 'ease-in',
        'out'           : 'ease-out',
        'in-out'        : 'ease-in-out',
        'linear'        : "cubic-bezier(1,1,1,1)",
        'snap'          : 'cubic-bezier(0,1,.5,1)',
        'easeOutCubic'  : 'cubic-bezier(.215,.61,.355,1)',
        'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
        'easeInCirc'    : 'cubic-bezier(.6,.04,.98,.335)',
        'easeOutCirc'   : 'cubic-bezier(.075,.82,.165,1)',
        'easeInOutCirc' : 'cubic-bezier(.785,.135,.15,.86)',
        'easeInExpo'    : 'cubic-bezier(.95,.05,.795,.035)',
        'easeOutExpo'   : 'cubic-bezier(.19,1,.22,1)',
        'easeInOutExpo' : 'cubic-bezier(1,0,0,1)',
        'easeInQuad'    : 'cubic-bezier(.55,.085,.68,.53)',
        'easeOutQuad'   : 'cubic-bezier(.25,.46,.45,.94)',
        'easeInOutQuad' : 'cubic-bezier(.455,.03,.515,.955)',
        'easeInQuart'   : 'cubic-bezier(.895,.03,.685,.22)',
        'easeOutQuart'  : 'cubic-bezier(.165,.84,.44,1)',
        'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
        'easeInQuint'   : 'cubic-bezier(.755,.05,.855,.06)',
        'easeOutQuint'  : 'cubic-bezier(.23,1,.32,1)',
        'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
        'easeInSine'    : 'cubic-bezier(.47,0,.745,.715)',
        'easeOutSine'   : 'cubic-bezier(.39,.575,.565,1)',
        'easeInOutSine' : 'cubic-bezier(.445,.05,.55,.95)',
        'easeInBack'    : 'cubic-bezier(.6,-.28,.735,.045)',
        'easeOutBack'   : 'cubic-bezier(.175, .885,.32,1.275)',
        'easeInOutBack' : 'cubic-bezier(.68,-.55,.265,1.55)'
    };
    function getBrowser(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if (userAgent.indexOf("Opera")   > -1) return "-o-" //Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) return "-moz-";//Firefox浏览器
        if (userAgent.indexOf("Chrome")  > -1) return "";//Chrome浏览器
        if (userAgent.indexOf("Safari")  > -1) return "-webkit-";//Safari浏览器
        return "";
    }
}(jQuery));
