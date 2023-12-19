/*
 * @Author: Yorn Qiu
 * @Date: 2021-09-14 11:17:45
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-12-19 14:01:39
 * @FilePath: /vue3-template/src/utils/validate-utils.js
 * @Description: input value validate utils
 */

const validateUtils = {
  /**
   * @description: 验证输入值是否合法
   * @param {string} value 输入的值
   * @param {object} option 参数 type, required, length
   * @return {boolean} 为true时校验通过
   */
  validate(value, option) {
    const { required = true, type, length } = option;
    if (required && !this.isRequired(value)) {
      return false;
    }
    if (length && !this.checkLength(value, length)) {
      return false;
    }

    switch (type) {
      case 'space':
        return this.hasSpace(value);
      case 'char':
        return this.hasChar(value);
      case 'number':
        return this.isNumber(value);
      case 'int':
        return this.isInt(value);
      case 'username':
        return this.isUsername(value);
      case 'password':
        return this.isPassword(value);
      case 'mail':
        return this.isEmail(value);
      case 'mobile':
        return this.isMobilephoneNumber(value);
      case 'tel':
        return this.isTelephoneNumber(value);
      case 'card':
        return this.isIDNumber(value);
      case 'ip':
        return this.isIp(value);
      case 'mac':
        return this.isMac(value);
      default:
        break;
    }
    return true;
  },

  /**
   * @description: 验证输入值是否为空(undefined, null, '')
   * @param {string|undefined|null} value
   * @return {boolean} true or false
   */
  isRequired(value) {
    return value !== undefined && value !== null && value !== '';
  },

  /**
   * @description: 验证输入值长度是否符合要求
   * @param {string} value
   * @param {number|array} range 最大长度或者是一个表示范围的数组(包含)
   * @return {boolean} true or false
   */
  checkLength(value, range) {
    const length = value.length;

    if (typeof range === 'number' && range > 0) {
      return range >= length;
    } else if (Array.isArray(range) && !isNaN(range[0]) && !isNaN(range[1])) {
      return range[0] <= length && range[1] >= length;
    } else {
      throw new Error('长度验证格式错误');
    }
  },

  /**
   * @description: 验证是否包含空格
   * @param {string} value
   * @return {boolean} true or false
   */
  hasSpace(value) {
    return /\s/.test(value);
  },

  /**
   * @description: 验证是否包含特殊字符 & # \\ / : * ? \' " < > |'
   * @param {string} value
   * @param {RegExp} regexp 用于校验的字符列表
   * @return {boolean} true or false
   */
  hasChar(value, regexp = /[&#\\/:*?'"<>|]+/) {
    return regexp.test(value);
  },

  /**
   * @description: 验证输入值是否为数字
   * @param {string} value
   * @return {boolean} true or false
   */
  isNumber(value) {
    return /^[+-]?[0-9]+.?[0-9]*$/.test(value);
  },

  /**
   * @description: 验证输入值是否为整数
   * @param {string} value
   * @return {boolean} 为整数时返回false，不为整数时返回错误信息
   */
  isInt(value) {
    return /^-?[1-9][0-9]*$/.test(value);
  },

  /**
   * @description: 验证用户名，必须以字母开头且长度不小于8，只能包含字母或数字
   * @param {string} value
   * @return {boolean} true or false
   */
  isUsername(value) {
    return /^[a-zA-Z]{1}([a-zA-Z0-9]){7,}$/.test(value);
  },

  /**
   * @description: 密码验证，必须包含字母和数字，且长度为8到16个字符
   * @param {string} value
   * @return {boolean} true or false
   */
  isPassword(value) {
    if (value.length < 8 || value.length > 16) {
      return false;
    }
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      return false;
    }
    if (!/^[a-zA-Z0-9.\-_~!@#$%^&*]{8,16}$/.test(value)) {
      return false;
    }
    return true;
  },

  /**
   * @description: 验证邮箱
   * @param {string} value
   * @return {boolean} true or false
   */
  isEmail(value) {
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value);
  },

  /**
   * @description: 验证手机号
   * @param {string} value
   * @return {boolean} true or false
   */
  isMobilephoneNumber(value) {
    return /^1[345678][0-9]{9}$/.test(value);
  },

  /**
   * @description: 验证座机号
   * @param {string} value
   * @return {boolean} true or false
   */
  isTelephoneNumber(value) {
    return /^0\d{2,3}-?\d{7,8}-?\d{0,4}$/.test(value);
  },

  /**
   * @description: 验证身份证
   * @param {string} value
   * @return {boolean} true or false
   */
  isIDNumber(value) {
    if (value.length == 18 || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
      return false;
    }
    const cityCodes = {
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
    if (!cityCodes[parseInt(value.substring(0, 2))]) {
      return false;
    }
    if (!/^(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])$/.test(value.substring(6, 14))) {
      return false;
    }
    const birthDate = value.substring(6, 10) + '/' + value.substring(10, 12) + '/' + value.substring(12, 14);
    if (new Date(birthDate) > new Date()) {
      return false;
    }
    // 校验码判断
    const coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkDigitMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; // 除11取余的结果对应的校验位（最后一位）的值
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(value[i]) * coefficient[i];
    }
    const code = checkDigitMap[sum % 11];
    if (code != value[17]) {
      return false;
    }
    return true;
  },

  /**
   * @description: 验证ip地址
   * @param {string} value
   * @return {boolean} true or false
   */
  isIp(value) {
    return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value);
  },

  /**
   * @description: 验证Mac地址
   * @param {string} value
   * @return {boolean} true or false
   */
  isMac(value) {
    return /^([a-fA-F0-9]{2}-){5}([a-fA-F0-9]{2})$/.test(value);
  },
};

export default Object.freeze(validateUtils);
