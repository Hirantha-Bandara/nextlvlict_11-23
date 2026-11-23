package com.nextlvlict.nextlvlict.service;

import com.nextlvlict.nextlvlict.hibernate.GradeClassFee;
import com.nextlvlict.nextlvlict.hibernate.Grade;
import com.nextlvlict.nextlvlict.hibernate.ClassType;
import com.nextlvlict.nextlvlict.hibernate.Ol_or_Al;
import com.nextlvlict.nextlvlict.hibernate.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class GradeClassFeeService {

    public GradeClassFee createGradeClassFee(Integer gradeId, Integer classTypeId, 
                                            Double monthlyFee, Double registrationFee, 
                                            Integer isActive) throws Exception {
        Session session = null;
        Transaction transaction = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            // Validate Grade exists
            Grade grade = session.get(Grade.class, gradeId);
            if (grade == null) {
                throw new Exception("Grade with ID " + gradeId + " does not exist");
            }
            
            // Validate ClassType exists
            ClassType classType = session.get(ClassType.class, classTypeId);
            if (classType == null) {
                throw new Exception("Class Type with ID " + classTypeId + " does not exist");
            }
            
            // Validate fees are zero or greater
            if (monthlyFee != null && monthlyFee < 0) {
                throw new Exception("Monthly fee must be zero or greater");
            }
            if (registrationFee != null && registrationFee < 0) {
                throw new Exception("Registration fee must be zero or greater");
            }
            
            // Check for duplicate Grade + Class Type combination
            Query<GradeClassFee> duplicateCheck = session.createQuery(
                "FROM GradeClassFee WHERE grade.id = :gradeId AND classType.id = :classTypeId", 
                GradeClassFee.class);
            duplicateCheck.setParameter("gradeId", gradeId);
            duplicateCheck.setParameter("classTypeId", classTypeId);
            GradeClassFee existing = duplicateCheck.uniqueResult();
            
            if (existing != null) {
                throw new Exception("A fee configuration already exists for this Grade and Class Type combination");
            }
            
            // Create new GradeClassFee
            GradeClassFee gradeClassFee = new GradeClassFee();
            gradeClassFee.setGrade(grade);
            gradeClassFee.setClassType(classType);
            gradeClassFee.setMonthlyFee(monthlyFee != null ? monthlyFee : 0.0);
            gradeClassFee.setRegistrationFee(registrationFee != null ? registrationFee : 0.0);
            gradeClassFee.setIsActive(isActive != null ? isActive : 1);
            gradeClassFee.setCreatedAt(new Date());
            gradeClassFee.setUpdatedAt(new Date());
            
            session.save(gradeClassFee);
            transaction.commit();
            
            return gradeClassFee;
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            throw e;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public GradeClassFee updateGradeClassFee(Integer id, Integer gradeId, Integer classTypeId,
                                            Double monthlyFee, Double registrationFee, 
                                            Integer isActive) throws Exception {
        Session session = null;
        Transaction transaction = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            // Get existing record
            GradeClassFee gradeClassFee = session.get(GradeClassFee.class, id);
            if (gradeClassFee == null) {
                throw new Exception("Grade Class Fee with ID " + id + " not found");
            }
            
            // Validate fees are zero or greater
            if (monthlyFee != null && monthlyFee < 0) {
                throw new Exception("Monthly fee must be zero or greater");
            }
            if (registrationFee != null && registrationFee < 0) {
                throw new Exception("Registration fee must be zero or greater");
            }
            
            // If gradeId or classTypeId is being changed, check for duplicate
            if (gradeId != null && !gradeId.equals(gradeClassFee.getGrade().getId()) ||
                classTypeId != null && !classTypeId.equals(gradeClassFee.getClassType().getId())) {
                
                Integer newGradeId = gradeId != null ? gradeId : gradeClassFee.getGrade().getId();
                Integer newClassTypeId = classTypeId != null ? classTypeId : gradeClassFee.getClassType().getId();
                
                // Validate new Grade exists if changing
                if (gradeId != null) {
                    Grade grade = session.get(Grade.class, gradeId);
                    if (grade == null) {
                        throw new Exception("Grade with ID " + gradeId + " does not exist");
                    }
                }
                
                // Validate new ClassType exists if changing
                if (classTypeId != null) {
                    ClassType classType = session.get(ClassType.class, classTypeId);
                    if (classType == null) {
                        throw new Exception("Class Type with ID " + classTypeId + " does not exist");
                    }
                }
                
                // Check for duplicate with new combination (excluding current record)
                Query<GradeClassFee> duplicateCheck = session.createQuery(
                    "FROM GradeClassFee WHERE grade.id = :gradeId AND classType.id = :classTypeId AND id != :id", 
                    GradeClassFee.class);
                duplicateCheck.setParameter("gradeId", newGradeId);
                duplicateCheck.setParameter("classTypeId", newClassTypeId);
                duplicateCheck.setParameter("id", id);
                GradeClassFee existing = duplicateCheck.uniqueResult();
                
                if (existing != null) {
                    throw new Exception("A fee configuration already exists for this Grade and Class Type combination");
                }
                
                // Update grade and class type if provided
                if (gradeId != null) {
                    gradeClassFee.setGrade(session.get(Grade.class, gradeId));
                }
                if (classTypeId != null) {
                    gradeClassFee.setClassType(session.get(ClassType.class, classTypeId));
                }
            }
            
            // Update fee fields
            if (monthlyFee != null) {
                gradeClassFee.setMonthlyFee(monthlyFee);
            }
            if (registrationFee != null) {
                gradeClassFee.setRegistrationFee(registrationFee);
            }
            if (isActive != null) {
                gradeClassFee.setIsActive(isActive);
            }
            
            gradeClassFee.setUpdatedAt(new Date());
            
            session.update(gradeClassFee);
            transaction.commit();
            
            return gradeClassFee;
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            throw e;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public boolean deleteGradeClassFee(Integer id) throws Exception {
        Session session = null;
        Transaction transaction = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            GradeClassFee gradeClassFee = session.get(GradeClassFee.class, id);
            if (gradeClassFee == null) {
                throw new Exception("Grade Class Fee with ID " + id + " not found");
            }
            
            session.delete(gradeClassFee);
            transaction.commit();
            
            return true;
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            throw e;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public boolean deactivateGradeClassFee(Integer id) throws Exception {
        Session session = null;
        Transaction transaction = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            GradeClassFee gradeClassFee = session.get(GradeClassFee.class, id);
            if (gradeClassFee == null) {
                throw new Exception("Grade Class Fee with ID " + id + " not found");
            }
            
            gradeClassFee.setIsActive(0);
            gradeClassFee.setUpdatedAt(new Date());
            
            session.update(gradeClassFee);
            transaction.commit();
            
            return true;
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            throw e;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<GradeClassFee> getAllGradeClassFees(Integer gradeIdFilter, Integer classTypeIdFilter, 
                                                    Integer statusFilter, String searchQuery) throws Exception {
        Session session = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<GradeClassFee> cq = cb.createQuery(GradeClassFee.class);
            Root<GradeClassFee> root = cq.from(GradeClassFee.class);
            
            // Fetch Grade and ClassType to avoid N+1 queries
            root.fetch("grade");
            root.fetch("classType");
            
            List<Predicate> predicates = new ArrayList<>();
            
            // Filter by Grade
            if (gradeIdFilter != null) {
                predicates.add(cb.equal(root.get("grade").get("id"), gradeIdFilter));
            }
            
            // Filter by Class Type
            if (classTypeIdFilter != null) {
                predicates.add(cb.equal(root.get("classType").get("id"), classTypeIdFilter));
            }
            
            // Filter by Status
            if (statusFilter != null) {
                predicates.add(cb.equal(root.get("isActive"), statusFilter));
            }
            
            // Search by Grade Name or Class Type Name
            if (searchQuery != null && !searchQuery.trim().isEmpty()) {
                String searchPattern = "%" + searchQuery.toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("grade").get("name")), searchPattern),
                    cb.like(cb.lower(root.get("classType").get("name")), searchPattern)
                ));
            }
            
            if (!predicates.isEmpty()) {
                cq.where(predicates.toArray(new Predicate[0]));
            }
            
            // Order by Grade name, then Class Type name
            cq.orderBy(
                cb.asc(root.get("grade").get("name")),
                cb.asc(root.get("classType").get("name"))
            );
            
            Query<GradeClassFee> query = session.createQuery(cq);
            return query.getResultList();
            
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public GradeClassFee getGradeClassFeeById(Integer id) throws Exception {
        Session session = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            GradeClassFee gradeClassFee = session.get(GradeClassFee.class, id);
            
            if (gradeClassFee != null) {
                // Initialize relationships to avoid lazy loading issues
                gradeClassFee.getGrade();
                gradeClassFee.getClassType();
            }
            
            return gradeClassFee;
            
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<Grade> getAllGrades() throws Exception {
        Session session = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Grade> cq = cb.createQuery(Grade.class);
            Root<Grade> root = cq.from(Grade.class);
            cq.select(root);
            cq.orderBy(cb.asc(root.get("name")));
            
            Query<Grade> query = session.createQuery(cq);
            return query.getResultList();
            
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<ClassType> getAllClassTypes() throws Exception {
        Session session = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<ClassType> cq = cb.createQuery(ClassType.class);
            Root<ClassType> root = cq.from(ClassType.class);
            cq.select(root);
            cq.orderBy(cb.asc(root.get("name")));
            
            Query<ClassType> query = session.createQuery(cq);
            return query.getResultList();
            
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    // Grade Management Methods
    
    public Grade createGrade(String name, Integer isActive, Integer olOrAlId) throws Exception {
        Session session = null;
        Transaction transaction = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            // Validate name
            if (name == null || name.trim().isEmpty()) {
                throw new Exception("Grade name is required");
            }
            
            // Check for duplicate grade name
            Query<Grade> duplicateCheck = session.createQuery(
                "FROM Grade WHERE name = :name", Grade.class);
            duplicateCheck.setParameter("name", name.trim());
            Grade existing = duplicateCheck.uniqueResult();
            
            if (existing != null) {
                throw new Exception("A grade with this name already exists");
            }
            
            // Validate Ol_or_Al if provided
            Ol_or_Al olOrAl = null;
            if (olOrAlId != null) {
                olOrAl = session.get(Ol_or_Al.class, olOrAlId);
                if (olOrAl == null) {
                    throw new Exception("OL/AL type with ID " + olOrAlId + " does not exist");
                }
            }
            
            // Create new Grade
            Grade grade = new Grade();
            grade.setName(name.trim());
            grade.setIs_active(isActive != null ? isActive : 1);
            grade.setOl_or_al(olOrAl);
            
            session.save(grade);
            transaction.commit();
            
            return grade;
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            throw e;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public Grade updateGrade(Integer id, String name, Integer isActive, Integer olOrAlId) throws Exception {
        Session session = null;
        Transaction transaction = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            // Get existing record
            Grade grade = session.get(Grade.class, id);
            if (grade == null) {
                throw new Exception("Grade with ID " + id + " not found");
            }
            
            // If name is being changed, check for duplicate
            if (name != null && !name.trim().isEmpty() && !name.trim().equals(grade.getName())) {
                Query<Grade> duplicateCheck = session.createQuery(
                    "FROM Grade WHERE name = :name AND id != :id", Grade.class);
                duplicateCheck.setParameter("name", name.trim());
                duplicateCheck.setParameter("id", id);
                Grade existing = duplicateCheck.uniqueResult();
                
                if (existing != null) {
                    throw new Exception("A grade with this name already exists");
                }
                
                grade.setName(name.trim());
            }
            
            // Update is_active if provided
            if (isActive != null) {
                grade.setIs_active(isActive);
            }
            
            // Update ol_or_al if provided
            if (olOrAlId != null) {
                Ol_or_Al olOrAl = session.get(Ol_or_Al.class, olOrAlId);
                if (olOrAl == null) {
                    throw new Exception("OL/AL type with ID " + olOrAlId + " does not exist");
                }
                grade.setOl_or_al(olOrAl);
            }
            
            session.update(grade);
            transaction.commit();
            
            return grade;
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            throw e;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public boolean deleteGrade(Integer id) throws Exception {
        Session session = null;
        Transaction transaction = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            
            // Check if grade exists
            Grade grade = session.get(Grade.class, id);
            if (grade == null) {
                throw new Exception("Grade with ID " + id + " not found");
            }
            
            // Check if grade has any associated GradeClassFee records
            Query<GradeClassFee> feeCheck = session.createQuery(
                "FROM GradeClassFee WHERE grade.id = :gradeId", GradeClassFee.class);
            feeCheck.setParameter("gradeId", id);
            List<GradeClassFee> associatedFees = feeCheck.list();
            
            if (!associatedFees.isEmpty()) {
                throw new Exception("Cannot delete grade: " + associatedFees.size() + 
                    " fee configuration(s) are associated with this grade. Please delete them first.");
            }
            
            session.delete(grade);
            transaction.commit();
            
            return true;
            
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            throw e;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public Grade getGradeById(Integer id) throws Exception {
        Session session = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            Grade grade = session.get(Grade.class, id);
            return grade;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
    
    public List<Ol_or_Al> getAllOlOrAlTypes() throws Exception {
        Session session = null;
        
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Ol_or_Al> cq = cb.createQuery(Ol_or_Al.class);
            Root<Ol_or_Al> root = cq.from(Ol_or_Al.class);
            cq.select(root);
            cq.orderBy(cb.asc(root.get("name")));
            
            Query<Ol_or_Al> query = session.createQuery(cq);
            return query.getResultList();
            
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }
}
