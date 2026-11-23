package com.nextlvlict.nextlvlict.controller;

import com.nextlvlict.nextlvlict.service.MonthlyFeeGenerationService;

/**
 * Monthly Fee Service - Scheduled job for generating monthly fee records.
 * 
 * This service now delegates to MonthlyFeeGenerationService which follows the correct architecture:
 * Student → StudentClass → GradeClassFee → StudentMonthlyFees
 * 
 * Each StudentClass record generates exactly ONE monthly fee record per month.
 * Fee amounts come from GradeClassFee.monthly_fee, NOT Grade.fee.
 * Duplicate prevention uses student_id + class_type_id + month_year.
 */
public class MonthlyFeeService {
    
    /**
     * Generate monthly fee records for all active students for the current month.
     * This method is called by a scheduled job (e.g., cron).
     */
    public static void generateMonthlyFees() {
        System.out.println("Starting monthly fee generation...");
        MonthlyFeeGenerationService.generateMonthlyFeesForAllStudents();
        System.out.println("Monthly fee generation completed.");
    }
}