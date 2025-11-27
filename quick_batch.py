#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
快速批量统计目录中的文件 Token 数量
只需修改下面的目录路径，然后运行即可！
"""

# ============================================================
# 👇 在这里修改你的配置
# ============================================================
DIRECTORY_PATH = "./examples"  # 要统计的目录路径，例如: r"C:\Users\user\Documents\myproject"
FILE_PATTERN = "*.py"          # 文件匹配模式，例如: "*.md", "*.txt", "*.py" 等
RECURSIVE = True               # 是否递归处理子目录: True 或 False


# ============================================================
# 以下代码无需修改，直接运行即可
# ============================================================
from pathlib import Path
from deepseek_tokenizer import DeepSeekTokenizer

def main():
    print("="*60)
    print("🚀 DeepSeek Token 批量统计工具")
    print("="*60)
    print(f"\n目录路径: {DIRECTORY_PATH}")
    print(f"文件模式: {FILE_PATTERN}")
    print(f"递归模式: {'是' if RECURSIVE else '否'}\n")

    try:
        # 初始化 tokenizer
        tokenizer = DeepSeekTokenizer()
        directory = Path(DIRECTORY_PATH)

        # 查找文件
        if RECURSIVE:
            files = list(directory.rglob(FILE_PATTERN))
        else:
            files = list(directory.glob(FILE_PATTERN))

        if not files:
            print(f"❌ 未找到匹配的文件")
            return

        print(f"找到 {len(files)} 个文件\n")
        print("="*60)

        # 统计每个文件
        results = []
        total_tokens = 0
        total_chars = 0

        for file_path in files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                token_count = tokenizer.count_tokens(content)
                char_count = len(content)

                results.append({
                    'path': str(file_path),
                    'tokens': token_count,
                    'chars': char_count,
                    'size_kb': char_count / 1024
                })

                total_tokens += token_count
                total_chars += char_count

                print(f"✅ {file_path.name}")
                print(f"   Token: {token_count:,} | 字符: {char_count:,} | 大小: {char_count/1024:.2f}KB")

            except Exception as e:
                print(f"❌ {file_path.name}: 读取失败 ({e})")

        # 显示汇总
        print("\n" + "="*60)
        print("📊 统计汇总")
        print("="*60)
        print(f"文件总数: {len(results)}")
        print(f"Token 总数: {total_tokens:,}")
        print(f"字符总数: {total_chars:,}")
        print(f"平均每文件: {total_tokens//len(results) if results else 0:,} tokens")
        print(f"总大小: {total_chars/1024:.2f} KB")

        # API 成本估算
        print("\n💰 API 成本估算（仅供参考）:")
        print(f"  GPT-4: ${(total_tokens/1000)*0.03:.4f}")
        print(f"  GPT-3.5: ${(total_tokens/1000)*0.002:.4f}")
        print(f"  DeepSeek: ${(total_tokens/1000)*0.001:.4f}")

        # Token 最多的文件 Top 5
        if len(results) > 1:
            print("\n📈 Token 数最多的文件 (Top 5):")
            sorted_results = sorted(results, key=lambda x: x['tokens'], reverse=True)[:5]
            for i, item in enumerate(sorted_results, 1):
                print(f"  {i}. {Path(item['path']).name}: {item['tokens']:,} tokens")

        print("\n" + "="*60)
        print("✅ 统计完成！")
        print("="*60)

    except FileNotFoundError:
        print(f"❌ 错误: 找不到目录 '{DIRECTORY_PATH}'")
        print("   请检查目录路径是否正确")
    except Exception as e:
        print(f"❌ 发生错误: {e}")

if __name__ == "__main__":
    main()
