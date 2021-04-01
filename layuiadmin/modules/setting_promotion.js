layui.define(['table', 'form', 'op_common'], function (exports) {
    var $ = layui.$,
        admin = layui.admin,
        table = layui.table,
        form = layui.form;
    var params = getUrlParams(location.search);
    var apiLists = layui.api.promotion_get_lists;
    var apiCreate = layui.api.promotion_create_lists;
    var apiUpdate = layui.api.promotion_get_lists;
    var apiDetails = layui.api.promotion_get_details_lists;
    var apiDelete = layui.api.promotion_delete_lists;
    var apiApps = layui.api.select_app_name;

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiCreate', apiCreate);
        setCacheData('apiUpdate', apiUpdate);
        setCacheData('apiDelete', apiDelete);
        setCacheData('apiDetails', apiDetails);
        setCacheData('apiApps', apiApps);
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
            let apps = ajaxRequest(apiApps, 'GET', {}, false);
            res.data.extends = apps.data;
            window.parent.listData = res;
            checkApiStatusByData(res);
            return getNewListsFormatByData(res);
        },
        cols: [
            [
                {
                    type: 'checkbox',
                    fixed: 'left'
                },
                {
                    field: 'id',
                    title: 'ID',
                    width: 70,
                },
                {
                    field: 'avatar',
                    title: '头像',
                    width: 100,
                    align: 'center',
                    templet: function (res) {
                        let url = layui.setter.apiUrl
                        return `<img name='tpl_images' style="display: inline-block; width: 50%; height: 100%;" src=${ res.logo}>`;
                    }
                },
                {
                    field: 'title',
                    title: '标题',
                    minWidth: 100
                },
                {
                    field: 'description',
                    title: '描述',
                    minWidth: 100
                },
                {
                    field: 'platform',
                    title: '平台',
                    minWidth: 100,
                    templet: res => {
                        return `<span class="layui-badge layui-bg-cyan">${res.platform}</span>`
                    }
                },
                {
                    field: 'coin',
                    title: '金币数',
                    minWidth: 100,
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
            fixedTableHeight('#lists');
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
        },
    });

    initSearchInput = function (data, init_params = {}) {
        form.render();
    };

    exports('setting_promotion', {});

    exports('const', {
        // 类型，1：应用内购，2：PAYPAL
        TYPE_PURCHASE: 1,
        TYPE_PAYPAL: 2,
        // 状态，0：删除，1：正常，2：待启用
        STATUS_DELETE: 0,
        STATUS_NORMAL: 1,
        STATUS_PENDING: 2,

        PLATFORM_IOS: 'iOS',
        PLATFORM_ANDROID: 'Android',
        PLATFORM_H5: 'H5',
    });
});