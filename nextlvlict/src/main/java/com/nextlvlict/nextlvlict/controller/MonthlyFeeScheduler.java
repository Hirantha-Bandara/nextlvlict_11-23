package com.nextlvlict.nextlvlict.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Monthly Fee Scheduler
 *
 * Schedules monthly fee generation to run on the 1st of every month at 00:05.
 * Uses calendar-aware scheduling to avoid drift.
 */
public class MonthlyFeeScheduler {
    
    private static Timer timer;

    public static synchronized void start() {
        if (timer != null) {
            System.out.println("⚠️  MonthlyFeeScheduler is already running");
            return;
        }

        timer = new Timer("MonthlyFeeScheduler", true); // Daemon thread

        // Calculate the first execution time (1st of the month at 00:05)
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 5);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        
        // If today is after the 1st, schedule for next month
        if (calendar.getTime().before(new Date())) {
            calendar.add(Calendar.MONTH, 1);
        }
        
        Date firstRun = calendar.getTime();
        System.out.println("✅ MonthlyFeeScheduler configured. First run: " + firstRun);

        // Schedule with a recurring task that recalculates next run time for calendar accuracy
        timer.schedule(new MonthlyFeeTask(), firstRun, 86400000); // Check daily (24 hours)
    }

    /**
     * Recurring timer task that checks if it's the first day of the month
     * and runs the fee generation if so.
     */
    private static class MonthlyFeeTask extends TimerTask {
        private int lastExecutedMonth = -1;

        @Override
        public void run() {
            try {
                Calendar now = Calendar.getInstance();
                int currentMonth = now.get(Calendar.MONTH);
                int currentYear = now.get(Calendar.YEAR);

                // Check if we're on the 1st or early days of the month, and haven't run this month yet
                if (now.get(Calendar.DAY_OF_MONTH) <= 2 &&
                    (lastExecutedMonth != currentMonth || lastExecutedMonth == -1)) {

                    System.out.println("🔄 Running monthly fee generation: " + new Date());
                    MonthlyFeeService.generateMonthlyFees();
                    lastExecutedMonth = currentMonth;
                    System.out.println("✅ Monthly fee generation completed successfully");

                } else if (now.get(Calendar.DAY_OF_MONTH) > 2) {
                    // Reset the executed flag after the 2nd day to allow re-execution if scheduler restarts mid-month
                    if (now.get(Calendar.DAY_OF_MONTH) > 3) {
                        // Only reset after the 3rd to avoid issues
                        lastExecutedMonth = -1;
                    }
                }
            } catch (Exception e) {
                System.err.println("❌ Error in monthly fee scheduler: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    public static synchronized void stop() {
        if (timer != null) {
            timer.cancel();
            timer = null;
            System.out.println("✅ MonthlyFeeScheduler stopped");
        }
    }
}