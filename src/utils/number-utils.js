/*
 * @Author: Yorn Qiu
 * @Date: 2020-12-03 16:44:42
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-12-19 14:00:19
 * @FilePath: /vue3-template/src/utils/number-utils.js
 * @Description: number format utils
 */

const formatUnit = {
  1: '',
  10000: '万',
  100000000: '亿',
  1000000000000: '万亿',
  1000: 'k',
  1000000: 'M',
  1000000000: 'G',
};

const numberUtils = {
  // 数值格式化的单位映射
  formatUnit,

  /**
   * @description 增加千位分隔符
   * @param {number|string} value 数值
   * @return {string}
   */
  addComma(value) {
    let numStr = `${value}`;
    if (numStr.includes('e')) numStr = this.unScientificNotation(numStr);

    const matched = numStr.match(/^([-+])?([0-9]+)(\.[0-9]+)?$/);
    if (matched) {
      const symbol = matched[1] || ''; // 符号
      let integer = matched[2]; // 整数部分
      const decimal = matched[3] || ''; // 小数部分

      // 添加逗号
      const re = /(\d+)(\d{3})/;
      while (re.test(integer)) {
        integer = integer.replace(re, '$1,$2');
      }

      return symbol + integer + decimal;
    }

    return `${value}`;
  },
  /**
   * @description 数值格式化
   * @param {number} value 数值
   * @param {object} option 格式化参数集合，默认增加千位分隔符，保留2位小数
   * @param {string} option.type 格式化类型 num 数值, percent 百分比, flowNum 容量
   * @param {number} option.deg 保留几位小数
   * @param {boolean} option.comma 是否增加千位分隔符
   * @param {boolean} option.autoUnit 是否自动进行数值单位换算
   * @param {number} option.unit 指定单位换算值
   * @return {string}
   */
  format(value, option) {
    if (Number.isNaN(value) || value === Infinity || value === -Infinity || value === undefined || value === null) {
      return '-';
    }
    if (!Number.isNaN(value)) {
      option = option || { type: 'num', deg: 2, comma: true };

      value = Number(value);
      const deg = option.deg || 0;

      if (option.type === 'num') {
        if (option.autoUnit) {
          const datum = 1;
          if (Math.abs(value / 10 ** 12) >= datum) {
            return `${this.toFixed(value / 10 ** 12, deg)}万亿`;
          }
          if (Math.abs(value / 10 ** 8) >= datum) {
            return `${this.toFixed(value / 10 ** 8, deg)}亿`;
          }
          if (Math.abs(value / 10 ** 4) >= datum) {
            return `${this.toFixed(value / 10 ** 4, deg)}万`;
          }
          return `${value}`;
        }

        let formatedValue = value;
        // 单位换算
        if (option.unit) formatedValue /= option.unit;
        // 固定小数位数
        formatedValue = this.toFixed(formatedValue, deg);
        // 千位分隔符
        if (option.comma) formatedValue = this.addComma(formatedValue);
        // 加上单位
        if (option.unit) formatedValue += this.formatUnit[option.unit];

        return formatedValue;
      }

      if (option.type === 'percent') {
        return `${this.toFixed(value * 100, deg)}%`;
      }

      if (option.type === 'flowNum') {
        const datum = 1;
        if (Math.abs(value / 1024 ** 4) >= datum) {
          return `${this.toFixed(value / 1024 ** 4, deg)}TB`;
        }
        if (Math.abs(value / 1024 ** 3) >= datum) {
          return `${this.toFixed(value / 1024 ** 3, deg)}GB`;
        }
        if (Math.abs(value / 1024 ** 2) >= datum) {
          return `${this.toFixed(value / 1024 ** 2, deg)}MB`;
        }
        if (Math.abs(value / 1024 ** 1) >= datum) {
          return `${this.toFixed(value / 1024 ** 1, deg)}KB`;
        }
        return `${value.toFixed(deg)}B`;
      }
    }
    return `${value}`;
  },

  /**
   * @description: 保留小数位，使用toFixed方法固定小数位数
   * @param {number} value 数值
   * @param {number} deg 小数位数，小于0时保持原有的小数位数
   * @return {string}
   */
  toFixed(value, deg) {
    let numStr = `${value}`;
    if (numStr.includes('e')) numStr = this.unScientificNotation(numStr);
    if (deg < 0) return numStr;

    const match = numStr.match(/\.(\d+)/);
    if (match && match[1].length < deg) {
      for (let i = 0; i < deg - match[1].length; i += 1) {
        numStr += '0';
      }
      return numStr;
    }
    return value.toFixed(deg);
  },

  /**
   * 将科学计数法形式转化为一般形式的数字字符串
   * @param {string|number} value
   * @return {string}
   */
  unScientificNotation(value) {
    const number = typeof value === 'number' ? value : parseFloat(value);
    const exponential = number.toExponential(); // 转换为标准的科学计数法形式
    const matched = exponential.match(/\d(?:\.(\d*))?e([+-]\d+)/); // 分离出小数值和指数值
    const fixed = (matched[1] || '').length - parseInt(matched[2]); // 得到小数位数
    return number.toFixed(Math.max(0, fixed));
  },

  /**
   * @description: 金额类格式化，增加千位分隔符并保留两位小数
   * @param {number} value 数值
   * @param {boolean|FormatOption} option 是否为百分数，或者格式化参数
   * @return {string} 格式化后的数值为String
   */
  financeFormat(value, option) {
    if (typeof option === 'boolean') {
      return this.format(value, { type: 'percent', comma: true, deg: 2 });
    }
    return this.format(value, {
      type: 'num',
      comma: true,
      deg: 2,
      ...option,
    });
  },
};

export default Object.freeze(numberUtils);
