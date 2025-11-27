"""
基础使用示例

演示如何使用DeepSeek Tokenizer进行基本的token操作
"""
import sys
from pathlib import Path

# 添加src目录到路径
src_dir = Path(__file__).parent.parent / "src"
sys.path.insert(0, str(src_dir))

from deepseek_tokenizer import DeepSeekTokenizer, TokenCounter


def main():
    print("=" * 60)
    print("DeepSeek Tokenizer 基础使用示例")
    print("=" * 60)

    # 1. 初始化tokenizer
    print("\n1. 初始化tokenizer...")
    tokenizer = DeepSeekTokenizer()

    # 2. 编码文本
    print("\n2. 编码文本...")
    text = "Hello, DeepSeek! 你好,世界!"
    token_ids = tokenizer.encode(text)
    print(f"   原文: {text}")
    print(f"   Token IDs: {token_ids}")
    print(f"   Token数量: {len(token_ids)}")

    # 3. 解码token
    print("\n3. 解码token...")
    decoded_text = tokenizer.decode(token_ids)
    print(f"   解码结果: {decoded_text}")

    # 4. 统计token数量
    print("\n4. 统计token数量...")
    count = tokenizer.count_tokens(text)
    print(f"   Token数: {count}")

    # 5. 使用TokenCounter统计详细信息
    print("\n5. 使用TokenCounter统计详细信息...")
    counter = TokenCounter(tokenizer)
    result = counter.count_text(text)
    print(f"   Token数: {result['token_count']}")
    print(f"   字符数: {result['character_count']}")
    print(f"   单词数: {result['word_count']}")
    print(f"   中文字符: {result['chinese_chars']}")
    print(f"   英文字符: {result['english_chars']}")

    # 6. 统计文件
    print("\n6. 统计测试文件...")
    test_file = Path(__file__).parent.parent / "tests" / "fixtures" / "sample.md"
    if test_file.exists():
        file_result = counter.count_file(str(test_file))
        print(f"   文件: {file_result['file_name']}")
        print(f"   Token数: {file_result['token_count']}")
        print(f"   文件大小: {file_result['file_size_kb']:.2f} KB")
    else:
        print(f"   测试文件不存在: {test_file}")

    print("\n" + "=" * 60)
    print("✓ 示例运行完成!")
    print("=" * 60)


if __name__ == "__main__":
    main()
