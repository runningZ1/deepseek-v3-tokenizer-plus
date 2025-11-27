# DeepSeek Tokenizer Toolkit

> 基于 DeepSeek V3 模型的统一 Tokenizer、统计与 CLI 工具集

[![Python Version](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Quick Facts

| 功能 | 描述 |
|------|------|
| 📝 文本编码/解码 | 深度封装 `DeepSeekTokenizer`，支持中英文混合文本 |
| 🚀 统一 CLI | `deepseek-tokenizer` 覆盖 count / estimate / encode / decode |
| 📊 精确统计 | `TokenCounter` 提供文件、目录及 API 成本分析 |
| ⚡ 快速估算 | `SimpleEstimator` 无需加载模型即可估算 token |
| 📁 批量处理 | 递归目录扫描、多扩展名过滤、JSON 报告导出 |
| 🔄 兼容旧脚本 | 旧版 `markdown_token_counter.py` 等仍保留在 `docs/legacy/` |

---

## ✨ 特性

- 🚀 **高效 Token 统计**：单文件、批量目录、一键导出 JSON 报告
- 🔧 **统一 CLI 子命令**：`count`、`estimate`、`encode`、`decode` 覆盖主要场景
- 📦 **Python 包**：`deepseek_tokenizer` 作为库导入，支持自定义模型路径
- 🎯 **快速估算模式**：无需加载模型即可获得大致 token 数
- 📊 **详细统计**：字符、中英文占比、行数、API 成本估算等
- 🌐 **多格式支持**：Markdown、TXT 以及其他纯文本扩展名

## 📦 安装

### 方式 1：开发模式 (推荐)

```bash
git clone <repo-url>
cd deepseek_v3_tokenizer
pip install -r requirements.txt
pip install -e .
```

### 方式 2：只运行 CLI

```bash
pip install -r requirements.txt
python src/deepseek_tokenizer/cli/main.py --help
```

## 🚀 快速开始

安装后可以直接使用 `deepseek-tokenizer` 命令（或通过 `python -m deepseek_tokenizer.cli.main`）：

```bash
# 查看帮助
deepseek-tokenizer --help

# 统计单个文件
deepseek-tokenizer count README.md

# 统计目录并导出 JSON 报告
deepseek-tokenizer count ./docs -o docs_report.json --detailed

# 快速估算（无需模型）
deepseek-tokenizer estimate README.md

# 编码 / 解码
deepseek-tokenizer encode "Hello, DeepSeek!"
deepseek-tokenizer decode "1,8906,2787,2"
```

更多示例请查看 `docs/overview/quickstart.md` 与 `docs/guides/examples.md`。

## 🧰 CLI 命令概览

| 命令 | 说明 | 关键参数 |
|------|------|----------|
| `count` | 使用 DeepSeek V3 模型精确统计 token | `path`, `-o/--output`, `-d/--detailed`, `-e/--extensions`, `--no-recursive`, `-m/--model` |
| `estimate` | 启发式 token 估算，速度快 | `path` |
| `encode` | 将文本编码成 token ids | `text`, `-m/--model`, `--show-tokens` |
| `decode` | 将 token ids 还原为文本 | `token_ids`, `-m/--model` |

详见 `docs/guides/cli.md`。

## 🐍 Python API

```python
from deepseek_tokenizer.core import DeepSeekTokenizer, TokenCounter
from deepseek_tokenizer.utils import SimpleEstimator

tokenizer = DeepSeekTokenizer(model_path="models/deepseek-v3")
ids = tokenizer.encode("Hello, world!")
text = tokenizer.decode(ids)

counter = TokenCounter(tokenizer)
file_stats = counter.count_file("README.md")
dir_stats = counter.count_directory("./docs", extensions=[".md"])
cost = counter.estimate_api_cost(file_stats["token_count"], price_per_1k=0.03)

estimate = SimpleEstimator.estimate_file("README.md")
```

完整 API 请参考 `docs/guides/api.md` 与 `docs/reference/output_schema.md`。

## 📚 文档导航

- 文档索引：`docs/README.md`
- 快速入门：`docs/overview/quickstart.md`
- CLI 指南：`docs/guides/cli.md`
- API 指南：`docs/guides/api.md`
- 示例集合：`docs/guides/examples.md`
- 配置说明：`docs/reference/configuration.md`
- 输出模式：`docs/reference/output_schema.md`
- 开发者文档：`docs/development/`
- 旧版脚本与文档：`docs/legacy/`, `docs/archive/README_legacy.md`

## 🧱 项目结构

```
deepseek_v3_tokenizer/
├── src/deepseek_tokenizer/        # CLI、核心逻辑和工具
│   ├── cli/main.py                # 统一入口 (count/estimate/encode/decode)
│   ├── core/                      # DeepSeekTokenizer / TokenCounter 等
│   └── utils/                     # SimpleEstimator、Formatter
├── docs/                          # 文档（用户指南、参考、开发、legacy）
├── configs/, models/              # 模型和配置文件
├── scripts/, examples/, tests/    # 辅助脚本与测试
├── README.md                      # 本文件
└── README_legacy → docs/archive/README_legacy.md
```

## 🤝 贡献

```bash
pip install -r requirements-dev.txt
pip install -e .
pytest
```

欢迎通过 Issue / PR 提交改进，详情见 `docs/development/contributing.md`。

## 📄 许可证

本项目采用 MIT License，详情参见 `LICENSE`。
