layui.define('common', function (exports) {
    const $ = layui.$, setter = layui.setter;
    const user = layui.data(setter.tableName)['user'];
    $('#username').text(user['nickname']);
    $('#username_avatar').attr('src', layui.setter.apiUrl + '/' + user['avatar']);
    $('.op-methods').on('click', function () {
        layer.open({
            type: 2,
            title: '基本资料',
            content: layui.setter.vhtml + 'admin/user/details.html?username=' + user['username'],
            area: ['70%', '70%'],
        })
    });

    const fetchMenu = function (menu_list) {
        let _html = '';
        let _default_html = '';
        $.each(menu_list, function (key, value) {
            if (value['type'] === 2) {
                _html += `<li data-name="console" class="layui-nav-item layui-this">
                                <a href="javascript:" lay-href="views/${value['html_url']}" lay-tips="${value['title']}" lay-direction="2">
                                    <i class="layui-icon layui-icon-home"></i>
                                    <cite>${value['title']}</cite>
                                </a>
                            </li>`;
                _default_html = value['html_url'];
                return false;
            }
            if (isEmpty(value['sub'])) {
                return true;
            }
            $.each(value['sub'], function (key2, value2) {
                if (value2['type'] === 3) {
                    return true;
                }
                if (value2['type'] === 2) {
                    _default_html = value2['html_url'];
                    return false;
                }
            })
            if (!isEmpty(_default_html)) {
                return false;
            }
        });
        $('#default_show').attr('src', 'views/' + _default_html);
        $('#LAY_app_tabsheader>li').attr({
            'lay-id': 'views/' + _default_html,
            'lay-attr': 'views/' + _default_html
        });

        $.each(menu_list, function (key, value) {
            if (value['html_url'] === _default_html) {
                return true;
            }
            _html += `<li data-name="user" class="layui-nav-item"><a href="javascript:" lay-tips="${value['title']}" lay-direction="2">
                                <i class="layui-icon ${value['icon']}"></i><cite>${value['title']}</cite></a>`;
            if (!isEmpty(value['sub']) && value['type'] !== 3) {
                let html = '';
                $.each(value['sub'], function (key2, value2) {
                    if (!isEmpty(value2['sub']) && value2['sub'][0]['type'] !== 3) {
                        html += `<dd data-name="form"><a href="javascript:" lay-tips="${value2['title']}"><cite>${value2['title']}</cite></a>`;
                        $.each(value2['sub'], function (key3, value3) {
                            html += `<dl class="layui-nav-child"><dd><a lay-href="views/${value3['html_url']}">${value3['title']}</a></dd></dl>`;
                        })
                        html += `</dd>`
                    } else {
                        html += `<dd><a lay-href="views/${value2['html_url']}">${value2['title']}</a></dd>`;
                    }
                })
                _html += `<dl class="layui-nav-child">${html}</dl>`;
            }
            _html += `</li>`;
        });
        $('#LAY-system-side-menu').html(_html);
        layui.element.init();
    }

    const session_data = layui.sessionData(setter.tableName);

    const time = new Date().getTime();

    let is_expire = false;

    const menu_expire = 60000;

    if (!session_data.hasOwnProperty('menu_list')) {
        is_expire = true;
    } else if (session_data['menu_list']['expire'] < time) {
        is_expire = true;
    }

    if (is_expire) {
        ajaxRequestV2(layui.api.menu_get_menu_lists, 'get', {'is_sub': 1, 'limit': 100}, function (res) {
            if (res.code !== 0) {
                layer.msg('还未授权菜单', {
                    icon: 2,
                    time: 3000
                });
                return false;
            }
            fetchMenu(res['data']['lists']);
            // 设置会话缓存，用于缓存菜单，减少接口请求次数
            layui.sessionData(setter.tableName, {
                key: 'menu_list',
                value: {
                    'data': res['data']['lists'],
                    'expire': time + menu_expire // 缓存 60s
                }
            });
            const user = getCacheData('user');
            user['is_admin'] = res['data']['extends']['is_admin'] ? res['data']['extends']['is_admin'] : false;
            setCacheData('user', user);
            // 保存当前登录用户的
            top.isAdmin = !!user['is_admin'];
        });
    } else {
        fetchMenu(session_data['menu_list']['data']);
        const user = getCacheData('user');
        // 保存当前登录用户的
        top.isAdmin = !!user['is_admin'];
    }

    exports('main');
});