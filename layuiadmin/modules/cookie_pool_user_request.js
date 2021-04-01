layui.define(['table', 'form', 'op_common'], function (exports) {
    var table = layui.table, form = layui.form;
    var apiUserRequest = layui.api.cookie_pool_user_request;

    function initUrl() {
        setCacheData('apiUserRequest', apiUserRequest);
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
            },
        }); // 执行重载
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
        url: apiUserRequest,
        headers: {
            token: layui.data(layui.setter.tableName).user.token,
        },
        parseData: function (res) {
            window.parent.listData = res;
            checkApiStatusByData(res);
            return getListsFormatByData(res);
        },
        cols: [[
            {field: 'id', width: 80, title: 'ID', sort: true},
            {field: 'user_id', title: '用户ID', width: 80, align: 'center'},
            {
                field: 'username', title: 'IG用户名', width: 150, align: 'center', templet: function (res) {
                    return res.user ? res.user.username : '用户已删除';
                }
            },
            {field: 'url', title: '链接'},
            {field: 'request_num', title: '请求次数', width: 120, sort: true},
            {field: 'fail_num', title: '失败次数', width: 120, sort: true},
            {
                field: 'created_at', title: '第一次请求时间', width: 170, sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {
                field: 'updated_at', title: '最后一次请求时间', width: 170, sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {
                field: 'fail_at', title: '最后一次失败时间', width: 170, sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            // {title: '操作', width: 120, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function (res) {
        },
    });

    details = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '详细',
            content: `user_request_detail.html?data=${data.id}`,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    exports('cookie_pool_user_request');

    exports('const', {});
});