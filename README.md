#安装node:
版本：node-v6.12.3-x64.msi
#安装babel：
npm install --save-dev babel-preset-es2015
npm install --global babel-cli

#创建.babelrc文件，内容为：
{
    "presets": [
        "es2015",
    ],
    "plugins": ["transform-remove-strict-mode"]
}

#最后执行：
babel js --out-dir js