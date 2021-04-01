layui.define(['form'], function (t) {
    const form = layui.form, $ = layui.$;
    const url = layui.api.tasks_task_setting;

    ajaxRequestV2(url, 'get', {}, function (res) {
        if (res['code'] === 0) {
            form.val('task_config', res['data']);
            form.render('checkbox');
        } else {
            layer.msg(res['msg'], {
                icon: 2,
                time: 1000
            });
        }
    });

    form.on('submit(set_task_config)', function (obj) {
        if (!obj.field.hasOwnProperty('follower_open')) {
            obj.field['follower_open'] = '0';
        }
        if (!obj.field.hasOwnProperty('likes_open')) {
            obj.field['likes_open'] = '0';
        }
        ajaxRequestV2(url, 'post', obj.field, function (res) {
            layer.msg(res['msg'], {
                icon: res.code === 0 ? 1 : 2,
                time: 1000
            });
        });
    });

    t('tasks_setting', {});
});