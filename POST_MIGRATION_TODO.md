# Post-Migration Todo List

This file tracks features and enhancements to implement after the initial Jekyll to Eleventy migration is complete and working.

## 🎯 Priority Features

### 1. Dark Mode Support
- [ ] Add CSS variables for color schemes
- [ ] Implement dark/light theme toggle
- [ ] Ensure all components support both themes
- [ ] Test with existing content and images
- [ ] Consider system preference detection

**Implementation Notes:**
- Use CSS custom properties for colors
- Toggle button in header/navigation
- Smooth transitions between themes
- Ensure math equations are readable in both modes

**Files to Modify:**
- `css/theme.css` - Add CSS variables and dark theme styles
- `_includes/header.html` - Add theme toggle button
- `js/theme-toggle.js` - Theme switching logic

---

### 2. Collapsible Code Blocks
- [ ] Add collapse/expand functionality to long code blocks
- [ ] Show code block length indicator
- [ ] Smooth animation for collapse/expand
- [ ] Remember collapsed state per session

**Implementation Notes:**
- Target code blocks longer than X lines
- Add "Show more/Show less" button
- Use CSS transitions for smooth animations
- Consider using `<details>` and `<summary>` HTML elements

**Files to Modify:**
- `css/theme.css` - Add collapsible code block styles
- `js/code-collapse.js` - Collapse/expand functionality
- Update markdown processing to wrap long code blocks

---

## 🔧 Technical Improvements

### 3. Performance Optimizations
- [ ] Implement lazy loading for images
- [ ] Minify HTML output

### 4. Enhanced Search
- [ ] Add client-side search functionality
- [ ] Search through post titles and content
- [ ] Search result highlighting

### 5. Better Navigation
- [ ] Add table of contents for long posts
- [ ] Improve mobile navigation

---

## 📱 User Experience Enhancements

### 6. Reading Experience
- [ ] Add estimated reading time
- [ ] Implement progress bar for long posts
- [ ] Add "back to top" button
- [ ] Improve typography and spacing

### 7. Content Organization
- [ ] Better archive organization

---

## 🎨 Visual Improvements

### 8. Enhanced Styling
- [ ] Improve tag cloud design
- [ ] Better pagination styling
- [ ] Enhanced post cards/grid layout
- [ ] Improved mobile responsiveness

### 9. Interactive Elements
- [ ] Add copy-to-clipboard for code blocks
- [ ] Implement social sharing buttons
- [ ] Add reading progress indicators
- [ ] Smooth scrolling navigation

---

## 📊 Analytics & Monitoring

### 10. Better Insights
- [ ] Enhanced Google Analytics integration
- [ ] Add reading time tracking

---

## 🔄 Migration Status

- [x] Initial Eleventy configuration
- [x] Template conversion (Liquid → Nunjucks)
- [x] Date handling (filename + front matter)
- [x] Permalink system
- [x] Tag collections
- [x] LaTeX support
- [ ] **TODO**: Test migration locally
- [ ] **TODO**: Deploy to GitHub Pages
- [ ] **TODO**: Begin implementing features above
