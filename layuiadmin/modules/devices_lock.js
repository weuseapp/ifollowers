layui.define(['table', 'form', 'op_common'], function (exports) {
    var $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form;
    var params = getUrlParams(location.search);
    var apiLists = layui.api.devices_get_device_lock_lists;
    var apiDelete = layui.api.devices_delete_device_lock;
    var apiAllow = layui.api.allow_device;

    function initUrl() {
        setCacheData('apiLists', apiLists);
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
            {
                field: 'app_name', title: '应用名称', minWidth: 120, templet: function (res) {
                    let app = parent.listData.data.extends.apps[res.app_id];
                    return app !== undefined ? app : '未知';
                }
            },
            {field: 'app_bundle_id', title: 'Bundle ID',},
            {field: 'device_id', title: '设备ID',},
            {field: 'mobile_version', title: '手机版本',},
            {field: 'ip', title: '请求IP',},
            {field: 'location', title: '地址',},
            {field: 'status', title: '状态', templet: '#tpl_status'},
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
            {title: '操作', width: 120, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
        },
    });

    initSearchInput = function (data, init_params = {}) {
        renderSelect('app_id', 'app_id', data.apps, init_params['app_id']);
        renderSelect('status', 'status', {
            0: '禁用',
            1: '通行'
        }, init_params['status'])
        form.render();
    };

    allow = function (data, extend = null) {
        layer.confirm('确认通行该设备', function (index) {
            let res = ajaxRequest(apiAllow, 'POST', {
                id: data.id,
                status: 1
            }, false).responseJSON;
            if (res.code !== 0) {
                layer.msg('通行失败：' + res.msg, {
                    icon: 2,
                    time: 1000
                });
            } else {
                layer.msg('已通行', {
                    icon: 1,
                    time: 1000
                });
                layer.close(index);
                table.reload('lists');
            }
        });
    };

    disable = function (data, extend = null) {
        layer.confirm('确认禁用该设备', function (index) {
            let res = ajaxRequest(apiAllow, 'POST', {
                id: data.id,
                status: 0
            }, false).responseJSON;
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
    };

    exports('devices_lock');

    exports('const', {
        // 状态，0：禁用，1：正常
        STATUS_LOCK: 0,
        STATUS_NORMAL: 1,
    });
});