/* jQuery Cookie Plugin v1.3 */
(function($,j,k){var m=/\+/g;function raw(s){return s}function decoded(s){return decodeURIComponent(s.replace(m,' '))}var n=$.cookie=function(a,b,c){if(b!==k){c=$.extend({},n.defaults,c);if(b===null){c.expires=-1}if(typeof c.expires==='number'){var d=c.expires,t=c.expires=new Date();t.setDate(t.getDate()+d)}b=n.json?JSON.stringify(b):String(b);return(j.cookie=[encodeURIComponent(a),'=',n.raw?b:encodeURIComponent(b),c.expires?'; expires='+c.expires.toUTCString():'',c.path?'; path='+c.path:'',c.domain?'; domain='+c.domain:'',c.secure?'; secure':''].join(''))}var e=n.raw?raw:decoded;var f=j.cookie.split('; ');for(var i=0,l=f.length;i<l;i++){var g=f[i].split('=');if(e(g.shift())===a){var h=e(g.join('='));return n.json?JSON.parse(h):h}}return null};n.defaults={};$.removeCookie=function(a,b){if($.cookie(a)!==null){$.cookie(a,null,b);return true}return false}})(jQuery,document);

/* JavaScript Date Extension v1.0 */
Date.initWithJSON=function(a){var b=a.replace(RegExp('"|\'','g'),'');b=b.replace(/\\?\/Date\((-?\d+)\)\\?\//,'$1');return new Date(parseInt(b))};Date.Format={masks:{defaultValue:"ddd MMM dd yyyy HH:mm:ss",shortDate:"m/d/yy",mediumDate:"MMM d, yyyy",longDate:"MMMM d, yyyy",fullDate:"dddd, MMMM d, yyyy",shortTime:"h:mm TT",mediumTime:"h:mm:ss TT",longTime:"h:mm:ss TT Z",isoDate:"yyyy-MM-dd",isoTime:"HH:mm:ss",isoDateTime:"yyyy-MM-dd'T'HH:mm:ss",isoUtcDateTime:"UTC:yyyy-MM-dd'T'HH:mm:ss'Z'"},i18n:{dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]}};Date.prototype.toFormat=function(g,h){var i=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,timezoneClip=/[^-+\dA-Z]/g,pad=function(a,b){a=String(a);b=b||2;while(a.length<b)a="0"+a;return a};function DateFormat(b,c,e){var f=Date.Format;if(arguments.length==1&&Object.prototype.toString.call(b)=="[object String]"&&!/\d/.test(b)){c=b;b=undefined}b=b?new Date(b):new Date;if(isNaN(b))throw SyntaxError("invalid date");c=String(f.masks[c]||c||f.masks["defaultValue"]);if(c.slice(0,4)=="UTC:"){c=c.slice(4);e=true}var _=e?"getUTC":"get",d=b[_+"Date"](),D=b[_+"Day"](),M=b[_+"Month"](),y=b[_+"FullYear"](),H=b[_+"Hours"](),m=b[_+"Minutes"](),s=b[_+"Seconds"](),L=b[_+"Milliseconds"](),o=e?0:b.getTimezoneOffset(),flags={d:d,dd:pad(d),ddd:f.i18n.dayNames[D],dddd:f.i18n.dayNames[D+7],M:M+1,MM:pad(M+1),MMM:f.i18n.monthNames[M],MMMM:f.i18n.monthNames[M+12],yy:String(y).slice(2),yyyy:y,h:H%12||12,hh:pad(H%12||12),H:H,HH:pad(H),m:m,mm:pad(m),s:s,ss:pad(s),l:pad(L,3),L:pad(L>99?Math.round(L/10):L),t:H<12?"a":"p",tt:H<12?"am":"pm",T:H<12?"A":"P",TT:H<12?"AM":"PM",Z:e?"UTC":(String(b).match(i)||[""]).pop().replace(timezoneClip,""),o:(o>0?"-":"+")+pad(Math.floor(Math.abs(o)/60)*100+Math.abs(o)%60,4),S:["th","st","nd","rd"][d%10>3?0:(d%100-d%10!=10)*d%10]};return c.replace(RegExp(/d{1,4}|M{1,4}|yy(?:yy)?|([HhmsTt])\1?|[LloSZ]|"[^"]*"|\'[^\']*'/g),function(a){return a in flags?flags[a]:a.slice(1,a.length-1)})}return DateFormat(this,g,h)};

/* easing */
jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d)},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b}});

/* message */
if(!window.dhtmlx)window.dhtmlx={};(function(){var k=null;function callback(a,b){var c=a.callback;modality(false);a.box.parentNode.removeChild(a.box);k=a.box=null;if(c)c(b)}function modal_key(e){if(k){e=e||event;var a=e.which||event.keyCode;if(dhtmlx.message.keyboard){if(a==13||a==32)callback(k,true);if(a==27)callback(k,false)}if(e.preventDefault)e.preventDefault();return!(e.cancelBubble=true)}}if(document.attachEvent)document.attachEvent("onkeydown",modal_key);else document.addEventListener("keydown",modal_key,true);function modality(a){if(!modality.cover){modality.cover=document.createElement("DIV");modality.cover.onkeydown=modal_key;modality.cover.className="dhx_modal_cover";document.body.appendChild(modality.cover)}var b=document.body.scrollHeight;modality.cover.style.display=a?"inline-block":"none"}function button(a,b){return"<div class='dhtmlx_popup_button' result='"+b+"' ><div>"+a+"</div></div>"}function info(a){if(!t.area){t.area=document.createElement("DIV");t.area.className="dhtmlx_message_area";t.area.style[t.position]="5px";document.body.appendChild(t.area)}t.hide(a.id);var b=document.createElement("DIV");b.innerHTML="<div>"+a.text+"</div>";b.className="dhtmlx-info dhtmlx-"+a.type;b.onclick=function(){t.hide(a.id);a=null};if(t.position=="bottom"&&t.area.firstChild)t.area.insertBefore(b,t.area.firstChild);else t.area.appendChild(b);if(a.expire>0)t.timers[a.id]=window.setTimeout(function(){t.hide(a.id)},a.expire);t.pull[a.id]=b;b=null;return a.id}function _boxStructure(c,d,f){var g=document.createElement("DIV");g.className=" dhtmlx_modal_box dhtmlx-"+c.type;g.setAttribute("dhxbox",1);var h='';if(c.width)g.style.width=c.width;if(c.height)g.style.height=c.height;if(c.title)h+='<div class="dhtmlx_popup_title">'+c.title+'</div>';h+='<div class="dhtmlx_popup_text"><span>'+(c.content?'':c.text)+'</span></div><div  class="dhtmlx_popup_controls">';if(d)h+=button(c.ok||"OK",true);if(f)h+=button(c.cancel||"Cancel",false);if(c.buttons){for(var i=0;i<c.buttons.length;i++)h+=button(c.buttons[i],i)}h+='</div>';g.innerHTML=h;if(c.content){var j=c.content;if(typeof j=="string")j=document.getElementById(j);if(j.style.display=='none')j.style.display="";g.childNodes[c.title?1:0].appendChild(j)}g.onclick=function(e){e=e||event;var a=e.target||e.srcElement;if(!a.className)a=a.parentNode;if(a.className=="dhtmlx_popup_button"){var b=a.getAttribute("result");b=(b=="true")||(b=="false"?false:b);callback(c,b)}};c.box=g;if(d||f)k=c;return g}function _createBox(a,b,c){var d=a.tagName?a:_boxStructure(a,b,c);if(!a.hidden)modality(true);document.body.appendChild(d);var x=a.left||Math.abs(Math.floor(((window.innerWidth||document.documentElement.offsetWidth)-d.offsetWidth)/2));var y=a.top||Math.abs(Math.floor(((window.innerHeight||document.documentElement.offsetHeight)-d.offsetHeight)/2));if(a.position=="top")d.style.top="-3px";else d.style.top=y+'px';d.style.left=x+'px';d.onkeydown=modal_key;d.focus();if(a.hidden)dhtmlx.modalbox.hide(d);return d}function alertPopup(a){return _createBox(a,true,false)}function confirmPopup(a){return _createBox(a,true,true)}function boxPopup(a){return _createBox(a)}function box_params(a,b,c){if(typeof a!="object"){if(typeof b=="function"){c=b;b=""}a={text:a,type:b,callback:c}}return a}function params(a,b,c,d){if(typeof a!="object")a={text:a,type:b,expire:c,id:d};a.id=a.id||t.uid();a.expire=a.expire||t.expire;return a}dhtmlx.alert=function(){var a=box_params.apply(this,arguments);a.type=a.type||"confirm";return alertPopup(a)};dhtmlx.confirm=function(){var a=box_params.apply(this,arguments);a.type=a.type||"alert";return confirmPopup(a)};dhtmlx.modalbox=function(){var a=box_params.apply(this,arguments);a.type=a.type||"alert";return boxPopup(a)};dhtmlx.modalbox.hide=function(a){while(a&&a.getAttribute&&!a.getAttribute("dhxbox"))a=a.parentNode;if(a){a.parentNode.removeChild(a);modality(false)}};var t=dhtmlx.message=function(a,b,c,d){a=params.apply(this,arguments);a.type=a.type||"info";var e=a.type.split("-")[0];switch(e){case"alert":return alertPopup(a);case"confirm":return confirmPopup(a);case"modalbox":return boxPopup(a);default:return info(a);break}};t.seed=(new Date()).valueOf();t.uid=function(){return t.seed++};t.expire=4000;t.keyboard=true;t.position="top";t.pull={};t.timers={};t.hideAll=function(){for(var a in t.pull)t.hide(a)};t.hide=function(a){var b=t.pull[a];if(b&&b.parentNode){window.setTimeout(function(){b.parentNode.removeChild(b);b=null},2000);b.className+=" hidden";if(t.timers[a])window.clearTimeout(t.timers[a]);delete t.pull[a]}}})();

/* fgnass.github.com/spin.js#v1.2.8 */
!function(t,e,i){var o=["webkit","Moz","ms","O"],r={},n;function a(t,i){var o=e.createElement(t||"div"),r;for(r in i)o[r]=i[r];return o}function s(t){for(var e=1,i=arguments.length;e<i;e++)t.appendChild(arguments[e]);return t}var f=function(){var t=a("style",{type:"text/css"});s(e.getElementsByTagName("head")[0],t);return t.sheet||t.styleSheet}();function l(t,e,i,o){var a=["opacity",e,~~(t*100),i,o].join("-"),s=.01+i/o*100,l=Math.max(1-(1-t)/e*(100-s),t),p=n.substring(0,n.indexOf("Animation")).toLowerCase(),u=p&&"-"+p+"-"||"";if(!r[a]){f.insertRule("@"+u+"keyframes "+a+"{"+"0%{opacity:"+l+"}"+s+"%{opacity:"+t+"}"+(s+.01)+"%{opacity:1}"+(s+e)%100+"%{opacity:"+t+"}"+"100%{opacity:"+l+"}"+"}",f.cssRules.length);r[a]=1}return a}function p(t,e){var r=t.style,n,a;if(r[e]!==i)return e;e=e.charAt(0).toUpperCase()+e.slice(1);for(a=0;a<o.length;a++){n=o[a]+e;if(r[n]!==i)return n}}function u(t,e){for(var i in e)t.style[p(t,i)||i]=e[i];return t}function c(t){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var r in o)if(t[r]===i)t[r]=o[r]}return t}function d(t){var e={x:t.offsetLeft,y:t.offsetTop};while(t=t.offsetParent)e.x+=t.offsetLeft,e.y+=t.offsetTop;return e}var h={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",speed:1,trail:100,opacity:1/4,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"};function m(t){if(!this.spin)return new m(t);this.opts=c(t||{},m.defaults,h)}m.defaults={};c(m.prototype,{spin:function(t){this.stop();var e=this,i=e.opts,o=e.el=u(a(0,{className:i.className}),{position:i.position,width:0,zIndex:i.zIndex}),r=i.radius+i.length+i.width,s,f;if(t){t.insertBefore(o,t.firstChild||null);f=d(t);s=d(o);u(o,{left:(i.left=="auto"?f.x-s.x+(t.offsetWidth>>1):parseInt(i.left,10)+r)+"px",top:(i.top=="auto"?f.y-s.y+(t.offsetHeight>>1):parseInt(i.top,10)+r)+"px"})}o.setAttribute("aria-role","progressbar");e.lines(o,e.opts);if(!n){var l=0,p=i.fps,c=p/i.speed,h=(1-i.opacity)/(c*i.trail/100),m=c/i.lines;(function y(){l++;for(var t=i.lines;t;t--){var r=Math.max(1-(l+t*m)%c*h,i.opacity);e.opacity(o,i.lines-t,r,i)}e.timeout=e.el&&setTimeout(y,~~(1e3/p))})()}return e},stop:function(){var t=this.el;if(t){clearTimeout(this.timeout);if(t.parentNode)t.parentNode.removeChild(t);this.el=i}return this},lines:function(t,e){var i=0,o;function r(t,o){return u(a(),{position:"absolute",width:e.length+e.width+"px",height:e.width+"px",background:t,boxShadow:o,transformOrigin:"left",transform:"rotate("+~~(360/e.lines*i+e.rotate)+"deg) translate("+e.radius+"px"+",0)",borderRadius:(e.corners*e.width>>1)+"px"})}for(;i<e.lines;i++){o=u(a(),{position:"absolute",top:1+~(e.width/2)+"px",transform:e.hwaccel?"translate3d(0,0,0)":"",opacity:e.opacity,animation:n&&l(e.opacity,e.trail,i,e.lines)+" "+1/e.speed+"s linear infinite"});if(e.shadow)s(o,u(r("#000","0 0 4px "+"#000"),{top:2+"px"}));s(t,s(o,r(e.color,"0 0 1px rgba(0,0,0,.1)")))}return t},opacity:function(t,e,i){if(e<t.childNodes.length)t.childNodes[e].style.opacity=i}});(function(){function t(t,e){return a("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',e)}var e=u(a("group"),{behavior:"url(#default#VML)"});if(!p(e,"transform")&&e.adj){f.addRule(".spin-vml","behavior:url(#default#VML)");m.prototype.lines=function(e,i){var o=i.length+i.width,r=2*o;function n(){return u(t("group",{coordsize:r+" "+r,coordorigin:-o+" "+-o}),{width:r,height:r})}var a=-(i.width+i.length)*2+"px",f=u(n(),{position:"absolute",top:a,left:a}),l;function p(e,r,a){s(f,s(u(n(),{rotation:360/i.lines*e+"deg",left:~~r}),s(u(t("roundrect",{arcsize:i.corners}),{width:o,height:i.width,left:i.radius,top:-i.width>>1,filter:a}),t("fill",{color:i.color,opacity:i.opacity}),t("stroke",{opacity:0}))))}if(i.shadow)for(l=1;l<=i.lines;l++)p(l,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(l=1;l<=i.lines;l++)p(l);return s(e,f)};m.prototype.opacity=function(t,e,i,o){var r=t.firstChild;o=o.shadow&&o.lines||0;if(r&&e+o<r.childNodes.length){r=r.childNodes[e+o];r=r&&r.firstChild;r=r&&r.firstChild;if(r)r.opacity=i}}}else n=p(e,"animation")})();if(typeof define=="function"&&define.amd)define(function(){return m});else t.Spinner=m}(window,document);

/* notification */
var KNotification = KNotification || {
    width: 250,
    height: 75,
    prefix: 'n_',
    increment_id: 0,
    queue: [],
    hide: function (nid) {
        for (var index = 0; index < KNotification.queue.length; index ++) {
            var item = KNotification.queue.shift();
            if (item == nid) { break; }
            else { KNotification.queue.push(item); }
        }
        var remove_top = parseInt($('#' + nid).css('top'));
        $('#' + nid).animate({ right: -KNotification.width }, 400, 'easeInExpo', function () {
            $(KNotification.queue).each(function (index) {
                var top = parseInt($('#' + KNotification.queue[index]).css('top'));
                if (top > remove_top) {
                    top = $('#' + KNotification.queue[index]).attr('top') == undefined ? top - KNotification.height : parseInt($('#' + KNotification.queue[index]).attr('top')) - KNotification.height;
                    $('#' + KNotification.queue[index]).attr('top', top);
                    $('#' + KNotification.queue[index]).dequeue();
                    $('#' + KNotification.queue[index]).animate({ top: top }, 400, 'easeOutExpo');
                }
            });
            $(this).remove();
        });
    },
    pop: function (arg) {
        var arg = arg || {};
        arg.expire = arg.expire || 5000;
        arg.title = arg.title || '';
        arg.message = arg.message || '';
        var nid = KNotification.prefix + ++KNotification.increment_id;
        var box = $('<div id="' + nid + '" class="knotification"><div class="ntitle">' + arg.title + '</div><div class="nmessage">' + arg.message + '</div></div>');
        var top = KNotification.queue.length * KNotification.height;
        KNotification.queue.push(nid);
        $('body').append(box);
        $('#' + nid).css('right', -KNotification.width);
        $('#' + nid).css('top', top);

        // insert notification
        $('#' + nid).animate({ right: 0 }, 400, 'easeOutExpo', function () {
            if (arg.expire >= 0) {
                setTimeout(function () {
                    // remove notification
                    KNotification.hide(nid);
                }, arg.expire);
            }
        });

        return nid;
    }
};


/* core */
var noop = function () { };
var takanashi = takanashi || {
    text_loading: 'Loading...',
    is_ie: false,
    get_url_vars: function (key) {
        var result;
        var parts = location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,skey,value) {
            if (key == skey) {
                result = value;
                return;
            }
        });
        return result;
    },
    // みこ ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    pop_state: function (state) {
        if (state) {
            $('.modal.in').modal('hide');
            takanashi.nav_select(state.nav_select_index);
            takanashi.miko(state, false);
        }
    },
    miko: function(state, push) {
        $.ajax({ url: state.href,
            type: 'get',
            data: state.data,
            cache: false,
            beforeSend: function (xhr) { xhr.setRequestHeader('X-Miko', 'miko'); takanashi.loading_on(takanashi.text_loading); },
            error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
            success: function (result) {
                takanashi.loading_off();
                if (push) {
                    var index = state.href == '/' ? 1 : $('#nav_bar li a[href*="' + state.href + '"]').parent().index();
                    takanashi.nav_select(index);

                    if (state.href != location.pathname || location.href.indexOf('?') >= 0) {
                        state.nav_select_index = $('#nav_bar li.select').index();
                        history.pushState(state, document.title, state.href);
                    }
                    $('html,body').animate({scrollTop: (0)}, 500, 'easeOutExpo');
                }
                else {
                    takanashi.nav_select(state.nav_select_index);
                }

                var miko = result.match(/<!miko>/);
                if (!miko) {
                    // the result is not miko content
                    location.reload();
                    return;
                }

                var title = result.match(/<title>(.*)<\/title>/);
                result = result.replace(title[0], '');
                document.title = title[1];
                var content = result.match(/\s@([#.]?\w+)/);
                if (content) {
                    $(content[1]).html(result.replace(content[0], ''));
                }
                takanashi.setup_datetime();
                takanashi.setup_focus();
                takanashi.setup_tooltip();
            }
        });
    },
    setup_link: function() {
        // link
        $(document).on('click', 'a:not([href*="#"])', function (e) {
            // menu
            if ($(this).parent().hasClass('active')) { return false; }

            // open in a new tab
            if (e.metaKey) { return; }

            var href = $(this).attr('href');
            if (href && !$(this).attr('target')) {
                takanashi.miko({ href: href }, true);
                return false;
            }
        });
        // from get
        $(document).on('submit', 'form[method=get]:not([action*="#"])', function () {
            var href = $(this).attr('action') + '?' + $(this).serialize();
            takanashi.miko({ href: href }, true);
            return false;
        });
        // from post
        $(document).on('submit', 'form[method=post]:not([action*="#"])', function () {
            if (takanashi.validation($(this))) {
                var href = $(this).attr('action');
                takanashi.miko({ href: href, data: $(this).serialize() }, false);
            }
            return false;
        });
    },

    error_message: function () {
        KNotification.pop({ title: 'Failed', message: 'Loading failed, please try again later.' });
    },

    // validation ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    validation: function ($form) {
        var success = true;
        $form.find('input').each(function () {
            var validation = $(this).attr('validation');
            if (validation && validation.length > 0) {
                if ($(this).val().match(validation)) {
                    $(this).closest('.control-group').removeClass('error');
                    $(this).parent().find('.error_msg').remove();
                }
                else {
                    $(this).closest('.control-group').addClass('error');
                    $(this).parent().find('.error_msg').remove();
                    if ($(this).attr('msg')) {
                        $(this).parent().append($('<label for="' + $(this).attr('id') + '" class="error_msg help-inline">' + $(this).attr('msg') + '</label>'));
                    }
                    success = false;
                }
            }
        });

        return success;
    },

    // datetime ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    setup_datetime: function () {
        $('.datetime').each(function () {
            var date = new Date($(this).attr('datetime'));
            $(this).html(date.toFormat($(this).attr('format')));
        });
    },

    // focus ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    setup_focus: function () {
        $('.focus').select();
    },

    // tool tip ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    setup_tooltip: function () {
        $("[rel='tooltip']").tooltip();
    },

    // loading ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    loading_on: function (message) {
        if (takanashi.is_ie) { return; }
        if ($('#loading').length > 0) {
            $('#loading .message').html(message);
            return;
        }
        var loading = $('<div id="loading"><div class="spin"></div><div class="message">' + message + '</div><div class="clear"></div></div>');
        $('body').append(loading);
        var loading_height = $('#loading').height();
        $('#loading').css('bottom', -loading_height);
        $('#loading').animate({ bottom: '+=' + (loading_height + 10) }, 400, 'easeOutExpo');
        Spinner({ color: '#444', width: 2, length: 4, radius: 4 }).spin($('#loading .spin')[0]);
    },
    loading_off: function () {
        if (takanashi.is_ie) { return; }
        $('#loading').dequeue();
        var loading_height = $('#loading').height() + 10;
        $('#loading').animate({ bottom: '-=' + loading_height }, 400, 'easeInExpo', function () {
            $('#loading').remove();
        });
    },

    // nav ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    nav_select: function (index) {
        if (index > 0 && !$($('#nav_bar li')[index]).hasClass('select')) {
            $('#nav_bar li').removeClass('select');
            $($('#nav_bar li')[index]).addClass('select');
            $($('#nav_bar li')[index]).mouseover();
        }
    },
    setup_nav: function () {
        var match = location.href.match(/\w(\/\w*)/);
        if (match) {
            var index = match[1] == '/' ? 0 : $('#nav_bar li a[href*="' + match[1] + '"]').parent().index();
            $('#nav_bar li').removeClass('select');
            $($('#nav_bar li')[index]).addClass('select');
        }

        $('#nav_bar li.select').parent().prepend($('<li class="top"></li>'));
        $('#nav_bar li.top').css('width', $('#nav_bar li.select').css('width'));
        $('#nav_bar li.top').css('left', $('#nav_bar li.select').position().left);
        $('#nav_bar li.top').css('top', $('#nav_bar li.select').position().top);

        $('#nav_bar li[class!=top]').hover(function () {
            $('#nav_bar li.top').each(function () {
                $(this).dequeue();
            }).animate({
                    width: this.offsetWidth,
                    left: this.offsetLeft
                }, 420, "easeInOutCubic");
        }, noop);
        $('#nav_bar').hover(noop, function () {
            $('#nav_bar li.top').each(function () {
                $(this).dequeue();
            }).animate({
                    width: $('#nav_bar li.select').css('width'),
                    left: $('#nav_bar li.select').position().left
                }, 420, "easeInOutCubic");
        });
    },

    // nav custom ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    change_nav: function(app_id) {
        $('#nav_bar a[href^="/exception_groups"]').attr('href', '/exception_groups/' + app_id);
        $('#nav_bar a[href^="/log_groups"]').attr('href', '/log_groups/' + app_id);
    },

    // events of views ←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙←↖↑↗→↘↓↙
    register_event_account: {
        update_profile: function () {
            // update profile
            //  url = $(this).attr('action')
            //  data = $(this).serialize()
            $(document).on('submit', 'form#form_profile', function () {
                if (!takanashi.validation($(this))) { return false; }

                $.ajax({ type: 'put', url: $(this).attr('action'), dataType: 'json', cache: false,
                    data: $(this).serialize(),
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            KNotification.pop({ 'title': 'Success!', 'message': 'Data had be Saved.' });
                            $('#name').val(result.name);
                            $($('.profile p')[0]).text(result.name);
                        }
                        else {
                            KNotification.pop({ 'title': 'Failed!', 'message': 'Please check again.' });
                        }
                    }
                });

                return false;
            });
        }
    },
    register_event_application: {
        invite_user: function () {
            // invite a user with the application
            //  url = $(this).attr('href')
            //  email = $(this).closest('.input-append').find('input[type=text]')
            $(document).on('click', 'a.invite', function () {
                if (!takanashi.validation($(this).closest('.input-append'))) { return false; }

                var $application_form = $(this).closest('form');
                var $invite_email = $(this).closest('.input-append').find('input[type=text]');

                $.ajax({ type: 'post', url: $(this).attr('href'), dataType: 'json', cache: false,
                    data: { email: $invite_email.val() },
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            $($application_form).modal('hide');
                            KNotification.pop({ 'title': 'Success!', 'message': $invite_email.val() + ' will get a invited email.' });
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            $invite_email.closest('.control-group').addClass('error');
                        }
                    }
                });

                return false;
            });
            $(document).on('keypress', 'input.invite', function (e) {
                if (e.keyCode == 13) {
                    $('a.invite').click();
                    return false;
                }
            });
        },
        delete_viewer: function () {
            // delete a viewer in an application
            //  url = $(this).attr('href')
            $(document).on('click', 'a.delete_viewer', function () {
                var $member_div = $(this).closest('div');

                $.ajax({ type: 'delete', url: $(this).attr('href'), dataType: 'json', cache: false,
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            $member_div.remove();
                        }
                    }
                });

                return false;
            });
        },
        show_modal_for_add_application: function () {
            // show adding application modal
            $(document).on('keypress', 'input.appended_input_application', function (e) {
                if (e.keyCode == 13) {
                    $(this).parent().find('a').click();
                    return false;
                }
            });
            $(document).on('click', 'a[href="#form_add_application"]', function () {
                $('#name').val($('.appended_input_application').val());
                setTimeout("$('#name').focus();", 500);
            });
        },
        add_application: function () {
            // add an application
            //  url = $(this).attr('action')
            //  data = $(this).serialize()
            $(document).on('submit', 'form#form_add_application', function () {
                if (!takanashi.validation($(this))) { return false; }

                $.ajax({ type: 'post', url: $(this).attr('action'), dataType: 'json', cache: false,
                    data: $(this).serialize(),
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            KNotification.pop({ title: 'Failed!', message: 'Please check again.' });
                        }
                    }
                });
                $($(this).closest('.modal')).modal('hide');

                return false;
            });
        },
        update_application: function () {
            // update the application
            //  url = $(this).attr('action')
            //  data = $(this).serialize()
            $(document).on('submit', 'form.form_application', function () {
                if (!takanashi.validation($(this).find('.modal-body'))) { return false; }

                $.ajax({ type: 'put', url: $(this).attr('action'), dataType: 'json', cache: false,
                    data: $(this).serialize(),
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            KNotification.pop({ 'title': 'Failed!', 'message': 'Please check again.' });
                        }
                    }
                });
                $($(this).closest('.modal')).modal('hide');

                return false;
            });
        },
        delete_application: function () {
            // delete the application
            //  url = $(this).attr('href')
            //  application_id = $(this).attr('application_id')
            //  application_name = $(this).attr('application_name')
            $(document).on('click', 'a.delete_application', function () {
                $.ajax({ type: 'delete', url: $(this).attr('href'), dataType: 'json', cache: false,
                    data: { id: $(this).attr('document_id') },
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            KNotification.pop({ title: 'Failed!', message: 'Please check again.' });
                        }
                    }
                });
                $($(this).closest('.modal')).modal('hide');

                return false;
            });
        }
    },
    register_event_user: {
        add_user: function () {
            // add a new user to Takanashi
            //  url = $(this).attr('action')
            //  data = $(this).serialize()
            $(document).on('submit', 'form#form_add_user', function () {
                if (!takanashi.validation($(this))) { return false; }

                $.ajax({ type: 'post', url: $(this).attr('action'), dataType: 'json', cache: false,
                    data: $(this).serialize(),
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            KNotification.pop({ title: 'Failed!', message: 'Please check again.' });
                        }
                    }
                });

                return false;
            });
        },
        delete_user: function () {
            // delete the user
            //  url = $(this).attr('href')
            $(document).on('click', 'a.delete_user', function () {
                if (!takanashi.validation($(this))) { return false; }

                $.ajax({ type: 'delete', url: $(this).attr('href'), dataType: 'json', cache: false,
                    beforeSend: function () { takanashi.loading_on(takanashi.text_loading); },
                    error: function (xhr) { takanashi.loading_off(); takanashi.error_message(); },
                    success: function (result) {
                        takanashi.loading_off();
                        if (result.success) {
                            takanashi.miko({ href: location.href }, false);
                        }
                        else {
                            KNotification.pop({ title: 'Failed!', message: 'Please check again.' });
                        }
                    }
                });

                return false;
            });
        }
    },
    register_event_document: {
        click_document_group: function () {
            // click document group then go to documents view
            //  url = $(this).attr('href')
            $(document).on('click', 'tr.document_group', function () {
                takanashi.miko({ 'href': $(this).attr('href') }, true);
                return false;
            });
        }
    },
    setup_events: function () {
        // all setup event object should be a member in takanashi{}, and name 'register_event_xxxx'
        // all functions in setup event objects will be execute on document.ready()
        for (var member in takanashi) {
            if (member.indexOf('register_event_') == 0) {
                for (var fn in takanashi[member]) {
                    if (typeof takanashi[member][fn] == "function") {
                        // execute
                        takanashi[member][fn]();
                    }
                }
            }
        }
    }
};
takanashi.is_ie = navigator.userAgent.toLowerCase().indexOf('msie') != -1;

$(document).ready(function () {
    takanashi.setup_nav();
    takanashi.setup_link();

    // set up events of views
    takanashi.setup_events();

    // that will be execute after miko call
    // set up datetime display
    takanashi.setup_datetime();
    takanashi.setup_focus();
    takanashi.setup_tooltip();
});