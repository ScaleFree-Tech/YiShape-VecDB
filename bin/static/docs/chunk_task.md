[返回](/mag/doc_detail/main)

---

# 📋 文本块批量处理指南

> **文本块迭代任务** 是 YiShape 系统的核心功能之一，通过大语言模型对文本库中的每个文本块进行智能化批量处理，实现高效的自然语言处理工作流。

## 🎯 功能概述

文本块迭代任务支持多种自然语言处理场景：

- **🔍 领域词汇识别** - 自动识别专业术语和关键概念
- **🏷️ 命名实体识别** - 批量提取人名、地名、组织机构等实体信息
- **😊 情感分析** - 分析文本情感倾向和情绪状态
- **🧠 知识图谱构建** - 自动化构建领域知识网络
- **🌐 批量翻译** - 多语言文档的批量转换处理

## 🛠️ 内置提示词模板

### 快速开始
系统预置了多个经过优化的提示词模板，覆盖常见的使用场景：

1. **选择模板** - 在任务设置界面选择合适的提示词模板
2. **自动填充** - 提示词内容将自动填入对应的文本框
3. **自定义修改** - 可根据具体需求对模板进行个性化调整

### 模板类型
- 📚 **学术文档处理** - 适用于论文、报告等学术文本
- 💼 **商业文档分析** - 针对合同、报告等商业文档
- 🏛️ **法律文书解析** - 专门处理法律法规相关文本
- 📰 **新闻媒体分析** - 适用于新闻、评论等媒体内容

## 📁 输出配置

### 默认输出路径
- **Windows 系统**: `D:\test\` 文件夹
- **Linux 系统**: `/xxx/xxx` 格式路径

### ⚠️ 注意事项
- 确保输出目录存在且有写入权限
- Windows 用户请确认 D 盘可用性
- 建议使用绝对路径避免路径错误

## 📊 结果处理

### 导出功能
任务完成后，可通过以下方式处理结果：

1. **Markdown 导出** - 将文本块与处理结果对照输出
2. **结构化分析** - 便于后续数据分析和可视化
3. **结果验证** - 检查处理质量和准确性

### 后处理建议
- 📈 **数据清洗** - 过滤无效或重复结果
- 🔄 **结果整合** - 合并相关处理结果
- 📋 **质量评估** - 建立结果质量评估标准

---

## 📚 使用技巧

### 最佳实践
1. **分批处理** - 大量文档建议分批处理，避免系统负载过高
2. **模板优化** - 根据实际效果持续优化提示词模板
3. **结果验证** - 定期检查处理结果的准确性和完整性

### 常见问题
- **处理速度慢**: 检查模型配置和硬件资源
- **结果不准确**: 优化提示词模板和参数设置
- **输出格式错误**: 确认输出路径和文件权限

---

---

# 📋 Chunk Task Batch Processing Guide

> **Chunk Iteration Task** is one of the core features of the YiShape system, enabling intelligent batch processing of each text chunk in the text library through large language models, achieving efficient natural language processing workflows.

## 🎯 Feature Overview

Chunk iteration tasks support various natural language processing scenarios:

- **🔍 Domain Vocabulary Recognition** - Automatically identify professional terms and key concepts
- **🏷️ Named Entity Recognition** - Batch extract entity information such as names, locations, and organizations
- **😊 Sentiment Analysis** - Analyze text sentiment tendencies and emotional states
- **🧠 Knowledge Graph Construction** - Automatically build domain knowledge networks
- **🌐 Batch Translation** - Batch conversion processing of multilingual documents

## 🛠️ Built-in Prompt Templates

### Quick Start
The system comes with multiple optimized prompt templates covering common usage scenarios:

1. **Select Template** - Choose appropriate prompt templates in the task settings interface
2. **Auto-fill** - Prompt content will automatically populate the corresponding text boxes
3. **Custom Modifications** - Personalize templates according to specific requirements

### Template Types
- 📚 **Academic Document Processing** - Suitable for papers, reports, and other academic texts
- 💼 **Business Document Analysis** - Targeting contracts, reports, and other business documents
- 🏛️ **Legal Document Parsing** - Specifically for laws, regulations, and related texts
- 📰 **News Media Analysis** - Applicable to news, reviews, and other media content

## 📁 Output Configuration

### Default Output Path
- **Windows System**: `D:\test\` folder
- **Linux System**: `/xxx/xxx` format path

### ⚠️ Important Notes
- Ensure output directory exists with write permissions
- Windows users please confirm D drive availability
- Recommend using absolute paths to avoid path errors

## 📊 Result Processing

### Export Functions
After task completion, results can be processed through:

1. **Markdown Export** - Output text chunks with processing results for comparison
2. **Structured Analysis** - Facilitate subsequent data analysis and visualization
3. **Result Verification** - Check processing quality and accuracy

### Post-processing Recommendations
- 📈 **Data Cleaning** - Filter invalid or duplicate results
- 🔄 **Result Integration** - Merge related processing results
- 📋 **Quality Assessment** - Establish result quality evaluation standards

---

## 📚 Usage Tips

### Best Practices
1. **Batch Processing** - For large document volumes, recommend batch processing to avoid high system load
2. **Template Optimization** - Continuously optimize prompt templates based on actual results
3. **Result Verification** - Regularly check the accuracy and completeness of processing results

### Common Issues
- **Slow Processing**: Check model configuration and hardware resources
- **Inaccurate Results**: Optimize prompt templates and parameter settings
- **Output Format Errors**: Confirm output path and file permissions