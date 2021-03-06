/** layui-admin.std-v1.4.0 LPPL License By https://www.layui.com/layuiadmin/ */
 ;"use strict";layui.define(function(e){var a=layui.$,i=layui.table;window.create=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;layer.open({type:2,title:"添加",content:"form.html",maxmin:!0,area:["70%","70%"],btn:["确定","取消"],yes:debounce(function(e){var a=e[0],t=e[1],n=window["layui-layer-iframe"+a],d="submit",r=t.find("iframe").contents().find("#"+d);n.layui.form.on("submit("+d+")",function(e){var t={};if(getCacheData("apiCreate")===layui.api.promotion_create_lists){for(var n=getCacheData("languagesArr"),d=[],r=0;r<n.length;r++){var l={language:n[r].language,title:e.field[n[r].title],description:e.field[n[r].description]};d.push(l)}t={id:e.field.id,action:e.field.action,title:e.field.title,description:e.field.description,logo:getCacheData("uploadImg"),official_app_url:e.field.official_app_url,third_app_url:e.field.third_app_url,package_name:e.field.package_name,activity_name:e.field.activity_name,order:e.field.order,status:e.field.status,platform:e.field.platform,coin:e.field.coin,languages:JSON.stringify(d)};var o=/apps/;for(var f in e.field)o.test(f)&&(t[f]=e.field[f]);e.field=t}ajaxRequestV2(getCacheData("apiCreate"),"post",e.field,function(e){void 0===checkApiStatusByData(e)&&(0===e.code?(layer.msg(e.msg,{icon:1,time:1e3}),layer.close(a),i.reload("lists")):layer.msg(e.msg,{icon:2,time:1e3}))})}),r.trigger("click")},200),success:function(i){window[i.find("iframe")[0].name].a_data={data:e,extend:a},i.find("iframe").contents().find("input").removeAttr("disabled")}})},window.details=function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;layer.open({type:2,title:"详细",content:"details.html",maxmin:!0,area:["70%","70%"],success:function(t){window[t.find("iframe")[0].name].a_data={data:e,extend:i},ajaxRequestV2(getCacheData("apiDetails"),"get",{id:e.id},function(e){return 0!==e.code?(layer.msg(e.msg,{icon:2,time:1e3}),!1):void a.each(e.data,function(e,a){var i="[name="+e+"]";if(length=t.find("iframe").contents().find(i).length,0===length)return!0;var n=t.find("iframe").contents().find(i)[0].type;"text"===n?t.find("iframe").contents().find(i).val(a):"avatar"===e?t.find("iframe").contents().find(i).src=a:t.find("iframe").contents().find(i).text(a)})})}})},window.update=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;layer.open({type:2,title:"编辑",content:"form.html",maxmin:!0,area:["70%","70%"],btn:["确定","取消"],yes:debounce(function(e){var a=e[0],t=e[1],n=window["layui-layer-iframe"+a].layui.form,d=t.find("iframe").contents().find("#submit");n.on("submit(submit)",function(e){var t={};if(getCacheData("apiCreate")===layui.api.promotion_create_lists){for(var n=getCacheData("languagesArr"),d=[],r=0;r<n.length;r++){var l={language:n[r].language,title:e.field[n[r].title],description:e.field[n[r].description]};d.push(l)}t={id:e.field.id,action:e.field.action,title:e.field.title,description:e.field.description,logo:getCacheData("uploadImg"),official_app_url:e.field.official_app_url,third_app_url:e.field.third_app_url,package_name:e.field.package_name,activity_name:e.field.activity_name,order:e.field.order,status:Number(e.field.status),platform:e.field.platform,coin:e.field.coin,languages:JSON.stringify(d)};var o=/apps/;for(var f in e.field)o.test(f)&&(t[f]=e.field[f]);e.field=t}var c=e.field;for(var s in c)parent.window.parent["edit_"+s]&&(c[s]=window["layui-layer-iframe"+a].layui.layedit.getContent(parent.window.parent["edit_"+s])),checkIsDateFormat(c[s])&&(c[s]=changeUTCTime(c[s],!0));return ajaxRequestV2(getCacheData("apiUpdate"),"post",c,function(e){void 0===checkApiStatusByData(e)&&(0===e.code?(layer.msg(e.msg,{icon:1,time:1e3}),layer.close(a),i.reload("lists")):layer.msg(e.msg,{icon:2,time:2e3}))}),!1}),d.trigger("click")},200),success:function(i){window[i.find("iframe")[0].name].a_data={},window[i.find("iframe")[0].name].a_data.data=e,window[i.find("iframe")[0].name].a_data.extend=t,setCacheData("updateData",e),setCacheData("updateExtend",t),a.each(e,function(e,t){var n="[name='"+e+"']",d=i.find("iframe").contents().find(n).length;if(0===d)return!0;var r=i.find("iframe").contents().find(n)[0].type;if("checkbox"===r&&"object"==typeof t)a.each(t,function(e,a){i.find("iframe").contents().find(n).eq(a).attr("checked",!0)});else if("checkbox"===r)t&&i.find("iframe").contents().find(n).attr("checked",!0);else if("password"===r);else if("radio"===r){var l=i.find("iframe").contents().find(n);a.each(l,function(e){l[e].value==t&&i.find("iframe").contents().find(n+("[value="+t+"]")).prop("checked",!0)})}else checkIsDateFormat(t)&&(t=changeUTCTime(t)),i.find("iframe").contents().find(n).val(t)})}})},window.deleteOne=function(e){arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;layer.confirm("确定删除",function(a){ajaxRequestV2(getCacheData("apiDelete"),"post",{ids:e.id},function(e){void 0===checkApiStatusByData(e)&&(layer.msg(e.msg,{icon:0===e.code?1:2,time:1e3}),layer.close(a),i.reload("lists"))})})},window.deleteMulti=function(e){var a=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i.checkStatus("lists").data);return 0===a.length?layer.msg("请选择数据"):void layer.confirm("确定删除吗？",function(e){var t=a.map(function(e){return e.id});ajaxRequestV2(getCacheData("apiDelete"),"post",{ids:t},function(a){void 0===checkApiStatusByData(a)&&(layer.msg(a.msg,{icon:0===a.code?1:2,time:1e3}),layer.close(e),i.reload("lists"))})})},e("op_common",{verifyField:function(e){var i={};return a.each(e,function(e,a){""!==a&&(i[e]=a)}),i}})});