


[返回](/mag/doc_detail/main)

---

## 使用‘文本块迭代任务’实现英文资料批量翻译

本文介绍如何使用“易形空间向量数据库”中内置的“文本块迭代任务”进行大规模、批量的英文文件翻译。

### 1. 建立指向翻译文件所在文件夹的文本库

将需要翻译的英文文件全部放入一个文件夹，并建立一个文本库，设定好数据库名称，并将数据源路径指向英文文件所在的文件夹。如下图所示：

<div class="mdImgDiv">
<img src="/docs/cases/images/batch_tans_with_chunk_agent/image-8.png" width="550"/>
</div>

设置好后等待该文本库构建完成，如下图所示：

<div class="mdImgDiv">
<img src="/docs/cases/images/batch_tans_with_chunk_agent/image-10.png" width="550"/>
</div>

### 2. 建立一个“文本块迭代任务”

在“Agent任务”菜单中点击“文本块迭代任务”，并点击界面上的“添加新任务”，如下图所示：

<div class="mdImgDiv">
<img src="/docs/cases/images/batch_tans_with_chunk_agent/image.png" width="550"/>
</div>

在如下图所示的设置界面，选择目标数据库为第一步设置的“翻译”库，大模型挂载选择本任务中可用的大模型，演示中选择的为Ollama（需要在本地安装好）；另外，为方便用户设置提示词，本系统已内置了常用的提示词模板，在提示词样例中选择“批量英文->中文翻译”后，下方的提示词设置框中将自动出现提示词， 一般不需要再次修改，直接提交任务即可。

<div class="mdImgDiv">
<img src="/docs/cases/images/batch_tans_with_chunk_agent/image-1.png" width="550"/>
</div>

### 3. 下载结果文件

等待任务完成后，可以直接在任务界面上下载结果文件查看，如下图所示。

<div class="mdImgDiv">
<img src="/docs/cases/images/batch_tans_with_chunk_agent/image-3.png" width="550"/>
</div>

默认的输出结果为JSON文件，可以再次被其它程序加工处理，但是人类的可读性较差，如下图所示：

<div class="mdImgDiv">
<img src="/docs/cases/images/batch_tans_with_chunk_agent/image-5.png" width="550"/>
</div>

为增加人类阅读友好性，系统内置了JSON结果处理功能，点击界面上的“生成可读文件”后，系统将在右侧生成一个Markdown文件的链接，点击后即可下载该文件。如下图所示：

<div class="mdImgDiv">
<img src="/docs/cases/images/batch_tans_with_chunk_agent/image-6.png" width="550"/>
</div>

下载完成后，用Typora等Markdown编辑器打开.md文件后，可以看到内容为中英文对照结果，如下图所示，可读性较好。

<div class="mdImgDiv">
<img src="/docs/cases/images/batch_tans_with_chunk_agent/image-7.png" width="550"/>
</div>
