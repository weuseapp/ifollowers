layui.define(['table', 'form', 'op_common', 'upload', 'laytpl'], function (exports) {
    let table = layui.table, form = layui.form, $ = layui.$, upload = layui.upload;

    let apiUserGet = layui.api.cookie_pool_get_user_list;
    let apiUpdate = layui.api.cookie_pool_update_user;
    let apiDelete = layui.api.cookie_pool_delete_user;
    let apiCreate = layui.api.cookie_pool_create_user;
    let apiDownload = layui.api.cookie_pool_download_excel_template + '?type=user';
    let apiImport = layui.api.cookie_pool_import_user;
    let apiExport = layui.api.cookie_pool_export_user;

    function initUrl() {
        setCacheData('apiUserGet', apiUserGet);
        setCacheData('apiUpdate', apiUpdate);
        setCacheData('apiDelete', apiDelete);
        setCacheData('apiCreate', apiCreate);
        setCacheData('apiImport', apiImport);
        setCacheData('apiExport', apiExport);
        setCacheData('apiDownload', apiDownload);
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
        let name = $(this).data('type');
        if (name === 'create') {
            let params = getUrlParams(location.search);
            obj.data = obj.data ? obj.data : {};
            obj.data['app_id'] = params['app_id'];
        }
        window.data = obj.data;
        window[name](obj.data, table.cache.extends);
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
        url: apiUserGet,
        headers: {
            token: layui.data(layui.setter.tableName).user.token,
        },
        parseData: function (res) {
            window.parent.listData = res;
            checkApiStatusByData(res);
            return getListsFormatByData(res);
        },
        toolbar: true,
        defaultToolbar: ['filter'],
        cols: [[
            {type: 'checkbox', fixed: 'left'},
            {field: 'id', title: '用户ID', sort: true, fixed: true, minWidth: 100},
            {field: 'username', title: 'IG用户名', minWidth: 200, fixed: true},
            {field: 'password', title: 'IG用户密码', hide: true, minWidth: 200},
            {field: 'status', title: '帐号状态', width: 90, toolbar: '#status1', align: 'center'},
            {
                field: 'idle_state', title: '立即更新', width: 90, align: 'center', templet: res => {
                    return res['idle_state'] ? '是' : '否';
                }
            },
            {
                field: 'old_email', title: '帐号优化', width: 140, align: 'center', templet: res => {
                    if (res['new_email'] === '' && res['old_email'] === '') {
                        return `<span class="layui-badge layui-bg-cyan">待填写邮箱</span>`;
                    }
                    if (res['old_email'] === '') {
                        return `<span class="layui-badge">待更换邮箱</span>`;
                    }
                    if (res['challenge_type'] === 'ProactivePasswordChange') {
                        return `<span class="layui-badge layui-bg-orange">待更换密码</span>`;
                    }
                    return `<span class="layui-badge layui-bg-green">已更换邮箱和密码</span>`;
                }
            },
            {field: 'is_manual', title: '人工处理', width: 200, toolbar: '#is_manual_tpl', align: 'center'},
            {field: 'challenge_type', title: '异常原因', width: 310, templet: '#challenge_type_tpl'},
            {
                field: 'created_at', title: '创建时间', hide: true, width: 170, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {
                field: 'updated_at', title: '更新时间', width: 170, fixed: 'right', templet: function (res) {
                    return changeUTCTime(res.updated_at);
                }
            },
            {title: '操作', width: 60 * 4, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function () {
            initSearchInput()
        },
    });

    window.details = function (data) {
        const laytpl = layui.laytpl;
        laytpl(list_info_tpl.innerHTML).render(data, function (html) {
            layer.open({
                type: 1,
                title: '详细信息',
                content: html,
                maxmin: true,
                area: ['70%', '70%'],
            });
        });

    };

    window.initSearchInput = function (init_params = {}) {
        renderSelect('status', 'status', {
            1: '正常',
            0: '停用'
        }, init_params['status']);
        renderSelect('is_manual', 'is_manual', {
            1: '需要',
            0: '无需'
        });
        renderSelect('challenge_type', 'challenge_type', {
            'SubmitPhoneNumberForm': '需手机号验证',
            'RecaptchaChallengeForm': '需人机验证',
            'AcknowledgeForm': '需确认帐号',
            'SelectVerificationMethodForm': '需选择验证方式',
            'VerifyEmailCodeForm': '需验证邮箱',
            'LegacyForceSetNewPasswordForm': '需更新密码',
            'ProactivePasswordChange': '需主动更新密码'
        });
        renderSelect('account_optimization', 'account_optimization', {
            'new_email': '待填写邮箱',
            'old_email': '待更换邮箱',
            'ProactivePasswordChange': '待更换密码'
        });
        form.render();
    };

    window.download_example = function () {
        window.location.href = apiDownload;
    }

    window.export_data = function () {
        let status = $("#status").val();
        let ids = table.checkStatus('lists').data.map(o => o.id).join(',');
        window.location.href = apiExport + "?status=" + status + "&ids=" + ids;
    };

    window.start = function (data) {
        layer.confirm('确定启用吗', function (index) {
            let res = ajaxRequest(getCacheData('apiUpdate'), 'post', {id: data.id, status: 1}, false)['responseJSON'];
            layer.msg(res.msg, {
                icon: res.code === 0 ? 1 : 2,
                time: 1000
            });
            layer.close(index);
            table.reload('lists');
        });
    }

    window.stop = function (data) {
        layer.confirm('确定停用吗', function (index) {
            let res = ajaxRequest(getCacheData('apiUpdate'), 'post', {id: data.id, status: 0}, false)['responseJSON'];
            layer.msg(res.msg, {
                icon: res.code === 0 ? 1 : 2,
                time: 1000
            });
            layer.close(index);
            table.reload('lists');
        });
    }

    upload.render({ //允许上传的文件后缀
        elem: '#import_data',
        url: apiImport,
        accept: 'file', //普通文件
        auto: true,
        headers: {token: layui.data(layui.setter.tableName).user.token},
        size: 10240, // 上限10M
        done: function (res) {
            if (res.code !== 0) {
                layer.msg(res.msg);
            } else {
                let invalidNum = res.data['invalid'].length;
                let allNum = res.data.all.length;
                let insertNum = res.data.insert.length;
                let updateNum = res.data.update.length;
                let effectiveNum = insertNum + updateNum;
                layer.msg(`文件上传成功，上传用户数：${allNum}，有效用户数：${effectiveNum}，新增用户数：${insertNum}，更新用户数：${updateNum}，无效用户数：${invalidNum}`);
                table.reload('lists');
            }
        },
        error: function () {
            layer.msg('上传失败');
        }
    });

    exports('list');

    exports('const', {
        STATUS_NORMAL: 1,
        STATUS_STOP: 0,
    });
});