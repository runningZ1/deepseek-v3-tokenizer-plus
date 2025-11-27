"""
批量处理示例

演示如何批量统计多个文件的token数量
"""
import sys
from pathlib import Path

src_dir = Path(__file__).parent.parent / "src"
sys.path.insert(0, str(src_dir))

from deepseek_tokenizer import DeepSeekTokenizer, TokenCounter


def main():
    print("=" * 60)
    print("批量处理示例")
    print("=" * 60)

    # 初始化
    tokenizer = DeepSeekTokenizer()
    counter = TokenCounter(tokenizer)

    # 批量统计文本
    print("\n1. 批量统计文本...")
    texts = [
        "Hello World",
        "你好世界",
        "DeepSeek V3 is powerful!",
        "这是一个测试文本"
    ]

    for i, text in enumerate(texts, 1):
        result = counter.count_text(text)
        print(f"   {i}. '{text}' -> {result['token_count']} tokens")

    # 统计目录(如果存在)
    print("\n2. 批量统计目录...")
    fixtures_dir = Path(__file__).parent.parent / "tests" / "fixtures"

    if fixtures_dir.exists():
        try:
            dir_result = counter.count_directory(
                str(fixtures_dir),
                extensions=['.md', '.txt']
            )

            print(f"\n   目录: {dir_result['directory']}")
            print(f"   文件数: {dir_result['total_files']}")
            print(f"   总Token数: {dir_result['summary']['total_tokens']:,}")
            print(f"   平均Token/文件: {dir_result['summary']['avg_tokens_per_file']:.1f}")

        except Exception as e:
            print(f"   错误: {e}")
    else:
        print(f"   目录不存在: {fixtures_dir}")

    print("\n" + "=" * 60)
    print("✓ 批量处理完成!")
    print("=" * 60)


if __name__ == "__main__":
    main()
