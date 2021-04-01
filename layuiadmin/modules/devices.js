layui.define(['table', 'form', 'op_common'], function (exports) {
    var $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form;
    var params = getUrlParams(location.search);
    var apiLists = layui.api.devices_get_device_lists;

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
            // {type: 'checkbox', fixed: 'left'},
            {field: 'id', width: 100, title: 'ID', sort: true},
            {
                field: 'app_name', title: '应用名称', minWidth: 120, templet: function (res) {
                    let app = parent.listData.data.extends.apps[res.app_id];
                    return app !== undefined ? app : '未知';
                }
            },
            {field: 'device_uuid', title: '设备ID',},
            {
                field: 'device_type', title: '设备类型', templet: function (res) {
                    if (res.device_type === 1) {
                        return 'Android';
                    } else if (res.device_type === 2) {
                        return 'iOS';
                    } else if (res.device_type === 3) {
                        return 'PC';
                    } else {
                        return '未知';
                    }
                }
            },
            {field: 'mobile_version', title: '手机版本',},
            {field: 'device_ip', title: '请求IP',},
            {field: 'device_ip_address', title: '地址',},
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
        renderSelect('device_type', 'device_type', data.device_type, init_params['device_type']);
        form.render();
    };

    exports('devices');

    exports('const', {});
});