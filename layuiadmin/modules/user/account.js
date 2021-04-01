layui.define('table', function (exports) {
    const table = layui.table, form = layui.form;
    const apiLists = layui.api.user_get_user_account_list;

    // 搜索
    form.on('submit(search)', function (obj) {
        table.reload('lists', {
            where: obj.field,
            page: {
                curr: 1
            },
        }); // 执行重载
    });

    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        window.data = obj.data;
        window[obj.event] && window[obj.event].call(this, obj.data, table.cache.extends);
    });

    window.account = function (data) {
        layer.open({
            type: 2,
            title: '编辑账户',
            content: layui.setter.vhtml + `user/account/form.html?user_id=${data.user_id}`,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    // 列表
    table.render({
        elem: '#lists',
        url: apiLists,
        headers: {
            token: layui.data(layui.setter.tableName).user.token,
        },
        parseData: function (res) {
            checkApiStatusByData(res);
            return getListsFormatByData(res);
        },
        cols: [[
            // {type: 'checkbox', fixed: 'left'},
            {field: 'user_id', title: '用户ID', sort: true, fixed: 'left'},
            {field: 'username', title: '用户名'},
            {field: 'gold_purchase', title: '累计购买'},
            {field: 'gold_earn', title: '累计赚取'},
            {field: 'gold_cost', title: '累计消耗'},
            {field: 'gold_total', title: '金币余额'},
            {
                field: 'gold_loss', title: '盈亏', align: 'center', sort: true, templet: function (res) {
                    if (parseInt(res['gold_loss']) > 0) {
                        return `<span style="color: #5FB878;">+${res['gold_loss']}</span>`;
                    }
                    if (parseInt(res['gold_loss']) < 0) {
                        return `<span style="color: #FF5722;">${res['gold_loss']}</span>`;
                    }
                    return res['gold_loss'];
                }
            },
            {field: 'gold_purchase_total', title: '购买金币余额'},
            {field: 'status', width: 75, title: '状态', templet: '#tpl_status', align: 'center'},
            {
                field: 'created_at', title: '创建时间', width: 170, templet: function (res) {
                    return res.created_at ? changeUTCTime(res.created_at) : '暂无';
                }
            },
            {
                field: 'updated_at', title: '更新时间', width: 170, templet: function (res) {
                    return res.updated_at ? changeUTCTime(res.updated_at) : '暂无';
                }
            },
            {title: '操作', width: 70, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        autoSort: false
    });

    table.on('sort(lists)', function (obj) {
        table.reload('lists', {
            initSort: obj,
            where: obj.type === null ? null : {'sort': {'field': obj.field, 'type': obj.type}},
            page: {
                curr: 1
            },
        }); // 执行重载
    });

    exports('account', {});

    exports('const', {
        // 状态，0：禁用，1：正常，2：游客，3：iOS审核人员，4：安卓审核人员
        STATUS_LOCK: 0,
        STATUS_NORMAL: 1,
        STATUS_DEVICE: 2,
        STATUS_IOS: 3,
        STATUS_ANDROID: 4,

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