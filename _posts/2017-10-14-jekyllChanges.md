---
layout: post
title: "More Jekyll and CSS"
date: 2017-10-14
comments: false
tags: [jekyll, webdev]
---

Github's gh-pages have updated to use [rouge](https://github.com/jneen/rouge), a pure ruby-based syntax highlighter. I have had enough with the build-failure emails because I have been using the Python highlighter pygment. Time to upgrade.

**Installing Ruby**
My Ubuntu machine was outdated and according to [github](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/), I should have `Ruby 2.x.x` rather than staying at my 1.9.

Installed the ruby version manager -- [rvm](https://github.com/rvm/ubuntu_rvm), and followed the instructions on the github page. Had a strange permission error [https://github.com/bundler/bundler/issues/5211] during `bundle install`, solved it finally by deleting the offending directory.

Basic syntax highlighting using the fenced-code blocks can be achieved following instructions [here](https://benhur07b.github.io/2017/03/25/add-syntax-highlighting-to-your-jekyll-site-with-rouge.html), however, enabling line numbers requires using the 

{% raw %}
`{% highlight language linenos %}`
{% endraw %} 

tag, which is not consistent with the custom rouge syntax highlighting themes out of the box. Required a bunch of CSS stylings to get them to work. In the following steps `/myjekyll` represents the path to my jekyll site's root directory.

1. All my css style sheets are in the directory `/myjekyll/css`. In my `/myjekyll/_includes/header.html` file, the syntax highlighting stylesheet is included as `syntax.css`. I did 

    ```
    rougify style monokai > /myjekyll/css/syntax.css
    ```
  This will give me good looking fenced code blocks with monokai theme, but the syntax highlighting and line number will be completely screwed up. Specifically, the text colors will be that of the default highlighting theme.

2. In the new `syntax.css` stylesheet, we have the following:

   ``` css
   .highlight {
     color: #f8f8f2;
     background-color: #49483e;
   }
   ```
   
   We want to have the code blocks to be consistent with these colors. Inspecting the code block elements allow us to set the appropriate css properties. Notably, the highlighted code-block with line numbers is implemented as a table, one td for the line numbers, and one td for the code. I added the following into my `/myjekyll/css/theme.css` file (or whatever other stylesheet that's included in your header)
   
   {% highlight css linenos %}
   /* Syntax highlighting for monokai -- see syntax.css */
   .highlight pre,
   .highlight .table 
   {
       border: box;
       border-radius: 0px;
       border-collapse: collapse;
       padding-top: 0;
       padding-bottom: 0;
   }
   
   .highlight table td { 
       padding: 0px; 
       background-color: #49483e; 
       color: #f8f8f2;
       margin: 0px;
   }
   
   /* Border to the right of the line numbers */
   .highlight td.gutter {
       border-right: 1px solid white;
   }
   
   .highlight table pre { 
       margin: 0;
       background-color: #49483e; 
       color: #f8f8f2;
   }
   
   .highlight pre {
       background-color: #49483e; 
       color: #f8f8f2;
       border: 0px;    /* no border between cells! */
   }
   
   /* The code box extend the entire code block */
   .highlight table td.code {
       width: 100%;
   } 
   {% endhighlight %}

{:start="3"}
3. The fenced code-block by default wraps a long line instead of creating a horizontal scrollbar, unlike using the highlight tag. According to [the internet](https://stackoverflow.com/questions/36612856/prevent-line-wraps-of-code-blocks-using-jekyll-kramdown-and-rouge), this can be done by adding to the style sheet:

    ``` css
    /* fence-block style highlighting */
    pre code {
        white-space: pre;
    }
    ```

4. One last modification for in-line code highlighting:

    ``` css
    /* highlighter-rouge */
    code.highlighter-rouge {
        background-color: #f8f8f8;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 0 0.5em;
        color: #d14;
    }
    ```

5. A final thing that is broken about the 

    {% raw %}
    `{% highlight %}`
    {% endraw %}

     tag is that using it inside a list will break the list. In this post, all items after the list with line numbers have started their number all over agian. According to [the ticket here](https://github.com/jekyll/jekyll/issues/588), there is no easy solution to this because it is related to the kramdown parser. Using different indentation (3 spaces or 4 spaces) in list items does not change. Some imperfect solutions are suggested [here](https://stackoverflow.com/questions/35858704/jekyll-kramdown-code-in-ordered-list-number-reset#41917631) and [here](https://stackoverflow.com/questions/17995467/how-can-i-put-a-liquid-tag-highlight-in-an-ordered-list). None can fix the indentation problem. But, by placing 

    {% raw %} 
    `{:start="3"}` 
    {% endraw %}

    one line before my third list item allows the following items to have the correct numbering.
