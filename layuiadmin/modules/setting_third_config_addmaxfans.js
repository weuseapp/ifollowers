layui.define(['table', 'form', 'op_common'], function (exports) {
    var $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form;

    var apiLists = layui.api.settings_get_third_addmaxfans_lists;

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
            done: function (res) {
                initSearchInput(res.extends, obj.field);
            },
        }); // 执行重载
    });
    // 列表行外操作：创建，多个删除
    $('.op-methods').on('click', function (obj) {
        initUrl();
        window.data = obj.data;
        window[$(this).data('type')](obj, table.cache.extends);
    });
    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        initUrl();
        window.data = obj.data;
        window[obj.event](obj, table.cache.extends);
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
            {field: 'order_id', title: 'IgOrder ID'},
            {field: 'resubmit_id', title: '新下单ID'},
            {field: 'third_order_id', title: '第三方订单号'},
            {field: 'service_id', title: '服务节点/ID'},
            {field: 'service_name', title: '服务名称'},
            {field: 'link', title: '刷粉地址'},
            {field: 'quantity', title: '总数'},
            {field: 'price', title: '单价'},
            {field: 'total_price', title: '总价'},
            {field: 'start_count', title: '开始数量'},
            {field: 'remains', title: '类型'},
            {field: 'status', title: '状态', templet: '#tpl_status', align: 'center'},
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
            // {title: '操作', width: 160, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done:function (res) {
            table.cache.extends = res.extends;
        }
    });

    exports('setting_third_config_addmaxfans');

    exports('const', {
        // 状态，0：禁用，1：正常
        STATUS_LOCK: 0,
        STATUS_NORMAL: 1,
    })

});