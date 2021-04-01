layui.define(['table', 'form', 'op_common'], function (exports) {
    var $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form;

    var apiLists = layui.api.settings_get_third_config_lists;
    var apiCreate = layui.api.settings_create_third_config;
    var apiUpdate = layui.api.settings_update_third_config;
    var apiDelete = layui.api.settings_delete_third_config;

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiCreate', apiCreate);
        setCacheData('apiUpdate', apiUpdate);
        setCacheData('apiDelete', apiDelete);
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
            {type: 'checkbox', fixed: 'left'},
            {field: 'id', width: 100, title: 'ID', sort: true},
            {field: 'type', title: '类型'},
            {field: 'name', title: '中文名称'},
            {field: 'en_name', title: '英语名称'},
            {field: 'desc', title: '描述'},
            // {field: 'key', title: '公钥'},
            // {field: 'secret', title: '密钥'},
            {field: 'extend', title: '扩展内容'},
            {field: 'status', title: '状态', templet: '#tpl_status', align: "center"},
            {
                field: 'created_at', title: '创建时间', sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {
                field: 'updated_at', title: '更新时间', sort: true, templet: function (res) {
                    return changeUTCTime(res.updated_at);
                }
            },
            {title: '操作', width: 65 * 4, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
        }
    });

    addmaxfans_details = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '详情',
            // content: layui.setter.vhtml + 'setting/third-config/addmaxfans-details.html',
            content: `http://addmaxfans.com/services`,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    addmaxfans_lists = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '订单列表',
            content: layui.setter.vhtml + 'setting/third-config/addmaxfans-list.html',
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    exports('setting_third_config');

    exports('const', {
        // 状态，0：禁用，1：正常
        STATUS_LOCK: 0,
        STATUS_NORMAL: 1,
    })

});