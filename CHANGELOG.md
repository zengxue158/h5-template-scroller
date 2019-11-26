# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2019-07-24
### Added
- 基础版本

## [1.0.1] - 2019-10-09
### Added
- tinify-loader 增加图片压缩处理

### Changed
- 修改了devServer的热更新模式

## [1.0.2] - 2019-10-18
### Fixed
- 升级eslint，修复`eslint-utils@1.4.0`的安全漏洞

### Changed
- 还原了devServer的热更新模式。

## 2019-11-20
### Changed
- 将`manifest.js`改为inline调用
- 将`main.js`改为async调用
- 增加了章鱼以及回流统计。章鱼统计发布到章鱼系统`mapp`站点；回流统计发布到章鱼系统的`sps`站点，modelid为{频道名} + {项目名}。

