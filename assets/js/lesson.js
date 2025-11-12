/* ============================================
   LESSON PAGE JAVASCRIPT
   ============================================ */

// Course structure with all 78 lessons
const courseStructure = {
  phases: [
    {
      id: 'phase-1',
      name: 'Phase 1: JavaScript Fundamentals',
      weeks: [
        {
          week: 1,
          lessons: [
            { id: 'js-1-1', title: 'What is JavaScript?', file: 'week1/day1' },
            { id: 'js-1-2', title: 'Variables and Data Types', file: 'week1/day2' },
            { id: 'js-1-3', title: 'Operators', file: 'week1/day3' },
            { id: 'js-1-4', title: 'Control Flow', file: 'week1/day4' },
            { id: 'js-1-5', title: 'Functions Basics', file: 'week1/day5' },
            { id: 'js-1-project', title: 'Week 1 Project', file: 'week1/project' },
          ]
        },
        {
          week: 2,
          lessons: [
            { id: 'js-2-1', title: 'Arrays', file: 'week2/day1' },
            { id: 'js-2-2', title: 'Objects', file: 'week2/day2' },
            { id: 'js-2-3', title: 'Array Methods', file: 'week2/day3' },
            { id: 'js-2-4', title: 'ES6+ Features', file: 'week2/day4' },
            { id: 'js-2-5', title: 'Advanced Functions', file: 'week2/day5' },
            { id: 'js-2-project', title: 'Week 2 Project', file: 'week2/project' },
          ]
        }
      ]
    },
    {
      id: 'phase-2',
      name: 'Phase 2: DOM & Events',
      weeks: [
        {
          week: 3,
          lessons: [
            { id: 'dom-1-1', title: 'DOM Basics', file: 'week3/day1' },
            { id: 'dom-1-2', title: 'Selecting Elements', file: 'week3/day2' },
            { id: 'dom-1-3', title: 'Manipulating Elements', file: 'week3/day3' },
            { id: 'dom-1-4', title: 'Events Handling', file: 'week3/day4' },
            { id: 'dom-1-5', title: 'Event Delegation', file: 'week3/day5' },
            { id: 'dom-1-project', title: 'Week 3 Project', file: 'week3/project' },
          ]
        },
        {
          week: 4,
          lessons: [
            { id: 'async-1-1', title: 'Async Basics', file: 'week4/day1' },
            { id: 'async-1-2', title: 'Promises', file: 'week4/day2' },
            { id: 'async-1-3', title: 'Async/Await', file: 'week4/day3' },
            { id: 'async-1-4', title: 'Fetch API', file: 'week4/day4' },
            { id: 'async-1-5', title: 'Working with APIs', file: 'week4/day5' },
            { id: 'async-1-project', title: 'Week 4 Project', file: 'week4/project' },
          ]
        }
      ]
    },
    {
      id: 'phase-3',
      name: 'Phase 3: React Framework',
      weeks: [
        {
          week: 5,
          lessons: [
            { id: 'react-1-1', title: 'React Basics', file: 'week5/day1' },
            { id: 'react-1-2', title: 'JSX', file: 'week5/day2' },
            { id: 'react-1-3', title: 'Components', file: 'week5/day3' },
            { id: 'react-1-4', title: 'Props', file: 'week5/day4' },
            { id: 'react-1-5', title: 'Lists & Keys', file: 'week5/day5' },
            { id: 'react-1-project', title: 'Week 5 Project', file: 'week5/project' },
          ]
        },
        {
          week: 6,
          lessons: [
            { id: 'react-2-1', title: 'State & useState', file: 'week6/day1' },
            { id: 'react-2-2', title: 'Effects & useEffect', file: 'week6/day2' },
            { id: 'react-2-3', title: 'Hooks', file: 'week6/day3' },
            { id: 'react-2-4', title: 'Context API', file: 'week6/day4' },
            { id: 'react-2-5', title: 'State Management', file: 'week6/day5' },
            { id: 'react-2-project', title: 'Week 6 Project', file: 'week6/project' },
          ]
        },
        {
          week: 7,
          lessons: [
            { id: 'react-3-1', title: 'Routing', file: 'week7/day1' },
            { id: 'react-3-2', title: 'Forms', file: 'week7/day2' },
            { id: 'react-3-3', title: 'API Integration', file: 'week7/day3' },
            { id: 'react-3-4', title: 'Performance', file: 'week7/day4' },
            { id: 'react-3-5', title: 'Testing', file: 'week7/day5' },
            { id: 'react-3-project', title: 'Week 7 Project', file: 'week7/project' },
          ]
        },
        {
          week: 8,
          lessons: [
            { id: 'react-4-1', title: 'Advanced Patterns', file: 'week8/day1' },
            { id: 'react-4-2', title: 'Custom Hooks', file: 'week8/day2' },
            { id: 'react-4-3', title: 'TypeScript', file: 'week8/day3' },
            { id: 'react-4-4', title: 'Deployment', file: 'week8/day4' },
            { id: 'react-4-5', title: 'Best Practices', file: 'week8/day5' },
            { id: 'react-4-project', title: 'Week 8 Project', file: 'week8/project' },
          ]
        }
      ]
    },
    {
      id: 'phase-4',
      name: 'Phase 4: Full-Stack MVP',
      weeks: [
        {
          week: 9,
          lessons: [
            { id: 'fullstack-1-1', title: 'Project Planning', file: 'week9/day1' },
            { id: 'fullstack-1-2', title: 'Architecture', file: 'week9/day2' },
            { id: 'fullstack-1-3', title: 'Database Design', file: 'week9/day3' },
            { id: 'fullstack-1-4', title: 'UI/UX Planning', file: 'week9/day4' },
            { id: 'fullstack-1-5', title: 'Setup & Tools', file: 'week9/day5' },
            { id: 'fullstack-1-project', title: 'Week 9 Project', file: 'week9/project' },
          ]
        },
        {
          week: 10,
          lessons: [
            { id: 'fullstack-2-1', title: 'Frontend Setup', file: 'week10/day1' },
            { id: 'fullstack-2-2', title: 'Frontend Build', file: 'week10/day2' },
            { id: 'fullstack-2-3', title: 'State Management', file: 'week10/day3' },
            { id: 'fullstack-2-4', title: 'UI Components', file: 'week10/day4' },
            { id: 'fullstack-2-5', title: 'Testing Frontend', file: 'week10/day5' },
            { id: 'fullstack-2-project', title: 'Week 10 Project', file: 'week10/project' },
          ]
        },
        {
          week: 11,
          lessons: [
            { id: 'fullstack-3-1', title: 'Backend Setup', file: 'week11/day1' },
            { id: 'fullstack-3-2', title: 'API Development', file: 'week11/day2' },
            { id: 'fullstack-3-3', title: 'Database Integration', file: 'week11/day3' },
            { id: 'fullstack-3-4', title: 'Authentication', file: 'week11/day4' },
            { id: 'fullstack-3-5', title: 'Testing Backend', file: 'week11/day5' },
            { id: 'fullstack-3-project', title: 'Week 11 Project', file: 'week11/project' },
          ]
        },
        {
          week: 12,
          lessons: [
            { id: 'fullstack-4-1', title: 'Integration', file: 'week12/day1' },
            { id: 'fullstack-4-2', title: 'Performance', file: 'week12/day2' },
            { id: 'fullstack-4-3', title: 'Security', file: 'week12/day3' },
            { id: 'fullstack-4-4', title: 'Deployment', file: 'week12/day4' },
            { id: 'fullstack-4-5', title: 'Monitoring', file: 'week12/day5' },
            { id: 'fullstack-4-project', title: 'Week 12 Project', file: 'week12/project' },
          ]
        },
        {
          week: 13,
          lessons: [
            { id: 'fullstack-5-1', title: 'Launch', file: 'week13/day1' },
            { id: 'fullstack-5-2', title: 'Feedback & Iteration', file: 'week13/day2' },
            { id: 'fullstack-5-3', title: 'Scale & Optimize', file: 'week13/day3' },
            { id: 'fullstack-5-4', title: 'Maintenance', file: 'week13/day4' },
            { id: 'fullstack-5-5', title: 'Next Steps', file: 'week13/day5' },
            { id: 'fullstack-5-project', title: 'Final Project', file: 'week13/project' },
          ]
        }
      ]
    }
  ]
};

// Flatten all lessons for easy navigation
let allLessons = [];
courseStructure.phases.forEach(phase => {
  phase.weeks.forEach(week => {
    week.lessons.forEach(lesson => {
      allLessons.push({
        ...lesson,
        phase: phase,
        week: week.week
      });
    });
  });
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  LessonPage.init();
});

const LessonPage = {
  currentLessonId: null,
  currentLessonIndex: 0,

  /**
   * Initialize lesson page
   */
  init() {
    // Get lesson from URL
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lesson') || allLessons[0].id;

    this.loadLesson(lessonId);
    this.setupEventListeners();
    this.buildSidebar();
  },

  /**
   * Setup event listeners for buttons and navigation
   */
  setupEventListeners() {
    const prevBtn = DOM.get('#prevBtn');
    const nextBtn = DOM.get('#nextBtn');
    const sidebarToggle = DOM.get('#sidebarToggle');
    const sidebarClose = DOM.get('#sidebarClose');
    const sidebar = DOM.get('#lessonSidebar');
    const tocClose = DOM.get('#tocClose');
    const tocSidebar = DOM.get('#tocSidebar');
    const sidebarMobileToggle = DOM.get('#sidebarMobileToggle');
    const tocMobileToggle = DOM.get('#tocMobileToggle');

    // Previous button
    if (prevBtn) {
      DOM.on(prevBtn, 'click', () => {
        if (this.currentLessonIndex > 0) {
          const prevLesson = allLessons[this.currentLessonIndex - 1];
          this.loadLesson(prevLesson.id);
          this.scrollToTop();
        }
      });
    }

    // Next button
    if (nextBtn) {
      DOM.on(nextBtn, 'click', () => {
        if (this.currentLessonIndex < allLessons.length - 1) {
          const nextLesson = allLessons[this.currentLessonIndex + 1];
          this.loadLesson(nextLesson.id);
          this.scrollToTop();
        }
      });
    }

    // Desktop sidebar toggle
    if (sidebarToggle) {
      DOM.on(sidebarToggle, 'click', () => {
        DOM.toggleClass(sidebar, 'open');
      });
    }

    // Desktop sidebar close
    if (sidebarClose) {
      DOM.on(sidebarClose, 'click', () => {
        DOM.removeClass(sidebar, 'open');
      });
    }

    // Mobile sidebar toggle
    if (sidebarMobileToggle) {
      DOM.on(sidebarMobileToggle, 'click', () => {
        DOM.toggleClass(sidebar, 'open');
        // Close TOC if sidebar opens
        if (DOM.hasClass(sidebar, 'open')) {
          DOM.removeClass(tocSidebar, 'open');
        }
      });
    }

    // TOC toggle
    if (tocMobileToggle) {
      DOM.on(tocMobileToggle, 'click', () => {
        DOM.toggleClass(tocSidebar, 'open');
        // Close sidebar if TOC opens
        if (DOM.hasClass(tocSidebar, 'open')) {
          DOM.removeClass(sidebar, 'open');
        }
      });
    }

    // TOC close
    if (tocClose) {
      DOM.on(tocClose, 'click', () => {
        DOM.removeClass(tocSidebar, 'open');
      });
    }

    // Close sidebar when clicking a sidebar item
    DOM.onAll('.sidebar-item', 'click', () => {
      DOM.removeClass(sidebar, 'open');
      DOM.removeClass(tocSidebar, 'open');
    });

    // Phase toggle for collapsible sections
    DOM.onAll('.sidebar-section-title', 'click', (e) => {
      const title = e.currentTarget;
      const lessonsContainer = title.nextElementSibling;
      
      if (lessonsContainer && DOM.hasClass(lessonsContainer, 'sidebar-lessons')) {
        DOM.toggleClass(title, 'collapsed');
        DOM.toggleClass(lessonsContainer, 'collapsed');
      }
    });
  },

  /**
   * Build sidebar navigation with Phase > Week > Day hierarchy
   */
  buildSidebar() {
    const sidebarContent = DOM.get('#sidebarContent');
    sidebarContent.innerHTML = '';

    courseStructure.phases.forEach((phase, phaseIndex) => {
      const section = DOM.create('div', { class: 'sidebar-section' });

      // Phase title with collapse icon
      const title = DOM.create('div', { 
        class: 'sidebar-section-title',
        html: `<span>${phase.name}</span><i class="fas fa-chevron-right"></i>`
      });
      
      // Start with phases collapsed by default (except first phase)
      let isExpanded = phaseIndex === 0;
      DOM.on(title, 'click', () => {
        isExpanded = !isExpanded;
        lessonsContainer.classList.toggle('collapsed', !isExpanded);
        title.querySelector('i').style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
      });

      section.appendChild(title);

      // Container for all weeks (collapsible)
      const lessonsContainer = DOM.create('div', { 
        class: 'sidebar-lessons' + (isExpanded ? '' : ' collapsed')
      });

      // Set initial rotation for collapsed phases
      if (!isExpanded) {
        title.querySelector('i').style.transform = 'rotate(0deg)';
      }

      phase.weeks.forEach(week => {
        // Week header container
        const weekWrapper = DOM.create('div', { class: 'sidebar-week-wrapper' });

        // Week header (clickable to expand days)
        const weekHeader = DOM.create('div', {
          class: 'sidebar-week-header',
          html: `<span>Week ${week.week}</span><i class="fas fa-chevron-right"></i>`
        });

        let weekExpanded = true;
        DOM.on(weekHeader, 'click', (e) => {
          e.stopPropagation();
          weekExpanded = !weekExpanded;
          daysContainer.classList.toggle('collapsed', !weekExpanded);
          weekHeader.querySelector('i').style.transform = weekExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
        });

        weekWrapper.appendChild(weekHeader);

        // Days container
        const daysContainer = DOM.create('div', { class: 'sidebar-days-container' });

        // Lessons (days) for this week
        week.lessons.forEach((lesson, dayIndex) => {
          const item = DOM.create('a', {
            class: 'sidebar-item',
            attrs: {
              href: `?lesson=${lesson.id}`
            }
          });

          // Determine day label
          let dayLabel = lesson.title;
          if (lesson.title.includes('Project')) {
            dayLabel = 'Project';
          } else {
            dayLabel = `Day ${dayIndex + 1}: ${lesson.title}`;
          }

          const itemText = document.createElement('span');
          itemText.textContent = dayLabel;
          item.appendChild(itemText);

          DOM.on(item, 'click', (e) => {
            e.preventDefault();
            this.loadLesson(lesson.id);
            this.scrollToTop();
          });

          daysContainer.appendChild(item);
        });

        weekWrapper.appendChild(daysContainer);
        lessonsContainer.appendChild(weekWrapper);
      });

      section.appendChild(lessonsContainer);
      sidebarContent.appendChild(section);
    });
  },

  /**
   * Load lesson content from markdown files
   */
  loadLesson(lessonId) {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;

    this.currentLessonId = lessonId;
    this.currentLessonIndex = allLessons.indexOf(lesson);

    // Update active state in sidebar
    DOM.getAll('.sidebar-item').forEach(item => {
      DOM.removeClass(item, 'active');
      if (item.href.includes(`lesson=${lessonId}`)) {
        DOM.addClass(item, 'active');
      }
    });

    // Update header
    DOM.get('#lessonTitle').textContent = lesson.title;
    DOM.get('#weekInfo').textContent = `Week ${lesson.week}`;
    DOM.get('#phaseBadge').textContent = lesson.phase.name.split(':')[0];

    // Update description
    const description = `Learn ${lesson.title.toLowerCase()} in ${lesson.phase.name.split(':')[0]}`;
    DOM.get('#lessonDescription').textContent = description;

    // Load content from markdown file
    this.loadMarkdownContent(lesson);

    // Update navigation buttons
    this.updateNavigation();

    // Update URL
    window.history.pushState({ lesson: lessonId }, lesson.title, `?lesson=${lessonId}`);
  },

  /**
   * Load markdown content from file
   */
  loadMarkdownContent(lesson) {
    const content = DOM.get('#lessonContent');
    content.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Loading...</p>';

    // Construct file path
    const filePath = `../content/${lesson.file}.md`;

    // Fetch the markdown file
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error('File not found');
        return response.text();
      })
      .then(markdown => {
        // Convert markdown to HTML using marked
        const html = marked.parse(markdown);
        content.innerHTML = html;

        // Highlight code blocks
        content.querySelectorAll('pre code').forEach(block => {
          hljs.highlightElement(block);
        });

        // Generate table of contents
        this.generateTableOfContents();

        // Scroll to top
        this.scrollToTop();
      })
      .catch(error => {
        console.error('Error loading lesson:', error);
        content.innerHTML = `
          <div style="background-color: var(--bg-tertiary); padding: var(--spacing-lg); border-radius: var(--radius-lg); border-left: 4px solid var(--error-color);">
            <h3 style="color: var(--error-color); margin-top: 0;">Content Not Found</h3>
            <p>The lesson content file could not be loaded. This lesson is coming soon!</p>
            <p style="font-size: var(--font-size-sm); color: var(--text-light);">File: ${filePath}</p>
          </div>
        `;
      });
  },

  /**
   * Generate table of contents from headings
   */
  generateTableOfContents() {
    const tocContent = DOM.get('#tocContent');
    const content = DOM.get('#lessonContent');
    const headings = content.querySelectorAll('h2, h3, h4');

    tocContent.innerHTML = '';

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      const link = DOM.create('a', {
        text: heading.textContent,
        attrs: {
          href: `#${id}`
        },
        class: `toc-level-${heading.tagName === 'H2' ? 1 : heading.tagName === 'H3' ? 2 : 3}`
      });

      DOM.on(link, 'click', (e) => {
        e.preventDefault();
        Scroll.to(heading);
      });

      tocContent.appendChild(link);
    });
  },

  /**
   * Update navigation buttons state
   */
  updateNavigation() {
    const prevBtn = DOM.get('#prevBtn');
    const nextBtn = DOM.get('#nextBtn');
    const progressText = DOM.get('#progressText');

    // Update button states
    if (prevBtn) {
      prevBtn.disabled = this.currentLessonIndex === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentLessonIndex === allLessons.length - 1;
    }

    // Update progress
    if (progressText) {
      const total = allLessons.length;
      const current = this.currentLessonIndex + 1;
      progressText.textContent = `Lesson ${current} of ${total}`;
    }
  },

  /**
   * Scroll to top of content
   */
  scrollToTop() {
    const mainContent = DOM.get('.lesson-main');
    if (mainContent) {
      mainContent.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }
};
