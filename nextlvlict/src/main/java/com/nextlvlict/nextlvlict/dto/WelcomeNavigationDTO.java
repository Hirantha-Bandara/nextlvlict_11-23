package com.nextlvlict.nextlvlict.dto;

import java.util.List;

/**
 * Data Transfer Object for Welcome Navigation API response.
 * Contains student's registered grade and all active grades for the navigation modal.
 */
public class WelcomeNavigationDTO {
    
    private GradeInfo registeredGrade;
    private List<GradeInfo> grades;
    private boolean hasFreeResources;
    private boolean hasQuestionPapers;

    public WelcomeNavigationDTO() {
    }

    public WelcomeNavigationDTO(GradeInfo registeredGrade, List<GradeInfo> grades, 
                               boolean hasFreeResources, boolean hasQuestionPapers) {
        this.registeredGrade = registeredGrade;
        this.grades = grades;
        this.hasFreeResources = hasFreeResources;
        this.hasQuestionPapers = hasQuestionPapers;
    }

    public GradeInfo getRegisteredGrade() {
        return registeredGrade;
    }

    public void setRegisteredGrade(GradeInfo registeredGrade) {
        this.registeredGrade = registeredGrade;
    }

    public List<GradeInfo> getGrades() {
        return grades;
    }

    public void setGrades(List<GradeInfo> grades) {
        this.grades = grades;
    }

    public boolean isHasFreeResources() {
        return hasFreeResources;
    }

    public void setHasFreeResources(boolean hasFreeResources) {
        this.hasFreeResources = hasFreeResources;
    }

    public boolean isHasQuestionPapers() {
        return hasQuestionPapers;
    }

    public void setHasQuestionPapers(boolean hasQuestionPapers) {
        this.hasQuestionPapers = hasQuestionPapers;
    }

    /**
     * Inner class for Grade information
     */
    public static class GradeInfo {
        private int id;
        private String name;

        public GradeInfo() {
        }

        public GradeInfo(int id, String name) {
            this.id = id;
            this.name = name;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
