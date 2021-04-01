layui.define(['table', 'form', 'op_common'], function (exports) {
    var table = layui.table, form = layui.form;
    var apiUserLog = layui.api.cookie_pool_user_log;

    function initUrl() {
        setCacheData('apiUserLog', apiUserLog);
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
        url: apiUserLog,
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
            {field: 'id', width: 80, title: 'ID', sort: true},
            {field: 'user_id', title: '用户ID', width: 80, align: 'center'},
            {
                field: 'username', title: 'IG用户名', width: 150, align: 'center', templet: function (res) {
                    return res.user.username;
                }
            },
            {field: 'ip', title: 'IP', width: 150},
            {field: 'url', title: '请求链接'},
            {field: 'remark', title: '备注'},
            {field: 'param', title: '参数'},
            {field: 'method', title: '请求方法', width: 100},
            {field: 'response_code', title: '响应码', width: 80},
            {
                field: 'created_at', title: '创建时间', width: 175, sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {title: '操作', width: 120, align: 'center', fixed: 'right', toolbar: '#options'},
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
            content: `user_log_detail.html?data=${data.id}`,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    exports('cookie_pool_user_log');

    exports('const', {});
});