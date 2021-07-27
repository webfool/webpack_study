// webpack 默认直接打包的文件，将会自执行

(() => {
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
})();