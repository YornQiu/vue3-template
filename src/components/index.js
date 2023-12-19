/*
 * @Author: Yorn Qiu
 * @Date: 2021-05-14 17:01:47
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-12-19 13:36:02
 * @FilePath: /vue3-template/src/components/index.js
 * @Description: global components
 */

const components = {
  //import, then add global component here
};

/**
 * Usage: Vue.use(components)
 */
export default {
  install(app) {
    Object.keys(components).forEach((key) => {
      app.component(key, components[key]);
    });
  },
};
