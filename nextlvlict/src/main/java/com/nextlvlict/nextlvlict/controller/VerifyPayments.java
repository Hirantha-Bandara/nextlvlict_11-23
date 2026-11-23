package com.nextlvlict.nextlvlict.controller;

import com.nextlvlict.nextlvlict.hibernate.*;
import com.nextlvlict.nextlvlict.model.PayHere;
import com.nextlvlict.nextlvlict.util.PayHereConfig;
import org.hibernate.Session;
import org.hibernate.Transaction;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

/**
 * PayHere Payment Verification Servlet
 *
 * This servlet verifies PayHere payment signatures and updates the database
 * to record successful payments.
 */
@WebServlet(name = "VerifyPayments", urlPatterns = {"/VerifyPayments"})
public class VerifyPayments extends HttpServlet {

    private static final int PAYHERE_SUCCESS = 2;
    private PayHereConfig payhereConfig;
    
    @Override
    public void init() throws ServletException {
        payhereConfig = PayHereConfig.getInstance();
        payhereConfig.logConfig();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String merchant_id = request.getParameter("merchant_id");
        String order_id = request.getParameter("order_id");
        String payhere_amount = request.getParameter("payhere_amount");
        String payhere_currency = request.getParameter("payhere_currency");
        String status_code = request.getParameter("status_code");
        String md5sig = request.getParameter("md5sig");

        System.out.println("=== VerifyPayments Servlet ===");
        System.out.println("Merchant ID: " + merchant_id);
        System.out.println("Order ID: " + order_id);
        System.out.println("Amount: " + payhere_amount);
        System.out.println("Currency: " + payhere_currency);
        System.out.println("Status Code: " + status_code);
        System.out.println("MD5 Sig: " + md5sig);

        // Validate merchant ID
        if (!merchant_id.equals(payhereConfig.getMerchantId())) {
            System.err.println("❌ Invalid merchant ID");
            return;
        }

        // Verify signature
        String merchantSecret = payhereConfig.getMerchantSecret();
        String merchantSecretMD5Upper = PayHere.generateMD5UpperCase(merchantSecret);
        String expectedHash = PayHere.generateMD5UpperCase(
                merchant_id + order_id + payhere_amount + payhere_currency + status_code + merchantSecretMD5Upper);

        System.out.println("Expected Hash: " + expectedHash);
        System.out.println("Received Hash: " + md5sig);

        if (!md5sig.equals(expectedHash)) {
            System.err.println("❌ Hash verification failed");
            return;
        }

        // Check if payment was successful
        if (Integer.parseInt(status_code) != PAYHERE_SUCCESS) {
            System.out.println("⚠️  Payment status is not success: " + status_code);
            return;
        }

        // Payment is valid and successful - update database
        updatePaymentRecords(order_id, payhere_amount, payhere_currency);
    }

    /**
     * Update database records after successful payment verification
     */
    private void updatePaymentRecords(String orderId, String amount, String currency) {
        Session session = null;
        Transaction transaction = null;

        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Find the monthly fee by transaction ID
            StudentMonthlyFees monthlyFee = (StudentMonthlyFees) session.createQuery(
                    "FROM StudentMonthlyFees WHERE transactionId = :orderId")
                    .setParameter("orderId", orderId)
                    .uniqueResult();

            if (monthlyFee == null) {
                System.err.println("❌ Monthly fee record not found for order: " + orderId);
                transaction.rollback();
                return;
            }

            // Check if already paid
            if (monthlyFee.getStatus() != null && monthlyFee.getStatus().getId() == 2) {
                System.out.println("⚠️  Fee already marked as PAID for order: " + orderId);
                transaction.commit();
                return;
            }

            // Get PAID status
            PaymentStatus paidStatus = session.get(PaymentStatus.class, 2);
            if (paidStatus == null) {
                System.err.println("❌ PAID payment status not found");
                transaction.rollback();
                return;
            }

            // Update monthly fee
            monthlyFee.setStatus(paidStatus);
            monthlyFee.setPaidDate(new Date());
            monthlyFee.setUpdatedAt(new Date());
            session.update(monthlyFee);

            // Create payment transaction record
            PaymentTransactions paymentTx = new PaymentTransactions();
            paymentTx.setStudent(monthlyFee.getStudent());
            paymentTx.setAmount(Double.parseDouble(amount));
            paymentTx.setCurrency(currency);
            paymentTx.setPaymentMethod("PayHere");
            paymentTx.setTransactionId(orderId);
            paymentTx.setDescription("Monthly fee payment for " + monthlyFee.getMonthYear());
            paymentTx.setCreatedAt(new Date());
            paymentTx.setUpdatedAt(new Date());
            paymentTx.setVerificationStatus("completed");
            paymentTx.setVerifiedBy("PAYHERE_VERIFICATION");
            paymentTx.setVerificationDate(new Date());
            paymentTx.setVerificationNotes("Verified through VerifyPayments servlet - PayHere signature validated");

            session.save(paymentTx);

            transaction.commit();
            System.out.println("✅ Payment verified and recorded for order: " + orderId);

        } catch (Exception e) {
            if (transaction != null) {
                try {
                    transaction.rollback();
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
            System.err.println("❌ Error updating payment records: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null && session.isOpen()) {
                try {
                    session.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
