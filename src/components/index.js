/*
 * @Author: YornQiu
 * @Date: 2021-05-14 17:01:47
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-02-17 16:00:31
 * @Description: global components
 * @FilePath: /vue3-template/src/components/index.js
 * dex.ts
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
