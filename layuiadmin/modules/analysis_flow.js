layui.define(['op_common', 'table', 'form', 'laydate', 'echartsTheme'], function (exports) {
    const admin = layui.admin
        , table = layui.table
        , form = layui.form
        , layDate = layui.laydate
        , echarts = window.echarts
        , apiLists = layui.api.analysis_get_flow_analysis;

    let listExtends = {};
    // 列表
    const tableIns = table.render({
        elem: '#lists',
        url: apiLists,
        headers: {
            token: layui.data(layui.setter.tableName).user.token,
        },
        parseData: function (res) {
            listExtends = res.data.extends;
            checkApiStatusByData(res);
            renderDataView(res.data);
            return getListsFormatByData(res);
        },
        cols: [[
            {
                field: 'app_name', title: '应用', minWidth: 120, templet: function (res) {
                    if (!res['app_id']) {
                        return res['app_name'];
                    }
                    const app = listExtends['apps'][res['app_id']];
                    return app !== undefined ? app : '应用已删除';
                }
            },
            {field: 'pur_coin_total', title: '内购金币订单数'},
            {field: 'pur_coin_earn', title: '内购金币总额'},
            {field: 'pur_task_total', title: '内购任务数'},
            {field: 'pur_task_earn', title: '内购任务总额'},
            {field: 'coin_task_total', title: '金币任务数'},
            {field: 'coin_task_cost', title: '金币任务消耗'},
            {field: 'pur_coin_issue', title: '内购金币发行量', width: 130},
            {field: 'other_coin_issue', title: '其它金币发行量', width: 130},
            {field: 'coin_issue', title: '金币总发行量'},
            {field: 'coin_cost', title: '金币总消耗'},
            {field: 'price_earn', title: '内购总额'},
            {field: 'date', title: '统计日期', sort: true, width: 110},
        ]],
        limit: 1000,
        done: function (res) {
            table.cache.extends = res.extends;
            renderSelectV2('app_id', 'app_id', res['extends']['apps'], null, '全部');
            form.render();
        }
    });
    // 搜索
    form.on('submit(search)', function (obj) {
        tableIns.reload({
            where: obj.field,
            page: {
                curr: 1
            },
            done: null,
        });
    });

    // 日期选择
    layDate.render({
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
    // 默认数据
    const legendData = [
        {name: '内购总额', value: true},
        {name: '内购金币订单数', value: false},
        {name: '内购金币总额', value: false},
        {name: '内购任务数', value: false},
        {name: '内购任务总额', value: false},
        {name: '金币任务数', value: false},
        {name: '金币任务消耗', value: false},
        {name: '内购金币发行量', value: false},
        {name: '其它金币发行量', value: false},
        {name: '金币总发行量', value: false},
        {name: '金币总消耗', value: false},
    ];
    const data = {'legend_data': {}};
    for (let i in legendData) {
        if (legendData.hasOwnProperty(i)) {
            data['legend_data'][legendData[i].name] = legendData[i].value;
        }
    }

    // 默认配置
    const option = {
        title: {
            text: 'App 流水统计'
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
                name: '内购总额',
                type: 'line',
                data: []
            },
            {
                name: '内购金币订单数',
                type: 'line',
                data: []
            },
            {
                name: '内购金币总额',
                type: 'line',
                data: []
            },
            {
                name: '内购任务数',
                type: 'line',
                data: []
            },
            {
                name: '内购任务总额',
                type: 'line',
                data: []
            },
            {
                name: '金币任务数',
                type: 'line',
                data: []
            },
            {
                name: '金币任务消耗',
                type: 'line',
                data: []
            },
            {
                name: '内购金币发行量',
                type: 'line',
                data: []
            },
            {
                name: '其它金币发行量',
                type: 'line',
                data: []
            },
            {
                name: '金币总发行量',
                type: 'line',
                data: []
            },
            {
                name: '金币总消耗',
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
    function renderDataView(data) {
        const echartsApp = echarts.init(elemDataView, theme);
        if (data) {
            option.xAxis.data = data['date_rang'] ? data['date_rang'] : [];
            if (data['chart_data'].length === 0) {
                for (let i in option.series) {
                    option.series[i].data = [];
                }
            } else {
                option.series = data['chart_data'];
            }
        }
        echartsApp.setOption(option);
        admin.resize(function () {
            echartsApp.resize();
        });
    }

    //监听侧边伸缩
    admin.on('side', function () {
        setTimeout(function () {
            renderDataView();
        }, 300);
    });

    exports('analysis_flow', {});
});