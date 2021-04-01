layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$
        , admin = layui.admin
        , table = layui.table
        , form = layui.form;

    const apiLists = layui.api.settings_get_config_lists;
    const apiCreate = layui.api.settings_create_config;
    const apiUpdate = layui.api.settings_update_config;
    const apiDelete = layui.api.settings_delete_config;

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
        const event = $(this).data('type');
        if (event === 'create') {
            renderSelect('type', 'type', table.cache.extends.type, !isEmpty(obj.data) ? obj.data.type : null);
            $("#form")[0].reset();
            form.render(null, 'editForm');
            layer.open({
                type: 1,
                title: '添加平台配置',
                content: $('#form_tpl'),
                maxmin: true,
                area: ['70%', '70%'],
                btn: ['确定', '取消'],
                yes: function (index, dom) {
                    // 提交更新数据
                    dom.find('#create').trigger('click');
                    layer.close(index);
                }
            });
            return;
        }
        window[event] && window[event].call(this, obj.data, table.cache.extends);
    });
    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        initUrl();
        window.data = obj.data;
        if (obj.event === 'update') {
            renderSelect('type', 'type', table.cache.extends.type, !isEmpty(obj.data) ? obj.data.type : null);
            form.val('editForm', obj.data);
            layer.open({
                type: 1,
                title: '编辑平台配置',
                content: $('#form_tpl'),
                maxmin: true,
                area: ['70%', '70%'],
                btn: ['确定', '取消'],
                yes: function (index, dom) {
                    // 提交更新数据
                    dom.find('#update').trigger('click');
                    layer.close(index);
                }
            });
            return;
        }
        window[obj.event] && window[obj.event].call(this, obj.data, table.cache.extends);
    });

    // 监听编辑提交
    form.on('submit(update)', function (data) {
        if (!data.field.hasOwnProperty('is_open')) {
            data.field['is_open'] = '0';
        }
        ajaxRequestV2(apiUpdate, 'post', data.field, (res) => {
            if (res['code'] === 0) {
                layer.msg(res['msg'], {icon: 1, time: 1000});
                table.reload('lists');
            } else {
                layer.msg(res['msg'], {icon: 2, time: 1000});
            }
        });
    });

    // 监听添加提交
    form.on('submit(create)', function (data) {
        if (!data.field.hasOwnProperty('is_open')) {
            data.field['is_open'] = '0';
        }
        ajaxRequestV2(apiCreate, 'post', data.field, (res) => {
            if (res['code'] === 0) {
                layer.msg(res['msg'], {icon: 1, time: 1000});
                table.reload('lists');
            } else {
                layer.msg(res['msg'], {icon: 2, time: 1000});
            }
        });
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
            {field: 'id', width: 90, title: 'ID', sort: true},
            {field: 'name', title: '名称'},
            {field: 'description', title: '描述'},
            {field: 'config_key', title: '键'},
            {field: 'config_value', title: '值'},
            {field: 'type', title: '配置值类型'},
            // {field: 'is_open', width: 90, title: '是否开放', templet: '#tpl_is_open', align: 'center'},
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
            {title: '操作', width: 60 * 2, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
        }
    });

    exports('setting_config', {});

});