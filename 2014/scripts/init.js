!function(e,t){"use strict";var a=t,r=e;r.Rplus={ele:{html:a.documentElement,head:a.head||a.getElementsByTagName("head")[0]},ready:function(e){"loading"!==a.readyState?e():a.addEventListener("DOMContentLoaded",e)},ajaxGet:function(e,t){var a=new XMLHttpRequest;a.open("GET",e,!0),a.send(),"function"==typeof t&&(a.onload=function(){t({data:a.responseText})})},getFBInfo:function(e){for(var t=function(t){return{arr:t.match(/(?!\s)\w+?=".+?"/g),obj:{parentId:e.id,oriString:t.trim(),oriAttr:{},tag:t.match(/^\s*?<(\w+?)\s/)[1]}}}(e.firstChild.data),a=t.arr.length;a;)a--,t._tmpArr=t.arr[a].match(/(\w+?)="(.+?)"/),t.obj.oriAttr[t._tmpArr[1]]=t._tmpArr[2];return t.obj},injectInline:function(e,t){e.sourceAttr={link:"href",img:"src"}[e.tag],e.sourceUrl=e.oriAttr[e.sourceAttr],e.ext=e.sourceUrl.split(".").pop();var r=e.sourceUrl.split("/").pop(),o="svg"===e.ext,l=localStorage.getItem(r),s=function(r){var o=a.createElement("div");if(o.innerHTML=r,"loading"!==a.readyState&&"link"!==e.tag){var l=t&&t.insertBefore||a.body.childNodes[0];a.body.insertBefore(o,l)}else n.ele.head.appendChild(o)};n.hasCache&&l?s(l):t&&t.insertTag?s(e.oriString):n.ajaxGet(e.sourceUrl,function(e){var a=e.data;o||(a="<style>"+a+"</sctyle>"),localStorage.setItem(r,a),t&&t.cacheOnly||s(a)})}};var n=r.Rplus||{};n.ready(function(){n.ele.body=a.body||a.getElementsByTagName("body")[0]}),function(e,t){var a=e.getAttribute("data-"+t),r=localStorage.getItem(t),o=r===a;o&&"#clear"!==location.hash?n.hasCache=!0:(n.hasCache=!1,localStorage.clear(),localStorage.setItem(t,a))}(a.getElementById("js-version"),"version"),function(e,t){var r=localStorage.getItem(t);if(n.hasCache&&r)e.html.className=r;else{e.html.className=e.html.className.replace(/\bno-js\b/,"js");var o=a.createElement("script");o.src="//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js",o.addEventListener("load",function(){localStorage.setItem(t,e.html.className)}),e.head.appendChild(o)}}(n.ele,"modernizrAllClass"),n.injectInline(n.getFBInfo(a.getElementById("js-main-style")),{insertTag:!0})}(window,document);