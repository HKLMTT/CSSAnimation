/*
 * $.ca({x,y,z ... ,time, delay, cssEase }, complete, steping)
 * */
"use strict";
(function($) {
    $.ca = {
        getThis : function (a) {
            var t;
            a.each(function () {
                if(this.anim) {
                    t = this;
                    return;
                }
            })
            return t ? t : a[0];
        },
        get v(){
            return "0.0.27";
        }
    };
    console.log("init ca_v." + $.ca.v);
    var Browser = getBrowser();
    var transitions = {
        'transition'        : 'transitionend',
        '-moz-transition'   : 'transitionend',
        '-webkit-transition': 'webkitTransitionEnd'
    }
    var noanim      = {"perspective-origin":true,"transition":true};
    var aliasList   = {"x":"translateX","y":"translateY","z":"translateZ","pOrigin":"perspective-origin","tOrigin":"transform-origin","alpha":"opacity"};
    $.fn.ca = function (ops, callback, step) {//
        var _this = $.ca.getThis(this);
        if(_this.animList instanceof Array === false) _this.animList = [];
        var run = function (e) {
            if(e === "complete") {
                if(_this.anim.hide) this.hide(0);
                if(_this.animList[0][1]) {
                    var complete = _this.animList[0][1];
                    setTimeout(() => complete.call(this, e), 0);
                }
                _this.animList.shift();
                if(_this.anim) {
                    _this.anim.clear();
                    _this.anim = null;
                    delete _this.anim;
                }
            }
            if(_this.animList && _this.animList.length > 0) {
                _this.anim = new CA(this, _this.animList[0][0], (e) => run.call(this, e), step );
                window.setTimeout(() => _this.anim && _this.anim.run() , 0);
                //_this.anim && _this.anim.run();
            }else {
                this.css("transition" , "");
                if(_this.animList) delete _this.animList;
            }
        }
        _this.animList.push(arguments);
        if(_this.animList.length === 1) run.call(this);
        return this;
    }
    $.fn.caPlay     = function () {
        if(this[0].anim) this[0].anim.play();
        return this;
    }
    $.fn.caStop     = function () {
        if(this[0].anim) {
            this[0].anim.stop();
            this.caClear();
        }
        return this;
    }
    $.fn.caPause    = function () {
        if(this[0].anim) this[0].anim.pause();
        return this;
    }
    $.fn.caClear    = function () {
        this.each(function () {
            if(this.anim) {
                this.anim.clear();
                this.anim = null;
                this.animList = null;
                delete this.animList;
                delete this.anim;
            }
        })
        return this;
    }
    $.fn.caDelay    = function (delay, callback) {
        return this.ca({delay:isNaN(delay) ? 0 : delay, time:0}, callback);
    }
    $.fn.caX        = function () {
        return CA.getTranslate3d(this).x;
    }
    $.fn.caY        = function () {
        return CA.getTranslate3d(this).y;
    }
    $.fn.caZ        = function () {
        return CA.getTranslate3d(this).z;
    }
    $.fn.ca3D        = function () {
        return CA.getTranslate3d(this);
    }
    //折叠动画
    $.fn.caSlide    = function (b, t, callback, type) {
        if(!type) type = "slide";
        var an = `ca-${type}`;
        if(typeof b !== "boolean") {
            if(this.attr(an) === "hide" || this.css("display") === "none") b = false;
            else b = true;
        }else {
            b = !b;
        }
        if(t === undefined || isNaN(t)) t = 400;
        if(type === "flip"){
            this.css("transform-origin", "50% 50% 0");
            if(b) this.attr(an, "hide").caClear().ca({rotateX:90, alpha:0, hide:true, time:t}, callback);
            else this.attr(an, "show").caClear().ca({rotateX:90, alpha:0, hide:true, time:0}).ca({rotateX:0, alpha:1, time:t}, callback);
        }else if(type === "turn"){
            this.css("transform-origin", "50% 50% 0");
            if(b) this.attr(an, "hide").caClear().ca({rotateY:90, alpha:0, hide:true, time:t}, callback);
            else this.attr(an, "show").caClear().ca({rotateY:90, alpha:0, hide:true, time:0}).ca({rotateY:0, alpha:1, time:t}, callback);
        }else {
            this.css("transform-origin", "0 0");
            if(b) this.attr(an, "hide").caClear().ca({scaleY:0, hide:true, time:t}, callback);
            else this.attr(an, "show").caClear().ca({scaleY:0, alpha:1, hide:true, time:0}).ca({scaleY:1,time:t}, callback);
        }
        return this;
    }
    //翻转动画
    $.fn.caFlip     = function(b, t, callback) {
        this.caSlide(b , t === undefined ? 300 : t, callback, "flip");
        return this;
    }
    $.fn.caTurn     = function (b, t, callback) {
        this.caSlide(b , t === undefined ? 300 : t, callback, "turn");
        return this;
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
            this.hide       = false;//动画结束后是否隐藏
            this.css        = this.arrange(arguments[1]);
            this.complete   = arguments[2];
            this.steping    = arguments[3];
            //this.run();
        }
        //执行动画
        run(e){
            if(this.state === "pause" || this.obj === undefined || this.css  === undefined) return;
            this.state = "playing";
            if(e != "re" && this.time > 0) this.css[`transition`] = this.getTransition(this.time , this.ease , this.delay);
            if(this.timeout) clearTimeout(this.timeout);
            this.obj.show(0);
            if(this.obj.css("visibility") === "hidden") this.obj.css("visibility", "visible");
            //debugger;
            if(this.time === 0 && this.delay === 0) {
                this.obj.css(this.css)
                this.end.call(this , "complete");
            }else{
                if(this.time > 0) {
                    this.step(true);
                    this.obj.first().one(transitions[`${Browser}transition`], () => this.end.call(this, "complete"));
                    this.timeout = setTimeout(()=> this.end.call(this , "complete") , (this.time + this.delay) * 1.2);
                    this.obj.css(this.css)
                }else {
                    this.timeout = setTimeout(()=> {
                        this.obj.css(this.css)
                        this.end.call(this , "complete");
                    } , (this.time + this.delay) * 1.2);
                }
            }
        }
        //动画记步
        step(b){
            clearInterval(this.Interval);
            if(b) {
                this.starTime = new Date();
                if(this.steping) this.Interval = setInterval(() => {this.steping();} , 1000 / 30);
            }
        }
        //拼接Transition
        getTransition(time , ease , delay){
            var transition = "";
            if(time > 0) {
                for (var k in this.css) {
                    if (noanim[k] || this.css[k] == "") continue;
                    if (transition != "") transition += ",";
                    transition += `${k} ${time}ms ${ease}` + (delay > 0 ? ` ${delay}ms` : "");
                }
            }
            return transition;
        }
        //重置
        reset(callback){
            if(this.reanim) {
                this.step(true);
                this.obj.first().one(transitions[`${Browser}transition`] , () => callback.call(this));
            }else{
                this.obj.css("transition" , "");
                window.setTimeout(() => callback.call(this) , 0);
            }
            this.obj.css(this.lastcss);
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
            if(this.obj) this.obj.css("transition" , "");
            this.clear();
        }
        //动画完成  complete(事件,剩余执行次数)
        end(){
            this.step(false);
            if(this.timeout) clearTimeout(this.timeout);
            if(!this.obj) return;
            this.obj.off(transitions[`${Browser}transition`]);
            if(this.count === 0 || isNaN(this.count)) {
                this.state = "end";
                this.complete(arguments[0] , 0);
            }else{
                if(this.steping) this.steping("replay" , this.count);
                this.count--;
                this.reset(() => this.run("re"));
            }
        }
        //整理CSS
        arrange(ops) {
            var o = {"transform" : {}};//新建样式
            this.lastcss = {}; //备份初始样式
            this.oTf(this.obj);//转换初始transform
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
                        if(typeof ops[k] === "boolean") this.reanim = ops[k];
                        break;
                    case "hide" :
                        if(typeof ops[k] === "boolean") this.hide = ops[k];
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
                            o[css] = ops[k].toString();
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
                    if(args[i] !== null) this.transform[name][i] = args[i];
                }
            }else{
                this.transform[name] = [args];
            }

        }
        clear() {
            this.step(false);
            if(this.timeout) clearTimeout(this.timeout);
            if(this.obj) this.obj.off(transitions[`${Browser}transition`]);
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
            arg.forEach((k, i) => {if(k !== null && !isNaN(k)) arg[i] += "px"});
            this.setTf(arg , "translate3d" , [0 , 0 , 0]);
        }
        translate(arg) {
            this.translate3d([arg[0], arg[1] , null]);
        }
        translateX(arg) {
            this.translate3d([arg[0] , null , null]);
        }
        translateY(arg) {
            this.translate3d([null , arg[0] , null]);
        }
        translateZ(arg) {
            this.translate3d([null , null , arg[0]]);
        }
        //缩放
        scale3d(arg) {
            this.setTf(arg , "scale3d" , [1 , 1 , 1]);
        }
        scale(arg) {
            if(arg.length === 1) this.scale3d([arg[0] , arg[0]]);
            else this.scale3d([arg[0] , arg[1] , null]);
        }
        scaleX(arg) {
            this.scale3d([arg[0] , null , null]);
        }
        scaleY(arg) {
            this.scale3d([null , arg[0] , null]);
        }
        scaleZ(arg) {
            this.scale3d([null , null , arg[0]]);
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
            arg.forEach((k,i) => {if(k !== null && !isNaN(k)) arg[i] += "deg"});
            this.setTf(arg , "skew" , [0 , 0]);
        }
        skewX(arg){
            this.skew([arg[0]]);
        }
        skewY(arg){
            this.skew([null , arg[0]]);
        }
        //3D样式
        perspective(arg){
            this.setTf(isNaN(arg[0]) ? arg : `${arg[0]}px` , "perspective" , [0]);
        }
        static getTranslate3d(a){
            var defaults = $(a)[0].style.transform
            if (defaults && defaults.indexOf("translate3d") != -1) {
                defaults = defaults.match(/translate3d\((.*)\)/i)[1].replace(/px/ig, "").split(",");
                return defaults = {
                    x : Number(defaults[0]),
                    y : Number(defaults[1]),
                    z : Number(defaults[2])
                };
            } else if (defaults && defaults.indexOf("matrix") != -1) {
                defaults = defaults.match(/matrix\((.*)\)/i)[1].replace(/px/ig, "").split(",");
                return defaults =  {
                    x : Number(defaults[4]),
                    y : Number(defaults[5]),
                    z : 0
                };;
            }
            return defaults =  {
                    x : 0,
                    y : 0,
                    z : 0
            };;
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
