layui.define(['table', 'form', 'op_common', 'upload'], function (exports) {
    let table = layui.table, form = layui.form, $ = layui.$, upload = layui.upload;

    let apiGet = layui.api.cookie_pool_get_proxy_ip_list;
    let apiUpdate = layui.api.cookie_pool_update_proxy_ip;
    let apiDelete = layui.api.cookie_pool_delete_proxy_ip;
    let apiCreate = layui.api.cookie_pool_create_proxy_ip;
    let apiDownload = layui.api.cookie_pool_download_excel_template + '?type=proxy_ip';
    let apiImport = layui.api.cookie_pool_import_proxy_ip;
    let apiExport = layui.api.cookie_pool_export_proxy_ip;

    function initUrl() {
        setCacheData('apiGet', apiGet);
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
        url: apiGet,
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
            {field: 'id', width: 70, title: 'ID', sort: true, align: 'center'},
            {field: 'ip', title: 'IP', width: 150, align: 'center'},
            {field: 'port', title: '端口', align: 'center'},
            {field: 'user', title: '认证账号', align: 'center'},
            {field: 'password', title: '认证密码', align: 'center'},
            {field: 'fail_num', title: '连续失败次数', align: 'center'},
            {field: 'type', title: '类型'},
            {field: 'country', title: '归属地', align: 'center'},
            {field: 'status', title: '状态', width: 80, align: 'center', toolbar: '#status1'},
            {field: 'time', title: '代理速度(ms)', width: 130},
            {
                field: 'created_at', title: '创建时间', width: 170, sort: true, templet: function (res) {
                    return changeUTCTime(res.created_at);
                }
            },
            {
                field: 'updated_at', title: '最后一次更新时间', width: 170, sort: true, fixed: 'right', templet: function (res) {
                    return changeUTCTime(res.updated_at);
                }
            },
            {title: '操作', width: 60 * 2, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 20,
        done: function () {
            initSearchInput()
        },
    });

    window.details = function (data) {
        layer.open({
            type: 2,
            title: '详细',
            content: `detail.html?data=${data.id}`,
            maxmin: true,
            area: ['70%', '70%'],
        })
    };

    window.initSearchInput = function (init_params = {}) {
        renderSelect('status', 'status', {
            0: '停用',
            1: '正常'
        }, init_params['status']);
        renderSelect('type', 'type', {
            socks5: 'socks5',
            http: 'http'
        }, init_params['status']);

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
            ajaxRequestV2(getCacheData('apiUpdate'), 'post', {id: data.id, status: 1}, function (res) {
                layer.msg(res.msg, {
                    icon: res.code === 0 ? 1 : 2,
                    time: 1000
                });
                layer.close(index);
                table.reload('lists');
            });
        });
    }

    window.stop = function (data) {
        layer.confirm('确定停用吗', function (index) {
            ajaxRequestV2(getCacheData('apiUpdate'), 'post', {id: data.id, status: 0}, function (res) {
                layer.msg(res['msg'], {
                    icon: res['code'] === 0 ? 1 : 2,
                    time: 1000
                });
                layer.close(index);
                table.reload('lists');
            });
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

    exports('cookie_pool_proxy_ip');

    exports('const', {
        STATUS_NORMAL: 1,
        STATUS_STOP: 0,
    });
});