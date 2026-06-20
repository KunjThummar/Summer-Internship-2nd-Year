# Issues Summary Matrix

## Files by Issue Count

| File | P1 | P2 | P3 | P4 | P5 | Total | Status |
|------|----|----|----|----|----|----|--------|
| controllers/department/addDepartment.js | 1 | - | - | - | - | 1 | ❌ BROKEN |
| controllers/department/updateDepartment.js | 1 | 1 | - | - | - | 2 | ⚠️ PARTIAL |
| controllers/department/deleteDepartment.js | 1 | - | - | - | - | 1 | ⚠️ RISKY |
| controllers/department/fetchDepartment.js | - | 1 | - | - | - | 1 | ⚠️ INCOMPLETE |
| controllers/employee/addSalary.js | 1 | 1 | - | - | - | 2 | ❌ BROKEN |
| controllers/employee/fetchSalaryHistory.js | - | 1 | 1 | - | - | 2 | ⚠️ UNSAFE |
| controllers/employee/fetchEmployees.js | - | 1 | 1 | - | 1 | 3 | ⚠️ UNSAFE |
| controllers/employee/updateEmployee.js | - | - | 1 | - | - | 1 | ⚠️ UNSAFE |
| controllers/employee/addLeave.js | - | 1 | - | - | - | 1 | ⚠️ INCOMPLETE |
| controllers/employee/fetchLeave.js | - | - | 1 | - | - | 1 | ⚠️ UNSAFE |
| controllers/employee/deleteEmployee.js | - | - | - | - | - | 0 | ✅ OK |
| controllers/attendence/markAttendence.js | 1 | 1 | - | - | - | 2 | ⚠️ BUGGY |
| controllers/dashboard/fetchApprovedLeaveCount.js | - | 1 | - | - | - | 1 | ⚠️ WRONG |
| controllers/dashboard/fetchPendingLeaveCount.js | - | 1 | - | - | - | 1 | ⚠️ WRONG |
| controllers/dashboard/fetchRejectedLeaveCount.js | - | 1 | - | - | - | 1 | ⚠️ WRONG |
| controllers/dashboard/fetchEmpoyeeCount.js | - | 1 | - | - | - | 1 | ⚠️ WRONG |
| controllers/userRegister.js | - | - | 1 | - | - | 1 | ⚠️ UNSAFE |
| controllers/userLogin.js | - | - | 1 | - | - | 1 | ⚠️ UNSAFE |
| middleware/authMiddleware.js | - | - | 1 | - | - | 1 | ⚠️ UNSAFE |
| middleware/checkAdmin.js | - | - | - | - | - | 0 | ✅ OK |
| models/employeeSchema.js | - | 1 | - | - | - | 1 | ⚠️ INCOMPLETE |
| models/departmentSchema.js | - | 1 | - | 1 | - | 2 | ⚠️ INCOMPLETE |
| models/leaveSchema.js | - | 1 | - | - | - | 1 | ⚠️ INCOMPLETE |
| models/salarySchema.js | - | 1 | - | 1 | - | 2 | ⚠️ INCOMPLETE |
| models/attendanceSchema.js | - | 1 | - | - | - | 1 | ⚠️ INCOMPLETE |
| routes/employeeRoute.js | 1 | - | - | - | - | 1 | ⚠️ CONFLICT |
| routes/departmentRoute.js | - | - | - | - | - | 0 | ✅ OK |
| routes/authRoute.js | - | - | - | - | - | 0 | ✅ OK |
| routes/dashboardRoute.js | - | - | - | - | - | 0 | ✅ OK |
| routes/attendanceRoute.js | - | - | - | - | - | 0 | ✅ OK |
| routes/adminRoute.js | - | - | - | - | - | 0 | ✅ OK |
| server.js | 1 | - | - | - | 1 | 2 | ⚠️ INCOMPLETE |
| connectToDatabase.js | - | - | - | - | 1 | 1 | ⚠️ CONFIG |

**Legend:**
- ❌ BROKEN = Won't work/crashes
- ⚠️ = Has issues but partially works
- ✅ OK = No issues found

---

## Issues by Category

### Authentication & Security (8 issues)

| Category | Issue | Severity | Files |
|----------|-------|----------|-------|
| Password Exposure | Password in responses | P3 | userRegister.js, fetchEmployees.js |
| Role Validation | Accept any role on register | P3 | userRegister.js |
| Authorization | No auth check on personal data | P3 | fetchSalaryHistory.js, fetchLeave.js, updateEmployee.js |
| Debug Info | Logs headers with tokens | P3 | authMiddleware.js |
| Rate Limiting | No brute force protection | P3 | authRoute.js |

### Data Integrity (12 issues)

| Category | Issue | Severity | Files |
|----------|-------|----------|-------|
| Schema Mismatch | Wrong field names used | P1 | addDepartment.js, updateDepartment.js, addSalary.js |
| Missing Validation | No date/range checks | P2 | addLeave.js, markAttendence.js |
| Missing Relations | No population of refs | P2 | fetchDepartment.js |
| Missing Calculation | In controller not schema | P2 | addSalary.js |
| Wrong Counts | No filtering applied | P2 | fetchApprovedLeaveCount.js, etc. |
| Missing Endpoints | Can't approve/reject | P1 | employeeRoute.js |

### Infrastructure & Routing (3 issues)

| Category | Issue | Severity | Files |
|----------|-------|----------|-------|
| Route Registration | Dashboard not registered | P1 | server.js |
| Duplicate Routes | Same endpoint twice | P1 | employeeRoute.js, dashboardRoute.js |
| Config | Hardcoded DB connection | P5 | connectToDatabase.js |

### Schema Design (6 issues)

| Category | Issue | Severity | Files |
|----------|-------|----------|-------|
| Missing Fields | No leave balance | P2 | employeeSchema.js |
| Missing Fields | No soft delete | P5 | All schemas |
| Missing Indexes | Head lookup slow | P4 | departmentSchema.js |
| Missing Validation | Allow negative salary | P2 | salarySchema.js |
| Cascade Issues | Delete dept with employees | P1 | deleteDepartment.js |
| Missing Relations | No reverse relationship | P4 | Schema design |

### Performance (3 issues)

| Category | Issue | Severity | Files |
|----------|-------|----------|-------|
| No Pagination | Fetch all records | P4 | fetchEmployees.js, fetchDepartment.js |
| Calculation Duplication | In controller not schema | P4 | addSalary.js, salarySchema.js |
| Missing Index | N+1 on head lookups | P4 | departmentSchema.js |

---

## Dependency Graph (What to Fix First)

```
Fix Order:
├── P1: Critical App Issues
│   ├── 1. addDepartment (blocks dept creation)
│   ├── 2. updateDepartment (blocks dept updates)
│   ├── 3. server.js dashboard routes (blocks dashboard)
│   ├── 4. Create approveLeave endpoint (blocks leave workflow)
│   ├── 5. deleteDepartment cascade (prevents orphans)
│   ├── 6. Remove duplicate routes (routing conflict)
│   ├── 7. addSalary notes field (data loss)
│   └── 8. markAttendence duplicates (silent failures)
│
├── P3: Security (do soon after P1)
│   ├── 1. Add authorization checks (2 each in 3 files)
│   ├── 2. Hide passwords (2 files)
│   ├── 3. Validate register role (1 file)
│   └── 4. Remove debug logging (1 file)
│
├── P2: Data Integrity (next)
│   ├── 1. Date validation (1 file)
│   ├── 2. Populate head (1 file)
│   ├── 3. Salary pre-save (2 files)
│   ├── 4. Leave counts filtering (3 files)
│   └── 5. Leave balance fields (1 file)
│
├── P4: Performance (backlog)
│   ├── 1. Add indexes (1 file)
│   └── 2. Add pagination (2 files)
│
└── P5: Improvement (future)
    ├── 1. Move DB config to .env (1 file)
    └── 2. Implement soft delete (all models)
```

---

## Estimated Fix Timeline

### Day 1: Critical Issues (60-90 min)
- [ ] Fix department field mismatches (4 min) - 2 files
- [ ] Register dashboard routes (2 min)
- [ ] Create approveLeave endpoint (15 min)
- [ ] Add cascade check to deleteDepartment (5 min)
- [ ] Remove duplicate leave routes (2 min)
- [ ] Fix addSalary notes (2 min)
- [ ] Fix attendance duplicates (10 min)
- **Subtotal: 40 min**

### Day 2: Security (35-40 min)
- [ ] Add authorization checks (15 min) - 3 files
- [ ] Hide passwords (5 min) - 2 files
- [ ] Force employee role on register (2 min)
- [ ] Remove debug logging (1 min)
- **Subtotal: 23 min**

### Day 3: Data Integrity (30-35 min)
- [ ] Add date validation to addLeave (5 min)
- [ ] Populate department head (2 min)
- [ ] Add salary pre-save hook (5 min)
- [ ] Add filtering to leave counts (10 min)
- [ ] Add leave balance fields (3 min)
- **Subtotal: 25 min**

### Backlog: Performance & Improvement (15 min)
- [ ] Add indexes (5 min)
- [ ] Add pagination (5 min)
- [ ] Move DB config (1 min)

**Total Estimated Time: ~2-2.5 hours for all fixes**

---

## Testing Checklist

### P1 Tests
- [ ] Create department - verify with correct field name
- [ ] Update department - verify changes save
- [ ] Delete department with employees - should fail
- [ ] Dashboard endpoints respond
- [ ] Leave approval endpoint works
- [ ] Add salary - no undefined fields
- [ ] Attendance duplicate prevention works
- [ ] Leave routes not duplicated

### P3 Tests
- [ ] Fetch employees doesn't include passwords
- [ ] Can't fetch other employee's salary (401)
- [ ] Can't fetch other employee's leave (401)
- [ ] Can't update other employee (401)
- [ ] Can't register as admin
- [ ] No auth headers in logs

### P2 Tests
- [ ] Leave with endDate < startDate rejected
- [ ] Department head populated with full object
- [ ] Salary netSalary calculated correctly
- [ ] Leave counts can be filtered by employee
- [ ] Attendance recordedBy validated

---

## Code Quality Improvements (After Fixes)

1. Add input validation middleware (express-validator)
2. Add error handling middleware
3. Add logging/auditing
4. Add request rate limiting
5. Add CORS whitelist
6. Add request size limits
7. Add helmet for security headers
8. Add comprehensive tests

---

