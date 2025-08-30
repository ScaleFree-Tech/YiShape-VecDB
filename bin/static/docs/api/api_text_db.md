[返回](/mag/doc_detail/api/api_doc)

---


## YiShapeServer 文本数据库管理相关接口文档

文本数据库的管理接口通过HTTP GET或者POST方式实现。鉴权验证使用OPEN AI标准，即通过HTTP访问接口时在HEADER中添加Authorization属性及对应的API KEY信息：

Authorization: Bearer API_KEY

---

### 1. 获取所有文本数据库列表

- **接口**：`GET /api/list_text_db`
- **描述**：获取所有文本数据库的列表，区分正常和损坏数据库。
- **请求参数**：无
- **响应示例**（JSON）：
  ```json
  {
    "goodDbs": [ { ...RereTextDatabase... }, ... ],
    "brokenDbs": [ { ...RereTextDatabase... }, ... ]
  }
  ```
- **说明**：每个数据库对象结构见 `RereTextDatabase`，包含数据库元信息。

---

### 2. 获取数据库详细信息

- **接口**：`GET /api/text_db_detail/{db}`
- **描述**：获取指定数据库的详细信息。
- **路径参数**：
  - `db`：数据库名称（字符串）
- **响应示例**（JSON）：
  ```json
  {
    "name": "example_db",
    "nickName": "示例库",
    "status": "GOOD",
    "type": "TEXT",
    "searchMethod": "BM25",
    "tempDataSourcePath": "...",
    "pathType": "RELATIVE",
    "desc": "...",
    "modelExpr": "...",
    "userPrompt": "...",
    "sysPrompt": "...",
    "minChunkSize": 100,
    "maxChunkSize": 500,
    "defaultK": 3,
    "ord": 1,
    "ifAllowDownload": true,
    "chunkReturnType": "withContext",
    "questionType": "ORIGIN",
    "ifUseThinkChain": false,
    "generateType": "Chat",
    "vectorIndexType": "Flat",
    "ifUseStreaming": false,
    "ifReRank": false,
    "embeddingMethod": "DistillBert",
    "wordDocTransMethod": "AVERAGE",
    "disType": "EUCLIDEAN"
  }
  ```
- **说明**：字段含义见下方参数说明。

---

### 3. 新增或修改数据库

- **接口**：`POST /api/alter_text_db`
- **描述**：新增或修改一个文本数据库。
- **请求类型**：`application/x-www-form-urlencoded`
- **请求参数**（全部为字符串，部分为枚举，必填项见代码）：

  | 参数名                | 类型    | 说明/可选值（枚举）                |
  |----------------------|---------|------------------------------------|
  | name                 | string  | 数据库名称（唯一标识）             |
  | nickName             | string  | 数据库别名                         |
  | status               | string  | 数据库状态（如 GOOD, BROKEN）      |
  | type                 | enum    | 数据库类型：TEXT, IMAGE, AUDIO     |
  | searchMethod         | enum    | 检索方法：BM25, HYBRID, VECTOR     |
  | tempDataSourcePath   | string  | 数据源路径                         |
  | pathType             | enum    | 路径类型：RELATIVE, ABSOLUTE       |
  | desc                 | string  | 描述                               |
  | modelExpr            | string  | LLM模型表达式                      |
  | userPrompt           | string  | 用户提示词                         |
  | sysPrompt            | string  | 系统提示词                         |
  | minChunkSize         | int     | 最小分块大小                       |
  | maxChunkSize         | int     | 最大分块大小                       |
  | defaultK             | int     | 默认召回数量                       |
  | ord                  | int     | 排序序号                           |
  | ifAllowDownload      | bool    | 是否允许下载（true/false）         |
  | chunkReturnType      | enum    | 返回类型：withContext, original    |
  | questionType         | enum    | 问题类型：ORIGIN, LLM_PARSED       |
  | ifUseThinkChain      | bool    | 是否使用思维链（true/false）       |
  | generateType         | enum    | 生成类型：Chat, Generate           |
  | vectorIndexType      | enum    | 向量索引类型：Flat, HNSW, E2LSH    |
  | ifUseStreaming       | bool    | 是否流式输出（true/false）         |
  | ifReRank             | bool    | 是否重排序（true/false）           |
  | embeddingMethod      | enum    | 嵌入方法：DistillBert, Glove       |
  | wordDocTransMethod   | enum    | 文档向量化方法：AVERAGE, TF_IDF    |
  | disType              | enum    | 距离类型：EUCLIDEAN, COS           |

- **响应**：`ok`（字符串）

#### 参数枚举说明

- `searchMethod`：`BM25`、`HYBRID`、`VECTOR`
- `pathType`：`RELATIVE`、`ABSOLUTE`
- `chunkReturnType`：`withContext`、`original`
- `questionType`：`ORIGIN`、`LLM_PARSED`
- `generateType`：`Chat`、`Generate`
- `vectorIndexType`：`Flat`、`HNSW`、`E2LSH`
- `embeddingMethod`：`DistillBert`、`Glove`
- `wordDocTransMethod`：`AVERAGE`、`TF_IDF`
- `disType`：`EUCLIDEAN`、`COS`

---

### 4. 删除数据库

- **接口**：`POST /api/delete_text_db`
- **描述**：删除指定数据库。
- **请求类型**：`application/x-www-form-urlencoded`
- **请求参数**：

  | 参数名 | 类型   | 说明         |
  |--------|--------|--------------|
  | db     | string | 数据库名称   |

- **响应**：`true` 或 `false`（字符串，表示是否删除成功）



---

### 5. 更新数据库文件

- **接口**：`POST /api/update_text_db_files`
- **描述**：向指定文本数据库上传文件，用于更新数据库内容。
- **请求类型**：`multipart/form-data`
- **请求参数**：

  | 参数名       | 类型   | 说明         |
  |--------------|--------|--------------|
  | db           | string | 数据库名称   |
  | upload_files | file   | 上传的文件（可多选） |

- **响应**：
  - 成功：`success`（字符串）
  - 失败：`error`（字符串）

- **说明**：
  - 支持多文件上传
  - 文件会被复制到数据库的存储路径下
  - 文件名保持原样
  - 如果上传失败会返回"error"

---

### 6. 删除数据库文件

- **接口**：`POST /api/delete_text_db_files`
- **描述**：删除指定文本数据库中的文件。
- **请求类型**：`application/x-www-form-urlencoded`
- **请求参数**：

  | 参数名      | 类型   | 说明         |
  |-------------|--------|--------------|
  | db          | string | 数据库名称   |
  | file_names  | string | 要删除的文件名列表，用英文逗号分隔 |

- **响应**：
  - 成功：`success`（字符串）
  - 失败：`error`（字符串）

- **说明**：
  - 支持批量删除多个文件
  - 文件名用英文逗号分隔，如："file1.txt,file2.pdf,file3.docx"
  - 文件会被从数据库存储路径中永久删除
  - 如果删除失败会返回"error"

---


