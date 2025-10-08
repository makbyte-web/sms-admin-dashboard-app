Default Field in all Schema
createdDate
createdBy
updatedDate
updatedBy

School schema
schoolID
userId
schoolName
address
medium
indexNo
schoolPhoto

Student Schema
studentID
schoolID
studentName
std --> this will be replace by 2 new fields stdId and divID
email
grNo

Teacher Schema
teacherID
schoolId
teacherName
subject
qualification
profilePhoto


Parent Details
parentID
schoolID
parentName
email
password
sceretQts
sceretAns
noOfChildren

Fees Type schema
feesTypeID-pk
schoolID
academicYear
feeName -> annualTF, half-yearly1TF, half-yearly2TF, q1,q2,q3,q4, monthly
type -> tuitionfee, term1, term2, picnic, computer, sports, uniform, miscellaneous and others etc = total
amount (each type individual amount)

Fees Group schema
feesStructureID-pk
schoolId
academicYear
groupname -> default, annual, half-yearly1, half-yearly2, q1,q2,q3,q4, monthly
feesInStructure -> array of feesTypeID
duedate

--Not Required-- tenure -> annual, half yearly, quarterly, monthly

Standard
stdID
schoolID
stdName

Division
divID
schoolID
divName

Fees Mapping
feesMapID
schoolID
feesGroups -> array of feesStructureID
assignTo -> student | class
assigneeID

Aftab (V B)
Aftab (VI B)

selection choice
primary Student
secondary Class

ParentStudent
psID
schoolID
parentID
academicYear
children -> array of studentID -> display name and store ID (student will be filter based on std and div)

above all schema completed on 20/10/2024

########### PENDING AFTER UI REDESIGN ############ 
ClassTeacher Assignment (for attendance)
ctID
academicYear
teacherID
schoolId
stdID
divID

-------------TBD----------------------

payment
paymentID
studentID
noOfPayment
amountPaid

Attendance
Remark
Results
