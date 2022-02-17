/*
 * @Author: Yorn Qiu
 * @Date: 2021-09-14 11:17:45
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-02-17 15:58:43
 * @Description: 输入校验工具
 * @FilePath: /vue3-template/src/utils/validateUtils.js
 */

const validateUtils = {
  /**
   * @description: 验证文本是否合法
   * @param {string} value 输入的值
   * @param {string} type 校验类型
   * @param {object} params 其他参数
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validate(value, type, params = {}, cb) {
    const { required = true, length } = params;
    if (required && !this.validateRequired(value, cb)) {
      return false;
    }
    if (length && !this.validateLength(value, length)) {
      return false;
    }
    switch (type) {
      case 'number':
        return this.validateNumber(value, cb);
      case 'int':
        return this.validateInt(value, cb);
      case 'username':
        return this.validateUsername(value, cb);
      case 'password':
        return this.validatePassword(value, cb);
      case 'space':
        return this.validateSpace(value, cb);
      case 'mail':
        return this.validateMail(value, cb);
      case 'mobile':
        return this.validateMobile(value, cb);
      case 'tel':
        return this.validateTel(value, cb);
      case 'char':
        return this.validateChar(value, cb);
      case 'card':
        return this.validateCard(value, cb);
      case 'ip':
        return this.validateIp(value, cb);
      case 'mac':
        return this.validateMac(value, cb);
      default:
        break;
    }
    return true;
  },

  /**
   * @description: 验证文本是否为空
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateRequired(value, cb) {
    if (value === undefined || value === null || value === '') {
      cb && cb({ valid: false, msg: '文本不能为空' });
      return false;
    }
    return true;
  },

  /**
   * @description: 验证文本长度是否符合要求
   * @param {string} value
   * @param {number|array} range 数字或者是一个表示范围的数组
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateLength(value, range, cb) {
    const length = value.length;

    if (!isNaN(range) && range > 0) {
      if (length > range) {
        cb && cb({ valid: false, msg: `文本长度不能大于${range}` });
        return false;
      }
    } else if (Array.isArray(range) && !isNaN(range[0]) && !isNaN(range[1])) {
      if (length < range[0] || value.length > range[1]) {
        cb && cb({ valid: false, msg: `文本长度需在${range[0]}到${range[1]}之间` });
        return false;
      }
    } else {
      throw new Error('文本长度验证格式错误');
    }
    return true;
  },

  /**
   * @description: 验证文本是否为数字
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateNumber(value, cb) {
    if (isNaN(value)) {
      cb && cb({ valid: false, msg: '文本必须为数字' });
      return false;
    }
    return true;
  },

  /**
   * @description: 验证文本是否为整数
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} 为整数时返回false，不为整数时返回错误信息
   */
  validateInt(value, cb) {
    const reg = /^-?[1-9][0-9]*$/;
    if (isNaN(value) || !reg.test(value)) {
      cb && cb({ valid: false, msg: '文本必须为整数' });
      return false;
    }
    return true;
  },

  /**
   * @description: 验证用户名，必须以字母开头且长度不小于8，只能包含字母或数字
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateUsername(value, cb) {
    const reg = /^[a-zA-Z]{1}([a-zA-Z0-9]){7,}$/;
    if (!reg.test(value)) {
      cb && cb({ valid: false, msg: '用户名格式错误' });
      return false;
    }
    return true;
  },

  /**
   * @description: 密码验证，必须包含字母和数字，且长度不小于8个字符
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validatePassword(value, cb) {
    if (value.length < 8 || value.length > 16) {
      cb && cb({ valid: false, msg: '密码长度需在8到16个字符之间' });
      return false;
    }
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      cb && cb({ valid: false, msg: '密码必须同时包含字母和数字' });
      return false;
    }
    if (!/^[a-zA-Z0-9.\-_~!@#$%^&*]{8,16}$/.test(value)) {
      cb && cb({ valid: false, msg: '密码不可包含非法字符' });
      return false;
    }
    return true;
  },

  /**
   * @description: 验证空格
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateSpace(value, cb) {
    if (/\s/.test(value)) {
      cb && cb({ valid: false, msg: '文本中不能含有空格' });
      return false;
    }
    return true;
  },

  /**
   * @description: 验证邮箱
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateMail(value, cb) {
    const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (!reg.test(value)) {
      cb && cb({ valid: false, msg: '邮箱格式错误' });
      return false;
    }
    return true;
  },

  /**
   * @description: 验证手机号
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateMobile(value, cb) {
    const reg = /^1[345678][0-9]{9}$/;
    if (!reg.test(value)) {
      cb && cb({ valid: false, msg: '手机号码格式错误' });
      return false;
    }
    return true;
  },

  /**
   * @description: 验证座机号
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateTel(value, cb) {
    const reg = /^0\d{2,3}-?\d{7,8}-?\d{0,4}$/;
    if (!reg.test(value)) {
      cb && cb({ valid: false, msg: '电话号码格式错误' });
      return false;
    }
    return true;
  },

  /**
   * @description: 验证是否包含特殊字符 & # \\ / : * ? \' " < > |'
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateChar(value, cb) {
    const reg = /[&#\\/:*?'"<>|]+/;
    if (!reg.test(value)) {
      cb && cb({ valid: false, msg: '不能含有特殊字符 & # \\ / : * ? \' " < > |' });
      return false;
    }
    return true;
  },

  /**
   * @description: 验证身份证
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateCard(value, cb) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(value)) {
      cb && cb({ valid: false, msg: '身份证格式错误' });
      return false;
    }
    const aCity = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外',
    };
    if (!aCity[parseInt(value.substr(0, 2))]) {
      cb && cb({ valid: false, msg: '身份证地区非法' });
      return false;
    }
    const dateReg = /^(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])$/;
    if (!dateReg.test(value.length == 18 ? value.substr(6, 8) : value.substr(6, 6))) {
      cb && cb({ valid: false, msg: '身份证出生日期非法' });
      return false;
    }
    if (value.length == 18) {
      const birthdate = value.substr(6, 4) + '/' + value.substr(10, 2) + '/' + value.substr(12, 2);
      if (new Date(birthdate) > new Date() || new Date(birthdate).Format('yyyy/MM/dd') != birthdate) {
        cb && cb({ valid: false, msg: '身份证出生日期非法' });
        return false;
      }
      // 校验码判断
      const coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const checkDigitMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; // 除11取余的结果对应的校验位（最后一位）的值
      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += value[i] * coefficient[i];
      }
      const code = checkDigitMap[sum % 11];
      if (code != value[17]) {
        cb && cb({ valid: false, msg: '身份证校验码非法' });
        return false;
      }
    }
    return true;
  },

  /**
   * @description: 验证ip地址
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateIp(value, cb) {
    const reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!reg.test(value)) {
      cb && cb({ valid: false, msg: 'IP地址格式错误' });
      return false;
    }
    return true;
  },

  /**
   * @description: 验证Mac地址
   * @param {string} value
   * @param {function} cb 回调函数，可用于在校验完成后弹出提示等
   * @return {boolean} true or false
   */
  validateMac(value, cb) {
    const reg = /^([a-fA-F0-9]{2}-){5}([a-fA-F0-9]{2})$/;
    if (!reg.test(value)) {
      cb && cb({ valid: false, msg: 'MAC地址格式错误' });
      return false;
    }
    return true;
  },
};

export default validateUtils;
