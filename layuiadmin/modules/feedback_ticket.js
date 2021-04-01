layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form;
    const apiLists = layui.api.feedback_get_ticket_lists;
    const apiDetails = layui.api.feedback_get_ticket_details;
    const apiUpdate = layui.api.feedback_update_ticket;

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiDetails', apiDetails);
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
        if (obj.event === 'set_status') {
            set_status(obj);
            return;
        }
        window[obj.event] ? window[obj.event].call(this, obj.data, table.cache.extends) : '';
    });

    const set_status = function(obj) {
        const data = obj.data;
        layer.open({
            content: `<div class="layui-form">
                        <div class="layui-form-item">
                            <label class="layui-form-label">请选择</label>
                            <div class="layui-input-block">
                                <select name="status">
                                    <option value="0">待解决</option>
                                    <option value="${layui['const'].STATUS_ACCEPTED}" ${data['status'] === layui['const'].STATUS_ACCEPTED ? 'selected' : ''}>已受理</option>
                                    <option value="${layui['const'].STATUS_PROCESSED}" ${data['status'] === layui['const'].STATUS_PROCESSED ? 'selected' : ''}>待回复</option>
                                    <option value="${layui['const'].STATUS_FINISHED}" ${data['status'] === layui['const'].STATUS_FINISHED ? 'selected' : ''}>完成</option>
                                </select>
                            </div>
                        </div>
                    </div>`
            , title: `修改工单【${data['ticket_sn']}】状态`
            , area: ['500px', '350px']
            , success: function (layerDom, index) {
                form.render('select');
            }
            , yes: function (index, layerDom) {
                const status = parseInt(layerDom.find('select[name=status]').val());
                if (status === data['status']) {
                    return layer.msg('无变更', {icon: 7});
                }
                layer.close(index);
                ajaxRequestV2(apiUpdate, 'post', {'id': data['id'], 'status': status}, function (res) {
                    if (res['code'] === 0) {
                        // 直接更新表格行，不被动刷新表格了
                        obj.update({
                            status: status
                        });
                        layer.msg(res['msg'], {icon: 1});
                    } else {
                        layer.msg(res['msg'], {icon: 2});
                    }
                });
            }
        });
    };

    window.chat_lists = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '列表',
            content: layui.setter.vhtml + 'feedback/ticket/chat-list.html?id=' + data.id,
            maxmin: true,
            area: ['70%', '70%'],
            success: function (layero, index) {
                let res = ajaxRequest(layui.api.feedback_get_ticket_details, 'get', {id: data.id}, false).responseJSON;
                let content = layero.find('iframe').contents().find('#content');
                let _html = '';
                $.each(res.data.lists, function (key, value) {
                    let is_admin = value['user_id'] === 0;
                    let username = is_admin ? value['adminname'] : value['username'];
                    let align = is_admin ? ' align="right" ' : '';
                    let bg_color = is_admin ? ' layui-bg-gray ' : '';
                    let _html_time = `<label style="font-size: 5px">&nbsp;&nbsp;&nbsp;&nbsp;时间：${value['created_at']}</label>`;
                    _html += `<div ${align}><fieldset class="layui-elem-field ${bg_color}" style="width: 80%;"><legend>${username}${_html_time}</legend>`;
                    if (value['content_type'] === 1) {
                        _html += `<div class="layui-field-box">${value['contents']}</div></fieldset></div>`;
                    } else if (value['content_type'] === 2) {
                        let width = value['content_meta']['width'] * 0.3;
                        let height = value['content_meta']['height'] * 0.3;
                        width = width ? width : 100;
                        height = height ? height : 100;
                        _html += `<div class="layui-field-box layer-photos-demo" id="layer-photos-contents">
                            <img layer-src="${value['contents']}" src="${value['contents']}" style="max-height:145px;max-width: 120px;vertical-align:middle;" alt="contents">
                            </div></fieldset></div><br/>`;
                    }
                });
                layero.find('iframe').contents().find('#content').html(_html);
            }
        })
    };

    window.user = function (obj, extend = null) {
        layer.open({
            type: 2,
            title: '用户',
            content: layui.setter.vhtml + 'user/user/list.html?user_id=' + obj.data.user_id,
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
            {field: 'id', width: 90, title: 'ID', sort: true},
            {
                field: 'app_name', title: '应用名称', minWidth: 120, templet: function (res) {
                    let app = parent.listData.data.extends.apps[res.app_id];
                    return app !== undefined ? app : '未知';
                }
            },
            {field: 'user_id', title: '用户', templet: '#tpl_user_id', align: 'center'},
            {field: 'ticket_sn', title: '工单号'},
            {field: 'title', title: '标题'},
            {field: 'is_read', title: '是否已读', templet: '#tpl_is_read', align: 'center'},
            {field: 'status', title: '状态', templet: '#tpl_status', align: 'center', event: 'set_status'},
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
            {title: '操作', width: 80, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
        },
    });

    initSearchInput = function (data, init_params = {}) {
        renderSelect('app_id', 'app_id', data.apps, init_params['app_id']);
        form.render();
    };

    exports('feedback_ticket', {});

    exports('const', {
        // 状态，0：待解决，1：已受理，2：待回复，3：完成
        STATUS_WAITING: 0,
        STATUS_ACCEPTED: 1,
        STATUS_PROCESSED: 2,
        STATUS_FINISHED: 3,
    });
});