layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$, table = layui.table, form = layui.form, params = getUrlParams(location.search);
    let apiLists = layui.api.user_get_admin_logs;
    if (params['id']) {
        apiLists += '?id=' + params['id'];
    }

    function initUrl() {
        setCacheData('apiLists', apiLists);
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
            {field: 'id', width: 100, title: 'ID', sort: true},
            {field: 'username', width: 100, title: '操作人', sort: true},
            {field: 'title', width: 300, title: '操作', sort: true},
            {field: 'api_url', width: 100, title: '接口', sort: true},
            {field: 'ua', title: '浏览器标识', sort: true},
            {field: 'ip', title: 'IP地址', sort: true},
            {
                field: 'created_at', title: '创建时间', sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
        ]],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
        },
    });
    exports('admin_logs');
});