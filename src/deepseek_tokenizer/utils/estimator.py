"""
无依赖的Token估算器

当transformers库不可用时,使用启发式规则快速估算token数量
"""
from pathlib import Path
from typing import Dict, Any


class SimpleEstimator:
    """简单Token估算器(无需transformers库)

    使用启发式规则估算token数量:
    - 英文字符: 1 token ≈ 4 字符
    - 中文字符: 1 token ≈ 2 字符
    - 标点符号: 1 token ≈ 1 符号
    """

    @staticmethod
    def estimate_tokens(text: str) -> int:
        """估算文本的token数量

        Args:
            text: 要估算的文本

        Returns:
            估算的token数量

        Example:
            >>> count = SimpleEstimator.estimate_tokens("Hello 世界")
            >>> print(count)
            4
        """
        if not text:
            return 0

        # 分类字符
        english_chars = 0
        chinese_chars = 0
        punctuation = 0

        for char in text:
            code = ord(char)
            if code < 127:  # ASCII字符
                if char.isalnum():
                    english_chars += 1
                elif not char.isspace():
                    punctuation += 1
            else:  # 非ASCII字符(主要是中文)
                chinese_chars += 1

        # 使用启发式规则估算
        estimated_tokens = (
            english_chars // 4 +  # 英文
            chinese_chars // 2 +  # 中文
            punctuation // 2      # 标点
        )

        return max(estimated_tokens, 1)  # 至少1个token

    @staticmethod
    def estimate_file(file_path: str, encoding: str = 'utf-8') -> Dict[str, Any]:
        """估算文件的token数量

        Args:
            file_path: 文件路径
            encoding: 文件编码

        Returns:
            估算结果字典

        Example:
            >>> result = SimpleEstimator.estimate_file("document.md")
            >>> print(f"估算: {result['estimated_tokens']} tokens")
        """
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"文件不存在: {file_path}")

        try:
            with open(path, 'r', encoding=encoding) as f:
                text = f.read()
        except UnicodeDecodeError:
            with open(path, 'r', encoding='gbk') as f:
                text = f.read()

        estimated_tokens = SimpleEstimator.estimate_tokens(text)

        # 统计字符分布
        chinese_chars = len([c for c in text if ord(c) > 127])
        english_chars = len([c for c in text if ord(c) < 127])

        return {
            "file_path": str(path.absolute()),
            "file_name": path.name,
            "estimated_tokens": estimated_tokens,
            "character_count": len(text),
            "word_count": len(text.split()),
            "line_count": text.count('\n') + 1,
            "chinese_chars": chinese_chars,
            "english_chars": english_chars,
            "method": "heuristic_estimation",
            "note": "这是基于启发式规则的粗略估算,实际token数可能有偏差"
        }

    @staticmethod
    def compare_with_actual(estimated: int, actual: int) -> Dict[str, Any]:
        """比较估算值和实际值

        Args:
            estimated: 估算的token数
            actual: 实际的token数

        Returns:
            比较结果

        Example:
            >>> result = SimpleEstimator.compare_with_actual(100, 95)
            >>> print(f"误差: {result['error_percentage']:.1f}%")
        """
        error = abs(estimated - actual)
        error_percentage = (error / actual * 100) if actual > 0 else 0

        return {
            "estimated": estimated,
            "actual": actual,
            "error": error,
            "error_percentage": error_percentage,
            "accuracy": 100 - error_percentage
        }
