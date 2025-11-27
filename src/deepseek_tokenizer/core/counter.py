"""
Token统计功能模块
"""
from typing import Dict, Any, List, Optional
from pathlib import Path
from .tokenizer import DeepSeekTokenizer


class TokenCounter:
    """Token计数器

    提供文件和目录的token统计功能
    """

    def __init__(self, tokenizer: DeepSeekTokenizer):
        """初始化计数器

        Args:
            tokenizer: DeepSeekTokenizer实例
        """
        self.tokenizer = tokenizer

    def count_text(self, text: str) -> Dict[str, Any]:
        """统计文本的详细信息

        Args:
            text: 输入文本

        Returns:
            包含各种统计信息的字典

        Example:
            >>> tokenizer = DeepSeekTokenizer()
            >>> counter = TokenCounter(tokenizer)
            >>> result = counter.count_text("Hello World")
            >>> print(result['token_count'])
            4
        """
        token_ids = self.tokenizer.encode(text)

        # 统计中英文字符
        chinese_chars = len([c for c in text if ord(c) > 127])
        english_chars = len([c for c in text if ord(c) < 127])

        return {
            "token_count": len(token_ids),
            "character_count": len(text),
            "word_count": len(text.split()),
            "line_count": text.count('\n') + 1,
            "chinese_chars": chinese_chars,
            "english_chars": english_chars,
            "chinese_ratio": chinese_chars / len(text) if len(text) > 0 else 0,
        }

    def count_file(self, file_path: str, encoding: str = 'utf-8') -> Dict[str, Any]:
        """统计单个文件的token信息

        Args:
            file_path: 文件路径
            encoding: 文件编码,默认utf-8

        Returns:
            文件token统计信息

        Example:
            >>> counter = TokenCounter(tokenizer)
            >>> result = counter.count_file("document.md")
            >>> print(f"文件有 {result['token_count']} 个tokens")
        """
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"文件不存在: {file_path}")

        try:
            with open(path, 'r', encoding=encoding) as f:
                content = f.read()
        except UnicodeDecodeError:
            # 尝试其他编码
            with open(path, 'r', encoding='gbk') as f:
                content = f.read()

        result = self.count_text(content)
        result["file_path"] = str(path.absolute())
        result["file_name"] = path.name
        result["file_size_bytes"] = path.stat().st_size
        result["file_size_kb"] = path.stat().st_size / 1024

        return result

    def count_directory(
        self,
        dir_path: str,
        extensions: Optional[List[str]] = None,
        recursive: bool = True
    ) -> Dict[str, Any]:
        """统计目录中所有文件的token信息

        Args:
            dir_path: 目录路径
            extensions: 要统计的文件扩展名列表,默认为['.md', '.txt']
            recursive: 是否递归子目录,默认True

        Returns:
            目录统计信息

        Example:
            >>> counter = TokenCounter(tokenizer)
            >>> result = counter.count_directory("./docs")
            >>> print(f"总共 {result['summary']['total_tokens']} 个tokens")
        """
        if extensions is None:
            extensions = ['.md', '.txt', '.markdown']

        path = Path(dir_path)

        if not path.exists():
            raise FileNotFoundError(f"目录不存在: {dir_path}")

        if not path.is_dir():
            raise ValueError(f"路径不是目录: {dir_path}")

        results = []
        pattern = '**/*' if recursive else '*'

        for ext in extensions:
            for file_path in path.glob(f'{pattern}{ext}'):
                if file_path.is_file():
                    try:
                        file_result = self.count_file(str(file_path))
                        results.append(file_result)
                        print(f"✓ {file_path.name}: {file_result['token_count']} tokens")
                    except Exception as e:
                        print(f"✗ 处理失败 {file_path.name}: {e}")

        summary = self._calculate_summary(results)

        return {
            "directory": str(path.absolute()),
            "total_files": len(results),
            "extensions": extensions,
            "recursive": recursive,
            "files": results,
            "summary": summary
        }

    def _calculate_summary(self, results: List[Dict]) -> Dict[str, Any]:
        """计算汇总统计信息

        Args:
            results: 文件统计结果列表

        Returns:
            汇总统计字典
        """
        if not results:
            return {
                "total_tokens": 0,
                "total_characters": 0,
                "total_words": 0,
                "total_lines": 0,
                "avg_tokens_per_file": 0,
                "avg_chars_per_token": 0,
            }

        total_tokens = sum(r["token_count"] for r in results)
        total_chars = sum(r["character_count"] for r in results)

        return {
            "total_tokens": total_tokens,
            "total_characters": total_chars,
            "total_words": sum(r["word_count"] for r in results),
            "total_lines": sum(r["line_count"] for r in results),
            "total_chinese_chars": sum(r["chinese_chars"] for r in results),
            "avg_tokens_per_file": total_tokens / len(results),
            "avg_chars_per_token": total_chars / total_tokens if total_tokens > 0 else 0,
        }

    def estimate_api_cost(
        self,
        token_count: int,
        price_per_1k: float = 0.03
    ) -> float:
        """估算API成本

        Args:
            token_count: token数量
            price_per_1k: 每1000 tokens的价格(美元)

        Returns:
            估算成本(美元)

        Example:
            >>> counter = TokenCounter(tokenizer)
            >>> cost = counter.estimate_api_cost(1500, 0.03)
            >>> print(f"成本: ${cost:.4f}")
            成本: $0.0450
        """
        return (token_count / 1000) * price_per_1k
