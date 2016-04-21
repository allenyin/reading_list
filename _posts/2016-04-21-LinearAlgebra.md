---
layout: post
title: "Linear Algebra Notes"
date: 2016-4-21
comments: false
tags:
- Notes
- Linear_Algebra
---

I can apply linear algebra, but often forget/confuse the spatial representations.

A good resource is [Gilbert Strang's essay](http://web.mit.edu/18.06/www/Essays/newpaper_ver3.pdf). I remember him talking about this when I took 18.06, but he was old at that point, and I barely went to class. So I didn't retain much. This notes of his still retains his stream of consciousness style, but the two diagrams summarizes it well, and is useful to often go back and make sure I still understand it.

![image1]({{ site.baseurl }}/assets/linearAlgebra1.png){: .center-image}

![image2]({{ site.baseurl }}/assets/linearAlgebra2.png){: .center-image}

The first one shows the relationship between the four subspaces of a matrix $$A$$. The second one adds in the relationship between the orthonormal basis of the subspaces.

Finally, **the eigenvectors of $$A$$ lie in its column space and nullspace, not a natural pair. The dimensions of the spaces add to $$n$$, but the spaces are not orthogonal and they could even coincide. The better picture is the orthogonal one that leads to the SVD**.

* In $$Ax=b$$, $$x$$ is in the row space, $$b$$ is in the column space.
* If $$Ax=0$$, then $$x$$ is in the null space (kernel) of A, and is orthogonal complement of the row space of A, $$C(A^T)$$.
* In $$A^Tx=b$$, $$x$$ is in the column space, $$b$$ is in the row space.
* If $$A^Tx=0$$, then $$x$$ is in the cokernel of A, and is orthogonal complement of the column space of A, $$C(A)$$.
* In SVD, $$A=U \Sigma V^T$$:
    * $$Av_i=\sigma_i u_i$$, for $$i=1,...,r$$, where $$r$$ is the rank of column and row space. 
      $$u_i$$ are the eigenvectors of column space, 
      $$v_i$$ are the eigenvectors of the row space.
    * $$Av_i=0$$, $$A^Tu_i=0$$, for $$i>r$$. 
      $$v_i$$ are the eigenvectors of the null space of $$A^T$$, 
      $$u_i$$ are the eigenvectors of the null space of $$A$$.
