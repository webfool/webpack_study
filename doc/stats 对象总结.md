stats 中有3个主要属性，分别是 modules、chunks、assets。
它们3者的关系是：modules -> chunks -> assets

#### module
包括：模块的基本信息、所属的 chunks 和 assets、加入到依赖图的原因
```json
{
  // module 基本信息
  "type": "module",
  "moduleType": "javascript/esm",
  "id": 914,
  "identifier": "/Users/haowenliu/Desktop/project/personStudy/webpack_study/node_modules/cache-loader/dist/cjs.js!/Users/haowenliu/Desktop/project/personStudy/webpack_study/node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0].use[1]!/Users/haowenliu/Desktop/project/personStudy/webpack_study/src/index.js|0d57a3a6f33155e0ce27b0b932bbd72e",
  "name": "./src/index.js + 1 modules",
  "size": 352,
  "chunks": [688],  // 所属的 chunks
  "assets": [],     // 所属的 assets
  "reasons": [      // 加入到依赖图的原因
    {
      "moduleIdentifier": null,
      "module": null,
      "moduleName": null,
      "resolvedModuleIdentifier": null,
      "resolvedModule": null,
      "type": "entry",
      "active": true,
      "explanation": "",
      "userRequest": "./src/index.js",
      "loc": "entry1",
      "moduleId": null,
      "resolvedModuleId": null
    }
  ]
}
```

#### asset

包含：输出文件自身的信息、相关的 chunk、相关的其它资源
```json
{
  "type": "asset",                  // 类型
  "name": "entry1.js",              // 输出的文件名称
  "size": 133,                      // 文件大小
  "info": {                         // 文件的其它信息
    "javascriptModule": false,
    "minimized": true,
    "related": {
      "sourceMap": "entry1.js.map",
      "gzipped": "entry1.js.gz"
    },
    "size": 133
  },
  "chunks": [688],                  // 文件对应的 chunk id
  "chunkNames": ["entry1"],         // 文件对应的 chunk name
  "related": [],                    // 相关资源的信息，比如 sourcemap 文件
}
```

#### chunk
包括：chunk 的基本信息、对应的 modules 和 file、加入依赖图的原因
```json
{
  "id": 688,
  "names": ["entry1"],
  "size": 352,
  "files": ["entry1.js"], // 对应的文件信息
  "modules": [],          // 包含的 modules
  "origins": [            // 加入依赖图的原因
    {
      "module": "",
      "moduleIdentifier": "",
      "moduleName": "",
      "loc": "entry1",
      "request": "./src/index.js"
    }
  ]
}
```