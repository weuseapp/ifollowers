layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form;

    const apiLists = layui.api.user_get_admin_lists
        , apiCreate = layui.api.user_create_admin
        , apiUpdate = layui.api.user_update_admin
        , apiDelete = layui.api.user_delete_admin;

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

    window.log_lists = function (data) {
        layer.open({
            type: 2,
            title: '详细',
            content: layui.setter.vhtml + 'admin/user/log-list.html?id=' + data.id,
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
            window.parent.listData = res;
            checkApiStatusByData(res);
            return getListsFormatByData(res);
        },
        cols: [[
            {type: 'checkbox', fixed: 'left'},
            {field: 'id', width: 100, title: 'ID', sort: true},
            {field: 'avatar', title: '头像', width: 60, align: 'center', templet: '#tpl_images'},
            {field: 'username', title: '用户名', minWidth: 100},
            {field: 'nickname', title: '昵称', minWidth: 100},
            {field: 'group_title', title: '权限组'},
            {
                field: 'is_admin', title: '超级管理', align: 'center', width: 90, templet: function (res) {
                    return res['is_admin'] ? `<span class="layui-badge layui-bg-blue">是</span>` : `<span class="layui-badge layui-bg-gray">否</span>`
                }
            },
            {field: 'email', title: '邮箱'},
            {field: 'status', title: '状态', templet: '#tpl_status', align: 'center'},
            {
                field: 'updated_at', title: '更新时间', width: 165, sort: true, templet: function (res) {
                    return changeUTCTime(res.updated_at);
                }
            },
            {field: 'last_login_at', title: '最近登录', width: 165, sort: true},
            {title: '操作', width: 65 * 3, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
            renderMsgImagesV2('tpl_images');
        },
    });

    exports('admin_user');

    exports('const', {
        // 状态，0：禁用，1：正常
        STATUS_LOCK: 0,
        STATUS_NORMAL: 1,
    });
});