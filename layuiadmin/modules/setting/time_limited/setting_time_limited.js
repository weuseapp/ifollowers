layui.define(['table', 'form', 'op_common', 'util'], function (exports) {
    const $ = layui.$, table = layui.table, form = layui.form, util = layui.util;
    const apiLists = layui.api.time_limited_get_lists;
    const apiCreate = layui.api.time_limited_create;
    const apiUpdate = layui.api.time_limited_update;
    const apiDelete = layui.api.time_limited_delete;

    const initUrl = function () {
        setCacheData('apiDelete', apiDelete);
    }

    const form_submit = function (index, layerDom, obj) {
        const body = layer.getChildFrame('body', index);
        const iframeWin = window[layerDom.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：

        // 监听表单提交
        iframeWin.layui.form.on('submit(submit)', function (data) {
            const field = data.field;
            if (!field['app_id']) {
                layer.msg('至少选择一个应用', {icon: 7});
                return;
            }
            const app_ids = field['app_id'];
            delete field['app_id'];
            let app_id_arr = app_ids.split(',');
            let app_id = {};
            for (let i in app_id_arr) {
                if (app_id_arr.hasOwnProperty(i)) {
                    app_id[`app_id[${i}]`] = app_id_arr[i];
                }
            }
            Object.assign(field, app_id);
            ajaxRequestV2(field['id'] ? apiUpdate : apiCreate, 'post', field, function (res) {
                if (res['code'] === 0) {
                    layer.close(index);
                    if (obj) {
                        obj.update({
                            'app_id': app_ids,
                            'range_at': field['range_at'],
                            'status': field['status'],
                            'title': field['title'],
                            'type': field['type'],
                            'sort': field['sort'],
                            'hour_range': field['hour_range'],
                            'week[0]': field['week[0]'],
                            'week[1]': field['week[1]'],
                            'week[2]': field['week[2]'],
                            'week[3]': field['week[3]'],
                            'week[4]': field['week[4]'],
                            'week[5]': field['week[5]'],
                            'week[6]': field['week[6]'],
                            'updated_at': util.toDateString(new Date().getTime() - 8 * 3600 * 1000)
                        });
                    }
                    layer.msg(res['msg'], {icon: 1});
                    if (!field['id']) {
                        table.reload('lists');
                    }
                } else {
                    layer.msg(res['msg'], {icon: 2});
                }
            });
        });
        // 触发表单提交
        body.find('#submit').trigger('click');
    }

    const update = function (obj) {
        layer.open({
            type: 2,
            title: '编辑',
            content: 'form.html',
            maxmin: true,
            area: ['50%', '90%'],
            btn: ['确定', '取消'],
            yes: function (index, layerDom) {
                form_submit(index, layerDom, obj);
            },
            success: function (layerDom) {
                const iframeWin = window[layerDom.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
                iframeWin.a_data = {'data': obj.data, 'extend': table.cache.extends};
            }
        });
    }

    const create = function () {
        layer.open({
            type: 2,
            title: '添加',
            content: 'form.html',
            maxmin: true,
            area: ['50%', '90%'],
            btn: ['确定', '取消'],
            yes: function (index, layerDom) {
                form_submit(index, layerDom);
            },
            success: function (layerDom) {
                const iframeWin = window[layerDom.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
                iframeWin.a_data = {'data': null, 'extend': table.cache.extends};
            }
        });
    }

    // 搜索
    form.on('submit(search)', function (obj) {
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
        const event_type = $(this).data('type')
        if (event_type === 'create') {
            create(obj);
            return;
        }
        window[event_type] ? window[event_type].call(this, obj.data, table.cache.extends) : '';
    });

    const app_names = function (obj) {
        let html = '';
        let apps = window.parent['listData'].data.extends['apps'];
        let app_id = obj.data['app_id'] ? obj.data['app_id'].split(',') : [];
        if (app_id.length === 0) {
            layer.msg('暂无应用，可通过编辑添加');
            return;
        }
        $.each(apps, function (key, value) {
            if (app_id.indexOf(key) >= 0) {
                html += `<div class="layui-col-md3"><span class="layui-badge layui-bg-blue">${value}</span></div>`;
            }
        });
        layer.open({
            title: '应用'
            , content: `<div class="layui-fluid">${html}</div>`
            , area: ['70%', '70%']
            , btn: '关闭'
        });
    }

    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        if (obj.event === 'app_names') {
            app_names(obj);
            return;
        }
        initUrl();
        window.data = obj.data;
        if (obj.event === 'update') {
            update(obj);
            return;
        }
        window[obj.event] ? window[obj.event].call(this, obj.data, table.cache.extends) : '';
    });

    // 列表
    table.render({
        id: 'lists',
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
            {field: 'id', title: 'ID', minWidth: 100},
            {field: 'title', title: '标题', minWidth: 100},
            {field: 'status', title: '状态', width: 70, align: 'center', templet: '#tpl_status'},
            {
                field: 'app_id',
                title: '应用数',
                sort: true,
                templet: '#tpl_app_id',
                style: 'cursor: pointer;',
                event: 'app_names',
                align: 'center'
            },
            {
                field: 'range_at', title: '日期范围', align: 'center', sort: true, templet: function (res) {
                    if (!res['range_at'] || res['type'] === 1) {
                        return '无固定期限（每周）';
                    }
                    return changeUTCTime(res['start_at']).substr(0, 10) + ' - ' + changeUTCTime(res['end_at']).substr(0, 10);
                },
                minWidth: 190
            },
            {
                field: 'hour_range', title: '时间范围', width: 160, align: 'center', templet: function (d) {
                    if (d['hour_range']) {
                        return d['hour_range'];
                    }
                    return '全天';
                }
            },
            {field: 'running', title: '活动时效', width: 105, align: 'center', templet: '#tpl_running'},
            {
                field: 'created_at', width: 165, title: '创建时间', align: 'center', sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                },
            },
            {
                field: 'updated_at', width: 165, title: '更新时间', align: 'center', sort: true, templet: function (res) {
                    return changeUTCTime(res.updated_at);
                }
            },
            {title: '操作', width: 140, align: 'center', fixed: 'right', unresize: true, toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function (res) {
            fixedTableHeight('#lists');
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
        },
    });

    window.initSearchInput = function (data, init_params = {}) {
        renderSelect('is_product', 'is_product', data.is_product, init_params['is_product'])
        renderSelect('type', 'type', data.type, init_params['type'])
        renderSelect('status', 'status', data.status, init_params['status'])
        form.render();
    };

    exports('setting_time_limited', {});

    exports('const', {
        STATUS_LOCK: 0,
        STATUS_NORMAL: 1,
    });
});