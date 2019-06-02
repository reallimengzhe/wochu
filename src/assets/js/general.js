export {
    randomColor,
    randomInt,
    getStyle,
    stopDefault,
    stopPropagation,
    addEvent,
    removeEvent,
    setCookie,
    clearCookie,
    getCookie,
    formatCurrency,
    fillSpace
}
// 随机颜色
function randomColor() {
    return `rgb( ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255} )`;
}
// 随机数
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
// 获取样式
function getStyle(ele, attr) {
    if (ele.currentStyle) {
        return parseFloat(ele.currentStyle[attr]); // IE
    } else {
        return parseFloat(getComputedStyle(ele, false)[attr]);
    }
}
// 阻止默认事件
function stopDefault(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false; // IE
    }
}
// 阻止事件冒泡
function stopPropagation(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true; // IE
    }
}
// 事件监听
function addEvent(ele, type, callback) {
    if (ele.addEventListener) {
        ele.addEventListener(type, callback, false);
    } else {
        ele.attachEvent('on' + type, callback); // IE
    }
}
// 移除事件监听
function removeEvent(ele, type, callback) {
    if (ele.removeEventListener) {
        ele.removeEventListener(type, callback, false);
    } else {
        ele.detachEvent('on' + type, callback); // IE
    }
}
// 设置 Cookie
function setCookie(key, value, days) {
    var day = new Date();
    day.setDate(day.getDate() + days);
    document.cookie = key + '=' + value + ';expires=' + day;
}
// 删除 Cookie
function clearCookie(key) {
    setCookie(key, 1, -1);
}
// 获取 Cookie
function getCookie(key) {
    var userCookie = document.cookie;
    // console.log(userCookie);
    var arr = userCookie.split('; ');
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].split('=')[0] == key) {
            return arr[i].split('=')[1];
        }
    }
    return '';
}
// 货币格式化
function formatCurrency(value, currency, decimals) {
    value = parseFloat(value)
    if (!isFinite(value) || (!value && value !== 0)) return ''
    currency = currency != null ? currency : '￥'
    decimals = decimals != null ? decimals : 2
    var stringified = Math.abs(value).toFixed(decimals)
    var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
    var i = _int.length % 3
    var head = i > 0 ? (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) : ''
    var _float = decimals ? stringified.slice(-1 - decimals) : ''
    var sign = value < 0 ? '-' : ''
    return sign + currency + head + _int.slice(i).replace(/(\d{3})(?=\d)/g, '￥1,') + _float
}
// 手机号格式化
function fillSpace(number) {
    var temp = [];
    temp[0] = number.slice(0, 3);
    temp[1] = number.slice(3, 7);
    temp[2] = number.slice(7);
    return temp.join(" ");
}