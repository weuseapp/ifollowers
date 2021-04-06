/** layui-admin.std-v1.4.0 LPPL License By https://www.layui.com/layuiadmin/ */
 ;"use strict";layui.define(["table","form","op_common"],function(t){function e(){setCacheData("apiLists",l),setCacheData("apiCreate",d),setCacheData("apiUpdate",o),setCacheData("apiDelete",s)}var a=layui.$,i=layui.table,n=layui.form,l=layui.api.group_get_lists,d=layui.api.group_create,o=layui.api.group_update,s=layui.api.group_delete;n.on("submit(search)",function(t){e(),window.data=t.data,i.reload("lists",{where:t.field,page:{curr:1},done:function(e){initSearchInput(e["extends"],t.field)}})}),a(".op-methods").on("click",function(t){e(),window.data=t.data;var n=a(this).data("type");window[n]&&window[n].call(this,t.data,i.cache["extends"])}),i.on("tool(lists)",function(t){e(),window.data=t.data,window[t.event]&&window[t.event].call(this,t.data,i.cache["extends"])}),i.render({elem:"#lists",url:l,headers:{token:layui.data(layui.setter.tableName).user.token},parseData:function(t){return window.parent.listData=t,checkApiStatusByData(t),getListsFormatByData(t)},cols:[[{type:"checkbox",fixed:"left"},{field:"title",title:"角色名称",minWidth:180,templet:"#tpl_title"},{field:"status",title:"状态",width:80,align:"center",templet:"#tpl_status"},{field:"is_admin",title:"超级管理员",width:100,align:"center",templet:"#tpl_is_admin"},{field:"created_at",title:"创建时间",width:170,align:"center",sort:!0,templet:function(t){return changeUTCTime(t.created_at)}},{title:"操作",width:120,align:"center",fixed:"right",toolbar:"#options"}]],done:function(t){i.cache["extends"]=t["extends"]}}),t("admin_group"),t("const",{STATUS_LOCK:0,STATUS_NORMAL:1,STATUS_PENDING:2})});