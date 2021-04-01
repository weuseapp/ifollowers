layui.define(['table', 'form', 'op_common'], function (exports) {
    var $ = layui.$,
        admin = layui.admin,
        table = layui.table,
        form = layui.form;
    var params = getUrlParams(location.search);
    var apiLists = layui.api.push_config_get_push_config_lists;
    var apiCreate = layui.api.push_config_create_push_config;
    var apiUpdate = layui.api.push_config_update_push_config;
    var apiDelete = layui.api.push_config_delete_push_config;

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiCreate', apiCreate);
        setCacheData('apiUpdate', apiUpdate);
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
        cols: [
            [{
                    type: 'checkbox',
                    fixed: 'left'
                },
                {
                    field: 'type',
                    title: '类型',
                    minWidth: 100,
                    templet: '#tpl_type'
                },
                {
                    field: 'title',
                    title: '标题',
                    minWidth: 100
                },
                {
                    field: 'desc',
                    title: '备注',
                    minWidth: 100
                },
                {
                    field: 'is_product',
                    title: '是否正式',
                    templet: '#tpl_is_product'
                },
                {
                    field: 'status',
                    title: '状态',
                    templet: '#tpl_status'
                },
                {
                    field: 'created_at',
                    title: '创建时间',
                    sort: true,
                    templet: function (res) {
                        return changeUTCTime(res.created_at);
                    },
                },
                {
                    field: 'updated_at',
                    title: '更新时间',
                    sort: true,
                    templet: function (res) {
                        return changeUTCTime(res.updated_at);
                    }
                },
                {
                    title: '操作',
                    width: 60 * 2,
                    align: 'center',
                    fixed: 'right',
                    toolbar: '#options'
                },
            ]
        ],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
        },
    });

    initSearchInput = function (data, init_params = {}) {
        renderSelect('is_product', 'is_product', data.is_product, init_params['is_product'])
        renderSelect('type', 'type', data.type, init_params['type'])
        renderSelect('status', 'status', data.status, init_params['status'])
        form.render();
    };

    exports('setting_push_config', {});

    exports('const', {
        // 类型，1：应用内购，2：PAYPAL
        TYPE_PURCHASE: 1,
        TYPE_PAYPAL: 2,
        // 状态，0：删除，1：正常，2：待启用
        STATUS_DELETE: 0,
        STATUS_NORMAL: 1,
        STATUS_PENDING: 2,
    });
});