function getCookie(a) {
  a = window.localStorage ? localStorage.getItem(a) || sessionStorage.getItem(a) : (a = document.cookie.match(new RegExp('(?:^|;\\s)' + a + '=(.*?)(?:;\\s|$)'))) ? a[1] : '';
  return a;
}

function setCookie(a, b, c) {
  if (window.localStorage) try {
    c ? localStorage.setItem(a, b) : sessionStorage.setItem(a, b);
  } catch (e) {
  } else document.cookie = a + '=' + b + ';path=/;domain=' + getTopDomain() + (c ? ';expires=' + c : '');
}

function getTopDomain() {
  var a = window.location.host, b = { 'com.cn': 1, 'js.cn': 1, 'net.cn': 1, 'gov.cn': 1, 'com.hk': 1, 'co.nz': 1 },
    c = a.split('.');
  2 < c.length && (a = (b[c.slice(-2).join('.')] ? c.slice(-3) : c.slice(-2)).join('.'));
  return a;
}
//url解析 a是总参数，b为上一个页面地址
function parseUrl(a, b) {
  var c = {}, e;
  if (void 0 === b) {//b为undefined,上一页面地址
    var d = window.location;
    var k = d.host;//主域名
    var f = d.pathname;//子路由
    var g = d.search.substr(1);//地址参数
    var h = d.hash;//地址hash
  } else {
    d = b.match(/\w+:\/\/((?:[\w-]+\.)+\w+)(?::\d+)?(\/[^\?\\"'\|:<>]*)?(?:\?([^'"\\<>#]*))?(?:#(\w+))?/i) || [], k = d[1], f = d[2], g = d[3], h = d[4];//上一个页面的地址参数
  }

  //处理hash
  void 0 !== h && (h = h.replace(/"|'|<|>/ig, 'M'));//如果存在hash,hash中的" ' < >字符转换成 M

  //处理地址参数，并把解析参数以对象的方式存入c中
  g && function() {
    for (var a = g.split('&'), b = 0, e = a.length; b < e; b++) {
      if (-1 != a[b].indexOf('=')) {
        var d = a[b].indexOf('='), h = a[b].slice(0, d);
        d = a[b].slice(d + 1);
        c[h] = d;
      }
    }
  }();

  //再处理地址参数，去除忽略参数键值对，生成参数字符串
  g = function() {
    if ('undefined' ===
      typeof g) return g;//如果无地址参数，直接返回undefined

    for (var b = g.split('&'), c = [], e = 0, d = b.length; e < d; e++) if (-1 != b[e].indexOf('=')) {
      var h = b[e].indexOf('='), f = b[e].slice(0, h);
      h = b[e].slice(h + 1);
      a.ignoreParams && -1 != a.ignoreParams.indexOf(f) || c.push(f + '=' + h);
    }
    return c.join('&');
  }();

  //hash 存在,查看是否存在adtag
  h && function() {
    for (var a = 0 == h.indexOf('#') ? h.substr(1).split('&') : h.split('&'), b = 0, c = a.length; b < c; b++) if (-1 != a[b].indexOf('=')) {
      var d = a[b].indexOf('='), g = a[b].slice(0, d);
      d = a[b].slice(d + 1);
      if ('adtag' === g.toLowerCase()) {
        e = d;
        break;
      }
    }
  }();
  //返回一个地址对象，里面存在主域名/路由/参数/hash字符串/参数对象格式/adtag字段值
  return {
    host: k, path: f, search: g,
    hash: h, param: c, adtag: e,
  };
}

function getMainInfo(a) {
  var b = parseUrl(a),
    c = {
      dm: b.host,
      pvi: '',
      si: '',
      url: b.path,
      arg: encodeURIComponent(b.search || '').substr(0, 512),
      ty: 0//?第一次访问
    };
  c.pvi = function() {
    if (a.userReport) {//如果用户登录，拿到pgv_uid
      var b = getCookie('pgv_uid');//获取用户的pgv_uid
      //pgv_uid存在 如果等于a里面的user.id，则无操作,否则设置新的user.id值
      b && b == a.user.user_id || (c.ty = 1, setCookie('pgv_uid', a.user.user_id, 'Sun, 18 Jan 2038 00:00:00 GMT;'));
      b = a.user.user_id;//把新的pgv_id赋值给b
    } else {//用户未登录,如果没生成过pgv_pvi,生成一个
        //去pgv_pv1
        b = getCookie('pgv_pvi'), b || (c.ty = 1, b = getRandom(), setCookie('pgv_pvi', b, 'Sun, 18 Jan 2038 00:00:00 GMT;'));
    }
    return b;
  }();
  c.si = function() {
    var a = getCookie('pgv_si');
    // 如果pgv_si不存在，生成一个，并存储
    a || (a = getRandom('s'), setCookie('pgv_si',
      a));
    return a;//返回pgv_si
  }();
  c.url = function() {
    var c = b.path;//c为子路由
    //如果url参数进入统计,如果参数存在c为子路由+?+参数（经过转码处理
    a.senseQuery && (c += b.search ? '?' + encodeURIComponent(b.search || '').substr(0, 512) : '');

    //如果hash参数进入统计，c 为
    a.senseHash && (c += b.hash ? encodeURIComponent(b.hash) : '');
    return c;
  }();
  return c;
}

function getRandom(a) {
  for (var b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], c = 10; 1 < c; c--) {
    var e = Math.floor(10 * Math.random()), d = b[e];
    b[e] = b[c - 1];
    b[c - 1] = d;
  }
  for (c = e = 0; 5 > c; c++) e = 10 * e + b[c];
  return (a || '') + (e + '' + +new Date);
}

function getExtInfo(a) {
  return { r2: a.sid };
}

function joinExtInfo(a) {
  var b = {};
  if (a) {
    var c = [], e;
    for (e in a) a.hasOwnProperty(e) && c.push(encodeURIComponent(e) + '=' + encodeURIComponent(a[e]));
    a = c.join(';');
    b.ext = a;
  }
  return b;
}

function getReferer(a) {
  var b = parseUrl(a, document.referrer);//处理上一个页面链接
  a = parseUrl(a);//处理当前页面链接
  return {
    rdm: b.host,
    rurl: b.path,
    rarg: encodeURIComponent(b.search || '').substr(0, 512),
    adt: a.param.ADTAG || a.param.adtag || a.param.CKTAG || a.param.cktag || a.param.PTAG || a.param.ptag || a.adtag,
  };
}

//获取环境信息
function getEnvInfo() {
  try {
    var a = navigator, b = screen || { width: '', height: '', colorDepth: '' }, c = {
      scr: b.width + 'x' + b.height,
      scl: b.colorDepth + '-bit',
      lg: (a.language || a.userLanguage).toLowerCase(),
      tz: (new Date).getTimezoneOffset() / 60,
    };
  } catch (e) {
    return {};
  }
  return c;
}

function xhperf() {
  if (window.performance) {
    var a = window.performance.timing;
    var b = { value: a.domainLookupEnd - a.domainLookupStart }, c = { value: a.connectEnd - a.connectStart },
      e = { value: a.responseStart - (a.requestStart || a.responseStart + 1) }, d = a.responseEnd - a.responseStart;
    a.domContentLoadedEventStart ? 0 > d && (d = 0) : d = -1;
    a = {
      domainLookupTime: b,
      connectTime: c,
      requestTime: e,
      resourcesLoadedTime: { value: d },
      domParsingTime: { value: a.domContentLoadedEventStart ? a.domInteractive - a.domLoading : -1 },
      domContentLoadedTime: {
        value: a.domContentLoadedEventStart ?
          a.domContentLoadedEventStart - a.fetchStart : -1,
      },
    };
  } else a = '';
  return a;
}

module.exports = {
  conf: {},
  version: '2.0.15',
  init: function(a) {
    var b = {
      sid: 0,//sid
      cid: 0,//cid
      autoReport: 0,//自动上报默认为false
      senseHash: 0,//hash相关
      senseQuery: 0,//url参数相关
      userReport: 0,//用户登录/用户未登录
      performanceMonitor: 0,//页面资源监控
      ignoreParams: [],//忽略参数
    };

    //如果a存在，即init传参,如果c是可枚举属性,给b赋值
    if (a) {for (var c in a) a.hasOwnProperty(c) && b.hasOwnProperty(c) && (b[c] = a[c])};
    this.conf = b;//conf指向b
    this.conf.autoReport && this.pgv();//自动上报则执行this.pgv()
  },
  pgv: function() {//上报pgv代码
    var a = this.conf, b = [], c = this.version;
    if (a.sid){ //sid存在
      if (!a.userReport || a.user && a.user.user_id && !parseInt(a.user.user_id, 10) !== conf.user.user_id) {//未知用户或者用户id存在但是用户id不全为数字
        for (var e = 0, d = [getMainInfo(a), getReferer(a), getExtInfo(a), getEnvInfo(),
          joinExtInfo({ version: c }), { random: +new Date }], k = d.length; e < k; e++) for (var f in d[e]) d[e].hasOwnProperty(f) && b.push(f + '=' + ('undefined' == typeof d[e][f] ? '' : d[e][f]));
          var g = function(a) {
            a = ('https:' == document.location.protocol ? 'https://pingtas.qq.com/webview' : 'http://pingtcss.qq.com') + '/pingd?' + a.join('&').toLowerCase();
            var b = new Image;
            b.onload = b.onerror = b.onabort = function() {
              b = b.onload = b.onerror = b.onabort = null;
            };
            b.src = a;
          };
        g(b);
        a.performanceMonitor && (b = function() {
          for (var b = xhperf(), d = [], e = [], f = 0, k = [getMainInfo(a),
            { r2: a.cid }, getEnvInfo(), { random: +new Date }], m = k.length; f < m; f++) for (var l in k[f]) k[f].hasOwnProperty(l) && e.push(l + '=' + ('undefined' == typeof k[f][l] ? '' : k[f][l]));
          for (l in b) b.hasOwnProperty(l) && ('domContentLoadedTime' == l ? e.push('r3=' + b[l].value) : d.push(b[l].value));
          b = joinExtInfo({ pfm: d.join('_'), version: c });
          e.push('ext=' + b.ext);
          g(e);
        }, 'undefined' !== typeof window.performance && 'undefined' !== typeof window.performance.timing && 0 != window.performance.timing.loadEventEnd ? b() : window.attachEvent ? window.attachEvent('onload',
          b) : window.addEventListener && window.addEventListener('load', b, !1));
      }
    } else console.log('MTA H5\u5206\u6790\u9519\u8bef\u63d0\u793a\uff1a\u60a8\u9009\u62e9\u4e86\u7528\u6237\u7edf\u8ba1uv\uff0c\u8bf7\u8bbe\u7f6e\u4e1a\u52a1\u7684user_id\uff0c\u9700\u4e3aint\u7c7b\u578b'); else console.log('MTA H5\u5206\u6790\u9519\u8bef\u63d0\u793a\uff1a\u60a8\u6ca1\u6709\u8bbe\u7f6esid');
  },
  clickStat: function(a, b) {
    var c = this.conf, e = [], d = getMainInfo(c), k = getExtInfo(c);
    //如果cid存在
    if (c.cid) {
      d.dm = 'taclick';
      d.url = a;
      k.r2 = c.cid;
      k.r5 = function(a) {
        a =
          'undefined' === typeof a ? {} : a;
        var b = [], c;
        for (c in a) a.hasOwnProperty(c) && b.push(c + '=' + encodeURIComponent(a[c]));
        return b.join(';');
      }(b);
      var f = 0;
      c = [d, getReferer(c), k, getEnvInfo(), joinExtInfo({ version: this.version }), { random: +new Date }];
      for (d = c.length; f < d; f++) for (var g in c[f]) c[f].hasOwnProperty(g) && e.push(g + '=' + ('undefined' == typeof c[f][g] ? '' : c[f][g]));
      e = ('https:' == document.location.protocol ? 'https://pingtas.qq.com/webview' : 'http://pingtcss.qq.com') + '/pingd?' + e.join('&');
      var h = new Image;
      h.onload = h.onerror =
        h.onabort = function() {
          h = h.onload = h.onerror = h.onabort = null;
        };
      h.src = e;
    } else console.log('MTA H5\u5206\u6790\u9519\u8bef\u63d0\u793a\uff1a\u60a8\u6ca1\u6709\u8bbe\u7f6ecid,\u8bf7\u5230\u7ba1\u7406\u53f0\u5f00\u901a\u81ea\u5b9a\u4e49\u4e8b\u4ef6\u5e76\u66f4\u65b0\u7edf\u8ba1\u4ee3\u7801');
  }, clickShare: function(a) {
    var b = this.conf, c = parseUrl(b);
    c = c.param.CKTAG || c.param.ckatg;
    var e = 'undefined' === typeof c ? [] : c.split('.');
    if (b.cid) {
      c = [];
      var d = getMainInfo(b), k = getExtInfo(b);
      d.dm = 'taclick_share';
      d.url = 'mtah5-share-' +
        a;
      k.r2 = b.cid;
      k.r5 = function(a, b) {
        var c = [];
        2 === a.length && a[0] == b && c.push(a[0] + '=' + a[1]);
        return c.join(';');
      }(e, 'mtah5_share');
      a = 0;
      b = [d, getReferer(b), k, getEnvInfo(), joinExtInfo({ version: this.version }), { random: +new Date }];
      for (d = b.length; a < d; a++) for (var f in b[a]) b[a].hasOwnProperty(f) && c.push(f + '=' + ('undefined' == typeof b[a][f] ? '' : b[a][f]));
      f = ('https:' == document.location.protocol ? 'https://pingtas.qq.com/webview' : 'http://pingtcss.qq.com') + '/pingd?' + c.join('&');
      var g = new Image;
      g.onload = g.onerror = g.onabort =
        function() {
          g = g.onload = g.onerror = g.onabort = null;
        };
      g.src = f;
    } else console.log('MTA H5\u5206\u6790\u9519\u8bef\u63d0\u793a\uff1a\u60a8\u6ca1\u6709\u8bbe\u7f6ecid,\u8bf7\u5230\u7ba1\u7406\u53f0\u5f00\u901a\u81ea\u5b9a\u4e49\u4e8b\u4ef6\u5e76\u66f4\u65b0\u7edf\u8ba1\u4ee3\u7801');
  },
};
