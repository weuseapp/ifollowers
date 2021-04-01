layui.define(['table', 'form', 'upload', 'op_common', 'const'], function (exports) {
    const $ = layui.$, op_common = layui['op_common'], table = layui.table, form = layui.form, upload = layui.upload;
    const params = getUrlParams(location.search);
    const apiLists = layui.api.products_get_products_lists + '?app_id=' + params['app_id'];
    const apiCreate = layui.api.products_create_product;
    const apiUpdate = layui.api.products_update_product;
    const apiDelete = layui.api.products_delete_product;
    const apiDownload = layui.api.products_download_excel;
    const apiExport = layui.api.products_export_excel;
    const apiImport = layui.api.products_import_product;

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
                let allNum = res.data['all'].length;
                let insertNum = res.data['insert'].length;
                let updateNum = res.data['update'].length;
                let effectiveNum = insertNum + updateNum;
                layer.msg(`文件上传成功，上传商品数：${allNum}，有效商品数：${effectiveNum}，新增商品数：${insertNum}，更新商品数：${updateNum}，无效商品数：${invalidNum}`);
            }
        },
        error: function () {
            layer.msg('上传失败');
        }
    });

    function initUrl() {
        setCacheData('apiLists', apiLists);
        setCacheData('apiCreate', apiCreate);
        setCacheData('apiUpdate', apiUpdate);
        setCacheData('apiDelete', apiDelete);
    }

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
        window[name] && window[name].call(this, obj.data, table.cache.extends);
    });
    // 列表行内操作：更新，单个删除
    table.on('tool(lists)', function (obj) {
        initUrl();
        window.data = obj.data;
        window[obj.event] && window[obj.event].call(this, obj.data, table.cache.extends);
    });

    window.export_data = function () {
        let app_id = $("#app_id").val();
        let type = $("[name=type]").val();
        let other_type = $("[name=other_type]").val();
        let is_time_limit = $("[name=is_time_limit]").val();
        let status = $("#status").val();

        let ids = table.checkStatus('lists').data.map(o => o.id).join(',');

        window.location.href = apiExport + '?app_id=' + app_id + "&type=" + type + "&other_type=" + other_type + "&is_time_limit=" + is_time_limit + "&status=" + status + "&ids=" + ids;
    };

    window.download_example = function () {
        window.location.href = apiDownload;
    }

    window.products_random = function () {
        let content = 'coin_random.html';
        const data = form.val('form');
        if (data['app_id']) {
            content += '?app_id=' + data['app_id'];
        }
        layer.open({
            type: 2,
            title: '设置随机金币权重',
            content: content,
            maxmin: true,
            area: ['70%', '70%'],
            success: function (layerDom) {
                const iframeWin = window[layerDom.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：
                iframeWin.a_data = {'extend': table.cache.extends};
            }
        });
    }

    // 列表
    const opTable = layui.opTable.render({
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
        toolbar: true,
        defaultToolbar: ['filter'],
        cols: [[
            {type: 'checkbox'},
            {field: 'id', width: 90, title: 'ID', sort: true},
            {field: 'name', width: 200, title: '商品名称'},
            {field: 'price', title: '价格'},
            {field: 'total', title: '购买数量'},
            {field: 'extra_total', title: '赠送数量'},
            {
                field: 'discount', title: '折扣', width: 70, align: 'right', templet: function (d) {
                    return d['discount'] + '%';
                }
            },
            {field: 'is_discount', width: 90, title: '是否折扣', templet: '#tpl_is_discount', align: 'center'},
            {field: 'status', width: 80, title: '状态', templet: '#tpl_status', align: 'center'},
            {field: 'is_time_limit', width: 90, title: '限时活动', templet: '#tpl_is_time_limit', align: 'center'},
            {title: '操作', width: 60 * 2, align: 'center', fixed: 'right', toolbar: '#options'},
        ]],
        //  展开的列配置
        openColumnIndex: 1,
        openCols: [
            {field: 'app_name', title: '应用'},
            {field: 'product_id', title: '内购ID'},
            {
                field: 'type', width: 90, title: '商品类型', templet: function (d) {
                    if (d['type'] === layui['const']['PRODUCT_TYPE_COINS']) {
                        return `<span class="opTable-item-title">商品类型：</span><span class="layui-badge layui-bg-orange">金币</span>`;
                    }
                }, align: 'center'
            },
            {
                field: 'other_type', width: 90, title: '购买类型', templet: function (d) {
                    const t = `<span class="opTable-item-title">购买类型：</span>`;
                    if (d.other_type === layui.const.OTHER_TYPE_LIKE) {
                        return `${t}<span class="layui-badge layui-bg-blue">点赞</span>`;
                    } else if (d.other_type === layui.const.OTHER_TYPE_FOLLOWER) {
                        return `${t}<span class="layui-badge layui-bg-cyan">加粉</span>`;
                    } else if (d.other_type === layui.const.OTHER_TYPE_VIEW) {
                        return `${t}<span class="layui-badge layui-bg-green">观看</span>`;
                    } else if (d.other_type === layui.const.OTHER_TYPE_COINS) {
                        return `${t}<span class="layui-badge layui-bg-orange">金币</span>`;
                    } else if (d.other_type === layui.const.OTHER_TYPE_GOLD_FOLLOWER) {
                        return `${t}<span class="layui-badge layui-bg-orange">黄金粉丝</span>`;
                    } else {
                        return `${t}<span class="layui-badge layui-bg-blue">未知</span>`;
                    }
                }, align: 'center'
            },
            {field: 'time_limit_discount', width: 90, title: '限时活动可获得的任务数/金币'},
        ],
        page: true,
        limit: 20,
        done: function (res) {
            table.cache.extends = res.extends;
            let params = getUrlParams(location.search);
            initSearchInput(res.extends, params);
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
            done: function () {
            },
        }); // 执行重载
    });

    window.initSearchInput = function (data, init_params = {}) {
        renderSelect('type', 'type', data['type'], init_params['type']);
        renderSelect('other_type', 'other_type', data['other_type'], init_params['other_type']);
        renderSelect('status', 'status', data['status'], init_params['status']);
        renderSelect('app_id', 'app_id', data['apps'], init_params['app_id']);
        renderSelect('is_time_limit', 'is_time_limit', data['is_time_limit'], init_params['is_time_limit']);
        form.render();
    };

    exports('products', {});
});