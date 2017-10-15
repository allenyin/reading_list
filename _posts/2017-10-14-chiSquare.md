---
layout: post
title: "Chi-squared post-hoc test, and how trolly statistical testing is"
date: 2017-10-14
comments: false
tags: [Statistics]
---

[Chi-squared test](https://en.wikipedia.org/wiki/Chi-squared_test) is any statistical hypothesis test wherein the sampling distribution of the test statistic is a chi-squared distribution when the null hypothesis is true. It is commonly used to determine whether there is a significant difference between the expected frequencies and the observed frequencies in one or more categories.

The calculations for this test is fairly simple, [good examples](https://onlinecourses.science.psu.edu/statprogram/node/158), and is used to compare if the *proportions* of a category in a group is significantly different than *expected*.

---------------------------
On first look, the difference between ANOVA and Chi-squared is pretty [straight-forward](http://researchbasics.education.uconn.edu/anova_regression_and_chi-square/). ANOVA tries to identify whether the variances observed in a dependent variable can be explained by different flevels in categorical independent variables.

*Do hours of sleep affect health?* (One-way ANOVA)

*Do gender and hours of sleep affect health?* (Two-way ANOVA)

Using ANOVA, we would survey a bunch of people about their hours of sleep, gender, and healthy. Suppose we divide hours of sleep into 3 levels, and the health score varies from 1:10. In one-way ANOVA, for example, we would get the mean and standard deviation of the health scores for people with low, medium, or high hours of sleep. Depending on the overlap between those distributions, we can either reject or fail to reject the hypothesis that hours of sleep affect health.

Chi-squared can also be used to answer if there's a relationship between hours of sleep and health. We can build a contingency table where the columns are level of sleep, and the rows are level of health score. The chi-squared test would then tell us if the number of people in each cell is expected.

Of course, we can also simply divide the health score into either high or low, and make a logistic regression where the independent variable is the hours of sleep.

ANOVA is probably the most appropriate test here. Different people would give different answeres to the [same question](https://www.researchgate.net/post/Is_this_an_ANOVA_or_Chi-Square_problem). The point is that simply saying "chi-squared test deals with count data" is right and wrong at the same time. But I digress

-----------------------------

So, chi-squared test itself serves as an omnibus test like ANOVA, indicating whether the observed counts or cells in the contingency table are significantly different from expected. But it does not tell us which cell. In ANOVA, there is post-hoc testing, and MATLAB handles it very easily by passing the result from `anova1` or `anovan` into `multcompare`, which would further handle multiple comparison.

In comparison, post-hoc chi-squared test is not as common -- MATLAB does not have one and it is not well-documented in other packages like SPSS.

There are several methods [documented](http://pareonline.net/getvn.asp?v=20&n=8). My favorite, and probably most intuitive one is [residual method by *Beasley and Shumacker 1995*](http://www.soph.uab.edu/statgenetics/people/mbeasley/Beasley-Schumacker-1995-JXE-CTA.pdf). After the omnibus chi-squared test rejects null hypothesis, post-hoc steps include:

1. Make the contingency table $$M$$ as in any Chi-squared test.

2. Get the expected value $$E(i,j)$$ for each cell. If $$[i,j]$$ indexes the table $$M$$, then $$E(i,j)=(\sum_{i'}M(i',j))( \sum_{j'}M(i,j')) / n$$, where $$n=\sum_{i'}\sum_{j'}M(i',j')$$.

3. Obtain standardized residuals for each cell: $$e(i,j)=\frac{M(i,j)-E(i,j)}{\sqrt{E(i,j)}}$$. These values are equivalent to the square root of each cell's chi-squared values.

4. The standardized residuals follow a standard normal distribution. So we can obtain two-tailed or one-tailed pvalues from them. Multiple comparison procedure can be applied as usual to the resulting pvalues.

MATLAB implementation [here](https://github.com/allenyin/util_scripts/blob/master/chi_squared.m).
