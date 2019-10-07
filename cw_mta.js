/**
 * @des 获取本地存储数据
 * @params {String} name 数据名称
 * @return {String} 值
 */
function getCookie(name) {
  name = window.localStorage ? localStorage.getItem(name) || sessionStorage.getItem(name) : (name = document.cookie.match(new RegExp('(?:^|;\\s)'+ name + '=(.*?)(?:;\\s|$)'))) ? name[1]:'';
  return name;
}

/**
 * @des 设置本地存储
 * @params {String} name 数据名称
 * @params {String} value 数据值
 * @params {Date} date 过期时间
 */
function setCookie(name, value, Date){
  if(window.localStorage){
   try {
     Date ? localStorage.setItem(name,value) : sessionStorage.setItem(name,value);
   } catch(e){

   }
  }else{
    document.cookie = name + '=' + value + ';path/;domain=' + getTopDomain() + (Date ? ';expires' + Date: '');
  }
}

function getTopDomain() {
  var a = window.location.host, b = { 'com.cn': 1, 'js.cn': 1, 'net.cn': 1, 'gov.cn': 1, 'com.hk': 1, 'co.nz': 1 },
    c = a.split('.');
  2 < c.length && (a = (b[c.slice(-2).join('.')] ? c.slice(-3) : c.slice(-2)).join('.'));
  return a;
}

/**
 * @des 获取用户浏览器信息
 * @return {Object} 返回请求头部分信息
 */
function getUserAgent() {
  const uInfo = {};
  uInfo.kernel = getKernel();//浏览器内核
  uInfo.isMobile = isMobile();//是否为手机
  uInfo.isAndroid = isAndroid();//是否为android系统
  uInfo.isIOS = isIos();//是否为IOS系统
  uInfo.isWechat = isWeChat();//是否是在微信中
  return uInfo;
}

/**
 * @des 获取浏览器内核
 * @return {String} 浏览器内核名称
 */
function getKernel(){
  const u = navigator.userAgent;
  const ukv = [
    {
      key:'AppleWebKit',
      value:'webkit',
    },
    {
      key:'Trident',
      value:'trident',
    },
    {
      key:'Firefox',
      value:'gecko'
    },
    {
      key:'Presto',
      value:'presto',
    }
  ];

  let kernel = 'other';
  let isEnd = false;
  let i = 0;
  while(i < ukv.length && !isEnd){
    if(u.indexOf(ukv[i]).key !== -1){
        isEnd = true;
        kernel = ukv[i].value;
    }
    ++i;
  }
  return kernel
}

/**
 * @des 判断是否为移动终端
 * @return {Boolean} true是移动终端 false不是
 */
function isMobile(){
  const u = navigator.userAgent;
  return !!u.match(/AppleWebKit.*Mobile.*/)
}

/**
 * @des 判断是否为微信
 * @return {Boolean} true是 false不是
 */
function isWeChat(){
  const u = navigator.userAgent;
  return u.indexOf('MicroMessenger') !== -1
}

/**
 * @des 判断是否是android系统
 * @return {Boolean} true 是 false不是
 */
function isAndroid(){
  const u = navigator.userAgent;
  return u.indexOf('Android') !== -1 || u.indexOf('Linux') !== -1;
}

/**
 * @des 判断是否为ios系统
 * @return {Boolean} true是 false不是
 */
function isIos(){
  const u = navigator.userAgent;
  return !!u.match(/(![^;]+;(U;))?CPU.+Mac OS X/);
}

/**
 * @des 对象转换成数组格式输出
 * @params {Object} obj
 * @return {Array} 生成的数组
 */
function quArr(obj){

  const arr = [];

  if(!!obj){
    for(let key in obj){
        arr.push(`${key}=${obj[key]}`);
    }
  }
  return arr;
}

/**
 * @des 获取地址参数的中的某个参数值
 * @params {String} href  url或者search
 * @reurn {String} 参数值，没有则为空字符
 */
function quItem(href,key){
  let pStr = href.split('?')[1];
  let value = '';

  if(pStr){
    const pStrArr = pStr.split('&');
    if(Array.isArray(pStrArr)){
      let i = 0;
      let isEnd = false;
      while (i < pStrArr.length && !isEnd){
        const itemArr = pStrArr[i].split('=');
        if(itemArr[0] === 'ADTAG'){
          value = itemArr[1];
          isEnd = true;
        }else{
          i++;
        }
      }
    }
  }

  return value;
}

/**
 * @des 将多个对象合并成新对象
 * @params {Object} obj1,obj2,...objn 多个对象
 * @return {Object} 新对象
 */
function mergeObj(){
  const parArr = Array.from(arguments);
  const newObj = {};
  parArr.map(item => {
    if(!!item){
      Object.assign(newObj,item)
    }
  });

  return newObj;
}

/**
 * @des 生成唯一的uuid
 * @return {String} 返回唯一的uuid
 */
function buildUuid(){
  let timeStamp = (+new Date()).toString().slice(6);//六位
  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let ranNum =  Math.random().toString().slice(2,8);//六位
  let ranStr = '';
  const uInfo = getUserAgent();
  [...ranNum].map(item => {
    const strIdx = item * 3 + Math.floor(Math.random() * 21);
    ranStr += str[strIdx];
  })
  return ranStr + ranNum + uInfo.kernel + timeStamp;
}

/**
 * @des 解析地址
 * @param {Object} conf 参数
 * @return {Object} 返回解析出的数据
 */
function parseUrl(conf,referrer){
  let urlObj = {}, hashAd = '';
  let host = '',
      path = '',
      search = '',
      hash = '';
  if(void 0 === referrer){
    const loc = window.location;
     host = loc.host;//主域名
     path = loc.pathname;//子路径
     search = loc.search.substr(1);//地址参数
     hash = loc.hash;//地址hash
  }else{
    const locArr = referrer.match(/\w+:\/\/((?:[\w-]+\.)+\w+)(?::\d+)?(\/[^\?\\"'\|:<>]*)?(?:\?([^'"\\<>#]*))?(?:#(\w+))?/i) || [], host = locArr[1], path = locArr[2], search = locArr[3], hash = locArr[4];//上一个页面的地址参数
  }

  //处理hash
  void 0 !== hash && (hash.replace(/"|'|<|>/ig, 'M'));//如果hash存在，则将" ' < >转换成M

  //处理地址参数，把解析参数以对象的方式存入urlObj中
  search && (function(){
    for(let seArr =  search.split('&'),i = 0, seArrLen = seArr.length; i < seArrLen; i++){
      if(-1 != seArr[i].indexOf('=')){
          const iIdx = seArr[i].indexOf('='),
                key  = seArr[i].slice(0,iIdx),
                value = seArr[i].slice(iIdx+1);
          urlObj[key] = value;
      }
    }
  })();

  // hash 存在，查看是否存在adtag
  hash && (function(){
    for(let hashArr = 0 == hash.indexOf('#') ? hash.substr(1).split('&'):hash.split('&'),i = 0, hashArrLen = hashArr.length;i < hashArrLen; i++){
      const iIdx = hashArr[i],
            key = hashArr[i].slice(0,iIdx),
            value = hashArr[i].slice(iIdx + 1);
       if('adtag' === key.toLowerCase()){
         hashAd = value;
         break;
       }
    }
  })();

  //返回一个地址对象，里面存有主域名/路由/参数/hash/参数对象格式/adtag字段值
  return {
    host: host, path: path, search: search,
    hash:hash, param:urlObj, adtag : hashAd
  };
}

/**
 * @des 获取上个页面地址相关
 * @params {Object} conf 参数
 * @return {Object} 数据相关
 */
function getReferer(conf){
  const referrerObj = parseUrl(conf, document.referrer);
  return {
    rdm: referrerObj.host,
    rurl:referrerObj.path,
    rarg: encodeURIComponent(referrerObj.search || '' ).substr(0,512),
    adt:conf.param.ADTAG || conf.param.adtag || conf.param.CKTAG || conf.param.cktag || conf.param.ptag || conf.param.PTAG || conf.adtag
  }
}

/**
 * @des 获取主要信息
 * @params {Object} conf
 * @return {Object} 新的conf
 */
function getMainInfo(conf){
  const urlObj = parseUrl(conf),
        newConf = {
          dm:urlObj.host,
          pvi:'',
          si:'',
          url:urlObj.path,
          arg:encodeURIComponent(urlObj.search || '').substr(0, 512),
          ty:0,//第一次访问
        };
  newConf.pvi = function(){
    let pgv_id = '';
    if(conf.userReport){//如果用户登录，拿到pgv_uid
      pgv_id = getCookie('pgv_uid');//获取用户的pgv_uid
      //pgv_uid存在，如果等于a里面的user.id，则无操作，否则设置新的user.id值
      pgv_id && (pgv_id == conf.user.user_id || (newConf.cy = 1, setCookie('pgv_uid', conf.user.user_id, 'Sun, 18 Jan 2038 00:00:00 GMT;')));
      pgv_id = conf.user.user_id;
    }else{
      pgv_id = getCookie('pgv_pvi');
      pgv_id || (newConf.cy = 1, pgv_id = buildUuid(), setCookie('pgv_pvi',pgv_id,'Sun, 18 Jan 2038 00:00:00 GMT;'));
    }
    return pgv_id;
  }();

  newConf.si = function(){
    let pgv_si = getCookie('pgv_si');
    //如果pgv_si不存在,生成一个并存储
    pgv_si || (pgv_si = buildUuid(),setCookie('pgv_si',pgv_si));
    return pgv_si;
  }();

  newConf.url = function(){
    const path = urlObj.path;//子路由处理

    //如果url参数进入统计，如果参数存在
  }()
}
/**
 * @des 上传数据
 * @param {Array} paArr 数据上传数据 如['id=1','name='张三'] 
 */
function upData(paArr){
  const upUrl = 'https://ciwei.com?'+paArr.join('&');
  const upImg = new Image;
  upImg.onload = upImg.onerror = upImg.onabort = function(){
    upImg = upImg.onload = upImg.onerror = upImg.onabort = null;
  }

  upImg.src = upUrl;
}


/**
 * @des 页面访问提交
 */
export const pgv = function(){
  const {
    href,
    hostname,
    port,
    pathname
  } = window.location;//当前页面地址信息

  const uInfo = getUserAgent();//浏览器信息
  const urlInfo = {href,hostname,port,pathname};//地址信息
  const otherInfo = {timeStamp:+new Date(),type:'pgv'};//其它信息

  const allInfo = mergeObj(uInfo, urlInfo, otherInfo);
  const src = `http://sbaidu.com?${quArr(allInfo).join("&")}`;

  const upImg = new Image();
  upImg.src = src;

};

//分享监听
export const Mta_share = function(){
  const {
    href
  } = window.location;
  const uInfo = getUserAgent();//获取浏览器信息
  const urlInfo = {href};//地址信息
  const otherInfo = {timeStamp:+new Date(),type:'share',ADTAG:quItem(href,'ADTAG')};//其它信息
  const allInfo = mergeObj(uInfo, urlInfo, otherInfo);

  const src = `http://sbaidu.com/spread?${quArr(allInfo).join("&")}`;
  const upImg = new Image();
  upImg.src = src;

};

//事件埋点
export const Mta_click = function(eId,options){

};

module.exports = {
  conf:{},
  init:function(pa){
    const df = {
      autoReport:0,//自动上报默认为false
      senseHash:0,//提交hash相关数据
      senseQuery:0,//提交url参数相关
      userReport:0,//用户登录，用户未登录
    };//默认参数

    if(pa){//传参存在
      for(let key in pa){
          df[key] = pa[key];
      }
    }

    this.conf = df;
    this.conf.autoReport && this.pgv();
  },
  pgv:function(){
    let  paArr = [];//地址参数数组
    const conf = this.conf;
    if(!conf.userReport || conf.user.user_id && !parseInt(conf.user.user_id) !== conf.user.user_id){
      for(let idx = 0, arr = [getMainInfo(conf),getReferer(conf),{random:+new Date()}],arrLen = arr.length;idx < arrLen; idx++){
          for(key in arr[idx]){
            parArr.push(key + '=' + 'undefined' === typeOf(arr[idx][key]) ?'' : arr[idx][key]);
          }
      }
      //数据上传
      upData(paArr);
    }
  },
  /**
   * @事件上传
   * @param {string} evId 事件id 
   * @param {Object} opts 附带参数，默认为空 
   */
  clickStat:function(evId,opts){
    const conf = this.conf, parArr=[],mainData=getMainInfo(conf);
    if(evId){
        mainData.url = evId;//事件id
        mainData.dm = 'taclick';//dm为taclick为事件上传
        mainData.taparam = function(opts){
          const opts = 'undefined' === typeof(opts) ? {} : opts;
          const optsArr = [];
          for(let key in opts){
            optsArr.push(key + '=' + encodeURIComponent(opts[key]))
          }

          return optsArr.join(';');
        }(opts);//事件上报参数

        for(let idx = 0, arr = [mainData,getReferer(conf),{random:+new Dte}],arrLen = arr.lemhtj;idx < arrLen; idx++){
          for(let ikey in arr[idx]){
            parArr.push(ikey + '=' + 'undefined' === typeOf(arr[idx][ikey]) ?'' : arr[idx][ikey]);
          }
        }

         //数据上传
      upData(paArr);

    }else{
      //没有事件id 执行页面上传
      this.pgv();
    }
  }
}

