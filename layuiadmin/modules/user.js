layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$, table = layui.table, form = layui.form;
    const params = getUrlParams(location.search);
    let apiLists = layui.api.user_get_user_lists;
    if (params['user_id']) {
        apiLists += '?user_id=' + params['user_id'];
    }
    const apiDetails = layui.api.user_get_user_details;
    const apiDisable = layui.api.update_user_status;

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiDetails', apiDetails);
    }

    function onImgLoad() {
        // 监听 img
        $('img').load(function () { // 加载中
            $(this).prev().remove();
            $(this).show();
        }).error(function () { // 加载失败
            $(this).attr('src', layui.setter.base + 'statics/avatar.jpg');
        });
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
                table.cache.extends = res.extends;
                onImgLoad();
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
            // {type: 'checkbox', fixed: 'left'},
            {field: 'id', title: 'ID', sort: true},
            {field: 'related_type', title: '用户类型', minWidth: 100, templet: '#tpl_related_type', align: 'center'},
            {
                field: 'app_name', title: '应用名称', minWidth: 120, templet: function (res) {
                    let app = parent.listData.data.extends['apps'][res.app_id];
                    return app !== undefined ? app : '未知';
                }
            },
            {field: 'related_id', title: '关联ID', minWidth: 100},
            {field: 'username', title: '用户名', minWidth: 100, templet: '#tpl_username'},
            {
                field: 'is_paid_user',
                title: '付费用户',
                minWidth: 110,
                sort: true,
                align: 'center',
                templet: function (d) {
                    if (d['is_paid_user'] === 1) {
                        return `<span class="layui-badge layui-bg-blue">是</span>`
                    } else {
                        return `<span class="layui-badge layui-bg-gray">否</span>`
                    }
                }
            },
            {field: 'avatar', title: '头像', width: 90, templet: '#tpl_img', align: 'center', unresize: true},
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
            {title: '操作', width: 60 * 6, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
            onImgLoad();
        },
    });

    window.initSearchInput = function (data, init_params = {}) {
        renderSelect('app_id', 'app_id', data['apps']);
        renderSelect('platform', 'platform', data['platform']);
        form.render();
    };

    window.account = function (data) {
        layer.open({
            type: 2,
            title: '账户',
            content: layui.setter.vhtml + `user/account/form.html?user_id=${data.id}`,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    window.order_lists = function (data) {
        layer.open({
            type: 2,
            title: '订单列表',
            content: layui.setter.vhtml + 'orders/list.html?user_id=' + data.id,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    window.task_lists = function (data) {
        layer.open({
            type: 2,
            title: '任务列表',
            content: layui.setter.vhtml + 'tasks/list.html?user_id=' + data.id,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    window.log_lists = function (data) {
        layer.open({
            type: 2,
            title: '日志',
            content: layui.setter.vhtml + 'user/user/log-list.html?id=' + data.id,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    window.details = function (data) {
        layer.open({
            type: 2,
            title: '详细',
            content: `details.html`,
            maxmin: true,
            area: ['70%', '70%'],
            success: function (dom) {
                window[dom.find('iframe')[0]['name']].a_data = {};
                window[dom.find('iframe')[0]['name']].a_data.data = data;
            }
        })
    };

    window.disable = function (data) {
        layer.confirm('确认禁用用户账号?', function (index) {
            let res = ajaxRequest(apiDisable, 'post', {
                id: data.id,
                status: 0,
            }, false)['responseJSON'];
            if (res.code !== 0) {
                layer.msg('禁用失败：' + res.msg, {
                    icon: 2,
                    time: 1000
                });
            } else {
                layer.msg('已禁用', {
                    icon: 1,
                    time: 1000
                });
                layer.close(index);
                table.reload('lists');
            }
        });
    }

    window.recovery = function (data) {
        layer.confirm('确认解封用户账号?', function (index) {
            let res = ajaxRequest(apiDisable, 'post', {
                id: data.id,
                status: -100,
            }, false)['responseJSON'];

            if (res.code !== 0) {
                layer.msg('解封失败：' + res.msg, {
                    icon: 2,
                    time: 1000
                });
            } else {
                layer.msg('已解封', {
                    icon: 1,
                    time: 1000
                });
                layer.close(index);
                table.reload('lists');
            }
        });

    }

    exports('user');

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