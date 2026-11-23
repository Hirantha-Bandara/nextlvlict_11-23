package com.nextlvlict.nextlvlict.model;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import jakarta.xml.bind.DatatypeConverter;

public class PayHere {

    // Lowercase MD5 (for internal use)
    public static String generateMD5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes());
            return DatatypeConverter.printHexBinary(digest).toLowerCase();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    // Uppercase MD5 (for PayHere hash - REQUIRED)
    public static String generateMD5UpperCase(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes());
            return DatatypeConverter.printHexBinary(digest).toUpperCase();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
