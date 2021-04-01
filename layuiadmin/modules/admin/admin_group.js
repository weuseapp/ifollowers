layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$, table = layui.table, form = layui.form;

    const apiLists = layui.api.group_get_lists
        , apiCreate = layui.api.group_create
        , apiUpdate = layui.api.group_update
        , apiDelete = layui.api.group_delete;

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
        const type = $(this).data('type');
        window[type] && window[type].call(this, obj.data, table.cache.extends);
    });
    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        initUrl();
        window.data = obj.data;
        window[obj.event] && window[obj.event].call(this, obj.data, table.cache.extends);
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
            {field: 'title', title: '角色名称', minWidth: 180, templet: '#tpl_title'},
            {field: 'status', title: '状态', width: 80, align: 'center', templet: '#tpl_status'},
            {field: 'is_admin', title: '超级管理员', width: 100, align: 'center', templet: '#tpl_is_admin'},
            {
                field: 'created_at', title: '创建时间', width: 170, align: 'center', sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {title: '操作', width: 60 * 2, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        done: function (res) {
            table.cache.extends = res.extends;
        },
    });

    exports('admin_group');

    exports('const', {
        // 权限状态，0：禁用，1：正常，2：待启用
        STATUS_LOCK: 0,
        STATUS_NORMAL: 1,
        STATUS_PENDING: 2
    });
});