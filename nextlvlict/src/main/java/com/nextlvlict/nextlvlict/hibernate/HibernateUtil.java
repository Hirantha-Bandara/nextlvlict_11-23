package com.nextlvlict.nextlvlict.hibernate;

import com.nextlvlict.nextlvlict.util.ConfigUtil;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {

    private static final SessionFactory sessionFactory;

    static {
        try {
            System.out.println("Initializing Hibernate SessionFactory...");

            Configuration configuration = new Configuration();
            configuration.configure();

            // Override database configuration with environment variables if available
            String dbUrl = ConfigUtil.getDatabaseUrl();
            String dbUsername = ConfigUtil.getDatabaseUsername();
            String dbPassword = ConfigUtil.getDatabasePassword();

            if (dbUrl != null && !dbUrl.isEmpty()) {
                System.out.println("Using database URL from environment: " + dbUrl);
                configuration.setProperty("hibernate.connection.url", dbUrl);
            }
            if (dbUsername != null && !dbUsername.isEmpty()) {
                System.out.println("Using database username from environment: " + dbUsername);
                configuration.setProperty("hibernate.connection.username", dbUsername);
            }
            if (dbPassword != null && !dbPassword.isEmpty()) {
                System.out.println("Using database password from environment");
                configuration.setProperty("hibernate.connection.password", dbPassword);
            }

            ConfigUtil.logConfigurationStatus();

            // Add all annotated classes
            configuration.addAnnotatedClass(Students.class);
            configuration.addAnnotatedClass(Grade.class);
            configuration.addAnnotatedClass(Admin_Users.class);
            configuration.addAnnotatedClass(Status.class);
            configuration.addAnnotatedClass(Days.class);
            configuration.addAnnotatedClass(Class_Schedule.class);
            configuration.addAnnotatedClass(Recordings.class);
            configuration.addAnnotatedClass(Recording_Request.class);
            configuration.addAnnotatedClass(Recording_Status.class);
            configuration.addAnnotatedClass(Tutes.class);
            configuration.addAnnotatedClass(Tutes_Request.class);
            configuration.addAnnotatedClass(TutesStatus.class);
            configuration.addAnnotatedClass(PaymentStatus.class);
            configuration.addAnnotatedClass(StudentMonthlyFees.class);
            configuration.addAnnotatedClass(PaymentTransactions.class);
            configuration.addAnnotatedClass(Ol_or_Al.class);
            configuration.addAnnotatedClass(ClassType.class);
            configuration.addAnnotatedClass(StudentClass.class);
            configuration.addAnnotatedClass(GradeClassFee.class);
            configuration.addAnnotatedClass(FreeLesson.class);
            configuration.addAnnotatedClass(OfflinePaymentSubmission.class);

            sessionFactory = configuration.buildSessionFactory();
            System.out.println("Hibernate SessionFactory initialized successfully!");

        } catch (Throwable ex) {
            System.err.println("Initial SessionFactory creation failed: " + ex.getMessage());
            ex.printStackTrace();
            // Log the specific exception
            if (ex.getCause() != null) {
                System.err.println("Root cause: " + ex.getCause().getMessage());
                ex.getCause().printStackTrace();
            }
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public static void shutdown() {
        if (sessionFactory != null && !sessionFactory.isClosed()) {
            sessionFactory.close();
            System.out.println("Hibernate SessionFactory closed.");
        }
    }
}
