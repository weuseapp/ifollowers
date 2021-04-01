;layui.define('op_common', function (exports) {
    const apiBaseInfo = layui.api.cookie_pool_base_info;
    const apiTopSearch = layui.api.cookie_pool_top_search;
    const apiEcharts = layui.api.cookie_pool_echarts_info;

    function DateDiff(sDate1, sDate2) { //sDate1和sDate2是2019-3-12格式
        let aDate, oDate1, oDate2, iDays;
        aDate = sDate1.split("-");
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为9-25-2017格式
        aDate = sDate2.split("-");
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        iDays = Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24; //把相差的毫秒数转换为天数
        return parseInt(iDays);
    }

    ajaxRequestV2(apiBaseInfo, 'get', {}, function (res) {
        if (res['code'] !== 0) {
            layer.msg(res['msg'], {icon: 2});
            return;
        }
        layui.use('laytpl', function () {
            const laytpl = layui.laytpl;
            // 基础信息
            laytpl(base_info_tpl.innerHTML).render(res['data']['base_info'], function (html) {
                document.getElementById('base_info_view').innerHTML = html
            });
            // 今日调用频率
            laytpl(today_use_rate_tpl.innerHTML).render(res['data']['today_use_rate'], function (html) {
                document.getElementById('today_use_rate_view').innerHTML = html
            });
            // 效果报告
            laytpl(effect_report_tpl.innerHTML).render(res['data']['effect_report'], function (html) {
                document.getElementById('effect_report_view').innerHTML = html
            });
            // 实时监控
            laytpl(monitor_tpl.innerHTML).render(res['data']['monitor'], function (html) {
                document.getElementById('monitor_view').innerHTML = html
            });
        });
        layui.use(["admin", "carousel"], function () {
            const $ = layui.$
                , carousel = layui.carousel
                , element = layui.element
                , device = layui.device();
            $(".layadmin-carousel").each(function () {
                const othis = $(this);
                carousel.render({
                    elem: this,
                    width: "100%",
                    arrow: "none",
                    interval: othis.data("interval"),
                    autoplay: othis.data("autoplay") === !0,
                    trigger: (device.ios || device.android) ? "click" : "hover",
                    anim: othis.data("anim")
                })
            });
            element.render("progress")
        });
        layui.use(["admin", "carousel", "echartsTheme", "laydate"], function () {
            // 获取昨天的所有时间段键作为 x 轴
            const chats = res['data']['chats']['get_user_info'];
            let xAxisData = Object.keys(chats[-1]);
            const $ = layui.$
                , admin = layui.admin
                , carousel = layui.carousel
                , echarts = window.echarts
                , laydate = layui.laydate;

            let echartsApp = []
                , options = [{
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    data: ["前天", "昨天", "今天"]
                },
                xAxis: [{
                    name: "UTC 时区",
                    type: "category",
                    boundaryGap: !1,
                    data: xAxisData
                }],
                yAxis: [{
                    name: "访问用户主页次数",
                    type: "value",
                }],
                markLine: {
                    symbol: ['none', 'none'],
                    label: {show: false},
                    data: [
                        {xAxis: 1},
                        {xAxis: 3},
                        {xAxis: 5},
                        {xAxis: 7}
                    ]
                },
                series: [{
                    name: "前天",
                    type: "line",
                    smooth: !0,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: "default"
                            }
                        }
                    },
                    data: chats[-2] ? Object.values(chats[-2]) : []
                }, {
                    name: "昨天",
                    type: "line",
                    smooth: !0,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: "default"
                            }
                        }
                    },
                    data: chats[-1] ? Object.values(chats[-1]) : []
                }, {
                    name: "今天",
                    type: "line",
                    smooth: !0,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: "default"
                            }
                        }
                    },
                    data: chats[0] ? Object.values(chats[0]) : []
                }]
            }]
                , elemDataView = $("#LAY-index-dataview").children("div")
                , renderDataView = function (index) {
                echartsApp[index] = echarts.init(elemDataView[index], layui['echartsTheme']);
                echartsApp[index].setOption(options[index]);
                admin.resize(function () {
                    echartsApp[index].resize();
                });
            };

            laydate.render({
                elem: '#test-laydate-format-range1'
                , range: '~'
                , value: ''
                , min: -6
                , max: 0
                , done: function (value) {
                    const _date = value.split('~');
                    _date[0] = _date[0].trim();
                    _date[1] = _date[1].trim();
                    if (DateDiff(_date[1], _date[0]) > 7) {
                        layer.msg('日期范围不能超过7天，且最大日期为今天', {icon: 7});
                        return false;
                    }
                    ajaxRequestV2(apiEcharts, 'get',
                        {'start_date': _date[0], 'end_date': _date[1]},
                        function (res) {
                            if (res['code'] !== 0) {
                                layer.msg(res['msg'] ?? '请求失败', {icon: 2});
                                return false;
                            }
                            const dd = res['data'] ?? false;
                            if (!dd) {
                                layer.msg('返回数据异常', {icon: 2});
                                return false;
                            }
                            if (!dd.hasOwnProperty('chats') || !dd['chats'].hasOwnProperty('get_user_info')) {
                                layer.msg('返回数据异常', {icon: 2});
                                return false;
                            }
                            const _series = [];
                            layui.each(dd['chats']['get_user_info'], function (key, value) {
                                _series.push({
                                    name: key,
                                    type: "line",
                                    smooth: !0,
                                    itemStyle: {
                                        normal: {
                                            areaStyle: {
                                                type: "default"
                                            }
                                        }
                                    },
                                    data: value ? Object.values(value) : []
                                });
                            });
                            const index = 0;
                            options[index]['legend']['data'] = dd['chats']['get_user_info'] ? Object.keys(dd['chats']['get_user_info']) : [];
                            options[index]['series'] = _series;
                            echartsApp[index].setOption(options[index], true);
                        });
                }
            });

            //没找到DOM，终止执行
            if (!elemDataView[0]) return;

            renderDataView(0);

            // 监听数据概览轮播
            let carouselIndex = 0;
            carousel.on('change(LAY-index-dataview)', function (obj) {
                renderDataView(carouselIndex = obj.index);
            });

            //监听侧边伸缩
            admin.on('side', function () {
                setTimeout(function () {
                    renderDataView(carouselIndex);
                }, 300);
            });

            //监听路由
            admin.on('hash(tab)', function () {
                layui.router().path.join('') || renderDataView(carouselIndex);
            });
        });

        layui.use(['table', 'laydate'], function () {
            const $ = layui.$
                , table = layui.table
                , form = layui.form;
            // 今日热搜
            table.render({
                elem: "#LAY-index-topSearch",
                url: apiTopSearch,
                page: !0,
                headers: {
                    token: layui.data(layui.setter.tableName).user.token,
                },
                parseData: function (res) {
                    checkApiStatusByData(res);
                    return getListsFormatByData(res);
                },
                cols: [[{
                    field: "keywords",
                    title: "关键词",
                    minWidth: 300,
                    templet: '<div><a href="https://www.instagram.com/{{ d.keywords }}" target="_blank" class="layui-table-link">{{ d.keywords }}</a></div>'
                }, {
                    field: "frequency",
                    title: "搜索次数",
                    minWidth: 120,
                    sort: !0
                }]],
                skin: "line"
            });

            const initSearchInput = function (data) {
                renderSelect('tableDate', 'date', data['date'], 0);
                form.render('select');
            };

            // 今日热搜
            const tableIns = table.render({
                elem: "#LAY-index-historyTopSearch",
                url: apiTopSearch,
                page: !0,
                headers: {
                    token: layui.data(layui.setter.tableName).user.token,
                },
                parseData: function (res) {
                    checkApiStatusByData(res);
                    return getListsFormatByData(res);
                },
                cols: [[{
                    field: "keywords",
                    title: "关键词",
                    minWidth: 300,
                    templet: '<div><a href="https://www.instagram.com/{{ d.keywords }}" target="_blank" class="layui-table-link">{{ d.keywords }}</a></div>'
                }, {
                    field: "frequency",
                    title: "搜索次数",
                    minWidth: 120,
                    sort: !0
                }]],
                skin: "line",
                done: function (res) {
                    initSearchInput(res['extends']);
                }
            });

            form.on('select(date)', function (data) {
                let date = $(this).text();
                if (!data.value) {
                    date = false;
                }
                tableIns.reload({
                    where: date ? {'date': date} : null,
                    page: {
                        curr: 1
                    },
                    done: function () {

                    }
                });
            });
        });
        exports("cookie_pool_base_info", {});
    });
});
