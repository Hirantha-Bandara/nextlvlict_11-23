-- Migration: Add support for multiple grades in recordings and tutes
-- This creates junction tables to enable ManyToMany relationships

-- Create junction table for recordings_grades
DROP TABLE IF EXISTS `recording_grades`;
CREATE TABLE `recording_grades` (
  `recording_id` int NOT NULL,
  `grade_id` int NOT NULL,
  PRIMARY KEY (`recording_id`, `grade_id`) USING BTREE,
  INDEX `idx_recording_grades_recording_id` (`recording_id` ASC) USING BTREE,
  INDEX `idx_recording_grades_grade_id` (`grade_id` ASC) USING BTREE,
  CONSTRAINT `fk_recording_grades_recording` FOREIGN KEY (`recording_id`) REFERENCES `recordings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_recording_grades_grade` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- Create junction table for tute_grades
DROP TABLE IF EXISTS `tute_grades`;
CREATE TABLE `tute_grades` (
  `tute_id` int NOT NULL,
  `grade_id` int NOT NULL,
  PRIMARY KEY (`tute_id`, `grade_id`) USING BTREE,
  INDEX `idx_tute_grades_tute_id` (`tute_id` ASC) USING BTREE,
  INDEX `idx_tute_grades_grade_id` (`grade_id` ASC) USING BTREE,
  CONSTRAINT `fk_tute_grades_tute` FOREIGN KEY (`tute_id`) REFERENCES `tutes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tute_grades_grade` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- Migrate existing data: Copy existing single grade relationships to junction tables
INSERT INTO recording_grades (recording_id, grade_id)
SELECT id, grade_id FROM recordings WHERE grade_id IS NOT NULL;

INSERT INTO tute_grades (tute_id, grade_id)
SELECT id, grade_id FROM tutes WHERE grade_id IS NOT NULL;

-- Note: We will keep the grade_id columns in recordings and tutes tables for backward compatibility
-- They will be deprecated but not removed immediately to avoid breaking existing code
