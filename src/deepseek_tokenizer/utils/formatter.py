"""
输出格式化工具
"""
import json
from typing import Dict, Any


class Formatter:
    """输出格式化器"""

    @staticmethod
    def format_result(result: Dict[str, Any], detailed: bool = False) -> str:
        """格式化统计结果为可读文本

        Args:
            result: 统计结果字典
            detailed: 是否显示详细信息

        Returns:
            格式化后的文本
        """
        lines = []
        lines.append("=" * 60)
        lines.append("📊 Token统计结果")
        lines.append("=" * 60)

        if "file_path" in result:
            # 单文件结果
            lines.append(f"文件: {result.get('file_name', result['file_path'])}")
            lines.append(f"Token数: {result['token_count']:,}")
            lines.append(f"字符数: {result['character_count']:,}")
            lines.append(f"单词数: {result['word_count']:,}")
            lines.append(f"行数: {result['line_count']:,}")

            if detailed and 'chinese_chars' in result:
                total_chars = result['character_count']
                chinese_chars = result['chinese_chars']
                lines.append(f"中文字符: {chinese_chars:,} ({chinese_chars/total_chars*100:.1f}%)")

        elif "directory" in result:
            # 目录结果
            lines.append(f"目录: {result['directory']}")
            lines.append(f"文件数: {result['total_files']}")
            lines.append(f"扩展名: {', '.join(result['extensions'])}")
            lines.append("")
            lines.append("汇总统计:")
            summary = result['summary']
            lines.append(f"  总Token数: {summary['total_tokens']:,}")
            lines.append(f"  总字符数: {summary['total_characters']:,}")
            lines.append(f"  总单词数: {summary['total_words']:,}")
            lines.append(f"  总行数: {summary['total_lines']:,}")
            lines.append(f"  平均Token/文件: {summary['avg_tokens_per_file']:.1f}")

            if detailed and result['files']:
                lines.append("")
                lines.append("文件详情:")
                for file_result in result['files']:
                    lines.append(f"  {file_result['file_name']}: {file_result['token_count']:,} tokens")

        return "\n".join(lines)

    @staticmethod
    def to_json(result: Dict[str, Any], indent: int = 2) -> str:
        """将结果转换为JSON格式

        Args:
            result: 统计结果字典
            indent: JSON缩进空格数

        Returns:
            JSON字符串
        """
        return json.dumps(result, indent=indent, ensure_ascii=False)

    @staticmethod
    def print_result(result: Dict[str, Any], detailed: bool = False):
        """打印格式化的结果

        Args:
            result: 统计结果字典
            detailed: 是否显示详细信息
        """
        print(Formatter.format_result(result, detailed))
