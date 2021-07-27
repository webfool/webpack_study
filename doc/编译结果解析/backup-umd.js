// 配置了 output.libraryTarget: 'umd'
// 将主入口生成的 export 对象根据当前环境进行挂载
// 比如 node 环境挂载在当前文件的 module.exports 下
(function webpackUniversalModuleDefinition(root, factory) {
  // node 环境下
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
  
  // amd 环境下
	else if(typeof define === 'function' && define.amd)
		define([], factory);

  // 
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, function() {
  return (() => {
    var __webpack_modules__ = {
      "./src/index.ts": (exports) => {
        Object.defineProperty(exports, "__esModule", ({ value: true }));
        exports.getVersion = void 0;

        console.log('init');
        function getVersion(version) {
              if (version === void 0) { version = '1.0.0'; }
            return version;
        }
        exports.getVersion = getVersion;

        getVersion('1.0.1')
      }
    };

    var __webpack_exports__ = {};

    __webpack_modules__["./src/index.ts"](__webpack_exports__);
    
    return __webpack_exports__;
  })();
});