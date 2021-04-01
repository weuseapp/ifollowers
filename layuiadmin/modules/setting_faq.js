layui.define(['table', 'form', 'layedit', 'op_common'], function (exports) {
    var $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form, edit = layui.layedit;
    var params = getUrlParams(location.search);
    var apiLists = layui.api.faq_get_faq_lists;
    var apiCreate = layui.api.faq_create_faq;
    var apiUpdate = layui.api.faq_update_faq;
    var apiDelete = layui.api.faq_delete_faq;

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
        cols: [[
            {type: 'checkbox', fixed: 'left'},
            {field: 'language', title: '语言', width: 180, templet: '#tpl_language'},
            {field: 'title', title: '标题', minWidth: 280, templet: '#tpl_title'},
            {field: 'contents', title: '内容', width: 180},
            {field: 'sort', title: '排序'},
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

    initSearchInput = function (data, init_params = {}) {
    };

    exports('setting_faq', {});

    exports('const', {});
});