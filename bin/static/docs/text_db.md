

[返回](/mag/doc_detail/main)

---

# 📚 文本向量库及关键配置说明

> **文本向量库** 是一种智能化的文本处理系统，能够自动扫描指定目录中的文本文件、对文本进行智能分块，并将"文本块"转换为固定长度的数值向量。系统采用多种先进方法对"文本块"进行检索召回，并使用高精度的深度学习模型对召回结果进行精排序。主要应用场景包括海量文本文件的内容模糊检索、面向大语言模型的检索增强生成（RAG）等。

---

## 📁 支持的文件类型

系统当前支持市面上绝大多数常见的文本文件类型，包括 PDF、Word、Excel、PPT、TXT、Markdown 等。针对不同文件特点，系统会进行针对性的特殊处理：

| 文件类型 | 扩展名 | 处理方法说明 |
|:---------:|:-------:|:-------------|
| **TXT** | `.txt` | 如果段落间有一个空行（即两个`\n\n`），系统将默认该格式为用户指定的文本块切割方法，并尽量避免对大段落进行切割，小段落向后合并。 |
| **PDF** | `.pdf` | 系统会尝试对PDF中读出的未正确分段的文本进行段落修复。如果文档中存在表格，只有具有完整边框的表格能被识别，整个表格将被转换为Markdown格式并视为一个完整的文本块，不进行切割。 |
| **MS Word** | `.doc/.docx` | 文本块切割方法同TXT。如果文档中存在表格，整个表格将被转换为Markdown格式并视为一个完整的文本块，不进行切割。 |
| **MS Excel** | `.xls/.xlsx` | 整个标签页中的表格将被转换为Markdown格式并视为一个完整的文本块，不进行切割。如果表格很大，建议先转为CSV格式，系统将进行特殊处理。 |
| **CSV** | `.csv` | 默认必须有表头存在，数据的每一行都将被处理为多个键值对应的JSON数据，其中表头中的字段名为键、行中的数据单元为值，每行为一个文本块，不进行切割。 |
| **Markdown** | `.md` | 大模型首选格式。针对标题及引领的段落做了特别处理，标题+段落形成的文本块不做进一步切割与合并。针对表格、引用、列表、代码块等内容做了特别标注。 |
| **HTML** | `.html/.htm` | 将HTML转换为Markdown格式，然后进行处理，处理方式同Markdown。 |
| **MS PPT** | `.ppt/.pptx` | 文本块切割方法同TXT。如果PPT中存在表格，整个表格将被转换为Markdown格式并视为一个完整的文本块，不进行切割。 |

---

## 🔪 文本块处理机制

文本库会将较长的文本内容智能切割为多个小段文本，这在当前技术条件下是必要的：

### 为什么需要文本分块？

- **🔍 语义信息保持**：将文本向量化时，过长的文本容易模糊语义信息。在使用用户输入的问题搜索文本块时，基于向量相似性比对的长文本与用户问题相关性计算效果将大打折扣。

- **📏 模型输入限制**：文本向量化模型通常有输入长度限制。如BERT、BGE等模型的输入Token数通常限制为512，过长的文本往往会被直接截断丢弃。

- **🤖 大模型兼容性**：大语言模型通常有输入长度限制。在检索增强生成等应用中，如果检索出的文本长度超出大模型的输入长度限制，将被直接截断丢弃。

### 文本块长度配置建议

鉴于大多数文本向量化模型的输入长度限制为512 Token，在文本库设置时文本块的最大长度限制应考虑该因素：

| 语言 | 最大文本块长度设置 | 说明 |
|:-----:|:-----------------:|:-----|
| **中文** | 512 Token 对应 512 个中文词组 | 保险起见字符长度设置不超过 **1000**，默认值为 **800** |
| **英文** | 512 Token 对应 512 个单词 | 保险起见字符长度设置不超过 **2000**，默认值为 **800** |

至于**最小文本块长度**限制，可根据具体场景设置，默认值 **500**。当系统识别出的段落小于最小文本块长度时，默认会向后合并段落，直至长度符合最小长度要求。

---

## 🧠 文本向量化方法

本系统支持多种先进的文本向量化技术：

### **GloVe** - 浅层语义向量化
- **特点**：GloVe神经网络模型通常较小，输入的词序列间的关联窗口长度通常为5
- **优势**：训练速度快，资源占用少
- **局限**：难以捕捉文本词汇间长距离的关联关系，语义相关性为"浅层语义"
- **应用**：系统内置了在"人民日报"等大型文本材料上预训练的GloVe模型
- **扩展**：提供GloVe模型的自训练功能，可在进行"领域词汇识别"后，训练能高度体现用户领域数据特点的自定义模型

### **DistillBERT** - 深层语义向量化
- **特点**：BERT模型的蒸馏预训练版本，用于文本数据向量化
- **优势**：注意力机制善于捕捉词汇间的长距离依赖关系，语义相关性为"深层语义"
- **技术**：本身为序列化模型，词序列可以直接生成句向量，不涉及类似GloVe的词向量-句向量的加权平均转换
- **效率**：与BERT性能无异，但体量小70%（250M），适合服务端部署

### 性能排序
根据系统实操经验，各种向量化方法的检索效果排序为：
**自训练GloVe > DistillBERT > 预训练GloVe**

---

## 🔍 向量索引方法

本系统主要支持三大向量索引技术体系：

| 索引方法名称 | 索引类型 | 优点 | 缺点 | 适用场景 |
|:------------:|:--------:|:-----|:-----|:---------|
| **HNSW** | 网络图 | 检索速度极快 | 构建索引速度极慢 | 人脸识别等图像极速检索 |
| **E2LSH** | 哈希算法 | 检索速度与索引构建速度均尚可 | 召回精度一般 | 中等规模数据检索 |
| **扁平索引** | 并行线性搜索 | 召回精度100% | 检索速度一般 | 小规模文本库场景 |

在实践中，需根据场景需求确定索引方法。如在小规模文本库场景中，使用扁平索引即可；而在需要极速检索的场景中，使用HNSW较好。

---

## 🔎 检索方法

本系统支持多种检索策略，既包括传统的基于关键词匹配的BM25检索方法，也包括人工智能时代所采用的基于向量相似度的语义相关性检索方法，并且可以将两种方法的检索结果进行多路召回综合排序：

| 检索方法名称 | 说明 | 优点 | 缺点 | 适用场景 |
|:------------:|:-----|:-----|:-----|:---------|
| **BM25** | 基于关键词匹配和关键词的TF-IDF等分值计算得分并排序召回 | 不受文本长度限制，检索速度快 | 无法计算语义相似性，必须精确匹配词 | 精确关键词搜索 |
| **向量相似性** | 基于向量间的欧式距离进行相似性排序召回 | 能够计算语义相似性，适合文本模糊搜索 | 受文本长度限制，长文本向量的语义信息模糊 | 语义相似性搜索 |
| **综合检索** | 综合BM25和向量相似性的检索结果进行多路召回结果综合排序 | 同时吸纳两种检索方法的优点，避免两种方法缺点 | 计算量大，在海量数据中速度慢 | 高精度综合搜索 |

---

## 🎯 用户检索问题解析方法

在信息检索中，由于用户的口语化表达等问题，经常出现"用户意图理解困难"问题，即系统不能使用最优的检索语句去查询用户想要获得的信息。本系统为了解决以上问题，加入了大模型解析检索问题的可选配置：

| 解析方法 | 说明 | 优点 | 缺点 | 适用场景 |
|:--------:|:-----|:-----|:-----|:---------|
| **用户原始问题** | 使用用户输入的问题直接检索 | 简单、不易出错、响应速度快 | 用户问题通常口语化，在连续对话中输入的问题无上下文信息，无法检索 | 简单查询场景 |
| **大模型解析检索问题** | 根据用户输入的问题由大模型重新生成合适的检索问题 | 能够生成更加适合检索的完整语句，在连续对话中仍能根据上下文生成完整的检索问题 | 依赖于大模型的用户意图理解和生成水平，部分智能度不够的大模型容易出错 | 复杂查询和连续对话场景 |

---

## 🏆 检索结果精排序

GloVe, BERT和其它文本向量化模型速度较快，但文本的相关性匹配计算能力有限。目前主流的技术架构为首先使用GloVe和其它向量表征进行初轮筛选，然后再使用大型深度学习模型进行结果精排序。系统理论上支持所有的基于深度学习的ReRank模型。当前已通过测试的代表性模型包括：

### **ms-marco-MiniLM-L6-v2**
- **架构**：基于CrossEncoder架构的深度学习模型
- **模型大小**：100M+
- **部署方式**：系统发布的科研版中默认使用该模型
- **计算要求**：基于CPU的计算即可支持，计算开销不大

### **bge-reranker-v2-m3**
- **特点**：大型深度学习模型，相关性计算结果极佳
- **模型大小**：Around 2G
- **部署方式**：由于模型体量过大，默认情况不随系统发布，需由软件官方人工安装并配置GPU功能支持

### 应用扩展
以上检索结果精排序模型还应用在WEB搜索（Agent工具）结果重排序功能中，提供更精准的搜索结果。

---

---

# 📚 Text Vector Database and Key Configuration Guide

> **Text Vector Database** is an intelligent text processing system that automatically scans text files in specified directories, intelligently segments text into chunks, and converts "text chunks" into fixed-length numerical vectors. The system employs multiple advanced methods for text chunk retrieval and recall, and uses high-precision deep learning models for fine-ranking of recalled results. Main application scenarios include fuzzy content retrieval of massive text files and retrieval-augmented generation (RAG) for large language models.

---

## 📁 Supported File Types

The system currently supports the vast majority of common text file types in the market, including PDF, Word, Excel, PPT, TXT, Markdown, etc. For different file characteristics, the system performs targeted special processing:

| File Type | Extension | Processing Method Description |
|:---------:|:---------:|:-----------------------------|
| **TXT** | `.txt` | If there is one blank line between paragraphs (i.e., two `\n\n`), the system will default this format as the user-specified text chunk cutting method and avoid cutting large paragraphs, merging small paragraphs backward. |
| **PDF** | `.pdf` | The system attempts to repair paragraphs from incorrectly segmented text read from PDFs. If tables exist in the document, only tables with complete borders can be identified, and the entire table will be converted to Markdown format and treated as a complete text chunk without cutting. |
| **MS Word** | `.doc/.docx` | Text chunk cutting method is the same as TXT. If tables exist in the document, the entire table will be converted to Markdown format and treated as a complete text chunk without cutting. |
| **MS Excel** | `.xls/.xlsx` | The entire table in a worksheet will be converted to Markdown format and treated as a complete text chunk without cutting. If the table is very large, it's recommended to convert to CSV format first, and the system will perform special processing. |
| **CSV** | `.csv` | Must have headers by default. Each row of data will be processed as multiple key-value corresponding JSON data, where field names in the header are keys and data units in rows are values. Each row is a text chunk without cutting. |
| **Markdown** | `.md` | Preferred format for large models. Special processing is done for titles and their leading paragraphs. Text blocks formed by title + paragraph are not further cut or merged. Special annotations are made for tables, quotes, lists, code blocks, etc. |
| **HTML** | `.html/.htm` | Convert HTML to Markdown format, then process it. Processing method is the same as Markdown. |
| **MS PPT** | `.ppt/.pptx` | Text chunk cutting method is the same as TXT. If tables exist in PPT, the entire table will be converted to Markdown format and treated as a complete text chunk without cutting. |

---

## 🔪 Text Chunk Processing Mechanism

The text database intelligently cuts longer text content into multiple small text segments, which is necessary under current technical conditions:

### Why Text Chunking is Needed?

- **🔍 Semantic Information Preservation**: When vectorizing text, overly long text tends to blur semantic information. When searching text chunks using user input questions, the relevance calculation effect between long text and user questions based on vector similarity comparison will be greatly reduced.

- **📏 Model Input Limitations**: Text vectorization models usually have input length restrictions. For example, models like BERT and BGE typically limit input tokens to 512, and overly long text is often directly truncated and discarded.

- **🤖 Large Model Compatibility**: Large language models usually have input length restrictions. In applications like retrieval-augmented generation, if the retrieved text length exceeds the input length limit of large models, it will be directly truncated and discarded.

### Text Chunk Length Configuration Recommendations

Given that most text vectorization models have input length restrictions of 512 tokens, when setting up the text database, the maximum text chunk length limit should consider this factor:

| Language | Maximum Text Chunk Length Setting | Description |
|:--------:|:--------------------------------:|:------------|
| **Chinese** | 512 tokens correspond to 512 Chinese word groups | For safety, character length should not exceed **1000**, default value is **800** |
| **English** | 512 tokens correspond to 512 words | For safety, character length should not exceed **2000**, default value is **800** |

As for the **minimum text chunk length** limit, it can be set according to specific scenarios, with a default value of **500**. When the paragraph identified by the system is smaller than the minimum text chunk length, it will merge paragraphs backward by default until the length meets the minimum length requirement.

---

## 🧠 Text Vectorization Methods

This system supports multiple advanced text vectorization technologies:

### **GloVe** - Shallow Semantic Vectorization
- **Characteristics**: GloVe neural network models are usually small, with input word sequence correlation window length typically being 5
- **Advantages**: Fast training speed, low resource consumption
- **Limitations**: Difficulty in capturing long-distance correlation relationships between text vocabulary, semantic relevance is "shallow semantics"
- **Application**: The system has built-in GloVe models pre-trained on large text materials such as "People's Daily"
- **Extension**: Provides self-training functionality for GloVe models, which can train custom models that highly reflect user domain data characteristics after "domain vocabulary recognition"

### **DistillBERT** - Deep Semantic Vectorization
- **Characteristics**: Distilled pre-trained version of BERT model for text data vectorization
- **Advantages**: Attention mechanism is good at capturing long-distance dependency relationships between vocabulary, semantic relevance is "deep semantics"
- **Technology**: It is a serialized model itself, word sequences can directly generate sentence vectors without involving weighted average conversion from word vectors to sentence vectors like GloVe
- **Efficiency**: Performance is no different from BERT, but volume is 70% smaller (250M), suitable for server-side deployment

### Performance Ranking
According to system practical experience, the retrieval effect ranking of various vectorization methods is:
**Self-trained GloVe > DistillBERT > Pre-trained GloVe**

---

## 🔍 Vector Indexing Methods

This system mainly supports three major vector indexing technology systems:

| Index Method Name | Index Type | Advantages | Disadvantages | Applicable Scenarios |
|:-----------------:|:----------:|:-----------|:---------------|:---------------------|
| **HNSW** | Network Graph | Extremely fast retrieval speed | Very slow index building speed | Face recognition and other image ultra-fast retrieval |
| **E2LSH** | Hash Algorithm | Both retrieval speed and index building speed are acceptable | General recall accuracy | Medium-scale data retrieval |
| **Flat Index** | Parallel Linear Search | 100% recall accuracy | General retrieval speed | Small-scale text database scenarios |

In practice, the indexing method should be determined according to scenario requirements. For example, in small-scale text database scenarios, using flat indexing is sufficient; while in scenarios requiring ultra-fast retrieval, using HNSW is better.

---

## 🔎 Retrieval Methods

This system supports multiple retrieval strategies, including both traditional BM25 retrieval methods based on keyword matching and semantic relevance retrieval methods based on vector similarity adopted in the AI era. It can also perform multi-channel recall comprehensive ranking of retrieval results from both methods:

| Retrieval Method Name | Description | Advantages | Disadvantages | Applicable Scenarios |
|:---------------------:|:------------|:-----------|:---------------|:---------------------|
| **BM25** | Based on keyword matching and TF-IDF scoring calculation of keywords for ranking and recall | Not limited by text length, fast retrieval speed | Cannot calculate semantic similarity, must exactly match words | Precise keyword search |
| **Vector Similarity** | Based on Euclidean distance between vectors for similarity ranking and recall | Can calculate semantic similarity, suitable for fuzzy text search | Limited by text length, semantic information of long text vectors is blurred | Semantic similarity search |
| **Comprehensive Retrieval** | Comprehensive ranking of multi-channel recall results combining BM25 and vector similarity retrieval results | Absorbs advantages of both retrieval methods while avoiding their disadvantages | High computational cost, slow in massive data | High-precision comprehensive search |

---

## 🎯 User Retrieval Question Parsing Methods

In information retrieval, due to users' colloquial expressions and other issues, "user intent understanding difficulties" often occur, meaning the system cannot use optimal retrieval statements to query the information users want to obtain. To solve this problem, this system has added optional configuration for large model parsing of retrieval questions:

| Parsing Method | Description | Advantages | Disadvantages | Applicable Scenarios |
|:--------------:|:------------|:-----------|:---------------|:---------------------|
| **User Original Question** | Use user input questions for direct retrieval | Simple, not prone to errors, fast response speed | User questions are usually colloquial, questions input in continuous conversations lack context information and cannot be retrieved | Simple query scenarios |
| **Large Model Parsing Retrieval Questions** | Large models regenerate appropriate retrieval questions based on user input questions | Can generate more retrieval-suitable complete statements, still generate complete retrieval questions based on context in continuous conversations | Depends on large models' user intent understanding and generation level, some models with insufficient intelligence are prone to errors | Complex queries and continuous conversation scenarios |

---

## 🏆 Retrieval Result Fine-Ranking

GloVe, BERT and other text vectorization models are fast, but their text relevance matching calculation capabilities are limited. The current mainstream technical architecture is to first use GloVe and other vector representations for initial screening, then use large deep learning models for result fine-ranking. The system theoretically supports all deep learning-based ReRank models. Currently tested representative models include:

### **ms-marco-MiniLM-L6-v2**
- **Architecture**: Deep learning model based on CrossEncoder architecture
- **Model Size**: 100M+
- **Deployment Method**: Default model used in the research version released by the system
- **Computing Requirements**: Can be supported by CPU-based computing with low computational overhead

### **bge-reranker-v2-m3**
- **Characteristics**: Large deep learning model with excellent relevance calculation results
- **Model Size**: Around 2G
- **Deployment Method**: Due to large model volume, not included in system release by default, requires manual installation by software officials and GPU function support configuration

### Application Extension
The above retrieval result fine-ranking models are also applied in WEB search (Agent tool) result re-ranking functionality, providing more accurate search results.
