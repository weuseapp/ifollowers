layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$, table = layui.table, form = layui.form;
    const params = getUrlParams(location.search);
    let apiLists = layui.api.user_get_user_logs;
    if (params['id']) {
        apiLists += '?user_id=' + params['id'];
    }

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
            done: null,
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
            {field: 'id', width: 100, title: 'ID', sort: true},
            {
                field: 'app_name', title: '应用名称', minWidth: 120, templet: function (res) {
                    let app = parent.listData.data.extends['apps'][res.app_id];
                    return app !== undefined ? app : '未知';
                }
            },
            {
                field: 'username', title: '用户名', templet: function (res) {
                    if (res['ig_url']) {
                        return `<a href="${res['ig_url']}" class="layui-badge" target="_blank" title="点击查看IG用户">${res['username']}</a>`;
                    } else {
                        return res.username;
                    }
                }
            },
            {field: 'total', title: '关联数量', sort: true},
            {
                field: 'event', title: '操作事件', templet: function (res) {
                    let data = window.parent['listData'].data.extends.event;
                    return data[res.event] || '暂无数据';
                }
            },
            {
                field: 'operate', title: '操作状态', templet: function (res) {
                    let data = window.parent['listData'].data.extends.operate;
                    return data[res.operate];
                }
            },
            {
                field: 'currency', title: '操作货币', templet: function (res) {
                    let data = window.parent['listData'].data.extends.currency;
                    return data[res.currency];
                }
            },
            {field: 'related', title: '关联字段'},
            {
                field: 'created_at', width: 165, title: '创建时间', sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
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

    window.initSearchInput = function (data, init_params = {}) {
        renderSelect('event', 'event', data.event, init_params['event'] || null);
        renderSelect('operate', 'operate', data.operate, init_params['operate'] || null);
        renderSelect('currency', 'currency', data.currency, init_params['currency'] || null);
        renderSelect('app_id', 'app_id', data['apps'], init_params['app_id'] || null);
        form.render();
    };

    exports('user_logs');
});