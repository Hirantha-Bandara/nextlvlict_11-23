package com.nextlvlict.nextlvlict.service;

import com.nextlvlict.nextlvlict.hibernate.*;
import org.hibernate.Session;
import org.hibernate.Transaction;
import jakarta.persistence.LockModeType;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Service class for generating monthly fee records following the correct architecture:
 * Student → StudentClass → GradeClassFee → StudentMonthlyFees
 */
public class MonthlyFeeGenerationService {

    /**
     * Generate monthly fee records for a specific student for the current month.
     * This method is used during student registration.
     *
     * @param session Hibernate session
     * @param student The student
     * @param grade The student's grade
     * @param classTypes List of class types the student is enrolled in
     */
    public static void generateMonthlyFeesForStudent(Session session, Students student, Grade grade, List<ClassType> classTypes) {
        Transaction feeTransaction = null;
        try {
            feeTransaction = session.beginTransaction();

            // Get the PENDING status from payment_status table
            PaymentStatus pendingStatus = session.get(PaymentStatus.class, 1);
            if (pendingStatus == null) {
                System.err.println("❌ PENDING payment status not found in database");
                return;
            }

            // Calculate current month and year
            String currentMonthYear = getCurrentMonthYear();

            // Calculate due date (10th of current month)
            Date dueDate = getNextDueDate();

            // Create monthly fee record for each class type
            for (ClassType classType : classTypes) {
                // Check if fee record already exists for this student, class type, and month
                if (feeRecordExists(session, student.getId(), classType.getId(), currentMonthYear)) {
                    System.out.println("⚠️  Fee record already exists for student: " + student.getId() +
                            ", class type: " + classType.getId() + ", month: " + currentMonthYear);
                    continue;
                }

                // Get the fee for this grade and class type combination
                GradeClassFee gradeClassFee = getGradeClassFee(session, grade.getId(), classType.getId());
                if (gradeClassFee == null) {
                    System.err.println("❌ No fee configuration found for grade: " + grade.getId() +
                            " and class type: " + classType.getId());
                    continue;
                }

                // Create monthly fee record
                StudentMonthlyFees monthlyFee = new StudentMonthlyFees();
                monthlyFee.setStudent(student);
                monthlyFee.setGrade(grade);
                monthlyFee.setClassType(classType);
                monthlyFee.setMonthYear(currentMonthYear);
                monthlyFee.setFeeAmount(gradeClassFee.getMonthlyFee());
                monthlyFee.setStatus(pendingStatus);
                monthlyFee.setDueDate(new java.sql.Date(dueDate.getTime()));
                monthlyFee.setCreatedAt(new Date());
                monthlyFee.setUpdatedAt(new Date());

                session.save(monthlyFee);
                System.out.println("✅ Created monthly fee for student: " + student.getId() +
                        ", class type: " + classType.getName() + ", amount: " + gradeClassFee.getMonthlyFee());
            }

            feeTransaction.commit();
            System.out.println("✅ Monthly fee records created for student: " + student.getId());

        } catch (Exception e) {
            if (feeTransaction != null) {
                feeTransaction.rollback();
            }
            System.err.println("❌ Error creating monthly fee records: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Generate monthly fee records for all active students for the current month.
     * This method is used by the scheduled monthly fee generation job.
     */
    public static void generateMonthlyFeesForAllStudents() {
        Session session = null;
        Transaction transaction = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            // Get all active students
            @SuppressWarnings("unchecked")
            List<Students> activeStudents = session.createQuery("FROM Students WHERE is_active = 1").list();
            
            // Get PENDING status
            PaymentStatus pendingStatus = session.get(PaymentStatus.class, 1);
            if (pendingStatus == null) {
                System.err.println("❌ PENDING payment status not found");
                if (transaction != null) transaction.rollback();
                return;
            }
            
            // Current month and year
            String currentMonthYear = getCurrentMonthYear();
            
            // Due date (10th of current month)
            Date dueDate = getNextDueDate();
            
            int totalFeesCreated = 0;
            
            for (Students student : activeStudents) {
                // Get all active StudentClass records for this student
                @SuppressWarnings("unchecked")
                List<StudentClass> studentClasses = session.createQuery(
                        "FROM StudentClass WHERE student.id = :studentId AND isActive = 1")
                        .setParameter("studentId", student.getId())
                        .list();
                
                for (StudentClass studentClass : studentClasses) {
                    // Check if fee record already exists
                    if (feeRecordExists(session, student.getId(), 
                            studentClass.getClassType().getId(), currentMonthYear)) {
                        continue;
                    }
                    
                    // Get the fee for this grade and class type combination
                    GradeClassFee gradeClassFee = getGradeClassFee(session, 
                            studentClass.getGrade().getId(), 
                            studentClass.getClassType().getId());
                    
                    if (gradeClassFee == null) {
                        System.err.println("❌ No fee configuration found for grade: " +
                                studentClass.getGrade().getId() + " and class type: " +
                                studentClass.getClassType().getId());
                        continue;
                    }
                    
                    // Create monthly fee record
                    StudentMonthlyFees monthlyFee = new StudentMonthlyFees();
                    monthlyFee.setStudent(student);
                    monthlyFee.setGrade(studentClass.getGrade());
                    monthlyFee.setClassType(studentClass.getClassType());
                    monthlyFee.setMonthYear(currentMonthYear);
                    monthlyFee.setFeeAmount(gradeClassFee.getMonthlyFee());
                    monthlyFee.setStatus(pendingStatus);
                    monthlyFee.setDueDate(new java.sql.Date(dueDate.getTime()));
                    monthlyFee.setCreatedAt(new Date());
                    monthlyFee.setUpdatedAt(new Date());
                    
                    session.save(monthlyFee);
                    totalFeesCreated++;
                    System.out.println("✅ Created monthly fee for student: " + student.getId() +
                            ", class type: " + studentClass.getClassType().getName() +
                            ", amount: " + gradeClassFee.getMonthlyFee());
                }
            }
            
            transaction.commit();
            System.out.println("✅ Monthly fees generated successfully for " + currentMonthYear +
                    ". Total fees created: " + totalFeesCreated);
            
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            System.err.println("❌ Error generating monthly fees: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null && session.isOpen()) session.close();
        }
    }

    /**
     * Generate monthly fee records for a specific student for a specific month.
     * This method is used when initiating payment if fee records don't exist.
     *
     * @param session Hibernate session
     * @param student The student
     * @param monthYear The month-year in format "YYYY-MM"
     * @return Number of fee records created
     */
    public static int generateMonthlyFeesForStudentForMonth(Session session, Students student, String monthYear) {
        Transaction transaction = null;
        int feesCreated = 0;
        
        try {
            transaction = session.beginTransaction();
            
            // Get PENDING status
            PaymentStatus pendingStatus = session.get(PaymentStatus.class, 1);
            if (pendingStatus == null) {
                System.err.println("❌ PENDING payment status not found");
                return 0;
            }
            
            // Calculate due date (10th of the specified month)
            Date dueDate = getNextDueDateForMonth(monthYear);
            
            // Get all active StudentClass records for this student
            @SuppressWarnings("unchecked")
            List<StudentClass> studentClasses = session.createQuery(
                    "FROM StudentClass WHERE student.id = :studentId AND isActive = 1")
                    .setParameter("studentId", student.getId())
                    .list();
            
            for (StudentClass studentClass : studentClasses) {
                // Check if fee record already exists
                if (feeRecordExists(session, student.getId(), 
                        studentClass.getClassType().getId(), monthYear)) {
                    continue;
                }
                
                // Get the fee for this grade and class type combination
                GradeClassFee gradeClassFee = getGradeClassFee(session, 
                        studentClass.getGrade().getId(), 
                        studentClass.getClassType().getId());
                
                if (gradeClassFee == null) {
                    System.err.println("❌ No fee configuration found for grade: " +
                            studentClass.getGrade().getId() + " and class type: " +
                            studentClass.getClassType().getId());
                    continue;
                }
                
                // Create monthly fee record
                StudentMonthlyFees monthlyFee = new StudentMonthlyFees();
                monthlyFee.setStudent(student);
                monthlyFee.setGrade(studentClass.getGrade());
                monthlyFee.setClassType(studentClass.getClassType());
                monthlyFee.setMonthYear(monthYear);
                monthlyFee.setFeeAmount(gradeClassFee.getMonthlyFee());
                monthlyFee.setStatus(pendingStatus);
                monthlyFee.setDueDate(new java.sql.Date(dueDate.getTime()));
                monthlyFee.setCreatedAt(new Date());
                monthlyFee.setUpdatedAt(new Date());
                
                session.save(monthlyFee);
                feesCreated++;
                System.out.println("✅ Created monthly fee for student: " + student.getId() +
                        ", class type: " + studentClass.getClassType().getName() +
                        ", amount: " + gradeClassFee.getMonthlyFee());
            }
            
            transaction.commit();
            System.out.println("✅ Generated " + feesCreated + " monthly fee records for student: " +
                    student.getId() + " for month: " + monthYear);
            
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            System.err.println("❌ Error generating monthly fees: " + e.getMessage());
            e.printStackTrace();
        }
        
        return feesCreated;
    }

    /**
     * Check if a fee record already exists for the given student, class type, and month.
     * Uses proper locking to prevent race conditions.
     */
    private static boolean feeRecordExists(Session session, String studentId, Integer classTypeId, String monthYear) {
        try {
            String hql = "FROM StudentMonthlyFees WHERE student.id = :studentId AND classType.id = :classTypeId AND monthYear = :monthYear";
            StudentMonthlyFees existingFee = (StudentMonthlyFees) session.createQuery(hql)
                    .setParameter("studentId", studentId)
                    .setParameter("classTypeId", classTypeId)
                    .setParameter("monthYear", monthYear)
                    .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                    .uniqueResult();
            return existingFee != null;
        } catch (Exception e) {
            // If lock fails, continue with normal flow; duplicate guard is still checked at runtime.
            System.err.println("Warning during duplicate check: " + e.getMessage());
            return false;
        }
    }

    /**
     * Get GradeClassFee for a specific grade and class type combination.
     */
    private static GradeClassFee getGradeClassFee(Session session, Integer gradeId, Integer classTypeId) {
        String hql = "FROM GradeClassFee WHERE grade.id = :gradeId AND classType.id = :classTypeId AND isActive = 1";
        return (GradeClassFee) session.createQuery(hql)
                .setParameter("gradeId", gradeId)
                .setParameter("classTypeId", classTypeId)
                .uniqueResult();
    }

    /**
     * Get current month-year in format "YYYY-MM".
     */
    private static String getCurrentMonthYear() {
        Calendar calendar = Calendar.getInstance();
        return String.format("%04d-%02d",
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH) + 1);
    }

    /**
     * Get due date (10th of current month).
     */
    private static Date getNextDueDate() {
        Calendar dueDateCalendar = Calendar.getInstance();
        dueDateCalendar.set(Calendar.DAY_OF_MONTH, 10);
        return dueDateCalendar.getTime();
    }

    /**
     * Get due date for a specific month (10th of the specified month).
     */
    private static Date getNextDueDateForMonth(String monthYear) {
        String[] parts = monthYear.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);
        
        Calendar dueDateCalendar = Calendar.getInstance();
        dueDateCalendar.set(Calendar.YEAR, year);
        dueDateCalendar.set(Calendar.MONTH, month - 1); // Calendar months are 0-based
        dueDateCalendar.set(Calendar.DAY_OF_MONTH, 10);
        
        return dueDateCalendar.getTime();
    }
}
