layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$, op_common = layui.op_common, table = layui.table, form = layui.form;
    const params = getUrlParams(location.search);
    const apiLists = layui.api.orders_get_order_lists;
    const apiCreate = layui.api.user_create_admin;
    const apiUpdate = layui.api.user_update_admin;
    const apiDelete = layui.api.user_delete_admin;

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiCreate', apiCreate);
        setCacheData('apiUpdate', apiUpdate);
        setCacheData('apiDelete', apiDelete);
    }

    // 列表行外操作：创建，多个删除
    $('.op-methods').on('click', function (obj) {
        initUrl();
        window.data = obj.data;
        const type = $(this).data('type');
        window[type] ? window[type].call(this, obj.data, table.cache.extends) : '';
    });
    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        initUrl();
        window.data = obj.data;
        const event = obj.event;
        window[event] ? window[event].call(this, obj.data, table.cache.extends) : '';
    });

    window.user = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '用户',
            content: layui.setter.vhtml + 'user/user/list.html?user_id=' + data.user_id,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    // 列表
    const opTable = layui.opTable.render({
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
        toolbar: true,
        defaultToolbar: ['filter', 'exports'],
        cols: [[
            // {type: 'checkbox', fixed: 'left'},
            {field: 'id', title: 'ID', sort: true},
            {field: 'order_sn', width: 150, title: '订单号'},
            {field: 'name', title: '标题'},
            {field: 'user_id', title: '用户', templet: '#tpl_user'},
            {field: 'price', width: 90, title: '价格'},
            {field: 'total', width: 90, title: '购买数量'},
            {field: 'platform', width: 90, title: '支付来源', templet: '#tpl_platform', align: 'center'},
            {field: 'currency', width: 90, title: '支付货币', templet: '#tpl_currency', align: 'center'},
            {field: 'status', width: 80, title: '状态', templet: '#tpl_status', align: 'center'},
            {field: 'is_handle', width: 90, title: '是否处理', templet: '#tpl_is_handle', align: 'center'},
            {field: 'is_push', width: 90, title: '是否推送', templet: '#tpl_is_push', align: 'center'},
            {
                field: 'created_at', width: 160, title: '创建时间', sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            // {title: '操作', width: 160, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        openColumnIndex: 0,
        //  展开的列配置
        openCols: [
            {
                field: 'app_name', title: '应用名称', templet: function (d) {
                    const t = `<span class="opTable-item-title">应用名称：</span>`;
                    let app = parent.listData.data.extends['apps'][d['app_id']];
                    return t + `<span class="opTable-exp-value">${(app !== undefined ? app : '未知')}</span>`;
                }
            },
            {field: 'user_id', title: '用户ID'},
            {
                field: 'pay_form', title: '支付方式', templet: function (d) {
                    const t = `<span class="opTable-item-title">支付方式：</span>`;
                    let v = '未知';
                    if (d['pay_form'] === 0) {
                        v = '未知';
                    } else if (d['pay_form'] === 1) {
                        v = '平台币';
                    } else if (d['pay_form'] === 2) {
                        v = '苹果内购';
                    } else if (d['pay_form'] === 3) {
                        v = '谷歌内购';
                    } else if (d['pay_form'] === 4) {
                        v = 'Stripe';
                    } else if (d['pay_form'] === 5) {
                        v = 'PayPal';
                    }
                    return t + `<span class="opTable-exp-value">${v}</span>`;
                }
            },
            {
                field: 'type', title: '商品类型', templet: function (d) {
                    const t = `<span class="opTable-item-title">商品类型：</span>`;
                    if (d['type'] === layui.const.TYPE_TASK) {
                        return t + `<span class="layui-badge layui-bg-blue">任务</span>`;
                    } else if (d.type === layui.const.TYPE_COINS) {
                        return t + `<span class="layui-badge layui-bg-blue">金币</span>`;
                    } else {
                        return t + `<span class="layui-badge layui-bg-blue">任务</span>`;
                    }
                }
            },
            {
                field: 'is_sanbox', title: '是否沙盒', templet: function (d) {
                    const t = `<span class="opTable-item-title">是否沙盒：</span>`;
                    if (d['is_sanbox'] === 1) {
                        return t + `<span class="layui-badge layui-bg-blue">是</span>`;
                    }
                    return t + `<span class="layui-badge layui-bg-gray">否</span>`;
                }
            },
        ],
        page: true,
        where: params['user_id'] ? {'user_id': params['user_id']} : {},
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
        },
    });

    // 搜索
    form.on('submit(search)', function (obj) {
        initUrl();
        window.data = obj.data;
        if (params['user_id']) {
            obj.field['user_id'] = params['user_id'];
        }
        if (obj.field['username'] && !isNaN(parseInt(obj.field['username']))) {
            // 存在且为整型
            obj.field['user_id'] = obj.field['username'];
            delete obj.field['username'];
        }
        opTable.reload({
            where: op_common.verifyField(obj.field),
            page: {
                curr: 1
            },
            done: function () {},
        }); // 执行重载
    });

    function initSearchInput(data, init_params = {}) {
        renderSelect('app_id', 'app_id', data['apps'], init_params['app_id']);
        renderSelect('type', 'type', data['type'], init_params['type']);
        renderSelect('platform', 'platform', data['platform'], init_params['platform']);
        renderSelect('status', 'status', data['status'], init_params['status']);
        renderSelect('is_handle', 'is_handle', data['is_handle'], init_params['is_handle']);
        renderSelect('is_sanbox', 'is_sanbox', data['is_sanbox'], init_params['is_sanbox']);
        renderSelect('currency', 'currency', data['currency'], init_params['currency']);
        renderSelect('pay_form', 'pay_form', data['pay_form'], init_params['pay_form']);
        form.render();
    }

    exports('orders', {});

    exports('const', {
        // 订单状态，0：正常，1：异常，2：待处理
        STATUS_NORMAL: 0,
        STATUS_FAILED: 1,
        STATUS_PROCESS: 2,
        // 订单类型，0：未知，1：任务，2：金币，默认为0
        TYPE_UNKNOWN: 0,
        TYPE_TASK: 1,
        TYPE_COINS: 2,
        // 支付来源，0：未知，1：微用，2：苹果，3：谷歌，默认为0
        PAY_FORM_UNKNOWN: 0,
        PAY_FORM_WEUSE: 1,
        PAY_FORM_APPLE: 2,
        PAY_FORM_GOOGLE: 3,
        // 支付平台，0：未知，1：微用，2：苹果内购，3：谷歌内购，4：PayPal，默认为1
        PLATFORM_UNKNOWN: 0,
        PLATFORM_WEUSE: 1,
        PLATFORM_APPLE: 2,
        PLATFORM_GOOGLE: 3,
        PLATFROM_PAYPAL: 4,
        // 货币类型，1：美元，2：金币
        CURRENCY_DOLLAR: 1,
        CURRENCY_COINS: 2,
    });
});