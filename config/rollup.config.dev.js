import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

function createInputOptions(){
    return {
        input: 'src/index.js',
        plugins:[ 
            json(), 
            resolve({
                // 将自定义选项传递给解析插件
                customResolveOptions: {
                    moduleDirectory: 'node_modules'
                }
            }),
            commonjs(),
            babel({
                exclude: 'node_modules/**', // 只编译我们的源代码
                runtimeHelpers: true
            })
        ],
        // 指出应将哪些模块视为外部模块
        external: ['lodash']
    }
}

function createOutOoptions(){
    return [{
        file: 'dist/melody.js',
        format: 'cjs'
    },{
        file: 'demo/dist/melody.js',
        format: 'iife'
    }];
}


const devConfig = (function (inputOptions, outOptions){
    return {
        ...inputOptions,
        output: outOptions
    };
})(createInputOptions(), createOutOoptions())

export default devConfig;