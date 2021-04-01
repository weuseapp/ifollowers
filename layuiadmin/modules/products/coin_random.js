layui.define(['index', 'form', 'table', 'op_common', 'common', 'upload'], function (exports) {
    const $ = layui.$, table = layui.table, form = layui.form, upload = layui.upload, common = layui.common;
    // API地址
    let apiLists = layui.api.products.random.list;
    const apiCreate = layui.api.products.random.create
        , apiDelete = layui.api.products.random.delete
        , apiImport = layui.api.products.random.import
        , apiExport = layui.api.products.random.export
        , apiDownload = layui.api.products.random.download_example
        , extend = window.a_data.extend
        , params = getUrlParams(location.search);

    if (params['app_id']) {
        apiLists += '?app_id=' + params['app_id'];
    }

    $(document).ready(function () {
        renderSelect('app_id', 'app_id', extend['apps'], params['app_id'] ?? null);
        form.render('select');
    });

    // 列表渲染
    const tableIns = table.render({
        elem: '#lists',
        url: apiLists,
        headers: {
            token: layui.data(layui.setter.tableName).user.token,
        },
        height: 'full-100',
        parseData: function (res) {
            window.parent.listData = res;
            checkApiStatusByData(res);
            return getListsFormatByData(res);
        },
        cols: [[
            {field: 'id', width: 90, title: 'ID', sort: true},
            {
                field: 'app_id', title: '应用', align: 'center', templet: function (d) {
                    if (!d['app_id']) {
                        return '缺省';
                    }
                    if (extend['apps'].hasOwnProperty(d['app_id'])) {
                        return extend['apps'][d['app_id']];
                    }
                    return '关联丢失';
                }
            },
            {field: 'coin', title: '金币数', align: 'center'},
            {field: 'weight', title: '权重值', align: 'center'},
            {title: '操作', width: 70, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        page: true,
        limit: 10
    });

    // 批量导入文件
    upload.render({
        elem: '#importExcel',
        url: apiImport,
        accept: 'file', //普通文件
        auto: true,
        headers: {token: layui.data(layui.setter.tableName).user.token},
        size: 10240, // 上限10M
        before() {
            layer.load(2);
        },
        done(res) {
            layer.closeAll('loading');
            if (res.code !== 0) {
                layer.msg(res['msg'], {icon: 2});
                return;
            }
            const invalidNum = res['data']['invalid_total']
                , allNum = res['data']['all_total']
                , insertNum = res['data']['insert_total']
                , updateNum = res['data']['update_total']
                , effectiveNum = insertNum + updateNum;
            layer.alert(`文件上传成功<br>
                上传：${allNum}&nbsp;&nbsp;有效：${effectiveNum}&nbsp;&nbsp;新增：${insertNum}&nbsp;&nbsp;更新：${updateNum}<br>
                无效：${invalidNum}`, function (index) {
                layer.close(index);
                tableIns.reload({
                    page: {
                        curr: 1
                    }
                });
            });
        },
        error: function () {
            layer.closeAll('loading');
            layer.msg('上传失败');
        }
    });

    const active = {
        downloadExcel() {
            window.open(apiDownload + '?t=' + new Date().getTime(), '_blank');
        },
        // 列表行内：单个删除
        deleteOne(obj) {
            layer.confirm('确定删除', function (index) {
                layer.close(index);
                ajaxRequestV2(apiDelete, 'post', {ids: obj.data['id']}, function (res) {
                    layer.msg(res['msg'], {
                        icon: res.code === 0 ? 1 : 2,
                        time: 1000
                    });
                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                });
            });
        },
        exportExcel() {
            const form_data = form.val('form');
            common.ajaxDownloadFile(apiExport, 'post', form_data['app_id'] ? {app_id: form_data['app_id']} : null);
        }
    };

    // 列表行外操作：创建，多个删除
    $('.op-methods').on('click', function (obj) {
        const name = $(this).data('type');
        active[name] && active[name].call(this, obj.data);
    });

    // 列表行内操作
    table.on('tool(lists)', function (obj) {
        active[obj.event] && active[obj.event].call(this, obj);
    });

    // 添加
    form.on('submit(submit)', function (data) {
        $('#submit').addClass('layui-btn-disabled').prop('disabled', true);
        ajaxRequestV2(apiCreate, 'post', data.field, function (res) {
            if (res['code'] === 10028) {
                res['msg'] = res['msg'] + '，一个应用不能出现相同金币数';
            }
            layer.msg(res['msg'], {
                icon: res.code === 0 ? 1 : 2,
                time: 1500
            }, function () {
                $('#submit').removeClass('layui-btn-disabled').prop('disabled', false);
            });
            if (res.code === 0) {
                $("#form-item")[0].reset();
                form.render();
                $('#submit').removeClass('layui-btn-disabled').prop('disabled', false);
                tableIns.reload({
                    page: {
                        curr: 1
                    }
                }); // 执行重载
            }
        }, function () {
            $('#submit').removeClass('layui-btn-disabled').prop('disabled', false);
        });
    });

    // 应用选择
    $('#search').on('click', function (data) {
        const form_data = form.val('form');
        tableIns.reload({
            where: form_data['app_id'] ? {app_id: form_data['app_id']} : null,
            page: {curr: 1}
        });
    });

    exports('coin_random');
});