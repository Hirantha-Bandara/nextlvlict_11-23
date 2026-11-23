package com.nextlvlict.nextlvlict.util;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import com.nextlvlict.nextlvlict.controller.MonthlyFeeScheduler;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

public class AppContextListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            System.out.println("=== Application Startup ===");
            System.out.println("Starting MonthlyFeeScheduler...");
            MonthlyFeeScheduler.start();
            System.out.println("✅ MonthlyFeeScheduler started successfully");
        } catch (Exception e) {
            System.err.println("❌ Error starting MonthlyFeeScheduler: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Deregister JDBC drivers to prevent Tomcat warnings about memory leaks
        try {
            Enumeration<Driver> drivers = DriverManager.getDrivers();
            while (drivers.hasMoreElements()) {
                Driver driver = drivers.nextElement();
                try {
                    DriverManager.deregisterDriver(driver);
                    System.out.println("Deregistered JDBC driver: " + driver);
                } catch (SQLException ex) {
                    System.err.println("Error deregistering driver " + driver + ": " + ex.getMessage());
                }
            }
        } catch (Throwable t) {
            System.err.println("Error while deregistering JDBC drivers: " + t.getMessage());
        }

        // Attempt to shutdown MySQL's AbandonedConnectionCleanupThread (connector/j)
        try {
            Class<?> c = Class.forName("com.mysql.cj.jdbc.AbandonedConnectionCleanupThread");
            java.lang.reflect.Method m = c.getMethod("checkedShutdown");
            m.invoke(null);
            System.out.println("Called AbandonedConnectionCleanupThread.checkedShutdown()");
        } catch (ClassNotFoundException cnf) {
            // MySQL driver not present on classpath
        } catch (Throwable t) {
            System.err.println("Error while shutting down AbandonedConnectionCleanupThread: " + t.getMessage());
        }
    }
}


