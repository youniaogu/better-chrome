### Better Chrome

#### 1. 替换知乎 a 标签 href 属性

- 替换前：<a href="https://link.zhihu.com/?target=https%3A//juejin.im/" target="_blank">`<a href="https://link.zhihu.com/?target=https%3A//juejin.im/" target="_blank">juejin</a>`</a>

- 替换后：<a href="https://juejin.im/" target="_blank">`<a href="https://juejin.im/" target="_blank" >juejin</a>`</a>

#### 2. 替换 steam a 标签 href 属性

与第一点类似，去掉二次弹窗

#### 3. 去掉知乎(包括知乎专栏)未登录弹窗

<img width="480" src="./remove_zhihu_login_modal.png" />

##### 开关控制

<img width="240" src="./function_switch.png" />

##### 安装

- 打开 chrome 扩展程序的开发者模式
- 在项目根目录，加载已解压的扩展程序
