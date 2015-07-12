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

```html
---
layout: tagpage
tag: my_new_tag
---
```

This means we need to create the layout `_layouts/tagpage.html`:

```html
---
layout: default
---
<div class="well">
    <h1>{{ page.tag }}</h1>
    <ul>
        {% for post in site.tags[page.tag] %}
        <li>
            <a href="{{ site.baseurl}}{{ post.url }}">{{ post.date | date: "%b %-d, %Y" }} - {{ post.title }}</a>
        </li>
        {% endfor %}
    </ul>
</div>
```
At this point, Jekyll will have generated a separate page for our newly created tag at `/tags/my_new_tag.html`.

---
To generate the single page that lists posts associated with all tags, we create `alltags.html`:

```html
---
layout: default
---
<div class="well">
{% capture tags %}
    {% for tag in site.tags %}
        {{ tag[0] }}
    {% endfor %}
{% endcapture %}
{% assign sortedtags = tags | split:' ' | sort %}
{% for tag in sortedtags %}
    <h3>{{ tag }}</h3>
    <ul>
        {% for post in site.tags[tag] %}
        <li>
            <a href="{{ site.baseurl}}{{ post.url }}">{{ post.date | date: "%b %-d, %Y" }} - {{ post.title }}</a>
        </li>
        {% endfor %}
    </ul>
{% endfor %}
</div>
```
Note the tags will be displayed in alphabetical order.

---
I also want to show, for each individual post, its asssociated tags. This is done by including `_includes/tag_line.html` in `_layouts/post.html`: 

```html
<p>
<small>
    tags:
    {% for tag in page.tags %}
        {% if forloop.last %}
        <span><a href="{{ site.baseurl }}/tags/{{ tag }}.html">{{ tag }}</a></span>
        {% else %}
        <span><a href="{{ site.baseurl }}/tags/{{ tag }}.html">{{ tag }},</a></span>
        {% endif %}
    {% endfor %}
</small>
</p>
```

---
Finally, I want a list of tags that link me to their separate link pagei (e.g. this site's sidebar). That's what `alltags.html` is for:

```html
---
layout: default
---
<div class="well">
{% capture tags %}
    {% for tag in site.tags %}
        {{ tag[0] }}
    {% endfor %}
{% endcapture %}
{% assign sortedtags = tags | split:' ' | sort %}
{% for tag in sortedtags %}
    <h3>{{ tag }}</h3>
    <ul>
        {% for post in site.tags[tag] %}
        <li>
            <a href="{{ site.baseurl}}{{ post.url }}">{{ post.date | date: "%b %-d, %Y" }} - {{ post.title }}</a>
        </li>
        {% endfor %}
    </ul>
{% endfor %}
</div>
```

I know, some code duplication. But minimal work is minimal.
