# py-auto-daily-report
> 用于日报的快速填写与Excel导出。

## 项目详情
 技术栈为 Vue + Element 。采用`localStorage`保存数据，使用`AES`进行数据加密，使用过程中不会发送任何请求。（后续邮件发送，以及数据云同步可能会涉及接口调用）

## 现有功能
1. 日报填写与导出
2. 往期日报查看
3. 待办任务快速填写
4. 日报标题动态生成

## 需要完善的地方
1. 响应式
2. 数据云同步
3. 本地数据长时间未备份提醒
4. 任务细化到小时，生成每日报表，饼图等
5. 后台发送邮件接口，本地保存邮箱配置信息
6. 项目结构重构

## 操作指南
- 日报标题配置
使用`moment.js`格式化，具体语法参考[官网](http://momentjs.cn/)。
![操作步骤](https://py-git.oss-cn-beijing.aliyuncs.com/auto-daily-report/%E6%97%A5%E6%8A%A5%E6%A0%87%E9%A2%98%E8%AE%BE%E7%BD%AE.gif)

- 待办功能
从往期保存的日报内，搜索今天需要做的任务，并可以快速编辑。
![具体操作](https://py-git.oss-cn-beijing.aliyuncs.com/auto-daily-report/%E5%BE%85%E5%8A%9E%E5%8A%9F%E8%83%BD.gif)