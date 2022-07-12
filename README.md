

## 功能愿景
  1. 实现 类似VueCLi
  2. 支持 vue create <project name>, vue ui 命令
  3. 区分命令行创建， UI界面创建的不同
  4. 选择功能
     1. 创建 对用的 Router 功能
     2. 实现 lowcode 将对应组件 注入到业务当中
     3. 选择配置 简易微前端
     4. 选择 项目配置的组件，动态注入
        1. 如果用户在 2中的组件涵盖 直接默认选择
     5. 生成项目
   
   ### 第一版 
    1. 通过命令行 👷‍♀️
       1. 拉取对应的 template 项目，选择components
       2. 将 components 注入到 template 对应的位置
       3. 根据 components 需要的依赖进行 初始化下载
       4. ...


