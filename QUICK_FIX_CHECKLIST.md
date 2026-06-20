<!-- # Quick Fix Checklist - Employee Management System

## 🔴 CRITICAL - Must Fix Today (P1 - App Crash)

### 1. Department Schema Field Mismatch (2 Files)
**Problem**: `dep_name` used but schema uses `name`

**File 1**: `controllers/department/addDepartment.js`
```diff
- const existingDepartment = await Department.findOne({ dep_name: departmentName });
+ const existingDepartment = await Department.findOne({ name: departmentName });

- const newDepartment = new Department({
-     dep_name: departmentName,
-     description: departmentDescription,
- });
+ const newDepartment = new Department({
+     name: departmentName,
+     description: departmentDescription,
+ });
```

**File 2**: `controllers/department/updateDepartment.js`
```diff
- const departmentUpdated = await Department.findByIdAndUpdate(
-     departmentId,
-     {
-         dep_name: departmentName,
-         description: departmentDescription
-     }, 
-     { new: true }
- )
+ const departmentUpdated = await Department.findByIdAndUpdate(
+     departmentId,
+     {
+         name: departmentName,
+         description: departmentDescription
+     }, 
+     { new: true }
+ )
```

### 2. Dashboard Routes Not Registered
**File**: `server.js`
```diff
+ const dashboardRoute = require('./routes/dashboardRoute');
  
  app.use('/api/auth', authRoute);
  app.use('/api/admin', adminRoute);
  app.use('/api/employee', employeeRoute);
  app.use('/api/attendance', attendanceRoutes);
+ app.use('/api/dashboard', dashboardRoute);
```

### 3. Missing Leave Approval Endpoint
**Create new file**: `controllers/employee/approveLeave.js`
```javascript
const { Leave } = require('../../models/leaveSchema');
const { Employee } = require('../../models/employeeSchema');

async function approveLeave(req, res) {
    try {
        const leaveId = req.params.leaveId;
        const { approved, comments } = req.body;

        if (!leaveId) {
            return res.status(400).json({ error: "Leave ID required" });
        }

        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ error: "Leave not found" });
        }

        leave.status = approved ? 'approved' : 'rejected';
        leave.reviewedAt = new Date();
        leave.reviewedBy = req.user.id;
        if (comments) leave.comments = comments;

        await leave.save();
        return res.status(200).json({ 
            success: true, 
            message: `Leave ${approved ? 'approved' : 'rejected'}`,
            leave 
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { approveLeave };
```

**Add to**: `routes/employeeRoute.js`
```javascript
const { approveLeave } = require('../controllers/employee/approveLeave');
router.put('/approveleave/:leaveId', authMiddleware, checkAdmin, approveLeave);
```

### 4. Delete Department Cascade Check
**File**: `controllers/department/deleteDepartment.js`
```diff
+ const { Employee } = require('../../models/employeeSchema');
  const { Department } = require('../../models/departmentSchema');

  async function deleteDepartment(req, res) {
      try {
          const departmentId = req.params.id;
+         
+         // Check if employees are assigned to this department
+         const employeeCount = await Employee.countDocuments({ department: departmentId });
+         if (employeeCount > 0) {
+             return res.status(400).json({ 
+                 msg: `Cannot delete - ${employeeCount} employees assigned to this department` 
+             });
+         }
          
          const departmentDeleted = await Department.findByIdAndDelete(departmentId);
          if (!departmentDeleted) {
              return res.status(404).json({ msg: 'No department found' });
          }
          return res.status(200).json({ msg: 'Department deleted successfully' });
      } catch (error) {
          return res.status(500).json({ error: error.message });
      }
  }
```

### 5. Fix addSalary Schema Field
**File**: `controllers/employee/addSalary.js`
```diff
  const newSalary = new Salary({
      employee: employee._id,
      baseSalary,
      allowances,
      deductions,
      netSalary,
      periodStart,
      periodEnd,
-     notes
  });
```

### 6. Remove Duplicate Leave Routes
**File**: `routes/employeeRoute.js`
```diff
  // Remove these lines (duplicated from dashboardRoute):
- router.get('/fetchapprovedleavescount', authMiddleware, fetchApprovedLeaveCount);
- router.get('/fetchpendingleavescount', authMiddleware, fetchPendingLeaveCount);
- router.get('/fetchrejectedleavescount', authMiddleware, fetchRejectedLeaveCount);
``` -->

### 7. Fix Attendance Duplicates
**File**: `controllers/attendence/markAttendence.js`
```diff
+ // Check for existing records first
+ const existingIds = new Set();
+ const validRecords = [];
+ for (const item of attendanceData) {
+     const key = `${item.employeeId}-${new Date(item.date).toDateString()}`;
+     if (!existingIds.has(key)) {
+         existingIds.add(key);
+         validRecords.push(item);
+     }
+ }

- await Attendance.insertMany(records, { ordered: false });
+ if (validRecords.length === 0) {
+     return res.status(400).json({
+         success: false,
+         message: 'All records are duplicates'
+     });
+ }
+ 
+ await Attendance.insertMany(validRecords, { ordered: false });
```

---

## 🟠 HIGH PRIORITY - Security (P3 - Data Breach)

<!-- ### 1. Hide Passwords in fetchEmployees
**File**: `controllers/employee/fetchEmployees.js`
```diff
- const employees = await Employee.find().populate('department', 'name');
+ const employees = await Employee.find()
+     .select('-password')
+     .populate('department', 'name');
```

### 2. Add Authorization to fetchSalaryHistory
**File**: `controllers/employee/fetchSalaryHistory.js`
```diff
  async function fetchSalaryHistory(req, res) {
      try {
          const employeeId = req.params.employeeId;
+         
+         // Authorization check
+         if (req.user.id !== employeeId && req.user.role !== 'admin') {
+             return res.status(403).json({
+                 success: false,
+                 message: 'Unauthorized'
+             });
+         }
          
          const employee = await Employee.findById(employeeId);
```

### 3. Add Authorization to fetchLeave
**File**: `controllers/employee/fetchLeave.js`
```diff
  async function fetchLeave(req, res) {
      try {
          const { employeeId } = req.params;
+         
+         // Authorization check
+         if (req.user.id !== employeeId && req.user.role !== 'admin') {
+             return res.status(403).json({
+                 success: false,
+                 message: 'Unauthorized'
+             });
+         }
          
          if (!employeeId) {
```

### 4. Add Authorization to updateEmployee
**File**: `controllers/employee/updateEmployee.js`
```diff
  async function updateEmployee(req, res) {
      try {
          const employeeId = req.params.id;
+         
+         // Authorization check
+         if (req.user.id !== employeeId && req.user.role !== 'admin') {
+             return res.status(403).json({
+                 success: false,
+                 message: 'Unauthorized'
+             });
+         }
          
          const employee = await Employee.findById(employeeId);
```

### 5. Force Role to 'employee' on Register
**File**: `controllers/userRegister.js`
```diff
- const newEmployee = new Employee({
+ const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
-     role
+     role: 'employee'  // Always set to employee, admins created separately
  })
```

### 6. Remove Debug Logging
**File**: `middleware/authMiddleware.js`
```diff
  function authMiddleware(req, res, next) {
      const authHeader = req.headers.authorization;
-     console.log(req.headers)
      if (!authHeader) {
```

---

## 🟡 MEDIUM PRIORITY - Data Integrity (P2 - Wrong Data)

### 1. Add Date Validation to addLeave
**File**: `controllers/employee/addLeave.js`
```diff
  async function addLeave(req, res) {
      try {
          const { employeeId, leaveType, startDate, endDate, reason } = req.body;
          if (!employeeId || !leaveType || !startDate || !endDate) {
              return res.status(400).json({ success: false, message: 'All fields are required' });
          }
+         
+         if (new Date(endDate) <= new Date(startDate)) {
+             return res.status(400).json({ 
+                 success: false, 
+                 message: 'End date must be after start date' 
+             });
+         }
```

### 2. Populate Department Head
**File**: `controllers/department/fetchDepartment.js`
```diff
- const departments = await Department.find();
+ const departments = await Department.find()
+     .populate('head', 'name email designation');
```

### 3. Add Salary Calculation to Schema
**File**: `models/salarySchema.js`
```diff
  salarySchema.index({ employee: 1, payDate: -1 });

+ salarySchema.pre('save', function(next) {
+     this.netSalary = this.baseSalary + this.allowances - this.deductions;
+     next();
+ });
```

**Then remove from controller**: `controllers/employee/addSalary.js`
```diff
- const netSalary = baseSalary + Number(allowances) - Number(deductions);
  const newSalary = new Salary({
      employee: employee._id,
      baseSalary,
      allowances,
      deductions,
-     netSalary,
      periodStart,
      periodEnd,
  });
``` -->

### 3. Add Filtering to Leave Count Endpoints
**Files**: 
- `controllers/dashboard/fetchApprovedLeaveCount.js`
- `controllers/dashboard/fetchPendingLeaveCount.js`
- `controllers/dashboard/fetchRejectedLeaveCount.js`

```diff
- const approvedLeaveCount = await Leave.countDocuments({ status: 'approved' });
+ // Optional filtering by employee/department/date
+ const filter = { status: 'approved' };
+ 
+ if (req.query.employeeId) {
+     filter.employee = req.query.employeeId;
+ }
+ 
+ const approvedLeaveCount = await Leave.countDocuments(filter);
```

---

## Test the Fixes

```bash
# Test department creation
curl -X POST http://localhost:8000/api/department/adddepartment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"departmentName":"IT","departmentDescription":"Information Technology"}'

# Test leave with invalid dates
curl -X POST http://localhost:8000/api/employee/addleave \
  -H "Authorization: Bearer <token>" \
  -d '{
    "employeeId":"...",
    "leaveType":"sick",
    "startDate":"2025-01-15",
    "endDate":"2025-01-10"
  }'
# Should return 400 error

# Test password not exposed
curl http://localhost:8000/api/employee/fetchemployees \
  -H "Authorization: Bearer <token>" \
# Response should not include password field
```

---

## Summary

| Issue | File | Severity | Estimated Fix Time |
|-------|------|----------|-------------------|
| dep_name field mismatch | addDepartment.js | P1 | 2 min |
| dep_name field mismatch | updateDepartment.js | P1 | 2 min |
| Dashboard routes not registered | server.js | P1 | 2 min |
| Missing leave approval | New file | P1 | 15 min |
| Delete department cascade | deleteDepartment.js | P1 | 5 min |
| Salary notes field | addSalary.js | P1 | 2 min |
| Duplicate routes | employeeRoute.js | P1 | 2 min |
| Attendance duplicates | markAttendence.js | P1 | 10 min |
| Password exposure | fetchEmployees.js | P3 | 2 min |
| Salary history auth | fetchSalaryHistory.js | P3 | 5 min |
| Leave auth | fetchLeave.js | P3 | 5 min |
| Update auth | updateEmployee.js | P3 | 5 min |
| Role validation | userRegister.js | P3 | 2 min |
| Debug logging | authMiddleware.js | P3 | 1 min |
| Date validation | addLeave.js | P2 | 5 min |
| Populate head | fetchDepartment.js | P2 | 2 min |
| Salary pre-save | salarySchema.js | P2 | 5 min |

**Total Fix Time: ~70 minutes**

