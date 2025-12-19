import Church from "../models/Church.js";
import Diocese from "../models/Diocese.js";
import Woreda from "../models/Woreda.js";
import SundaySchool from "../models/SundaySchool.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Student from "../models/Student.js";
import ClassEnrollment from "../models/ClassEnrollment.js";
import Assessment from "../models/Assessment.js";
import StudentMark from "../models/StudentMark.js";
import Guardian from "../models/Guardian.js";
import Registration from "../models/Registration.js";
import TeacherAssignment from "../models/TeacherAssignment.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

// Get dashboard statistics and hierarchical data
export const getDashboard = async (req, res) => {
  try {
    let currentUser = null;
    let roleName = req.session?.roleName || null;

    if (!req.session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.session?.userId) {
      currentUser = await User.findById(req.session.userId).populate("roles").lean();
      roleName = roleName || currentUser?.roles?.[0]?.name || null;
    }

    // Get all counts
    const counts = {
      churches: await Church.countDocuments(),
      dioceses: await Diocese.countDocuments(),
      woredas: await Woreda.countDocuments(),
      sundaySchools: await SundaySchool.countDocuments(),
      teachers: await Teacher.countDocuments(),
      classes: await Class.countDocuments(),
      students: await Student.countDocuments(),
      assessments: await Assessment.countDocuments(),
      guardians: await Guardian.countDocuments(),
      registrations: await Registration.countDocuments(),
      users: await User.countDocuments(),
      roles: await Role.countDocuments(),
    };

    // Get hierarchical structure: Church -> Diocese -> Woreda -> SundaySchool
    const churches = await Church.find().lean();
    const dioceses = await Diocese.find().populate("churchId").lean();
    const woredas = await Woreda.find().populate("dioceseId").lean();
    const sundaySchools = await SundaySchool.find().populate("woredaId").lean();

    // Get all relationships
    const teachers = await Teacher.find().populate("sundaySchoolId").lean();
    const classes = await Class.find().populate("sundaySchoolId").lean();
    const students = await Student.find().lean();
    const assessments = await Assessment.find()
      .populate("classId")
      .populate("teacherId")
      .lean();
    const studentMarks = await StudentMark.find()
      .populate("assessmentId")
      .populate("studentId")
      .lean();
    const classEnrollments = await ClassEnrollment.find()
      .populate("studentId")
      .populate("classId")
      .lean();
    const teacherAssignments = await TeacherAssignment.find()
      .populate("teacherId")
      .populate("classId")
      .lean();
    const guardians = await Guardian.find().populate("sundaySchoolId").lean();
    const registrations = await Registration.find()
      .populate("studentId")
      .populate("guardianId")
      .lean();
    const users = await User.find().populate("roles").lean();
    const roles = await Role.find().lean();

    // Build hierarchical structure
    const hierarchy = churches.map((church) => {
      const churchDioceses = dioceses.filter(
        (d) => d.churchId?._id?.toString() === church._id.toString()
      );

      const diocesesWithWoredas = churchDioceses.map((diocese) => {
        const dioceseWoredas = woredas.filter(
          (w) => w.dioceseId?._id?.toString() === diocese._id.toString()
        );

        const woredasWithSundaySchools = dioceseWoredas.map((woreda) => {
          const woredaSundaySchools = sundaySchools.filter(
            (ss) => ss.woredaId?._id?.toString() === woreda._id.toString()
          );

          const sundaySchoolsWithDetails = woredaSundaySchools.map((ss) => {
            const ssTeachers = teachers.filter(
              (t) => t.sundaySchoolId?._id?.toString() === ss._id.toString()
            );
            const ssClasses = classes.filter(
              (c) => c.sundaySchoolId?._id?.toString() === ss._id.toString()
            );
            const ssGuardians = guardians.filter(
              (g) => g.sundaySchoolId?._id?.toString() === ss._id.toString()
            );

            // Get class details with enrollments
            const classesWithDetails = ssClasses.map((cls) => {
              const classEnrollmentsList = classEnrollments.filter(
                (ce) => ce.classId?._id?.toString() === cls._id.toString()
              );
              const classAssignments = teacherAssignments.filter(
                (ta) => ta.classId?._id?.toString() === cls._id.toString()
              );
              const classAssessments = assessments.filter(
                (a) => a.classId?._id?.toString() === cls._id.toString()
              );

              return {
                ...cls,
                enrollmentCount: classEnrollmentsList.length,
                enrollments: classEnrollmentsList,
                assignments: classAssignments,
                assessments: classAssessments,
                assessmentCount: classAssessments.length,
              };
            });

            return {
              ...ss,
              teacherCount: ssTeachers.length,
              teachers: ssTeachers,
              classCount: ssClasses.length,
              classes: classesWithDetails,
              guardianCount: ssGuardians.length,
              guardians: ssGuardians,
            };
          });

          return {
            ...woreda,
            sundaySchoolCount: woredaSundaySchools.length,
            sundaySchools: sundaySchoolsWithDetails,
          };
        });

        return {
          ...diocese,
          woredaCount: dioceseWoredas.length,
          woredas: woredasWithSundaySchools,
        };
      });

      return {
        ...church,
        dioceseCount: churchDioceses.length,
        dioceses: diocesesWithWoredas,
      };
    });

    // Recent activity (last 10 items)
    const recentRegistrations = await Registration.find()
      .populate("studentId")
      .populate("guardianId")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const recentAssessments = await Assessment.find()
      .populate("classId")
      .populate("teacherId")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Statistics by status
    const activeTeachers = await Teacher.countDocuments({ status: "ACTIVE" });
    const inactiveTeachers = await Teacher.countDocuments({
      status: "INACTIVE",
    });
    const suspendedTeachers = await Teacher.countDocuments({
      status: "SUSPENDED",
    });

    res.json({
      counts,
      hierarchy,
      recentRegistrations,
      recentAssessments,
      teacherStats: {
        active: activeTeachers,
        inactive: inactiveTeachers,
        suspended: suspendedTeachers,
      },
      allStudents: students,
      allAssessments: assessments,
      allStudentMarks: studentMarks,
      allClassEnrollments: classEnrollments,
      allTeacherAssignments: teacherAssignments,
      allUsers: users,
      allRoles: roles,
      currentUser,
      roleName,
      assignedObject: null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

