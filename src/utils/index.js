/*
 * @Author: Yorn Qiu
 * @Date: 2020-12-16 15:35:55
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-02-17 15:58:37
 * @Description: 工具类
 * @FilePath: /vue3-template/src/utils/index.js
 */

import numberUtils from '@/utils/numberUtils';
import validateUtils from '@/utils/validateUtils';

const utils = {
  /**
   * @description: 从localStorage中读取属性值
   * @param {string} key
   * @param {boolean} parse 是否将序列化的字符串转化为Object
   * @return {string|object}
   */
  getItem(key, parse) {
    let value = localStorage.getItem(key);
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
      localStorage.setItem(key, value);
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
   * @param {string} value
   * @return {boolean} 是否为空
   */
  isEmpty(value) {
    return value === null || value === undefined || value === '';
  },

  /**
   * @description: 判断是否为 null或undefined
   * @param {string} value
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
    let s = [];
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
   * @description: 判断浏览器类型是否为IE
   * @return {boolean}
   */
  isIE() {
    const userAgent = navigator.userAgent;
    return userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && userAgent.indexOf('Opera') === -1;
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
  },

  /**
   * @description: 选择文件，使用input输入框选择文件
   * @param {object} option 配置选项，可选配置项为：multiple，是否支持多选，默认false；accept，接受的文件类型，默认全部
   * @return {promise} Promise对象，内容为input[file]返回的文件列表
   */
  selectFile(option = {}) {
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
  async uploadFile(url, option = {}) {
    const { beforeSelect, beforeUpload, onprogress, params } = option;

    beforeSelect && beforeSelect();

    const files = await this.selectFile(option);
    const fd = new FormData();
    files.forEach((file) => fd.append('files', file, file.name));
    params && Object.keys(params).forEach((k) => fd.append(k, params[k]));

    beforeUpload && beforeUpload();

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
  downloadFileAjax(url, option = {}) {
    const { method, type, params, name, onprogress } = option;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method || 'get', url, true);
      xhr.responseType = 'blob';
      xhr.setRequestHeader(
        'Content-Type',
        type === 'json' ? 'application/json; charset=utf-8' : 'application/x-www-form-urlencoded'
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
          const fileName = xhr.getResponseHeader('Content-Disposition').substring(20);
          this.downloadFile(name || decodeURIComponent(fileName), blob); //解码名称
          resolve();
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
   * @param {object|string} content 文件内容或文件地址
   */
  downloadFile(fileName, content) {
    const a = document.createElement('a');
    a.download = fileName;
    a.style.display = 'none';

    if (typeof content === 'string') {
      a.href = content; // content为文件地址
    } else {
      const blob = new Blob([content]);
      a.href = URL.createObjectURL(blob); // content为文件内容
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
   * @param {function} handler 用来处理树节点的方法
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
   * @param {function} handler 用来处理树节点的方法
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
   * @return {object} 要获取的节点，未找到时返回undefined
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

  /**
   * @description: 判断元素是否进入可视区域
   * @param {Element} el 元素
   * @param {number} offset 偏移值
   * @return {boolean}
   */
  isInViewPort(el, offset) {
    const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (el.getBoundingClientRect) {
      return el.getBoundingClientRect().top <= viewPortHeight + offset;
    }

    const offsetTop = el.offsetTop;
    const scrollTop = document.documentElement.scrollTop;
    return offsetTop - scrollTop <= viewPortHeight + offset;
  },
};

export default Object.freeze({ ...utils, numberUtils, validateUtils });
