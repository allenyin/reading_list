#!/usr/bin/env python3
"""Create a new Eleventy post stub under _posts/.

Requires: pip install fire

Example::

    python make_stub.py --title "My title" --date 4/18/2026 --tags Notes,Linear_Algebra
    python make_stub.py --title "No tags" --date 2026-04-18
    python make_stub.py --title "Same again" --date 4/18/2026 --tags Notes --overwrite
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Sequence

import fire


def _slugify(title: str) -> str:
    s = title.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[-\s]+", "-", s)
    return s.strip("-") or "untitled"


def _parse_date(date_str: str) -> datetime:
    for fmt in ("%m/%d/%Y", "%Y-%m-%d", "%Y/%m/%d"):
        try:
            return datetime.strptime(date_str.strip(), fmt)
        except ValueError:
            continue
    raise ValueError(
        f"Unrecognized date format: {date_str!r}. "
        "Try e.g. 4/18/2026 or 2026-04-18."
    )


def _normalize_tags(tags: str | Sequence[str] | None) -> str:
    """Fire turns `--tags a,b` into a tuple; accept str or sequence of tag names."""
    if tags is None:
        return ""
    if isinstance(tags, (tuple, list)):
        return ",".join(str(t).strip() for t in tags if str(t).strip())
    return str(tags).strip()


def _tags_yaml(tags: str) -> str:
    if not tags or not tags.strip():
        return " []"
    parts = [t.strip() for t in tags.split(",") if t.strip()]
    if not parts:
        return " []"
    lines = "\n".join(f"- {t}" for t in parts)
    return f"\n{lines}"


def make_stub(
    title: str,
    date: str,
    tags: str | Sequence[str] = "",
    comments: bool = False,
    overwrite: bool = False,
    out_dir: str | None = None,
) -> str:
    """
    Create _posts/YYYY-MM-DD-slug.md with layout, title, date, comments, tags.

    Parameters
    ----------
    title : str
        Post title (used for filename slug).
    date : str
        Publication date, e.g. 4/18/2026 or 2026-04-18.
    tags : str or sequence
        Comma-separated tags (e.g. Notes,Education). Fire may pass a tuple.
    comments : bool
        Set comments: true in front matter (default false).
    overwrite : bool
        If true, replace an existing file with the same path (default false).
    out_dir : str, optional
        Override output directory (default: _posts next to this script).
    """
    root = Path(__file__).resolve().parent
    posts = Path(out_dir) if out_dir else root / "_posts"
    posts.mkdir(parents=True, exist_ok=True)

    dt = _parse_date(date)
    date_prefix = dt.strftime("%Y-%m-%d")
    slug = _slugify(title)
    filename = f"{date_prefix}-{slug}.md"
    path = posts / filename

    if path.exists() and not overwrite:
        raise FileExistsError(f"Refusing to overwrite existing file: {path}")

    tags_block = _tags_yaml(_normalize_tags(tags))
    comments_str = "true" if comments else "false"
    body = f"""---
layout: post
title: {json.dumps(title)}
date: {date_prefix}
comments: {comments_str}
tags:{tags_block}
---

"""

    path.write_text(body, encoding="utf-8")
    return str(path)


def main() -> None:
    fire.Fire(make_stub)


if __name__ == "__main__":
    try:
        main()
    except (FileExistsError, ValueError) as e:
        print(e, file=sys.stderr)
        sys.exit(1)
