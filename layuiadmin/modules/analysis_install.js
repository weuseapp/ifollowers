layui.define(['table', 'form', 'op_common', 'laydate', 'echartsTheme', 'admin'], function (exports) {
    const $ = layui.$
        , table = layui.table
        , form = layui.form
        , laydate = layui.laydate
        , admin = layui.admin
        , echarts = window.echarts;
    const params = getUrlParams(location.search);
    let apiLists = layui.api.analysis_get_install_analysis;
    if (params['app_id']) {
        apiLists += '?app_id=' + params['app_id'];
    }

    function initUrl() {
        setCacheData('apiLists', apiLists);
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
            done: null,
        }); // 执行重载
    });
    // 列表行外操作：创建，多个删除
    $('.op-methods').on('click', function (obj) {
        initUrl();
        window.data = obj.data;
        const type = $(this).data('type');
        window[type] && window[type].call(this, obj.data, table.cache.extends);
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
        url: apiLists,
        headers: {
            token: layui.data(layui.setter.tableName).user.token,
        },
        parseData: function (res) {
            window.parent.
                listData = res;
            checkApiStatusByData(res);
            // 开始渲染
            renderDataView(res.data);
            return getListsFormatByData(res);
        },
        cols: [[
            {type: 'numbers', width: 90, title: '序号', sort: true},
            {field: 'app_name', title: '应用名称'},
            {field: 'device_type', title: '设备类型', templet: '#tpl_device_type', align: 'center'},
            {field: 'channel', title: '应用渠道'},
            {field: 'quantity', title: '日安装量'},
            {field: 'amount', title: '累计安装量'},
            {field: 'user_quantity', title: '日新增用户'},
            {field: 'user_amount', title: '累计用户'},
            {field: 'date', title: '统计日期', sort: true},
        ]],
        limit: 1000,
        done: function (res) {
            table.cache.extends = res.extends;
            initSearchInput(res.extends);
        },
    });

    window.initSearchInput = function (data) {
        renderSelectV2('app_id', 'app_id', data['apps'], null, '全部');
        renderSelectV2('device_type', 'device_type', data['device_type'], null, '全部');
        renderSelectV2('channel', 'channel', data['channel'], null, '全部');
        form.render();
    };

    // 日期选择
    laydate.render({
        elem: '#range_at',
        range: '~',
        trigger: 'click',
        max: -1,
        done: function (value) {
            const form_data = {'start_date': '', 'end_date': ''};
            if (!value) {
                form.val('form', form_data);
                return;
            }
            const dateArr = value.split(' ~ ');
            if (dateArr.length !== 2) {
                form.val('form', form_data);
                layer.msg('时间格式有误，请检查', {icon: 5});
                return;
            }
            form_data['start_date'] = dateArr[0];
            form_data['end_date'] = dateArr[1];
            form.val('form', form_data);
        }
    });

    // 图表
    const elemDataView = document.getElementById('LAY-index-dataview');

    const data = {
        'legend_data': {
            '安装量': true,
            '累计安装量': false,
            '新增用户': false,
            '累计用户': false,
        }
    };

    const option = {
        title: {
            text: 'App 安装统计'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: data['legend_data'] ? Object.keys(data['legend_data']) : [],
            selected: data['legend_data']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '安装量',
                type: 'line',
                data: []
            },
            {
                name: '累计安装量',
                type: 'line',
                data: []
            },
            {
                name: '新增用户',
                type: 'line',
                data: []
            },
            {
                name: '累计用户',
                type: 'line',
                data: []
            }
        ]
    };
    // 读取默认主题
    const theme = layui['echartsTheme'];
    // 修改部分主题参数
    theme['line']['smooth'] = false;
    // 定义渲染函数
    const renderDataView = function (res) {
        const echartsApp = echarts.init(elemDataView, theme);
        if (res) {
            option.xAxis.data = res['date_rang'] ? res['date_rang'] : [];
            for (let i in option.series) {
                if (option.series.hasOwnProperty(i)) {
                    option.series[i].data = res['chart_data'][option.series[i].name];
                }
            }
        }
        echartsApp.setOption(option);
        admin.resize(function () {
            echartsApp.resize();
        });
    };
    //监听侧边伸缩
    admin.on('side', function () {
        setTimeout(function () {
            renderDataView();
        }, 300);
    });

    exports('analysis_install');

    exports('const', {
        // 设备类型：1: Android, 2: iOS，3：PC
        DEVICE_TYPE_ANDROID: 1,
        DEVICE_TYPE_IOS: 2,
        DEVICE_TYPE_PC: 3,
    });

});