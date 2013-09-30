/**
 * State-based routing for AngularJS
 * @version v0.2.0
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(r,t,e){"use strict";function n(r,t){return P(new(P(function(){},{prototype:r})),t)}function a(r){return y(arguments,function(t){t!==r&&y(t,function(t,e){r.hasOwnProperty(e)||(r[e]=t)})}),r}function o(r,t){var e=[];for(var n in r.path)if(""!==r.path[n]){if(!t.path[n])break;e.push(r.path[n])}return e}function i(r,t,e,n){var a,i=o(e,n),u={},s=[];for(var l in i)if(i[l].params&&i[l].params.length){a=i[l].params;for(var c in a)s.indexOf(a[c])>=0||(s.push(a[c]),u[a[c]]=r[a[c]])}return P({},u,t)}function u(r,t){var n=1,o=2,i={},u=[],s=i,l=P(r.when(i),{$$promises:i,$$values:i});this.study=function(i){function c(r,e){if(v[e]!==o){if(p.push(e),v[e]===n)throw p.splice(0,p.indexOf(e)),Error("Cyclic dependency: "+p.join(" -> "));if(v[e]=n,b(r))h.push(e,[function(){return t.get(e)}],u);else{var a=t.annotate(r);y(a,function(r){r!==e&&i.hasOwnProperty(r)&&c(i[r],r)}),h.push(e,r,a)}p.pop(),v[e]=o}}function f(r){return E(r)&&r.then&&r.$$promises}if(!E(i))throw Error("'invocables' must be an object");var h=[],p=[],v={};return y(i,c),i=p=v=null,function(n,o,i){function u(){--w||(b||a(d,o.$$values),$.$$values=d,$.$$promises=!0,v.resolve(d))}function c(r){$.$$failure=r,v.reject(r)}function p(e,a,o){function s(r){f.reject(r),c(r)}function l(){if(!g($.$$failure))try{f.resolve(t.invoke(a,i,d)),f.promise.then(function(r){d[e]=r,u()},s)}catch(r){s(r)}}var f=r.defer(),h=0;o.forEach(function(r){m.hasOwnProperty(r)&&!n.hasOwnProperty(r)&&(h++,m[r].then(function(t){d[r]=t,--h||l()},s))}),h||l(),m[e]=f.promise}if(f(n)&&i===e&&(i=o,o=n,n=null),n){if(!E(n))throw Error("'locals' must be an object")}else n=s;if(o){if(!f(o))throw Error("'parent' must be a promise returned by $resolve.resolve()")}else o=l;var v=r.defer(),$=v.promise,m=$.$$promises={},d=P({},n),w=1+h.length/3,b=!1;if(g(o.$$failure))return c(o.$$failure),$;o.$$values?(b=a(d,o.$$values),u()):(P(m,o.$$promises),o.then(u,c));for(var x=0,y=h.length;y>x;x+=3)n.hasOwnProperty(h[x])?u():p(h[x],h[x+1],h[x+2]);return $}},this.resolve=function(r,t,e,n){return this.study(r)(t,e,n)}}function s(r,t,e){this.fromConfig=function(r,t,e){return g(r.template)?this.fromString(r.template,t):g(r.templateUrl)?this.fromUrl(r.templateUrl,t):g(r.templateProvider)?this.fromProvider(r.templateProvider,t,e):null},this.fromString=function(r,t){return w(r)?r(t):r},this.fromUrl=function(e,n){return w(e)&&(e=e(n)),null==e?null:r.get(e,{cache:t}).then(function(r){return r.data})},this.fromProvider=function(r,t,n){return e.invoke(r,null,n||{params:t})}}function l(r){function t(t){if(!/^\w+(-+\w+)*$/.test(t))throw Error("Invalid parameter name '"+t+"' in pattern '"+r+"'");if(o[t])throw Error("Duplicate parameter name '"+t+"' in pattern '"+r+"'");o[t]=!0,l.push(t)}function e(r){return r.replace(/[\\\[\]\^$*+?.()|{}]/g,"\\$&")}var n,a=/([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,o={},i="^",u=0,s=this.segments=[],l=this.params=[];this.source=r;for(var c,f,h;(n=a.exec(r))&&(c=n[2]||n[3],f=n[4]||("*"==n[1]?".*":"[^/]*"),h=r.substring(u,n.index),!(h.indexOf("?")>=0));)i+=e(h)+"("+f+")",t(c),s.push(h),u=a.lastIndex;h=r.substring(u);var p=h.indexOf("?");if(p>=0){var v=this.sourceSearch=h.substring(p);h=h.substring(0,p),this.sourcePath=r.substring(0,u+p),y(v.substring(1).split(/[&?]/),t)}else this.sourcePath=r,this.sourceSearch="";i+=e(h)+"$",s.push(h),this.regexp=RegExp(i),this.prefix=s[0]}function c(){this.compile=function(r){return new l(r)},this.isMatcher=function(r){return E(r)&&w(r.exec)&&w(r.format)&&w(r.concat)},this.$get=function(){return this}}function f(r){function t(r){var t=/^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(r.source);return null!=t?t[1].replace(/\\(.)/g,"$1"):""}function e(r,t){return r.replace(/\$(\$|\d{1,2})/,function(r,e){return t["$"===e?0:Number(e)]})}function n(r,t,e){if(!e)return!1;var n=r.invoke(t,t,{$match:e});return g(n)?n:!0}var a=[],o=null;this.rule=function(r){if(!w(r))throw Error("'rule' must be a function");return a.push(r),this},this.otherwise=function(r){if(b(r)){var t=r;r=function(){return t}}else if(!w(r))throw Error("'rule' must be a function");return o=r,this},this.when=function(a,o){var i,u=b(o);if(b(a)&&(a=r.compile(a)),!u&&!w(o)&&!x(o))throw Error("invalid 'handler' in when()");var s={matcher:function(t,e){return u&&(i=r.compile(e),e=["$match",function(r){return i.format(r)}]),P(function(r,a){return n(r,e,t.exec(a.path(),a.search()))},{prefix:b(t.prefix)?t.prefix:""})},regex:function(r,a){if(r.global||r.sticky)throw Error("when() RegExp must not be global or sticky");return u&&(i=a,a=["$match",function(r){return e(i,r)}]),P(function(t,e){return n(t,a,r.exec(e.path()))},{prefix:t(r)})}},l={matcher:r.isMatcher(a),regex:a instanceof RegExp};for(var c in l)if(l[c])return this.rule(s[c](a,o));throw Error("invalid 'what' in when()")},this.$get=["$location","$rootScope","$injector",function(r,t,e){function n(){function t(t){var n=t(e,r);return n?(b(n)&&r.replace().url(n),!0):!1}var n,i=a.length;for(n=0;i>n;n++)if(t(a[n]))return;o&&t(o)}return t.$on("$locationChangeSuccess",n),{}}]}function h(r,a,o){function u(r,t){var n=b(r),a=n?r:r.name,o=0===a.indexOf(".")||0===a.indexOf("^");if(o){if(!t)throw Error("No reference point given for path '"+a+"'");for(var i=a.split("."),u=0,s=i.length,l=t;s>u;u++)if(""!==i[u]||0!==u){if("^"!==i[u])break;if(!l.parent)throw Error("Path '"+a+"' not valid for state '"+t.name+"'");l=l.parent}else l=t;i=i.slice(u).join("."),a=l.name+(l.name&&i?".":"")+i}var c=m[a];return!c||!n&&(n||c!==r&&c.self!==r)?e:c}function s(t){t=n(t,{self:t,resolve:t.resolve||{},toString:function(){return this.name}});var e=t.name;if(!b(e)||e.indexOf("@")>=0)throw Error("State must have a valid name");if(m[e])throw Error("State '"+e+"'' is already defined");for(var a in d)t[a]=d[a](t);return m[e]=t,!t["abstract"]&&t.url&&r.when(t.url,["$match","$stateParams",function(r,e){$.$current.navigable==t&&h(r,e)||$.transitionTo(t,r,!1)}]),t}function l(r,t){return E(r)?t=r:t.name=r,s(t),this}function c(r,t,a,s,l,c,m){function d(r,e,n,o,i){var u=n?e:p(r.params,e),s={$stateParams:u};i.resolve=l.resolve(r.resolve,s,i.resolve,r);var c=[i.resolve.then(function(r){i.globals=r})];return o&&c.push(o),y(r.views,function(t,e){var n=t.resolve&&t.resolve!==r.resolve?t.resolve:{};n.$template=[function(){return a.load(e,{view:t,locals:s,params:u,notify:!1})||""}],c.push(l.resolve(n,s,i.resolve,r).then(function(n){n.$$controller=t.controller,n.$$state=r,i[e]=n}))}),t.all(c).then(function(){return i})}var w=t.reject(Error("transition superseded")),b=t.reject(Error("transition prevented"));return v.locals={resolve:null,globals:{$stateParams:{}}},$={params:{},current:v.self,$current:v,transition:null},$.go=function(r,t,e){return this.transitionTo(r,t,P({inherit:!0,relative:$.$current},e))},$.transitionTo=function(e,a,o){g(o)||(o=o===!0||o===!1?{location:o}:{}),a=a||{},o=P({location:!0,inherit:!1,relative:null},o);var l=u(e,o.relative);if(!g(l))throw Error("No such state "+l);if(l["abstract"])throw Error("Cannot transition to abstract state '"+e+"'");o.inherit&&(a=i(c,a||{},$.$current,l)),e=l;var p,E,x=e.path,y=$.$current,C=$.params,S=y.path,O=v.locals,k=[];for(p=0,E=x[p];E&&E===S[p]&&h(a,C,E.ownParams);p++,E=x[p])O=k[p]=E.locals;if(e===y&&O===y.locals)return $.transition=null,t.when($.current);a=f(e.params,a||{});var R=r.$broadcast("$stateChangeStart",e.self,a,y.self,C);if(R.defaultPrevented)return b;for(var I=t.when(O),M=p;x.length>M;M++,E=x[M])O=k[M]=n(O),I=d(E,a,E===e,I,O);var U=$.transition=I.then(function(){var t,n,i;if($.transition!==U)return w;for(t=S.length-1;t>=p;t--)i=S[t],i.self.onExit&&s.invoke(i.self.onExit,i.self,i.locals.globals),i.locals=null;for(t=p;x.length>t;t++)n=x[t],n.locals=k[t],n.self.onEnter&&s.invoke(n.self.onEnter,n.self,n.locals.globals);$.$current=e,$.current=e.self,$.params=a,j($.params,c),$.transition=null;var u=e.navigable;return o.location&&u&&m.url(u.url.format(u.locals.globals.$stateParams)),r.$broadcast("$stateChangeSuccess",e.self,a,y.self,C),$.current},function(n){return $.transition!==U?w:($.transition=null,r.$broadcast("$stateChangeError",e.self,a,y.self,C,n),t.reject(n))});return U},$.is=function(r){var t=u(r);return g(t)?$.$current===t:e},$.includes=function(r){var t=u(r);return g(t)?g($.$current.includes[t.name]):e},$.href=function(r,t,e){e=P({lossy:!0,inherit:!1,relative:$.$current},e||{});var n=u(r,e.relative);if(!g(n))return null;t=i(c,t||{},$.$current,n);var a=n&&e.lossy?n.navigable:n,s=a&&a.url?a.url.format(f(n.params,t||{})):null;return!o.html5Mode()&&s?"#"+s:s},$.get=function(r){var t=u(r);return t&&t.self?t.self:null},$}function f(r,t){var e={};return y(r,function(r){var n=t[r];e[r]=null!=n?n+"":null}),e}function h(r,t,e){if(!e){e=[];for(var n in r)e.push(n)}for(var a=0;e.length>a;a++){var o=e[a];if(r[o]!=t[o])return!1}return!0}function p(r,t){var e={};return y(r,function(r){e[r]=t[r]}),e}var v,$,m={},d={parent:function(r){if(g(r.parent)&&r.parent)return u(r.parent);var t=/^(.+)\.[^.]+$/.exec(r.name);return t?u(t[1]):v},data:function(r){return r.parent&&r.parent.data&&(r.data=r.self.data=t.extend({},r.parent.data,r.data)),r.data},url:function(r){var t=r.url;if(b(t))return"^"==t.charAt(0)?a.compile(t.substring(1)):(r.parent.navigable||v).url.concat(t);if(a.isMatcher(t)||null==t)return t;throw Error("Invalid url '"+t+"' in state '"+r+"'")},navigable:function(r){return r.url?r:r.parent?r.parent.navigable:null},params:function(r){if(!r.params)return r.url?r.url.parameters():r.parent.params;if(!x(r.params))throw Error("Invalid params in state '"+r+"'");if(r.url)throw Error("Both params and url specicified in state '"+r+"'");return r.params},views:function(r){var t={};return y(g(r.views)?r.views:{"":r},function(e,n){0>n.indexOf("@")&&(n+="@"+r.parent.name),t[n]=e}),t},ownParams:function(r){if(!r.parent)return r.params;var t={};y(r.params,function(r){t[r]=!0}),y(r.parent.params,function(e){if(!t[e])throw Error("Missing required parameter '"+e+"' in state '"+r.name+"'");t[e]=!1});var e=[];return y(t,function(r,t){r&&e.push(t)}),e},path:function(r){return r.parent?r.parent.path.concat(r):[]},includes:function(r){var t=r.parent?P({},r.parent.includes):{};return t[r.name]=!0,t}};v=s({name:"",url:"^",views:null,"abstract":!0}),v.navigable=null,this.state=l,this.$get=c,c.$inject=["$rootScope","$q","$view","$injector","$resolve","$stateParams","$location","$urlRouter"]}function p(){function r(r,t){return{load:function(e,n){var a,o={template:null,controller:null,view:null,locals:null,notify:!0,async:!0,params:{}};return n=P(o,n),n.view&&(a=t.fromConfig(n.view,n.params,n.locals)),a&&n.notify&&r.$broadcast("$viewContentLoading",n),a}}}this.$get=r,r.$inject=["$rootScope","$templateFactory"]}function v(r,e,n,a,o){var i;try{i=a.get("$animator")}catch(u){}var s=!1,l={restrict:"ECA",terminal:!0,transclude:!0,compile:function(a,u,c){return function(a,u,f){function h(t){var i=r.$current&&r.$current.locals[$];if(i!==v){var s=w(d&&t);if(s.remove(u),p&&(p.$destroy(),p=null),!i)return v=null,E.state=null,s.restore(c(a),u);v=i,E.state=i.$$state;var l=e(s.populate(i.$template,u));if(p=a.$new(),i.$$controller){i.$scope=p;var f=n(i.$$controller,i);u.children().data("$ngControllerController",f)}l(p),p.$emit("$viewContentLoaded"),m&&p.$eval(m),o()}}var p,v,$=f[l.name]||f.name||"",m=f.onload||"",d=g(i)&&i(a,f),w=function(r){return{"true":{remove:function(r){d.leave(r.contents(),r)},restore:function(r,t){d.enter(r,t)},populate:function(r,e){var n=t.element("<div></div>").html(r).contents();return d.enter(n,e),n}},"false":{remove:function(r){r.html("")},restore:function(r,t){t.append(r)},populate:function(r,t){return t.html(r),t.contents()}}}[""+r]};u.append(c(a));var b=u.parent().inheritedData("$uiView");0>$.indexOf("@")&&($=$+"@"+(b?b.state.name:""));var E={name:$,state:null};u.data("$uiView",E);var x=function(){if(!s){s=!0;try{h(!0)}catch(r){throw s=!1,r}s=!1}};a.$on("$stateChangeSuccess",x),a.$on("$viewContentLoading",x),h(!1)}}};return l}function $(r){var t=r.match(/^([^(]+?)\s*(\((.*)\))?$/);if(!t||4!==t.length)throw Error("Invalid state ref '"+r+"'");return{state:t[1],paramExpr:t[3]||null}}function m(r){return{restrict:"A",link:function(t,n,a){var o=$(a.uiSref),i=null,u=r.$current,s="FORM"===n[0].nodeName,l=s?"action":"href",c=!0,f=n.parent().inheritedData("$uiView");f&&f.state&&f.state.name&&(u=f.state);var h=function(t){if(t&&(i=t),c){var a=r.href(o.state,i,{relative:u});return a?(n[0][l]=a,e):(c=!1,!1)}};o.paramExpr&&(t.$watch(o.paramExpr,function(r,t){r!==t&&h(r)},!0),i=t.$eval(o.paramExpr)),h(),s||n.bind("click",function(e){1!=e.which||e.ctrlKey||e.metaKey||e.shiftKey||(r.go(o.state,i,{relative:u}),t.$apply(),e.preventDefault())})}}}function d(r,t){function a(r){this.locals=r.locals.globals,this.params=this.locals.$stateParams}function o(){this.locals=null,this.params=null}function i(e,i){if(null!=i.redirectTo){var u,l=i.redirectTo;if(b(l))u=l;else{if(!w(l))throw Error("Invalid 'redirectTo' in when()");u=function(r,t){return l(r,t.path(),t.search())}}t.when(e,u)}else r.state(n(i,{parent:null,name:"route:"+encodeURIComponent(e),url:e,onEnter:a,onExit:o}));return s.push(i),this}function u(r,t,n){function a(r){return""!==r.name?r:e}var o={routes:s,params:n,current:e};return t.$on("$stateChangeStart",function(r,e,n,o){t.$broadcast("$routeChangeStart",a(e),a(o))}),t.$on("$stateChangeSuccess",function(r,e,n,i){o.current=a(e),t.$broadcast("$routeChangeSuccess",a(e),a(i)),j(n,o.params)}),t.$on("$stateChangeError",function(r,e,n,o,i,u){t.$broadcast("$routeChangeError",a(e),a(o),u)}),o}var s=[];a.$inject=["$$state"],this.when=i,this.$get=u,u.$inject=["$state","$rootScope","$routeParams"]}var g=t.isDefined,w=t.isFunction,b=t.isString,E=t.isObject,x=t.isArray,y=t.forEach,P=t.extend,j=t.copy;t.module("ui.router.util",["ng"]),t.module("ui.router.router",["ui.router.util"]),t.module("ui.router.state",["ui.router.router","ui.router.util"]),t.module("ui.router",["ui.router.state"]),t.module("ui.router.compat",["ui.router"]),u.$inject=["$q","$injector"],t.module("ui.router.util").service("$resolve",u),s.$inject=["$http","$templateCache","$injector"],t.module("ui.router.util").service("$templateFactory",s),l.prototype.concat=function(r){return new l(this.sourcePath+r+this.sourceSearch)},l.prototype.toString=function(){return this.source},l.prototype.exec=function(r,t){var e=this.regexp.exec(r);if(!e)return null;var n,a=this.params,o=a.length,i=this.segments.length-1,u={};if(i!==e.length-1)throw Error("Unbalanced capture group in route '"+this.source+"'");for(n=0;i>n;n++)u[a[n]]=e[n+1];for(;o>n;n++)u[a[n]]=t[a[n]];return u},l.prototype.parameters=function(){return this.params},l.prototype.format=function(r){var t=this.segments,e=this.params;if(!r)return t.join("");var n,a,o,i=t.length-1,u=e.length,s=t[0];for(n=0;i>n;n++)o=r[e[n]],null!=o&&(s+=encodeURIComponent(o)),s+=t[n+1];for(;u>n;n++)o=r[e[n]],null!=o&&(s+=(a?"&":"?")+e[n]+"="+encodeURIComponent(o),a=!0);return s},t.module("ui.router.util").provider("$urlMatcherFactory",c),f.$inject=["$urlMatcherFactoryProvider"],t.module("ui.router.router").provider("$urlRouter",f),h.$inject=["$urlRouterProvider","$urlMatcherFactoryProvider","$locationProvider"],t.module("ui.router.state").value("$stateParams",{}).provider("$state",h),p.$inject=[],t.module("ui.router.state").provider("$view",p),v.$inject=["$state","$compile","$controller","$injector","$anchorScroll"],t.module("ui.router.state").directive("uiView",v),m.$inject=["$state"],t.module("ui.router.state").directive("uiSref",m),d.$inject=["$stateProvider","$urlRouterProvider"],t.module("ui.router.compat").provider("$route",d).directive("ngView",v)})(window,window.angular);;

/* jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/ */
jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d)},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b}});

/* AlertView 1.0.1 https://github.com/kelp404/AlertView */
(function(){var a,g;g=function(b,c){return setTimeout(c,b)};a=jQuery;a.extend(a.easing,{avOutExpo:function(b,c,a,e,f){return c===f?a+e:e*(-Math.pow(2,-10*c/f)+1)+a},avInExpo:function(b,a,d,e,f){return 0===a?d:e*Math.pow(2,10*(a/f-1))+d}});a.extend(a,{av:{version:"1.0.1",width:250,height:88,prefix:"alert_view_",increment_id:0,queue:[],pop:function(b){var c,d,e;null==b&&(b={});null==b.expire&&(b.expire=5E3);null==b.title&&(b.title="");null==b.message&&(b.message="");null==b.template&&(b.template="default");
null==b.mode&&(b.mode="notification");c=this.prefix+ ++this.increment_id;"alert"===b.mode?(d=a("<div id='"+c+"' class='alert_view'>\n    <span class='av_title'>"+b.title+"</span>\n    <span class='av_message'>"+b.message+"</span>\n    <div class='av_close' onclick=\"$.av.hide('"+c+"');\">X</div>\n</div>"),d.css({width:a(".alert_view_center").width()}),0===a(".alert_view_center").find(".alert_view").length&&d.css({opacity:0,"margin-top":"-25px"}),a(".alert_view_center").html(d),a("#"+c).animate({opacity:0.9,
"margin-top":"0"},400,"avOutExpo",0<b.expire?g(b.expire,function(){return a.av.hide(c)}):void 0)):(d=a("<div id='"+c+"' class='alert_view alert_view_notification'>\n  <div class='av_title'>"+b.title+"</div>\n  <div class='av_message'>"+b.message+"</div>\n</div>"),e=this.queue.length*this.height,this.queue.push(c),a("body").append(d),a("#"+c).css({right:-this.width,top:e}),a("#"+c).animate({right:0},400,"avOutExpo",0<b.expire?g(b.expire,function(){return a.av.hide(c)}):void 0));switch(b.template){case "error":d.addClass("alert_view_error");
break;case "black":d.addClass("alert_view_black")}return c},hide:function(b){a("#"+b).hasClass("alert_view_notification")?a("#"+b).animate({right:-this.width,opacity:0},400,"avInExpo",function(){var c,d,e,f,g,k,h;d=parseInt(a(this).css("top"));a.av.queue=a.av.queue.filter(function(a){return a!==b});a(this).remove();k=a.av.queue;h=[];f=0;for(g=k.length;f<g;f++)c=k[f],c=a("#"+c),e=parseInt(c.attr("new_top")?c.attr("new_top"):c.css("top")),e>=d?(e-=a.av.height,c.attr({new_top:e}),c.dequeue(),h.push(c.animate({top:e},
400,"avOutExpo"))):h.push(void 0);return h}):a("#"+b).animate({opacity:0},400,function(){return a(this).remove()})}}})}).call(this);
;
/*!
* Bootstrap.js by @fat & @mdo
* Copyright 2013 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function(e){"use strict";e(function(){e.support.transition=function(){var e=function(){var e=document.createElement("bootstrap"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},n;for(n in t)if(e.style[n]!==undefined)return t[n]}();return e&&{end:e}}()})}(window.jQuery),!function(e){"use strict";var t='[data-dismiss="alert"]',n=function(n){e(n).on("click",t,this.close)};n.prototype.close=function(t){function s(){i.trigger("closed").remove()}var n=e(this),r=n.attr("data-target"),i;r||(r=n.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,"")),i=e(r),t&&t.preventDefault(),i.length||(i=n.hasClass("alert")?n:n.parent()),i.trigger(t=e.Event("close"));if(t.isDefaultPrevented())return;i.removeClass("in"),e.support.transition&&i.hasClass("fade")?i.on(e.support.transition.end,s):s()};var r=e.fn.alert;e.fn.alert=function(t){return this.each(function(){var r=e(this),i=r.data("alert");i||r.data("alert",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.alert.Constructor=n,e.fn.alert.noConflict=function(){return e.fn.alert=r,this},e(document).on("click.alert.data-api",t,n.prototype.close)}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.button.defaults,n)};t.prototype.setState=function(e){var t="disabled",n=this.$element,r=n.data(),i=n.is("input")?"val":"html";e+="Text",r.resetText||n.data("resetText",n[i]()),n[i](r[e]||this.options[e]),setTimeout(function(){e=="loadingText"?n.addClass(t).attr(t,t):n.removeClass(t).removeAttr(t)},0)},t.prototype.toggle=function(){var e=this.$element.closest('[data-toggle="buttons-radio"]');e&&e.find(".active").removeClass("active"),this.$element.toggleClass("active")};var n=e.fn.button;e.fn.button=function(n){return this.each(function(){var r=e(this),i=r.data("button"),s=typeof n=="object"&&n;i||r.data("button",i=new t(this,s)),n=="toggle"?i.toggle():n&&i.setState(n)})},e.fn.button.defaults={loadingText:"loading..."},e.fn.button.Constructor=t,e.fn.button.noConflict=function(){return e.fn.button=n,this},e(document).on("click.button.data-api","[data-toggle^=button]",function(t){var n=e(t.target);n.hasClass("btn")||(n=n.closest(".btn")),n.button("toggle")})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.$indicators=this.$element.find(".carousel-indicators"),this.options=n,this.options.pause=="hover"&&this.$element.on("mouseenter",e.proxy(this.pause,this)).on("mouseleave",e.proxy(this.cycle,this))};t.prototype={cycle:function(t){return t||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(e.proxy(this.next,this),this.options.interval)),this},getActiveIndex:function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},to:function(t){var n=this.getActiveIndex(),r=this;if(t>this.$items.length-1||t<0)return;return this.sliding?this.$element.one("slid",function(){r.to(t)}):n==t?this.pause().cycle():this.slide(t>n?"next":"prev",e(this.$items[t]))},pause:function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&e.support.transition.end&&(this.$element.trigger(e.support.transition.end),this.cycle(!0)),clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(t,n){var r=this.$element.find(".item.active"),i=n||r[t](),s=this.interval,o=t=="next"?"left":"right",u=t=="next"?"first":"last",a=this,f;this.sliding=!0,s&&this.pause(),i=i.length?i:this.$element.find(".item")[u](),f=e.Event("slide",{relatedTarget:i[0],direction:o});if(i.hasClass("active"))return;this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid",function(){var t=e(a.$indicators.children()[a.getActiveIndex()]);t&&t.addClass("active")}));if(e.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(f);if(f.isDefaultPrevented())return;i.addClass(t),i[0].offsetWidth,r.addClass(o),i.addClass(o),this.$element.one(e.support.transition.end,function(){i.removeClass([t,o].join(" ")).addClass("active"),r.removeClass(["active",o].join(" ")),a.sliding=!1,setTimeout(function(){a.$element.trigger("slid")},0)})}else{this.$element.trigger(f);if(f.isDefaultPrevented())return;r.removeClass("active"),i.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return s&&this.cycle(),this}};var n=e.fn.carousel;e.fn.carousel=function(n){return this.each(function(){var r=e(this),i=r.data("carousel"),s=e.extend({},e.fn.carousel.defaults,typeof n=="object"&&n),o=typeof n=="string"?n:s.slide;i||r.data("carousel",i=new t(this,s)),typeof n=="number"?i.to(n):o?i[o]():s.interval&&i.pause().cycle()})},e.fn.carousel.defaults={interval:5e3,pause:"hover"},e.fn.carousel.Constructor=t,e.fn.carousel.noConflict=function(){return e.fn.carousel=n,this},e(document).on("click.carousel.data-api","[data-slide], [data-slide-to]",function(t){var n=e(this),r,i=e(n.attr("data-target")||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,"")),s=e.extend({},i.data(),n.data()),o;i.carousel(s),(o=n.attr("data-slide-to"))&&i.data("carousel").pause().to(o).cycle(),t.preventDefault()})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.collapse.defaults,n),this.options.parent&&(this.$parent=e(this.options.parent)),this.options.toggle&&this.toggle()};t.prototype={constructor:t,dimension:function(){var e=this.$element.hasClass("width");return e?"width":"height"},show:function(){var t,n,r,i;if(this.transitioning||this.$element.hasClass("in"))return;t=this.dimension(),n=e.camelCase(["scroll",t].join("-")),r=this.$parent&&this.$parent.find("> .accordion-group > .in");if(r&&r.length){i=r.data("collapse");if(i&&i.transitioning)return;r.collapse("hide"),i||r.data("collapse",null)}this.$element[t](0),this.transition("addClass",e.Event("show"),"shown"),e.support.transition&&this.$element[t](this.$element[0][n])},hide:function(){var t;if(this.transitioning||!this.$element.hasClass("in"))return;t=this.dimension(),this.reset(this.$element[t]()),this.transition("removeClass",e.Event("hide"),"hidden"),this.$element[t](0)},reset:function(e){var t=this.dimension();return this.$element.removeClass("collapse")[t](e||"auto")[0].offsetWidth,this.$element[e!==null?"addClass":"removeClass"]("collapse"),this},transition:function(t,n,r){var i=this,s=function(){n.type=="show"&&i.reset(),i.transitioning=0,i.$element.trigger(r)};this.$element.trigger(n);if(n.isDefaultPrevented())return;this.transitioning=1,this.$element[t]("in"),e.support.transition&&this.$element.hasClass("collapse")?this.$element.one(e.support.transition.end,s):s()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}};var n=e.fn.collapse;e.fn.collapse=function(n){return this.each(function(){var r=e(this),i=r.data("collapse"),s=e.extend({},e.fn.collapse.defaults,r.data(),typeof n=="object"&&n);i||r.data("collapse",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.collapse.defaults={toggle:!0},e.fn.collapse.Constructor=t,e.fn.collapse.noConflict=function(){return e.fn.collapse=n,this},e(document).on("click.collapse.data-api","[data-toggle=collapse]",function(t){var n=e(this),r,i=n.attr("data-target")||t.preventDefault()||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,""),s=e(i).data("collapse")?"toggle":n.data();n[e(i).hasClass("in")?"addClass":"removeClass"]("collapsed"),e(i).collapse(s)})}(window.jQuery),!function(e){"use strict";function r(){e(".dropdown-backdrop").remove(),e(t).each(function(){i(e(this)).removeClass("open")})}function i(t){var n=t.attr("data-target"),r;n||(n=t.attr("href"),n=n&&/#/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,"")),r=n&&e(n);if(!r||!r.length)r=t.parent();return r}var t="[data-toggle=dropdown]",n=function(t){var n=e(t).on("click.dropdown.data-api",this.toggle);e("html").on("click.dropdown.data-api",function(){n.parent().removeClass("open")})};n.prototype={constructor:n,toggle:function(t){var n=e(this),s,o;if(n.is(".disabled, :disabled"))return;return s=i(n),o=s.hasClass("open"),r(),o||("ontouchstart"in document.documentElement&&e('<div class="dropdown-backdrop"/>').insertBefore(e(this)).on("click",r),s.toggleClass("open")),n.focus(),!1},keydown:function(n){var r,s,o,u,a,f;if(!/(38|40|27)/.test(n.keyCode))return;r=e(this),n.preventDefault(),n.stopPropagation();if(r.is(".disabled, :disabled"))return;u=i(r),a=u.hasClass("open");if(!a||a&&n.keyCode==27)return n.which==27&&u.find(t).focus(),r.click();s=e("[role=menu] li:not(.divider):visible a",u);if(!s.length)return;f=s.index(s.filter(":focus")),n.keyCode==38&&f>0&&f--,n.keyCode==40&&f<s.length-1&&f++,~f||(f=0),s.eq(f).focus()}};var s=e.fn.dropdown;e.fn.dropdown=function(t){return this.each(function(){var r=e(this),i=r.data("dropdown");i||r.data("dropdown",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.dropdown.Constructor=n,e.fn.dropdown.noConflict=function(){return e.fn.dropdown=s,this},e(document).on("click.dropdown.data-api",r).on("click.dropdown.data-api",".dropdown form",function(e){e.stopPropagation()}).on("click.dropdown.data-api",t,n.prototype.toggle).on("keydown.dropdown.data-api",t+", [role=menu]",n.prototype.keydown)}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=n,this.$element=e(t).delegate('[data-dismiss="modal"]',"click.dismiss.modal",e.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};t.prototype={constructor:t,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var t=this,n=e.Event("show");this.$element.trigger(n);if(this.isShown||n.isDefaultPrevented())return;this.isShown=!0,this.escape(),this.backdrop(function(){var n=e.support.transition&&t.$element.hasClass("fade");t.$element.parent().length||t.$element.appendTo(document.body),t.$element.show(),n&&t.$element[0].offsetWidth,t.$element.addClass("in").attr("aria-hidden",!1),t.enforceFocus(),n?t.$element.one(e.support.transition.end,function(){t.$element.focus().trigger("shown")}):t.$element.focus().trigger("shown")})},hide:function(t){t&&t.preventDefault();var n=this;t=e.Event("hide"),this.$element.trigger(t);if(!this.isShown||t.isDefaultPrevented())return;this.isShown=!1,this.escape(),e(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),e.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},enforceFocus:function(){var t=this;e(document).on("focusin.modal",function(e){t.$element[0]!==e.target&&!t.$element.has(e.target).length&&t.$element.focus()})},escape:function(){var e=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(t){t.which==27&&e.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var t=this,n=setTimeout(function(){t.$element.off(e.support.transition.end),t.hideModal()},500);this.$element.one(e.support.transition.end,function(){clearTimeout(n),t.hideModal()})},hideModal:function(){var e=this;this.$element.hide(),this.backdrop(function(){e.removeBackdrop(),e.$element.trigger("hidden")})},removeBackdrop:function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},backdrop:function(t){var n=this,r=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=e.support.transition&&r;this.$backdrop=e('<div class="modal-backdrop '+r+'" />').appendTo(document.body),this.$backdrop.click(this.options.backdrop=="static"?e.proxy(this.$element[0].focus,this.$element[0]):e.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in");if(!t)return;i?this.$backdrop.one(e.support.transition.end,t):t()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(e.support.transition.end,t):t()):t&&t()}};var n=e.fn.modal;e.fn.modal=function(n){return this.each(function(){var r=e(this),i=r.data("modal"),s=e.extend({},e.fn.modal.defaults,r.data(),typeof n=="object"&&n);i||r.data("modal",i=new t(this,s)),typeof n=="string"?i[n]():s.show&&i.show()})},e.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},e.fn.modal.Constructor=t,e.fn.modal.noConflict=function(){return e.fn.modal=n,this},e(document).on("click.modal.data-api",'[data-toggle="modal"]',function(t){var n=e(this),r=n.attr("href"),i=e(n.attr("data-target")||r&&r.replace(/.*(?=#[^\s]+$)/,"")),s=i.data("modal")?"toggle":e.extend({remote:!/#/.test(r)&&r},i.data(),n.data());t.preventDefault(),i.modal(s).one("hide",function(){n.focus()})})}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s,o,u,a;this.type=t,this.$element=e(n),this.options=this.getOptions(r),this.enabled=!0,o=this.options.trigger.split(" ");for(a=o.length;a--;)u=o[a],u=="click"?this.$element.on("click."+this.type,this.options.selector,e.proxy(this.toggle,this)):u!="manual"&&(i=u=="hover"?"mouseenter":"focus",s=u=="hover"?"mouseleave":"blur",this.$element.on(i+"."+this.type,this.options.selector,e.proxy(this.enter,this)),this.$element.on(s+"."+this.type,this.options.selector,e.proxy(this.leave,this)));this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){return t=e.extend({},e.fn[this.type].defaults,this.$element.data(),t),t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),t},enter:function(t){var n=e.fn[this.type].defaults,r={},i;this._options&&e.each(this._options,function(e,t){n[e]!=t&&(r[e]=t)},this),i=e(t.currentTarget)[this.type](r).data(this.type);if(!i.options.delay||!i.options.delay.show)return i.show();clearTimeout(this.timeout),i.hoverState="in",this.timeout=setTimeout(function(){i.hoverState=="in"&&i.show()},i.options.delay.show)},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);this.timeout&&clearTimeout(this.timeout);if(!n.options.delay||!n.options.delay.hide)return n.hide();n.hoverState="out",this.timeout=setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)},show:function(){var t,n,r,i,s,o,u=e.Event("show");if(this.hasContent()&&this.enabled){this.$element.trigger(u);if(u.isDefaultPrevented())return;t=this.tip(),this.setContent(),this.options.animation&&t.addClass("fade"),s=typeof this.options.placement=="function"?this.options.placement.call(this,t[0],this.$element[0]):this.options.placement,t.detach().css({top:0,left:0,display:"block"}),this.options.container?t.appendTo(this.options.container):t.insertAfter(this.$element),n=this.getPosition(),r=t[0].offsetWidth,i=t[0].offsetHeight;switch(s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}this.applyPlacement(o,s),this.$element.trigger("shown")}},applyPlacement:function(e,t){var n=this.tip(),r=n[0].offsetWidth,i=n[0].offsetHeight,s,o,u,a;n.offset(e).addClass(t).addClass("in"),s=n[0].offsetWidth,o=n[0].offsetHeight,t=="top"&&o!=i&&(e.top=e.top+i-o,a=!0),t=="bottom"||t=="top"?(u=0,e.left<0&&(u=e.left*-2,e.left=0,n.offset(e),s=n[0].offsetWidth,o=n[0].offsetHeight),this.replaceArrow(u-r+s,s,"left")):this.replaceArrow(o-i,o,"top"),a&&n.offset(e)},replaceArrow:function(e,t,n){this.arrow().css(n,e?50*(1-e/t)+"%":"")},setContent:function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.options.html?"html":"text"](t),e.removeClass("fade in top bottom left right")},hide:function(){function i(){var t=setTimeout(function(){n.off(e.support.transition.end).detach()},500);n.one(e.support.transition.end,function(){clearTimeout(t),n.detach()})}var t=this,n=this.tip(),r=e.Event("hide");this.$element.trigger(r);if(r.isDefaultPrevented())return;return n.removeClass("in"),e.support.transition&&this.$tip.hasClass("fade")?i():n.detach(),this.$element.trigger("hidden"),this},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr("data-original-title",e.attr("title")||"").attr("title","")},hasContent:function(){return this.getTitle()},getPosition:function(){var t=this.$element[0];return e.extend({},typeof t.getBoundingClientRect=="function"?t.getBoundingClientRect():{width:t.offsetWidth,height:t.offsetHeight},this.$element.offset())},getTitle:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title),e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},arrow:function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(t){var n=t?e(t.currentTarget)[this.type](this._options).data(this.type):this;n.tip().hasClass("in")?n.hide():n.show()},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}};var n=e.fn.tooltip;e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.tooltip.Constructor=t,e.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},e.fn.tooltip.noConflict=function(){return e.fn.tooltip=n,this}}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("popover",e,t)};t.prototype=e.extend({},e.fn.tooltip.Constructor.prototype,{constructor:t,setContent:function(){var e=this.tip(),t=this.getTitle(),n=this.getContent();e.find(".popover-title")[this.options.html?"html":"text"](t),e.find(".popover-content")[this.options.html?"html":"text"](n),e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var e,t=this.$element,n=this.options;return e=(typeof n.content=="function"?n.content.call(t[0]):n.content)||t.attr("data-content"),e},tip:function(){return this.$tip||(this.$tip=e(this.options.template)),this.$tip},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}});var n=e.fn.popover;e.fn.popover=function(n){return this.each(function(){var r=e(this),i=r.data("popover"),s=typeof n=="object"&&n;i||r.data("popover",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.popover.Constructor=t,e.fn.popover.defaults=e.extend({},e.fn.tooltip.defaults,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),e.fn.popover.noConflict=function(){return e.fn.popover=n,this}}(window.jQuery),!function(e){"use strict";function t(t,n){var r=e.proxy(this.process,this),i=e(t).is("body")?e(window):e(t),s;this.options=e.extend({},e.fn.scrollspy.defaults,n),this.$scrollElement=i.on("scroll.scroll-spy.data-api",r),this.selector=(this.options.target||(s=e(t).attr("href"))&&s.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=e("body"),this.refresh(),this.process()}t.prototype={constructor:t,refresh:function(){var t=this,n;this.offsets=e([]),this.targets=e([]),n=this.$body.find(this.selector).map(function(){var n=e(this),r=n.data("target")||n.attr("href"),i=/^#\w/.test(r)&&e(r);return i&&i.length&&[[i.position().top+(!e.isWindow(t.$scrollElement.get(0))&&t.$scrollElement.scrollTop()),r]]||null}).sort(function(e,t){return e[0]-t[0]}).each(function(){t.offsets.push(this[0]),t.targets.push(this[1])})},process:function(){var e=this.$scrollElement.scrollTop()+this.options.offset,t=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,n=t-this.$scrollElement.height(),r=this.offsets,i=this.targets,s=this.activeTarget,o;if(e>=n)return s!=(o=i.last()[0])&&this.activate(o);for(o=r.length;o--;)s!=i[o]&&e>=r[o]&&(!r[o+1]||e<=r[o+1])&&this.activate(i[o])},activate:function(t){var n,r;this.activeTarget=t,e(this.selector).parent(".active").removeClass("active"),r=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',n=e(r).parent("li").addClass("active"),n.parent(".dropdown-menu").length&&(n=n.closest("li.dropdown").addClass("active")),n.trigger("activate")}};var n=e.fn.scrollspy;e.fn.scrollspy=function(n){return this.each(function(){var r=e(this),i=r.data("scrollspy"),s=typeof n=="object"&&n;i||r.data("scrollspy",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.scrollspy.Constructor=t,e.fn.scrollspy.defaults={offset:10},e.fn.scrollspy.noConflict=function(){return e.fn.scrollspy=n,this},e(window).on("load",function(){e('[data-spy="scroll"]').each(function(){var t=e(this);t.scrollspy(t.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t){this.element=e(t)};t.prototype={constructor:t,show:function(){var t=this.element,n=t.closest("ul:not(.dropdown-menu)"),r=t.attr("data-target"),i,s,o;r||(r=t.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,""));if(t.parent("li").hasClass("active"))return;i=n.find(".active:last a")[0],o=e.Event("show",{relatedTarget:i}),t.trigger(o);if(o.isDefaultPrevented())return;s=e(r),this.activate(t.parent("li"),n),this.activate(s,s.parent(),function(){t.trigger({type:"shown",relatedTarget:i})})},activate:function(t,n,r){function o(){i.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),t.addClass("active"),s?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu")&&t.closest("li.dropdown").addClass("active"),r&&r()}var i=n.find("> .active"),s=r&&e.support.transition&&i.hasClass("fade");s?i.one(e.support.transition.end,o):o(),i.removeClass("in")}};var n=e.fn.tab;e.fn.tab=function(n){return this.each(function(){var r=e(this),i=r.data("tab");i||r.data("tab",i=new t(this)),typeof n=="string"&&i[n]()})},e.fn.tab.Constructor=t,e.fn.tab.noConflict=function(){return e.fn.tab=n,this},e(document).on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(t){t.preventDefault(),e(this).tab("show")})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.typeahead.defaults,n),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.source=this.options.source,this.$menu=e(this.options.menu),this.shown=!1,this.listen()};t.prototype={constructor:t,select:function(){var e=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(e)).change(),this.hide()},updater:function(e){return e},show:function(){var t=e.extend({},this.$element.position(),{height:this.$element[0].offsetHeight});return this.$menu.insertAfter(this.$element).css({top:t.top+t.height,left:t.left}).show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(t){var n;return this.query=this.$element.val(),!this.query||this.query.length<this.options.minLength?this.shown?this.hide():this:(n=e.isFunction(this.source)?this.source(this.query,e.proxy(this.process,this)):this.source,n?this.process(n):this)},process:function(t){var n=this;return t=e.grep(t,function(e){return n.matcher(e)}),t=this.sorter(t),t.length?this.render(t.slice(0,this.options.items)).show():this.shown?this.hide():this},matcher:function(e){return~e.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(e){var t=[],n=[],r=[],i;while(i=e.shift())i.toLowerCase().indexOf(this.query.toLowerCase())?~i.indexOf(this.query)?n.push(i):r.push(i):t.push(i);return t.concat(n,r)},highlighter:function(e){var t=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return e.replace(new RegExp("("+t+")","ig"),function(e,t){return"<strong>"+t+"</strong>"})},render:function(t){var n=this;return t=e(t).map(function(t,r){return t=e(n.options.item).attr("data-value",r),t.find("a").html(n.highlighter(r)),t[0]}),t.first().addClass("active"),this.$menu.html(t),this},next:function(t){var n=this.$menu.find(".active").removeClass("active"),r=n.next();r.length||(r=e(this.$menu.find("li")[0])),r.addClass("active")},prev:function(e){var t=this.$menu.find(".active").removeClass("active"),n=t.prev();n.length||(n=this.$menu.find("li").last()),n.addClass("active")},listen:function(){this.$element.on("focus",e.proxy(this.focus,this)).on("blur",e.proxy(this.blur,this)).on("keypress",e.proxy(this.keypress,this)).on("keyup",e.proxy(this.keyup,this)),this.eventSupported("keydown")&&this.$element.on("keydown",e.proxy(this.keydown,this)),this.$menu.on("click",e.proxy(this.click,this)).on("mouseenter","li",e.proxy(this.mouseenter,this)).on("mouseleave","li",e.proxy(this.mouseleave,this))},eventSupported:function(e){var t=e in this.$element;return t||(this.$element.setAttribute(e,"return;"),t=typeof this.$element[e]=="function"),t},move:function(e){if(!this.shown)return;switch(e.keyCode){case 9:case 13:case 27:e.preventDefault();break;case 38:e.preventDefault(),this.prev();break;case 40:e.preventDefault(),this.next()}e.stopPropagation()},keydown:function(t){this.suppressKeyPressRepeat=~e.inArray(t.keyCode,[40,38,9,13,27]),this.move(t)},keypress:function(e){if(this.suppressKeyPressRepeat)return;this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:case 16:case 17:case 18:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}e.stopPropagation(),e.preventDefault()},focus:function(e){this.focused=!0},blur:function(e){this.focused=!1,!this.mousedover&&this.shown&&this.hide()},click:function(e){e.stopPropagation(),e.preventDefault(),this.select(),this.$element.focus()},mouseenter:function(t){this.mousedover=!0,this.$menu.find(".active").removeClass("active"),e(t.currentTarget).addClass("active")},mouseleave:function(e){this.mousedover=!1,!this.focused&&this.shown&&this.hide()}};var n=e.fn.typeahead;e.fn.typeahead=function(n){return this.each(function(){var r=e(this),i=r.data("typeahead"),s=typeof n=="object"&&n;i||r.data("typeahead",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1},e.fn.typeahead.Constructor=t,e.fn.typeahead.noConflict=function(){return e.fn.typeahead=n,this},e(document).on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(t){var n=e(this);if(n.data("typeahead"))return;n.typeahead(n.data())})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=e.extend({},e.fn.affix.defaults,n),this.$window=e(window).on("scroll.affix.data-api",e.proxy(this.checkPosition,this)).on("click.affix.data-api",e.proxy(function(){setTimeout(e.proxy(this.checkPosition,this),1)},this)),this.$element=e(t),this.checkPosition()};t.prototype.checkPosition=function(){if(!this.$element.is(":visible"))return;var t=e(document).height(),n=this.$window.scrollTop(),r=this.$element.offset(),i=this.options.offset,s=i.bottom,o=i.top,u="affix affix-top affix-bottom",a;typeof i!="object"&&(s=o=i),typeof o=="function"&&(o=i.top()),typeof s=="function"&&(s=i.bottom()),a=this.unpin!=null&&n+this.unpin<=r.top?!1:s!=null&&r.top+this.$element.height()>=t-s?"bottom":o!=null&&n<=o?"top":!1;if(this.affixed===a)return;this.affixed=a,this.unpin=a=="bottom"?r.top-n:null,this.$element.removeClass(u).addClass("affix"+(a?"-"+a:""))};var n=e.fn.affix;e.fn.affix=function(n){return this.each(function(){var r=e(this),i=r.data("affix"),s=typeof n=="object"&&n;i||r.data("affix",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.affix.Constructor=t,e.fn.affix.defaults={offset:0},e.fn.affix.noConflict=function(){return e.fn.affix=n,this},e(window).on("load",function(){e('[data-spy="affix"]').each(function(){var t=e(this),n=t.data();n.offset=n.offset||{},n.offsetBottom&&(n.offset.bottom=n.offsetBottom),n.offsetTop&&(n.offset.top=n.offsetTop),t.affix(n)})})}(window.jQuery);;
(function(factory){if(typeof module==="function")module.exports=factory(this.jQuery||require("jquery"));else if(typeof define==="function"&&define.amd)define(["jquery"],function($){return factory($)});else this.NProgress=factory(this.jQuery)})(function($){var NProgress={};NProgress.version="0.1.2";var Settings=NProgress.settings={minimum:0.08,easing:"ease",positionUsing:"",speed:200,trickle:true,trickleRate:0.02,trickleSpeed:800,showSpinner:true,template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};
NProgress.configure=function(options){$.extend(Settings,options);return this};NProgress.status=null;NProgress.set=function(n){var started=NProgress.isStarted();n=clamp(n,Settings.minimum,1);NProgress.status=n===1?null:n;var $progress=NProgress.render(!started),$bar=$progress.find('[role="bar"]'),speed=Settings.speed,ease=Settings.easing;$progress[0].offsetWidth;$progress.queue(function(next){if(Settings.positionUsing==="")Settings.positionUsing=NProgress.getPositioningCSS();$bar.css(barPositionCSS(n,
speed,ease));if(n===1){$progress.css({transition:"none",opacity:1});$progress[0].offsetWidth;setTimeout(function(){$progress.css({transition:"all "+speed+"ms linear",opacity:0});setTimeout(function(){NProgress.remove();next()},speed)},speed)}else setTimeout(next,speed)});return this};NProgress.isStarted=function(){return typeof NProgress.status==="number"};NProgress.start=function(){if(!NProgress.status)NProgress.set(0);var work=function(){setTimeout(function(){if(!NProgress.status)return;NProgress.trickle();
work()},Settings.trickleSpeed)};if(Settings.trickle)work();return this};NProgress.done=function(force){if(!force&&!NProgress.status)return this;return NProgress.inc(0.3+0.5*Math.random()).set(1)};NProgress.inc=function(amount){var n=NProgress.status;if(!n)return NProgress.start();else{if(typeof amount!=="number")amount=(1-n)*clamp(Math.random()*n,0.1,0.95);n=clamp(n+amount,0,0.994);return NProgress.set(n)}};NProgress.trickle=function(){return NProgress.inc(Math.random()*Settings.trickleRate)};NProgress.render=
function(fromStart){if(NProgress.isRendered())return $("#nprogress");$("html").addClass("nprogress-busy");var $el=$("<div id='nprogress'>").html(Settings.template);var perc=fromStart?"-100":toBarPerc(NProgress.status||0);$el.find('[role="bar"]').css({transition:"all 0 linear",transform:"translate3d("+perc+"%,0,0)"});if(!Settings.showSpinner)$el.find('[role="spinner"]').remove();$el.appendTo(document.body);return $el};NProgress.remove=function(){$("html").removeClass("nprogress-busy");$("#nprogress").remove()};
NProgress.isRendered=function(){return $("#nprogress").length>0};NProgress.getPositioningCSS=function(){var bodyStyle=document.body.style;var vendorPrefix="WebkitTransform"in bodyStyle?"Webkit":"MozTransform"in bodyStyle?"Moz":"msTransform"in bodyStyle?"ms":"OTransform"in bodyStyle?"O":"";if(vendorPrefix+"Perspective"in bodyStyle)return"translate3d";else if(vendorPrefix+"Transform"in bodyStyle)return"translate";else return"margin"};function clamp(n,min,max){if(n<min)return min;if(n>max)return max;
return n}function toBarPerc(n){return(-1+n)*100}function barPositionCSS(n,speed,ease){var barCSS;if(Settings.positionUsing==="translate3d")barCSS={transform:"translate3d("+toBarPerc(n)+"%,0,0)"};else if(Settings.positionUsing==="translate")barCSS={transform:"translate("+toBarPerc(n)+"%,0)"};else barCSS={"margin-left":toBarPerc(n)+"%"};barCSS.transition="all "+speed+"ms "+ease;return barCSS}return NProgress});
;
// Generated by CoffeeScript 1.6.3
(function() {
  var c;

  c = angular.module('victory.controller', ['victory.service']);

  c.controller('NavigationCtrl', function($scope, $victory) {
    /*
    Navigation Controller
    
    :scope select: selected ui-router node name
    */

    var delay;
    delay = function(ms, func) {
      return setTimeout(func, ms);
    };
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (fromState.name !== "") {
        $victory.common.loading.on();
      }
      $scope.select = toState.name;
      $('.modal.in').modal('hide');
      return delay(0, function() {
        return $('#js_navigation li.select').mouseover();
      });
    });
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      return $victory.common.loading.off();
    });
    return $scope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      return $victory.common.loading.off();
    });
  });

  c.controller('IndexCtrl', function($scope, $victory) {
    /*
    /
    */

    if ($scope.user.isLogin) {
      return location.href = '#/crashes/grouped';
    } else {
      return location.href = '#/login';
    }
  });

  c.controller('LoginCtrl', function($scope) {
    /*
    /login
    */

    return $scope.loginUrl = victory.loginUrl;
  });

  c.controller('SettingsMenuCtrl', function($scope, $state) {
    /*
    The controller of the settings menu
    */

    return $scope.active = $state.current.name;
  });

  c.controller('SettingsCtrl', function() {
    /*
    /settings
    */

    return location.href = '#/settings/applications';
  });

  c.controller('SettingsApplicationsCtrl', function($scope, $victory, applications) {
    /*
    /settings/applications
    
    :scope name: new application name
    :scope description: new application description
    :scope items: [{id, name, newName, description, newDescription
                        app_key, create_time, is_owner, members:[{id, name, email, is_owner}]
                        }]
    */

    var item, _i, _len;
    for (_i = 0, _len = applications.length; _i < _len; _i++) {
      item = applications[_i];
      item.newName = item.name;
      item.newDescription = item.description;
    }
    $scope.items = applications;
    $scope.getApplications = function() {
      /*
      Get applications.
      */

      return $victory.setting.getApplications({
        success: function(data) {
          var _j, _len1, _ref;
          _ref = data.items;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            item = _ref[_j];
            item.newName = item.name;
            item.newDescription = item.description;
          }
          return $scope.items = data.items;
        }
      });
    };
    $scope.addApplication = function() {
      /*
      Add an application.
      */

      return $victory.setting.addApplication({
        data: {
          name: $scope.name,
          description: $scope.description
        },
        error: function(data, status) {
          if (status === 400 && data) {
            return $scope.errors = data;
          }
        },
        success: function() {
          $scope.name = '';
          $scope.description = '';
          $('.modal.in').modal('hide');
          return $scope.getApplications();
        }
      });
    };
    $scope.updateApplication = function(id) {
      /*
      Update the application.
      */

      var updateItem, x;
      updateItem = ((function() {
        var _j, _len1, _ref, _results;
        _ref = $scope.items;
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          x = _ref[_j];
          if (x.id === id) {
            _results.push(x);
          }
        }
        return _results;
      })())[0];
      return $victory.setting.updateApplication({
        id: id,
        data: {
          name: updateItem.newName,
          description: updateItem.newDescription
        },
        error: function(data, status) {
          if (status === 400 && data) {
            return updateItem.errors = data;
          }
        },
        success: function() {
          $('.modal.in').modal('hide');
          return $scope.getApplications();
        }
      });
    };
    $scope.deleteApplication = function(id) {
      /*
      Delete the application.
      */

      return $victory.setting.deleteApplication({
        id: id,
        success: function() {
          $('.modal.in').modal('hide');
          return $scope.getApplications();
        }
      });
    };
    $scope.inviteUser = function(id, email) {
      /*
      Invite an user into the application.
      */

      return $victory.setting.inviteUser({
        applicationId: id,
        email: email,
        success: function() {
          $('.modal.in').modal('hide');
          return $scope.getApplications();
        }
      });
    };
    return $scope.deleteMenter = function(applicationId, memberId) {
      /*
      Delete the member from the application.
      */

      return $victory.setting.deleteMember({
        applicationId: applicationId,
        memberId: memberId,
        success: function() {
          var application, x;
          application = ((function() {
            var _j, _len1, _ref, _results;
            _ref = $scope.items;
            _results = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              x = _ref[_j];
              if (x.id === applicationId) {
                _results.push(x);
              }
            }
            return _results;
          })())[0];
          return application.members = (function() {
            var _j, _len1, _ref, _results;
            _ref = application.members;
            _results = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              x = _ref[_j];
              if (x.id !== memberId) {
                _results.push(x);
              }
            }
            return _results;
          })();
        }
      });
    };
  });

  c.controller('SettingsUsersCtrl', function($scope, $victory, users) {
    /*
    /settings/users
    */

    $scope.items = users;
    $scope.getUsers = function() {
      /*
      Get users.
      */

      return $victory.setting.getUsers({
        success: function(data) {
          return $scope.items = data.items;
        }
      });
    };
    $scope.addUser = function() {
      /*
      Add an user.
      */

      return $victory.setting.addUser({
        email: $scope.email,
        success: function() {
          $scope.email = '';
          return $scope.getUsers();
        }
      });
    };
    return $scope.deleteUser = function(id) {
      /*
      Delete the user.
      */

      return $victory.setting.deleteUser({
        id: id,
        success: function() {
          var x;
          return $scope.items = (function() {
            var _i, _len, _ref, _results;
            _ref = $scope.items;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              x = _ref[_i];
              if (x.id !== id) {
                _results.push(x);
              }
            }
            return _results;
          })();
        }
      });
    };
  });

  c.controller('SettingsProfileCtrl', function($scope, $victory, profile) {
    /*
    /settings/profile
    */

    $scope.profile = profile;
    $scope.getProfile = function() {
      return $victory.setting.getProfile({
        success: function(data) {
          return $scope.profile = data;
        }
      });
    };
    return $scope.updateProfile = function() {
      return $victory.setting.updateProfile({
        name: $scope.profile.name,
        error: function(data, status) {
          if (status === 400 && data) {
            return $scope.errors = data;
          }
        },
        success: function() {
          return $scope.getProfile();
        }
      });
    };
  });

  c.controller('GroupedDocumentsCtrl', function($scope, $stateParams, documentMode, groupedDocumentsAndApplications) {
    /*
    :scope documentMode: <crashes/exceptions/logs>
    :scope keyword: search keywords
    :scope applications: [{id, name, description,
                        app_key, create_time, is_owner}]
    :scope groupedDocuments: [{group_tag, create_time, name, email, title, description, times}]
    :scope page: {total, index, max, hasPrevious, hasNext}
    */

    $scope.documentMode = documentMode;
    $scope.keyword = $stateParams.keyword ? $stateParams.keyword : '';
    $scope.applications = groupedDocumentsAndApplications.applications;
    $scope.groupedDocuments = groupedDocumentsAndApplications.groupedDocuments;
    $scope.page = groupedDocumentsAndApplications.page;
    $scope.getGroupedDocumentsUrl = function(keyword, index) {
      if (index == null) {
        index = 0;
      }
      /*
      Get the url of grouped documents.
      */

      return "#/applications/" + $scope.selectedApplication.id + "/" + $scope.documentMode + "/grouped/" + keyword + "/" + index;
    };
    $scope.gotoSearchPage = function(keyword, index) {
      if (index == null) {
        index = 0;
      }
      /*
      Goto the search page of grouped documents.
      */

      return location.href = $scope.getGroupedDocumentsUrl(keyword, index);
    };
    $scope.clickGroupedDocument = function(groupedDocument) {
      /*
      Clicked the grouped document row in the table.
      */

      if (groupedDocument.times > 1 || $scope.documentMode === 'crashes') {
        return location.href = "#/applications/" + $scope.selectedApplication.id + "/" + $scope.documentMode + "/" + groupedDocument.group_tag;
      }
    };
    return $scope.modal = function(groupedDocument) {
      /*
      Check the grouped document should show the bootstrap modal window.
      :param groupedDocument: grouped document
      :return: "modal" / ""
      */

      if (groupedDocument.times > 1) {
        return "";
      } else {
        return "modal";
      }
    };
  });

  c.controller('DocumentsCtrl', function($scope, $victory, documentMode, documents) {
    /*
    /applications/<applicationId>/<documentMode>/<groupTag>
    */

    $scope.documentMode = documentMode;
    $scope.documents = documents;
    $victory.application.getApplications({
      success: function(data) {
        return $scope.applications = data.items;
      }
    });
    return $scope.renderDescription = function(document) {
      /*
      Render the description of the document.
      */

      if (document.description) {
        return document.description;
      } else if (document.parameters) {
        return "Parameters: " + document.parameters;
      } else if (document.url) {
        return "URL: " + document.url;
      }
      return "";
    };
  });

  c.controller('CrashDocumentCtrl', function($scope, $victory, documentMode, crash) {
    /*
    /applications/<applicationId>/<documentMode>/<groupTag>
    */

    $scope.documentMode = documentMode;
    $scope.crash = crash;
    return $victory.application.getApplications({
      success: function(data) {
        return $scope.applications = data.items;
      }
    });
  });

}).call(this);
;
// Generated by CoffeeScript 1.6.3
(function() {
  var v;

  v = angular.module('victory.directive', []);

  v.directive('vTooltip', function() {
    /*
    Show the bootstrap tool tip.
    */

    return function(scope, element, attrs) {
      if (attrs.vTooltip) {
        $(element).attr('title', scope.$eval(attrs.vTooltip));
      }
      return $(element).tooltip();
    };
  });

  v.directive('vFocus', function() {
    /*
    Focus this element.
    */

    return function(scope, element, attrs) {
      return $(element).select();
    };
  });

  v.directive('vModal', function() {
    /*
    Find the first input text box then focus it on the bootstrap modal window.
    */

    return function(scope, element, attrs) {
      return $(element).on('shown', function() {
        return $(this).find('input:first').select();
      });
    };
  });

  v.directive('vEnter', function() {
    /*
    Eval the AngularJS expression when pressed `Enter`.
    */

    return function(scope, element, attrs) {
      return element.bind("keydown keypress", function(event) {
        if (event.which === 13) {
          scope.$apply(function() {
            return scope.$eval(attrs.vEnter);
          });
          return event.preventDefault();
        }
      });
    };
  });

  v.directive('vNavigation', function() {
    /*
    Setup the navigation effect.
    */

    return function(scope, element, attrs) {
      var $selected, index, match, noop;
      if ($(element).find('li.select').length > 0) {
        $selected = $(element).find('li.select');
      } else {
        match = location.href.match(/\w\/([/#\w]*)/);
        index = match[1] === '' ? 0 : $(element).find('li a[href*="' + match[1] + '"]').parent().index();
        $selected = $(element).find('li').eq(index);
      }
      $(element).find('li:first').parent().prepend($('<li class="cs_top"></li>'));
      $(element).find('li.cs_top').css({
        width: $selected.css('width'),
        left: $selected.position().left,
        top: $selected.position().top
      });
      noop = function() {};
      $(element).find('li[class!=cs_top]').hover(function() {
        return $(element).find('li.cs_top').each(function() {
          return $(this).dequeue();
        }).animate({
          width: this.offsetWidth,
          left: this.offsetLeft
        }, 420, "easeInOutCubic");
      }, noop());
      $(element).hover(noop(), function() {
        return $(element).find('li.cs_top').each(function() {
          return $(this).dequeue();
        }).animate({
          width: $(element).find('li.select').css('width'),
          left: $(element).find('li.select').position().left
        }, 420, "easeInOutCubic");
      });
    };
  });

}).call(this);
;
// Generated by CoffeeScript 1.6.3
(function() {
  var r;

  r = angular.module('victory.router', ['victory.controller', 'victory.service', 'victory.directive', 'ui.router']);

  r.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    return $rootScope.$stateParams = $stateParams;
  });

  r.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('index', {
      url: '/',
      templateUrl: '/views/empty.html',
      controller: 'IndexCtrl'
    });
    $stateProvider.state('login', {
      url: '/login',
      resolve: {
        title: function() {
          return 'Sign In - ';
        }
      },
      views: {
        viewContent: {
          templateUrl: '/views/login.html',
          controller: 'LoginCtrl'
        }
      }
    });
    $stateProvider.state('settings', {
      url: '/settings',
      templateUrl: '/views/empty.html',
      controller: 'SettingsCtrl'
    });
    $stateProvider.state('settings-applications', {
      url: '/settings/applications',
      resolve: {
        title: function() {
          return 'Applications - Settings - ';
        },
        applications: function($victory) {
          return $victory.setting.getApplications();
        }
      },
      views: {
        viewContent: {
          templateUrl: '/views/settings/applications.html',
          controller: 'SettingsApplicationsCtrl'
        },
        viewMenu: {
          templateUrl: '/views/menu/settings.html',
          controller: 'SettingsMenuCtrl'
        }
      }
    });
    $stateProvider.state('settings-users', {
      url: '/settings/users',
      resolve: {
        title: function() {
          return 'Users - Settings - ';
        },
        users: function($victory) {
          return $victory.setting.getUsers();
        }
      },
      views: {
        viewContent: {
          templateUrl: '/views/settings/users.html',
          controller: 'SettingsUsersCtrl'
        },
        viewMenu: {
          templateUrl: '/views/menu/settings.html',
          controller: 'SettingsMenuCtrl'
        }
      }
    });
    $stateProvider.state('settings-profile', {
      url: '/settings/profile',
      resolve: {
        title: function() {
          return 'Profile - Settings - ';
        },
        profile: function($victory) {
          return $victory.setting.getProfile();
        }
      },
      views: {
        viewContent: {
          templateUrl: '/views/settings/profile.html',
          controller: 'SettingsProfileCtrl'
        },
        viewMenu: {
          templateUrl: '/views/menu/settings.html',
          controller: 'SettingsMenuCtrl'
        }
      }
    });
    $stateProvider.state('grouped-crashes', {
      url: '/crashes/grouped',
      resolve: {
        title: function() {
          return 'Crashes - ';
        },
        documentMode: function() {
          return 'crashes';
        },
        groupedDocumentsAndApplications: function($victory) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'crashes'
          });
        }
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    $stateProvider.state('grouped-crashes-search', {
      url: '/applications/:applicationId/crashes/grouped/:keyword/:index',
      resolve: {
        title: function() {
          return 'Crashes - ';
        },
        documentMode: function() {
          return 'crashes';
        },
        groupedDocumentsAndApplications: function($victory, $stateParams) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'crashes',
            applicationId: $stateParams.applicationId,
            keyword: $stateParams.keyword,
            index: $stateParams.index
          });
        }
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    $stateProvider.state('crash', {
      url: '/applications/:applicationId/crashes/:groupTag',
      resolve: {
        title: function() {
          return 'Crash - ';
        },
        documentMode: function() {
          return 'crashes';
        },
        crash: function($victory, $stateParams) {
          return $victory.document.getCrashDocument({
            applicationId: $stateParams.applicationId,
            groupTag: $stateParams.groupTag
          });
        }
      },
      templateUrl: '/views/documents/crash.html',
      controller: 'CrashDocumentCtrl'
    });
    $stateProvider.state('grouped-exceptions', {
      url: '/exceptions/grouped',
      resolve: {
        title: function() {
          return 'Exceptions - ';
        },
        documentMode: function() {
          return 'exceptions';
        },
        groupedDocumentsAndApplications: function($victory) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'exceptions'
          });
        }
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    $stateProvider.state('grouped-exceptions-search', {
      url: '/applications/:applicationId/exceptions/grouped/:keyword/:index',
      resolve: {
        title: function() {
          return 'Exceptions - ';
        },
        documentMode: function() {
          return 'exceptions';
        },
        groupedDocumentsAndApplications: function($victory, $stateParams) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'exceptions',
            applicationId: $stateParams.applicationId,
            keyword: $stateParams.keyword,
            index: $stateParams.index
          });
        }
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    $stateProvider.state('exceptions', {
      url: '/applications/:applicationId/exceptions/:groupTag',
      resolve: {
        title: function() {
          return 'Exceptions - ';
        },
        documentMode: function() {
          return 'exceptions';
        },
        documents: function($victory, $stateParams) {
          return $victory.document.getDocuments({
            documentMode: 'exceptions',
            applicationId: $stateParams.applicationId,
            groupTag: $stateParams.groupTag
          });
        }
      },
      templateUrl: '/views/documents/list.html',
      controller: 'DocumentsCtrl'
    });
    $stateProvider.state('grouped-logs', {
      url: '/logs/grouped',
      resolve: {
        title: function() {
          return 'Logs - ';
        },
        documentMode: function() {
          return 'logs';
        },
        groupedDocumentsAndApplications: function($victory) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'logs'
          });
        }
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    $stateProvider.state('grouped-logs-search', {
      url: '/applications/:applicationId/logs/grouped/:keyword/:index',
      resolve: {
        title: function() {
          return 'Logs - ';
        },
        documentMode: function() {
          return 'logs';
        },
        groupedDocumentsAndApplications: function($victory, $stateParams) {
          return $victory.document.getGroupedDocumentsAndApplications({
            documentMode: 'logs',
            applicationId: $stateParams.applicationId,
            keyword: $stateParams.keyword,
            index: $stateParams.index
          });
        }
      },
      templateUrl: '/views/documents/grouped.html',
      controller: 'GroupedDocumentsCtrl'
    });
    return $stateProvider.state('logs', {
      url: '/applications/:applicationId/logs/:groupTag',
      resolve: {
        title: function() {
          return 'Logs - ';
        },
        documentMode: function() {
          return 'logs';
        },
        documents: function($victory, $stateParams) {
          return $victory.document.getDocuments({
            documentMode: 'logs',
            applicationId: $stateParams.applicationId,
            groupTag: $stateParams.groupTag
          });
        }
      },
      templateUrl: '/views/documents/list.html',
      controller: 'DocumentsCtrl'
    });
  });

}).call(this);
;
// Generated by CoffeeScript 1.6.3
(function() {
  var s,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  s = angular.module('victory.service', []);

  s.service('$victory', function($http, $rootScope) {
    var application, common, document, pageSize, setting, stupidBrowser, user_agent;
    if (sessionStorage.selectedApplication) {
      $rootScope.selectedApplication = JSON.parse(sessionStorage.selectedApplication);
    }
    $rootScope.user = victory.user;
    NProgress.configure({
      showSpinner: false
    });
    pageSize = 20;
    user_agent = navigator.userAgent.toLowerCase();
    stupidBrowser = user_agent.indexOf('msie') !== -1;
    common = {
      ajax: function(args) {
        var h,
          _this = this;
        if (args == null) {
          args = {};
        }
        /*
        victory ajax function
        :param args: {method, cache, data, error(), success(), beforSend(), hideLoadingAfterDown}
        */

        if (args.method == null) {
          args.method = 'get';
        }
        if (args.cache == null) {
          args.cache = false;
        }
        if (args.data == null) {
          args.data = '';
        }
        if (args.error == null) {
          args.error = function() {};
        }
        if (args.success == null) {
          args.success = function() {};
        }
        if (args.beforeSend) {
          args.beforeSend();
        }
        h = $http({
          url: args.url,
          method: args.method,
          cache: args.ache,
          data: args.data
        });
        h.error(function(data, status, headers, config) {
          _this.message.error(status);
          return args.error(data, status, headers, config);
        });
        return h.success(function(data, status, headers, config) {
          if (data.__status__ === 302 && data.location) {
            location.href = data.location;
            return;
          }
          return args.success(data, status, headers, config);
        });
      },
      message: {
        error: function(status) {
          /*
          pop error message.
          */

          switch (status) {
            case 400:
              return $.av.pop({
                title: 'Input Failed',
                message: 'Please check input values.',
                template: 'error'
              });
            case 403:
              return $.av.pop({
                title: 'Permission denied',
                message: 'Please check your permission.',
                template: 'error'
              });
            default:
              return $.av.pop({
                title: 'Error',
                message: 'Loading failed, please try again later.',
                template: 'error'
              });
          }
        }
      },
      loading: {
        /*
        Show/Hide loading effect.
        */

        on: function() {
          return NProgress.start();
        },
        off: function() {
          return NProgress.done();
        }
      }
    };
    setting = {
      getApplications: function(args) {
        var ajax;
        if (args == null) {
          args = {};
        }
        /*
        Get applications of the settings.
        :param args: {success()}
        */

        ajax = common.ajax({
          url: '/settings/applications',
          success: args.success
        });
        return ajax.then(function(data) {
          return data.data.items;
        });
      },
      addApplication: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Add the application.
        :param args: {data:{name, description}, error(), success()}
        */

        return common.ajax({
          method: 'post',
          url: '/settings/applications',
          data: args.data,
          error: args.error,
          success: args.success
        });
      },
      updateApplication: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Update the application.
        :param args: {id, data:{name, description}, error(), success()}
        */

        return common.ajax({
          method: 'put',
          url: "/settings/applications/" + args.id,
          data: args.data,
          error: args.error,
          success: args.success
        });
      },
      deleteApplication: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Delete the application by id.
        :param args: {id, success()}
        */

        return common.ajax({
          method: 'delete',
          url: "/settings/applications/" + args.id,
          success: args.success
        });
      },
      inviteUser: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Invite the user into the application.
        :param args: {applicationId, email, success()}
        */

        return common.ajax({
          method: 'post',
          url: "/settings/applications/" + args.applicationId + "/members",
          data: {
            email: args.email
          },
          success: args.success
        });
      },
      deleteMember: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Delete the member from the application.
        :param args: {applicationId, memberId, success()}
        */

        return common.ajax({
          method: 'delete',
          url: "/settings/applications/" + args.applicationId + "/members/" + args.memberId,
          success: args.success
        });
      },
      getUsers: function(args) {
        var ajax;
        if (args == null) {
          args = {};
        }
        /*
        Get users of the settings.
        :param args: {success()}
        */

        ajax = common.ajax({
          url: '/settings/users',
          success: args.success
        });
        return ajax.then(function(data) {
          return data.data.items;
        });
      },
      addUser: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Add an user.
        :param args: {email, success()}
        */

        return common.ajax({
          method: 'post',
          url: '/settings/users',
          data: {
            email: args.email
          },
          success: args.success
        });
      },
      deleteUser: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Delete the user by id.
        :param args: {id, success()}
        */

        return common.ajax({
          method: 'delete',
          url: "/settings/users/" + args.id,
          success: args.success
        });
      },
      getProfile: function(args) {
        var ajax;
        if (args == null) {
          args = {};
        }
        /*
        Get the profile.
        :param args: {success()}
        */

        ajax = common.ajax({
          url: '/settings/profile',
          success: args.success
        });
        return ajax.then(function(data) {
          return data.data;
        });
      },
      updateProfile: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Update the profile.
        :param args: {name, error(), success()}
        */

        return common.ajax({
          method: 'put',
          url: '/settings/profile',
          data: {
            name: args.name
          },
          error: args.error,
          success: args.success
        });
      }
    };
    application = {
      getApplications: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Get applications.
        :param args: {success()}
        */

        return common.ajax({
          url: "/applications",
          success: args.success
        });
      }
    };
    document = {
      getGroupedDocumentsAndApplications: function(args) {
        var ajaxApplications, result,
          _this = this;
        if (args == null) {
          args = {};
        }
        /*
        Get grouped documents and applications for GroupedDocumentsCtrl.
        :param args: {documentMode, applicationId, keyword, index}
        :return: {applications, groupedDocuments, page}
        */

        args.applicationId = parseInt(args.applicationId);
        if (args.keyword == null) {
          args.keyword = '';
        }
        if (args.index == null) {
          args.index = 0;
        }
        result = {
          applications: null,
          groupedDocuments: null,
          page: {
            index: 0
          }
        };
        ajaxApplications = common.ajax({
          url: '/applications'
        });
        return ajaxApplications.then(function(data) {
          var ajaxDocuments, x, _ref, _ref1;
          result.applications = data.data.items;
          if (result.applications.length > 0) {
            if (_ref = args.applicationId, __indexOf.call((function() {
              var _i, _len, _ref1, _results;
              _ref1 = result.applications;
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                x = _ref1[_i];
                _results.push(x.id);
              }
              return _results;
            })(), _ref) >= 0) {
              $rootScope.selectedApplication = ((function() {
                var _i, _len, _ref1, _results;
                _ref1 = result.applications;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  x = _ref1[_i];
                  if (x.id === args.applicationId) {
                    _results.push(x);
                  }
                }
                return _results;
              })())[0];
              sessionStorage.selectedApplication = JSON.stringify($rootScope.selectedApplication);
            } else if (!$rootScope.selectedApplication || (_ref1 = $rootScope.selectedApplication.id, __indexOf.call((function() {
              var _i, _len, _ref2, _results;
              _ref2 = result.applications;
              _results = [];
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                x = _ref2[_i];
                _results.push(x.id);
              }
              return _results;
            })(), _ref1) < 0)) {
              $rootScope.selectedApplication = result.applications[0];
              sessionStorage.selectedApplication = JSON.stringify($rootScope.selectedApplication);
            }
            ajaxDocuments = _this.getGroupedDocuments({
              applicationId: $rootScope.selectedApplication.id,
              documentMode: args.documentMode,
              keyword: args.keyword,
              index: args.index
            });
            return ajaxDocuments.then(function(data) {
              result.groupedDocuments = data.data.items;
              result.page = {
                total: data.data.total,
                index: args.index,
                max: (data.data.total - 1) / pageSize,
                hasPrevious: args.index > 0,
                hasNext: (args.index * 1 + 1) * pageSize < data.data.total
              };
              return result;
            });
          } else {
            return result;
          }
        });
      },
      getGroupedDocuments: function(args) {
        if (args == null) {
          args = {};
        }
        /*
        Get grouped documents
        :param args: {applicationId, documentMode, keyword, index success()}
        */

        if (args.keyword == null) {
          args.keyword = '';
        }
        if (args.index == null) {
          args.index = 0;
        }
        return common.ajax({
          url: "/applications/" + $rootScope.selectedApplication.id + "/" + args.documentMode + "/grouped?q=" + args.keyword + "&index=" + args.index,
          success: args.success
        });
      },
      getDocuments: function(args) {
        var ajax;
        if (args == null) {
          args = {};
        }
        /*
        Get documents by the grouped tag.
        :param args: {applicationId, documentMode, groupTag, success()}
        */

        ajax = common.ajax({
          url: "/applications/" + args.applicationId + "/" + args.documentMode + "/" + args.groupTag,
          success: args.success
        });
        return ajax.then(function(data) {
          return data.data.items;
        });
      },
      getCrashDocument: function(args) {
        var ajax;
        if (args == null) {
          args = {};
        }
        /*
        Get the crash document by the grouped tag.
        :param args: {applicationId, groupTag, success()}
        */

        ajax = common.ajax({
          url: "/applications/" + args.applicationId + "/crashes/" + args.groupTag,
          success: args.success
        });
        return ajax.then(function(data) {
          var crash, thread, x, _i, _j, _len, _len1, _ref, _ref1;
          crash = data.data.crash;
          try {
            _ref = crash.report.crash.threads;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              thread = _ref[_i];
              if (thread.backtrace) {
                _ref1 = thread.backtrace.contents;
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  x = _ref1[_j];
                  x.instruction_addr_hex = '0x' + ('00000000' + x.instruction_addr.toString(16)).slice(-8);
                }
              }
            }
          } catch (_error) {}
          try {
            crash.crashedThreads = (function() {
              var _k, _len2, _ref2, _results;
              _ref2 = crash.report.crash.threads;
              _results = [];
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                x = _ref2[_k];
                if (x.crashed) {
                  _results.push(x);
                }
              }
              return _results;
            })();
          } catch (_error) {}
          try {
            crash.threads = (function() {
              var _k, _len2, _ref2, _results;
              _ref2 = crash.report.crash.threads;
              _results = [];
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                x = _ref2[_k];
                if (!x.crashed) {
                  _results.push(x);
                }
              }
              return _results;
            })();
          } catch (_error) {}
          return crash;
        });
      }
    };
    return {
      stupidBrowser: stupidBrowser,
      common: common,
      setting: setting,
      application: application,
      document: document
    };
  });

}).call(this);
;
// Generated by CoffeeScript 1.6.3
(function() {
  var victory;

  victory = {
    userLevel: {
      root: 0,
      normal: 1
    },
    loginUrl: '',
    user: {
      userId: 0,
      level: 1,
      name: null,
      email: null,
      isLogin: false,
      isRoot: function() {
        return victory.user.level === victory.userLevel.root;
      }
    }
  };

  window.victory = victory;

}).call(this);
;