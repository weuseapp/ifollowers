layui.define(function (exports) {
    const $ = layui.$,
        table = layui.table;
    window.create = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '添加',
            content: `form.html`,
            maxmin: true,
            area: ['70%', '70%'],
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
                    //start 推广操作
                    let Data = {}
                    if (getCacheData('apiCreate') === layui.api.promotion_create_lists) {
                        let languagesArr = getCacheData('languagesArr')
                        let newLanguagesArr = []
                        for (let i = 0; i < languagesArr.length; i++) {
                            let language = {
                                "language": languagesArr[i].language,
                                "title": data.field[languagesArr[i].title],
                                "description": data.field[languagesArr[i].description]
                            };
                            newLanguagesArr.push(language);
                        }
                        Data = {
                            id: data.field.id,
                            action: data.field.action,
                            title: data.field.title,
                            description: data.field.description,
                            logo: getCacheData('uploadImg'),
                            official_app_url: data.field.official_app_url,
                            third_app_url: data.field.third_app_url,
                            package_name: data.field.package_name,
                            activity_name: data.field.activity_name,
                            order: data.field.order,
                            status: data.field.status,
                            platform: data.field.platform,
                            coin: data.field.coin,
                            languages: JSON.stringify(newLanguagesArr)
                        }
                        let regex = /apps/;
                        for (let i in data.field) {
                            if (regex.test(i)) {
                                Data[i] = data.field[i];
                            }
                        }
                        data.field = Data
                    }
                    // end 推广操作
                    ajaxRequestV2(getCacheData('apiCreate'), 'post', data.field, function (res) {
                        if (checkApiStatusByData(res) !== undefined) {
                            return;
                        }
                        if (res.code === 0) {
                            layer.msg(res.msg, {icon: 1, time: 1000});
                            layer.close(index);
                            table.reload('lists');
                        } else {
                            layer.msg(res.msg, {icon: 2, time: 1000});
                        }
                    });
                });
                submit.trigger('click');
            }, 200),
            success: function (layerDom) {
                window[layerDom.find('iframe')[0]['name']].a_data = {data: data, extend: extend};
                layerDom.find('iframe').contents().find('input').removeAttr('disabled');
            }
        });
    };

    window.details = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '详细',
            content: `details.html`,
            maxmin: true,
            area: ['70%', '70%'],
            success: function (layerDom) {
                window[layerDom.find('iframe')[0]['name']].a_data = {data: data, extend: extend};

                ajaxRequestV2(getCacheData('apiDetails'), 'get', {
                    'id': data['id']
                }, res => {
                    if (res.code !== 0) {
                        layer.msg(res.msg, {
                            icon: 2,
                            time: 1000
                        });
                        return false;
                    }
                    $.each(res.data, function (key, value) {
                        const name = `[name=${key}]`;
                        length = layerDom.find('iframe').contents().find(name).length;
                        if (length === 0) {
                            return true;
                        }
                        const type = layerDom.find('iframe').contents().find(name)[0].type;
                        if (type === 'text') {
                            layerDom.find('iframe').contents().find(name).val(value);
                        } else {
                            if (key === 'avatar') {
                                layerDom.find('iframe').contents().find(name).src = value;
                            } else {
                                layerDom.find('iframe').contents().find(name).text(value);
                            }
                        }
                    });
                });
            }
        })
    };

    window.update = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '编辑',
            content: `form.html`,
            maxmin: true,
            area: ['70%', '70%'],
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
                    //start 推广操作
                    let Data = {}
                    if (getCacheData('apiCreate') === layui.api.promotion_create_lists) {
                        let languagesArr = getCacheData('languagesArr')
                        let newLanguagesArr = []
                        for (let i = 0; i < languagesArr.length; i++) {
                            let language = {
                                "language": languagesArr[i].language,
                                "title": data.field[languagesArr[i].title],
                                "description": data.field[languagesArr[i].description]
                            };
                            newLanguagesArr.push(language);
                        }
                        Data = {
                            id: data.field.id,
                            action: data.field.action,
                            title: data.field.title,
                            description: data.field.description,
                            logo: getCacheData('uploadImg'),
                            official_app_url: data.field.official_app_url,
                            third_app_url: data.field.third_app_url,
                            package_name: data.field.package_name,
                            activity_name: data.field.activity_name,
                            order: data.field.order,
                            status: Number(data.field.status),
                            platform: data.field.platform,
                            coin: data.field.coin,
                            languages: JSON.stringify(newLanguagesArr)
                        }
                        let regex = /apps/;
                        for (let i in data.field) {
                            if (regex.test(i)) {
                                Data[i] = data.field[i];
                            }
                        }
                        data.field = Data
                    }
                    // end 推广操作
                    // 获取提交的字段
                    const newData = data.field;
                    // 将展示的当地时间戳转换为UTC时间
                    for (let key in newData) {
                        if (parent.window.parent["edit_" + key]) {
                            newData[key] = window[`layui-layer-iframe${index}`].layui.layedit.getContent(parent.window.parent[`edit_${key}`]);
                        }
                        if (checkIsDateFormat(newData[key])) {
                            newData[key] = changeUTCTime(newData[key], true);
                        }
                    }
                    // 提交更新数据
                    ajaxRequestV2(getCacheData('apiUpdate'), 'post', newData, (res) => {
                        if (checkApiStatusByData(res) !== undefined) {
                            return;
                        }
                        if (res['code'] === 0) {
                            layer.msg(res['msg'], {icon: 1, time: 1000});
                            layer.close(index);
                            table.reload('lists');
                        } else {
                            layer.msg(res['msg'], {icon: 2, time: 2000});
                        }
                    });
                    return false;
                });
                submit.trigger('click');
            }, 200),
            success: function (layero) {
                window[layero.find('iframe')[0]['name']].a_data = {};
                window[layero.find('iframe')[0]['name']].a_data.data = data;
                window[layero.find('iframe')[0]['name']].a_data.extend = extend;
                // 打开成功遍历并初始化数据
                setCacheData('updateData', data);
                setCacheData('updateExtend', extend);
                $.each(data, function (key, value) {
                    // 初始化数据
                    const name = `[name='${key}']`;
                    const length = layero.find('iframe').contents().find(name).length;
                    if (length === 0) {
                        return true;
                    }
                    const type = layero.find('iframe').contents().find(name)[0].type;
                    if (type === 'checkbox' && typeof value === `object`) {
                        $.each(value, function (sub_key, sub_value) {
                            layero.find('iframe').contents().find(name).eq(sub_value).attr('checked', true);
                        })
                    } else if (type === 'checkbox') {
                        if (value) {
                            layero.find('iframe').contents().find(name).attr('checked', true);
                        }
                    } else if (type === 'password') {
                        // layero.find('iframe').contents().find(name).val('');
                    } else if (type === 'radio') {
                        const radio = layero.find('iframe').contents().find(name);
                        $.each(radio, function (key) {
                            if (radio[key].value == value) {
                                layero.find('iframe').contents().find(name + `[value=${value}]`).prop("checked", true)
                            }
                        })
                    } else {
                        // 将UTC时间转换为当地时间
                        if (checkIsDateFormat(value)) {
                            value = changeUTCTime(value);
                        }
                        layero.find('iframe').contents().find(name).val(value);
                    }
                });
            }
        })
    };

    window.deleteOne = function (data, extend = null) {
        layer.confirm('确定删除', function (index) {
            ajaxRequestV2(getCacheData('apiDelete'), 'post', {ids: data.id,}, function (res) {
                if (checkApiStatusByData(res) !== undefined) {
                    return;
                }
                layer.msg(res.msg, {
                    icon: res.code === 0 ? 1 : 2,
                    time: 1000
                });
                layer.close(index);
                table.reload('lists');
            });
        });
    };

    window.deleteMulti = function (data, extend = null) {
        const checkData = table.checkStatus('lists').data; //得到选中的数据
        if (checkData.length === 0) {
            return layer.msg('请选择数据');
        }
        layer.confirm('确定删除吗？', function (index) {
            let ids = checkData.map(o => o.id);
            ajaxRequestV2(getCacheData('apiDelete'), 'post', {ids: ids,}, function (res) {
                if (checkApiStatusByData(res) !== undefined) {
                    return;
                }
                layer.msg(res['msg'], {
                    icon: res['code'] === 0 ? 1 : 2,
                    time: 1000
                });
                layer.close(index);
                table.reload('lists');
            });
        });
    };

    exports('op_common', {
        verifyField: function (fields) {
            const data = {};
            $.each(fields, (k, v) => {
                if (v !== '') {
                    data[k] = v;
                }
            });
            return data;
        }
    });
})