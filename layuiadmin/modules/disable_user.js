layui.define(['user'], function (exports) {
    var $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form;
    var params = getUrlParams(location.search);
    var apiLists = layui.api.user_get_user_lists + "?status=0&user_id=" + params['user_id'];
    var apiDetails = layui.api.user_get_user_details;
    var apiRecovery = layui.api.update_user_status;

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiDetails', apiDetails);
    }

    // 搜索
    form.on('submit(search)', function (obj) {
        initUrl();
        window.data = obj.data;
        table.reload('lists', {
            where: obj.field,
            page: {
                curr: 1
            },
            done: function (res) {
                initSearchInput(res.extends, obj.field);
            },
        }); // 执行重载
    });
    // 列表行外操作：创建，多个删除
    $('.op-methods').on('click', function (obj) {
        initUrl();
        window.data = obj.data;
        window[$(this).data('type')](obj.data, table.cache.extends);
    });
    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        initUrl();
        window.data = obj.data;
        window[obj.event](obj.data, table.cache.extends);
    });

    // 列表
    table.render({
        elem: '#lists',
        url: apiLists,
        headers: {
            token: layui.data(layui.setter.tableName).user.token,
        },
        parseData: function (res) {
            window.parent.listData = res;
            checkApiStatusByData(res);
            return getListsFormatByData(res);
        },
        cols: [[
            // {type: 'checkbox', fixed: 'left'},
            {field: 'id', width: 100, title: 'ID', sort: true},
            {field: 'related_type', title: '用户类型', minWidth: 100, templet: '#tpl_related_type', align: 'center'},
            {
                field: 'app_name', title: '应用名称', minWidth: 120, templet: function (res) {
                    let app = parent.listData.data.extends.apps[res.app_id];
                    return app !== undefined ? app : '未知';
                }
            },
            {field: 'related_id', title: '关联ID', minWidth: 100},
            {field: 'username', title: '用户名', minWidth: 100, templet: '#tpl_username'},
            {field: 'avatar', title: '头像', width: 100, templet: '#tpl_img'},
            {field: 'email', title: '邮箱'},
            {field: 'platform', width: 90, title: '来源设备', templet: '#tpl_platform', align: 'center'},
            {field: 'status', width: 75, title: '状态', templet: '#tpl_status', align: 'center'},
            {
                field: 'created_at', title: '创建时间', width: 175, sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {
                field: 'updated_at', title: '更新时间', width: 175, sort: true, templet: function (res) {
                    return changeUTCTime(res.updated_at);
                }
            },
            {title: '操作', width: 60 * 2, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
        },
    });

    initSearchInput = function (data, init_params = {}) {
        renderSelect('app_id', 'app_id', data.apps, init_params['app_id']);
        renderSelect('platform', 'platform', data.platform, init_params['platform']);
        form.render();
    };

    details = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '详细',
            content: `details.html`,
            maxmin: true,
            area: ['70%', '70%'],
            success: function (layero, index) {
                window[layero.find('iframe')[0]['name']].a_data = {};
                window[layero.find('iframe')[0]['name']].a_data.data = data;
                let res = ajaxRequest(getCacheData('apiDetails'), 'get', {
                    id: data.id
                }, false).responseJSON;
                $.each(res.data, function (key, value) {

                });
            }
        })
    };

    exports('disable_user');

    exports('const', {
        // 状态，0：禁用，1：正常
        STATUS_LOCK: 0,
        STATUS_NORMAL: 1,
        // 关联类型，1：IG，2：PC
        TYPE_IG: 1,
        TYPE_MEGALIKE_PC: 2,
        // 设备来源，0：未知，2：苹果，3：安卓，默认为0
        PLATFORM_UNKNOWN: 0,
        PLATFORM_PC: 1,
        PLATFORM_APPLE: 2,
        PLATFORM_ANDROID: 3,
        PLATFORM_WEUSE: 4,
    });
});