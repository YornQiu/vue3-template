/*
 * @Author: Yorn Qiu
 * @Date: 2020-12-16 15:35:55
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-12-19 14:07:50
 * @FilePath: /vue3-template/src/utils/index.js
 * @Description: utils
 */

import numberUtils from '@/utils/number-utils';
import validateUtils from '@/utils/validate-utils';

const utils = {
  /**
   * @description: 从localStorage中读取属性值
   * @param {string} key
   * @param {boolean} parse 是否将序列化的字符串转化为Object
   * @return {string|object|null}
   */
  getItem(key, parse) {
    const value = localStorage.getItem(key);
    if (value !== null && parse) {
      return JSON.parse(value);
    }
    return value;
  },

  /**
   * @description: 在localStorage中设置属性值
   * @param {string} key
   * @param {string|object} value
   * @return {boolean}
   */
  setItem(key, value) {
    if (this.isEmpty(key) || this.isVain(value)) {
      return false;
    }
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, `${value}`);
    }
    return true;
  },

  /**
   * @description: 从localStorage中删除属性值
   * @param {string} key
   */
  removeItem(key) {
    localStorage.removeItem(key);
  },

  /**
   * @description: 判断是否为 null,undefined或""
   * @param {any} value
   * @return {boolean} 是否为空
   */
  isEmpty(value) {
    return value === null || value === undefined || value === '';
  },

  /**
   * @description: 判断是否为 null或undefined
   * @param {any} value
   * @return {boolean} 是否为空
   */
  isVain(value) {
    return value === null || value === undefined;
  },

  /**
   * @description 生成32位唯一数uuid
   * @return {string} uuid
   */
  uuid() {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    return s.join('');
  },

  /**
   * @description: 生成21位nanoid
   * @return {string}
   */
  id() {
    return crypto.getRandomValues(new Uint8Array(21)).reduce((id, byte) => {
      byte &= 63;
      if (byte < 36) {
        id += byte.toString(36); // `0-9a-z`
      } else if (byte < 62) {
        id += (byte - 26).toString(36).toUpperCase(); // `A-Z`
      } else if (byte == 62) {
        id += '_';
      } else {
        id += '-';
      }
      return id;
    }, '');
  },

  /**
   * @description: 获取浏览器类型
   * @return {string} 浏览器类型：Edge、Firefox、Safari、Chrome、Opera、IE
   */
  getBrowser() {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf('Edge') > -1) {
      return 'Edge';
    }
    if (userAgent.indexOf('Firefox') > -1) {
      return 'Firefox';
    }
    if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1) {
      return 'Safari';
    }
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) {
      return 'Chrome';
    }
    if (userAgent.indexOf('Opera') > -1 && userAgent.indexOf('MSIE') === -1) {
      return 'Opera';
    }

    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
      reIE.test(userAgent);
      const IEVersion = parseFloat(RegExp['$1']);
      if (IEVersion === 7) {
        return 'IE7';
      } else if (IEVersion === 8) {
        return 'IE8';
      } else if (IEVersion === 9) {
        return 'IE9';
      } else if (IEVersion === 10) {
        return 'IE10';
      } else if (IEVersion === 11) {
        return 'IE11';
      } else {
        return 'IE';
      }
    }

    return '';
  },

  /**
   * @description: 选择文件，使用input输入框选择文件
   * @param {object} option 配置选项，可选配置项为：multiple，是否支持多选，默认false；accept，接受的文件类型，默认全部
   * @return {promise} Promise对象，内容为input[file]返回的文件列表
   */
  selectFile(option) {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = option.multiple || false;
      input.accept = option.accept || '';

      input.onchange = function (e) {
        resolve(e.target.files);
      };
      input.onabort = function () {
        reject();
      };

      input.click();
    });
  },

  /**
   * @description: 通过xhr请求上传文件
   * @param {string} url 请求地址
   * @param {object} option 配置选项，支持multiple(多选)，accept(接受的文件类型)，params(请求参数)，beforeSelect(选择文件之前的钩子)，beforeUpload(上传文件之前的钩子)，onprogress(下载进度回调函数)
   * @return {promise} 包含请求结果的Promise对象
   */
  async uploadFile(url, option) {
    const { beforeSelect, beforeUpload, onprogress, params, fileField } = option;

    beforeSelect && beforeSelect(params);

    const files = await this.selectFile(option);
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fd.append(fileField || 'files', file, file.name);
    }
    params && Object.keys(params).forEach((k) => fd.append(k, params[k]));

    beforeUpload && beforeUpload(params);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      };
      xhr.onerror = () => {
        reject(xhr.response);
      };

      if (onprogress) {
        xhr.upload.onprogress = (e) => onprogress(e);
      }

      xhr.send(fd);
    });
  },

  /**
   * @description: 通过xhr请求下载文件
   * @param {string} url 请求地址
   * @param {object} option 配置选项，支持 method(请求方法)，params(请求参数)，type(参数类型)，name(文件名)，onprogress(下载进度回调函数)
   * @return {promise} 包含请求结果的Promise对象
   */
  downloadFileAjax(url, option) {
    const { method, type, name, params, onprogress } = option;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method || 'get', url, true);
      xhr.responseType = 'blob';
      xhr.setRequestHeader(
        'Content-Type',
        type === 'json' ? 'application/json; charset=utf-8' : 'application/x-www-form-urlencoded',
      );

      const _params =
        typeof params === 'object'
          ? type === 'json'
            ? JSON.stringify(params)
            : Object.entries(params)
                .map((item) => item.join('='))
                .join('&')
          : params;

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const fileName = xhr.getResponseHeader('Content-Disposition')?.substring(20) || '';
          this.downloadFile(name || decodeURIComponent(fileName), blob); //解码名称
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      };
      xhr.onerror = () => {
        reject(xhr.response);
      };

      if (onprogress) {
        xhr.onprogress = (e) => onprogress(e);
      }

      xhr.send(null || _params);
    });
  },

  /**
   * @description: 文件下载
   * @param {string} fileName 文件名
   * @param {string|BlobPart} content 文件内容或文件地址
   */
  downloadFile(fileName, content) {
    const a = document.createElement('a');
    a.download = fileName;
    a.style.display = 'none';

    let objectUrl;

    if (typeof content === 'string') {
      a.href = content; // content为文件地址
    } else if (content instanceof Blob) {
      objectUrl = a.href = URL.createObjectURL(content); // content为Blob对象
    } else {
      const blob = new Blob([content]); // content为ArrayBuffer等
      objectUrl = a.href = URL.createObjectURL(blob);
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    objectUrl && URL.revokeObjectURL(objectUrl);
  },

  /**
   * 深复制
   * @param value 值
   * @returns
   */
  cloneDeep(value) {
    // 非object
    if (typeof value !== 'object' || value == null || value instanceof Error) {
      return value;
    }

    // dom
    if (typeof window !== 'undefined' && (value instanceof Node || value instanceof HTMLCollection)) {
      return value;
    }

    const newValue = {};
    const keys = Object.keys(value);
    for (const key of keys) {
      const val = value[key];
      if (typeof value !== 'object' || value == null || value instanceof Error) {
        newValue[key] = val;
      } else if (Array.isArray(val)) {
        newValue[key] = val.map((item) => this.cloneDeep(item));
      } else if (val instanceof Set) {
        const newSet = new Set();
        val.forEach((item) => {
          newSet.add(this.cloneDeep(item));
        });
        newValue[key] = newSet;
      } else if (val instanceof Map) {
        const newMap = new Map();
        val.forEach((item, key) => {
          newMap.set(key, this.cloneDeep(item));
        });
        newValue[key] = newMap;
      } else {
        newValue[key] = this.cloneDeep(val);
      }
    }

    return newValue;
  },

  /**
   * 日期格式化
   * @param {string|number|undefined|null} date 可转化为Date的字符串或时间戳, 为空时返回当前时间
   * @param {string} fmt 格式化字符串，默认为 yyyy-MM-dd HH:mm:ss
   * @returns {string} 格式化后的日期字符串
   */
  dateFormat(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
    const dateObj = date ? new Date(date) : new Date();
    const opt = {
      'y+': dateObj.getFullYear().toString(), // 年
      'M+': (dateObj.getMonth() + 1).toString(), // 月
      'd+': dateObj.getDate().toString(), // 日
      'H+': dateObj.getHours().toString(), // 时
      'm+': dateObj.getMinutes().toString(), // 分
      's+': dateObj.getSeconds().toString(), // 秒
      'S+': dateObj.getMilliseconds().toString(), // 毫秒
    };

    for (const k in opt) {
      const ret = new RegExp(`(${k})`).exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
      }
    }
    return fmt;
  },

  /**
   * @description: 将扁平数组转化为树或森林
   * @param {array} nodes 节点数组
   * @param {string} id 节点的id字段，默认为id
   * @param {string} pid 节点的父节点id字段，默认为pid
   * @param {string} children 节点的子节点字段，默认为children
   * @return {array} 树或森林
   */
  generateTree(nodes, id = 'id', pid = 'pid', children = 'children') {
    if (!Array.isArray(nodes)) {
      return [];
    }

    const tree = [];
    const treeMap = {};

    for (const node of nodes) {
      treeMap[node[id]] = node;
    }

    for (const node of nodes) {
      const pNode = treeMap[node[pid]];

      if (pNode) {
        (pNode[children] || (pNode[children] = [])).push(node);
      } else {
        tree.push(node);
      }
    }

    return tree;
  },

  /**
   * @description: 广度优先遍历树
   * @param {object|array} tree 树或森林
   * @param {Function} handler 用来处理树节点的方法
   */
  BFSTree(tree, handler) {
    if (!tree || typeof tree !== 'object') return;

    const queue = Array.isArray(tree) ? [...tree] : [tree];
    let node;

    while (queue.length) {
      node = queue.shift();
      handler && handler(node);
      node.children && node.children.forEach((child) => queue.push(child));
    }
  },

  /**
   * @description: 广度优先遍历树
   * @param {object|array} tree 树或森林
   * @param {Function} handler 用来处理树节点的方法
   */
  DFSTree(tree, handler) {
    if (!tree || typeof tree !== 'object') return;

    const stack = Array.isArray(tree) ? [...tree] : [tree];
    let node;

    while (stack.length) {
      node = stack.pop();
      handler && handler(node);
      node.children && node.children.forEach((child) => stack.push(child));
    }
  },

  /**
   * @description: 获取树中的某一个节点，得到一个节点后直接返回，不会继续查找
   * @param {object|array} tree 树或森林
   * @param {string} id 要获取的节点id
   * @return {object|undefined} 要获取的节点，未找到时返回undefined
   */
  getTreeNode(tree, id) {
    if (!tree || typeof tree !== 'object') return;

    const queue = Array.isArray(tree) ? [...tree] : [tree];
    let node;

    while (queue.length) {
      node = queue.shift();
      if (node.id === id) return node;
      node.children && node.children.forEach((child) => queue.push(child));
    }
  },
};

export default Object.freeze({ ...utils, numberUtils, validateUtils });
