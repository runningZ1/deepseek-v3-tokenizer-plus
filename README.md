# DeepSeek V3 Tokenizer Plus

> 一个简单易用的 DeepSeek V3 模型 Token 统计工具

[![Python Version](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📖 简介

这是一个基于 DeepSeek V3 模型的 Token 统计工具，可以帮助你快速统计文本、文件或整个项目的 Token 数量。

**适用场景:**
- 📝 统计文档的 Token 数量
- 💰 估算 API 调用成本
- 📊 分析项目代码的 Token 使用情况
- 🔍 在提交给 AI 前检查内容长度

## ✨ 主要功能

- ✅ **命令行工具**: 一键统计文件或目录的 Token 数
- ✅ **Python 库**: 在代码中直接调用
- ✅ **批量处理**: 支持递归处理整个项目目录
- ✅ **详细统计**: 显示字符数、单词数、行数等详细信息
- ✅ **多语言支持**: 完美支持中英文混合文本

## 📦 安装

### 方法 1: 从 GitHub 安装（推荐）

```bash
# 克隆项目
git clone https://github.com/runningZ1/deepseek-v3-tokenizer-plus.git
cd deepseek-v3-tokenizer-plus

# 安装依赖
pip install -r requirements.txt

# 安装项目（开发模式）
pip install -e .
```

### 方法 2: 仅安装依赖

```bash
pip install transformers>=4.35.0
```

## 🚀 使用方法

### 🌟 超简单方式（推荐新手）

如果你觉得命令行太复杂，我们提供了两个**开箱即用**的脚本：

#### 📄 统计单个文件 - `quick_count.py`

```python
# 1. 打开 quick_count.py 文件
# 2. 修改第 9 行的文件路径
FILE_PATH = "README.md"  # 👈 改成你的文件路径

# 3. 运行脚本
python quick_count.py
```

**示例输出:**
```
============================================================
📊 统计结果
============================================================
文件路径: README.md
Token 数量: 1,971
字符总数: 5,331
文件大小: 5.21 KB
💰 API 成本估算（仅供参考）:
  GPT-4: $0.0591
  DeepSeek: $0.0020
```

#### 📁 批量统计目录 - `quick_batch.py`

```python
# 1. 打开 quick_batch.py 文件
# 2. 修改配置（第 9-11 行）
DIRECTORY_PATH = "./examples"  # 👈 改成你的目录路径
FILE_PATTERN = "*.py"          # 👈 文件类型: *.md, *.txt, *.py 等
RECURSIVE = True               # 👈 是否处理子目录: True 或 False

# 3. 运行脚本
python quick_batch.py
```

**示例输出:**
```
============================================================
📊 统计汇总
============================================================
文件总数: 2
Token 总数: 1,033
平均每文件: 516 tokens
📈 Token 数最多的文件 (Top 5):
  1. basic_usage.py: 601 tokens
  2. batch_processing.py: 432 tokens
```

---

### 1️⃣ 命令行使用

安装完成后，可以直接使用 `deepseek-tokenizer` 命令：

#### 统计单个文件

```bash
deepseek-tokenizer count README.md
```

输出示例：
```
============================================================
📊 Token统计结果
============================================================
文件: README.md
Token数: 1,350
字符数: 3,735
单词数: 411
行数: 143
```

#### 统计多个文件

```bash
deepseek-tokenizer count file1.txt file2.md file3.py
```

#### 批量处理目录

```bash
# 处理当前目录
deepseek-tokenizer batch .

# 处理指定目录
deepseek-tokenizer batch ./docs

# 递归处理所有子目录
deepseek-tokenizer batch ./src --recursive

# 只处理特定类型的文件
deepseek-tokenizer batch ./src --pattern "*.py"
deepseek-tokenizer batch ./docs --pattern "*.md"
```

### 2️⃣ Python 代码使用

#### 基础用法

```python
from deepseek_tokenizer import DeepSeekTokenizer

# 初始化 tokenizer
tokenizer = DeepSeekTokenizer()

# 统计文本的 Token 数
text = "你好，世界！Hello, World!"
token_count = tokenizer.count_tokens(text)
print(f"Token 数量: {token_count}")  # 输出: Token 数量: 11

# 统计文件的 Token 数
file_count = tokenizer.count_file_tokens("README.md")
print(f"文件 Token 数: {file_count}")
```

#### 批量处理文件

```python
from deepseek_tokenizer import DeepSeekTokenizer

tokenizer = DeepSeekTokenizer()

# 批量处理多个文件
files = ["file1.txt", "file2.md", "file3.py"]
results = tokenizer.batch_count_files(files)

for file_path, count in results.items():
    print(f"{file_path}: {count} tokens")
```

#### 使用 TokenCounter 获取详细信息

```python
from deepseek_tokenizer.core import TokenCounter

counter = TokenCounter()

# 获取详细的统计信息
stats = counter.count_text("你好，世界！")
print(f"Token 数: {stats['token_count']}")
print(f"字符数: {stats['char_count']}")
print(f"中文字符: {stats['chinese_chars']}")
print(f"英文字符: {stats['english_chars']}")
```

### 3️⃣ 运行示例代码

项目提供了完整的示例代码：

```bash
# 基础使用示例
python examples/basic_usage.py

# 批量处理示例
python examples/batch_processing.py
```

## 📊 实际测试结果

使用本工具统计的一些示例文件：

| 文件 | Token 数 | 字符数 | 文件大小 |
|------|---------|--------|---------|
| README.md | 1,350 | 3,735 | 3.6 KB |
| sample.md | 158 | 615 | 0.6 KB |

## 🛠️ 命令参数说明

### `count` 命令

统计文件或目录的 Token 数量。

```bash
deepseek-tokenizer count <path> [options]
```

**参数:**
- `path`: 文件或目录路径（必需）
- `-o, --output`: 输出 JSON 报告到文件
- `-d, --detailed`: 显示详细信息
- `-e, --extensions`: 指定文件扩展名（如 `.md .txt`）
- `--no-recursive`: 不递归处理子目录
- `-m, --model`: 指定 tokenizer 模型路径

**示例:**
```bash
# 基础统计
deepseek-tokenizer count README.md

# 导出详细报告
deepseek-tokenizer count ./docs -o report.json --detailed

# 只统计 Python 文件
deepseek-tokenizer count ./src -e .py --recursive
```

### `batch` 命令

批量处理目录中的文件。

```bash
deepseek-tokenizer batch <directory> [options]
```

**参数:**
- `directory`: 目录路径（必需）
- `--pattern`: 文件匹配模式（如 `*.py`）
- `--recursive`: 递归处理子目录
- `-o, --output`: 输出 JSON 报告

**示例:**
```bash
# 批量处理目录
deepseek-tokenizer batch ./docs

# 递归处理所有 Markdown 文件
deepseek-tokenizer batch . --pattern "*.md" --recursive
```

## 🧱 项目结构

```
deepseek-v3-tokenizer-plus/
├── quick_count.py              # 🌟 快速统计单文件（超简单）
├── quick_batch.py              # 🌟 快速批量统计（超简单）
├── src/deepseek_tokenizer/     # 核心代码
│   ├── cli/                    # 命令行工具
│   │   └── main.py            # CLI 入口
│   ├── core/                   # 核心功能
│   │   ├── tokenizer.py       # Tokenizer 封装
│   │   └── counter.py         # Token 计数器
│   └── utils/                  # 工具函数
│       ├── estimator.py       # Token 估算
│       └── formatter.py       # 格式化输出
├── models/deepseek-v3/         # DeepSeek V3 模型文件
│   ├── tokenizer.json
│   └── tokenizer_config.json
├── examples/                   # 示例代码
│   ├── basic_usage.py         # 基础用法
│   └── batch_processing.py    # 批量处理
├── tests/                      # 测试文件
├── README.md                   # 本文件
├── requirements.txt            # 依赖列表
└── setup.py                    # 安装配置
```

## 💡 常见问题

### Q: 支持哪些文件格式？

A: 支持所有文本文件，包括但不限于：
- Markdown (`.md`)
- Python (`.py`)
- JavaScript (`.js`)
- 文本文件 (`.txt`)
- 等所有纯文本格式

### Q: Token 统计准确吗？

A: 是的！本工具使用 DeepSeek V3 官方的 tokenizer，统计结果与实际 API 调用完全一致。

### Q: 可以统计整个项目吗？

A: 可以！使用批量处理命令：
```bash
deepseek-tokenizer batch . --recursive
```

### Q: 如何自定义 tokenizer 模型？

A: 使用 `-m` 参数指定模型路径：
```bash
deepseek-tokenizer count file.txt -m /path/to/your/tokenizer
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

```bash
# 安装开发依赖
pip install -r requirements-dev.txt

# 运行测试
pytest
```

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🔗 相关链接

- [DeepSeek 官网](https://www.deepseek.com/)
- [项目 GitHub](https://github.com/runningZ1/deepseek-v3-tokenizer-plus)
- [问题反馈](https://github.com/runningZ1/deepseek-v3-tokenizer-plus/issues)

---

**💡 提示**: 如果觉得这个工具有用，欢迎给项目点个 ⭐ Star！
