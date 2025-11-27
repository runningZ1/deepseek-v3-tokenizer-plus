"""
DeepSeek V3 Tokenizer核心封装模块
"""
from transformers import AutoTokenizer
from pathlib import Path
from typing import List, Optional
import os


class DeepSeekTokenizer:
    """DeepSeek V3 Tokenizer封装类

    提供简洁的API来使用DeepSeek V3模型的tokenization功能
    """

    def __init__(self, model_path: Optional[str] = None):
        """初始化tokenizer

        Args:
            model_path: 模型文件路径,支持绝对路径和相对路径
                       如果不指定,默认使用 "models/deepseek-v3"
        """
        if model_path is None:
            # 默认模型路径(相对于项目根目录)
            project_root = Path(__file__).parent.parent.parent.parent
            model_path = project_root / "models" / "deepseek-v3"

        self.model_path = Path(model_path)

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"模型路径不存在: {self.model_path}\n"
                f"请确保模型文件位于正确的位置"
            )

        self._tokenizer = None

    @property
    def tokenizer(self):
        """懒加载tokenizer

        只有在实际使用时才加载模型,节省内存
        """
        if self._tokenizer is None:
            print(f"正在加载tokenizer: {self.model_path}")
            self._tokenizer = AutoTokenizer.from_pretrained(
                str(self.model_path),
                trust_remote_code=True
            )
            print("✓ Tokenizer加载完成")
        return self._tokenizer

    def encode(self, text: str, add_special_tokens: bool = True) -> List[int]:
        """编码文本为token IDs

        Args:
            text: 要编码的文本
            add_special_tokens: 是否添加特殊token(如BOS, EOS)

        Returns:
            token IDs列表

        Example:
            >>> tokenizer = DeepSeekTokenizer()
            >>> ids = tokenizer.encode("Hello World")
            >>> print(ids)
            [1, 8906, 2787, 2]
        """
        return self.tokenizer.encode(text, add_special_tokens=add_special_tokens)

    def decode(self, token_ids: List[int], skip_special_tokens: bool = True) -> str:
        """解码token IDs为文本

        Args:
            token_ids: token IDs列表
            skip_special_tokens: 是否跳过特殊token

        Returns:
            解码后的文本

        Example:
            >>> tokenizer = DeepSeekTokenizer()
            >>> text = tokenizer.decode([1, 8906, 2787, 2])
            >>> print(text)
            "Hello World"
        """
        return self.tokenizer.decode(token_ids, skip_special_tokens=skip_special_tokens)

    def count_tokens(self, text: str) -> int:
        """统计文本的token数量

        Args:
            text: 要统计的文本

        Returns:
            token数量

        Example:
            >>> tokenizer = DeepSeekTokenizer()
            >>> count = tokenizer.count_tokens("Hello World")
            >>> print(count)
            4
        """
        return len(self.encode(text))

    def batch_encode(self, texts: List[str]) -> List[List[int]]:
        """批量编码多个文本

        Args:
            texts: 文本列表

        Returns:
            token IDs列表的列表

        Example:
            >>> tokenizer = DeepSeekTokenizer()
            >>> results = tokenizer.batch_encode(["Hello", "World"])
            >>> print(results)
            [[1, 8906, 2], [1, 2787, 2]]
        """
        return [self.encode(text) for text in texts]

    def batch_count_tokens(self, texts: List[str]) -> List[int]:
        """批量统计多个文本的token数量

        Args:
            texts: 文本列表

        Returns:
            token数量列表

        Example:
            >>> tokenizer = DeepSeekTokenizer()
            >>> counts = tokenizer.batch_count_tokens(["Hello", "World"])
            >>> print(counts)
            [3, 3]
        """
        return [self.count_tokens(text) for text in texts]
