


[返回](/mag/doc_detail/main)

---

## 快速建立一个包含海量文件的文本库

文本型向量库是本系统的最核心功能，内置了丰富的定制化配置项，可以快速构建出适应不同AI应用场景的文本向量库。另外，系统还内置了并行化处理、缓存、SIMD数值计算、GPU加速等高性能组件，是当前世面上性能最强的向量数据库产品之一。下面以构建一个包含约1500个ESG报告文本文件的向量库为例，介绍如何在本系统中快速构建文本型向量数据库。

在系统菜单的“文本型向量库”类目中，点击“文本库列表”，将出现如下界面。

<div class="mdImgDiv">
<img src="/docs/cases/images/quick_start/image.png" width="550" />
</div>

点击“添加新库”，在出现的数据库设置界面中，请填写以下字段：

- **文本库显示名称**。必填项，文本库在整个系统中的显示名称，主要面向人类阅读。
- **唯一英文标识**。必填项，文本库在系统内部的标识名，并且不能和其它数据库的英文标识冲突，否则通不过系统的名称验证。
- **数据库介绍**。非必填项，但是强烈建议填写，该介绍主要用于向大模型介绍本数据库所包含的资料，在检索增强生成和Agent应用中至关重要。
- **服务器数据源路径**。必填项，

设置效果如下两幅图所示：

<div class="mdImgDiv">
<img src="/docs/cases/images/quick_start/image-1.png" width="550" style="filter: invert(var(--dark-mode, 0));"/>
<img src="/docs/cases/images/quick_start/image-2.png" width="550" style="filter: invert(var(--dark-mode, 0));"/>
</div>

设置完成以上四个字段后，其它字段使用默认值即可满足绝大多数场景需求（特殊需求可参考 [文本库及关键配置说明](/mag/doc_detail/text_db) 设置），然后点击“提交”进入列表页，如下图所示。

<div class="mdImgDiv">
<img src="/docs/cases/images/quick_start/image-4.png" width="550"/>
</div>

至此，等待数据库构建完成即可。如果想关注数据库的构建进度，在列表页的数据库面板上，点击上图中数据名上的链接，可进入数据库详情页，如下图所示。可在此页面观察数据当前的构建进度（最新进度需要刷新页面）。

<div class="mdImgDiv">
<img src="/docs/cases/images/quick_start/image-3.png" width="550"/>
</div>

在软件管理系统的日志监控界面，可以观察到数据库的构建日志，如下图所示：

<div class="mdImgDiv">
<img src="/docs/cases/images/quick_start/image-6.png" width="550"/>
</div>

日志显示，构建此包含约1500个ESG报告的文本型向量库共消耗10分钟，其中文件读取和文本块构建消耗3分钟，文本块向量化消耗7分钟。

构建完成后，在数据库列表页，点击数据库面板上的“检索”按钮，如下图所示。

<div class="mdImgDiv">
<img src="/docs/cases/images/quick_start/image-7.png" width="550"/>
</div>

系统将导航到文本型向量库的检索页面，在该页面可以对数据中的内容直接进行检索、或者让大模型回答、或者检索增强生成（即系统首先根据用户问题进行本地检索，再将检索结果输入大模型，大模型将针对检索结果重新提炼、编排和补全后回答），可以在该界面对比本地检索、大模型回答和检索增强生成结果的区别，如下图所示：

<div class="mdImgDiv">
<img src="/docs/cases/images/quick_start/image-8.png" width="550"/>
</div>

另外，如果要和大模型进行连续会话和检索，可点击上图中的“打开会话窗口”，将出现如下界面：

<div class="mdImgDiv">
<img src="/docs/cases/images/quick_start/image-9.png" width="550"/>
</div>

在以上界面中系统能够自动将数据库介绍、会话历史记录、用户问题综合输入大模型，大模型根据需要自动生成检索语句，系统检索本地数据库，然后大模型再综合检索结果进行回答。以上功能已实现高度智能化的“检索增强生成”，为本系统的文本型向量数据库重要的内置扩展功能之一。

**快捷链接**

- [文本向量库列表](/mag/list_db)
- [新建文本向量库](/mag/alter_db)
