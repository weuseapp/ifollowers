layui.define(['table', 'form', 'op_common', 'laydate', 'transfer'], function (exports) {
    const $ = layui.$, date = layui.laydate, form = layui.form, transfer = layui.transfer;
    const data = window.a_data.data, extend = window.a_data.extend;

    const appIds = isEmpty(data) ? [] : data['app_id'].split(',');

    const range_at_dom = $('#range_at');
    const elem_range_at_dom = $('#elem_range_at');
    const form_filter = 'setting-form-time-limited';

    let type = 0;

    let hour_verify = true;

    // 去重
    function unique(arr) {
        return Array.from(new Set(arr.sort()))
    }

    // 获取当前日期星期几
    function getWeekDate(time) {
        const now = new Date(time);
        const day = now.getDay();
        const weeks = [0, 1, 2, 3, 4, 5, 6];
        return weeks[day];
    }

    // 获取日期范围内的所有日期
    function getDate(dateStr) {
        const temp = dateStr.split('-')
        return new Date(temp[0], parseInt(temp[1]) - 1, temp[2])
    }

    // 获取日期范围内所有的星期
    function getAll(start, end) {
        const weekList = []
        const startTime = getDate(start)
        const endTime = getDate(end)
        while (endTime.getTime() - startTime.getTime() >= 0) {
            const year = startTime.getFullYear()
            const month =
                startTime.getMonth().toString().length === 1
                    ? '0' + startTime.getMonth().toString()
                    : startTime.getMonth()
            const day =
                startTime.getDate().toString().length === 1
                    ? '0' + startTime.getDate()
                    : startTime.getDate()
            const date = year + '-' + (parseInt(month) + 1) + '-' + day
            weekList.push(getWeekDate(date))
            startTime.setDate(startTime.getDate() + 1)
        }
        return unique(weekList)
    }

    // 设置星期的可选状态
    function setWeekStatus(week, type = true) {
        $('input[lay-filter=week]').prop({'disabled': true, 'checked': false});
        for (let item of week) {
            $(`input[lay-filter=week][value=${item}]`).prop({'disabled': false, 'checked': type});
        }
        form.render('checkbox');
    }

    // 渲染日期范围内可选择的星期
    function renderSureDate(range_at, type = false, data, filter) {
        if (!range_at) {
            setWeekStatus([], false);
            return false;
        }
        let week = [];
        if (typeof range_at === 'string') {
            const _date = range_at.split(' - ');
            week = getAll(_date[0], _date[1]);
        } else if (range_at instanceof Array) {
            week = range_at;
        }
        setWeekStatus(week, type);
        if (!data) {
            return true;
        }
        const form_data = {};
        for (let item of week) {
            form_data['week[' + item + ']'] = data['week[' + item + ']'];
        }
        if (filter && form_data) {
            form.val(filter, form_data);
        }
        return true;
    }

    // 日期选择控件配置
    const options = {
        elem: '#range_at',
        range: true,
        trigger: 'click',
        done: function (value) {
            if (data) {
                renderSureDate(value, false, data, form_filter);
            } else {
                renderSureDate(value, true);
            }
        }
    };

    if (data) {
        // 表单赋值
        let form_data = {
            'id': data['id'],
            'title': data['title'],
            'status': data['status'],
            'app_id': data['app_id'],
            'type': data['type'],
            'sort': data['sort']
        };
        if (data['range_at']) {
            form_data['range_at'] = data['range_at'];
        }
        if (data['hour_range']) {
            form_data['hour_range'] = data['hour_range'];
        }
        type = parseInt(data['type']);
        if (type === 0) {
            if (data['range_at']) {
                renderSureDate(data['range_at'], false, data, form_filter);
            }
        } else if (type === 1) {
            renderSureDate([0, 1, 2, 3, 4, 5, 6], true, data, form_filter);
        }
        form.val(form_filter, form_data);
    } else {
        setWeekStatus([], false);
    }

    // 控制日期范围选择容器
    if (type === 1) {
        elem_range_at_dom.hide();
        range_at_dom.attr('disabled', true);
    } else {
        elem_range_at_dom.show();
        range_at_dom.attr('disabled', false);
    }

    // 渲染
    date.render(options)

    // 时间范围
    const hour_range_options = {
        elem: '#hour_range'
        , type: 'time'
        , range: true
        , trigger: 'click'
        , format: 'HH:mm:ss'
        , done: function (value, date, endDate) {
            if (!value) {
                hour_verify = true;
                return;
            }
            const start = date.hours * 3600 + date.minutes * 60 + date.seconds;
            const end = endDate.hours * 3600 + endDate.minutes * 60 + endDate.seconds;
            if (start >= end) {
                hour_verify = false;
                return;
            }
            hour_verify = true;
        }
    };
    // 渲染
    date.render(hour_range_options);

    form.verify({
        week: function (value, item) {
            if ($(item).find('input:checked').length === 0) {
                return '请选择星期';
            }
        },
        range_at: function (value) {
            if (!value && type === 0) {
                return '请选择时间范围';
            }
        },
        hour_range: function () {
            if (!hour_verify) {
                return '时间范围不合法';
            }
        }
    });

    form.render();

    // app 列表 穿梭框组件
    const apps = [];
    for (let key in extend['apps']) {
        if (!extend['apps'].hasOwnProperty(key)) {
            continue;
        }
        apps.push({"value": key, "title": extend['apps'][key]});
    }
    // 渲染
    transfer.render({
        elem: '#app_ids'  //绑定元素
        , title: ['候选应用', '已选应用']
        , showSearch: true
        , width: 260
        , data: apps
        , value: appIds
        , id: 'app_ids' //定义索引
        , onchange: function () {
            const getData = transfer.getData('app_ids');
            const app_ids = [];
            for (let i in getData) {
                if (getData.hasOwnProperty(i)) {
                    app_ids.push(getData[i]['value']);
                }
            }
            $('#app_id').val(app_ids.join(','));
        }
    });

    // 监听类型选择
    form.on('radio(type)', function (obj) {
        type = parseInt(obj.value);
        switch (type) {
            case 0:
                range_at_dom.attr('disabled', false);
                elem_range_at_dom.show();
                const d = form.val(form_filter);
                renderSureDate(d['range_at'], false, data, form_filter);
                break;
            case 1:
                range_at_dom.attr('disabled', true);
                elem_range_at_dom.hide();
                renderSureDate([0, 1, 2, 3, 4, 5, 6], false, data, form_filter);
                break;
        }
    });

    exports('setting_time_limited_form');
});