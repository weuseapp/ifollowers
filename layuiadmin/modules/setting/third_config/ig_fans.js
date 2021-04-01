layui.define(['form'], function (exports) {
    const $ = layui.$
        , form = layui.form;

    const from_filter = 'form-ig-fans'
        , apiGet = layui.api.third_get_ig_fans
        , apiCreate = layui.api.third_update_ig_fans;

    $(document).ready(function () {
        initData();
    });

    form.on('select(en_name)', function (data) {
        initData(data.value);
    });

    function initData(en_name) {
        const params = en_name ? {en_name: en_name} : {};
        ajaxRequestV2(apiGet, 'get', params, data => {
            if (data['code'] !== 0) {
                layer.msg(data['msg']);
                return;
            }
            data = data['data'];
            renderSelect('en_name', 'en_name', data['service']);
            renderSelect('service_follow', 'service_follow', data['service_ids']);
            renderSelect('service_like', 'service_like', data['service_ids']);
            renderSelect('service_view', 'service_view', data['service_ids']);
            renderSelect('service_gold_follow', 'service_gold_follow', data['service_ids']);
            if (data['extend']) {
                data['extend'] = JSON.parse(data['extend']);
                const services = data['extend']['services'] || {};
                data = Object.assign(data, {
                    'service_follow': services['follow'] || '',
                    'service_like': services['like'] || '',
                    'service_view': services['view'] || '',
                    'service_gold_follow': services['gold_follow'] || '',
                });
            }
            form.val(from_filter, data);
        });
    }

    form.on('submit(set_ig_fans)', function (obj) {
        ajaxRequestV2(apiCreate, 'post', obj.field, res => {
            layer.msg(res['msg'], {
                icon: res['code'] === 0 ? 1 : 2,
                time: 1000
            }, function () {
                location.reload();
            });
        });
    });

    exports('ig_fans');
});