## **AGILE FRAMEWORK FOR SCHOOL MANAGEMENT SYSTEM**

**Think of Agile like this analogy:**
Instead of building the entire house and showing it at the end (Waterfall), you build one room at a time, show it, get feedback, and improve. Each room is usable on its own.

---

## **PROJECT SETUP: AGILE STRUCTURE**

### **Sprint Duration**
- **Each Sprint = 1-2 weeks** (I recommend 1 week for solo projects)
- Goal: Deliver working features at the end of each sprint

### **Backlog Organization**

**Product Backlog** = All features you want to build (Phases 1, 2, 3)
**Sprint Backlog** = Features you'll build THIS sprint
**Done** = Deployed and working features

---

## **SPRINT BREAKDOWN**

### **SPRINT 0: Project Setup (3-5 days)**

**Goal:** Development environment ready

**User Stories:**
- As a developer, I need a Django project set up so I can start coding
- As a developer, I need a Git repository so I can track my changes
- As a developer, I need a database schema planned so I know what to build

**Tasks:**
- [done] Install Django and create project
- [done] Set up virtual environment
- [done] Create GitHub repository
- [done] Set up `.gitignore` and `README.md`
- [ ] Create database diagram/ERD
- [done] Set up project structure (apps folder)
- [done] Configure settings (database, static files, templates)
- [done] Create base template with Bootstrap

**Definition of Done:**
- ✅ Django server runs successfully
- ✅ Git repo with first commit
- ✅ Database diagram documented
- ✅ Base template renders

---

### **SPRINT 1: Authentication & User Management (1 week)**

**Goal:** Users can register, login, and have roles

**User Stories:**
```
1. As an admin, I want to create user accounts so that teachers 
   and students can access the system

2. As a user, I want to log in with my credentials so that I can 
   access my dashboard

3. As a user, I want to see a dashboard based on my role so that 
   I see relevant information

4. As a user, I want to log out so that my account stays secure
```

**Tasks:**
- [done] Create custom User model or extend with Profile
- [done] Implement role system (Admin/Teacher/Student)
- [done] Build registration form (admin only for now)
- [done] Build login page
- [done] Build logout functionality
- [done] Create role-based dashboard views
- [done] Add basic dashboard templates for each role
- [Not_Sure] Write tests for authentication

**Acceptance Criteria:**
- Admin can create users with different roles
- Users can log in and see role-specific dashboard
- Users can log out
- Unauthorized users can't access dashboards

**Definition of Done:**
- ✅ All features working
- ✅ Code pushed to GitHub
- ✅ Basic tests passing
- ✅ No critical bugs

---

### **SPRINT 2: Core Models - Subjects & Classes (1 week)**

**Goal:** Admin can manage subjects and classes

**User Stories:**
```
1. As an admin, I want to create subjects so that they can be 
   assigned to classes

2. As an admin, I want to create classes and assign teachers 
   so that students can be enrolled

3. As an admin, I want to view all subjects and classes so that 
   I can manage them easily

4. As an admin, I want to edit/delete subjects and classes so that 
   I can keep data up-to-date
```

**Tasks:**
- [ ] Create Subject model
- [ ] Create Class model
- [ ] Build Subject CRUD views (Create, Read, Update, Delete)
- [ ] Build Class CRUD views
- [ ] Create forms for Subject and Class
- [ ] Add admin dashboard pages for managing these
- [ ] Add validation (e.g., unique subject codes)
- [ ] Write model tests

**Acceptance Criteria:**
- Admin can create/edit/delete subjects
- Admin can create classes with teacher assignment
- Data validates correctly
- UI is clean and functional

**Definition of Done:**
- ✅ CRUD operations work for both models
- ✅ Proper error handling
- ✅ Committed to GitHub
- ✅ Manual testing completed

---

### **SPRINT 3: Student & Teacher Management (1 week)**

**Goal:** Admin can manage students and teachers, assign them to classes

**User Stories:**
```
1. As an admin, I want to add student and teacher profiles so that 
   they have complete information in the system

2. As an admin, I want to enroll students in classes so that 
   they can see their courses

3. As a teacher, I want to view my assigned classes so that 
   I know what I'm teaching

4. As a student, I want to view my enrolled classes so that 
   I know my schedule
```

**Tasks:**
- [ ] Create Profile model (extends User)
- [ ] Build student management views (CRUD)
- [ ] Build teacher management views (CRUD)
- [ ] Implement student enrollment to classes
- [ ] Build "My Classes" view for teachers
- [ ] Build "My Classes" view for students
- [ ] Add profile picture upload
- [ ] Create student/teacher list templates

**Acceptance Criteria:**
- Admin can add students and teachers with full profiles
- Students can be enrolled in multiple classes
- Teachers see only their classes
- Students see only their enrolled classes

**Definition of Done:**
- ✅ All CRUD operations work
- ✅ Relationships working correctly
- ✅ Views show correct data based on role
- ✅ Pushed to GitHub

---

### **SPRINT 4: Polish Phase 1 & Deploy (1 week)**

**Goal:** Phase 1 is production-ready and deployed

**User Stories:**
```
1. As a user, I want a clean, professional UI so that the 
   system is easy to use

2. As a developer, I want the app deployed so that recruiters 
   can access it

3. As a user, I want proper error messages so that I understand 
   what went wrong
```

**Tasks:**
- [ ] Improve UI/UX with better Bootstrap styling
- [ ] Add proper navigation menu
- [ ] Add breadcrumbs and page titles
- [ ] Implement proper error handling (404, 403, 500 pages)
- [ ] Add form validation messages
- [ ] Write comprehensive README
- [ ] Set up environment variables
- [ ] Deploy to Railway/PythonAnywhere
- [ ] Set up PostgreSQL database
- [ ] Test all features on production

**Acceptance Criteria:**
- App looks professional
- All features work in production
- README explains the project clearly
- No broken links or errors

**Definition of Done:**
- ✅ Deployed and accessible via URL
- ✅ All Phase 1 features working in production
- ✅ README updated with live link
- ✅ Code cleaned up

---

### **🎉 PHASE 1 COMPLETE - NOW YOU HAVE A WORKING PORTFOLIO PROJECT!**

---

### **SPRINT 5: Attendance System (1 week)** - *Start of Phase 2*

**User Stories:**
```
1. As a teacher, I want to mark attendance for my classes so that 
   student presence is tracked

2. As a student, I want to view my attendance record so that 
   I know my attendance percentage

3. As an admin, I want to view attendance reports so that I can 
   identify students with low attendance
```

**Tasks:**
- [ ] Create Attendance model
- [ ] Build attendance marking interface for teachers
- [ ] Add date picker for attendance
- [ ] Build student attendance view (list/calendar)
- [ ] Calculate attendance percentage
- [ ] Build admin attendance reports
- [ ] Add filters (by date, class, student)

---

### **SPRINT 6: Grades Management (1 week)**

**User Stories:**
```
1. As a teacher, I want to add grades for students so that 
   their performance is recorded

2. As a student, I want to view my grades so that I know 
   my academic progress

3. As an admin, I want to see grade reports so that I can 
   evaluate overall performance
```

**Tasks:**
- [ ] Create Grade model
- [ ] Build grade entry form for teachers
- [ ] Add grade types (quiz, midterm, final)
- [ ] Build student grade view with filtering
- [ ] Calculate average/GPA
- [ ] Build admin grade analytics
- [ ] Add grade distribution charts

---

### **SPRINT 7: Assignment System (1-2 weeks)**

**User Stories:**
```
1. As a teacher, I want to create assignments so that students 
   can submit their work

2. As a student, I want to submit assignments so that I can 
   complete my coursework

3. As a teacher, I want to grade submissions so that students 
   get feedback

4. As a student, I want to see my graded assignments so that 
   I know my performance
```

**Tasks:**
- [ ] Create Assignment and Submission models
- [ ] Build assignment creation form
- [ ] Add file upload for submissions
- [ ] Build student submission interface
- [ ] Build teacher grading interface
- [ ] Add due date notifications (basic)
- [ ] Show submission status (pending/graded)

---

### **SPRINT 8: Deploy Phase 2 & Testing (1 week)**

**Tasks:**
- [ ] Test all Phase 2 features
- [ ] Fix bugs
- [ ] Improve UI for new features
- [ ] Update README
- [ ] Deploy Phase 2
- [ ] Demo video/screenshots

---

## **PHASE 3 SPRINTS (8-12 weeks)**

Sprint 9: Notification System
Sprint 10: Email Integration
Sprint 11: Analytics Dashboard
Sprint 12: Report Generation (PDF)
Sprint 13: Parent Portal
Sprint 14: Advanced Features
Sprint 15: Final Polish & Deploy

---

## **AGILE CEREMONIES (How You'll Work)**

### **1. Sprint Planning** (Start of each sprint)
- Review your backlog
- Pick user stories for this sprint
- Break stories into tasks
- Estimate time for each task

### **2. Daily Standup** (Every day - 5 minutes)
Even solo, ask yourself:
- What did I do yesterday?
- What will I do today?
- Any blockers?

### **3. Sprint Review** (End of sprint)
- Demo your working features (record a video!)
- Test everything
- Update your portfolio/README

### **4. Sprint Retrospective** (End of sprint)
- What went well?
- What could improve?
- What will I do differently?

---

## **TOOLS TO USE**

### **Project Management:**
**Option 1: Trello** (Simple, visual)
```
Boards:
├─ Backlog
├─ Sprint Backlog (Current)
├─ In Progress
├─ Testing
└─ Done
```

**Option 2: GitHub Projects** (Better for portfolio)
- Shows recruiters you use professional tools
- Integrated with your code

**Option 3: Notion** (Most flexible)
- Kanban board
- Sprint planning
- Documentation

### **Version Control:**
```
Git Branches:
main          → Production-ready code
develop       → Integration branch
feature/auth  → Feature branches
feature/attendance
```

**Commit Convention:**
```
feat: Add user login functionality
fix: Fix student enrollment bug
docs: Update README with setup instructions
style: Improve dashboard UI
test: Add tests for attendance marking
```

---

## **YOUR FIRST SPRINT STARTS NOW**

### **Sprint 0 Backlog (This Week):**

**Day 1-2:**
- [ ] Install Django, create project
- [ ] Set up Git repository
- [ ] Plan database models (draw ERD)

**Day 3-4:**
- [ ] Create project structure
- [ ] Set up base template
- [ ] Configure settings

**Day 5:**
- [ ] Test everything runs
- [ ] Document in README
- [ ] Sprint review (what works?)

---

## **TRACKING YOUR PROGRESS**

Create a simple spreadsheet or use Trello:

| Sprint | Goal | Status | Demo Link |
|--------|------|--------|-----------|
| 0 | Setup | ✅ Done | - |
| 1 | Auth | 🔄 In Progress | - |
| 2 | Core Models | ⏳ Planned | - |

---

**Ready to start Sprint 0? Want me to help you set up your Trello/GitHub Project board, or should we dive into creating the Django project structure right now?**