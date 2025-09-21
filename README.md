# YiShape-VecDB (易形空间 向量数据库管理系统)

[![License](https://img.shields.io/badge/license-GPL-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/java-24+-blue.svg)](https://www.oracle.com/java/technologies/downloads/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey.svg)](https://github.com/ScaleFree-Tech/YiShape-VecDB)

> 易形空间 - 寓意通过灵活、丰富的空间变换，实现最优向量表征、向量索引与向量检索计算。

[English](#english) | [中文](#中文)

---

## 中文

### 项目简介

"易形空间向量数据库"系统是面向大语言模型、自然语言处理、图像检索等新型人工智能应用的专用数据库管理系统及场景应用辅助系统，拥有完全自主知识产权。系统的核心功能包括：非结构数据（文本、图像、语音）的最优向量空间表征算法（自研）和最速检索空间索引算法（自研），主要面向企业的私有化部署，适用于垂直领域企业内部海量私有数据的知识提炼。

系统使用JAVA开发，内部集成了DeepSeek、QWen等主流优质商用大模型，能通过Ollama在企业内网部署各类开源大模型，通过检索增强生成、图像分析与检索、大模型Agent等应用，并能够通过开放的API整合企业内部信息资源和企业部软件功能，实现传统业务的AI赋能。

本项目专注于"易形空间向量数据库"的专用图形化界面（Graphical User Interface, GUI）开发，免费使用。

### 系统演示

- [📖 系统演示地址](http://demo.yishape.com/mag/)

### 核心特性

#### 🔍 智能向量检索
- **多模态支持**: 支持文本、图像、语音等多种数据类型的向量化存储与检索
- **自研向量化方法**: 在GloVe、DistilBERT、ResNet等基础上进行距离度量学习，实现最优向量表征
- **高效索引技术**: 支持HNSW、E2LSH、扁平索引等多种向量索引方法
- **混合检索策略**: 结合BM25关键词检索和向量相似性检索，提供更精准的搜索结果

#### 🤖 大模型集成与RAG
- **多模型支持**: 集成DeepSeek、QWen、Ollama等主流大模型
- **检索增强生成**: 内置RAG功能，为大模型提供事实依据，缓解幻觉问题
- **智能问题解析**: 使用大模型解析用户意图，生成更精准的检索语句
- **连续对话支持**: 支持多轮对话中的上下文理解和检索

```mermaid
sequenceDiagram
    participant U as 用户
    participant UI as 前端界面
    participant API as API服务
    participant RAG as RAG引擎
    participant VDB as 向量数据库
    participant LLM as 大语言模型
    
    U->>UI: 输入问题
    UI->>API: 发送查询请求
    API->>RAG: 启动RAG流程
    
    Note over RAG: 问题解析与优化
    RAG->>RAG: 问题意图分析
    RAG->>RAG: 生成检索关键词
    
    Note over RAG: 向量检索
    RAG->>VDB: 向量相似性检索
    VDB-->>RAG: 返回相关文档片段
    
    Note over RAG: 混合检索
    RAG->>RAG: BM25关键词检索
    RAG->>RAG: 结果融合与重排序
    
    Note over RAG: 上下文构建
    RAG->>RAG: 构建检索上下文
    RAG->>RAG: 添加历史对话上下文
    
    Note over RAG: 生成回答
    RAG->>LLM: 发送增强后的提示
    LLM-->>RAG: 返回生成回答
    RAG->>RAG: 后处理与验证
    
    RAG-->>API: 返回最终回答
    API-->>UI: 返回结果
    UI-->>U: 显示回答
    
    Note over U,LLM: 支持多轮对话，保持上下文连续性
```

#### 🛠️ ReAct Agent框架
- **推理-行动循环**: 实现观察-思考-行动-再观察的智能决策循环
- **内置工具集**: 提供WEB搜索、天气预报、地理位置查询等丰富工具
- **多模态能力**: 支持图片生成、文件处理等多种外部功能调用
- **幻觉克服**: 通过本地数据检索和WEB搜索提供可核实依据

```mermaid
graph TD
    A[用户任务输入] --> B[Agent接收任务]
    B --> C["观察阶段<br/>分析当前状态"]
    
    C --> D["思考阶段<br/>推理下一步行动"]
    D --> E{是否需要工具?}
    
    E -->|是| F[选择合适工具]
    E -->|否| G[直接生成回答]
    
    F --> H[执行工具调用]
    H --> I[获取工具结果]
    I --> J[观察工具结果]
    
    J --> K{任务是否完成?}
    K -->|否| D
    K -->|是| L[生成最终回答]
    
    G --> L
    L --> M[返回结果给用户]
    
    subgraph "内置工具集"
        N1[WEB搜索]
        N2[天气预报]
        N3[地理位置查询]
        N4[图片生成]
        N5[文件处理]
        N6[数据检索]
        N7[计算工具]
    end
    
    F -.-> N1
    F -.-> N2
    F -.-> N3
    F -.-> N4
    F -.-> N5
    F -.-> N6
    F -.-> N7
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
    style L fill:#e0f2f1
    style M fill:#e3f2fd
```

#### 📊 批量处理能力
- **文本块处理**: 支持大规模文本的智能分块和批量处理
- **文件迭代任务**: 实现批量论文阅读、文档分析等复杂任务
- **多语言支持**: 支持中英文混合检索和批量翻译
- **性能优化**: 支持GPU加速，提供高性能的向量计算能力

#### 🔧 企业级特性
- **私有化部署**: 支持企业内网部署，保护数据隐私
- **开放API**: 提供丰富的API接口，支持与现有系统集成
- **可扩展架构**: 支持自定义向量数据库和第三方软件平台集成
- **监控日志**: 完整的系统监控和日志记录功能

### 技术架构

```mermaid
graph TB
    subgraph "YiShape-VecDB 系统架构"
        subgraph "图形化界面层 (Vue.js)"
            A1[数据库管理]
            A2[RAG对话]
            A3[Agent工具]
        end
        
        subgraph "业务逻辑层 (Java)"
            B1[向量化引擎]
            B2[检索引擎]
            B3[Agent框架]
        end
        
        subgraph "数据存储层 (Java)"
            C1[向量数据库]
            C2[文件存储]
            C3[关系数据库]
        end
        
        subgraph "模型服务层"
            D1["向量化模型<br/>自研/C++ Torch"]
            D2["大语言模型<br/>DeepSeek/QWen/Ollama"]
            D3["重排序模型<br/>API调用"]
        end
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    
    B1 --> C1
    B2 --> C1
    B3 --> C2
    
    B1 --> D1
    B2 --> D2
    B2 --> D3
    
    style A1 fill:#e1f5fe
    style A2 fill:#e1f5fe
    style A3 fill:#e1f5fe
    style B1 fill:#f3e5f5
    style B2 fill:#f3e5f5
    style B3 fill:#f3e5f5
    style C1 fill:#e8f5e8
    style C2 fill:#e8f5e8
    style C3 fill:#e8f5e8
    style D1 fill:#fff3e0
    style D2 fill:#fff3e0
    style D3 fill:#fff3e0
```

### 支持的文件类型

```mermaid
flowchart TD
    A[文件上传] --> B{文件类型检测}
    
    B -->|PDF| C1[PDF处理]
    B -->|Word| C2[Word处理]
    B -->|Excel| C3[Excel处理]
    B -->|CSV| C4[CSV处理]
    B -->|MarkDown| C5[MarkDown处理]
    B -->|HTML| C6[HTML处理]
    B -->|PPT| C7[PPT处理]
    B -->|TXT| C8[TXT处理]
    
    C1 --> D1["段落修复<br/>表格MarkDown转换"]
    C2 --> D2["智能分块<br/>表格处理"]
    C3 --> D3[表格MarkDown转换]
    C4 --> D4[JSON键值对处理]
    C5 --> D5["标题段落优化<br/>特殊标注"]
    C6 --> D6[MarkDown转换]
    C7 --> D7["文本提取<br/>表格处理"]
    C8 --> D8[智能段落识别]
    
    D1 --> E[文本分块]
    D2 --> E
    D3 --> E
    D4 --> E
    D5 --> E
    D6 --> E
    D7 --> E
    D8 --> E
    
    E --> F[向量化处理]
    F --> G[索引构建]
    G --> H[存储到向量数据库]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style E fill:#e8f5e8
    style F fill:#f3e5f5
    style G fill:#fce4ec
    style H fill:#f1f8e9
```

| 类型 | 扩展名 | 特殊处理 |
|------|--------|----------|
| PDF | .pdf | 段落修复、表格MarkDown转换 |
| Word | .doc/.docx | 智能分块、表格处理 |
| Excel | .xls/.xlsx | 表格MarkDown转换 |
| CSV | .csv | JSON键值对处理 |
| MarkDown | .md | 标题段落优化、特殊标注 |
| HTML | .html/.htm | MarkDown转换 |
| PPT | .ppt/.pptx | 文本提取、表格处理 |
| TXT | .txt | 智能段落识别 |

### 快速开始

#### 系统部署架构

```mermaid
graph TB
    subgraph "用户环境"
        U1[Windows用户]
        U2[Linux用户]
        U3[macOS用户]
    end
    
    subgraph "YiShape-VecDB 部署"
        subgraph "应用层"
            A1["YiShape.exe<br/>主程序"]
            A2["Vue.js前端界面<br/>端口:7090"]
        end
        
        subgraph "运行时环境"
            B1["Java 24+<br/>或内置miniJRE"]
            B2["系统配置<br/>config.json"]
        end
        
        subgraph "数据存储"
            C1["向量数据库<br/>db_data/"]
            C2["文件存储<br/>temp_ppts/"]
            C3["日志文件<br/>logs/"]
        end
        
        subgraph "模型服务"
            D1["本地模型<br/>自研/C++ Torch"]
            D2["Ollama服务<br/>开源模型"]
            D3["API调用<br/>DeepSeek/QWen"]
        end
    end
    
    U1 --> A2
    U2 --> A2
    U3 --> A2
    
    A2 --> A1
    A1 --> B1
    A1 --> B2
    
    A1 --> C1
    A1 --> C2
    A1 --> C3
    
    A1 --> D1
    A1 --> D2
    A1 --> D3
    
    style U1 fill:#e3f2fd
    style U2 fill:#e3f2fd
    style U3 fill:#e3f2fd
    style A1 fill:#f3e5f5
    style A2 fill:#f3e5f5
    style B1 fill:#e8f5e8
    style B2 fill:#e8f5e8
    style C1 fill:#fff3e0
    style C2 fill:#fff3e0
    style C3 fill:#fff3e0
    style D1 fill:#fce4ec
    style D2 fill:#fce4ec
    style D3 fill:#fce4ec
```

#### 系统要求
- Windows 10+ / Linux / macOS
- Java 24+ 或内置miniJRE
- 内存: 4GB+ (推荐8GB+)
- 存储: 10GB+ 可用空间

#### 安装步骤

```mermaid
flowchart TD
    A[开始安装] --> B[下载安装包]
    B --> C[解压到目标目录]
    C --> D[检查系统环境]
    
    D --> E{Java环境检查}
    E -->|有Java 24+| F[使用系统Java]
    E -->|无Java| G[使用内置miniJRE]
    
    F --> H[启动YiShape.exe]
    G --> H
    
    H --> I[系统初始化]

    I --> L[打开浏览器访问]
    
    L --> M["访问 localhost:7090"]
    M --> N["使用默认账号登录<br/>admin/123456"]
    N --> O[开始使用系统]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style H fill:#f1f8e9
    style L fill:#e0f2f1
    style O fill:#e8f5e8
```

1. **下载安装包**
   ```bash
   # 下载最新版本
   wget https://github.com/ScaleFree-Tech/YiShape-VecDB/releases/latest/download/yi_shape_win64_vx.x.x.zip
   ```

2. **解压安装**
   ```bash
   unzip yi_shape_win64_vx.x.x.zip
   cd yi_shape_win64_vx.x.x
   ```

3. **启动系统**
   ```bash
   # Windows
   bin/YiShape.exe
   # 或双击bin/YiShape.exe启动程序
   
   ```

4. **访问系统**
   - 打开浏览器访问: `http://localhost:7090`（默认端口为7090）
   - 默认管理员账号: `admin`
   - 默认密码: `123456`

#### 快速配置

```mermaid
flowchart TD
    A[登录系统] --> B[进入文本库管理]
    B --> C[创建新文本库]
    
    C --> D[配置基本信息]
    D --> E[设置库名称和描述]
    E --> F[指定文件目录]
    
    F --> G[配置向量化方法]
    G --> H{选择向量化算法}
    H -->|GloVe| I1[GloVe向量化]
    H -->|DistilBERT| I2[DistilBERT向量化]
    H -->|自训练模型| I3[自训练模型向量化]
    
    I1 --> J[设置文本块长度]
    I2 --> J
    I3 --> J
    
    J --> K[配置索引方法]
    K --> L{选择索引算法}
    L -->|HNSW| M1[HNSW索引]
    L -->|E2LSH| M2[E2LSH索引]
    L -->|扁平索引| M3[扁平索引]
    
    M1 --> N[提交文本库配置]
    M2 --> N
    M3 --> N
    
    N --> O[系统自动处理]
    O --> P[文档扫描]
    P --> Q[智能分块]
    Q --> R[向量化处理]
    R --> S[索引构建]
    
    S --> T[配置完成]
    T --> U[开始使用]
    
    U --> V1[RAG对话功能]
    U --> V2[ReAct Agent]
    U --> V3[API集成]
    
    style A fill:#e3f2fd
    style C fill:#f3e5f5
    style G fill:#e8f5e8
    style K fill:#fff3e0
    style N fill:#fce4ec
    style O fill:#f1f8e9
    style T fill:#e0f2f1
    style U fill:#e8f5e8
```

1. **创建文本库**
   - 进入"文本库管理"页面
   - 点击"新增文本库"
   - 配置库名称、描述、文件目录等基本信息

2. **配置向量化方法**
   - 选择向量化方法: GloVe、DistilBERT或自训练模型
   - 设置文本块长度限制
   - 配置索引方法: HNSW、E2LSH或扁平索引

3. **上传文档**
   - 将文档放入指定目录
   - 系统自动扫描、分块、向量化
   - 等待索引构建完成

4. **开始使用**
   - 使用RAG对话功能进行智能问答
   - 配置ReAct Agent实现复杂任务自动化
   - 通过API接口集成到现有系统

### 详细文档

- [📖 系统使用指南](bin/static/docs/main.md)
- [🔍 文本库配置说明](bin/static/docs/text_db.md)
- [🤖 RAG检索增强生成](bin/static/docs/rag.md)
- [🛠️ ReAct Agent框架](bin/static/docs/react_agent.md)
- [🔧 Agent工具集](bin/static/docs/agent_tools.md)
- [⚡ GPU性能优化](bin/static/docs/gpu.md)
- [📚 使用案例](bin/static/docs/cases/)

### 使用案例

- [🚀 快速建立海量文件文本库](bin/static/docs/cases/quick_start)
- [🌍 构建多语言论文资料库](bin/static/docs/cases/rag_with_multi_lang)
- [📝 批量英文资料翻译](bin/static/docs/cases/batch_tans_with_chunk_agent)
- [📖 批量论文阅读分析](bin/static/docs/cases/batch_paper_reading_with_file_agent)

### 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与项目开发。

### 许可证

本项目采用 GPL-3.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

### 联系我们

- 项目主页: [https://github.com/ScaleFree-Tech/YiShape-VecDB](https://github.com/ScaleFree-Tech/YiShape-VecDB)
- 问题反馈: [Issues](https://github.com/ScaleFree-Tech/YiShape-VecDB/issues)
- 功能建议: [Discussions](https://github.com/ScaleFree-Tech/YiShape-VecDB/discussions)

---

## English

### Project Overview

"YiShape Vector Database" is a specialized database management system and application assistance system for new artificial intelligence applications such as large language models, natural language processing, and image retrieval. The system has complete independent intellectual property rights. Its core functions include: optimal vector space representation algorithms (self-developed) and fastest retrieval space indexing algorithms (self-developed) for unstructured data (text, images, audio), mainly targeting enterprise private deployment, suitable for knowledge extraction from massive private data within vertical domain enterprises.

YiShape-VecDB internally integrates mainstream high-quality commercial large models such as DeepSeek and QWen, can deploy various open-source large models through Ollama in enterprise intranets, and realizes AI empowerment of traditional businesses through applications such as retrieval-augmented generation, image analysis and retrieval, and large model Agent, and can integrate enterprise internal information resources and enterprise software functions through open APIs.

This project focuses on the development of a dedicated graphical user interface (GUI) for the "YiShape-VecDB", and all the files are free to use.

### DEMO

- [📖 YiShape VecDB DEMO](http://demo.yishape.com/mag/)

### Technical Architecture

```mermaid
graph TB
    subgraph "YiShape-VecDB System Architecture"
        subgraph "GUI Layer (Vue.js)"
            A1[Database Management]
            A2[RAG Dialogue]
            A3[Agent Tools]
        end
        
        subgraph "Business Logic Layer (Java)"
            B1[Vectorization Engine]
            B2[Retrieval Engine]
            B3[Agent Framework]
        end
        
        subgraph "Data Storage Layer (Java)"
            C1[Vector Database]
            C2[File Storage]
            C3[Relational Database]
        end
        
        subgraph "Model Service Layer"
            D1["Vectorization Models<br/>Self-developed/C++ Torch"]
            D2["Large Language Models<br/>DeepSeek/QWen/Ollama"]
            D3["Reranking Models<br/>API Calls"]
        end
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    
    B1 --> C1
    B2 --> C1
    B3 --> C2
    
    B1 --> D1
    B2 --> D2
    B2 --> D3
    
    style A1 fill:#e1f5fe
    style A2 fill:#e1f5fe
    style A3 fill:#e1f5fe
    style B1 fill:#f3e5f5
    style B2 fill:#f3e5f5
    style B3 fill:#f3e5f5
    style C1 fill:#e8f5e8
    style C2 fill:#e8f5e8
    style C3 fill:#e8f5e8
    style D1 fill:#fff3e0
    style D2 fill:#fff3e0
    style D3 fill:#fff3e0
```

### Core Features

#### 🔍 Intelligent Vector Retrieval
- **Multi-modal Support**: Supports vectorized storage and retrieval of multiple data types including text, images, and audio
- **Optimized Vectorization Methods**: Based on GloVe, DistilBERT, ResNet, etc., distance metric learning is carried out to achieve the optimal vector representation.
- **Efficient Indexing Technology**: Supports multiple vector indexing methods including HNSW, E2LSH, and flat indexing
- **Hybrid Retrieval Strategy**: Combines BM25 keyword retrieval and vector similarity retrieval for more accurate search results

#### 🤖 Large Model Integration and RAG
- **Multi-model Support**: Integrates mainstream large models such as DeepSeek, QWen, and Ollama
- **Retrieval-Augmented Generation**: Built-in RAG functionality provides factual basis for large models and alleviates hallucination problems
- **Intelligent Question Parsing**: Uses large models to parse user intent and generate more accurate retrieval statements
- **Continuous Dialogue Support**: Supports context understanding and retrieval in multi-turn conversations

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend Interface
    participant API as API Service
    participant RAG as RAG Engine
    participant VDB as Vector Database
    participant LLM as Large Language Model
    
    U->>UI: Input Question
    UI->>API: Send Query Request
    API->>RAG: Start RAG Process
    
    Note over RAG: Question Analysis & Optimization
    RAG->>RAG: Question Intent Analysis
    RAG->>RAG: Generate Retrieval Keywords
    
    Note over RAG: Vector Retrieval
    RAG->>VDB: Vector Similarity Retrieval
    VDB-->>RAG: Return Relevant Document Fragments
    
    Note over RAG: Hybrid Retrieval
    RAG->>RAG: BM25 Keyword Retrieval
    RAG->>RAG: Result Fusion & Reranking
    
    Note over RAG: Context Construction
    RAG->>RAG: Build Retrieval Context
    RAG->>RAG: Add Historical Dialogue Context
    
    Note over RAG: Generate Answer
    RAG->>LLM: Send Enhanced Prompt
    LLM-->>RAG: Return Generated Answer
    RAG->>RAG: Post-processing & Validation
    
    RAG-->>API: Return Final Answer
    API-->>UI: Return Result
    UI-->>U: Display Answer
    
    Note over U,LLM: Supports multi-turn dialogue with context continuity
```

#### 🛠️ ReAct Agent Framework
- **Reasoning-Action Loop**: Implements intelligent decision-making cycles of observe-think-act-observe
- **Built-in Toolset**: Provides rich tools including WEB search, weather forecasting, and geographic location queries
- **Multi-modal Capabilities**: Supports various external function calls such as image generation and file processing
- **Hallucination Overcoming**: Provides verifiable basis through local data retrieval and WEB search

```mermaid
graph TD
    A[User Task Input] --> B[Agent Receives Task]
    B --> C["Observation Phase<br/>Analyze Current State"]
    
    C --> D["Thinking Phase<br/>Reason Next Action"]
    D --> E{Need Tools?}
    
    E -->|Yes| F[Select Appropriate Tool]
    E -->|No| G[Generate Direct Answer]
    
    F --> H[Execute Tool Call]
    H --> I[Get Tool Result]
    I --> J[Observe Tool Result]
    
    J --> K{Task Complete?}
    K -->|No| D
    K -->|Yes| L[Generate Final Answer]
    
    G --> L
    L --> M[Return Result to User]
    
    subgraph "Built-in Toolset"
        N1[WEB Search]
        N2[Weather Forecast]
        N3[Geographic Query]
        N4[Image Generation]
        N5[File Processing]
        N6[Data Retrieval]
        N7[Calculation Tools]
    end
    
    F -.-> N1
    F -.-> N2
    F -.-> N3
    F -.-> N4
    F -.-> N5
    F -.-> N6
    F -.-> N7
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
    style L fill:#e0f2f1
    style M fill:#e3f2fd
```

#### 📊 Batch Processing Capabilities
- **Text Chunk Processing**: Supports intelligent chunking and batch processing of large-scale texts
- **File Iteration Tasks**: Implements complex tasks such as batch paper reading and document analysis
- **Multi-language Support**: Supports mixed Chinese-English retrieval and batch translation
- **Performance Optimization**: Supports GPU acceleration for high-performance vector computing

#### 🔧 Enterprise Features
- **Private Deployment**: Supports enterprise intranet deployment to protect data privacy
- **Open APIs**: Provides rich API interfaces for integration with existing systems
- **Scalable Architecture**: Supports custom vector databases and third-party software platform integration
- **Monitoring and Logging**: Complete system monitoring and logging functionality

### Quick Start

#### System Deployment Architecture

```mermaid
graph TB
    subgraph "User Environment"
        U1[Windows Users]
        U2[Linux Users]
        U3[macOS Users]
    end
    
    subgraph "YiShape-VecDB Deployment"
        subgraph "Application Layer"
            A1["YiShape.exe<br/>Main Program"]
            A2["Vue.js Frontend Interface<br/>Port:7090"]
        end
        
        subgraph "Runtime Environment"
            B1["Java 24+<br/>or Built-in miniJRE"]
            B2["System Configuration<br/>config.json"]
        end
        
        subgraph "Data Storage"
            C1["Vector Database<br/>db_data/"]
            C2["File Storage<br/>temp_ppts/"]
            C3["Log Files<br/>logs/"]
        end
        
        subgraph "Model Services"
            D1["Local Models<br/>Self-developed/C++ Torch"]
            D2["Ollama Service<br/>Open Source Models"]
            D3["API Calls<br/>DeepSeek/QWen"]
        end
    end
    
    U1 --> A2
    U2 --> A2
    U3 --> A2
    
    A2 --> A1
    A1 --> B1
    A1 --> B2
    
    A1 --> C1
    A1 --> C2
    A1 --> C3
    
    A1 --> D1
    A1 --> D2
    A1 --> D3
    
    style U1 fill:#e3f2fd
    style U2 fill:#e3f2fd
    style U3 fill:#e3f2fd
    style A1 fill:#f3e5f5
    style A2 fill:#f3e5f5
    style B1 fill:#e8f5e8
    style B2 fill:#e8f5e8
    style C1 fill:#fff3e0
    style C2 fill:#fff3e0
    style C3 fill:#fff3e0
    style D1 fill:#fce4ec
    style D2 fill:#fce4ec
    style D3 fill:#fce4ec
```

#### System Requirements
- Windows 10+ / Linux / macOS
- Java 24+ or built-in miniJRE
- Memory: 4GB+ (recommended 8GB+)
- Storage: 10GB+ available space

#### Installation Steps

```mermaid
flowchart TD
    A[Start Installation] --> B[Download Package]
    B --> C[Extract to Target Directory]
    C --> D[Check System Environment]
    
    D --> E{Java Environment Check}
    E -->|Java 24+ Available| F[Use System Java]
    E -->|No Java| G[Use Built-in miniJRE]
    
    F --> H[Launch YiShape.exe]
    G --> H
    
    H --> I[System Initialization]

    I --> L[Open Browser Access]
    
    L --> M["Visit localhost:7090"]
    M --> N["Login with Default Account<br/>admin/123456"]
    N --> O[Start Using System]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style H fill:#f1f8e9
    style L fill:#e0f2f1
    style O fill:#e8f5e8
```

1. **Download Package**
   ```bash
   # Download latest version
   wget https://github.com/ScaleFree-Tech/YiShape-VecDB/releases/latest/download/yi_shape_win64_vx.x.x.zip
   ```

2. **Extract and Install**
   ```bash
   unzip yi_shape_win64_vx.x.x.zip
   cd YiShape-VecDB
   ```

3. **Start System**
   ```bash
   # Windows
   bin/YiShape.exe
   # or double-click bin/YiShape.exe

   ```

4. **Access System**
   - Open browser and visit: `http://localhost:7090`(The default port is 7090)
   - Default admin account: `admin`
   - Default password: `123456`

#### Supported File Types

```mermaid
flowchart TD
    A[File Upload] --> B{File Type Detection}
    
    B -->|PDF| C1[PDF Processing]
    B -->|Word| C2[Word Processing]
    B -->|Excel| C3[Excel Processing]
    B -->|CSV| C4[CSV Processing]
    B -->|MarkDown| C5[MarkDown Processing]
    B -->|HTML| C6[HTML Processing]
    B -->|PPT| C7[PPT Processing]
    B -->|TXT| C8[TXT Processing]
    
    C1 --> D1["Paragraph Repair<br/>Table MarkDown Conversion"]
    C2 --> D2["Smart Chunking<br/>Table Processing"]
    C3 --> D3[Table MarkDown Conversion]
    C4 --> D4[JSON Key-Value Processing]
    C5 --> D5["Title Paragraph Optimization<br/>Special Annotation"]
    C6 --> D6[MarkDown Conversion]
    C7 --> D7["Text Extraction<br/>Table Processing"]
    C8 --> D8[Smart Paragraph Recognition]
    
    D1 --> E[Text Chunking]
    D2 --> E
    D3 --> E
    D4 --> E
    D5 --> E
    D6 --> E
    D7 --> E
    D8 --> E
    
    E --> F[Vectorization Processing]
    F --> G[Index Building]
    G --> H[Store to Vector Database]
    
    style A fill:#e3f2fd
    style B fill:#fff3e0
    style E fill:#e8f5e8
    style F fill:#f3e5f5
    style G fill:#fce4ec
    style H fill:#f1f8e9
```

| Type | Extensions | Special Processing |
|------|------------|-------------------|
| PDF | .pdf | Paragraph repair, table MarkDown conversion |
| Word | .doc/.docx | Smart chunking, table processing |
| Excel | .xls/.xlsx | Table MarkDown conversion |
| CSV | .csv | JSON key-value processing |
| MarkDown | .md | Title paragraph optimization, special annotation |
| HTML | .html/.htm | MarkDown conversion |
| PPT | .ppt/.pptx | Text extraction, table processing |
| TXT | .txt | Smart paragraph recognition |

#### Quick Configuration

```mermaid
flowchart TD
    A[Login System] --> B[Enter Text Database Management]
    B --> C[Create New Text Database]
    
    C --> D[Configure Basic Information]
    D --> E[Set Database Name and Description]
    E --> F[Specify File Directory]
    
    F --> G[Configure Vectorization Method]
    G --> H{Select Vectorization Algorithm}
    H -->|GloVe| I1[GloVe Vectorization]
    H -->|DistilBERT| I2[DistilBERT Vectorization]
    H -->|Self-trained Model| I3[Self-trained Model Vectorization]
    
    I1 --> J[Set Text Chunk Length]
    I2 --> J
    I3 --> J
    
    J --> K[Configure Index Method]
    K --> L{Select Index Algorithm}
    L -->|HNSW| M1[HNSW Index]
    L -->|E2LSH| M2[E2LSH Index]
    L -->|Flat Index| M3[Flat Index]
    
    M1 --> N[Submit Text Database Configuration]
    M2 --> N
    M3 --> N
    
    N --> O[System Automatic Processing]
    O --> P[Document Scanning]
    P --> Q[Smart Chunking]
    Q --> R[Vectorization Processing]
    R --> S[Index Building]
    
    S --> T[Configuration Complete]
    T --> U[Start Using]
    
    U --> V1[RAG Dialogue Function]
    U --> V2[ReAct Agent]
    U --> V3[API Integration]
    
    style A fill:#e3f2fd
    style C fill:#f3e5f5
    style G fill:#e8f5e8
    style K fill:#fff3e0
    style N fill:#fce4ec
    style O fill:#f1f8e9
    style T fill:#e0f2f1
    style U fill:#e8f5e8
```

1. **Create Text Database**
   - Enter "Text Database Management" page
   - Click "Add New Text Database"
   - Configure basic information such as database name, description, and file directory

2. **Configure Vectorization Method**
   - Select vectorization method: GloVe, DistilBERT, or self-trained model
   - Set text chunk length limit
   - Configure index method: HNSW, E2LSH, or flat index

3. **Upload Documents**
   - Place documents in specified directory
   - System automatically scans, chunks, and vectorizes
   - Wait for index construction to complete

4. **Start Using**
   - Use RAG dialogue function for intelligent Q&A
   - Configure ReAct Agent for complex task automation
   - Integrate with existing systems through API interfaces

### Documentation

- [📖 System User Guide](bin/static/docs/main.md)
- [🔍 Text Database Configuration](bin/static/docs/text_db.md)
- [🤖 RAG Retrieval-Augmented Generation](bin/static/docs/rag.md)
- [🛠️ ReAct Agent Framework](bin/static/docs/react_agent.md)
- [🔧 Agent Toolset](bin/static/docs/agent_tools.md)
- [⚡ GPU Performance Optimization](bin/static/docs/gpu.md)
- [📚 Use Cases](bin/static/docs/cases/)

### Contributing

We welcome all forms of contributions! Please check [CONTRIBUTING.md](CONTRIBUTING.md) to learn how to participate in project development.

### License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

### Contact Us

- Project Homepage: [https://github.com/ScaleFree-Tech/YiShape-VecDB](https://github.com/ScaleFree-Tech/YiShape-VecDB)
- Issue Reports: [Issues](https://github.com/ScaleFree-Tech/YiShape-VecDB/issues)
- Feature Suggestions: [Discussions](https://github.com/ScaleFree-Tech/YiShape-VecDB/discussions)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个星标！ ⭐**

Made with ❤️ by the YiShape Team

</div>
