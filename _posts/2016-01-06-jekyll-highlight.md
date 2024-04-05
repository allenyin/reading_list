---
layout: post
title: "Solving jekyll highlight line numbers"
date: 2016-01-06
comments: false
tags:
- jekyll
- webdev
---

[This](http://flanneljesus.github.io/jekyll/2014-08-30/solving-jekyll-highlight-linenos/) helps a lot. Finally got the syntax higlighting and line numbers to work.

**Update: 2/1/2016**

Apparently jekyll (written in ruby)'s default highlighter has changed to rouge, because pygments was written in Python and they think it's too slow to use a ruby wrapper for it.

This means github pages is also using rouge as the default highlighter, which unfortunately [does not support assembly](https://github.com/jneen/rouge/wiki/List-of-supported-languages-and-lexers). So now all my assembly code snippets are just gray..and the code table is broken, now there is an extra gray box around the actual code box. Too much webdev, maybe fix later.


