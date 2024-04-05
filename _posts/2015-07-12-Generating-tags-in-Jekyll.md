---
layout: post
title: "Generating tags in Jekyll"
date: 2015-07-12
comments: false
tags:
- github-pages
- jekyll
- webdev
---
This site is meant to be a collection of my readings - book chapters, web articles, academic papers, etc. As such, convenient tagging is crucial. While Jekyll offers a minimalistic and fast static-site generation and convenient hosting on github-pages, it has minimal tagging support. 

Requirements:
============
* Minimal effort initiating a new tag.
* Automatic generation of a single tag page that lists posts associated with all available tags.
* Automatic generation of separate pages associated with different tags.

There have been a few posts online about how to do this: [Charlie Park](http://charliepark.org/tags-in-jekyll/), [Christian Specht](http://christianspecht.de/2014/10/25/separate-pages-per-tag-category-with-jekyll-without-plugins/). The latter comes very close to what I needed, upon which I based my [implementation](https://github.com/allenyin/reading_list).

Implementation:
==============
The general approach is, whenever a new tag is created (e.g. entered into the "tags" field of a post's YAML front-matter), we need to create a `tags/my_new_tag.html` file with the following content:

{% highlight html %}
---
layout: tagpage
tag: my_new_tag
---
{% endhighlight %}

This means we need to create the layout [_layouts/tagpage.html](https://github.com/allenyin/reading_list/blob/gh-pages/_layouts/tagpage.html).

At this point, Jekyll will have generated a separate page for our newly created tag at `/tags/my_new_tag.html`.

To generate the single page that lists posts associated with all tags, we create [alltags.html](https://github.com/allenyin/reading_list/blob/gh-pages/alltags.html). Note the tags will be displayed in alphabetical order.

I also want to show, for each individual post, its asssociated tags. This is done by including [\_includes/tag_line.html](https://github.com/allenyin/reading_list/blob/gh-pages/_includes/tag_line.html) in [_layouts/post.html](https://github.com/allenyin/reading_list/blob/gh-pages/_layouts/post.html).

