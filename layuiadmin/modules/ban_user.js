layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form;

    const apiUrl = layui.api.user_ban;

    // 搜索
    form.on('submit(search)', function (obj) {
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
        window.data = obj.data;
        let name = $(this).data('type');
        window[name](obj.data, table.cache.extends);
    });

    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        window.data = obj.data;
        window[obj.event] ? window[obj.event].call(this, obj.data, table.cache.extends) : '';
    });

    // 列表
    table.render({
        elem: '#lists',
        url: apiUrl,
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
            {field: 'username', title: '用户名'},
            {field: 'ip', title: 'IP'},
            {field: 'device_id', title: '设备号'},
            {field: 'parent_id', title: '父级ID'},
            {field: 'level', title: '分级等级',},
            {
                field: 'created_at', title: '创建时间', sort: true, width: 170, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {title: '操作', width: 60 * 2, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function (res) {
        },
    });

    window.update = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '编辑',
            content: `disable-ig-form.html?id=${data.id}`,
            maxmin: true,
            area: ['70%', '50%'],
            btn: ['确定', '取消'],
            yes: debounce(function (dom) {
                // 由于函数防抖传了一个e参数，所以需要从e参数获取index与dom
                let index = dom[0];
                let layero = dom[1];
                // 获取打开窗口的iframe
                let iframeForm = window[`layui-layer-iframe${index}`].layui.form,
                    submit = layero.find('iframe').contents().find('#submit');
                // 监听提交
                iframeForm.on('submit(submit)', function (data) {
                    // 获取提交的字段
                    const newData = data.field;
                    // 将展示的当地时间戳转换为UTC时间
                    for (let key in newData) {
                        if (parent.window.parent['edit_' + key] && newData.hasOwnProperty(key)) {
                            newData[key] = window[`layui-layer-iframe${index}`].layui.layedit.getContent(parent.window.parent[`edit_${key}`]);
                        }
                        if (newData.hasOwnProperty(key) && checkIsDateFormat(newData[key])) {
                            newData[key] = changeUTCTime(newData[key], true);
                        }
                    }
                    // 提交更新数据
                    ajaxRequest(apiUrl + '/' + newData.id, 'put', newData, false);
                    layer.msg('已更新', {
                        icon: 1,
                        time: 1000
                    });
                    layer.close(index);
                    table.reload('lists');
                });
                submit.trigger('click');
            }, 1000, true),
            success: function (layero) {
                let iframeWindow = layero.find('iframe')[0].contentWindow;
                let params = getUrlParams(iframeWindow.location.search);
                let id = params.id;
                let res = ajaxRequest(apiUrl + '/' + id, 'GET', {}, false).responseJSON;
                if (res.code !== 0) {
                    layer.msg('请求数据失败：' + res.msg, {
                        icon: 2,
                        time: 1000
                    });
                }
                $.each(res.data, function (key, value) {
                    var name = `[name=${key}]`;
                    length = layero.find('iframe').contents().find(name).length;
                    if (length === 0) {
                        return true;
                    }
                    let obj = layero.find('iframe').contents().find(name);
                    html = obj.prop('outerHTML');
                    if (html.search(/radio/i) > 0) {
                        let item = $(":radio[name='" + key + "'][value='" + value + "']");
                        item.next().click();
                    } else if (html.search(/checkbox/i) > 0) {
                        let item = $(":checkbox[name='" + key + "'][value='" + value + "']");
                        item.next().click();
                    } else if (html.search(/img/i) > 0) {
                        obj.attr('src', value);
                    } else if (html.search(/input/i) > 0 && html.search(/(text|hidden)/i) > 0){
                        obj.val(value);
                    } else {
                        obj.text(value);
                    }
                });
            }
        })
    };

    window.create = function (data, extend = null) {
        layer.open({
            id: 'create',
            type: 2,
            title: '添加',
            content: `disable-ig-form.html`,
            maxmin: true,
            area: ['70%', '35%'],
            btn: ['确定', '取消'],
            yes: debounce(function (dom) {
                // 由于函数防抖传了一个e参数，所以需要从e参数获取index与dom
                let index = dom[0];
                let layero = dom[1];
                let iframeWindow = window['layui-layer-iframe' + index],
                    submitID = 'submit',
                    submit = layero.find('iframe').contents().find('#' + submitID);
                //监听提交
                iframeWindow.layui.form.on('submit(' + submitID + ')', function (data) {
                    let res = ajaxRequest(apiUrl, 'post', data.field, false)['responseJSON'];
                    if (res.code !== 0) {
                        layer.msg('创建失败：' + res.msg, {
                            icon: 2,
                            time: 1000
                        });
                    } else {
                        layer.msg('已创建', {
                            icon: 1,
                            time: 1000
                        });
                        layer.close(index);
                        table.reload('lists');
                    }
                });
                submit.trigger('click');
            }, 1000, true),
        });
    };

    window.deleteOne = function (data, extend = null) {
        layer.confirm('确定删除', function (index) {
            let res = ajaxRequest(apiUrl + '/' + data.id, 'DELETE', {}, false)['responseJSON'];
            if (res.code !== 0) {
                layer.msg('删除失败：' + res.msg, {
                    icon: 2,
                    time: 1000
                });
            } else {
                layer.msg('已删除', {
                    icon: 1,
                    time: 1000
                });
                layer.close(index);
                table.reload('lists');
            }
        });
    };

    window.deleteMulti = function (data, extend = null) {
        const checkData = table.checkStatus('lists').data; //得到选中的数据
        if (checkData.length === 0) {
            return layer.msg('请选择数据');
        }
        layer.confirm('确定删除吗？', function (index) {
            let ids = checkData.map(o => o.id);
            let res = ajaxRequest(apiUrl, 'DELETE', {
                ids: ids
            }, false)['responseJSON'];
            if (res.code !== 0) {
                layer.msg('删除失败：' + res.msg, {
                    icon: 2,
                    time: 1000
                });
            } else {
                layer.msg('已删除', {
                    icon: 1,
                    time: 1000
                });
                layer.close(index);
                table.reload('lists');
            }
        });
    };

    exports('ban_user');

    exports('const', {
        // 状态，0：禁用，1：正常
        STATUS_LOCK: 0,
        STATUS_NORMAL: 1,
        // 关联类型，1：IG，2：PC
        TYPE_IG: 1,
        TYPE_MEGALIKE_PC: 2,
        // 设备来源，0：未知，2：苹果，3：安卓，默认为0
        PLATFORM_UNKNOWN: 0,
        PLATFORM_PC: 1,
        PLATFORM_APPLE: 2,
        PLATFORM_ANDROID: 3,
        PLATFORM_WEUSE: 4,
    });
});