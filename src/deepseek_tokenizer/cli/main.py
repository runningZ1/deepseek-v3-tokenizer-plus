"""
统一的CLI命令行入口

提供count, estimate, encode等子命令
"""
import argparse
import json
import sys
from pathlib import Path

# 添加src目录到Python路径
src_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(src_dir))

from deepseek_tokenizer.core import DeepSeekTokenizer, TokenCounter
from deepseek_tokenizer.utils import SimpleEstimator, Formatter


def create_parser() -> argparse.ArgumentParser:
    """创建命令行解析器"""
    parser = argparse.ArgumentParser(
        prog='deepseek-tokenizer',
        description='DeepSeek V3 Tokenizer工具集 - 文本token统计和编码工具'
    )

    subparsers = parser.add_subparsers(dest='command', help='可用的子命令')

    # count命令 - 精确统计
    count_parser = subparsers.add_parser(
        'count',
        help='精确统计token数量(需要加载模型)'
    )
    count_parser.add_argument('path', help='文件或目录路径')
    count_parser.add_argument('-o', '--output', help='输出JSON文件路径')
    count_parser.add_argument('-d', '--detailed', action='store_true', help='显示详细信息')
    count_parser.add_argument('-m', '--model', default='models/deepseek-v3', help='模型路径')
    count_parser.add_argument('-e', '--extensions', nargs='+', default=['.md', '.txt'], help='文件扩展名')
    count_parser.add_argument('--no-recursive', action='store_true', help='不递归子目录')

    # estimate命令 - 快速估算
    estimate_parser = subparsers.add_parser(
        'estimate',
        help='快速估算token数量(无需加载模型,基于启发式规则)'
    )
    estimate_parser.add_argument('path', help='文件路径')

    # encode命令 - 编码文本
    encode_parser = subparsers.add_parser(
        'encode',
        help='编码文本为token IDs'
    )
    encode_parser.add_argument('text', help='要编码的文本')
    encode_parser.add_argument('-m', '--model', default='models/deepseek-v3', help='模型路径')
    encode_parser.add_argument('--show-tokens', action='store_true', help='显示每个token')

    # decode命令 - 解码token IDs
    decode_parser = subparsers.add_parser(
        'decode',
        help='解码token IDs为文本'
    )
    decode_parser.add_argument('token_ids', help='token IDs (用逗号分隔)')
    decode_parser.add_argument('-m', '--model', default='models/deepseek-v3', help='模型路径')

    return parser


def handle_count(args):
    """处理count命令"""
    print(f"正在初始化tokenizer...")

    try:
        tokenizer = DeepSeekTokenizer(args.model)
        counter = TokenCounter(tokenizer)
    except FileNotFoundError as e:
        print(f"❌ 错误: {e}", file=sys.stderr)
        sys.exit(1)

    path = Path(args.path)

    try:
        if path.is_file():
            print(f"正在统计文件: {path.name}")
            result = counter.count_file(args.path)
        elif path.is_dir():
            print(f"正在统计目录: {path}")
            result = counter.count_directory(
                args.path,
                extensions=args.extensions,
                recursive=not args.no_recursive
            )
        else:
            print(f"❌ 错误: 路径不存在: {args.path}", file=sys.stderr)
            sys.exit(1)

        # 输出结果
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"\n✓ 结果已保存至: {args.output}")
        else:
            print()
            Formatter.print_result(result, args.detailed)

    except Exception as e:
        print(f"❌ 错误: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


def handle_estimate(args):
    """处理estimate命令"""
    try:
        result = SimpleEstimator.estimate_file(args.path)

        print("=" * 60)
        print("📊 Token估算结果(快速模式)")
        print("=" * 60)
        print(f"文件: {result['file_name']}")
        print(f"估算Token数: {result['estimated_tokens']:,}")
        print(f"字符数: {result['character_count']:,}")
        print(f"单词数: {result['word_count']:,}")
        print(f"行数: {result['line_count']:,}")
        print(f"\n⚠️  {result['note']}")

    except Exception as e:
        print(f"❌ 错误: {e}", file=sys.stderr)
        sys.exit(1)


def handle_encode(args):
    """处理encode命令"""
    try:
        tokenizer = DeepSeekTokenizer(args.model)
        token_ids = tokenizer.encode(args.text)

        print("=" * 60)
        print("🔢 编码结果")
        print("=" * 60)
        print(f"原文: {args.text}")
        print(f"Token IDs: {token_ids}")
        print(f"Token数量: {len(token_ids)}")

        if args.show_tokens:
            print("\n详细Token:")
            for i, tid in enumerate(token_ids, 1):
                decoded = tokenizer.decode([tid])
                print(f"  {i}. [{tid}] -> '{decoded}'")

    except Exception as e:
        print(f"❌ 错误: {e}", file=sys.stderr)
        sys.exit(1)


def handle_decode(args):
    """处理decode命令"""
    try:
        # 解析token IDs
        token_ids = [int(x.strip()) for x in args.token_ids.split(',')]

        tokenizer = DeepSeekTokenizer(args.model)
        text = tokenizer.decode(token_ids)

        print("=" * 60)
        print("📝 解码结果")
        print("=" * 60)
        print(f"Token IDs: {token_ids}")
        print(f"解码文本: {text}")

    except ValueError:
        print("❌ 错误: Token IDs格式不正确,应为用逗号分隔的数字", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ 错误: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    """CLI主入口函数"""
    parser = create_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # 根据命令调用对应的处理函数
    handlers = {
        'count': handle_count,
        'estimate': handle_estimate,
        'encode': handle_encode,
        'decode': handle_decode,
    }

    handler = handlers.get(args.command)
    if handler:
        handler(args)
    else:
        print(f"❌ 未知命令: {args.command}", file=sys.stderr)
        parser.print_help()
        sys.exit(1)


if __name__ == '__main__':
    main()
