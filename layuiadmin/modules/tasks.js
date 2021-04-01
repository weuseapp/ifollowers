layui.define(['table', 'form', 'op_common'], function (exports) {
    const $ = layui.$, dropdown = layui.dropdown, op_common = layui.op_common, table = layui.table, form = layui.form;
    const params = getUrlParams(location.search);
    const apiLists = layui.api.tasks_get_task_lists + '?user_id=' + params['user_id'];
    const apiCreate = layui.api.tasks_create_task;
    const apiUpdate = layui.api.tasks_update_task;
    const apiDetails = layui.api.tasks_task_detail;
    const apiTransferThird = layui.api.tasks_transfer_third;

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiCreate', apiCreate);
        setCacheData('apiUpdate', apiUpdate);
        setCacheData('apiDetails', apiDetails);
    }

    function initTableDropDown(data) {
        for (let item of data) {
            dropdown.suite('#layuidropdown_' + item['id'], {
                data: item
            });
        }
    }

    // 列表行外操作：创建，多个删除
    $('.op-methods').on('click', function (obj) {
        initUrl();
        window.data = obj.data;
        const type = $(this).data('type');
        window[type] ? window[type].call(this, obj.data, table.cache.extends) : '';
    });
    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        initUrl();
        window.data = obj.data;
        const event = obj.event;
        window[event] ? window[event].call(this, obj.data, table.cache.extends) : '';
    });

    // 列表
    const opTable = layui.opTable.render({
        elem: '#lists',
        url: apiLists,
        headers: {
            token: layui.data(layui.setter.tableName).user.token,
        },
        toolbar: true,
        defaultToolbar: ['filter'],
        parseData: function (res) {
            window.parent.listData = res;
            checkApiStatusByData(res);
            return getListsFormatByData(res);
        },
        cols: [[
            {field: 'id', width: 90, title: 'ID', sort: true},
            // {field: 'app_name', title: '应用', align: 'center'},
            // {
            //     field: 'pic', title: '图片', templet: function (res) {
            //         let url = '';
            //         if (res.type === layui.const.TYPE_LIKES || res.type === layui.const.TYPE_VIEW) {
            //             url = res.media_thumbnail;
            //         } else if (res.type === layui.const.TYPE_FOLLOWER || res.type === layui.const.TYPE_GOLD_FOLLOWER) {
            //             url = res.avatar;
            //         }
            //         return `<img name='tpl_images' style="display: inline-block; width: 50%; height: 100%;" src=${url}>`;
            //     }
            // },
            // {
            //     field: 'related', title: '关联用户/帖子', templet: function (d) {
            //         let filed = `无`;
            //         if (d['type'] === 1 || d['type'] === 3) {
            //             if (d['link_short']) {
            //                 filed = `<a href="//instagram.com/p/${d['link_short']}" class="layui-badge" target="_blank" title="帖子">${d['link_short']}</a>`;
            //             }
            //         } else if (d['type'] === 2) {
            //             if (d['username']) {
            //                 filed = `<a href="//instagram.com/${d['username']}" class="layui-badge layui-bg-blue" target="_blank" title="帖子">${d['username']}</a>`;
            //             }
            //         }
            //         return filed;
            //     }
            // },
            {
                field: 'is_paid_user', title: '付费用户', align: 'center', templet: function (res) {
                    if (res.is_paid_user === 1) {
                        return `<span class="layui-badge layui-bg-blue">是</span>`
                    } else {
                        return `<span class="layui-badge layui-bg-gray">否</span>`
                    }
                }
            },
            // {field: 'name', title: '任务名'},
            {field: 'type', title: '任务类型', templet: '#tpl_type'},
            {field: 'total', title: '任务数'},
            {field: 'state', title: '完成状态', width: 90, templet: '#tpl_state', align: 'center'},
            {
                field: 'pic', title: '完成数量', width: 90, templet: function (res) {
                    if (res.finished <= 0) {
                        return res.finished + res.finished_third + res.finished_manual;
                    } else {
                        return res.finished;
                    }
                }
            },
            {
                field: 'finished_at', title: '完成时间', sort: true, width: 160, templet: function (d) {
                    if (d['finished_at'] === '0000-00-00 00:00:00') {
                        return '未完成';
                    }
                    return changeUTCTime(d['finished_at']);
                }
            },
            {
                field: 'created_at', title: '创建时间', sort: true, width: 160, templet: function (d) {
                    return changeUTCTime(d['created_at']);
                }
            },
            {title: '操作', width: 140, align: 'left', fixed: 'right', toolbar: '#options'},
        ]],
        //  展开的列配置
        openCols: [
            {field: 'app_name', title: '应用'},
            {
                field: 'username', title: 'IG用户名', templet: function (d) {
                    return `<span class="opTable-item-title">IG用户名：</span>
                            <a href="//instagram.com/${d['username']}" class="layui-badge" target="_blank" title="打开主页">${d['username']}</a>`;
                }
            },
            {
                field: 'related', title: '关联用户/帖子', templet: function (d) {
                    const t = `<span class="opTable-item-title">关联用户/帖子：</span>`;
                    let filed = `暂无`;
                    if (d['type'] === 1 || d['type'] === 3) {
                        if (d['link_short']) {
                            filed = `<a href="//instagram.com/p/${d['link_short']}" class="layui-badge" target="_blank" title="打开帖子">${d['link_short']}</a>`;
                        }
                    } else if (d['type'] === 2) {
                        if (d['username']) {
                            filed = `<a href="//instagram.com/${d['username']}" class="layui-badge layui-bg-blue" target="_blank" title="打开帖子">${d['username']}</a>`;
                        }
                    }
                    return t + filed;
                }
            },
        ],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
            initTableDropDown(res['data']);
        },
    });

    // 搜索
    form.on('submit(search)', function (obj) {
        initUrl();
        window.data = obj.data;
        opTable.reload({
            where: op_common.verifyField(obj.field),
            page: {
                curr: 1
            },
            done: function (res) {
                initSearchInput(res.extends, obj.field);
                initTableDropDown(res['data']);
            },
        }); // 执行重载
    });

    window.initSearchInput = function (data, init_params = {}) {
        renderSelect('app_id', 'app_id', data.apps, init_params['app_id']);
        renderSelect('type', 'type', data.type, init_params['type']);
        renderSelect('state', 'state', data.state, init_params['state']);
        form.render();
    };

    window.process = function (data, extend = null) {
        comfirmOperate(apiUpdate, {id: data.id, state: layui.const.STATE_PROCESS});
    };

    window.finished = function (data, extend = null) {
        comfirmOperate(apiUpdate, {id: data.id, state: layui.const.STATE_FINISH});
    };

    window.stop = function (data, extend = null) {
        comfirmOperate(apiUpdate, {id: data.id, state: layui.const.STATE_STOP});
    };

    window.cancel = function (data, extend = null) {
        comfirmOperate(apiUpdate, {id: data.id, state: layui.const.STATE_CANCEL});
    };

    window.transfer_third = function (data, extend = null) {
        comfirmOperate(apiTransferThird, {id: data.id, state: layui.const.STATE_STOP});
    };

    exports('tasks', {});

    exports('const', {
        // 商品状态，-2：已取消（帖子已删除），-1：暂停中（隐私），0：进行中，1：完成，2：部分完成
        STATE_CANCEL: -2,
        STATE_STOP: -1,
        STATE_PROCESS: 0,
        STATE_FINISH: 1,
        STATE_PARTIAL: 2,
        // 任务类型：1：加赞，2：加粉，3：加观看数，4：黄金加粉
        TYPE_LIKES: 1,
        TYPE_FOLLOWER: 2,
        TYPE_VIEW: 3,
        TYPE_GOLD_FOLLOWER: 4,
        // 帖子类型：1：单图片（旧版为0），2：单视频（旧版为0），3：混合，4：IGTV
        MEDIA_TYPE_SINGLE_PICTURE: 1,
        MEDIA_TYPE_SINGLE_VIDEO: 2,
        MEDIA_TYPE_HYBRID_MUTABLE: 3,
        MEDIA_TYPE_IGTV: 4,
    });

    exports('options_menu', {
        menus: [
            {layIcon: 'layui-icon-username', txt: '个人中心', event: 'usercenter'},
            {layIcon: 'layui-icon-set', txt: '设置', event: 'set'},
            {layIcon: 'layui-icon-logout', txt: '退出登录', event: 'loginout'}
        ]
    });
});