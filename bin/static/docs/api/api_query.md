[返回](/mag/doc_detail/api/api_doc)

---


## YiShape远程调用API说明

系统内置全面的基于HTTP的API调用功能，并以JSON格式返回结果。传参方式主要支持Restful GET方式和Form Post方式。



### 1. 大语言模型的调用

#### 1.1 大模型调用（API接口：/llm）

##### 1.1.1 Get方法调用

以HTTP GET方法访问如下地址：http://127.0.0.1:7090/llm/{query}/{model}，
其中的query与model为路径参数。使用时127.0.0.1:7090替换为实际的IP与端口。

**表1-1 Get方法调用参数说明**
| 参数名称	| 参数说明	| 是否必须提供	| 默认值 |
| --- | --- | --- | --- |
| query	| 询问大模型的语句（问题）。如果为中文，请进行网址参数编码	| 是 | 无 |
| model	| 大语言模型的类型。当前支持以下大模型：<br>ChatGLM4：智谱清言4，由YiShape系统直接远程调用；<br>Ollama：本地Ollama，需本地安装Ollama并在YiShape中配置Ollama使用的大模型; <br>YiShape：本软件官方提供的远程默认测试大模型。 | 是 | 无 |


**使用示例**

调用如下系统API：http://127.0.0.1:7090/llm/介绍一下你自己/YiShape

将获得如下系统响应结果：

```json
{
    "query": "介绍一下你自己",
    "words": null,
    "dataBase": null,
    "k": 1,
    "queryType": "LLM",
    "status": "OK",
    "msg": "返回成功",
    "chunks": null,
    "distances": null,
    "knnTypes": null,
    "fileKeys": null,
    "filePaths": null,
    "llmAns": "你好！我是AI小蝠，是由电子科技大学大数据与决策分析研究中心打造的人工智能助手。我擅长处理各种信息查询、知识问答、语言理解等任务，可以为你提供帮助和支持。无论你有什么问题或者需要什么帮助，请随时告诉我。",
    "llmRAG": null,
    "time": "2024-11-04 19:58:07"
}
```

#### 1.1.2 Post方法调用

以HTTP POST方法访问如下地址并封装参数与对应的数据：http://127.0.0.1/llm/

**表1-2 Post方法调用参数说明**
| 参数名称	| 参数说明	| 是否必须提供	| 默认值 |
| --- | --- | --- | --- |
| query	| 询问大模型的语句（问题）。如果为中文，请进行网址参数编码 | 是 | 无 |
| model	| 大语言模型的类型。当前支持以下大模型：<br>ChatGLM4：智谱清言4，由YiShape系统直接远程调用；<br>Ollama：本地Ollama，需本地安装Ollama并在YiShape中配置Ollama使用的大模型;<br>YiShape：本软件官方提供的远程默认测试大模型。	否	YiShape
| db | YiShape中数据库的名称，访问前必须在系统中先建好对应的数据库。相较于直接访问大模型，该方法能够使用在YiShape数据库中定义系统提示词。 | 否 | 无 |
| history | 历史交互信息，格式为：[{'sessionId': this.sessionId, 'role': role, 'content': cnt, 'genTime': new Date() }]，其中role的值可以为：System, User, Assistant，分别代表系统、用户、大模型，用户与大模型的交互一般使用User和Assistant。| 否 | 无 |



### 2. 文本向量库的调用

已具备此功能，API文档正在整理中。








