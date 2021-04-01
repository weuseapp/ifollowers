layui.define(['form', 'transfer'], function (exports) {
    const $ = layui.$
        , transfer = layui.transfer
        , layer = layui.layer
        , form = layui.form
        , apiUrl = layui.api.reward_setting.praise_reward;

    //渲染
    transfer.render({
        elem: '#app_id'  //绑定元素
        , title: ['候选应用', '已选应用']
        , showSearch: true
        , width: 260
        , id: 'app_id' //定义索引
        , onchange: function () {
            const getData = transfer.getData('app_id');
            const app_ids = [];
            for (let i in getData) {
                if (getData.hasOwnProperty(i)) {
                    app_ids.push(getData[i]['value']);
                }
            }
            $('#app_ids').val(app_ids.join(','));
        }
    });

    // 获取配置数据
    ajaxRequestV2(apiUrl, 'get', {}, function (res) {
        if (checkApiStatusByData(res) !== undefined) {
            return;
        }
        const data = res['data'];
        // app 列表 穿梭框组件
        const apps = [];
        for (let key in data['apps']) {
            if (!data['apps'].hasOwnProperty(key)) {
                continue;
            }
            apps.push({'value': key, 'title': data['apps'][key]});
        }
        transfer.reload('app_id', {
            data: apps
            , value: data['app_ids']
        });
        const form_data = data;
        // 格式化表单数据
        delete form_data['apps'];
        form_data['app_ids'] = data['app_ids'].join(',');
        form.val('praise_reward_gold_coin', form_data);
    });

    form.verify({
        app_ids: function (value) {
            if (!value) {
                return '至少选择一个应用';
            }
        }
    });

    form.on('submit(set_praise_reward_gold_coin)', function (data) {
        ajaxRequestV2(apiUrl, 'post', data.field, function (res) {
            if (checkApiStatusByData(res) !== undefined) {
                return;
            }
            if (res['code'] !== 0) {
                layer.msg(res['msg'], {icon: 4});
                return;
            }
            layer.msg(res['msg'], {icon: 1});
        });
    });

    exports('reward_setting');
});