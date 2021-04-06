/** layui-admin.std-v1.4.0 LPPL License By https://www.layui.com/layuiadmin/ */
 ;"use strict";layui.define(["table","form","op_common","upload"],function(t){function e(){setCacheData("apiGet",l),setCacheData("apiUpdate",d),setCacheData("apiDelete",r),setCacheData("apiCreate",s),setCacheData("apiImport",p),setCacheData("apiExport",u),setCacheData("apiDownload",c)}var a=layui.table,i=layui.form,o=layui.$,n=layui.upload,l=layui.api.cookie_pool_get_proxy_ip_list,d=layui.api.cookie_pool_update_proxy_ip,r=layui.api.cookie_pool_delete_proxy_ip,s=layui.api.cookie_pool_create_proxy_ip,c=layui.api.cookie_pool_download_excel_template+"?type=proxy_ip",p=layui.api.cookie_pool_import_proxy_ip,u=layui.api.cookie_pool_export_proxy_ip;i.on("submit(search)",function(t){e(),window.data=t.data,a.reload("lists",{where:t.field,page:{curr:1},done:function(t){}})}),o(".op-methods").on("click",function(t){e();var i=o(this).data("type");if("create"===i){var n=getUrlParams(location.search);t.data=t.data?t.data:{},t.data.app_id=n.app_id}window.data=t.data,window[i](t.data,a.cache["extends"])}),a.on("tool(lists)",function(t){e(),window.data=t.data,window[t.event]&&window[t.event].call(this,t.data,a.cache["extends"])}),a.render({elem:"#lists",url:l,headers:{token:layui.data(layui.setter.tableName).user.token},parseData:function(t){return window.parent.listData=t,checkApiStatusByData(t),getListsFormatByData(t)},cols:[[{type:"checkbox",fixed:"left"},{field:"id",width:70,title:"ID",sort:!0,align:"center"},{field:"ip",title:"IP",width:150,align:"center"},{field:"port",title:"端口",align:"center"},{field:"user",title:"认证账号",align:"center"},{field:"password",title:"认证密码",align:"center"},{field:"fail_num",title:"连续失败次数",align:"center"},{field:"type",title:"类型"},{field:"country",title:"归属地",align:"center"},{field:"status",title:"状态",width:80,align:"center",toolbar:"#status1"},{field:"time",title:"代理速度(ms)",width:130},{field:"created_at",title:"创建时间",width:170,sort:!0,templet:function(t){return changeUTCTime(t.created_at)}},{field:"updated_at",title:"最后一次更新时间",width:170,sort:!0,fixed:"right",templet:function(t){return changeUTCTime(t.updated_at)}},{title:"操作",width:120,align:"center",fixed:"right",toolbar:"#options"}]],page:!0,limit:20,done:function(){initSearchInput()}}),window.details=function(t){layer.open({type:2,title:"详细",content:"detail.html?data="+t.id,maxmin:!0,area:["70%","70%"]})},window.initSearchInput=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};renderSelect("status","status",{0:"停用",1:"正常"},t.status),renderSelect("type","type",{socks5:"socks5",http:"http"},t.status),i.render()},window.download_example=function(){window.location.href=c},window.export_data=function(){var t=o("#status").val(),e=a.checkStatus("lists").data.map(function(t){return t.id}).join(",");window.location.href=u+"?status="+t+"&ids="+e},window.start=function(t){layer.confirm("确定启用吗",function(e){ajaxRequestV2(getCacheData("apiUpdate"),"post",{id:t.id,status:1},function(t){layer.msg(t.msg,{icon:0===t.code?1:2,time:1e3}),layer.close(e),a.reload("lists")})})},window.stop=function(t){layer.confirm("确定停用吗",function(e){ajaxRequestV2(getCacheData("apiUpdate"),"post",{id:t.id,status:0},function(t){layer.msg(t.msg,{icon:0===t.code?1:2,time:1e3}),layer.close(e),a.reload("lists")})})},n.render({elem:"#import_data",url:p,accept:"file",auto:!0,headers:{token:layui.data(layui.setter.tableName).user.token},size:10240,done:function(t){if(0!==t.code)layer.msg(t.msg);else{var e=t.data.invalid.length,i=t.data.all.length,o=t.data.insert.length,n=t.data.update.length,l=o+n;layer.msg("文件上传成功，上传用户数："+i+"，有效用户数："+l+"，新增用户数："+o+"，更新用户数："+n+"，无效用户数："+e),a.reload("lists")}},error:function(){layer.msg("上传失败")}}),t("cookie_pool_proxy_ip"),t("const",{STATUS_NORMAL:1,STATUS_STOP:0})});