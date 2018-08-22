---
layout: post
title: "Latex biblography tricks"
date: 2018-08-22
comments: false
tags:
- Notes
- Latex
- Bibtex
---

Writing my dissertation I chose to use Latex because it makes everything looks good, I can stay in Vim, type math easily, and don't have to deal with an actual Word-like processor's abysmal load speed when I'm writing 100+ pages. At the same time, some things that should be very easy took forever to figure out.

**Problem**

In addition to the bibliography of the actual dissertation chapters itself, I need to append a list of my own publications in the biography section (last "chapter" of the entire document), formatted like a proper bibliography section. Why biography? So future readers would known which John Smith you are, of course!

This is difficult for several reasons.

The top level `dissertation.tex` is something like

```latex
\documentclass[]{dissertation}
% Package setup, blabla
\begin{document}
\tableofcontents
\listoftables
\listoffigures
\include{{./Chapter1/ch1.tex}}                 % Separate tex-file and folder for other chapters
\include{{./Chapter2/ch2.tex}}
% \include for all the chapters
% Now in the end insert a single bibliography for all the chapters
\bibliographystyle{myStyle}                     % uses style defined in myStyle.bst
\addcontentsline{toc}{chapter}{Bibliography}    % Add it as a section in table of content
\bibliography{dissertation_bib_file}            % link to the bib file 
\include{{./Biography/biography}}
\end{document}
```
    
If I were using word, I might just copy and paste some formatted lines to the end of the page and call it a day. But since I am a serious academic and want to do this the right away...it poses a slight struggle. I need to make bibtex format my publications and insert it at the end during the compile process. My requirements:

1) I don't want the publication list to start with a "Reference" section heading like typical `\bibliography{bib_file}` commands produce.

2) I want the items in the publication list to be in reverse chronological order, from most recent to least.

3) I want to allow my publication list to be separate from the main bibliography section -- an item can appear in both places, but they should have the same numbering.

**Approach 1**

Created a separate bibtex file `mypub.bib`, then inserted the following lines in `biography.tex`:

```latex
\nocite{*}                      % needed to show all the items in the bib-file. 
                                % Otherwise only those called with \cite{}
\bibliographystyle{myStyle}     % uses style defined in myStyle.bst
\bibliography{mypub}            % link to second bib file 
```

I don't remember the exact behavior, but it either

1) Gives error, pdflatex tells me I can't call `\bibliography` in multiple places. Or
2) Insert the entire dissertation's bibliography after the biography section.

Neither is desirable.

**Approach 2**

Searching this problem online, you run across people wanting to 

1) Have a bibliography section for each chapter
2) Divide biblography into nonoverlapping sets, such as journals, conference proceedings, etc.

Don't want those. Finally found this SO post [How to use multibib in order to insert a second bibliography as a part of an annex?](https://tex.stackexchange.com/a/285306), which other than suggesting using multibib, also mentions biblatex would make everything a lot easier. But that required me to change the other chapters a bit. Also the manual to [multibib](https://mirror.hmc.edu/ctan/macros/latex/contrib/multibib/multibib.pdf).

So new approach, in `dissertation.tex`:

```latex
% preamble stuff
\usepackage{multibib}
\newcites{pub}{headingTobeRemoved}  % create a new bib part called 'pub' with heading 'headingTobeRemoved`
\begin{document}
% all the chapter includes
% Now in the end insert a single bibliography for all the chapters
\bibliographystyle{myStyle}                     % uses style defined in myStyle.bst
\addcontentsline{toc}{chapter}{Bibliography}    % Add it as a section in table of content
\bibliography{dissertation_bib_file}            % link to the bib file 
\include{{./Biography/biography}}
\end{document}
```

In `biography.tex`:

```latex
Blablabla memememememe
\nocitepub{*}
\bibliographystylepub{myStyle}
\bibliographypub{mypub}
```

Really important in the second reference section to use `\nocitepub`, `\bibliographystylepub`, and `\bibliographypub` such that it matches the name of the `\newcites` group.

Also important to run the following,

```
pdflatex dissertation.tex
bibtex disseration.aux
bibtex pub.aux
pdflatex dissertation.tex
pdflatex dissertation.tex
```

where `dissertation.aux` contains the bib-entries to use in the main document's reference section, and `pub.aux` contains that for the biography's publication list.

This got me a list at the end of the biography chapter. But it starts with a big heading, it's not in reverse chronological order but alphabetical (because `myStyle.bst` organizes bibs that way), and the numbering is not diea. For example, one of the item in `mypub.bib` is also in `dissertation_bib_file.bib`, and their numbering is the same in both places such that in the publication list, I have item ordering like 1, 2, 120, 37, 5...

No good.
 
**Removing Header**

In `biography.tex`, included the following suggest by [SO post](https://stackoverflow.com/a/4471260)

```latex
Blablabla memememememe
\renewcommand{\chapter}[2]{}
\nocitepub{*}
\bibliographystylepub{myStyle}
\bibliographypub{mypub}
```

Internally bibliography implements its header as a section or chapter header, so the `\renewcommand` suppresses it.

**Get rid of weird ordering**

This took the longest time and I could not find a satisfactory solution. Using 

```
\usepackage[resetlabels]{multibib}
```

did not help. Nobody seems to even have this problem...so I gave up and just made the items use bullets instead. In `biography.tex`:

```latex
Blablabla memememeem

\renewcommand{\chapter}[2]{}
% ---- next three lines make bullets happen ---
\makeatletter
\renewcommand\@biblabel[1]{\textbullet} % Can put any desired symbol in the braces actually
\makeatother
% -----------------
\nocitepub{*}
\bibliographystylepub{myStyle}
\bibliographypub{mypub}
```

**Reverse chronological order**

This one is very tricky, and requires modifying the actual `myStyle.bst` file. This [SO post](https://tex.stackexchange.com/a/223482) gives a good idea of how these bst-files work...they really have a weird syntax. Basically, in every bst file, a bunch of functions are defined and used to format individual reference entries from the bibtex entry, then these entries are sorted and inserted into the final file. The function that likely needs to be changed in all bst-files is the `PRESORT` function.

[plainyr-rev.bst](https://github.com/jberger/Curriculum_Vita/blob/master/plainyr-rev.bst) provides a working example of ordering reference entries in reverse chronological order. I decided to use [`jasa.bst`](https://github.com/merliseclyde/AAIS/blob/master/jasa.bst), from Journal of American Statistical Association. The following are the changes needed:

```latex
%%%%%%% Extra added functions %%%%%%%%%%%%%%%
% From plainyr_rev.bst
FUNCTION {sort.format.month}
{ 't :=
  t #1 #3 substring$ "Jan" =
  t #1 #3 substring$ "jan" =
  or
  { "12" }
    { t #1 #3 substring$ "Feb" =
      t #1 #3 substring$ "feb" =
      or
      { "11" }
      { t #1 #3 substring$ "Mar" =
        t #1 #3 substring$ "mar" =
        or
        { "10" }
        { t #1 #3 substring$ "Apr" =
          t #1 #3 substring$ "apr" =
          or
          { "09" }
          { t #1 #3 substring$ "May" =
            t #1 #3 substring$ "may" =
            or
            { "08" }
            { t #1 #3 substring$ "Jun" =
              t #1 #3 substring$ "jun" =
              or
              { "07" }
              { t #1 #3 substring$ "Jul" =
                t #1 #3 substring$ "jul" =
                or
                { "06" }
                { t #1 #3 substring$ "Aug" =
                  t #1 #3 substring$ "aug" =
                  or
                  { "05" }
                  { t #1 #3 substring$ "Sep" =
                    t #1 #3 substring$ "sep" =
                    or
                    { "04" }
                    { t #1 #3 substring$ "Oct" =
                      t #1 #3 substring$ "oct" =
                      or
                      { "03" }
                      { t #1 #3 substring$ "Nov" =
                        t #1 #3 substring$ "nov" =
                        or
                        { "02" }
                        { t #1 #3 substring$ "Dec" =
                          t #1 #3 substring$ "dec" =
                          or
                          { "01" }
                          { "13" } % No month specified
                        if$
                        }
                      if$
                      }
                    if$
                    }
                  if$
                  }
                if$
                }
              if$
              }
            if$
            }
          if$
          }
        if$
        }
      if$
      }
    if$
    }
  if$
 
}

% Original jasa's presort function
%FUNCTION {presort}
%{ calc.label
%  label sortify
%  "    "
%  *
%  type$ "book" =
%  type$ "inbook" =
%  or
%    'author.editor.sort
%    { type$ "proceedings" =
%        'editor.sort
%        'author.sort
%      if$
%    }
%  if$
%  #1 entry.max$ substring$
%  'sort.label :=
%  sort.label
%  *
%  "    "
%  *
%  title field.or.null
%  sort.format.title
%  *
%  #1 entry.max$ substring$
%  'sort.key$ :=
%}

% New one from plainyr_rev.bst
FUNCTION {presort}
{
  % sort by reverse year
  reverse.year
  "    "
  *
  month field.or.null
  sort.format.month
  *
  " "
  *
  author field.or.null
  sort.format.names
  *
  "    "
  *
  title field.or.null
  sort.format.title
  *

  % cite key for definitive disambiguation
  cite$
  *

  % limit to maximum sort key length
  #1 entry.max$ substring$

  'sort.key$ :=
}

ITERATE {presort}

% Bunch of other stuff
% ...
EXECUTE {initialize.extra.label.stuff}

%ITERATE {forward.pass} % <--- comment out this step to avoid the 
                        %       year numbers in the reverse-chronological
                        %       entry to have letters following the year numbers

REVERSE {reverse.pass}

%FUNCTION {bib.sort.order}
%{ sort.label
%  "    "
%  *
%  year field.or.null sortify
%  *
%  "    "
%  *
%  title field.or.null
%  sort.format.title
%  *
%  #1 entry.max$ substring$
%  'sort.key$ :=
%}

%ITERATE {bib.sort.order}

SORT                    % Now things will sort as desired
```

**Extra: Make my name bold**

Might as well make things nicer and make my name bold in all the entries in my publication list. This [post](https://tex.stackexchange.com/questions/33330/make-one-authors-name-bold-every-time-it-shows-up-in-the-bibliography) has many good approaches. Considering I'm likely only to have to do this once (or very infrequently), I decided to simply alter the `mypub.bib` file.

Suppose your name is John A. Smith. Depending on the reference style and the specific bibtex entry, this might become something like `Smith, J. A.`, `Smith, John A.`, `Smith, John`, or `Smith, J.`.

In bibtex, the author line may be something like:

```latex
% variation 1
author = {Smith, John and Doe, Jane}
% variation 2
author = {Smith, John A. and Doe, Jane}
```

Apparently the bst files simply goes through these lines, strsplit based on keyword "and", and take the last name and first name field and contatenate them together. And if only initial is needed, take the first letter of the first name. So, we can simply make the correct fields bold:

```latex
% variation 1
author = {{\bf Smith}, {\bf J}{\bf ohn} and Doe, Jane}
% variation 2
author = {{\bf Smith}, {\bf J}{\bf ohn} {\bf A.} and Doe, Jane}
```
Note that the first name's first letter and last letters are bolded separately for correct formatting.

Took way too long!
