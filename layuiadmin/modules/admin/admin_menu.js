layui.define(['table', 'form', 'op_common', 'common'], function (exports) {
    const $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form;

    const params = getUrlParams(location.search)
        , apiLists = layui.api.menu_get_menu_lists
        , apiCreate = layui.api.menu_create_menu
        , apiUpdate = layui.api.menu_update_menu
        , apiDelete = layui.api.menu_delete_menu;

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
        const type = $(this).data('type');
        window[type] && window[type].call(this, obj.data, table.cache.extends);
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
            {type: 'checkbox', fixed: 'left'},
            // {field: 'id', width: 100, title: 'ID', sort: true},
            {field: 'title', title: '名称', minWidth: 250, templet: '#tpl_title'},
            {
                field: 'icon', title: '图标', width: 60, align: 'center', templet: function (res) {
                    return `<i class="layui-icon ${res.icon}"></i>`;
                }
            },
            {field: 'sort', title: '排序',},
            {field: 'status', title: '状态', templet: '#tpl_status'},
            {
                field: 'created_at', title: '创建时间', sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {title: '操作', width: 60 * 2, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        done: function (res) {
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
        },
    });

    function initSearchInput(data) {
        form.render('select');
    }

    exports('admin_menu');

    exports('const', {
        // 类型，1：目录，2：菜单，3：按钮
        TYPE_DIR: 1,
        TYPE_MENU: 2,
        TYPE_BUTTON: 3,
        // 状态，0：删除，1：正常，2：待启用，3：禁用
        STATUS_DELETE: 0,
        STATUS_NORMAL: 1,
        STATUS_PENDING: 2,
        STATUS_LOCK: 3
    });
});