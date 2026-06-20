# Employee Management System - Route vs Schema Audit Report
**Generated: 2026-06-20**

---

## Executive Summary

This audit analyzed **6 models, 7 routes, 18 controllers, and 2 middleware files**. Found **32 issues** across data integrity, security, and functionality.

- **P1 (Critical/Crash):** 8 issues
- **P2 (Wrong Data):** 12 issues  
- **P3 (Security):** 7 issues
- **P4 (Performance):** 3 issues
- **P5 (Improvement):** 2 issues

---

## Main Issues Table

| Route | Schema Used | Problem | Impact | Fix | Priority |
|---------|---------|---------|---------|---------|---------|
| POST /api/auth/register | Employee | Role not validated; accepts any string | Could create invalid roles | Validate against enum ['admin', 'employee'] | P3 |
| POST /api/auth/register | Employee | Password returned in response | Exposes sensitive data | Remove password from response object | P3 |
| POST /api/auth/login | Employee | Logs all headers to console | Security exposure of all request data | Remove console.log(req.headers) | P3 |
| POST /api/employee/addemployee | Employee | Department validation weak | Will crash if invalid dept ID | Already has validation (GOOD) | - |
| GET /api/employee/fetchemployees | Employee | Returns password hashes | Exposes sensitive data to frontend | Select exclude password field | P3 |
| GET /api/employee/fetchemployees | Employee | No role-based filtering | Admins and employees see all data | Add role-based access control | P3 |
| PUT /api/employee/updateemployee/:id | Employee | No authorization check on resource | Employee can update any employee | Validate req.user.id == employeeId OR admin | P3 |
| DELETE /api/employee/deleteemployee/:id | Employee | No authorization check; no soft delete | Lost employee history | Add soft delete flag or archive employees | P2 |
| POST /api/employee/addsalary | Salary | Field mismatch: `notes` not in schema | Controller saves to undefined field | Remove `notes` or add to schema | P2 |
| POST /api/employee/addsalary | Salary | Net salary calculated in controller | Should be in schema pre-save hook | Move calculation to schema.pre('save') | P4 |
| GET /api/employee/fetchsalaryhistory/:employeeId | Salary | No authorization on employee ID | Employee can fetch any employee's salary | Validate req.user.id == employeeId OR admin | P3 |
| GET /api/employee/fetchsalaryhistory/:employeeId | Salary | Returns salary data without verification | Accepts any ID format | Add validation for MongoDB ObjectId | P2 |
| POST /api/employee/addleave | Leave | No leave balance check | Employee can request unlimited leaves | Add leave balance field to Employee schema | P2 |
| POST /api/employee/addleave | Leave | Missing date validation | endDate can be before startDate | Add validation: endDate > startDate | P2 |
| GET /api/employee/fetchleave/:employeeId | Leave | No authorization check | Employee can fetch any employee's leaves | Validate req.user.id == employeeId OR admin | P3 |
| GET /api/employee/fetchleave/:employeeId | Leave | Missing leave approval endpoint | No way to approve/reject leaves | Create POST /approveleave/:leaveId endpoint | P1 |
| GET /api/employee/fetchapprovedleavescount | Leave | Counts all approvals globally | No employee or date filtering | Add employee/department/date filtering | P2 |
| GET /api/employee/fetchpendingleavescount | Leave | Counts all pending globally | Should filter by requester | Add employee/department/date filtering | P2 |
| GET /api/employee/fetchrejectedleavescount | Leave | Counts all rejections globally | Should filter by requester | Add employee/department/date filtering | P2 |
| POST /api/department/adddepartment | Department | **CRITICAL: Schema field mismatch** | Controller uses `dep_name` but schema uses `name` | Change controller: `name: departmentName` | P1 |
| GET /api/department/fetchdepartment | Department | Missing department head population | Returns null/empty head data | Add .populate('head', 'name email') | P2 |
| PUT /api/department/updatedepartment/:id | Department | **CRITICAL: Schema field mismatch** | Controller uses `dep_name` but schema uses `name` | Change controller: `name: departmentName` | P1 |
| PUT /api/department/updatedepartment/:id | Department | No validation for department head | Can set non-existent employee as head | Add validation: if head provided, verify Employee exists | P2 |
| DELETE /api/department/deletedepartment/:id | Department | No cascade delete check | Deletes dept even if employees reference it | Check Employee.find({department: id}) first | P1 |
| POST /api/attendance/markattendance | Attendance | recordedBy not validated | Could be null or invalid ID | Validate recordedBy is valid admin ID | P2 |
| POST /api/attendance/markattendance | Attendance | No duplicate date check per employee | Could create multiple records same day | Leverage existing unique index (employee, date) | P1 |
| POST /api/attendance/markattendance | Attendance | Date format flexible; no validation | Could accept invalid dates | Add date validation and normalization | P2 |
| GET /api/dashboard/fetchemployeecount | Employee | Counts only 'employee' role | Doesn't distinguish admins | Clarify intent; consider active/inactive | P4 |
| GET /api/dashboard/fetchdepartmentcount | Department | No filtering by active status | Includes deleted departments | Add soft-delete support | P4 |
| GET /api/dashboard/{leave-counts} | Leave | Routes duplicated in employeeRoute | Same endpoints in two route files | Remove from employeeRoute, keep only in dashboardRoute | P1 |
| Dashboard routes | - | **Routes not registered in server.js** | Endpoints not accessible | Add: app.use('/api/dashboard', dashboardRoute) | P1 |
| All routes | - | Missing input validation middleware | No centralized validation | Add express-validator or joi middleware | P2 |

---

## Detailed Issues by Priority

### P1: Application Crash (8 Issues)

#### 1. **addDepartment Field Mismatch** ⚠️ CRITICAL
- **File:** [controllers/department/addDepartment.js](controllers/department/addDepartment.js)
- **Issue:** Controller searches for `dep_name` but schema field is `name`
```javascript
// WRONG:
const existingDepartment = await Department.findOne({ dep_name: departmentName });
// CORRECT:
const existingDepartment = await Department.findOne({ name: departmentName });

// WRONG:
const newDepartment = new Department({
    dep_name: departmentName,  // ❌ Field doesn't exist
    description: departmentDescription,
});
// CORRECT:
const newDepartment = new Department({
    name: departmentName,      // ✅ Matches schema
    description: departmentDescription,
});
```
- **Impact:** Department creation will ALWAYS FAIL. Saves invalid document structure.
- **Fix:** Change `dep_name` → `name` in [addDepartment.js](controllers/department/addDepartment.js)

#### 2. **updateDepartment Field Mismatch** ⚠️ CRITICAL
- **File:** [controllers/department/updateDepartment.js](controllers/department/updateDepartment.js)
- **Issue:** Same as addDepartment - uses `dep_name` instead of `name`
```javascript
// WRONG:
const departmentUpdated = await Department.findByIdAndUpdate(
    departmentId,
    { dep_name: departmentName, description: departmentDescription }
);
```
- **Impact:** Department updates will FAIL silently (only description updates).
- **Fix:** Change `dep_name` → `name` in [updateDepartment.js](controllers/department/updateDepartment.js)

#### 3. **Dashboard Routes Not Registered**
- **File:** [server.js](server.js)
- **Issue:** Routes defined but not mounted in Express app
```javascript
// Missing in server.js:
const dashboardRoute = require('./routes/dashboardRoute');
app.use('/api/dashboard', dashboardRoute);
```
- **Impact:** All dashboard endpoints return 404
- **Fix:** Add dashboard route registration to [server.js](server.js)

#### 4. **Missing Leave Approval Endpoint**
- **File:** [routes/employeeRoute.js](routes/employeeRoute.js)
- **Issue:** No controller/route to approve or reject leave requests
- **Impact:** Leave requests stuck in 'pending' status forever
- **Fix:** Create new controller `controllers/employee/approveLeave.js` and route POST `/approveleave/:leaveId`

#### 5. **deleteDepartment Cascade Failure**
- **File:** [controllers/department/deleteDepartment.js](controllers/department/deleteDepartment.js)
- **Issue:** Deletes department even if employees still reference it (foreign key violation)
```javascript
// Current code just deletes
const departmentDeleted = await Department.findByIdAndDelete(departmentId);

// Should verify no employees reference it:
const employeeCount = await Employee.countDocuments({ department: departmentId });
if (employeeCount > 0) {
    return res.status(400).json({ 
        error: `Cannot delete - ${employeeCount} employees assigned to this department` 
    });
}
```
- **Impact:** Orphaned employee records with invalid department references
- **Fix:** Add validation check before deletion in [deleteDepartment.js](controllers/department/deleteDepartment.js)

#### 6. **Duplicate Leave Count Routes**
- **File:** [routes/employeeRoute.js](routes/employeeRoute.js) and [routes/dashboardRoute.js](routes/dashboardRoute.js)
- **Issue:** Same routes defined in two files, routes not registered in server
- **Impact:** Confusion about which endpoint works; conflicts if both registered
- **Fix:** Keep only in dashboardRoute, remove from employeeRoute

#### 7. **Attendance Duplicate Records (Data Loss)**
- **File:** [controllers/attendence/markAttendence.js](controllers/attendence/markAttendence.js)
- **Issue:** `insertMany` with `ordered: false` silently fails on duplicates
```javascript
// Schema already has unique index: { employee: 1, date: 1 }
// But insertMany doesn't fail, just skips:
await Attendance.insertMany(records, { ordered: false });
// This returns success even if records were duplicate
```
- **Impact:** Some attendance records silently not saved without user knowing
- **Fix:** Handle duplicates explicitly with try-catch or check before insert

#### 8. **addSalary Schema Mismatch**
- **File:** [controllers/employee/addSalary.js](controllers/employee/addSalary.js)
- **Issue:** Controller passes `notes` field but it's not in schema
```javascript
// Controller code:
const newSalary = new Salary({
    employee: employee._id,
    baseSalary,
    allowances,
    deductions,
    netSalary,
    periodStart,
    periodEnd,
    notes  // ❌ Not in schema!
});
```
- **Impact:** `notes` field is silently ignored; data loss
- **Fix:** Either remove `notes` from controller or add field to schema

---

### P2: Wrong Data Returned (12 Issues)

#### 1. **fetchEmployees Returns Passwords**
- **File:** [controllers/employee/fetchEmployees.js](controllers/employee/fetchEmployees.js)
- **Issue:** Returns complete employee objects including password hashes
```javascript
// CURRENT - Returns everything:
const employees = await Employee.find().populate('department', 'name');

// SHOULD BE:
const employees = await Employee.find()
    .select('-password')  // Exclude password
    .populate('department', 'name');
```
- **Impact:** Security risk - frontend/APIs expose password hashes; can be cracked
- **Fix:** Add `.select('-password')` to [fetchEmployees.js](controllers/employee/fetchEmployees.js)

#### 2. **register Returns Password in Response**
- **File:** [controllers/userRegister.js](controllers/userRegister.js)
- **Issue:** While response only returns userId, registration flow may expose data
- **Impact:** Potential information leakage through API debugging
- **Fix:** Explicitly exclude sensitive fields in response

#### 3. **fetchDepartment Missing Head Relation**
- **File:** [controllers/department/fetchDepartment.js](controllers/department/fetchDepartment.js)
- **Issue:** Returns department with `head` as just an ObjectId, not populated
```javascript
// CURRENT:
const departments = await Department.find();
// Returns: { _id, name, description, head: ObjectId("...") }

// SHOULD BE:
const departments = await Department.find()
    .populate('head', 'name email designation');
// Returns: { _id, name, description, head: { _id, name, email, designation } }
```
- **Impact:** Frontend needs separate query to get department head details
- **Fix:** Add populate to [fetchDepartment.js](controllers/department/fetchDepartment.js)

#### 4. **fetchSalaryHistory Returns Unknown Data**
- **File:** [controllers/employee/fetchSalaryHistory.js](controllers/employee/fetchSalaryHistory.js)
- **Issue:** No validation that `employeeId` parameter is valid ObjectId; might accept garbage
- **Impact:** Could return unintended data or throw unhandled error
- **Fix:** Add ObjectId validation before query

#### 5. **Leave Count Queries Missing Filters**
- **Files:** [fetchApprovedLeaveCount.js](controllers/dashboard/fetchApprovedLeaveCount.js), [fetchPendingLeaveCount.js](controllers/dashboard/fetchPendingLeaveCount.js), [fetchRejectedLeaveCount.js](controllers/dashboard/fetchRejectedLeaveCount.js)
- **Issue:** Returns global counts without employee/date/department filtering
```javascript
// CURRENT:
const approvedLeaveCount = await Leave.countDocuments({ status: 'approved' });
// Returns total approved leaves for ENTIRE SYSTEM

// Should allow filtering:
const approvedLeaveCount = await Leave.countDocuments({ 
    status: 'approved',
    employee: employeeId,  // Optional filter
    startDate: { $gte: new Date(startOfMonth) }  // Date range
});
```
- **Impact:** Dashboard shows incorrect data; can't filter by department or time period
- **Fix:** Add optional query parameters for employee/department/date filtering

#### 6. **Attendance recordedBy Not Validated**
- **File:** [controllers/attendence/markAttendence.js](controllers/attendence/markAttendence.js)
- **Issue:** Sets `recordedBy` to `req.user.id` without verification
```javascript
recordedBy: req.user ? req.user.id : undefined  // Could be undefined!
```
- **Impact:** Attendance records with null `recordedBy`; audit trail broken
- **Fix:** Validate req.user exists and is an admin

#### 7. **addLeave Missing End Date Validation**
- **File:** [controllers/employee/addLeave.js](controllers/employee/addLeave.js)
- **Issue:** No validation that endDate > startDate
```javascript
// Missing validation:
if (new Date(endDate) <= new Date(startDate)) {
    return res.status(400).json({ error: "End date must be after start date" });
}
```
- **Impact:** Can create leave records with backwards dates; wrong leave duration calculations
- **Fix:** Add date validation to [addLeave.js](controllers/employee/addLeave.js)

#### 8. **updateDepartment Silent Failures**
- **File:** [controllers/department/updateDepartment.js](controllers/department/updateDepartment.js)
- **Issue:** Uses wrong field name - updates will silently not update the name
- **Impact:** Department name change requests fail silently
- **Fix:** See P1 fix #2

#### 9. **Salary Calculation in Controller**
- **File:** [controllers/employee/addSalary.js](controllers/employee/addSalary.js)
- **Issue:** Net salary calculated in controller, should be in schema
```javascript
// CURRENT - Calculated here:
const netSalary = baseSalary + Number(allowances) - Number(deductions);

// SHOULD BE - In schema pre-save:
salarySchema.pre('save', function() {
    this.netSalary = this.baseSalary + this.allowances - this.deductions;
});
```
- **Impact:** Inconsistent calculations if updated from different places; no validation
- **Fix:** Move calculation to [salarySchema.js](models/salarySchema.js) pre-save hook

#### 10. **Employee Count Only Counts 'employee' Role**
- **File:** [controllers/dashboard/fetchEmpoyeeCount.js](controllers/dashboard/fetchEmpoyeeCount.js)
- **Issue:** Explicitly filters for role='employee', excludes admins
```javascript
const totalEmployees = await Employee.countDocuments({ role: 'employee' });
```
- **Impact:** Total employee count misleading; doesn't include admin employees
- **Fix:** Decide if should count all or add parameter for filtering

#### 11. **Missing Leave Balance Tracking**
- **Schema:** [leaveSchema.js](models/leaveSchema.js)
- **Issue:** No field to track leave balance or entitlements
- **Impact:** Can't prevent employees from taking more leave than allocated
- **Fix:** Add `leavesPerYear` and `leavesTaken` fields to Employee schema

#### 12. **Department Head Validation Missing**
- **File:** [controllers/department/updateDepartment.js](controllers/department/updateDepartment.js)
- **Issue:** Can set invalid Employee ID as department head
- **Impact:** Department references non-existent or non-employee records
- **Fix:** Add Employee.findById() verification before setting head

---

### P3: Security Risks (7 Issues)

#### 1. **No Authorization on Personal Data Access**
- **Files:** [fetchSalaryHistory.js](controllers/employee/fetchSalaryHistory.js), [fetchLeave.js](controllers/employee/fetchLeave.js)
- **Issue:** Employee can access any other employee's salary and leave records
```javascript
// CURRENT - No check:
const salaryHistory = await Salary.find({ employee: employeeId });

// SHOULD BE:
if (req.user.id !== employeeId && req.user.role !== 'admin') {
    return res.status(403).json({ error: "Unauthorized" });
}
```
- **Impact:** Data breach - employees can view private information
- **Fix:** Add authorization checks to [fetchSalaryHistory.js](controllers/employee/fetchSalaryHistory.js) and [fetchLeave.js](controllers/employee/fetchLeave.js)

#### 2. **No Authorization on Employee Update**
- **File:** [controllers/employee/updateEmployee.js](controllers/employee/updateEmployee.js)
- **Issue:** Any authenticated user can update any employee
- **Impact:** Employee can modify other employees' records
- **Fix:** Add check: if not admin and not updating self, return 403

#### 3. **console.log Exposes Headers**
- **File:** [middleware/authMiddleware.js](middleware/authMiddleware.js)
- **Issue:** `console.log(req.headers)` logs all headers including auth tokens
```javascript
console.log(req.headers)  // ❌ Logs "Authorization: Bearer <token>"
```
- **Impact:** Tokens exposed in logs; production security risk
- **Fix:** Remove console.log from [authMiddleware.js](middleware/authMiddleware.js)

#### 4. **Passwords Exposed in Responses**
- **File:** [controllers/userRegister.js](controllers/userRegister.js)
- **Issue:** While minimized, registration flow could expose data
- **Impact:** Information leakage through logs or error messages
- **Fix:** Ensure no password data in any response

#### 5. **No Validation on Register Role Parameter**
- **File:** [controllers/userRegister.js](controllers/userRegister.js)
- **Issue:** User can register themselves as 'admin'
```javascript
const newEmployee = new Employee({
    name,
    email,
    password: hashedPassword,
    role  // ❌ Accepts any role user sends!
});
```
- **Impact:** Privilege escalation - anyone can become admin
- **Fix:** Force role='employee' on registration, only admins can set other roles

#### 6. **JWT Secret Exposed in Code**
- **File:** [controllers/userLogin.js](controllers/userLogin.js)
- **Issue:** JWT_SECRET from .env (good) but console.log in middleware (bad)
- **Impact:** Logging could expose secret in production
- **Fix:** Remove debug logging

#### 7. **No Rate Limiting on Auth Endpoints**
- **Files:** [userRegister.js](controllers/userRegister.js), [userLogin.js](controllers/userLogin.js)
- **Issue:** No protection against brute force or mass registration
- **Impact:** Attackers can guess passwords or create spam accounts
- **Fix:** Add rate limiting middleware (e.g., express-rate-limit)

---

### P4: Performance Issues (3 Issues)

#### 1. **Missing Index on Department.head**
- **File:** [models/departmentSchema.js](models/departmentSchema.js)
- **Issue:** `head` field has no index but will be queried
- **Impact:** Queries like "find departments by head" will scan all records
- **Fix:** Add `departmentSchema.index({ head: 1 });`

#### 2. **Salary Calculation Repeated**
- **File:** [controllers/employee/addSalary.js](controllers/employee/addSalary.js)
- **Issue:** Net salary calculated in controller instead of database
- **Impact:** If calculation logic changes, old records have incorrect values; inconsistent state
- **Fix:** Move to schema pre-save hook

#### 3. **No Pagination on Fetch Endpoints**
- **Files:** [fetchEmployees.js](controllers/employee/fetchEmployees.js), [fetchDepartment.js](controllers/department/fetchDepartment.js)
- **Issue:** Fetches all records without limit
- **Impact:** Large datasets cause memory issues; slow responses
- **Fix:** Add skip/limit parameters

---

### P5: Improvements (2 Issues)

#### 1. **Database Connection Hardcoded**
- **File:** [connectToDatabase.js](connectToDatabase.js)
- **Issue:** MongoDB connection string hardcoded; not in .env
```javascript
await mongoose.connect('mongodb://localhost:27017/EM')  // ❌ Hardcoded
```
- **Fix:** Move to .env: `MONGODB_URI=mongodb://localhost:27017/EM`

#### 2. **No Soft Delete Support**
- **Issue:** Deleted employees/departments have no audit trail
- **Impact:** Can't recover deleted data; GDPR compliance issues
- **Fix:** Add `deletedAt` field to all schemas; implement soft delete queries

---

## Schema Relationships & Missing Fields

### Current Entity Relationships
```
Employee
  ├── department → Department._id
  └── role: ['admin', 'employee']

Department  
  ├── head → Employee._id
  └── employees (implicit - via Employee.department)

Leave
  └── employee → Employee._id

Attendance
  ├── employee → Employee._id
  └── recordedBy → Employee._id (admin)

Salary
  └── employee → Employee._id
```

### Missing Relationships
1. **Employee ← Department** (Inverse): Should query "get all employees in department" efficiently
2. **Leave ← Employee**: Needs leave balance tracking
3. **Salary ← Department**: Needs "total payroll by department"
4. **Attendance ← Department**: Needs "attendance stats by department"

### Missing Schema Fields

#### Employee Schema Missing:
- `leaveBalance`: Number (annual leaves remaining)
- `leavesTaken`: [Date] (dates taken for analytics)
- `deletedAt`: Date (soft delete)
- `lastLoginAt`: Date (audit)
- `createdBy`: ObjectId → Employee (who created this record)

#### Leave Schema Missing:
- `reviewedBy`: ObjectId → Employee (who approved/rejected)
- `comments`: String (rejection reason)
- `coveringEmployee`: ObjectId → Employee (who covers during leave)
- `deletedAt`: Date (soft delete)

#### Attendance Schema Missing:
- `checkInTime`: Time
- `checkOutTime`: Time
- `workingHours`: Number
- `overtimeHours`: Number
- `deletedAt`: Date (soft delete)

#### Salary Schema Missing:
- `notes`: String (mentioned in controller but not schema)
- `approvedBy`: ObjectId → Employee
- `paymentMethod`: String ['bank_transfer', 'cash', 'check']
- `paymentStatus`: String ['pending', 'paid', 'failed']
- `deletedAt`: Date (soft delete)

#### Department Schema Missing:
- `budget`: Number
- `employees`: [ObjectId] (inverse relationship)
- `isActive`: Boolean
- `deletedAt`: Date (soft delete)

---

## Unused Schema Fields

### Employee Schema
- `isActive` field exists but never used in any controller
- `status` field has enum but not validated in updates

### Leave Schema
- `appliedAt` field is redundant with `timestamps: true` createdAt

---

## Routes That Will Throw ValidationError

| Route | Error Scenario | Current Behavior |
|-------|---|---|
| POST /api/department/adddepartment | Invalid department name (e.g., duplicate) | Returns "already exists" but wrong field lookup |
| POST /api/employee/addleave | End date before start date | No validation - silently creates invalid record |
| POST /api/attendance/markattendance | Duplicate (employee + date) | Silently fails with ordered:false |
| POST /api/employee/addsalary | Negative salary | Schema allows - no min validation on baseSalary |
| POST /api/auth/register | Missing password | Returns 400 (GOOD) |
| GET /api/employee/fetchsalaryhistory/:invalid_id | Invalid MongoDB ObjectId | May throw casting error |

---

## Routes That Can Return Null/Incorrect Data

| Route | Scenario | Returned Data |
|-------|---|---|
| GET /api/employee/fetchemployees | Large dataset | All employees (no pagination) |
| GET /api/department/fetchdepartment | Department with head | head: ObjectId (not populated) |
| GET /api/dashboard/fetchapprovedleavescount | Date range not specified | Global count (wrong for dashboard) |
| GET /api/employee/fetchsalaryhistory/:id | Invalid ID format | Might crash or return empty |
| GET /api/employee/fetchleave/:id | Non-existent employee | Empty array (should be 404) |

---

## Complete Issues Ranked by Priority

### P1: Application Crash (Blocks Functionality)
1. ✗ addDepartment field mismatch (`dep_name` vs `name`)
2. ✗ updateDepartment field mismatch (`dep_name` vs `name`)  
3. ✗ Dashboard routes not registered in server
4. ✗ Missing leave approval/rejection endpoint
5. ✗ deleteDepartment no cascade check (orphaned records)
6. ✗ Duplicate leave count routes (routing conflict)
7. ✗ Attendance duplicate records silently ignored
8. ✗ addSalary undefined `notes` field

### P2: Wrong Data (Incorrect Business Logic)
1. fetchEmployees returns password hashes
2. fetchDepartment missing head population
3. fetchSalaryHistory no ObjectId validation
4. Leave counts missing employee/date filtering (6 places)
5. Attendance recordedBy not validated
6. addLeave missing endDate > startDate validation
7. updateDepartment silent failures
8. Salary calculation in controller (not schema)
9. Employee count includes only 'employee' role
10. Department head validation missing
11. Missing leave balance tracking system
12. No leave balance enforcement

### P3: Security Risk (Access Control & Data Exposure)
1. fetchSalaryHistory no authorization (data breach)
2. fetchLeave no authorization (data breach)
3. updateEmployee no authorization (anyone can modify anyone)
4. console.log exposes auth headers
5. register allows user-chosen role (privilege escalation)
6. Passwords exposed in response flow
7. No rate limiting on auth endpoints

### P4: Performance (Slow Queries)
1. Missing index on Department.head
2. Salary calculation duplicated (not in schema)
3. No pagination on fetch endpoints

### P5: Improvement (Code Quality)
1. Database connection hardcoded (not in .env)
2. No soft delete support (no audit trail)

---

## Files to Fix (In Priority Order)

### CRITICAL - Fix First (P1)
- [ ] [controllers/department/addDepartment.js](controllers/department/addDepartment.js) - Change `dep_name` → `name` (2 places)
- [ ] [controllers/department/updateDepartment.js](controllers/department/updateDepartment.js) - Change `dep_name` → `name` (2 places)
- [ ] [server.js](server.js) - Add dashboard route registration
- [ ] Create [controllers/employee/approveLeave.js](controllers/employee/approveLeave.js) - New leave approval controller
- [ ] [controllers/department/deleteDepartment.js](controllers/department/deleteDepartment.js) - Add cascade check
- [ ] [routes/employeeRoute.js](routes/employeeRoute.js) - Remove duplicate leave count routes
- [ ] [controllers/attendence/markAttendence.js](controllers/attendence/markAttendence.js) - Handle duplicates properly
- [ ] [controllers/employee/addSalary.js](controllers/employee/addSalary.js) - Remove `notes` parameter

### HIGH PRIORITY - Security (P3)
- [ ] [controllers/employee/fetchSalaryHistory.js](controllers/employee/fetchSalaryHistory.js) - Add authorization check
- [ ] [controllers/employee/fetchLeave.js](controllers/employee/fetchLeave.js) - Add authorization check
- [ ] [controllers/employee/updateEmployee.js](controllers/employee/updateEmployee.js) - Add authorization check
- [ ] [middleware/authMiddleware.js](middleware/authMiddleware.js) - Remove console.log
- [ ] [controllers/userRegister.js](controllers/userRegister.js) - Force role='employee'
- [ ] [controllers/employee/fetchEmployees.js](controllers/employee/fetchEmployees.js) - Add select('-password')

### MEDIUM PRIORITY - Data Integrity (P2)
- [ ] [controllers/employee/addLeave.js](controllers/employee/addLeave.js) - Add date validation
- [ ] [controllers/department/fetchDepartment.js](controllers/department/fetchDepartment.js) - Add populate('head')
- [ ] [models/salarySchema.js](models/salarySchema.js) - Add pre-save calculation hook
- [ ] [controllers/dashboard/fetchApprovedLeaveCount.js](controllers/dashboard/fetchApprovedLeaveCount.js) - Add filtering
- [ ] [controllers/dashboard/fetchPendingLeaveCount.js](controllers/dashboard/fetchPendingLeaveCount.js) - Add filtering
- [ ] [controllers/dashboard/fetchRejectedLeaveCount.js](controllers/dashboard/fetchRejectedLeaveCount.js) - Add filtering
- [ ] [models/employeeSchema.js](models/employeeSchema.js) - Add leave balance fields

### LOW PRIORITY - Performance & Code Quality (P4-P5)
- [ ] [models/departmentSchema.js](models/departmentSchema.js) - Add index on head
- [ ] [connectToDatabase.js](connectToDatabase.js) - Move connection string to .env
- [ ] [controllers/employee/fetchEmployees.js](controllers/employee/fetchEmployees.js) - Add pagination

---

## Recommended Actions

### Immediate (This Sprint)
1. Fix P1 issues (8 issues) - These block basic functionality
2. Fix P3 security issues (7 issues) - Prevent data breaches

### Next Sprint  
1. Fix P2 data integrity (12 issues)
2. Add input validation middleware
3. Create leave approval workflow

### Future
1. Implement P4 performance improvements
2. Add comprehensive audit logging
3. Implement soft delete for all entities
4. Add role-based access control (RBAC) middleware

---

## Test Cases to Add

```javascript
// test/department.test.js
describe('Department API', () => {
    it('should create department with name field', async () => {
        const res = await addDepartment({ name: 'IT' });
        expect(res.department.name).toBe('IT');
    });
    
    it('should fail creating duplicate departments', async () => {
        const res = await addDepartment({ name: 'IT' });
        expect(res.status).toBe(400);
    });
    
    it('should prevent deleting department with employees', async () => {
        // Add employee to department first
        const res = await deleteDepartment(deptId);
        expect(res.status).toBe(400);
    });
});

// test/leave.test.js
describe('Leave API', () => {
    it('should reject leave with endDate before startDate', async () => {
        const res = await addLeave({
            startDate: '2025-01-15',
            endDate: '2025-01-10'
        });
        expect(res.status).toBe(400);
    });
    
    it('should allow admin to approve/reject leave', async () => {
        const res = await approveLeave(leaveId, { approved: true });
        expect(res.success).toBe(true);
    });
});

// test/auth.test.js
describe('Auth API', () => {
    it('should not allow registering as admin', async () => {
        const res = await register({
            name: 'John',
            email: 'john@test.com',
            password: 'pass',
            role: 'admin'
        });
        expect(res.employee.role).toBe('employee');
    });
    
    it('should not expose password in register response', async () => {
        const res = await register({ ...userData });
        expect(res.password).toBeUndefined();
    });
});
```

---

## Conclusion

This system has **fundamental issues** that need immediate attention:

- **8 P1 issues** make features completely broken (especially departments and leaves)
- **7 P3 issues** create security vulnerabilities (data access control)
- **12 P2 issues** cause incorrect data/calculations

**Recommended**: Address all P1 and P3 issues within 2-3 days. Implement proper validation and authorization throughout.

