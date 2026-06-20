# Schema Relationships & Data Model Analysis

## Current Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Employee Management System                           │
│                           Entity Relationships                              │
└─────────────────────────────────────────────────────────────────────────────┘

                              Employee
                         ┌──────────────┐
                         │              │
                         │ _id          │
                         │ name ✓       │
                         │ email ✓      │
                         │ password ✗ ← [SECURITY ISSUE]
                         │ role ✓       │
                         │ isActive ⚠️ ← [UNUSED]
                         │ department → │ ────────────┐
                         │ status ✓     │              │
                         │ ...other..   │              │
                         │              │              │
                         └──┬───────────┘              │
                            │                         │
                  ┌─────────┴─────────┐              │
                  │                   │              │
                  │                   │              │
            Referenced by:       Referenced by:      │
            - Attendance (emp)   - Leave (emp)       │
            - Leave (emp)        - Salary (emp)      │
            - Salary (emp)       - Attendance        │
                                                    │
                         Department ◄──────────────┘
                      ┌──────────────┐
                      │              │
                      │ _id          │
                      │ name ✓       │
                      │ description  │
                      │ head → Employee
                      │              │
                      │ ❌ ISSUES:   │
                      │ • No index   │
                      │ • Not soft   │
                      │   delete     │
                      │ • No budget  │
                      │              │
                      └──────────────┘


            Leave                          Attendance
         ┌──────────────┐              ┌──────────────┐
         │              │              │              │
         │ _id          │              │ _id          │
         │ employee →   │              │ employee →   │
         │ leaveType    │              │ date ✓       │
         │ startDate    │              │ status ✓     │
         │ endDate      │              │ remark       │
         │ reason       │              │ recordedBy   │
         │ status ✓     │              │   → Employee │
         │ appliedAt    │              │              │
         │ reviewedAt   │              │ ❌ ISSUES:   │
         │              │              │ • recordedBy │
         │ ❌ ISSUES:   │              │   not valid  │
         │ • No approval│              │ • Dups not   │
         │   endpoint   │              │   prevented  │
         │ • No dates   │              │ • Status not │
         │   validation │              │   validated  │
         │              │              │              │
         └──────────────┘              └──────────────┘


                           Salary
                        ┌──────────────┐
                        │              │
                        │ _id          │
                        │ employee →   │
                        │ baseSalary   │
                        │ allowances   │
                        │ deductions   │
                        │ netSalary    │
                        │ payDate      │
                        │ periodStart  │
                        │ periodEnd    │
                        │              │
                        │ ❌ ISSUES:   │
                        │ • notes      │
                        │   field in   │
                        │   controller │
                        │ • calc in    │
                        │   controller │
                        │ • No payment │
                        │   status     │
                        │              │
                        └──────────────┘
```

---

## Relationship Analysis

### Direct References
```javascript
// Employee → Department (Many-to-One)
Employee.department -> Department._id
Query: All employees in a department
Problem: ⚠️ No inverse query support (can't efficiently get dept → employees)

// Employee → Employee (Self-reference, Attendance.recordedBy)
Attendance.recordedBy -> Employee._id
Query: Who recorded this attendance?
Problem: ⚠️ Not validated; could be null or non-admin

// Department → Employee (One-to-One, Department.head)
Department.head -> Employee._id
Query: Who is the department head?
Problem: ⚠️ Not populated on fetch; not validated if exists

// Leave → Employee (Many-to-One)
Leave.employee -> Employee._id
Query: All leaves by employee
Problem: ✓ Has index; needs filtering by status

// Salary → Employee (Many-to-One)
Salary.employee -> Employee._id
Query: All salary records for employee
Problem: ✓ Has index; good

// Attendance → Employee (Many-to-One)
Attendance.employee -> Employee._id
Query: All attendance for employee
Problem: ✓ Has unique composite index (employee, date); good
```

### Missing Relationships
```javascript
// 1. Employee ← Department (Inverse)
// MISSING: Can't efficiently query all employees in department
// Current: Must query Employee.find({ department: deptId })
// Better: Department.populate('employees') → [Employee._id...]
// 
// Fix: Add to Department schema:
employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
}]
// But this is manually maintained; use middleware to keep in sync

// 2. Leave ← Employee (Inverse for approvals)
// MISSING: Can't query all approvals pending for a manager
// Need: Track who can approve (department head?)
// 
// Fix: Add to Leave schema:
approvingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
}

// 3. Attendance ← Department (Analytical)
// MISSING: Can't aggregate attendance by department
// Current: Must join through Employee
// 
// Fix: Add denormalization field:
departmentSnapshot: String // Cache of dept name at record time

// 4. Salary ← Department (Analytical)
// MISSING: Can't query total payroll by department
// Current: Must join through Employee
// 
// Fix: Add denormalization field:
departmentSnapshot: String // Cache of dept name at record time
```

---

## Unused Schema Fields

### Employee Schema
```javascript
isActive: {
    type: Boolean,
    default: true
}
// ❌ UNUSED: Never queried or modified in any controller
// Impact: Dead code; confuses developers
// Decision:
//   - If not using: Remove field
//   - If planning to use: Add filter to all queries
// Recommendation: Remove (use status field instead)

status: {
    type: String,
    enum: ['active', 'inactive', 'terminated', 'on_leave'],
    default: 'active'
}
// ⚠️ PARTIALLY USED: Updated but never queried
// Should use this instead of isActive
```

### Leave Schema
```javascript
appliedAt: {
    type: Date,
    default: Date.now
}
// ❌ REDUNDANT: Schema already has timestamps: true
// Timestamps creates: createdAt, updatedAt automatically
// This field duplicates createdAt
// Should remove and use createdAt from timestamps
```

### Attendance Schema
```javascript
// All fields used ✓
```

### Salary Schema
```javascript
// All fields used ✓
// Note: 'notes' field used in controller but NOT in schema (schema mismatch)
```

### Department Schema
```javascript
// All fields defined and used ✓
// But missing important fields:
// - isActive (for soft delete)
// - employees [] (inverse relation)
// - budget
```

---

## Field Type Mismatches

### Status Fields (Inconsistent Naming)
```javascript
// Employee.status: enum ['active', 'inactive', 'terminated', 'on_leave']
// Leave.status: enum ['pending', 'approved', 'rejected']
// Attendance.status: enum ['Present', 'Absent', 'Leave']  ← Different case!

// Problem: Attendance uses 'Present' (capital), others lowercase
// Solution: Standardize to: 'present', 'absent', 'leave'
```

### Date Fields (Inconsistent Handling)
```javascript
// Employee.dateOfJoining: Date (optional, no validation)
// Leave.startDate: Date (required)
// Leave.endDate: Date (required, but no > startDate validation)
// Attendance.date: Date (required)

// Problem: No format validation; no timezone handling
// Solution: Add custom validator for date format
```

### Amount Fields (Inconsistent Validation)
```javascript
// Salary.baseSalary: min: 0 ✓
// Salary.allowances: min: 0 ✓
// Salary.deductions: min: 0 ✓
// But: What about max? Could someone enter baseSalary: 999999999999?

// Problem: No max validation; no realistic bounds
// Solution: Add max: 99999999 (reasonable limit)
```

---

## Indexes Analysis

### Existing Indexes
```javascript
// Employee
index: { department: 1 }
// ✓ Good: Queries like "find employees by department"

// Leave
index: { employee: 1, status: 1 }
// ✓ Good: Can filter by both employee and status

// Attendance
unique index: { employee: 1, date: 1 }
// ✓ Excellent: Prevents duplicate attendance records

// Salary
index: { employee: 1, payDate: -1 }
// ✓ Good: Can fetch most recent salary first
```

### Missing Indexes
```javascript
// Department
missing: { head: 1 }
// Problem: Query "find department by head" will scan all documents
// Solution: Add index

// Leave
missing: { startDate: 1, endDate: 1 }
// Problem: Range queries on dates will be slow
// Solution: Add index for date range searches

// Salary
missing: { payDate: 1 }
// Problem: Sorting by payDate without index is slow
// Solution: Extend to: { employee: 1, payDate: -1 } (already exists!)

// All schemas missing
missing: { createdAt: 1 } for { createdAt: -1 }
// Problem: Sorting by "newest first" is common pattern
// Solution: Add to frequently sorted collections
```

---

## Validation Gaps

### Department Schema
```javascript
name: {
    type: String,
    required: true,
    unique: true,
    trim: true
}
// ✓ Good: Unique, required, trimmed
// Missing: minlength, maxlength, regex pattern
// Add: minlength: 2, maxlength: 100

description: {
    type: String,
    trim: true
}
// Missing: maxlength validation
// Add: maxlength: 500

head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
}
// Missing: Validation that referenced employee exists
// Add: validate function to check Employee exists
```

### Leave Schema
```javascript
leaveType: {
    type: String,
    enum: ['sick', 'casual', 'earned', 'unpaid', 'other'],
    required: true
}
// ✓ Good

startDate & endDate:
// Missing: endDate > startDate validation
// Missing: startDate >= today (can't apply for past leaves)
// Missing: Timezone normalization
// Add: Custom validators
```

### Attendance Schema
```javascript
status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave'],  // ⚠️ Different case!
    required: true
}
// Problem: Case sensitivity; should be lowercase
// Also: 'Leave' conflicts with Leave model name
// Fix: Change to 'present', 'absent', 'on_leave'

date: {
    type: Date,
    required: true
}
// Missing: Must be same date in all records (no time portion)
// Add: Validator to normalize to date-only (no time)
```

### Salary Schema
```javascript
baseSalary, allowances, deductions: {
    type: Number,
    min: 0
}
// Missing: max value validation
// Missing: Must be >= 0 and realistic (e.g., < 1000000)
// Add: max: 999999999
```

---

## Relationships That Can Cause Data Loss

### Orphaned Records (Current Behavior)
```
When DELETE Employee:
  ✓ Salary records deleted (cascaded in controller)
  ✓ Leave records deleted (cascaded in controller)
  ✓ Attendance records deleted (cascaded in controller)
  
When DELETE Department:
  ❌ Employee records NOT deleted
     → References invalid department
     → Foreign key violation
  ❌ Attendance/Leave/Salary indirect orphans
     → Their employees now point to deleted dept

When DELETE Leave:
  ✓ No side effects (only references Employee, Attendance)

When DELETE Attendance:
  ✓ No side effects
```

### Recommendation: Soft Delete Pattern
```javascript
// Instead of hard delete, add deletedAt field:

employeeSchema.add({
    deletedAt: { type: Date, default: null }
});

// Update all queries to filter deleted records:
Employee.find({ deletedAt: null })  // Only active

// Create helper:
employeeSchema.pre('find', function() {
    this.where({ deletedAt: null });
});

// Benefits:
// 1. Audit trail preserved
// 2. GDPR compliance (can delete on request)
// 3. Can recover accidentally deleted records
// 4. Foreign keys still valid
```

---

## Circular Reference Risks

### Current Relationships
```
Employee.department → Department._id
    ✓ No circular reference yet
    ? But if Department.employees added:
    
    Would create:
    Employee → Department → [Employees]
    
    Risk: If you populate both directions deeply, 
    could cause infinite recursion in queries

Department.head → Employee._id
    ? If later add Employee.managedDepartments → Department._id
    
    Would create:
    Department ← → Employee
    
    Risk: Circular population could hang queries
    Solution: Limit populate depth
```

### Safe Pattern to Avoid Recursion
```javascript
// Instead of populating both directions:

// Option 1: Only populate down
Department.find().populate('head')           // ✓ Safe
  .populate('employees')                      // ✓ Safe
  .populate('employees.department')           // ✓ Safe (but long)

// Option 2: Populate with lean()
Department.find().lean()                      // Doesn't create refs
  .populate('head')                           // ✓ No circular risk

// Option 3: Limit circular depth
Department.find().populate({
    path: 'employees',
    populate: { path: 'department', select: 'name' }  // Just name, not back-ref
})

// Option 4: Use aggregation instead
db.Department.aggregate([
    { $lookup: { from: 'employees', localField: '_id', foreignField: 'department', as: 'employees' }}
])  // No circular refs, better for complex queries
```

---

## Data Consistency Issues

### Issue 1: Salary Calculation Inconsistency
```javascript
// If netSalary is calculated in controller:
Controller: netSalary = baseSalary + allowances - deductions

// But later someone directly updates in DB:
db.salary.updateOne({ _id }, { $set: { baseSalary: 100000 } })

// netSalary is NOT recalculated!
// Results in: baseSalary = 100000, netSalary = 50000 (old value)
// 
// INCONSISTENT DATA!

// Solution: Calculate in schema pre-save hook
// Every save will recalculate consistently
```

### Issue 2: Department Head Validation
```javascript
// Current: Can set any ObjectId as head
// Possible states:
- head: null (valid)
- head: valid Employee._id (valid)
- head: invalid Employee._id (INVALID - orphan reference)
- head: Department._id (INVALID - wrong model type)

// No validation prevents these!

// Solution: Add validator:
head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    validate: {
        validator: async function(v) {
            if (!v) return true;  // null is OK
            const emp = await Employee.findById(v);
            return emp !== null;
        },
        message: 'Referenced employee does not exist'
    }
}
```

### Issue 3: Attendance Date Duplicates
```javascript
// Schema has: unique: { employee: 1, date: 1 }
// But markAttendence uses: insertMany(..., { ordered: false })

// Problem: If duplicate found
// insertMany silently skips it (doesn't error)
// User thinks it was saved, but it wasn't!

// User doesn't know:
// "Attendance not saved - duplicate entry for this employee on this date"

// Solution: Check for duplicates before insert
// OR: Use updateOne with upsert
```

---

## Data Model Recommendations

### Short Term (1-2 weeks)
1. Fix field mismatches (dep_name, notes)
2. Add soft delete fields (deletedAt)
3. Add leave balance tracking
4. Add date validation
5. Add authorization checks

### Medium Term (3-4 weeks)
1. Add missing indexes
2. Denormalize frequently-accessed data
3. Add audit fields (createdBy, updatedBy)
4. Implement pagination
5. Add comprehensive validation

### Long Term (1-2 months)
1. Consider denormalizing department info to Attendance/Salary
2. Add reporting views/indexes
3. Implement change data capture for audit
4. Consider time-series data model for Attendance/Salary history
5. Add caching layer for read-heavy operations

---

## ER Diagram (Fixed Version)

```
┌──────────────────┐
│    Employee      │
├──────────────────┤
│ _id (PK)         │
│ name ✓           │
│ email ✓ (UNIQUE) │
│ password ✓       │
│ role ✓           │
│ department (FK)→ │────────────┐
│ status ✓         │            │
│ leaveBalance     │ ← [NEW]    │
│ createdBy (FK)   │ ← [NEW]    │
│ deletedAt        │ ← [NEW]    │
│ timestamps       │            │
└──────────────────┘            │
        ▲                        │
        │                        │
    referenced by:         referenced by:
    - Attendance.rec      - Department.head
    - Leave.employee      - Employee.createdBy
    - Salary.employee     - Attendance.recordedBy
    - Department.head     │
        │                 │
        │                 │
┌───────┴─────────────────▼──────────────┐
│         Department                     │
├────────────────────────────────────────┤
│ _id (PK)                               │
│ name ✓ (UNIQUE)                        │
│ description                            │
│ head (FK) → Employee._id ← [NEW: ADD INDEX & VALIDATE]
│ budget ← [NEW]                         │
│ employees [] ← [NEW: INVERSE REL]      │
│ isActive ← [NEW]                       │
│ deletedAt ← [NEW]                      │
│ timestamps                             │
└────────────────────────────────────────┘


┌──────────────────┐       ┌──────────────────┐
│      Leave       │       │   Attendance     │
├──────────────────┤       ├──────────────────┤
│ _id (PK)         │       │ _id (PK)         │
│ employee (FK)    │       │ employee (FK) ✓  │
│ leaveType ✓      │       │ date ✓           │
│ startDate ✓ ← [NEW: VAL] │ status ✓ ← [FIX: CASE]
│ endDate ✓ ← [NEW: VAL]   │ remark           │
│ reason           │       │ recordedBy (FK)← [NEW: VALIDATE]
│ status ✓         │       │ checkInTime ← [NEW]
│ appliedAt ← [FIX]│       │ checkOutTime ← [NEW]
│ reviewedAt       │       │ workingHours ← [NEW]
│ reviewedBy ← [NEW]       │ deletedAt ← [NEW]
│ comments ← [NEW] │       │ timestamps       │
│ deletedAt ← [NEW]│       │ UNIQUE: (emp,date)✓
│ timestamps       │       └──────────────────┘
│ INDEX: (emp,sts) │
└──────────────────┘


                    ┌──────────────────┐
                    │      Salary      │
                    ├──────────────────┤
                    │ _id (PK)         │
                    │ employee (FK) ✓  │
                    │ baseSalary ✓ ← [NEW: MAX VAL]
                    │ allowances ✓ ← [NEW: MAX VAL]
                    │ deductions ✓ ← [NEW: MAX VAL]
                    │ netSalary ✓ ← [FIX: PRE-SAVE CALC]
                    │ payDate ✓        │
                    │ periodStart      │
                    │ periodEnd        │
                    │ approvedBy (FK)  ← [NEW]
                    │ paymentStatus ← [NEW]
                    │ paymentMethod ← [NEW]
                    │ deletedAt ← [NEW]
                    │ timestamps       │
                    │ INDEX: (emp,date)│
                    └──────────────────┘

Legend:
✓ = Exists and working
← [NEW] = Suggested addition
← [FIX] = Needs fixing
← [VAL] = Needs validation added
```

---

