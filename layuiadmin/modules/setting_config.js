/** layui-admin.std-v1.4.0 LPPL License By https://www.layui.com/layuiadmin/ */
 ;"use strict";layui.define(["table","form","op_common"],function(e){function t(){setCacheData("apiLists",l),setCacheData("apiCreate",o),setCacheData("apiUpdate",d),setCacheData("apiDelete",s)}var i=layui.$,a=(layui.admin,layui.table),n=layui.form,l=layui.api.settings_get_config_lists,o=layui.api.settings_create_config,d=layui.api.settings_update_config,s=layui.api.settings_delete_config;n.on("submit(search)",function(e){t(),window.data=e.data,a.reload("lists",{where:e.field,page:{curr:1},done:function(t){initSearchInput(t["extends"],e.field)}})}),i(".op-methods").on("click",function(e){t(),window.data=e.data;var l=i(this).data("type");return"create"===l?(renderSelect("type","type",a.cache["extends"].type,isEmpty(e.data)?null:e.data.type),i("#form")[0].reset(),n.render(null,"editForm"),void layer.open({type:1,title:"添加平台配置",content:i("#form_tpl"),maxmin:!0,area:["70%","70%"],btn:["确定","取消"],yes:function(e,t){t.find("#create").trigger("click"),layer.close(e)}})):void(window[l]&&window[l].call(this,e.data,a.cache["extends"]))}),a.on("tool(lists)",function(e){return t(),window.data=e.data,"update"===e.event?(renderSelect("type","type",a.cache["extends"].type,isEmpty(e.data)?null:e.data.type),n.val("editForm",e.data),void layer.open({type:1,title:"编辑平台配置",content:i("#form_tpl"),maxmin:!0,area:["70%","70%"],btn:["确定","取消"],yes:function(e,t){t.find("#update").trigger("click"),layer.close(e)}})):void(window[e.event]&&window[e.event].call(this,e.data,a.cache["extends"]))}),n.on("submit(update)",function(e){e.field.hasOwnProperty("is_open")||(e.field.is_open="0"),ajaxRequestV2(d,"post",e.field,function(e){0===e.code?(layer.msg(e.msg,{icon:1,time:1e3}),a.reload("lists")):layer.msg(e.msg,{icon:2,time:1e3})})}),n.on("submit(create)",function(e){e.field.hasOwnProperty("is_open")||(e.field.is_open="0"),ajaxRequestV2(o,"post",e.field,function(e){0===e.code?(layer.msg(e.msg,{icon:1,time:1e3}),a.reload("lists")):layer.msg(e.msg,{icon:2,time:1e3})})}),a.render({elem:"#lists",url:l,headers:{token:layui.data(layui.setter.tableName).user.token},parseData:function(e){return window.parent.listData=e,checkApiStatusByData(e),getListsFormatByData(e)},cols:[[{type:"checkbox",fixed:"left"},{field:"id",width:90,title:"ID",sort:!0},{field:"name",title:"名称"},{field:"description",title:"描述"},{field:"config_key",title:"键"},{field:"config_value",title:"值"},{field:"type",title:"配置值类型"},{field:"created_at",title:"创建时间",sort:!0,templet:function(e){return changeUTCTime(e.created_at)}},{field:"updated_at",title:"更新时间",sort:!0,templet:function(e){return changeUTCTime(e.updated_at)}},{title:"操作",width:120,align:"center",fixed:"right",toolbar:"#options"}]],page:!0,limit:20,done:function(e){a.cache["extends"]=e["extends"]}}),e("setting_config",{})});