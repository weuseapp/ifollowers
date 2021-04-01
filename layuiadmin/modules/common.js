layui.define(function (exports) {
    const $ = layui.$,
        layer = layui.layer,
        setter = layui.setter,
        admin = layui.admin;

    // 方式不同源请求时无法正常带上Referer头
    $('head').append(`<meta name="referrer" content="no-referrer-when-downgrade">`);

    // 判断是否登录
    window.checkIsLogin = function () {
        window.user = layui.data(setter.tableName).user;
        window.pathUrl = location.pathname;
        window.$isLogin = user !== undefined && user.token !== undefined;
        window.isLoginPage = pathUrl.substr(pathUrl.lastIndexOf("\/") + 1) === 'login.html';
        if (!$isLogin && !isLoginPage) {
            location.href = `${setter.vhtml}user/login.html`
        } else if ($isLogin && isLoginPage) {
            parent.location.href = '../../'; // 后台主页
        }
    }
    checkIsLogin();

    /**
     * 缓存用户token
     * @param res
     */
    window.cacheUserToken = function (res) {
        setCacheData('user', {
            'token': res.data.token,
            'expire_time': res.data.expire_time,
            'refresh_token': res.hasOwnProperty.call(res.data, 'refresh_token') ? res.data.refresh_token : layui.data(setter.tableName).user.refresh_token,
            'refresh_time': res.hasOwnProperty.call(res.data, 'refresh_time') ? res.data.refresh_time : layui.data(setter.tableName).user.refresh_time,
            'username': res.hasOwnProperty.call(res.data, 'username') ? res.data.username : layui.data(setter.tableName).user.username,
            'nickname': res.hasOwnProperty.call(res.data, 'nickname') ? res.data.nickname : layui.data(setter.tableName).user.nickname,
            'avatar': res.hasOwnProperty.call(res.data, 'avatar') ? res.data.avatar : layui.data(setter.tableName).user.avatar,
            'email': res.hasOwnProperty.call(res.data, 'email') ? res.data.email : layui.data(setter.tableName).user.email,
            'status': res.hasOwnProperty.call(res.data, 'status') ? res.data.status : layui.data(setter.tableName).user.status,
            'is_admin': res.data.is_admin ? res.data.is_admin : false,
        });
    };

    /**
     * 设置缓存
     * @param name
     * @param data
     */
    window.setCacheData = function (name, data) {
        layui.data(setter.tableName, {
            key: name,
            value: data
        })
    };

    /**
     * 获取缓存数据
     * @param name
     * @returns {*}
     */
    window.getCacheData = function (name) {
        return layui.data(setter.tableName)[name];
    };

    /**
     * 检查API状态，判断是否登陆失效等
     * @param res
     * @returns {*}
     */
    window.checkApiStatusByData = function (res) {
        if (res.code === layui.code.NO_ERROR) {
            return;
        }
        if (res.code !== layui.code.SIGN_IS_EXPIRE && res.code !== layui.code['USER_IS_LOGOUT']) {
            return layer.msg(res.msg, {
                icon: 4,
                shade: 0
            });
        }
        ajaxRequest(layui.api.refresh_token, 'post', {
            refresh_token: layui.data(setter.tableName).user.refresh_token
        }, false);
        admin.req({
            url: layui.api.refresh_token,
            type: 'POST',
            data: {
                refresh_token: layui.data(setter.tableName).user.refresh_token
            },
            success: function (res) {
                if (res.code !== layui.code.NO_ERROR) {
                    window.location.href = setter.vhtml + 'user/login.html';
                } else {
                    cacheUserToken(res);
                    window.location.reload();
                }
            }
        });
    };

    /**
     * 获取列表格式，用于设置layui表格处理格式
     * @param res
     * @returns {{msg: *, code: *, data: (*|Array), extends: *, count: (*|number)}}
     */
    window.getListsFormatByData = function (res) {
        let data = {
            code: 0,
            msg: '获取数据失败',
            count: 0,
            data: [],
            extends: [],
        };
        if (!res || res.code !== 0 || res.data['lists'].length < 0) {
            return data;
        }
        data['code'] = res.code;
        data.msg = res.msg ?? res.message;
        data.count = res.data.count;
        data.data = res.data['lists'];
        data.extends = res.data['extends'];
        return data;
    };
    /**
     * 获取new_v列表格式，用于设置layui表格处理格式
     * @param res
     * @returns {{msg: *, code: *, data: (*|Array), extends: *, count: (*|number)}}
     */
    window.getNewListsFormatByData = function (res) {
        let data = {
            code: 0,
            msg: '获取数据失败',
            count: 0,
            data: [],
            extends: [],
        };
        if (!res || res.code !== 0 || res.data.data.length < 0) {
            return data;
        }
        data.code = res.code;
        data.msg = res.hasOwnProperty.call(res, 'msg') ? res.msg : res.message;
        data.count = res.data.count;
        data.data = res.data.data;
        data.extends = res.data.extends;
        return data;
    };

    /**
     * 获取URL得参数
     * 示例URL:http://www.baidu.com/test.html?uid=123&name=xxx
     * @param urlStr [当该参数不为空的时候，则解析该url中的参数集合]
     * @returns {Object} [参数集合]
     */
    window.getUrlParams = function getUrlParams(urlStr) {
        const req = {};
        let url = '?' + urlStr.split('?')[1];
        if (typeof urlStr === 'undefined') {
            url = location.search; //获取url中"?"符后的字符串
        }
        if (url.indexOf('?') !== -1) {
            const str = url.substr(1);
            const str_s = str.split("&");
            for (let i = 0; i < str_s.length; i++) {
                req[str_s[i].split('=')[0]] = str_s[i].split('=')[1];
            }
        }
        return req;
    };

    window.isEmpty = function (obj) {
        // 检验 undefined 和 null
        if (!obj && obj !== 0 && obj !== '') {
            return true;
        }
        if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
            return true;
        }
        return Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0;
    };

    window.renderSelect = function (id, name, data, default_val = null) {
        let _html = `<option name="${name}" value="">请选择</option>`;
        $.each(data, function (key, value) {
            if (default_val === null) {
                _html += `<option name="${name}" value="${key}">${value}</option>`;
                return true;
            }
            if (typeof default_val === 'object' && default_val.indexOf(key) >= 0) {
                _html += `<option name="${name}" value="${key}" selected>${value}</option>`;
            } else if (key == default_val) {
                _html += `<option name="${name}" value="${key}" selected>${value}</option>`;
            } else {
                _html += `<option name="${name}" value="${key}">${value}</option>`;
            }
        });
        $(`#${id}`).html(_html);
    };

    window.renderSelectV2 = function (id, name, data, default_val = null, default_title = '请选择') {
        let _html = `<option name="${name}" value="">${default_title}</option>`;
        $.each(data, function (key, value) {
            if (default_val === null) {
                _html += `<option name="${name}" value="${key}">${value}</option>`;
                return true;
            }
            if (typeof default_val === 'object' && default_val.indexOf(key) >= 0) {
                _html += `<option name="${name}" value="${key}" selected>${value}</option>`;
            } else if (key === default_val || (typeof default_val === "number" && parseInt(key) === default_val)) {
                _html += `<option name="${name}" value="${key}" selected>${value}</option>`;
            } else {
                _html += `<option name="${name}" value="${key}">${value}</option>`;
            }
        });
        $(`#${id}`).html(_html);
    };

    window.renderCheckbox = function (id, name, data, default_val = null) {
        let _html = '';
        $.each(data, function (key, value) {
            if (typeof default_val === `object` && default_val !== null && default_val.indexOf(key) >= 0) {
                _html += `<input type="checkbox" name="${name}[${key}]" value="${key}" lay-skin="primary" title="${value}" lay-filter="${id}" checked>`;
            } else {
                _html += `<input type="checkbox" name="${name}[${key}]" value="${key}" lay-skin="primary" title="${value}" lay-filter="${id}">`;
            }
        });
        $(`#${id}`).html(_html);
    };

    window.renderRadio = function (id, name, data, default_val = null) {
        let _html = '';
        $.each(data, function (key, value) {
            if (default_val !== null && key == default_val) {
                _html += `<input type="radio" name="${name}" value="${key}" title="${value}" lay-filter="${id}" checked>`;
            } else {
                _html += `<input type="radio" name="${name}" value="${key}" title="${value}" lay-filter="${id}">`;
            }
        });
        $(`#${id}`).html(_html);
    };

    window.renderMsgImges = function ($name) {
        const dom = $(`img[name="${$name}"]`);
        const openMsg = function (data) {
            layer.msg(`<img style="width: 220px;height: 150px" src="${data}" alt="avatar">`);
        }
        dom.on('mouseover', function () {
            const src = $(this).attr('src');
            // 判断是否是图片格式，为图片格式则走openMsg分支
            if (/\.(png|jpg|gif|jpeg|webp)$/.test(src)) {
                openMsg(src)
            }
        });
        dom.on('mouseout', function () {
            layer.closeAll('dialog');
        });
    };

    window.renderMsgImagesV2 = function (class_name) {
        const dom = $(`img[class="${class_name}"]`);
        const openMsg = function (data) {
            layer.msg(`<img style="width: 200px;height: 200px;" src="${data}" alt="avatar">`);
        }
        dom.on('mouseover', function () {
            const src = $(this).attr('src');
            // 判断是否是图片格式，为图片格式则走openMsg分支
            if (/\.(png|jpg|gif|jpeg|webp)$/.test(src)) {
                openMsg(src)
            }
        });
        dom.on('mouseout', function () {
            layer.closeAll('dialog');
        });
    };

    window.renderXmSelect = function (id, data, value = null, type = 'cascader', name = '') {
        layui.use('xmSelect', function () {
            const xmSelect = layui.xmSelect;
            let tree = {
                show: true,
                showFolderIcon: true,
                showLine: true,
                indent: 20,
                expandedKeys: [],
            };
            let cascader = {
                show: true,
                indent: 200,
                strict: true,
            }
            let select;
            if (type === 'tree') {
                select = xmSelect.render({
                    el: `#${id}`,
                    autoRow: true,
                    tree: tree,
                    toolbar: {
                        show: true,
                        list: ['ALL', 'REVERSE', 'CLEAR']
                    },
                    filterable: true,
                    height: 'auto',
                    direction: 'down',
                    data: data,
                    name: name ? name : 'select'
                });
            } else if (type === 'cascader') {
                select = xmSelect.render({
                    el: `#${id}`,
                    autoRow: true,
                    cascader: cascader,
                    toolbar: {
                        show: true,
                        list: ['ALL', 'REVERSE', 'CLEAR']
                    },
                    filterable: true,
                    height: '250px',
                    direction: 'down',
                    data: data,
                    name: name ? name : 'select'
                });
            } else {
                select = xmSelect.render({
                    el: `#${id}`,
                    autoRow: true,
                    toolbar: {
                        show: true,
                        list: ['ALL', 'REVERSE', 'CLEAR']
                    },
                    filterable: true,
                    height: '250px',
                    direction: 'down',
                    data: data,
                    name: name ? name : 'select',
                });
            }
            if (value) {
                select.setValue(value);
            }
        });

    };

    window.comfirmOperate = function (url, data) {
        layer.open({
            'title': '操作确认',
            content: '是否执行该操作？？',
            btn: ['是', '否'],
            yes: function (index, layero) {
                let res = ajaxRequest(url, 'post', data, false).responseJSON;
                if (res && res.code === 0) {
                    layer.msg(res.msg, {
                        icon: 6
                    });
                    layui.table.reload('lists');
                } else if (res) {
                    layer.msg(res.msg, {
                        icon: 5
                    });
                } else {
                    layer.msg(`更新失败`, {
                        icon: 5
                    });
                }
            }
        });
    };

    /**
     * ajax请求
     * @param url 接口URL
     * @param type 接口类型，get，post，put，delete等
     * @param data 更新数据
     * @param is_async 是否异步操作
     * @param has_header 是否有头部
     * @returns {*}
     */
    window.ajaxRequest = function (url, type, data, is_async = true, has_header = true) {
        let req = {
            url: url,
            type: type,
            dataType: 'json',
            async: is_async,
            data: data,
            success: function (res) {
                return res;
            },
            error: function () {
                return false;
            }
        };
        if (has_header) {
            req.headers = {
                token: layui.data(layui.setter.tableName).user.token,
            };
        }
        const result = $.ajax(req);
        if (result === false) {
            layer.msg('网络错误，请检查');
        }
        return result;
    };

    /**
     * ajax请求 version 2.0
     * @param url 接口URL
     * @param type 接口类型，get，post，put，delete等
     * @param data 更新数据
     * @param callback 请求成功后回调
     * @param errorCallback 请求失败后回调
     * @param is_async 是否异步操作
     * @param has_header 是否有头部
     */
    window.ajaxRequestV2 = function (url, type, data, callback, errorCallback = null, is_async = true, has_header = true) {
        layer.load(2);
        $.ajax({
            url: url,
            type: type,
            dataType: 'json',
            async: is_async,
            headers: has_header ? {token: layui.data(layui.setter.tableName).user.token} : {},
            data: data,
            success: function (res) {
                layer.closeAll('loading');
                callback && callback(res);
            },
            error: function () {
                layer.closeAll('loading');
                layer.msg('网络错误，请检查', {icon: 7});
                errorCallback && errorCallback();
            }
        });
    };


    const obj = {
        ajaxDownloadFile: function (url, type, data = null, callback = null, errorCallback = null, is_async = true, has_header = true) {
            const loading = layer.load(2);
            let xhr;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xhr = new ActiveXObject("Mscrosoft.XMLHttp");
            }
            type = type || 'GET';
            type = type.toUpperCase()
            if (type === 'GET' && data) {
                url = this.setUrlQuery({url: url, query: data});
            }
            xhr.open(type, url, is_async);
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.setRequestHeader('If-Modified-Since', '0');
            xhr.responseType = 'blob';
            has_header && xhr.setRequestHeader('token', layui.data(layui.setter.tableName).user.token);
            xhr.onload = function () {
                layer.close(loading);
                if (this.status === 200) {
                    const blob = this.response;
                    const filename = xhr.getResponseHeader('Filename');
                    // 如果是IE
                    if (window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveOrOpenBlob(blob, filename);
                    } else {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.setAttribute('style', 'visibility:hidden');
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                    callback && callback();
                } else {
                    layer.msg('网络异常，请检查', {icon: 5});
                }
            };
            xhr.onerror = function () {
                layer.close(loading);
                errorCallback();
            };
            if (type === 'POST') {
                const formData = new FormData();
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        formData.append(key, `${data[key]}`);
                    }
                }
                xhr.send(formData);
            } else {
                xhr.send();
            }
        },
        setUrlQuery: function (options) {
            let {url, query} = options;
            if (!url) return '';
            if (query) {
                let queryArr = [];
                for (const key in query) {
                    if (query.hasOwnProperty(key)) {
                        queryArr.push(`${key}=${query[key]}`)
                    }
                }
                if (url.indexOf('?') !== -1) {
                    url = `${url}&${queryArr.join('&')}`
                } else {
                    url = `${url}?${queryArr.join('&')}`
                }
            }
            return url;
        }
    };

    window.window.checkIsDateFormat = function (str) {
        let reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        return reg.test(str);
    };

    window.changeUTCTime = function (str, is_utc = false) {
        if (!str) {
            return '-';
        }
        str = Date.parse(str.replace(/-/g, "/"));
        let timestamp;
        let offset = (new Date()).getTimezoneOffset() * 60000;
        if (is_utc) {
            timestamp = new Date(str).getTime() + offset;
        } else {
            timestamp = new Date(str).getTime() - offset;
        }
        let date = new Date(timestamp);
        return (date.getFullYear()) + "-" +
            ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + " " +
            (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ":" +
            (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ":" +
            (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    };

    //退出
    admin.events.logout = function () {
        let data = ajaxRequest(layui.api.logout, 'post', {}, false)['responseJSON'];
        if (data && data.code === 0) {
            layer.msg('已登出', {
                icon: 6
            });
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = setter.vhtml + 'user/login.html';
        } else {
            layer.msg('登出失败', {
                icon: 5
            });
        }
    };

    window.fixedTableHeight = function autoFixedHeight(tableElem) {
        // 获取表格div
        let $tableView = $(tableElem).next(".layui-table-view");
        // 获取两侧浮动栏
        let $fixed = $tableView.find(".layui-table-fixed");
        let dataIndex;
        let trHeight;
        // 遍历tr 修正浮动栏行高
        $tableView.find(".layui-table-main").find("tr").each(function () {
            dataIndex = $(this).attr("data-index");
            trHeight = $(this).css("height");
            $fixed.find("tr[data-index=" + dataIndex + "]").css("height", trHeight);
        });
    };

    /**
     * 函数防抖
     * @param fn 需要防抖的函数
     * @param delay 延迟毫秒数
     * @returns {Function}
     */
    window.debounce = function debounce(fn, delay) {
        let handle = null; // 定义一个变量作为等会清除对象
        return function () {
            clearTimeout(handle); // 清除定时器
            handle = setTimeout(() => {
                fn.call(this, arguments);
            }, delay)
        }
    };
    //对外暴露的接口
    exports('common', obj);
});
