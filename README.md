<h2>版本  <spen>v 0.0.27</spen></h2>

<h4>项目网站: http://hklmtt.iok.la:81/ca/</h4>

<pre>
食用方法:
$("#BOX").ca({x:100 , height:"10rem"} , complete , steping);
</pre>
<pre>
链式调用:
$("#BOX").ca({x:100 , height:"10rem"})
         .ca({rotate:180 , y:100 , background:"#10e410"})
         .ca({skew:[50, 20], color:"#f00"})
         .ca({skew:0 , scale:[2,2] , time:1000})
         .ca({y:30 , scale:1 , rotate:0   , color:"#fff"})
         .ca({height:"7rem" , rotate:0 })
         .ca({y:0 , background:"#E76E21"})
         .ca({scale:1 , x:0 , count:2 , reanim:true});
</pre>
<h2>基础方法</h2>
<table>
        <tr>
            <th>方法</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>
                $.ca(<a href="#ops-json">ops:JSON</a>, complete:Function, steping:Function);
            </td>
            <td>执行动画</td>
        </tr>
        <tr>
            <td>$.caPlay();</td>
            <td>
                恢复暂停的动画
                <br>
                <span class="am-text-danger">由于某些原因rotate旋转时恢复暂停在旋转角度小于180°时会反向旋转,不建议使用</span>
            </td>
        </tr>
        <tr>
            <td>$.caPause();</td>
            <td>暂停动画</td>
        </tr>
        <tr>
            <td>$.caStop();</td>
            <td>立即终止当前动画为完成状态,同时清空队列</td>
        </tr>
        <tr>
            <td>$.caClear();</td>
            <td>清空当前动画队列 (所有对同一对象执行的动画都会进入队列)</td>
        </tr>
        <tr>
            <td>$.caDelay(delay:Number, callback:Function);</td>
            <td>延时播放队列</td>
        </tr>
</table>

<h2 >回调函数</h2>
<table>
        <tr>
            <th style="width:20%;">名称</th>
            <th style="width:20%;">类型</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>complete</td>
            <td>Function</td>
            <td>动画完成回调函数 - $.ca(ops:JSON, <span class="am-text-danger">complete:Function</span>, steping:Function);</td>
        </tr>
        <tr>
            <td>steping</td>
            <td>Function</td>
            <td>动画过程回调函数 - $.ca(ops:JSON, complete:Function, <span class="am-text-danger">steping:Function</span>);</td>
        </tr>
</table>

<h2>ops:JSON - 基础属性</h2>
    <table>
        <tr>
            <th style="width:15%;">名称</th>
            <th style="width:15%;">类型</th>
            <th style="width:15%;">默认值</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>time</td>
            <td>Number</td>
            <td>400 (ms/毫秒)</td>
            <td>动画执行时间</td>
        </tr>
        <tr>
            <td>delay</td>
            <td>Number</td>
            <td>0 (ms/毫秒)</td>
            <td>动画延迟执行</td>
        </tr>
        <tr>
            <td>count</td>
            <td>Number</td>
            <td>0</td>
            <td>播放循环次数</td>
        </tr>
        <tr>
            <td>reanim</td>
            <td>Boolean</td>
            <td>false</td>
            <td>循环时是否反向播放动画</td>
        </tr>
        <tr>
            <td>ease</td>
            <td>String</td>
            <td>"ease"</td>
            <td><a href="#ca-ease-list">贝赛尔曲线</a> 或 自定义: "cubic-bezier()"</td>
        </tr>
        <tr>
            <td>hide</td>
            <td>Boolean</td>
            <td>false</td>
            <td>动画完成后是否隐藏对象(display:none)</td>
        </tr>
</table>

<h2>ops:JSON - transform属性</h2>
    <table>
        <tr>
            <th style="width:20%;" >名称</th>
            <th style="width:20%;">类型</th>
            <th style="width:8%;">单位</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>translate: [x,y]</td>
            <td>Array</td>
            <td>px</td>
            <td>以 X,Y 轴移动</td>
        </tr>
        <tr>
            <td>translate3d: [x,y,z]</td>
            <td>Array</td>
            <td>px</td>
            <td>以 X,Y,Z 轴移动</td>
        </tr>
        <tr>
            <td>translateX , x</td>
            <td>Number,String,Array</td>
            <td>px</td>
            <td>以 X 轴移动</td>
        </tr>
        <tr>
            <td>translateY , y</td>
            <td>Number,String,Array</td>
            <td>px</td>
            <td>以 Y 轴移动</td>
        </tr>
        <tr>
            <td>translateZ , z</td>
            <td>Number,String,Array</td>
            <td>px</td>
            <td>以 Z 轴移动</td>
        </tr>
        <tr>
            <td>scale: [x,y]</td>
            <td>Number,String,Array</td>
            <td></td>
            <td>以 2D 缩放 (当参数只有一个值时则 x = y)</td>
        </tr>
        <tr>
            <td>scale3d: [x,y,z]</td>
            <td>Array</td>
            <td></td>
            <td>以 3D 缩放</td>
        </tr>
        <tr>
            <td>scaleX</td>
            <td>Number,String</td>
            <td></td>
            <td>以 X 轴缩放</td>
        </tr>
        <tr>
            <td>scaleY</td>
            <td>Number,String</td>
            <td></td>
            <td>以 Y 轴缩放</td>
        </tr>
        <tr>
            <td>scaleZ</td>
            <td>Number,String</td>
            <td></td>
            <td>以 Z 轴缩放</td>
        </tr>
        <tr>
            <td>rotate</td>
            <td>Number,String</td>
            <td>deg</td>
            <td>以 2D 旋转</td>
        </tr>
        <tr>
            <td>rotate3d: [x,y,z,deg]</td>
            <td>Array</td>
            <td>deg</td>
            <td>以 3D 旋转 <br><span class="am-text-danger">IE中rotate3d(0,1,0,90°>deg<270°)旋转错误,请使用rotateY属性</span></td>
        </tr>
        <tr>
            <td>rotateX</td>
            <td>Number,String</td>
            <td>deg</td>
            <td>以 X 轴的3D旋转 ( 同rotate3d(1,0,0,deg) )</td>
        </tr>
        <tr>
            <td>rotateY</td>
            <td>Number,String</td>
            <td>deg</td>
            <td>以 Y 轴的3D旋转 ( 同rotate3d(0,1,0,deg) )</td>
        </tr>
        <tr>
            <td>rotateZ</td>
            <td>Number,String</td>
            <td>deg</td>
            <td>以Z轴的3D旋转 ( 同rotate3d(0,0,1,deg) )</td>
        </tr>
        <tr>
            <td>skew: [x,y]</td>
            <td>Number,String,Array</td>
            <td>deg</td>
            <td>以 X,Y 轴的 2D 倾斜转换 ( 当参数只有一个值时则 x = y )</td>
        </tr>
        <tr>
            <td>skewX</td>
            <td>Number,String</td>
            <td>deg</td>
            <td>以 X 轴的 2D 倾斜转换。</td>
        </tr>
        <tr>
            <td>skewY</td>
            <td>Number,String</td>
            <td>deg</td>
            <td>以 Y 轴的 2D 倾斜转换。</td>
        </tr>
        <tr>
            <td>perspective</td>
            <td>Number,String</td>
            <td>px</td>
            <td>以 3D 转换元素定义透视视图。</td>
        </tr>
</table>

<h2>ops:JSON - 其他属性</h2>
<div style="padding: 2rem 2rem">
        <label>所有符合CSS:"transition"标准的属性</label>
        <br>
        <label>例如:</label>
        <div style="padding-left: 2rem">
            <ul>
                <li>width/height</li>
                <li>top/left/right</li>
                <li>padding/margin</li>
                <li>opacity/background</li>
                <li>more css ...</li>
            </ul>
        </div>
</div>

<h2>预设动画</h2>
<table>
            <tr>
                <th>方法</th>
                <th>描述</th>
            </tr>
            <tr>
                <td>$.caSlide(show:Boolean, time:Number, callback);</td>
                <td>折叠动画,自动切换折叠与展开,参数:show true强制显示;false:强制关闭</td>
            </tr>
            <tr>
                <td>$.caFlip(show:Boolean, time:Number, callback);</td>
                <td>X轴翻转动画,参数:show true强制显示;false:强制关闭</td>
            </tr>
            <tr>
                <td>$.caTurn(show:Boolean, time:Number, callback);</td>
                <td>Y轴翻转动画,参数:show true强制显示;false:强制关闭</td>
            </tr>
</table>

<h2>预设 - 贝赛尔曲线</h2>
<pre>
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
</pre>

<h4>技术交流 QQ:312678057</h4>
