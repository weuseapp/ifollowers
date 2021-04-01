layui.define(['op_common', 'table', 'laytpl', 'carousel', 'echartsTheme'], function (exports) {
    const $ = layui.$
        , admin = layui.admin
        , carousel = layui.carousel
        , echarts = window.echarts
        , layTpl = layui.laytpl
        , device = layui.device()
        , apiLists = layui.api.analysis_console;

    const main = {
        // 渲染[数据汇总]的表格数据
        fetchTable(data) {
            if (data instanceof Array && data.length > 0) {
                layTpl(console_table_data_tpl.innerHTML).render(data, function (html) {
                    document.getElementById('console_table_data_view').innerHTML = html
                });
            }
        }
    };

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

    // 请求数据
    ajaxRequestV2(apiLists, 'get', {}, function (res) {
        if (checkApiStatusByData(res) !== undefined) {
            return;
        }
        const d = getListsFormatByData(res);
        main.fetchTable(d['data']);
        const data = res['data'];
        // App 今日
        $('#elem_app_install').text(data['app']['install']);
        $('#elem_app_order_total').text(data['app']['order_total']);
        $('#elem_app_order_dollar_total').text(data['app']['order_dollar_total']); // 美元订单
        $('#elem_app_order_coin_total').text(data['app']['order_coin_total']); // 金币订单
        $('#elem_app_order_price').text(data['app']['order_price']);
        $('#elem_app_user_total').text(data['app']['user_total']);
        // App 本月
        $('#elem_month_app_install').text(data['app']['month_install']);
        $('#elem_month_app_order_total').text(data['app']['month_order_total']);
        $('#elem_month_app_order_dollar_total').text(data['app']['month_order_dollar_total']);
        $('#elem_month_app_order_coin_total').text(data['app']['month_order_coin_total']);
        $('#elem_month_app_order_price').text(data['app']['month_order_price']);
        $('#elem_month_app_user_total').text(data['app']['month_user_total']);

        // Web、PC 今日
        $('#elem_pc_browse').text(data['pc']['browse']);
        $('#elem_pc_order_total').text(data['pc']['order_total']);
        $('#elem_pc_order_price').text(data['pc']['order_price']);
        $('#elem_pc_user_total').text(data['pc']['user_total']);
        // Web、PC 本月
        $('#elem_month_pc_browse').text(data['pc']['month_browse']);
        $('#elem_month_pc_order_total').text(data['pc']['month_order_total']);
        $('#elem_month_pc_order_price').text(data['pc']['month_order_price']);
        $('#elem_month_pc_user_total').text(data['pc']['month_user_total']);
        chats_v2(data['chats_v2']);
    });

    // 使用图表：https://www.echartsjs.com/examples/zh/editor.html?c=multiple-y-axis
    function chats_v2(data) {
        const view = document.getElementById('chats_v2');
        const chart = echarts.init(view, layui['echartsTheme']);
        chart.setOption(data);
        admin.resize(function () {
            chart.resize();
        });
    }

    exports('console');
});