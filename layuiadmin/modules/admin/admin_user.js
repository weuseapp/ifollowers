/** layui-admin.std-v1.4.0 LPPL License By https://www.layui.com/layuiadmin/ */
 ;"use strict";layui.define(["table","form","op_common"],function(t){function e(){setCacheData("apiLists",n),setCacheData("apiCreate",d),setCacheData("apiUpdate",s),setCacheData("apiDelete",o)}var a=layui.$,i=(layui.admin,layui.table),l=layui.form,n=layui.api.user_get_admin_lists,d=layui.api.user_create_admin,s=layui.api.user_update_admin,o=layui.api.user_delete_admin;l.on("submit(search)",function(t){e(),window.data=t.data,i.reload("lists",{where:t.field,page:{curr:1},done:function(t){}})}),a(".op-methods").on("click",function(t){e(),window.data=t.data;var l=a(this).data("type");window[l]&&window[l].call(this,t.data,i.cache["extends"])}),i.on("tool(lists)",function(t){e(),window.data=t.data,window[t.event]&&window[t.event].call(this,t.data,i.cache["extends"])}),window.log_lists=function(t){layer.open({type:2,title:"详细",content:layui.setter.vhtml+"admin/user/log-list.html?id="+t.id,maxmin:!0,area:["70%","70%"]})},i.render({elem:"#lists",url:n,headers:{token:layui.data(layui.setter.tableName).user.token},parseData:function(t){return window.parent.listData=t,checkApiStatusByData(t),getListsFormatByData(t)},cols:[[{type:"checkbox",fixed:"left"},{field:"id",width:100,title:"ID",sort:!0},{field:"avatar",title:"头像",width:60,align:"center",templet:"#tpl_images"},{field:"username",title:"用户名",minWidth:100},{field:"nickname",title:"昵称",minWidth:100},{field:"group_title",title:"权限组"},{field:"is_admin",title:"超级管理",align:"center",width:90,templet:function(t){return t.is_admin?'<span class="layui-badge layui-bg-blue">是</span>':'<span class="layui-badge layui-bg-gray">否</span>'}},{field:"email",title:"邮箱"},{field:"status",title:"状态",templet:"#tpl_status",align:"center"},{field:"updated_at",title:"更新时间",width:165,sort:!0,templet:function(t){return changeUTCTime(t.updated_at)}},{field:"last_login_at",title:"最近登录",width:165,sort:!0},{title:"操作",width:195,align:"center",fixed:"right",toolbar:"#options"}]],page:!0,limit:20,done:function(t){i.cache["extends"]=t["extends"],renderMsgImagesV2("tpl_images")}}),t("admin_user"),t("const",{STATUS_LOCK:0,STATUS_NORMAL:1})});