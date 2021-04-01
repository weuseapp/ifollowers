layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$, op_common = layui.op_common, table = layui.table, form = layui.form;
    const apiLists = layui.api.apps_get_apps_lists;
    const apiCreate = layui.api.apps_create_app;
    const apiUpdate = layui.api.apps_update_app;
    const apiDelete = layui.api.apps_delete_app;

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiCreate', apiCreate);
        setCacheData('apiUpdate', apiUpdate);
        setCacheData('apiDelete', apiDelete);
    }

    // 列表行外操作：创建，多个删除
    $('.op-methods').on('click', function (obj) {
        initUrl();
        window[$(this).data('type')](obj.data, table.cache.extends);
    });
    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        initUrl();
        window[obj.event] ? window[obj.event].call(this, obj.data, table.cache.extends) : '';
    });

    window.product_lists = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '商品列表',
            content: layui.setter.vhtml + 'products/list.html?app_id=' + data.id,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    window.push = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '推送设置',
            content: layui.setter.vhtml + 'user/user/log-list.html?id=' + data.id,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    window.logs = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '应用用户日志',
            content: layui.setter.vhtml + 'user/user/log-list.html?id=' + data.id,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    window.install_lists = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '安装统计',
            content: layui.setter.vhtml + 'analysis/install-list.html?app_id=' + data.id,
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
            checkApiStatusByData(res);
            return getListsFormatByData(res);
        },
        toolbar: true,
        defaultToolbar: ['filter'],
        cols: [[
            {type: 'checkbox'},
            {field: 'id', width: 90, title: 'ID', sort: true},
            {field: 'name', title: '应用名称'},
            {field: 'device_type', width: 90, title: '设备类型', templet: '#tpl_device_type', align: 'center'},
            {field: 'version', width: 75, title: '版本号'},
            {field: 'html_switch', width: 90, title: 'H5开关', templet: '#tpl_html_switch', align: 'center'},
            {field: 'is_maintain', width: 90, title: '维护开关', templet: '#tpl_is_maintain', align: 'center'},
            {field: 'pay_maintain', width: 90, title: '支付维护', templet: '#tpl_pay_maintain', align: 'center'},
            {field: 'status', width: 75, title: '状态', templet: '#tpl_status', align: 'center'},
            {
                field: 'updated_at', title: '更新时间', width: 165, sort: true, templet: function (res) {
                    return changeUTCTime(res.updated_at);
                }
            },
            {title: '操作', width: 60 * 5, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        //  展开的列配置
        openColumnIndex: 1,
        openCols: [
            {field: 'bundle_id', title: 'bundleId'},
            {field: 'en_name', title: '应用标识'},
            {field: 'channel', title: '渠道'},
            {
                field: 'html_url', width: 90, title: 'H5地址', templet: function (d) {
                    const t = `<span class="opTable-item-title">H5地址：</span>`;
                    if (d['html_url']) {
                        return `${t}<a href="${d.html_url}" class="layui-badge" target="_blank" title="${d.html_url}">${d.html_url}</a>`;
                    }
                    return t + '无';
                }
            },
        ],
        page: true,
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
        opTable.reload({
            where: op_common.verifyField(obj.field),
            page: {
                curr: 1
            },
            done: function (res) {
                initSearchInput(res.extends, obj.field);
            },
        }); // 执行重载
    });

    function initSearchInput(data, init_params = {}) {
        const status = {};
        data['status'].map((v, k) => {
            status[k] = v;
        });
        renderSelect('app_id', 'app_id', data['apps'], init_params['app_id']);
        renderSelect('device_type', 'device_type', data['device_type'], init_params['device_type']);
        renderSelect('status', 'status', status, init_params['status']);
        form.render();
    }

    exports('apps', {});

    exports('const', {
        // 状态，0：禁用，1：正常
        STATUS_LOCK: 0,
        STATUS_NORMAL: 1,
        // 设备类型：1: Android, 2: iOS，3：iOS
        DEVICE_TYPE_ANDROID: 1,
        DEVICE_TYPE_IOS: 2,
        DEVICE_TYPE_PC: 3,
    });
});