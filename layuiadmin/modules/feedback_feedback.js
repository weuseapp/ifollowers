layui.define(['table', 'form', 'op_common'], function (exports) {
    var $ = layui.$, admin = layui.admin, table = layui.table, form = layui.form;

    var apiLists = layui.api.feedback_get_feedback_lists;
    var apiDetails = layui.api.feedback_get_feedback_details;
    var apiCreate = layui.api.user_create_admin;

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiDetails', apiDetails);
        setCacheData('apiCreate', apiCreate);
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
            {field: 'id', width: 90, title: 'ID', sort: true},
            {
                field: 'app_name', title: '应用名称', minWidth: 120, templet: function (res) {
                    let app = parent.listData.data.extends.apps[res.app_id];
                    return app !== undefined ? app : '未知';
                }
            },
            {field: 'user_id', title: '用户', templet: '#tpl_user_id', align: 'center'},
            {field: 'title', title: '标题'},
            {field: 'email', title: '邮箱'},
            {field: 'is_read', title: '是否已读', templet: '#tpl_is_read', align: 'center'},
            {
                field: 'created_at', title: '创建时间', sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#options'},
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

    user = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '用户',
            content: layui.setter.vhtml + 'user/user/list.html?user_id=' + data.user_id,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    reply = function (data, extend = null) {
        layer.open({
            type: 2,
            title: '回复',
            content: layui.setter.vhtml + 'feedback/feedback/reply.html',
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    exports('feedback_feedback', {});

    exports('const', {
        // 商品状态，0：进行中，1：完成
        STATE_PROCESS: 0,
        STATE_FINISH: 1,
        // 任务类型：1：加赞，2：加粉，3：加观看数
        TYPE_LIKES: 1,
        TYPE_FOLLOWER: 2,
        TYPE_VIEW: 3,
        // 帖子类型：1：单图片（旧版为0），2：单视频（旧版为0），3：混合，4：IGTV
        MEDIA_TYPE_SINGLE_PICTURE: 1,
        MEDIA_TYPE_SINGLE_VIDEO: 2,
        MEDIA_TYPE_HYBRID_MUTABLE: 3,
        MEDIA_TYPE_IGTV: 4,
    });
});