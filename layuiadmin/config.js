layui.define(['laytpl', 'layer', 'element', 'util'], function (exports) {
    layui.config({
        base: '/layuiadmin/'
    }).use('env', function () {
        const env = layui.env;
        exports('setter', {
            container: 'app', //容器ID
            base: layui.cache.base, //记录静态资源所在路径
            baseUrl: layui.env.ADMIN_URL,
            apiUrl: layui.env.API_URL,
            views: layui.cache.base + 'tpl/', //动态模板所在目录
            vhtml: '/views/',
            entry: 'index', //默认视图文件名
            engine: '.html', //视图文件后缀名
            pageTabs: true, //是否开启页面选项卡功能。iframe版推荐开启的
            name: 'weuse',
            tableName: 'weuse', //本地存储表名
            MOD_NAME: 'admin', //模块事件名
            debug: false, //是否开启调试模式。如开启，接口异常时会抛出异常 URL 等信息
            //自定义请求字段 自动携带的字段名（如：access_token）。可设置 false 不携带。
            request: {
                token: 'token',
                expire_time: 'expire_time',
                refresh_token: 'refresh_token',
                refresh_time: 'refresh_time',
            },

            //自定义响应字段
            response: {
                statusName: 'code', //数据状态的字段名称
                statusCode: {
                    ok: 0, //数据状态一切正常的状态码
                    logout: 1001, //登录状态失效的状态码
                },
                msgName: 'message', //状态信息的字段名称
                dataName: 'data', //数据详情的字段名称
            },

            //扩展的第三方模块
            extend: [
                'echarts', // echarts 核心包
                'echartsTheme', // echarts 主题
                'xmSelect',
            ],

            //主题配置
            theme: {
                //内置主题配色方案
                color: [{
                    main: '#20222A' //主题色
                    ,
                    selected: '#009688' //选中色
                    ,
                    alias: 'default' //默认别名
                }, {
                    main: '#03152A',
                    selected: '#3B91FF',
                    alias: 'dark-blue' //藏蓝
                }, {
                    main: '#2E241B',
                    selected: '#A48566',
                    alias: 'coffee' //咖啡
                }, {
                    main: '#50314F',
                    selected: '#7A4D7B',
                    alias: 'purple-red' //紫红
                }, {
                    main: '#344058',
                    logo: '#1E9FFF',
                    selected: '#1E9FFF',
                    alias: 'ocean' //海洋
                }, {
                    main: '#3A3D49',
                    logo: '#2F9688',
                    selected: '#5FB878',
                    alias: 'green' //墨绿
                }, {
                    main: '#20222A',
                    logo: '#F78400',
                    selected: '#F78400',
                    alias: 'red' //橙色
                }, {
                    main: '#28333E',
                    logo: '#AA3130',
                    selected: '#AA3130',
                    alias: 'fashion-red' //时尚红
                }, {
                    main: '#24262F',
                    logo: '#3A3D49',
                    selected: '#009688',
                    alias: 'classic-black' //经典黑
                }, {
                    logo: '#226A62',
                    header: '#2F9688',
                    alias: 'green-header' //墨绿头
                }, {
                    main: '#344058',
                    logo: '#0085E8',
                    selected: '#1E9FFF',
                    header: '#1E9FFF',
                    alias: 'ocean-header' //海洋头
                }, {
                    header: '#393D49',
                    alias: 'classic-black-header' //经典黑头
                }, {
                    main: '#50314F',
                    logo: '#50314F',
                    selected: '#7A4D7B',
                    header: '#50314F',
                    alias: 'purple-red-header' //紫红头
                }, {
                    main: '#28333E',
                    logo: '#28333E',
                    selected: '#AA3130',
                    header: '#AA3130',
                    alias: 'fashion-red-header' //时尚红头
                }, {
                    main: '#28333E',
                    logo: '#009688',
                    selected: '#009688',
                    header: '#009688',
                    alias: 'green-header' //墨绿头
                }]

                //初始的颜色索引，对应上面的配色方案数组索引
                //如果本地已经有主题色记录，则以本地记录为优先，除非请求本地数据（localStorage）
                ,
                initColorIndex: 0
            },
        });

        const apiUrl = layui.setter.apiUrl + '/weuse/admin';

        exports('api', {
            // user
            login: apiUrl + '/user/login',
            logout: apiUrl + '/user/logout',
            refresh_token: apiUrl + '/user/refresh_token',
            get_captcha: apiUrl + '/user/get_captcha',
            user_get_user_lists: apiUrl + '/user/get_user_lists',
            user_get_user_details: apiUrl + '/user/get_user_details',
            user_get_user_logs: apiUrl + '/user/get_user_logs',
            user_get_admin_lists: apiUrl + '/user/get_admin_lists',
            user_get_admin_details: apiUrl + '/user/get_admin_details',
            user_get_admin_logs: apiUrl + '/user/get_admin_logs',
            user_create_admin: apiUrl + '/user/create_admin',
            user_update_admin: apiUrl + '/user/update_admin',
            user_update_admin_pwd: apiUrl + '/user/update_admin_pwd',
            user_update_user: apiUrl + '/user/update_user',
            user_delete_admin: apiUrl + '/user/delete_admin',
            user_get_user_account: apiUrl + '/user/get_user_account',
            user_get_user_account_list: apiUrl + '/user/get_user_account_list',
            user_update_user_account: apiUrl + '/user/update_user_account',
            update_user_status: apiUrl + '/user/update_user_status',
            user_ban: apiUrl + '/user/ban',

            // device
            devices_get_device_lists: apiUrl + '/devices/get_device_lists',
            devices_get_device_lock_lists: apiUrl + '/devices/get_device_lock_lists',
            devices_delete_device_lock: apiUrl + '/devices/delete_device_lock',
            allow_device: apiUrl + '/devices/update_lock_device',

            // menu
            menu_get_menu_lists: apiUrl + '/menu/get_menu_lists',
            menu_create_menu: apiUrl + '/menu/create_menu',
            menu_update_menu: apiUrl + '/menu/update_menu',
            menu_delete_menu: apiUrl + '/menu/delete_menu',

            // group
            group_get_lists: apiUrl + '/group/get_lists',
            group_create: apiUrl + '/group/create',
            group_update: apiUrl + '/group/update',
            group_delete: apiUrl + '/group/delete',
            group_params: apiUrl + '/group/get_params',

            // setting
            settings_get_config_lists: apiUrl + '/settings/get_config_lists',
            settings_create_config: apiUrl + '/settings/create_config',
            settings_update_config: apiUrl + '/settings/update_config',
            settings_delete_config: apiUrl + '/settings/delete_config',
            settings_get_third_config_lists: apiUrl + '/settings/get_third_config_lists',
            settings_create_third_config: apiUrl + '/settings/create_third_config',
            settings_update_third_config: apiUrl + '/settings/update_third_config',
            settings_delete_third_config: apiUrl + '/settings/delete_third_config',
            settings_get_third_addmaxfans_lists: apiUrl + '/settings/get_third_addmaxfans_lists',
            // reward_setting
            reward_setting: {
                praise_reward: apiUrl + '/reward_setting/praise_reward'
            },
            // 支付配置
            pay_config_get_pay_config_lists: apiUrl + '/pay_config/get_pay_config_lists',
            pay_config_create_pay_config: apiUrl + '/pay_config/create_pay_config',
            pay_config_update_pay_config: apiUrl + '/pay_config/update_pay_config',
            pay_config_delete_pay_config: apiUrl + '/pay_config/delete_pay_config',
            // 推送配置
            push_config_get_push_config_lists: apiUrl + '/push_config/get_push_config_lists',
            push_config_create_push_config: apiUrl + '/push_config/create_push_config',
            push_config_update_push_config: apiUrl + '/push_config/update_push_config',
            push_config_delete_push_config: apiUrl + '/push_config/delete_push_config',
            // 广告配置
            promotion_get_lists: apiUrl + '/popularize',
            promotion_create_lists: apiUrl + '/popularize',
            promotion_get_details_lists: apiUrl + '/popularize',
            promotion_update_lists: apiUrl + '/popularize',
            promotion_delete_lists: apiUrl + '/delete_popularize',
            // 问题
            faq_get_faq_lists: apiUrl + '/faq/get_faq_lists',
            faq_create_faq: apiUrl + '/faq/create_faq',
            faq_update_faq: apiUrl + '/faq/update_faq',
            faq_delete_faq: apiUrl + '/faq/delete_faq',
            // 限时优惠
            time_limited_get_lists: apiUrl + '/time_limited/get_lists',
            time_limited_create: apiUrl + '/time_limited/create',
            time_limited_update: apiUrl + '/time_limited/update',
            time_limited_delete: apiUrl + '/time_limited/delete',
            // 第三方配置
            third_get_ig_fans: apiUrl + '/third/get_ig_fans',
            third_update_ig_fans: apiUrl + '/third/update_ig_fans',

            // analysis
            analysis_console: apiUrl + '/analysis/console',
            analysis_get_flow_analysis: apiUrl + '/analysis/get_flow_analysis',
            analysis_get_install_analysis: apiUrl + '/analysis/get_install_analysis',
            // apps
            apps_get_apps_lists: apiUrl + '/apps/get_apps_lists',
            apps_create_app: apiUrl + '/apps/create_app',
            apps_update_app: apiUrl + '/apps/update_app',
            apps_delete_app: apiUrl + '/apps/delete_app',
            apps_get_apps_params: apiUrl + '/apps/get_apps_params',
            select_app_name: apiUrl + '/apps/select_app',
            // products
            products_get_products_lists: apiUrl + '/products/get_products_lists',
            products_create_product: apiUrl + '/products/create_product',
            products_update_product: apiUrl + '/products/update_product',
            products_delete_product: apiUrl + '/products/delete_product',
            products_export_product: apiUrl + '/products/export_product',
            products_import_product: apiUrl + '/products/import_product',
            products_download_excel: apiUrl + '/products/download_example',
            products_export_excel: apiUrl + '/products/export_product',
            products: {
                // products_random
                random: {
                    list: apiUrl + '/products_random/get_list',
                    create: apiUrl + '/products_random/create',
                    delete: apiUrl + '/products_random/delete',
                    import: apiUrl + '/products_random/import',
                    export: apiUrl + '/products_random/export',
                    download_example: apiUrl + '/products_random/download_example',
                }
            },
            // orders
            orders_get_order_lists: apiUrl + '/orders/get_order_lists',
            // tasks
            tasks_get_task_lists: apiUrl + '/tasks/get_task_lists',
            tasks_create_task: apiUrl + '/tasks/create_task',
            tasks_update_task: apiUrl + '/tasks/update_task',
            tasks_transfer_third: apiUrl + '/tasks/transfer_third',
            tasks_task_detail: apiUrl + '/tasks/task_detail',
            tasks_task_setting: apiUrl + '/tasks/task_setting',

            // feedback
            feedback_get_feedback_lists: apiUrl + '/feedback/get_feedback_lists',
            feedback_get_ticket_lists: apiUrl + '/feedback/get_ticket_lists',
            feedback_reply_ticket: apiUrl + '/feedback/reply_ticket',
            feedback_get_feedback_details: apiUrl + '/feedback/get_feedback_details',
            feedback_get_ticket_details: apiUrl + '/feedback/get_ticket_details',
            feedback_update_ticket: apiUrl + '/feedback/update_ticket',
            // 上传图片
            uploadImg: apiUrl + '/upload/image',

            // cookie池
            cookie_pool_base_info: apiUrl + '/cookie_pool/get_cookie_pool_info',
            cookie_pool_top_search: apiUrl + '/cookie_pool/get_cookie_pool_top_search',
            cookie_pool_echarts_info: apiUrl + '/cookie_pool/get_cookie_pool_echarts_info',
            cookie_pool_error_info: apiUrl + '/cookie_pool/get_cookie_pool_error',
            cookie_pool_user_log: apiUrl + '/cookie_pool/get_user_log',
            cookie_pool_user_request: apiUrl + '/cookie_pool/get_user_request',
            cookie_pool_get_user_list: apiUrl + '/cookie_pool/get_user_list',
            cookie_pool_update_user: apiUrl + '/cookie_pool/update_user',
            cookie_pool_create_user: apiUrl + '/cookie_pool/create_user',
            cookie_pool_delete_user: apiUrl + '/cookie_pool/delete_user',
            cookie_pool_get_proxy_ip_list: apiUrl + '/cookie_pool/get_proxy_ip_list',
            cookie_pool_update_proxy_ip: apiUrl + '/cookie_pool/update_proxy_ip',
            cookie_pool_create_proxy_ip: apiUrl + '/cookie_pool/create_proxy_ip',
            cookie_pool_delete_proxy_ip: apiUrl + '/cookie_pool/delete_proxy_ip',
            cookie_pool_export_user: apiUrl + '/cookie_pool/export_user',
            cookie_pool_export_proxy_ip: apiUrl + '/cookie_pool/export_proxy_ip',
            cookie_pool_import_proxy_ip: apiUrl + '/cookie_pool/import_proxy_ip',
            cookie_pool_import_user: apiUrl + '/cookie_pool/import_user',
            cookie_pool_download_excel_template: apiUrl + '/cookie_pool/download_excel_template',
        });

        exports('code', {
            USER_FORBIDDEN: -3, // 当前用户已封号
            CODE_NOT_EXIST: -2, // 十分抱歉，错误码不存在，请联系客服
            SYSTEM_ERROR: -1, // 十分抱歉，系统错误，请联系客服
            NO_ERROR: 0, // 成功
            APP_DISABLE: 10001, // 应用不可用
            APP_IS_EXIST: 10002, // 应用已存在
            APP_NOT_EXIST: 10003, // 应用不存在
            APP_IS_RUNNING: 10004, // 应用运行中
            APP_IS_AUTH: 10005, // 应用已授权
            APP_NOT_AUTH: 10006, // 应用未授权
            AUTH_SUCCESS: 10007, // 认证成功
            AUTH_FAILED: 10008, // 认证失败
            SIGN_ERROR: 10009, // 签名错误
            KEY_ERROR: 10010, // key 错误
            SECRET_ERROR: 10011, // secret 错误
            ENCODE_ERROR: 10012, // 加密失败
            DECODE_ERROR: 10013, // 解密失败
            DECODE_DATA_ILLEGAL: 10014, // 解密数据非法
            PARAMS_ERROR: 10015, // 参数错误
            PARAMS_ILLEGAL: 10016, // 参数非法
            PARAMS_MISSING: 10017, // 参数缺失，请检查
            PARAMS_INVALID: 10018, // 无效参数，请检查
            SYSTEM_BUSY: 10019, // 系统繁忙，请稍后
            SYSTEM_UPGRADE: 10020, // 系统升级，请稍后
            VERIFY_ERROR: 10021, // 验证错误，请重试
            FORMAT_ERROR: 10022, // 格式错误，请重试
            CREATE_ERROR: 10023, // 创建失败，请重试
            UPDATE_ERROR: 10024, // 更新失败，请重试
            QUERY_ERROR: 10025, // 查询失败，请重试
            DELETE_ERROR: 10026, // 删除失败，请重试
            INIT_ERROR: 10027, // 初始化失败，请检查
            RECORD_IS_EXIST: 10028, // 记录已存在
            RECORD_NOT_EXIST: 10029, // 记录不存在
            RECORD_IS_DELETE: 10030, // 记录已删除
            RECORD_IS_UPDATE: 10031, // 记录已更新
            OPERATION_TIMEOUT: 10032, // 操作超时，请稍后再试
            OPERATION_TOO_FAST: 10033, // 操作频繁，请稍后再试
            OPERATION_ILLEGAL: 10034, // 非法操作
            AUTH_IS_EXPIRE: 10035, // 认证已过期
            SIGN_IS_EXPIRE: 10036, // 签名已过期
            ENCODE_IS_EXPIRE: 10037, // 加密已过期
            TOKEN_IS_EXPIRE: 10038, // Token 已过期
            REFRESH_TOKEN_IS_EXPIRE: 10039, // Refresh Token 已过期
            MSG_IS_SEND: 10040, // 信息已发送
            OPERATION_FAILED: 10041, // 操作失败，请重试
            USER_NOT_REG: 20001, // 用户未注册
            USER_IS_REG: 20002, // 用户已注册
            USER_NOT_LOGIN: 20003, // 用户未登录
            USER_IS_LOGIN: 20004, // 用户已登录
            USER_IS_EXIST: 20005, // 用户已存在
            USER_NOT_EXIST: 20006, // 用户不存在
            USER_PWD_ERROR: 20007, // 密码错误，请重试
            USER_EMAIL_VERIFY_SUC: 20008, // 邮箱验证成功
            USER_EMAIL_VERIFY_ERROR: 20009, // 邮箱验证失败
            USER_EMAIL_IS_USED: 20010, // 邮箱已被使用
            USER_EMAIL_NOT_VERIFY: 20011, // 邮箱未验证
            USER_EMAIL_IS_VERIFY: 20012, // 邮箱已验证
            USER_EMAIL_FORMAT_ERROR: 20013, // 邮箱格式错误
            USER_PWD_IS_SIMPLE: 20014, // 新旧密码不能一致，请检查
            USER_EMAIL_VERIFY_SUC_STR: 20015, // 验证成功，请回到原来页面继续您的操作
            USER_LOGIN_EXPIRE: 20016, // 登录过期，请重新登录
            USER_CAPTCHA_ERROR: 20017, // 验证码错误，请重试
            USER_CANNOT_UNSEALED: 20018, // 用户无法解封
            ORDER_CREATE_ERROR: 40001, // 订单创建失败
            ORDER_VERIFY_ERROR: 40002, // 订单验证失败
            ORDER_PAY_ERROR: 40003, // 订单支付失败
            ORDER_IS_CANCEL: 40004, // 订单已取消
        });

        layui.config({
            base:'https://cdn.jsdelivr.net/gh/weuseapp/ifollowers@1.0/layuiadmin/'
        });
    });


});