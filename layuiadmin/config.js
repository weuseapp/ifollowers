/** layui-admin.std-v1.4.0 LPPL License By https://www.layui.com/layuiadmin/ */
 ;"use strict";var _base=layui.cache.base;layui.config({base:"/layuiadmin/"}).extend({env:"env"}).define(["laytpl","layer","element","util","env"],function(e){layui.config({base:_base}),e("setter",{container:"app",base:layui.cache.base,baseUrl:layui.env.ADMIN_URL,apiUrl:layui.env.API_URL,views:layui.cache.base+"tpl/",vhtml:"/views/",entry:"index",engine:".html",pageTabs:!0,name:"weuse",tableName:"weuse",MOD_NAME:"admin",debug:!1,request:{token:"token",expire_time:"expire_time",refresh_token:"refresh_token",refresh_time:"refresh_time"},response:{statusName:"code",statusCode:{ok:0,logout:1001},msgName:"message",dataName:"data"},extend:["echarts","echartsTheme","xmSelect"],theme:{color:[{main:"#20222A",selected:"#009688",alias:"default"},{main:"#03152A",selected:"#3B91FF",alias:"dark-blue"},{main:"#2E241B",selected:"#A48566",alias:"coffee"},{main:"#50314F",selected:"#7A4D7B",alias:"purple-red"},{main:"#344058",logo:"#1E9FFF",selected:"#1E9FFF",alias:"ocean"},{main:"#3A3D49",logo:"#2F9688",selected:"#5FB878",alias:"green"},{main:"#20222A",logo:"#F78400",selected:"#F78400",alias:"red"},{main:"#28333E",logo:"#AA3130",selected:"#AA3130",alias:"fashion-red"},{main:"#24262F",logo:"#3A3D49",selected:"#009688",alias:"classic-black"},{logo:"#226A62",header:"#2F9688",alias:"green-header"},{main:"#344058",logo:"#0085E8",selected:"#1E9FFF",header:"#1E9FFF",alias:"ocean-header"},{header:"#393D49",alias:"classic-black-header"},{main:"#50314F",logo:"#50314F",selected:"#7A4D7B",header:"#50314F",alias:"purple-red-header"},{main:"#28333E",logo:"#28333E",selected:"#AA3130",header:"#AA3130",alias:"fashion-red-header"},{main:"#28333E",logo:"#009688",selected:"#009688",header:"#009688",alias:"green-header"}],initColorIndex:0}});var _=layui.setter.apiUrl+"/weuse/admin";e("api",{login:_+"/user/login",logout:_+"/user/logout",refresh_token:_+"/user/refresh_token",get_captcha:_+"/user/get_captcha",user_get_user_lists:_+"/user/get_user_lists",user_get_user_details:_+"/user/get_user_details",user_get_user_logs:_+"/user/get_user_logs",user_get_admin_lists:_+"/user/get_admin_lists",user_get_admin_details:_+"/user/get_admin_details",user_get_admin_logs:_+"/user/get_admin_logs",user_create_admin:_+"/user/create_admin",user_update_admin:_+"/user/update_admin",user_update_admin_pwd:_+"/user/update_admin_pwd",user_update_user:_+"/user/update_user",user_delete_admin:_+"/user/delete_admin",user_get_user_account:_+"/user/get_user_account",user_get_user_account_list:_+"/user/get_user_account_list",user_update_user_account:_+"/user/update_user_account",update_user_status:_+"/user/update_user_status",user_ban:_+"/user/ban",devices_get_device_lists:_+"/devices/get_device_lists",devices_get_device_lock_lists:_+"/devices/get_device_lock_lists",devices_delete_device_lock:_+"/devices/delete_device_lock",allow_device:_+"/devices/update_lock_device",menu_get_menu_lists:_+"/menu/get_menu_lists",menu_create_menu:_+"/menu/create_menu",menu_update_menu:_+"/menu/update_menu",menu_delete_menu:_+"/menu/delete_menu",group_get_lists:_+"/group/get_lists",group_create:_+"/group/create",group_update:_+"/group/update",group_delete:_+"/group/delete",group_params:_+"/group/get_params",settings_get_config_lists:_+"/settings/get_config_lists",settings_create_config:_+"/settings/create_config",settings_update_config:_+"/settings/update_config",settings_delete_config:_+"/settings/delete_config",settings_get_third_config_lists:_+"/settings/get_third_config_lists",settings_create_third_config:_+"/settings/create_third_config",settings_update_third_config:_+"/settings/update_third_config",settings_delete_third_config:_+"/settings/delete_third_config",settings_get_third_addmaxfans_lists:_+"/settings/get_third_addmaxfans_lists",reward_setting:{praise_reward:_+"/reward_setting/praise_reward"},pay_config_get_pay_config_lists:_+"/pay_config/get_pay_config_lists",pay_config_create_pay_config:_+"/pay_config/create_pay_config",pay_config_update_pay_config:_+"/pay_config/update_pay_config",pay_config_delete_pay_config:_+"/pay_config/delete_pay_config",push_config_get_push_config_lists:_+"/push_config/get_push_config_lists",push_config_create_push_config:_+"/push_config/create_push_config",push_config_update_push_config:_+"/push_config/update_push_config",push_config_delete_push_config:_+"/push_config/delete_push_config",promotion_get_lists:_+"/popularize",promotion_create_lists:_+"/popularize",promotion_get_details_lists:_+"/popularize",promotion_update_lists:_+"/popularize",promotion_delete_lists:_+"/delete_popularize",faq_get_faq_lists:_+"/faq/get_faq_lists",faq_create_faq:_+"/faq/create_faq",faq_update_faq:_+"/faq/update_faq",faq_delete_faq:_+"/faq/delete_faq",time_limited_get_lists:_+"/time_limited/get_lists",time_limited_create:_+"/time_limited/create",time_limited_update:_+"/time_limited/update",time_limited_delete:_+"/time_limited/delete",third_get_ig_fans:_+"/third/get_ig_fans",third_update_ig_fans:_+"/third/update_ig_fans",analysis_console:_+"/analysis/console",analysis_get_flow_analysis:_+"/analysis/get_flow_analysis",analysis_get_install_analysis:_+"/analysis/get_install_analysis",apps_get_apps_lists:_+"/apps/get_apps_lists",apps_create_app:_+"/apps/create_app",apps_update_app:_+"/apps/update_app",apps_delete_app:_+"/apps/delete_app",apps_get_apps_params:_+"/apps/get_apps_params",select_app_name:_+"/apps/select_app",products_get_products_lists:_+"/products/get_products_lists",products_create_product:_+"/products/create_product",products_update_product:_+"/products/update_product",products_delete_product:_+"/products/delete_product",products_export_product:_+"/products/export_product",products_import_product:_+"/products/import_product",products_download_excel:_+"/products/download_example",products_export_excel:_+"/products/export_product",products:{random:{list:_+"/products_random/get_list",create:_+"/products_random/create","delete":_+"/products_random/delete","import":_+"/products_random/import","export":_+"/products_random/export",download_example:_+"/products_random/download_example"}},orders_get_order_lists:_+"/orders/get_order_lists",tasks_get_task_lists:_+"/tasks/get_task_lists",tasks_create_task:_+"/tasks/create_task",tasks_update_task:_+"/tasks/update_task",tasks_transfer_third:_+"/tasks/transfer_third",tasks_task_detail:_+"/tasks/task_detail",tasks_task_setting:_+"/tasks/task_setting",feedback_get_feedback_lists:_+"/feedback/get_feedback_lists",feedback_get_ticket_lists:_+"/feedback/get_ticket_lists",feedback_reply_ticket:_+"/feedback/reply_ticket",feedback_get_feedback_details:_+"/feedback/get_feedback_details",feedback_get_ticket_details:_+"/feedback/get_ticket_details",feedback_update_ticket:_+"/feedback/update_ticket",uploadImg:_+"/upload/image",cookie_pool_base_info:_+"/cookie_pool/get_cookie_pool_info",cookie_pool_top_search:_+"/cookie_pool/get_cookie_pool_top_search",cookie_pool_echarts_info:_+"/cookie_pool/get_cookie_pool_echarts_info",cookie_pool_error_info:_+"/cookie_pool/get_cookie_pool_error",cookie_pool_user_log:_+"/cookie_pool/get_user_log",cookie_pool_user_request:_+"/cookie_pool/get_user_request",cookie_pool_get_user_list:_+"/cookie_pool/get_user_list",cookie_pool_update_user:_+"/cookie_pool/update_user",cookie_pool_create_user:_+"/cookie_pool/create_user",cookie_pool_delete_user:_+"/cookie_pool/delete_user",cookie_pool_get_proxy_ip_list:_+"/cookie_pool/get_proxy_ip_list",cookie_pool_update_proxy_ip:_+"/cookie_pool/update_proxy_ip",cookie_pool_create_proxy_ip:_+"/cookie_pool/create_proxy_ip",cookie_pool_delete_proxy_ip:_+"/cookie_pool/delete_proxy_ip",cookie_pool_export_user:_+"/cookie_pool/export_user",cookie_pool_export_proxy_ip:_+"/cookie_pool/export_proxy_ip",cookie_pool_import_proxy_ip:_+"/cookie_pool/import_proxy_ip",cookie_pool_import_user:_+"/cookie_pool/import_user",cookie_pool_download_excel_template:_+"/cookie_pool/download_excel_template"}),e("code",{USER_FORBIDDEN:-3,CODE_NOT_EXIST:-2,SYSTEM_ERROR:-1,NO_ERROR:0,APP_DISABLE:10001,APP_IS_EXIST:10002,APP_NOT_EXIST:10003,APP_IS_RUNNING:10004,APP_IS_AUTH:10005,APP_NOT_AUTH:10006,AUTH_SUCCESS:10007,AUTH_FAILED:10008,SIGN_ERROR:10009,KEY_ERROR:10010,SECRET_ERROR:10011,ENCODE_ERROR:10012,DECODE_ERROR:10013,DECODE_DATA_ILLEGAL:10014,PARAMS_ERROR:10015,PARAMS_ILLEGAL:10016,PARAMS_MISSING:10017,PARAMS_INVALID:10018,SYSTEM_BUSY:10019,SYSTEM_UPGRADE:10020,VERIFY_ERROR:10021,FORMAT_ERROR:10022,CREATE_ERROR:10023,UPDATE_ERROR:10024,QUERY_ERROR:10025,DELETE_ERROR:10026,INIT_ERROR:10027,RECORD_IS_EXIST:10028,RECORD_NOT_EXIST:10029,RECORD_IS_DELETE:10030,RECORD_IS_UPDATE:10031,OPERATION_TIMEOUT:10032,OPERATION_TOO_FAST:10033,OPERATION_ILLEGAL:10034,AUTH_IS_EXPIRE:10035,SIGN_IS_EXPIRE:10036,ENCODE_IS_EXPIRE:10037,TOKEN_IS_EXPIRE:10038,REFRESH_TOKEN_IS_EXPIRE:10039,MSG_IS_SEND:10040,OPERATION_FAILED:10041,USER_NOT_REG:20001,USER_IS_REG:20002,USER_NOT_LOGIN:20003,USER_IS_LOGIN:20004,USER_IS_EXIST:20005,USER_NOT_EXIST:20006,USER_PWD_ERROR:20007,USER_EMAIL_VERIFY_SUC:20008,USER_EMAIL_VERIFY_ERROR:20009,USER_EMAIL_IS_USED:20010,USER_EMAIL_NOT_VERIFY:20011,USER_EMAIL_IS_VERIFY:20012,USER_EMAIL_FORMAT_ERROR:20013,USER_PWD_IS_SIMPLE:20014,USER_EMAIL_VERIFY_SUC_STR:20015,USER_LOGIN_EXPIRE:20016,USER_CAPTCHA_ERROR:20017,USER_CANNOT_UNSEALED:20018,ORDER_CREATE_ERROR:40001,ORDER_VERIFY_ERROR:40002,ORDER_PAY_ERROR:40003,ORDER_IS_CANCEL:40004})});