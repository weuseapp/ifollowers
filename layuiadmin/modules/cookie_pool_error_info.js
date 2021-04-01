layui.define(['table', 'form', 'op_common'], function (exports) {
    var table = layui.table, form = layui.form;
    var apiErrorInfo = layui.api.cookie_pool_error_info;

    function initUrl() {
        setCacheData('apiErrorInfo', apiErrorInfo);
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
        url: apiErrorInfo,
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
            {field: 'type', title: '错误类型', width: 220},
            {field: 'file', title: '错误文件名'},
            {field: 'line', title: '错误文件行数', width: 100},
            {field: 'error', title: '错误信息'},
            {
                field: 'created_at', title: '创建时间', width: 175, templet: function (res) {
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
            content: `error_detail.html?data=${data.id}`,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    exports('cookie_pool_error_info');

    exports('const', {});
});