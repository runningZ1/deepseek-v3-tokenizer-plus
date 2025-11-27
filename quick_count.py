#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
快速统计文件 Token 数量
只需修改下面的文件路径，然后运行即可！
"""

# ============================================================
# 👇 在这里修改你要统计的文件路径
# ============================================================
FILE_PATH = "README.md"  # 修改为你的文件路径，例如: r"C:\Users\user\Documents\myfile.txt"


# ============================================================
# 以下代码无需修改，直接运行即可
# ============================================================
from deepseek_tokenizer import DeepSeekTokenizer

def main():
    print("="*60)
    print("🚀 DeepSeek Token 快速统计工具")
    print("="*60)
    print(f"\n正在统计文件: {FILE_PATH}\n")

    try:
        # 初始化 tokenizer
        tokenizer = DeepSeekTokenizer()

        # 读取文件内容
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()

        # 统计基本信息
        token_count = tokenizer.count_tokens(content)
        char_count = len(content)
        line_count = len(content.splitlines())
        word_count = len(content.split())

        # 统计中英文字符
        chinese_chars = len([c for c in content if ord(c) > 127])
        english_chars = char_count - chinese_chars

        # 显示结果
        print("="*60)
        print("📊 统计结果")
        print("="*60)
        print(f"文件路径: {FILE_PATH}")
        print(f"Token 数量: {token_count:,}")
        print(f"字符总数: {char_count:,}")
        print(f"单词数量: {word_count:,}")
        print(f"行数: {line_count:,}")
        print(f"中文字符: {chinese_chars:,} ({chinese_chars/char_count*100:.1f}%)")
        print(f"英文字符: {english_chars:,} ({english_chars/char_count*100:.1f}%)")
        print(f"文件大小: {char_count/1024:.2f} KB")

        # API 成本估算（参考价格）
        print("\n💰 API 成本估算（仅供参考）:")
        print(f"  GPT-4: ${(token_count/1000)*0.03:.4f}")
        print(f"  GPT-3.5: ${(token_count/1000)*0.002:.4f}")
        print(f"  DeepSeek: ${(token_count/1000)*0.001:.4f}")

        print("\n" + "="*60)
        print("✅ 统计完成！")
        print("="*60)

    except FileNotFoundError:
        print(f"❌ 错误: 找不到文件 '{FILE_PATH}'")
        print("   请检查文件路径是否正确")
    except Exception as e:
        print(f"❌ 发生错误: {e}")

if __name__ == "__main__":
    main()
