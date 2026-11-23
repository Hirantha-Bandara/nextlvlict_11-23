/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80046 (8.0.46)
 Source Host           : localhost:3306
 Source Schema         : nextlvlict

 Target Server Type    : MySQL
 Target Server Version : 80046 (8.0.46)
 File Encoding         : 65001

 Date: 20/11/2026 10:17:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `line1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `line2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `postalcode` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `city` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `provinces_id` int NOT NULL,
  `districts_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_address_provinces_idx`(`provinces_id` ASC) USING BTREE,
  INDEX `idx_districts_id`(`districts_id` ASC) USING BTREE,
  CONSTRAINT `fk_address_districts` FOREIGN KEY (`districts_id`) REFERENCES `districts` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_address_provinces` FOREIGN KEY (`provinces_id`) REFERENCES `provinces` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 97665668 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES (10268396, '65/2saamagi mawatha', 'Makuludoowa pilliyandala', '10300', 'Pilliyandala', 3, 'D001');
INSERT INTO `address` VALUES (10420484, '38/5A, Dewala road, Pamunuwa, Maharagama,Colombo', '', '', 'Colombo', 3, 'D001');
INSERT INTO `address` VALUES (10526547, '22a Nihal Nelson Mawatha', '', '10400', 'Moratuwa', 3, 'D001');
INSERT INTO `address` VALUES (11389536, '327/3/7 Saranatissa Road Kahathuduwa ', '327/3/7 Saranatissa Road Kahathuduwa ', '10300', 'Kahathuduwa ', 3, 'D001');
INSERT INTO `address` VALUES (11701519, 'No. 195, bandaragama road, kesbawa', '', '', 'Colombo', 3, 'D001');
INSERT INTO `address` VALUES (11918340, '48/2', 'Colombo road,Piliyandala', '10300', 'colombo', 3, 'D001');
INSERT INTO `address` VALUES (12591583, '381/A/9', 'Pragathi Mawatha,Polgasowita,Kahathuduwa', 'Sasindi1234', 'Kahathuduwa', 3, 'D001');
INSERT INTO `address` VALUES (14022600, '66/T, sirirathana mawatha , kahapola , madapatha', '', '10306', 'piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (14026733, '142/1 Colombo road, Piliyandala', '', '', 'piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (14404185, '320/A, Kananwila, Horana', '', '12400', 'Horana', 3, 'D003');
INSERT INTO `address` VALUES (16558092, 'No 50/1/1 Elhena Road Maharagama ', '', '10280', 'Maharagama ', 3, 'D001');
INSERT INTO `address` VALUES (17289177, 'no 23 ', 'dalthara', '', 'piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (17697992, '232/C, Pitipana South ', 'Galagahena, Kiriwaththuduwa ', '10200', 'Home ', 3, 'D001');
INSERT INTO `address` VALUES (17900166, '210 / 71 F, Isuru uyana road, Kattuwawala, Boralasgamuwa', '', '10280', 'Colombo', 3, NULL);
INSERT INTO `address` VALUES (17910902, '12/26, Ekasath Mawatha, Depanama', '', '10230', 'Pannipitiya', 3, NULL);
INSERT INTO `address` VALUES (17910904, '690/5A, Kulasewana Road', '', '10230', 'Kottawa', 3, NULL);
INSERT INTO `address` VALUES (17910988, '58/18B, 1st Lane,', 'Galawilapura, Homagama.', '10200', 'Homagama', 3, NULL);
INSERT INTO `address` VALUES (17911028, '19/A1,Galpotta Road', 'Pore', '10150', 'Athurugiriya', 3, NULL);
INSERT INTO `address` VALUES (17911223, '316/1 Bodhiya Mavatha,', 'Kaliyammahara,', '10300', 'Piliyandala', 3, NULL);
INSERT INTO `address` VALUES (17911861, '232/4 Koskanaththa road,Mampe,Piliyandala', '', '', 'Piliyandala', 3, NULL);
INSERT INTO `address` VALUES (17912060, '32/1 Vishnu kovila Rd,Nedimala,Dehiwala.', '', '10350', 'Dehiwala', 3, NULL);
INSERT INTO `address` VALUES (17913425, 'No.25/6,Vidyala wata mawatha ,Piliyandala', '', '10300', 'Piliyandala ', 3, NULL);
INSERT INTO `address` VALUES (17916355, '176-ptipana North', 'Homagama ', '10290', 'Homagama', 3, NULL);
INSERT INTO `address` VALUES (17918198, 'No.76,Weera Uditha MW,Hadigama,Piliyandala', '', '10300', 'Piliyandala', 3, NULL);
INSERT INTO `address` VALUES (17918718, '233/17/1,Jayamawatha', 'Kudamaduwa,Siddamulla ', '', 'Piliyandala', 3, NULL);
INSERT INTO `address` VALUES (19541313, '9/10/D/21', 'Thumbovilla,Piliyandala', '', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (20265217, '230/1 Pannil kanda', 'Kananwila,Horana', '12418', 'Horana', 3, 'D003');
INSERT INTO `address` VALUES (20271628, 'NO:11/HASIRI UYANA ', 'KATUWAWALA ', '10290', 'BORALESGAMUWA', 3, 'D001');
INSERT INTO `address` VALUES (20297363, '2/2B Duwawaththa Road ,Thumbovila ,Piliyandala', '2/2B Duwawaththa Road ,Thumbovila ,Piliyandala', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (20506812, 'No16,School road,Olaboduwa,Gonapola', '', '12400', 'Gonapola', 3, 'D003');
INSERT INTO `address` VALUES (20569176, 'no,72 baddagana road north ', 'pita kotte kotte', '', 'kotte ', 3, 'D001');
INSERT INTO `address` VALUES (20904174, 'No:1/2,1st lane', 'Gorakapitiya ', '10320', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (21105173, '232/C, Pitipana south ', 'Galagahena, Kiriwaththuduwa ', '10200', 'Homagama ', 3, 'D001');
INSERT INTO `address` VALUES (21845094, '75/73 Pollawatta', '75/73 pollawathha', '', 'මහරගම', 3, 'D001');
INSERT INTO `address` VALUES (22832992, '175/3C, Elvitigala MW,, Rahmaaldenya Rd, Pannipitiya', '', '10230', 'Pannipitiya', 3, 'D001');
INSERT INTO `address` VALUES (23261191, '500/36/3/1-B Bloemendhal road Colombo 15', 'Bloemendhal road', '01500', 'Modara', 3, 'D001');
INSERT INTO `address` VALUES (23290476, '610/81,sumaga mawatha pitipana nagaraya, homagama', '', '', 'Homagama', 3, 'D001');
INSERT INTO `address` VALUES (23315168, '320/B1 Liyangahawaththa ,Ellawala', '', '', 'Eheliyagoda', 6, 'D024');
INSERT INTO `address` VALUES (23350677, 'Gangarama Vihara Mawatha', 'Asiri Uyana', '309/6', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (23742739, '28/35/10,Buddhaloka MW', 'Suwarapola', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (24838003, '48/2', 'Colombo Road ', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (25649536, '2/2B , Duwawaththa Road', 'Thumbovila, Piliyandala', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (26434722, 'No. 592/A, Nawagama, Dehiattakandiya', '', '200982202915', 'Dehiattakandiya', 7, 'D016');
INSERT INTO `address` VALUES (26839613, '781/1,Gemunu Mawatha ', '-', '', 'Homagama', 3, 'D001');
INSERT INTO `address` VALUES (27176078, 'Urupelewwa , Kuruwita', '', '750', 'Kuruwita', 6, 'D024');
INSERT INTO `address` VALUES (31566376, 'No.76/A,Bandarawatta,Batakattara,Piliyandala ', 'No.76/A,Bandarawatta,Batakattara,Piliyandala ', '10300', 'Piliyandala ', 2, 'D001');
INSERT INTO `address` VALUES (32567555, '167/13 Samindu Lane,Honnanthara,Piliyandala ', '', '10300', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (32920715, '601,Nilmini, Pirivena Road,Boralesgamuwa ', '', '522', 'Boralesgamuwa ', 3, 'D001');
INSERT INTO `address` VALUES (32944659, '2/255,දිමිටිගෙවත්ත,කුඩමාදූව,සිද්දමුල්ල,පිලියන්දල', '2/255,දිමිටිගෙවත්ත,කුඩමාදූව,සිද්දමුල්ල,පිලියන්දල', '10304', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (33611104, '98/3,madapatha road,piliyandala ', '48/A,Maharagama road,piliyandala', '', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (33882587, '44 B', 'Kolamunna,Piliyandala', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (34435065, '573/A,Lake Road,Boralesgamuwa ', '216/8/A,Jaya mawatha,watareka,Padukka', '10280', 'Boralesgamuwa ', 3, 'D001');
INSERT INTO `address` VALUES (35446460, '148/14 1st lane, vihara mawatha, honnanthara, piliyandala', '', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (36572839, '73/6/B WEERA UDITHA MAWATH, HADIGAMA,Piliyandala ', '73/6/B WEERA UDITHA MAWATH, HADIGAMA, Piliyandala ', '10300', 'Colombo', 7, 'D001');
INSERT INTO `address` VALUES (37042929, 'No.1/53 \'Sarasanda\' Ihala Katuneriya, Katuneriya ', '', '', 'Wennappuwa ', 2, 'D019');
INSERT INTO `address` VALUES (37549559, '23', 'dalthara ', '10230', 'piliyandal', 3, 'D001');
INSERT INTO `address` VALUES (37836597, '159/2 piliyanda road,Maharagama', '', '10280', 'Maharagama', 3, 'D001');
INSERT INTO `address` VALUES (37949802, '21/B Moranda Road', 'Thoranawila,Piliyandala', '', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (39189503, 'C8, Sirimal Uyana ', 'Gadabuwana', '10300', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (39662771, '60/10 Balaskanda Awissawella ', '60/10 Balaskanda Awissawella ', '', 'Awissawella ', 3, 'D001');
INSERT INTO `address` VALUES (40302823, 'No.422 Waragoda road, Kelaniya ', '', '11600', 'Kelaniya ', 3, 'D002');
INSERT INTO `address` VALUES (41666874, '582/3samagi mawatha,homagama', '582/3samagimawatha homagama', 'Hb123', 'Homagama', 3, 'D001');
INSERT INTO `address` VALUES (42137062, '145/12, pamunuwa rd, maharagama', '', '', 'Maharagama', 3, 'D001');
INSERT INTO `address` VALUES (43293496, '487/1/A/A, pitipana north ', 'Mahinda mawatha ', '10200', 'Homagama ', 3, 'D001');
INSERT INTO `address` VALUES (44090987, '89/9herman mainar mawatha,', 'Halpita,Polgasovita', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (45998470, '17/21,Hettiyawatta,Lanciyawadiya,Kotugoda', '', '11390', 'Kotugoda', 3, 'D002');
INSERT INTO `address` VALUES (46437310, '48', 'Colombo Rd', '10300', 'piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (46674720, 'No.76/4,10 th lane,amblillawaththa road,boralesgamuwa', '', '', 'Maharagama ', 3, 'D001');
INSERT INTO `address` VALUES (47116946, '167/13 Samindu Lane,Honnanthara,Piliyandala ', '', '10300', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (48440159, '1/A/7/Universal Court Wataraka Meegoda', '', '10504', 'Colombo', 3, 'D001');
INSERT INTO `address` VALUES (48831679, '207 3rd Ln', '', '', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (48966227, '457)Q/16', 'Highway edge, kahathuduwa', '10320', 'Polgasowita', 3, 'D001');
INSERT INTO `address` VALUES (49031210, 'No21 bandaranayka niwasa ', 'Miriswaththa piliyandala ', 'No 21', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (49041534, '238/1/A', 'Dulammahara piliyandala', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (50170200, '94/1 A ,Watareka', 'Padukka', '10500', 'Colombo', 3, 'D001');
INSERT INTO `address` VALUES (52404345, '716/35/A kulasewana road,kottawa', '', '10230', 'Kottawa', 3, 'D001');
INSERT INTO `address` VALUES (52594794, 'No: 17/1A ,3rd New Lane ', 'Thalpitiya South, Udugalla, Wadduwa. ', '12560', 'Wadduwa ', 3, 'D003');
INSERT INTO `address` VALUES (52751858, '200/23/A ', 'Isurupura Mawatha, Kesbewa', '10300', 'Kesbewa', 3, 'D001');
INSERT INTO `address` VALUES (53860041, '580/4,Suba Sadhaka Mawatha,Arawwala,Pannipitiya', '', '', 'Arawwala', 3, 'D001');
INSERT INTO `address` VALUES (54200314, '203/29 sapumal uyana ,kotagedara road, batakaththara, madapatha ', 'Floor', '10306', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (54919267, '306/34 /B2', 'Dibbadde, Olaboduwa, Gonapola ', '', 'Gonapola ', 3, 'D003');
INSERT INTO `address` VALUES (56334284, 'MANDADUWA RD', 'BOGAHAWATHTHA', '1027', 'වීරකැටිය', 9, 'D009');
INSERT INTO `address` VALUES (56894875, '81/1/7 Alubogahawatta', 'kottawa road mavittara', '10300', 'piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (57084478, '210/71F,Isuru Uyana Road,Neelammahara', 'Kattuwawala,Boralasgamuwa', '10290', 'Boralasgamuwa', 3, 'D001');
INSERT INTO `address` VALUES (57224758, '232 Galle Rode valithara ', 'Balapitiya', '80550', 'Balapitiya', 9, 'D007');
INSERT INTO `address` VALUES (57821489, '108/2/C Sri Sirirathana mawatha Kahapola Madapatha', '', '', 'piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (59879009, '145/12', '145/12', 'colombo', 'maharagama', 3, 'D001');
INSERT INTO `address` VALUES (60181943, 'No,34/2, Jayanthi road, nampamunuwa, piliyandala ', 'No, 34/2, Jayanthi road, nampamunuwa, piliyandala ', '', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (60345530, '153/2B/1, Sawsiri Uyana', 'Kirigampamunuwa', '10240', 'Maththegoda', 3, 'D001');
INSERT INTO `address` VALUES (60602886, '155/1B High Level Road,Pannipitiya ', '', '', 'Pannipitiye ', 3, 'D001');
INSERT INTO `address` VALUES (62865579, 'no 23 ', 'dalthara', '1234', 'piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (62941451, '232/C, Pitipana south, ', 'Galagahena, Kiriwaththuduwa, ', '10200. ', 'Homagama. ', 3, 'D001');
INSERT INTO `address` VALUES (63698731, '662/A Wasana Mawatha Galawila Road Homagama ', '81, Station Road Homagama ', '10200', 'Homagama ', 3, 'D001');
INSERT INTO `address` VALUES (64198866, '191', 'Moratuwa Road', '', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (64417464, 'Malapalla,homagama', 'Damrisi rd', '10200', 'Homagama', 3, 'D001');
INSERT INTO `address` VALUES (65246391, '352/A9, Isuru Uyana, Palanwatta, Pannipitya.', '', '10230', 'Pannipitya', 3, 'D001');
INSERT INTO `address` VALUES (66867637, 'No 50 Elhena Road Maharagama ', '', '10280', 'Maharagama ', 3, 'D001');
INSERT INTO `address` VALUES (69936718, 'No.28/2/2, Jamburaliya, Madapatha.', '', '10370', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (70286069, 'Pahalagama/mahabulankulama/Anuradhpura ', 'Pahalagama/mahabulankulama/Anuradhpura ', '', 'Anuradhpura ', 4, 'D020');
INSERT INTO `address` VALUES (70605808, '159/4 Weda Mawatha, Piliyandala', '', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (70768241, '103/20sunflower garden kahathuduwa', '103/20sunflower garden kahathuduwa', '10300/10508', 'Kahathuduwa', 3, 'D001');
INSERT INTO `address` VALUES (71137516, '175/3C, Elvitigala MW, Rathmaldenya Rd, Pannipitiya', '175/3C, Elvitigala MW, Rathmaldenya Rd, Pannipitiya', '10230', 'Pannipitiya', 3, 'D001');
INSERT INTO `address` VALUES (71190160, 'Rukmalee ', '101/3', '10230', 'Kottawa', 3, 'D001');
INSERT INTO `address` VALUES (72324901, '204/G/14 Gangabada road ', 'Welmilla junction, kindelpitiya ', '', 'Bandaragama ', 3, 'D003');
INSERT INTO `address` VALUES (73031523, '4/2 nilammahararod  katuwawala boralasgamuwa', '', '10209', 'Boralasgamuwa', 3, 'D001');
INSERT INTO `address` VALUES (73907362, '38/16 1st street Vishwakalawa Maharagama Road Mampe Piliyandala ', 'Unit', '10300', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (75533922, 'No 1/5B Hedigama piliyandala ', '', '10300', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (76169294, '504/10E, 3rd lane', 'Weerodara Mawatha, Arawwala, Pannipitiya.', '10230', 'Pannipitiya', 3, 'D001');
INSERT INTO `address` VALUES (77787660, 'No 6A kalinga mawatha kirulapone colombo 05 ', 'No 6A kalinga mawatha kirulapone colombo 05', '', 'Colombo ', 3, 'D001');
INSERT INTO `address` VALUES (78222010, '444/C, Wewa Rd', 'Kahathuduwa', '10320', 'Polgasowita', 3, 'D001');
INSERT INTO `address` VALUES (78712039, 'Medananda mawatha ', 'Makuluduwa ', '61/1/f', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (78743359, '115/A, Templeroad,Ambalangoda,Polgasowita', '', '10320', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (79072956, 'No:115/5,Katuwawala,Boralesgamuwa', '', '', 'Boralesgamuwa', 3, 'D001');
INSERT INTO `address` VALUES (80726902, '1', '47 Sumudu place', '10400', 'මොරටුව', 3, 'D001');
INSERT INTO `address` VALUES (80880898, 'Pawana,allewela,maramba,Akuressa', '', '81416', 'Akuressa', 9, 'D008');
INSERT INTO `address` VALUES (81008567, '148/B/2, Wehera Keitya Watta, Lane 6th, Kothewala, Bandaragama ', 'Building ', '', 'Bandaragama ', 3, 'D003');
INSERT INTO `address` VALUES (82292213, 'Asiri mavatha,hadigama para,suwarapola,piliyandala', '72/1A', 'No', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (83095281, '30/3 Ambalangoda ', 'Polgassovita ', '10320', 'Polgassovita ', 3, 'D001');
INSERT INTO `address` VALUES (83147291, '99/3 aluthwahtha, naligama,mirigama', '', '11200', 'mirigama', 3, 'D002');
INSERT INTO `address` VALUES (83346643, '177/F, 2nd Lane, Mihira Mawata, Makuluduwa, Piliyandala', '', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (83484991, 'Batadobagahawattha Ln', '', '10280', 'Maharagama', 3, 'D001');
INSERT INTO `address` VALUES (84135734, 'jaya mavatha,Watareka,padukka', '', '', 'Homagama', 3, 'D001');
INSERT INTO `address` VALUES (84704824, 'No.184/A Diyakada Road', 'Kahathuduwa, Polgasowita', '10320', 'Kesbewa', 3, 'D001');
INSERT INTO `address` VALUES (84830611, '251/A, Galakumbura Rd., Neelammahara, Boralesgamuwa', '', '10290', 'Boralesgamuwa', 3, 'D001');
INSERT INTO `address` VALUES (85638220, '827/D,Gemunu Mawatha', '-', '', 'Homagama ', 3, 'D001');
INSERT INTO `address` VALUES (85859083, '1F', 'Rilawala,Polgasowita', '10320', 'Kahathuduwa', 3, 'D001');
INSERT INTO `address` VALUES (86352870, '136/9 madapatha road,batakeththara', '', '', 'Piliyandala ', 3, 'D001');
INSERT INTO `address` VALUES (86649016, 'Jayantha, Maliban mawatha,', 'Walahanduwa', '80000', 'Galle', 9, 'D007');
INSERT INTO `address` VALUES (87719630, '40/E, Gammanawatta road, 5th lane, Mavitttara, Piliyandala.', '', '', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (89925955, '43/C/15', 'Yatiyanawatta road hedigama piliyandala', '10300', 'Piliyandala', 3, 'D001');
INSERT INTO `address` VALUES (90146101, 'No.263/1/4 Dehigahavita, Ovitigama, Meegoda ', '-', '10504', 'Meegoda', 3, 'D001');
INSERT INTO `address` VALUES (90232365, '135/12A Neelammahara Road,Jayamawatha,Maharagama', 'Jayamawatha', '10280', 'Maharagama', 3, 'D001');
INSERT INTO `address` VALUES (90718601, '251/1B,', 'Ambahena , Pitipana South , Kirivattuduwa', '10200', 'Homagama ', 3, 'D001');
INSERT INTO `address` VALUES (91742552, '125/R/21,Pinnawala,Madapatha,Piliyandala ', 'Blue Mountain Properties ', '10306', 'Colombo ', 3, 'D001');
INSERT INTO `address` VALUES (93597790, '126/8', 'Nallawaththa road,', '10280', 'Maharagama.', 3, 'D001');
INSERT INTO `address` VALUES (95812459, '236/c', 'Ehalape road, Neelammahara ', '10290', 'Boralesgamuwa ', 3, 'D001');
INSERT INTO `address` VALUES (97665667, '230/1 Pannil kanda', 'Kananwila,Horana', '12418', 'Horana', 3, 'D003');

-- ----------------------------
-- Table structure for admin_users
-- ----------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admin_users
-- ----------------------------
INSERT INTO `admin_users` VALUES (1, 'admin', 'admin@gmail.com', '$2a$12$.2SeE3dLFq9yaO5hz1CEFe9MXu2eoNCSNq1WyNy3Y2D6lBafCVl1e', 1, '2025-12-04 13:43:10');

-- ----------------------------
-- Table structure for al_timetable
-- ----------------------------
DROP TABLE IF EXISTS `al_timetable`;
CREATE TABLE `al_timetable`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `year` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `class_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `time` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `display_order` int NULL DEFAULT 0,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 152 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of al_timetable
-- ----------------------------
INSERT INTO `al_timetable` VALUES (147, 'SIYOCHEM - NUGEGODA', '2028 Theory', 'Theory', 'Sunday 1.00PM - 3.30PM', 0, 1, '2026-09-24 20:51:45', '2026-09-24 20:51:45');
INSERT INTO `al_timetable` VALUES (148, 'SESIRA - PILIYANDALA', '2028 Theory', 'Theory', 'Saturday 1.00PM - 3.30PM', 1, 1, '2026-09-24 20:51:45', '2026-09-24 20:51:45');
INSERT INTO `al_timetable` VALUES (149, 'ONLINE - ZOOM', '2028 Theory', 'Theory', 'Tuesday 8.00PM - 10.30PM', 2, 1, '2026-09-24 20:51:45', '2026-09-24 20:51:45');
INSERT INTO `al_timetable` VALUES (150, 'SESIRA - PILIYANDALA', '2027 Theory + Revision', 'Theory', 'Thursday 8.00AM - 3.00PM', 3, 1, '2026-09-24 20:51:45', '2026-09-24 20:51:45');
INSERT INTO `al_timetable` VALUES (151, 'WINGS - MAHARAGAMA', '2027 Theory + Revision', 'Theory', 'Wednesday 8.00AM - 3.00PM', 4, 1, '2026-09-24 20:51:45', '2026-09-24 20:51:45');

-- ----------------------------
-- Table structure for bundle_lessons
-- ----------------------------
DROP TABLE IF EXISTS `bundle_lessons`;
CREATE TABLE `bundle_lessons`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `bundle_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `youtube_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `display_order` int NULL DEFAULT 0,
  `is_active` int NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `bundle_id`(`bundle_id` ASC) USING BTREE,
  CONSTRAINT `bundle_lessons_ibfk_1` FOREIGN KEY (`bundle_id`) REFERENCES `recording_bundles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 216 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of bundle_lessons
-- ----------------------------
INSERT INTO `bundle_lessons` VALUES (11, 10, 'Recording 1', '', 'https://youtu.be/dGghkjpNCQ8', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (12, 10, 'Recording 2', '', 'https://youtu.be/dGghkjpNCQ8', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (13, 11, 'Recording 1', '', 'https://www.youtube.com/live/Rp5LyMgvRP0?si=IuJOpGxvPTP07qLu', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (14, 11, 'Recording 2', '', 'https://www.youtube.com/live/GTvmgKFTpjI?si=saLfqzH-3gS1LxqT', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (15, 11, 'Recording 3', '', 'https://www.youtube.com/live/Jvzw_FQFivM?si=g87yvMSJ1r_aeeRE', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (16, 11, 'Recording 4', '', 'https://www.youtube.com/live/alaHKn26T58?si=V-dOr2hdMJrdJDp9', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (17, 11, 'Recording 5', '', 'https://www.youtube.com/live/L8LlAHL1AqA?si=eD9De9cbMQGijnEh', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (18, 11, 'Recording 6', '', 'https://www.youtube.com/live/3IeM3CR45VE?si=UOzE6LrwlhxmqtWc', NULL, 5, 1);
INSERT INTO `bundle_lessons` VALUES (19, 11, 'Recording 7', '', 'https://www.youtube.com/live/zZ3Lmy21Vmg?si=L3VoJreY9Tfy-7pt', NULL, 6, 1);
INSERT INTO `bundle_lessons` VALUES (20, 11, 'Recording 8', '', 'https://youtube.com/live/qRbs6mDBVR0?feature=share', NULL, 7, 1);
INSERT INTO `bundle_lessons` VALUES (21, 11, 'Recording 9', '', 'https://youtube.com/live/QRfTJptPnPo?feature=share', NULL, 8, 1);
INSERT INTO `bundle_lessons` VALUES (22, 11, 'Recording 10', '', 'https://youtube.com/live/hmLY9UV5HEw?feature=share', NULL, 9, 1);
INSERT INTO `bundle_lessons` VALUES (23, 11, 'Recording 11', '', 'https://youtube.com/live/qFIBhBeFwLE?feature=share', NULL, 10, 1);
INSERT INTO `bundle_lessons` VALUES (24, 11, 'Recording 12', '', 'https://youtube.com/live/zq4FB3vnWZo?feature=share', NULL, 11, 1);
INSERT INTO `bundle_lessons` VALUES (25, 11, 'Recording 13', '', 'https://youtube.com/live/JLOl5ccW9wg?feature=share', NULL, 12, 1);
INSERT INTO `bundle_lessons` VALUES (26, 11, 'Recording 14', '', 'https://youtube.com/live/wm6-5QF0l4M?feature=share', NULL, 13, 1);
INSERT INTO `bundle_lessons` VALUES (27, 12, 'Recording 1', '', 'https://youtube.com/live/xq2rELSBQSU?feature=share', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (28, 13, 'Recording 1', '', 'https://youtube.com/live/xq2rELSBQSU?feature=share', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (29, 14, 'Recording 1', '', 'https://youtube.com/live/H9B8rrPQrQU?feature=share', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (30, 14, 'Recording 2', '', 'https://youtube.com/live/F9s6ycNeVXg?feature=share', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (31, 14, 'Recording 3', '', 'https://youtu.be/KHOR5QXPly0?si=pr9IsHl5dIbsLUoH', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (32, 14, 'Recording 4', '', 'https://youtube.com/live/HSmF67BrShs?feature=share', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (33, 14, 'Recording 5', '', 'https://youtube.com/live/sKGMoPmdDsE?feature=share', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (37, 16, 'Recording 1', '', 'https://www.youtube.com/live/2AfFWlWTYZ4?si=S7D2mLDLLGLwXp3u', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (38, 16, 'Recording 2', '', 'https://www.youtube.com/live/h-61lZR6z94?si=wIVE_kCHdZHFyNlX', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (39, 16, 'Recording 3', '', 'https://www.youtube.com/live/0MHoE_kyMz4?si=IbRLtFgsnkWRksFB', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (40, 16, 'Recording 4', '', 'https://www.youtube.com/live/V660dAtBcwM?si=mWnTP48nPgV-gVib', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (41, 16, 'Recording 5', '', 'https://www.youtube.com/live/V660dAtBcwM?si=mWnTP48nPgV-gVib', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (42, 16, 'Recording 6', '', 'https://www.youtube.com/live/spiFI71zKqE?si=m1PLXoKivTagf6Of', NULL, 5, 1);
INSERT INTO `bundle_lessons` VALUES (43, 16, 'Recording 7', '', 'https://www.youtube.com/live/NVMA3P7r9HM?si=fsncGALLMJzVUBxO', NULL, 6, 1);
INSERT INTO `bundle_lessons` VALUES (44, 16, 'Recording 8', '', 'https://www.youtube.com/live/VobA9EVJ5us?si=QaWbmjUsgv7UFB6C', NULL, 7, 1);
INSERT INTO `bundle_lessons` VALUES (48, 17, 'Recording 1', '', 'https://www.youtube.com/live/WV_h3J06D_s?si=55JZV8qlWFzcXCik', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (49, 17, 'Recording 2', '', 'https://www.youtube.com/live/HRQLXk6-v68?si=4awKyLB0bx92Q1YT', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (50, 17, 'Recording 3', '', 'https://www.youtube.com/live/CzEHpE44k84?si=290Ro82naHvSI-NI', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (51, 15, 'Recording 1', '', 'https://youtube.com/live/FRZEY-4UyTs?feature=share', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (52, 15, 'Recording 2', '', 'https://youtube.com/live/9pQxYh29LaM?feature=share', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (53, 15, 'Recording 3', '', 'https://youtube.com/live/OrjrIZZr6h4?feature=share', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (63, 19, 'Recording 1', '', 'https://www.youtube.com/live/5heslKxZXw0?si=O7ehQb8-vFhsVXK-', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (64, 19, 'Recording 2', '', 'https://youtube.com/live/_ZfiTH4Sm_I?feature=share', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (65, 19, 'Recording 3', '', 'https://youtube.com/live/rF7kdegDP_s?feature=share', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (66, 19, 'Recording 4', '', 'https://www.youtube.com/live/KkTwe8fKvnc?si=Q7N2luD36UNIK0dr', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (67, 19, 'Recording 5', '', 'https://youtube.com/live/c11cTVY6sMY?feature=share', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (68, 20, 'Recording 1', '', 'https://www.youtube.com/live/KN2DLpAoPtg?si=Is9VcajL0F9ZBg9s', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (69, 20, 'Recording 2', '', 'https://www.youtube.com/live/_RQAXm1jPcM?si=GYHwwJeziI832WYl', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (70, 20, 'Recording 3', '', 'https://youtube.com/live/eLbPSFiVtrs?feature=share', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (71, 20, 'Recording 4', '', 'https://youtube.com/live/Y5tlP158EDY?feature=share', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (72, 21, 'Recording 1', '', 'https://youtube.com/live/7HiBMyEGDPE?feature=share', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (73, 21, 'Recording 2', '', 'https://youtube.com/live/VqWRClaio3U?feature=share', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (74, 21, 'Recording 3', '', 'https://youtube.com/live/JqedLecnwvg?feature=share', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (75, 21, 'Recording 4', '', 'https://youtube.com/live/-rG3o75VT_E?feature=share', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (76, 22, 'Recording 1', '', 'https://www.youtube.com/live/AAuU27vgjq4?si=uv6HyDEgLezQ3RJu', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (77, 22, 'Recording 2', '', 'https://www.youtube.com/live/U6pYLHzMfRE?si=Abf3vzdcczt8U_-C', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (78, 22, 'Recording 3', '', 'https://www.youtube.com/live/C3bcCmifgog?si=6ubYWV6ddWAWQkp7', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (79, 22, 'Recording 4', '', 'https://www.youtube.com/live/fh74K1z0BbA?si=cIT7JPlMVYZ-6-gD', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (80, 22, 'Recording 5', '', 'https://www.youtube.com/live/Ve6UGflz7Sw?si=heW1L_yQHFV_5pKI', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (81, 22, 'Recording 6', '', 'https://www.youtube.com/live/yHudZwjBg44?si=5kWzDxq3uHRgu5yQ', NULL, 5, 1);
INSERT INTO `bundle_lessons` VALUES (82, 22, 'Recording 7', '', 'https://youtube.com/live/98_QmaHR1gw?feature=share', NULL, 6, 1);
INSERT INTO `bundle_lessons` VALUES (92, 23, 'Recording 1', '', 'https://www.youtube.com/live/WV_h3J06D_s?si=55JZV8qlWFzcXCik', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (93, 23, 'Recording 2', '', 'https://www.youtube.com/live/HRQLXk6-v68?si=4awKyLB0bx92Q1YT', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (94, 23, 'Recording 3', '', 'https://www.youtube.com/live/CzEHpE44k84?si=290Ro82naHvSI-NI', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (104, 25, 'Recording 1', '', 'https://www.youtube.com/live/5heslKxZXw0?si=O7ehQb8-vFhsVXK-', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (105, 25, 'Recording 2', '', 'https://youtube.com/live/_ZfiTH4Sm_I?feature=share', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (106, 25, 'Recording 3', '', 'https://youtube.com/live/rF7kdegDP_s?feature=share', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (107, 25, 'Recording 4', '', 'https://www.youtube.com/live/KkTwe8fKvnc?si=Q7N2luD36UNIK0dr', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (108, 25, 'Recording 5', '', 'https://youtube.com/live/c11cTVY6sMY?feature=share', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (113, 26, 'Recording 1', '', 'https://www.youtube.com/live/KN2DLpAoPtg?si=Is9VcajL0F9ZBg9s', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (114, 26, 'Recording 2', '', 'https://www.youtube.com/live/_RQAXm1jPcM?si=GYHwwJeziI832WYl', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (115, 26, 'Recording 3', '', 'https://youtube.com/live/eLbPSFiVtrs?feature=share', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (116, 26, 'Recording 4', '', 'https://youtube.com/live/Y5tlP158EDY?feature=share', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (117, 27, 'Recording 1', '', 'https://youtube.com/live/7HiBMyEGDPE?feature=share', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (118, 27, 'Recording 2', '', 'https://youtube.com/live/VqWRClaio3U?feature=share', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (119, 27, 'Recording 3', '', 'https://youtube.com/live/JqedLecnwvg?feature=share', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (120, 27, 'Recording 4', '', 'https://youtube.com/live/-rG3o75VT_E?feature=share', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (121, 28, 'Recording 1', '', 'https://www.youtube.com/live/AAuU27vgjq4?si=uv6HyDEgLezQ3RJu', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (122, 28, 'Recording 2', '', 'https://www.youtube.com/live/U6pYLHzMfRE?si=Abf3vzdcczt8U_-C', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (123, 28, 'Recording 3', '', 'https://www.youtube.com/live/C3bcCmifgog?si=6ubYWV6ddWAWQkp7', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (124, 28, 'Recording 4', '', 'https://www.youtube.com/live/fh74K1z0BbA?si=cIT7JPlMVYZ-6-gD', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (125, 28, 'Recording 5', '', 'https://www.youtube.com/live/Ve6UGflz7Sw?si=heW1L_yQHFV_5pKI', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (126, 28, 'Recording 6', '', 'https://www.youtube.com/live/yHudZwjBg44?si=5kWzDxq3uHRgu5yQ', NULL, 5, 1);
INSERT INTO `bundle_lessons` VALUES (127, 28, 'Recording 7', '', 'https://youtube.com/live/98_QmaHR1gw?feature=share', NULL, 6, 1);
INSERT INTO `bundle_lessons` VALUES (146, 18, 'Recording 1', '', 'https://www.youtube.com/live/5tFix2xjgTw?si=-2xOjQ2XgVxq3kLO', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (147, 18, 'Recording 2', '', 'https://www.youtube.com/live/vh3FL8oeESM?si=QeuhY8hTiySpZ5vW', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (148, 18, 'Recording 3', '', 'https://www.youtube.com/live/hBpSE9QCy5o?si=4fKxBv7KfnaUyS3i', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (149, 18, 'Recording 4', '', 'https://youtube.com/live/VfDra7-zG8o?feature=share', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (150, 18, 'Recording 5', '', 'https://youtube.com/live/YGS-thp7UN0?feature=share', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (151, 18, 'Recording 6', '', 'https://youtube.com/live/8o11Kp4FOOU?feature=share', NULL, 5, 1);
INSERT INTO `bundle_lessons` VALUES (152, 18, 'Recording 7', '', 'https://youtube.com/live/M9uGlcA5NAw?feature=share', NULL, 6, 1);
INSERT INTO `bundle_lessons` VALUES (153, 18, 'Recording 8', '', 'https://youtube.com/live/qSNI5eXqbJQ?feature=share', NULL, 7, 1);
INSERT INTO `bundle_lessons` VALUES (154, 18, 'Recording 9', '', 'https://www.youtube.com/live/2-NQ-dj9xnY?si=eu4C7BUHG8XaATth', NULL, 8, 1);
INSERT INTO `bundle_lessons` VALUES (169, 30, 'Recording 1', '', 'https://www.youtube.com/live/D_Co23AHymE?si=sksHniwWcK-ZgKwx', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (170, 30, 'Recording 2', '', 'https://www.youtube.com/live/ls6SoeD2a0Y?si=TwEynuOiX5BsYh93', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (171, 30, 'Recording 3', '', 'https://www.youtube.com/live/ivOQo7pLl0M?si=QrOGn65-HPDbKxRJ', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (172, 30, 'Recording 4', '', 'https://www.youtube.com/live/mq8refBmJAU?si=WdT37B7nXSXZcREY', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (173, 30, 'Recording 5', '', 'https://www.youtube.com/live/ISkDIsN-M6M?si=zbtJEJW3eUixEwPw', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (174, 30, 'Recording 6', '', 'https://www.youtube.com/live/d_1FXvVQGcE?si=0wtpTeW7ukJPTwhs', NULL, 5, 1);
INSERT INTO `bundle_lessons` VALUES (175, 30, 'Recording 7', '', 'https://youtube.com/live/iU37u-KJcYc?feature=share', NULL, 6, 1);
INSERT INTO `bundle_lessons` VALUES (176, 30, 'Recording 8', '', 'https://youtube.com/live/y9hPFAimrmc?feature=share', NULL, 7, 1);
INSERT INTO `bundle_lessons` VALUES (177, 30, 'Recording 9', '', 'https://youtube.com/live/tYyGaruy4nw?feature=share', NULL, 8, 1);
INSERT INTO `bundle_lessons` VALUES (178, 30, 'Recording 10', '', 'https://youtube.com/live/7E2WqkLnhUo?feature=share', NULL, 9, 1);
INSERT INTO `bundle_lessons` VALUES (179, 30, 'Recording 11', '', 'https://youtube.com/live/RMBrFdgrHV4?feature=share', NULL, 10, 1);
INSERT INTO `bundle_lessons` VALUES (180, 30, 'Recording 12', '', 'https://youtube.com/live/hdhExodxwUo?feature=share', NULL, 11, 1);
INSERT INTO `bundle_lessons` VALUES (181, 30, 'Recording 13', '', 'https://youtube.com/live/17S8QtpG_7I?feature=share', NULL, 12, 1);
INSERT INTO `bundle_lessons` VALUES (182, 30, 'Recording 14', '', 'https://youtube.com/live/A-2YaeAK9Ak?feature=share', NULL, 13, 1);
INSERT INTO `bundle_lessons` VALUES (183, 30, 'Recording 15', '', 'https://youtube.com/live/jUvsh3XHT18?feature=share', NULL, 14, 1);
INSERT INTO `bundle_lessons` VALUES (184, 29, 'Recording 1', '', 'https://www.youtube.com/live/iU37u-KJcYc?si=ux2JbYlP9YyVrK9P', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (185, 29, 'Recording 2', '', 'https://www.youtube.com/live/y9hPFAimrmc?si=zapb-rn76p11ldW-', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (186, 29, 'Recording 3', '', 'https://www.youtube.com/live/tYyGaruy4nw?si=9aljJ3pPKG1r7GsF', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (187, 29, 'Recording 4', '', 'https://www.youtube.com/live/7E2WqkLnhUo?si=5pw8VFjKwUvGCPxu', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (188, 29, 'Recording 5', '', 'https://www.youtube.com/live/RMBrFdgrHV4?si=x_aYtcczw3VY4_Bq', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (189, 31, 'Recording 1', '', 'https://www.youtube.com/live/Ys6dlfCf5OU?si=r9QYS58aTUS4hxGc', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (190, 31, 'Recording 2', '', 'https://www.youtube.com/live/1jjmTfE1RXc?si=2PeNYNwyFBDcFkOd', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (191, 31, 'Recording 3', '', 'https://www.youtube.com/live/MbHhPBsUkZk?si=zbobPw1nR3k6Qguv', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (192, 31, 'Recording 4', '', 'https://www.youtube.com/live/WWtNuwYP2_g?si=NS7XS6vbcK_MiEOf', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (193, 31, 'Recording 5', '', 'https://youtube.com/live/LsyivuQlTEI?feature=share', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (194, 31, 'Recording 6', '', 'https://youtube.com/live/LiD1vVQUvJ0?feature=share', NULL, 5, 1);
INSERT INTO `bundle_lessons` VALUES (195, 32, 'Recording 1', '', 'https://youtube.com/live/q7JUBYygt4I?feature=share', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (196, 32, 'Recording 2', '', 'https://www.youtube.com/live/Fl7Ufo17rXw?si=UXI5m5_mBdvwbojs', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (197, 32, 'Recording 3', '', 'https://www.youtube.com/live/4Gry39f7wyg?si=Hr7JeItSD_eULfxe', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (198, 32, 'Recording 4', '', 'https://youtube.com/live/hO3fMQNIoBE?feature=share', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (199, 32, 'Recording 5', '', 'https://youtube.com/live/X0diLilflIo?feature=share', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (200, 32, 'Recording 6', '', 'https://youtu.be/WfZTlAguBUk', NULL, 5, 1);
INSERT INTO `bundle_lessons` VALUES (201, 32, 'Recording 7', '', 'https://youtube.com/live/n5YYfuZHJSg?feature=share', NULL, 6, 1);
INSERT INTO `bundle_lessons` VALUES (202, 33, 'Recording 1', '', 'https://www.youtube.com/watch?v=Hy4jh6aR1Ns', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (203, 33, 'Recording 2', '', 'https://www.youtube.com/live/_V2PcyLqUfg?si=QAp17j9rdhc2R33n', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (204, 33, 'Recording 3', '', 'https://www.youtube.com/live/9BEEPxw7qXg?si=Y-dfZU3O19nKk0Nu', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (205, 33, 'Recording 4', '', 'https://www.youtube.com/live/-kR2BM2ltLU?si=lfd4fF7UxoLJUXFS', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (206, 33, 'Recording 5', '', 'https://youtube.com/live/rARy3jV_XCQ?feature=share', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (207, 24, 'Recording 1', '', 'https://www.youtube.com/live/5tFix2xjgTw?si=-2xOjQ2XgVxq3kLO', NULL, 0, 1);
INSERT INTO `bundle_lessons` VALUES (208, 24, 'Recording 2', '', 'https://www.youtube.com/live/vh3FL8oeESM?si=QeuhY8hTiySpZ5vW', NULL, 1, 1);
INSERT INTO `bundle_lessons` VALUES (209, 24, 'Recording 3', '', 'https://www.youtube.com/live/hBpSE9QCy5o?si=4fKxBv7KfnaUyS3i', NULL, 2, 1);
INSERT INTO `bundle_lessons` VALUES (210, 24, 'Recording 4', '', 'https://youtube.com/live/VfDra7-zG8o?feature=share', NULL, 3, 1);
INSERT INTO `bundle_lessons` VALUES (211, 24, 'Recording 5', '', 'https://youtube.com/live/YGS-thp7UN0?feature=share', NULL, 4, 1);
INSERT INTO `bundle_lessons` VALUES (212, 24, 'Recording 6', '', 'https://youtube.com/live/8o11Kp4FOOU?feature=share', NULL, 5, 1);
INSERT INTO `bundle_lessons` VALUES (213, 24, 'Recording 7', '', 'https://youtube.com/live/M9uGlcA5NAw?feature=share', NULL, 6, 1);
INSERT INTO `bundle_lessons` VALUES (214, 24, 'Recording 8', '', 'https://youtube.com/live/qSNI5eXqbJQ?feature=share', NULL, 7, 1);
INSERT INTO `bundle_lessons` VALUES (215, 24, 'Recording 9', '', 'https://www.youtube.com/live/2-NQ-dj9xnY?si=eu4C7BUHG8XaATth', NULL, 8, 1);

-- ----------------------------
-- Table structure for bundle_purchases
-- ----------------------------
DROP TABLE IF EXISTS `bundle_purchases`;
CREATE TABLE `bundle_purchases`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `bundle_id` int NOT NULL,
  `students_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `purchase_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'COMPLETED',
  `order_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `amount_paid` double NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_bundle_purchases_student`(`students_id` ASC) USING BTREE,
  INDEX `idx_bundle_purchases_bundle`(`bundle_id` ASC) USING BTREE,
  CONSTRAINT `fk_bundle_purchases_bundle` FOREIGN KEY (`bundle_id`) REFERENCES `recording_bundles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_bundle_purchases_student` FOREIGN KEY (`students_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of bundle_purchases
-- ----------------------------

-- ----------------------------
-- Table structure for bundle_recordings
-- ----------------------------
DROP TABLE IF EXISTS `bundle_recordings`;
CREATE TABLE `bundle_recordings`  (
  `bundle_id` int NOT NULL,
  `recording_id` int NOT NULL,
  PRIMARY KEY (`bundle_id`, `recording_id`) USING BTREE,
  INDEX `recording_id`(`recording_id` ASC) USING BTREE,
  CONSTRAINT `bundle_recordings_ibfk_1` FOREIGN KEY (`bundle_id`) REFERENCES `recording_bundles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `bundle_recordings_ibfk_2` FOREIGN KEY (`recording_id`) REFERENCES `recordings` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bundle_recordings
-- ----------------------------

-- ----------------------------
-- Table structure for class_schedule
-- ----------------------------
DROP TABLE IF EXISTS `class_schedule`;
CREATE TABLE `class_schedule`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_time` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `end_time` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `grade_id` int NOT NULL,
  `class_type_id` int NOT NULL,
  `zoom_link` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `days_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_class_schedule_grade1_idx`(`grade_id` ASC) USING BTREE,
  INDEX `fk_class_schedule_days1_idx`(`days_id` ASC) USING BTREE,
  INDEX `idx_grade_class_type`(`grade_id` ASC, `class_type_id` ASC) USING BTREE,
  INDEX `idx_class_type`(`class_type_id` ASC) USING BTREE,
  CONSTRAINT `fk_class_schedule_class_type` FOREIGN KEY (`class_type_id`) REFERENCES `class_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_class_schedule_days1` FOREIGN KEY (`days_id`) REFERENCES `days` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_class_schedule_grade1` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of class_schedule
-- ----------------------------
INSERT INTO `class_schedule` VALUES (19, '17:00', '19:00', 1, '2026-09-22 23:51:56', '2026-09-24 21:52:24', 32, 1, 'https://us06web.zoom.us/j/87804736911?pwd=buthnpajIYvXyklNY5bEOuHVcj9uMZ.1', '', 1);
INSERT INTO `class_schedule` VALUES (20, '16:00', '18:00', 1, '2026-09-22 23:52:51', '2026-10-06 06:52:17', 3, 1, 'https://us06web.zoom.us/j/87804736911?pwd=buthnpajIYvXyklNY5bEOuHVcj9uMZ.1', '', 7);
INSERT INTO `class_schedule` VALUES (21, '20:00', '22:30', 1, '2026-09-22 23:54:51', '2026-09-24 21:52:37', 31, 2, 'https://us06web.zoom.us/j/83787724296?pwd=gSLJRMxSK7kWD942VF2B68tiqHFf9O.1', '', 1);
INSERT INTO `class_schedule` VALUES (22, '20:00', '22:30', 1, '2026-09-22 23:55:49', '2026-10-06 14:34:02', 2, 1, 'https://us06web.zoom.us/j/81272639968?pwd=9hJon9brFUlzbXnbruTVvShpS5eMUd.1', '', 2);
INSERT INTO `class_schedule` VALUES (23, '20:00', '23:00', 1, '2026-09-24 20:44:19', '2026-09-24 20:44:19', 35, 2, 'https://us06web.zoom.us/j/87039539194?pwd=u1TvGjAKR8IGdLqc0amnxMVH0aMIWP.1', '', 6);

-- ----------------------------
-- Table structure for class_type
-- ----------------------------
DROP TABLE IF EXISTS `class_type`;
CREATE TABLE `class_type`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_active` tinyint NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_is_active`(`is_active` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of class_type
-- ----------------------------
INSERT INTO `class_type` VALUES (1, 'Theory', 'Theory classes only', 1, '2026-07-22 17:37:25', '2026-07-22 17:37:25');
INSERT INTO `class_type` VALUES (2, 'Revision', 'Revision classes only', 1, '2026-07-22 17:37:25', '2026-07-22 17:37:25');

-- ----------------------------
-- Table structure for days
-- ----------------------------
DROP TABLE IF EXISTS `days`;
CREATE TABLE `days`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of days
-- ----------------------------
INSERT INTO `days` VALUES (1, 'Monday');
INSERT INTO `days` VALUES (2, 'Tuesday');
INSERT INTO `days` VALUES (3, 'Wednesday');
INSERT INTO `days` VALUES (4, 'Thursday');
INSERT INTO `days` VALUES (5, 'Friday');
INSERT INTO `days` VALUES (6, 'Saturday');
INSERT INTO `days` VALUES (7, 'Sunday');

-- ----------------------------
-- Table structure for districts
-- ----------------------------
DROP TABLE IF EXISTS `districts`;
CREATE TABLE `districts`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of districts
-- ----------------------------
INSERT INTO `districts` VALUES ('D016', 'Ampara');
INSERT INTO `districts` VALUES ('D020', 'Anuradhapura');
INSERT INTO `districts` VALUES ('D022', 'Badulla');
INSERT INTO `districts` VALUES ('D015', 'Batticaloa');
INSERT INTO `districts` VALUES ('D001', 'Colombo');
INSERT INTO `districts` VALUES ('D007', 'Galle');
INSERT INTO `districts` VALUES ('D002', 'Gampaha');
INSERT INTO `districts` VALUES ('D009', 'Hambantota');
INSERT INTO `districts` VALUES ('D010', 'Jaffna');
INSERT INTO `districts` VALUES ('D003', 'Kalutara');
INSERT INTO `districts` VALUES ('D004', 'Kandy');
INSERT INTO `districts` VALUES ('D025', 'Kegalle');
INSERT INTO `districts` VALUES ('D011', 'Kilinochchi');
INSERT INTO `districts` VALUES ('D018', 'Kurunegala');
INSERT INTO `districts` VALUES ('D012', 'Mannar');
INSERT INTO `districts` VALUES ('D005', 'Matale');
INSERT INTO `districts` VALUES ('D008', 'Matara');
INSERT INTO `districts` VALUES ('D023', 'Monaragala');
INSERT INTO `districts` VALUES ('D013', 'Mullaitivu');
INSERT INTO `districts` VALUES ('D006', 'Nuwara Eliya');
INSERT INTO `districts` VALUES ('D021', 'Polonnaruwa');
INSERT INTO `districts` VALUES ('D019', 'Puttalam');
INSERT INTO `districts` VALUES ('D024', 'Ratnapura');
INSERT INTO `districts` VALUES ('D017', 'Trincomalee');
INSERT INTO `districts` VALUES ('D014', 'Vavuniya');

-- ----------------------------
-- Table structure for free_lessons
-- ----------------------------
DROP TABLE IF EXISTS `free_lessons`;
CREATE TABLE `free_lessons`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit_label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `youtube_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int NOT NULL,
  `is_active` tinyint NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_display_order`(`display_order` ASC) USING BTREE,
  INDEX `idx_is_active`(`is_active` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of free_lessons
-- ----------------------------

-- ----------------------------
-- Table structure for grade
-- ----------------------------
DROP TABLE IF EXISTS `grade`;
CREATE TABLE `grade`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fee` double NULL DEFAULT 0,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `ol_or_al_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE,
  INDEX `fk_grade_ol_or_al1_idx`(`ol_or_al_id` ASC) USING BTREE,
  CONSTRAINT `fk_grade_ol_or_al1` FOREIGN KEY (`ol_or_al_id`) REFERENCES `ol_or_al` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of grade
-- ----------------------------
INSERT INTO `grade` VALUES (1, '2027 Theory + Revision', 1200, 0, 1);
INSERT INTO `grade` VALUES (2, '2028 THEORY', 100, 1, 1);
INSERT INTO `grade` VALUES (3, 'GRADE 10', 1500, 1, 2);
INSERT INTO `grade` VALUES (31, '11 Paper', 0, 0, 2);
INSERT INTO `grade` VALUES (32, 'GRADE 11', 0, 1, 2);
INSERT INTO `grade` VALUES (33, '10 Paper', 0, 0, 2);
INSERT INTO `grade` VALUES (34, '2027 THEORY', 0, 1, 1);
INSERT INTO `grade` VALUES (35, 'Grade 11 | 2 Months Programme', 0, 0, 2);

-- ----------------------------
-- Table structure for grade_class_fee
-- ----------------------------
DROP TABLE IF EXISTS `grade_class_fee`;
CREATE TABLE `grade_class_fee`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `grade_id` int NOT NULL,
  `class_type_id` int NOT NULL,
  `monthly_fee` decimal(10, 2) NULL DEFAULT NULL,
  `registration_fee` decimal(10, 2) NULL DEFAULT NULL,
  `is_active` tinyint NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_grade_id`(`grade_id` ASC) USING BTREE,
  INDEX `idx_class_type_id`(`class_type_id` ASC) USING BTREE,
  INDEX `idx_grade_class_type`(`grade_id` ASC, `class_type_id` ASC) USING BTREE,
  CONSTRAINT `grade_class_fee_ibfk_1` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `grade_class_fee_ibfk_2` FOREIGN KEY (`class_type_id`) REFERENCES `class_type` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of grade_class_fee
-- ----------------------------
INSERT INTO `grade_class_fee` VALUES (13, 2, 1, 2500.00, 0.00, 1, '2026-09-22 23:47:36', '2026-09-25 00:37:29');
INSERT INTO `grade_class_fee` VALUES (15, 3, 1, 1200.00, 0.00, 1, '2026-09-24 21:40:49', '2026-10-04 05:20:27');
INSERT INTO `grade_class_fee` VALUES (17, 32, 1, 1000.00, 0.00, 1, '2026-09-24 21:56:37', '2026-09-24 21:56:37');
INSERT INTO `grade_class_fee` VALUES (23, 3, 2, 1000.00, 0.00, 1, '2026-10-11 09:27:11', '2026-10-11 09:27:11');
INSERT INTO `grade_class_fee` VALUES (24, 32, 2, 1000.00, 0.00, 1, '2026-10-11 09:28:23', '2026-10-11 09:28:36');

-- ----------------------------
-- Table structure for notes
-- ----------------------------
DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `grade_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_notes_grade1_idx`(`grade_id` ASC) USING BTREE,
  CONSTRAINT `fk_notes_grade1` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of notes
-- ----------------------------

-- ----------------------------
-- Table structure for offline_payment_submissions
-- ----------------------------
DROP TABLE IF EXISTS `offline_payment_submissions`;
CREATE TABLE `offline_payment_submissions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `monthly_fee_id` int NOT NULL,
  `payment_method` enum('BANK_TRANSFER','ATM_DEPOSIT','ATM_TRANSFER') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `amount_paid` decimal(10, 2) NOT NULL,
  `payment_date` date NOT NULL,
  `transaction_reference` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bank_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `r2_object_key` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `r2_file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `r2_file_size` bigint NULL DEFAULT NULL,
  `r2_content_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `submission_status` enum('PENDING_REVIEW','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'PENDING_REVIEW',
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `reviewed_by` int NULL DEFAULT NULL,
  `payment_transaction_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_fee_pending`(`monthly_fee_id` ASC, `submission_status` ASC) USING BTREE,
  INDEX `idx_student`(`student_id` ASC) USING BTREE,
  INDEX `idx_status`(`submission_status` ASC) USING BTREE,
  INDEX `idx_reviewed_by`(`reviewed_by` ASC) USING BTREE,
  INDEX `idx_submitted_at`(`submitted_at` ASC) USING BTREE,
  INDEX `idx_monthly_fee`(`monthly_fee_id` ASC) USING BTREE,
  INDEX `fk_offline_payment_transaction`(`payment_transaction_id` ASC) USING BTREE,
  CONSTRAINT `fk_offline_payment_monthly_fee` FOREIGN KEY (`monthly_fee_id`) REFERENCES `student_monthly_fees` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_offline_payment_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `fk_offline_payment_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_offline_payment_transaction` FOREIGN KEY (`payment_transaction_id`) REFERENCES `payment_transactions` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of offline_payment_submissions
-- ----------------------------

-- ----------------------------
-- Table structure for ol_or_al
-- ----------------------------
DROP TABLE IF EXISTS `ol_or_al`;
CREATE TABLE `ol_or_al`  (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ol_or_al
-- ----------------------------
INSERT INTO `ol_or_al` VALUES (1, 'A/L');
INSERT INTO `ol_or_al` VALUES (2, 'O/L');

-- ----------------------------
-- Table structure for ol_timetable
-- ----------------------------
DROP TABLE IF EXISTS `ol_timetable`;
CREATE TABLE `ol_timetable`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `grade` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `time` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `class_group` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `display_order` int NULL DEFAULT 0,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 494 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ol_timetable
-- ----------------------------
INSERT INTO `ol_timetable` VALUES (480, 'SESIRA - PILIYANDALA', '10', 'SESIRA - PILIYANDALA', 'Thursday 5.30PM - 7.30PM', 'Group 1', 0, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (481, 'SESIRA - PILIYANDALA', '10', 'SESIRA - PILIYANDALA', 'Friday 3.30PM - 5.30PM', 'Group 2', 1, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (482, 'SESIRA - PILIYANDALA', '11', 'SESIRA - PILIYANDALA', 'Thursday 3.30PM - 5.30PM', 'Group 1', 2, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (483, 'SESIRA - PILIYANDALA', '11', 'SESIRA - PILIYANDALA', 'Friday 5.30PM - 7.30PM', 'Group 2', 3, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (484, 'UNIVERSE - HOMAGAMA', '10', 'UNIVERSE - HOMAGAMA', 'Tuesday 5.00PM - 7.00PM', NULL, 4, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (485, 'UNIVERSE - HOMAGAMA', '11', 'UNIVERSE - HOMAGAMA', 'Tuesday 3.30PM - 5.30PM', NULL, 5, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (486, 'WINGS - MAHARAGAMA', '10', 'WINGS - MAHARAGAMA', 'Sunday 4.00PM - 6.00PM', NULL, 6, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (487, 'WINGS - MAHARAGAMA', '11', 'WINGS - MAHARAGAMA', 'Monday 5.00PM - 7.00PM', NULL, 7, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (488, 'ZIYONPEN - MAHARAGAMA', '10', 'ZIYONPEN - MAHARAGAMA', 'Wednesday 3.30PM - 5.30PM', 'Group 1', 8, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (489, 'ZIYONPEN - MAHARAGAMA', '10', 'ZIYONPEN - MAHARAGAMA', 'Saturday 8.00AM - 10.00AM', 'Group 2', 9, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (490, 'ZIYONPEN - MAHARAGAMA', '11', 'ZIYONPEN - MAHARAGAMA', 'Wednesday 5.30PM - 7.30PM', 'Group 1', 10, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (491, 'ZIYONPEN - MAHARAGAMA', '11', 'ZIYONPEN - MAHARAGAMA', 'Saturday 4.30PM - 6.30PM', 'Group 2', 11, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (492, 'ONLINE - ZOOM', '10', 'ONLINE - ZOOM', 'Sunday 4.00PM - 6.00PM', NULL, 12, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');
INSERT INTO `ol_timetable` VALUES (493, 'ONLINE - ZOOM', '11', 'ONLINE - ZOOM', 'Monday 5.00PM - 7.00PM', NULL, 13, 1, '2026-09-22 23:12:05', '2026-09-22 23:12:05');

-- ----------------------------
-- Table structure for payment_logs
-- ----------------------------
DROP TABLE IF EXISTS `payment_logs`;
CREATE TABLE `payment_logs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_id` int NOT NULL,
  `action` enum('payment_initiated','payment_completed','payment_failed','refund_issued') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `payment_id`(`payment_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of payment_logs
-- ----------------------------

-- ----------------------------
-- Table structure for payment_status
-- ----------------------------
DROP TABLE IF EXISTS `payment_status`;
CREATE TABLE `payment_status`  (
  `id` int NOT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `value`(`value` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of payment_status
-- ----------------------------
INSERT INTO `payment_status` VALUES (5, 'CANCELLED');
INSERT INTO `payment_status` VALUES (3, 'FAILED');
INSERT INTO `payment_status` VALUES (2, 'PAID');
INSERT INTO `payment_status` VALUES (1, 'PENDING');
INSERT INTO `payment_status` VALUES (6, 'PENDING_REVIEW');
INSERT INTO `payment_status` VALUES (4, 'REFUNDED');

-- ----------------------------
-- Table structure for payment_transactions
-- ----------------------------
DROP TABLE IF EXISTS `payment_transactions`;
CREATE TABLE `payment_transactions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `students_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `amount` double NULL DEFAULT NULL,
  `currency` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `transaction_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `verification_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  `verified_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `verification_date` timestamp NULL DEFAULT NULL,
  `verification_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_payment_transactions_students1_idx`(`students_id` ASC) USING BTREE,
  CONSTRAINT `fk_payment_transactions_students1` FOREIGN KEY (`students_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of payment_transactions
-- ----------------------------
INSERT INTO `payment_transactions` VALUES (18, '68658629', 1000, 'LKR', 'PayHere', 'FEE1791170651122', 'Monthly fee payment for 2026-10 (fallback completion)', '2026-10-05 03:28:35', '2026-10-05 03:28:35', 'completed', 'PAYHERE_RETURN_FALLBACK', '2026-10-05 03:28:35', 'Auto-verified by paymentReturn callback - Class fee payment (notify_url may have failed)');
INSERT INTO `payment_transactions` VALUES (20, '18857922', 1000, 'LKR', 'PayHere', 'FEE1791646532518', 'Monthly fee payment for 2026-10 (fallback completion)', '2026-10-10 16:00:33', '2026-10-10 16:00:33', 'completed', 'PAYHERE_RETURN_FALLBACK', '2026-10-10 16:00:33', 'Auto-verified by paymentReturn callback - Class fee payment (notify_url may have failed)');
INSERT INTO `payment_transactions` VALUES (21, '72295196', 1200, 'LKR', 'PayHere', 'FEE1791690877542', 'Monthly fee payment for 2026-10 (fallback completion)', '2026-10-11 04:32:35', '2026-10-11 04:32:35', 'completed', 'PAYHERE_RETURN_FALLBACK', '2026-10-11 04:32:35', 'Auto-verified by paymentReturn callback - Class fee payment (notify_url may have failed)');

-- ----------------------------
-- Table structure for portfolio_branch_images
-- ----------------------------
DROP TABLE IF EXISTS `portfolio_branch_images`;
CREATE TABLE `portfolio_branch_images`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_branch_name`(`branch_name` ASC) USING BTREE,
  INDEX `idx_branch_name`(`branch_name` ASC) USING BTREE,
  INDEX `idx_is_active`(`is_active` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of portfolio_branch_images
-- ----------------------------

-- ----------------------------
-- Table structure for portfolio_event_images
-- ----------------------------
DROP TABLE IF EXISTS `portfolio_event_images`;
CREATE TABLE `portfolio_event_images`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `display_order` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `event_id`(`event_id` ASC) USING BTREE,
  CONSTRAINT `portfolio_event_images_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `portfolio_events` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of portfolio_event_images
-- ----------------------------

-- ----------------------------
-- Table structure for portfolio_events
-- ----------------------------
DROP TABLE IF EXISTS `portfolio_events`;
CREATE TABLE `portfolio_events`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `date` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `time` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `full_description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `fee` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `display_order` int NULL DEFAULT 0,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of portfolio_events
-- ----------------------------
INSERT INTO `portfolio_events` VALUES (12, '🚨 2026 O/L ICT FINAL SEMINAR | පිළියන්දල ‼️', 'ඔබත් මෙවර සාමාන්‍ය පෙළ විභාගයට පෙනී සිටිනවාද?\n\nඑහෙනම් O/L ICT Syllabus එකම මුල ඉදලා මතක් කරගන්න ලැබෙන අවසන් අවස්ථාවට ඔයත් අනිවාර්යයෙන්ම සම්බන්ධ වෙන්න.\n\n📅 ඔක්තෝබර් 19 සදුදා\n⏰ පෙ.ව 8.00 - ප.ව 4.00 දක්වා\n📍 සැසිර - පිළියන්දල\n\n✅ එදිනට සම්පූර්ණ විෂය නිර්දේශයම ආවරණය වන පරිදි සැකසූ නිබන්ධනයක් ඔබට හිමි වේ.\n\n✅ සම්මන්ත්‍රණය සදහා ප්‍රවේශ පත්‍ර පිළියන්දල සැසිර ආයතනයේ කාර්‍යාලයෙන් හෝ 0761338551, 0722530352 අංක වලට WhatsApp හරහා Online ලබාගත හැක.\n\n⚠️ පහත Link එක හරහා සම්මන්ත්‍රණයේ WhatsApp Community එකට අනිවාර්යයෙන්ම Join වෙන්න.\nhttps://chat.whatsapp.com/CIcO4e2ODAU9vK0TFF2BE9\n\n☎️ විමසීම්:\n0761338551 , 0722530352', 'https://cdn.nextlvlict.com/events/11/110a37d5-c579-4b73-9d35-580a7e9158f8.jpg', '19th October 2026 (Monday)', NULL, 'Piliyandala', '', '1000', 0, 1, '2026-10-08 19:38:56', '2026-10-08 19:38:56');
INSERT INTO `portfolio_events` VALUES (13, '🚨 2026 O/L ICT FINAL SEMINAR | මහරගම‼️', 'ඔබත් මෙවර සාමාන්‍ය පෙළ විභාගයට පෙනී සිටිනවාද?\n\nඑහෙනම් O/L ICT Syllabus එකම මුල ඉදලා මතක් කරගන්න ලැබෙන අවසන් අවස්ථාවට ඔයත් අනිවාර්යයෙන්ම සම්බන්ධ වෙන්න.\n\n📅 ඔක්තෝබර් 23 සිකුරාදා\n⏰ පෙ.ව 8.00 - ප.ව 4.00 දක්වා\n📍 සියෝන්පෙන් - මහරගම\n\n✅ එදිනට සම්පූර්ණ විෂය නිර්දේශයම ආවරණය වන පරිදි සැකසූ නිබන්ධනයක් ඔබට හිමි වේ.\n\n✅ සම්මන්ත්‍රණය සදහා ප්‍රවේශ පත්‍ර මහරගම සියෝන්පෙන් ආයතනයේ කාර්‍යාලයෙන් හෝ 0761338551, 0722530352 අංක වලට WhatsApp හරහා Online ලබාගත හැක.\n\n⚠️ පහත Link එක හරහා සම්මන්ත්‍රණයේ WhatsApp Community එකට අනිවාර්යයෙන්ම Join වෙන්න.\nhttps://chat.whatsapp.com/GP7q5F0rMG0H5fM8wFOIsR\n\n☎️ විමසීම්:\n0761338551 , 0722530352', 'https://cdn.nextlvlict.com/events/13/fb037485-5b6d-415d-beb5-d961df775d85.jpg', '23rd October 2026 (Friday)', NULL, 'Maharagama', '', '1000', 1, 1, '2026-10-08 19:38:56', '2026-10-08 19:38:59');

-- ----------------------------
-- Table structure for portfolio_gallery_images
-- ----------------------------
DROP TABLE IF EXISTS `portfolio_gallery_images`;
CREATE TABLE `portfolio_gallery_images`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int NULL DEFAULT 0,
  `is_active` tinyint NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_display_order`(`display_order` ASC) USING BTREE,
  INDEX `idx_is_active`(`is_active` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of portfolio_gallery_images
-- ----------------------------
INSERT INTO `portfolio_gallery_images` VALUES (3, 'https://cdn.nextlvlict.com/gallery/fa378508-bd55-46fa-9d92-fc9ea416a668.jpg', 0, 1, '2026-08-27 07:44:03', '2026-08-27 07:44:03');
INSERT INTO `portfolio_gallery_images` VALUES (4, 'https://cdn.nextlvlict.com/gallery/c942c2c4-a52a-48cd-bed2-25237c6581d0.jpg', 0, 1, '2026-08-27 07:44:05', '2026-08-27 07:44:05');
INSERT INTO `portfolio_gallery_images` VALUES (6, 'https://cdn.nextlvlict.com/gallery/5da36952-a630-49dc-b2bb-4888132c33b0.jpg', 0, 1, '2026-08-27 07:44:10', '2026-08-27 07:44:10');
INSERT INTO `portfolio_gallery_images` VALUES (7, 'https://cdn.nextlvlict.com/gallery/cd083f4c-34f3-4a8b-b9dd-74e15055099a.jpg', 0, 1, '2026-08-27 07:44:12', '2026-08-27 07:44:12');
INSERT INTO `portfolio_gallery_images` VALUES (8, 'https://cdn.nextlvlict.com/gallery/d6fa6a69-9a47-4b37-882f-22e823997430.jpg', 0, 1, '2026-08-27 07:44:13', '2026-08-27 07:44:13');
INSERT INTO `portfolio_gallery_images` VALUES (15, 'https://cdn.nextlvlict.com/gallery/c9703799-f2ab-4212-9117-9a0df47b3e31.jpg', 1, 1, '2026-10-03 05:44:15', '2026-10-03 05:44:15');

-- ----------------------------
-- Table structure for portfolio_resources
-- ----------------------------
DROP TABLE IF EXISTS `portfolio_resources`;
CREATE TABLE `portfolio_resources`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `download_link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `display_order` int NULL DEFAULT 0,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of portfolio_resources
-- ----------------------------
INSERT INTO `portfolio_resources` VALUES (1, 'ICT O/L Past Papers', 'Collection of past examination papers with detailed answers and explanations.', 'fas fa-file-alt', '#', 1, 1, '2026-01-14 06:57:55', '2026-01-14 06:57:55');
INSERT INTO `portfolio_resources` VALUES (2, 'ICT A/L Study Notes', 'Comprehensive study materials covering all topics in the A/L ICT syllabus.', 'fas fa-book', '#', 2, 1, '2026-01-14 06:57:55', '2026-01-14 06:57:55');
INSERT INTO `portfolio_resources` VALUES (3, 'Programming Basics', 'Beginner-friendly guide to programming concepts with practical examples.', 'fas fa-code', '#', 3, 1, '2026-01-14 06:57:55', '2026-01-14 06:57:55');
INSERT INTO `portfolio_resources` VALUES (4, 'Database Cheat Sheet', 'Quick reference guide for SQL commands and database concepts.', 'fas fa-database', '#', 4, 1, '2026-01-14 06:57:55', '2026-01-14 06:57:55');

-- ----------------------------
-- Table structure for portfolio_testimonials
-- ----------------------------
DROP TABLE IF EXISTS `portfolio_testimonials`;
CREATE TABLE `portfolio_testimonials`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `role` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `display_order` int NULL DEFAULT 0,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 235 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of portfolio_testimonials
-- ----------------------------
INSERT INTO `portfolio_testimonials` VALUES (229, 'Sehan Dinusara', 'Royal College, Colombo 07 - Index No. 40127258', 'https://cdn.nextlvlict.com/testimonials/192/profile/b42e45ef-3146-401a-9898-4b71e2670412.jpg', 'මට O/L වලට A9ක් තියෙනවා. මම ICT පන්ති ආවේ කවිශ්න සර් ගාවට. කවිශ්න සර් ඇත්තටම කිව්වොත් හරියට Syllabus එක cover කරලා අමතර පන්ති දාලා ආයි ආයි පාඩම් cover කළා. ඊට අමතර වෙනම Paper class එකක් කළා. ඒ Papers සාකච්ඡ කළා. ඉතින් අපි වගේම ඕනම කෙනෙකුට ICT වලට A එකක් ගන්න ඕනෙ නම් කවිශ්න සර්ගේ පන්තිය Recommend කරන්න පුළුවන්.', 0, 1, '2026-10-02 16:54:21', '2026-10-02 16:54:21');
INSERT INTO `portfolio_testimonials` VALUES (230, 'Gihara De Silva', 'St. Pauls Girls School, Milagiriya - Index No. 40160130', 'https://placehold.co/70x70/00afa1/FFFFFF?text=GD', 'I\'ve always been a fairly confident student. But this class surely took my knowledge on ICT to the next level. I also have to mention how useful and well structured his paper class is before sitting for the O/L ICT paper. I didn\'t even need to go through any textbooks because I felt fully prepared. I was confident about getting an A pass for ICT. Thanks to Kavishna Sir. I\'m genuinely grateful for the support and guidance I received throughout this class. Such an influence guided me to select ICT for my A/Ls as well.', 1, 1, '2026-10-02 16:54:21', '2026-10-02 16:54:21');
INSERT INTO `portfolio_testimonials` VALUES (231, 'Senuli Dahamya', 'Anula Vidyalaya, Nugegoda - Index No. 42006750', 'https://placehold.co/70x70/3c6299/FFFFFF?text=SD', 'මට O/L වලට A9ක් තියෙනවා. ඇත්තටම ICT වලට නම් A එකක් තියෙන්නේ කවිශ්න සර් නිසාම තමයි. මම Class එකට එන්න කලින් සාමාන්‍යයෙන්  තිබ්බේ 60 ගණන් වගේ. කවිශ්න සර්ගේ class එකට අවාම තමයි ඇත්තටම ICT කියන Subject එක ගැන හරි Idea එකක් ආවේ. මට ඇත්තටම ගෙදර ගිහින් පාඩම් කරන්න ලොකුවට ඕනේ වුණේ නෑ, සර්ගේ Class එකේදී සර් උගන්නන විදියට ගොඩක් දේවල් එහෙම්ම මතක හිටිනවා. ඉතින් ලේසියෙන්ම මට ICT වලට A එකක් ගන්න පුළුවන් වුණා. ලොකු Stress එකක් නැතුව ICT වලට A එකක් ගන්න ඕනේ නම් කවිශ්න සර් ගාවට එන්නම ඕනේ.', 2, 1, '2026-10-02 16:54:21', '2026-10-02 16:54:21');
INSERT INTO `portfolio_testimonials` VALUES (232, 'Gagani Tharushika', 'Presbyterian Girls\' School, Dehiwala - Index No. 42330435', 'https://placehold.co/70x70/00afa1/FFFFFF?text=GT', 'The best ICT class I\'ve ever been to. Even though the subject felt confusing at first, when O/Ls came closer it became the subject I felt sure about...all because of Kavishna sir. His teaching felt real, comforting, and easy to follow. Truly my one and only recommendation for ICT.', 3, 1, '2026-10-02 16:54:21', '2026-10-02 16:54:21');
INSERT INTO `portfolio_testimonials` VALUES (233, 'Isitha Damnidu', 'D. S Senanayake College, Colombo 07 - Index No. 40108210', 'https://placehold.co/70x70/3c6299/FFFFFF?text=ID', 'ඇත්තටම කිව්වොත් මම වෙන ICT පන්තිවලට ගිහින් නෑ. 10 වසරෙදිම කෙළින්ම කවිශ්න සර්ගේ පන්තියටමයි ආවේ. ඉතින් මට O/L ICT වලට A එකක් ආවේ ඇත්තටම කවිහ්ස්න සර් නිසාමයි. කවිශ්න සර් ගැන කියනවනම් ගොඩක් හොද සර් කෙනෙක්, යාළුවෙක් වගේ ළගින් ඉදලා බය නැතුව ඕනේ දෙයක් අහල කතා කරලා ඉගෙන ගන්න පුළුවන්. ගොඩක් කැපවීමෙන් උගන්නන ගුරුවරයෙක්. ඉතින් අපෙන් පස්සේ එන නංගිලා මල්ලිලා ඕන කෙනෙක් බය නැතුව කවිශ්න සර්ගේ පන්තියට එන්න. කවිශ්න සර්ව මම බය නැතුව ඔයාලට Recommend කරනවා.', 4, 1, '2026-10-02 16:54:21', '2026-10-02 16:54:21');
INSERT INTO `portfolio_testimonials` VALUES (234, 'Dinil Damnidu', 'Ananda College, Colombo 10 - Index No. 42006808', 'https://placehold.co/70x70/00afa1/FFFFFF?text=DD', 'මට O/L වලට 9As තියනවා. මම ඇත්තටම කවිශ්න සර්ගේ පන්ති එන්න පටන් ගත්තේ 10 ශ්‍රේණිය අන්තිම වාරෙ ඉදලා. ඒ වෙනකොටත් මට ICT කියන විෂය එපා වෙලා තිබ්බේ. ඒත් කවිශ්න සර්ගේ ICT පන්තියට සහභාගී වුණාට පස්සේ මට ලේසියෙන්ම ICT ටික ගොඩ දාගන්න පුළුවන් වුණා. එතනින් එහාට මම හැම වරෙකම වගේ ICT වලට 75ට වැඩියෙන් ලකුණු ගත්තා. අන්තිමට මට O/L ICT වලටත් A එකක් ආවා, ඔයාලටත් ICT වලට ලේසියෙන්ම A එකක් ගන්න ඕනේ නම් කවිශ්න සර් ගාවට එන්න.', 5, 1, '2026-10-02 16:54:21', '2026-10-02 16:54:21');

-- ----------------------------
-- Table structure for provinces
-- ----------------------------
DROP TABLE IF EXISTS `provinces`;
CREATE TABLE `provinces`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of provinces
-- ----------------------------
INSERT INTO `provinces` VALUES (1, 'Northern');
INSERT INTO `provinces` VALUES (2, 'North Western');
INSERT INTO `provinces` VALUES (3, 'Western');
INSERT INTO `provinces` VALUES (4, 'North Central');
INSERT INTO `provinces` VALUES (5, 'Central');
INSERT INTO `provinces` VALUES (6, 'Sabaragamuwa');
INSERT INTO `provinces` VALUES (7, 'Eastern');
INSERT INTO `provinces` VALUES (8, 'Uva');
INSERT INTO `provinces` VALUES (9, 'Southern');

-- ----------------------------
-- Table structure for recording_bundles
-- ----------------------------
DROP TABLE IF EXISTS `recording_bundles`;
CREATE TABLE `recording_bundles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `price` double NULL DEFAULT 0,
  `access_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'PAID',
  `is_active` int NULL DEFAULT 1,
  `thumbnail_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `grade_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `grade_id`(`grade_id` ASC) USING BTREE,
  CONSTRAINT `recording_bundles_ibfk_1` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of recording_bundles
-- ----------------------------
INSERT INTO `recording_bundles` VALUES (10, 'Test', 'Test ', 50, 'PAID', 0, NULL, '2026-10-02 17:24:01', 1);
INSERT INTO `recording_bundles` VALUES (11, 'Programming (Flow Charts, Pseudo Codes, Pascal)', 'Grade 11 | Lesson 01', 2500, 'PAID', 1, NULL, '2026-10-05 05:02:37', 32);
INSERT INTO `recording_bundles` VALUES (12, 'System Development Life Cycle (SDLC)', 'Grade 11 | Lesson 02', 0, 'FREE', 1, NULL, '2026-10-05 05:07:46', 32);
INSERT INTO `recording_bundles` VALUES (13, 'test 01', '', 50, 'PAID', 0, NULL, '2026-10-05 05:12:25', 32);
INSERT INTO `recording_bundles` VALUES (14, 'Internet & E-mail', 'Grade 11 | Lesson 03', 1000, 'PAID', 1, NULL, '2026-10-05 05:54:15', 32);
INSERT INTO `recording_bundles` VALUES (15, 'Using of Multimedia', 'Grade 11 | Lesson 04', 0, 'FREE', 1, NULL, '2026-10-05 05:56:35', 32);
INSERT INTO `recording_bundles` VALUES (16, 'Web Designing Using Multimedia (HTML)', 'Grade 11 | Lesson 05', 1500, 'PAID', 1, NULL, '2026-10-05 06:01:12', 32);
INSERT INTO `recording_bundles` VALUES (17, 'Information & Communication Technology (ICT)', 'Grade 10 | Lesson 01', 0, 'FREE', 1, NULL, '2026-10-05 06:04:21', 3);
INSERT INTO `recording_bundles` VALUES (18, 'Introduction to Computer System', 'Grade 10 | Lesson 02', 0, 'FREE', 1, NULL, '2026-10-05 06:09:16', 3);
INSERT INTO `recording_bundles` VALUES (19, 'Data Representation Methods (Number Systems)', 'Grade 10 | Lesson 03', 1000, 'PAID', 1, NULL, '2026-10-05 06:14:19', 3);
INSERT INTO `recording_bundles` VALUES (20, 'Logic Gates With Boolean Functions', 'Grade 10 | Lesson 04', 1000, 'PAID', 1, NULL, '2026-10-05 06:17:14', 3);
INSERT INTO `recording_bundles` VALUES (21, 'Operating Systems (OS)', 'Grade 10 | Lesson 05', 1000, 'PAID', 1, NULL, '2026-10-05 06:19:00', 3);
INSERT INTO `recording_bundles` VALUES (22, 'Electronic Spreadsheets (Excel)', 'Grade 10 | Lesson 07', 1200, 'PAID', 1, NULL, '2026-10-05 06:21:31', 3);
INSERT INTO `recording_bundles` VALUES (23, 'Information & Communication Technology (ICT)', 'Grade 10 | Lesson 01', 0, 'FREE', 1, NULL, '2026-10-05 06:23:36', 32);
INSERT INTO `recording_bundles` VALUES (24, 'Introduction to Computer System', 'Grade 10 | Lesson 02', 0, 'FREE', 1, NULL, '2026-10-05 06:25:24', 32);
INSERT INTO `recording_bundles` VALUES (25, 'Data Representation Methods (Number Systems)', 'Grade 10 | Lesson 03', 1000, 'PAID', 1, NULL, '2026-10-05 06:27:55', 32);
INSERT INTO `recording_bundles` VALUES (26, 'Logic Gates With Boolean Functions', 'Grade 10 | Lesson 04', 1000, 'PAID', 1, NULL, '2026-10-05 06:29:06', 32);
INSERT INTO `recording_bundles` VALUES (27, 'Operating Systems (OS)', 'Grade 10 | Lesson 05', 1000, 'PAID', 1, NULL, '2026-10-05 06:34:07', 32);
INSERT INTO `recording_bundles` VALUES (28, 'Electronic Spreadsheets (Excel)', 'Grade 10 | Lesson 07', 1200, 'PAID', 1, NULL, '2026-10-05 06:35:49', 32);
INSERT INTO `recording_bundles` VALUES (29, 'Basic Concepts of ICT', 'Lesson 01', 2000, 'PAID', 1, NULL, '2026-10-05 06:52:12', 2);
INSERT INTO `recording_bundles` VALUES (30, 'Introduction to Computer System', 'Lesson 02', 3000, 'PAID', 1, NULL, '2026-10-05 06:55:28', 2);
INSERT INTO `recording_bundles` VALUES (31, 'RAM PAPER 01', '', 1000, 'PAID', 1, NULL, '2026-10-05 06:58:17', 31);
INSERT INTO `recording_bundles` VALUES (32, 'RAM PAPER 02', '', 1000, 'PAID', 1, NULL, '2026-10-05 07:01:35', 31);
INSERT INTO `recording_bundles` VALUES (33, 'RAM PAPER 03', '', 1000, 'PAID', 1, NULL, '2026-10-05 07:03:04', 31);

-- ----------------------------
-- Table structure for recording_request
-- ----------------------------
DROP TABLE IF EXISTS `recording_request`;
CREATE TABLE `recording_request`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `students_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `recordings_id` int NOT NULL,
  `recording_status_id` int NOT NULL,
  `request_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `unlocked_at` timestamp NULL DEFAULT NULL COMMENT 'Timestamp when the recording was unlocked/approved',
  `is_paid` tinyint(1) NULL DEFAULT 0 COMMENT 'Whether payment was made for this recording (1=paid, 0=not paid)',
  `expires_at` timestamp NULL DEFAULT NULL COMMENT 'Timestamp when the recording access expires (48 hours after unlock if not paid)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_recording_request_students_idx`(`students_id` ASC) USING BTREE,
  INDEX `fk_recording_request_recordings1_idx`(`recordings_id` ASC) USING BTREE,
  INDEX `fk_recording_request_recording_status1_idx`(`recording_status_id` ASC) USING BTREE,
  CONSTRAINT `fk_recording_request_recording_status1` FOREIGN KEY (`recording_status_id`) REFERENCES `recording_status` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_recording_request_recordings1` FOREIGN KEY (`recordings_id`) REFERENCES `recordings` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_recording_request_students` FOREIGN KEY (`students_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 126 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of recording_request
-- ----------------------------
INSERT INTO `recording_request` VALUES (9, '57298892', 49, 2, '2026-09-25 00:40:18', NULL, 0, NULL);
INSERT INTO `recording_request` VALUES (10, '63875948', 116, 2, '2026-09-25 00:48:27', NULL, 0, NULL);
INSERT INTO `recording_request` VALUES (11, '58795636', 48, 2, '2026-09-25 14:05:39', NULL, 0, NULL);
INSERT INTO `recording_request` VALUES (12, '58795636', 16, 2, '2026-09-26 22:38:44', NULL, 0, NULL);
INSERT INTO `recording_request` VALUES (13, '45577478', 116, 2, '2026-10-05 11:31:38', NULL, 0, NULL);
INSERT INTO `recording_request` VALUES (14, '22431509', 120, 2, '2026-10-05 12:20:40', NULL, 0, NULL);
INSERT INTO `recording_request` VALUES (15, '57298892', 121, 2, '2026-10-06 04:04:17', NULL, 0, NULL);
INSERT INTO `recording_request` VALUES (16, '60807645', 120, 2, '2026-10-06 04:25:03', NULL, 0, NULL);
INSERT INTO `recording_request` VALUES (17, '60807645', 96, 2, '2026-10-06 04:25:40', NULL, 0, NULL);
INSERT INTO `recording_request` VALUES (18, '90608402', 47, 2, '2026-10-06 05:02:13', NULL, 0, NULL);
INSERT INTO `recording_request` VALUES (19, '41621251', 120, 2, '2026-10-06 12:15:52', '2026-10-06 12:16:03', 0, '2026-10-08 12:16:03');
INSERT INTO `recording_request` VALUES (20, '45577478', 115, 2, '2026-10-06 14:56:02', '2026-10-06 14:56:31', 0, '2026-10-08 14:56:31');
INSERT INTO `recording_request` VALUES (21, '30137887', 96, 2, '2026-10-07 03:05:31', '2026-10-07 03:07:26', 0, '2026-10-09 03:07:26');
INSERT INTO `recording_request` VALUES (22, '30137887', 95, 2, '2026-10-07 03:07:10', '2026-10-07 03:07:28', 0, '2026-10-09 03:07:28');
INSERT INTO `recording_request` VALUES (23, '30137887', 94, 2, '2026-10-07 03:07:13', '2026-10-07 03:07:40', 0, '2026-10-09 03:07:40');
INSERT INTO `recording_request` VALUES (24, '88504947', 47, 2, '2026-10-07 03:07:43', '2026-10-07 09:51:51', 0, '2026-10-09 09:51:51');
INSERT INTO `recording_request` VALUES (25, '30137887', 120, 2, '2026-10-07 03:27:13', '2026-10-07 09:51:49', 0, '2026-10-09 09:51:49');
INSERT INTO `recording_request` VALUES (26, '90553605', 121, 2, '2026-10-07 14:48:18', '2026-10-08 19:52:18', 0, '2026-10-10 19:52:18');
INSERT INTO `recording_request` VALUES (27, '74928194', 48, 2, '2026-10-07 16:40:00', '2026-10-08 19:52:21', 0, '2026-10-10 19:52:21');
INSERT INTO `recording_request` VALUES (28, '28885770', 120, 2, '2026-10-07 16:47:19', '2026-10-08 19:52:25', 0, '2026-10-10 19:52:25');
INSERT INTO `recording_request` VALUES (29, '47294242', 121, 2, '2026-10-08 14:43:53', '2026-10-08 19:52:24', 0, '2026-10-10 19:52:24');
INSERT INTO `recording_request` VALUES (30, '45577478', 97, 2, '2026-10-10 03:09:54', '2026-10-11 08:40:05', 0, '2026-10-13 08:40:05');
INSERT INTO `recording_request` VALUES (31, '18857922', 48, 2, '2026-10-10 03:28:24', '2026-10-10 12:34:16', 0, '2026-10-12 12:34:16');
INSERT INTO `recording_request` VALUES (32, '35690293', 116, 2, '2026-10-10 08:53:59', '2026-10-11 08:40:05', 0, '2026-10-13 08:40:05');
INSERT INTO `recording_request` VALUES (33, '98624655', 121, 2, '2026-10-10 11:11:46', '2026-10-11 08:40:40', 0, '2026-10-13 08:40:40');
INSERT INTO `recording_request` VALUES (34, '18857922', 46, 2, '2026-10-10 14:19:06', '2026-10-10 16:04:26', 0, '2026-10-12 16:04:26');
INSERT INTO `recording_request` VALUES (35, '48626634', 79, 2, '2026-10-10 14:59:10', '2026-10-11 08:40:39', 0, '2026-10-13 08:40:39');
INSERT INTO `recording_request` VALUES (36, '26255598', 116, 2, '2026-10-10 15:42:12', '2026-10-11 08:40:07', 0, '2026-10-13 08:40:07');
INSERT INTO `recording_request` VALUES (37, '26255598', 115, 2, '2026-10-10 15:42:19', '2026-10-11 08:40:37', 0, '2026-10-13 08:40:37');
INSERT INTO `recording_request` VALUES (38, '26255598', 114, 2, '2026-10-10 15:42:20', '2026-10-11 08:40:08', 0, '2026-10-13 08:40:08');
INSERT INTO `recording_request` VALUES (39, '26255598', 113, 2, '2026-10-10 15:42:22', '2026-10-11 08:40:36', 0, '2026-10-13 08:40:36');
INSERT INTO `recording_request` VALUES (40, '26255598', 112, 2, '2026-10-10 15:42:25', '2026-10-11 08:40:09', 0, '2026-10-13 08:40:09');
INSERT INTO `recording_request` VALUES (41, '18857922', 47, 2, '2026-10-10 16:02:02', '2026-10-10 16:04:30', 0, '2026-10-12 16:04:30');
INSERT INTO `recording_request` VALUES (42, '18857922', 45, 2, '2026-10-10 17:40:14', '2026-10-11 08:40:34', 0, '2026-10-13 08:40:34');
INSERT INTO `recording_request` VALUES (43, '60807645', 93, 2, '2026-10-11 03:33:27', '2026-10-11 08:40:10', 0, '2026-10-13 08:40:10');
INSERT INTO `recording_request` VALUES (44, '99959461', 42, 2, '2026-10-11 04:03:37', '2026-10-11 08:40:33', 0, '2026-10-13 08:40:33');
INSERT INTO `recording_request` VALUES (45, '60807645', 94, 2, '2026-10-11 04:12:29', '2026-10-11 08:40:11', 0, '2026-10-13 08:40:11');
INSERT INTO `recording_request` VALUES (46, '60807645', 95, 2, '2026-10-11 04:12:32', '2026-10-11 08:40:13', 0, '2026-10-13 08:40:13');
INSERT INTO `recording_request` VALUES (47, '99959461', 32, 2, '2026-10-11 06:24:44', '2026-10-11 08:40:31', 0, '2026-10-13 08:40:31');
INSERT INTO `recording_request` VALUES (48, '63161430', 71, 2, '2026-10-11 09:53:15', '2026-10-12 15:32:08', 0, '2026-10-14 15:32:08');
INSERT INTO `recording_request` VALUES (49, '63161430', 70, 2, '2026-10-11 09:53:21', '2026-10-12 15:32:09', 0, '2026-10-14 15:32:09');
INSERT INTO `recording_request` VALUES (50, '63161430', 119, 2, '2026-10-11 09:53:39', '2026-10-12 15:32:11', 0, '2026-10-14 15:32:11');
INSERT INTO `recording_request` VALUES (51, '63161430', 79, 2, '2026-10-11 09:53:45', '2026-10-12 15:32:13', 0, '2026-10-14 15:32:13');
INSERT INTO `recording_request` VALUES (52, '63161430', 78, 2, '2026-10-11 09:53:47', '2026-10-12 15:32:14', 0, '2026-10-14 15:32:14');
INSERT INTO `recording_request` VALUES (53, '63161430', 77, 2, '2026-10-11 09:54:02', '2026-10-12 15:32:15', 0, '2026-10-14 15:32:15');
INSERT INTO `recording_request` VALUES (54, '36810197', 24, 2, '2026-10-11 11:08:28', '2026-10-12 15:32:17', 0, '2026-10-14 15:32:17');
INSERT INTO `recording_request` VALUES (55, '36810197', 16, 2, '2026-10-11 11:08:34', '2026-10-12 15:32:20', 0, '2026-10-14 15:32:20');
INSERT INTO `recording_request` VALUES (56, '36810197', 17, 2, '2026-10-11 11:08:36', '2026-10-12 15:32:22', 0, '2026-10-14 15:32:22');
INSERT INTO `recording_request` VALUES (57, '36810197', 18, 2, '2026-10-11 11:08:39', '2026-10-12 15:32:34', 0, '2026-10-14 15:32:34');
INSERT INTO `recording_request` VALUES (58, '36810197', 19, 2, '2026-10-11 11:08:42', '2026-10-12 15:32:35', 0, '2026-10-14 15:32:35');
INSERT INTO `recording_request` VALUES (59, '36810197', 20, 2, '2026-10-11 11:08:45', '2026-10-12 15:32:36', 0, '2026-10-14 15:32:36');
INSERT INTO `recording_request` VALUES (60, '36810197', 21, 2, '2026-10-11 11:08:48', '2026-10-12 15:32:38', 0, '2026-10-14 15:32:38');
INSERT INTO `recording_request` VALUES (61, '36810197', 22, 2, '2026-10-11 11:08:50', '2026-10-12 15:32:39', 0, '2026-10-14 15:32:39');
INSERT INTO `recording_request` VALUES (62, '36810197', 23, 2, '2026-10-11 11:08:52', '2026-10-12 15:32:43', 0, '2026-10-14 15:32:43');
INSERT INTO `recording_request` VALUES (63, '36810197', 25, 2, '2026-10-11 11:08:55', '2026-10-12 15:32:41', 0, '2026-10-14 15:32:41');
INSERT INTO `recording_request` VALUES (64, '36810197', 26, 2, '2026-10-11 11:08:57', '2026-10-12 15:32:42', 0, '2026-10-14 15:32:42');
INSERT INTO `recording_request` VALUES (65, '36810197', 27, 2, '2026-10-11 11:08:59', '2026-10-12 15:32:43', 0, '2026-10-14 15:32:43');
INSERT INTO `recording_request` VALUES (66, '36810197', 28, 2, '2026-10-11 11:09:01', '2026-10-12 15:32:45', 0, '2026-10-14 15:32:45');
INSERT INTO `recording_request` VALUES (67, '36810197', 29, 2, '2026-10-11 11:09:02', '2026-10-12 15:32:45', 0, '2026-10-14 15:32:45');
INSERT INTO `recording_request` VALUES (68, '36810197', 30, 2, '2026-10-11 11:09:04', '2026-10-12 15:32:46', 0, '2026-10-14 15:32:46');
INSERT INTO `recording_request` VALUES (69, '36810197', 31, 2, '2026-10-11 11:09:06', '2026-10-12 15:32:47', 0, '2026-10-14 15:32:47');
INSERT INTO `recording_request` VALUES (70, '36810197', 32, 2, '2026-10-11 11:09:07', '2026-10-12 15:32:48', 0, '2026-10-14 15:32:48');
INSERT INTO `recording_request` VALUES (71, '36810197', 33, 2, '2026-10-11 11:09:08', '2026-10-12 15:32:48', 0, '2026-10-14 15:32:48');
INSERT INTO `recording_request` VALUES (72, '36810197', 34, 2, '2026-10-11 11:09:13', '2026-10-12 15:32:49', 0, '2026-10-14 15:32:49');
INSERT INTO `recording_request` VALUES (73, '36810197', 37, 2, '2026-10-11 11:09:15', '2026-10-12 15:32:50', 0, '2026-10-14 15:32:50');
INSERT INTO `recording_request` VALUES (74, '36810197', 38, 2, '2026-10-11 11:09:17', '2026-10-12 15:32:51', 0, '2026-10-14 15:32:51');
INSERT INTO `recording_request` VALUES (75, '36810197', 39, 2, '2026-10-11 11:09:18', '2026-10-12 15:32:52', 0, '2026-10-14 15:32:52');
INSERT INTO `recording_request` VALUES (76, '36810197', 40, 2, '2026-10-11 11:09:20', '2026-10-12 15:32:53', 0, '2026-10-14 15:32:53');
INSERT INTO `recording_request` VALUES (77, '36810197', 41, 2, '2026-10-11 11:09:23', '2026-10-12 15:32:54', 0, '2026-10-14 15:32:54');
INSERT INTO `recording_request` VALUES (78, '36810197', 42, 2, '2026-10-11 11:09:24', '2026-10-12 15:32:54', 0, '2026-10-14 15:32:54');
INSERT INTO `recording_request` VALUES (79, '36810197', 43, 2, '2026-10-11 11:09:26', '2026-10-12 15:32:55', 0, '2026-10-14 15:32:55');
INSERT INTO `recording_request` VALUES (80, '36810197', 44, 2, '2026-10-11 11:09:28', '2026-10-12 15:32:56', 0, '2026-10-14 15:32:56');
INSERT INTO `recording_request` VALUES (81, '36810197', 45, 2, '2026-10-11 11:09:30', '2026-10-12 15:32:57', 0, '2026-10-14 15:32:57');
INSERT INTO `recording_request` VALUES (82, '36810197', 46, 2, '2026-10-11 11:09:31', '2026-10-12 15:32:58', 0, '2026-10-14 15:32:58');
INSERT INTO `recording_request` VALUES (83, '36810197', 47, 2, '2026-10-11 11:09:32', '2026-10-12 15:32:59', 0, '2026-10-14 15:32:59');
INSERT INTO `recording_request` VALUES (84, '36810197', 48, 2, '2026-10-11 11:09:36', '2026-10-12 15:33:00', 0, '2026-10-14 15:33:00');
INSERT INTO `recording_request` VALUES (85, '12209806', 16, 2, '2026-10-11 17:25:59', '2026-10-12 15:33:01', 0, '2026-10-14 15:33:01');
INSERT INTO `recording_request` VALUES (86, '12209806', 17, 2, '2026-10-11 18:22:35', '2026-10-12 15:33:04', 0, '2026-10-14 15:33:04');
INSERT INTO `recording_request` VALUES (87, '88307022', 121, 2, '2026-10-11 18:26:07', '2026-10-12 15:33:06', 0, '2026-10-14 15:33:06');
INSERT INTO `recording_request` VALUES (88, '47294242', 79, 2, '2026-10-12 01:26:23', '2026-10-12 15:33:11', 0, '2026-10-14 15:33:11');
INSERT INTO `recording_request` VALUES (89, '47294242', 78, 2, '2026-10-12 01:26:26', '2026-10-12 15:33:17', 0, '2026-10-14 15:33:17');
INSERT INTO `recording_request` VALUES (90, '47294242', 77, 2, '2026-10-12 01:26:33', '2026-10-12 15:33:17', 0, '2026-10-14 15:33:17');
INSERT INTO `recording_request` VALUES (91, '92386020', 16, 2, '2026-10-12 06:28:48', '2026-10-12 15:33:18', 0, '2026-10-14 15:33:18');
INSERT INTO `recording_request` VALUES (92, '23463945', 70, 2, '2026-10-12 07:39:44', '2026-10-12 15:33:19', 0, '2026-10-14 15:33:19');
INSERT INTO `recording_request` VALUES (93, '62442021', 47, 2, '2026-10-12 08:26:02', '2026-10-12 15:33:20', 0, '2026-10-14 15:33:20');
INSERT INTO `recording_request` VALUES (94, '62442021', 48, 2, '2026-10-12 08:26:16', '2026-10-12 15:33:22', 0, '2026-10-14 15:33:22');
INSERT INTO `recording_request` VALUES (95, '62442021', 46, 2, '2026-10-12 08:27:16', '2026-10-12 15:33:22', 0, '2026-10-14 15:33:22');
INSERT INTO `recording_request` VALUES (96, '76208909', 80, 2, '2026-10-12 15:31:09', '2026-10-12 15:33:23', 0, '2026-10-14 15:33:23');
INSERT INTO `recording_request` VALUES (97, '99018209', 48, 2, '2026-10-12 15:31:19', '2026-10-12 15:33:38', 0, '2026-10-14 15:33:38');
INSERT INTO `recording_request` VALUES (98, '76208909', 81, 2, '2026-10-12 15:33:53', '2026-10-13 04:39:54', 0, '2026-10-15 04:39:54');
INSERT INTO `recording_request` VALUES (99, '92386020', 17, 2, '2026-10-12 15:34:47', '2026-10-13 04:39:55', 0, '2026-10-15 04:39:55');
INSERT INTO `recording_request` VALUES (100, '92386020', 18, 2, '2026-10-12 15:34:51', '2026-10-13 04:39:56', 0, '2026-10-15 04:39:56');
INSERT INTO `recording_request` VALUES (101, '92386020', 19, 2, '2026-10-12 15:34:53', '2026-10-13 04:39:56', 0, '2026-10-15 04:39:56');
INSERT INTO `recording_request` VALUES (102, '92386020', 20, 2, '2026-10-12 15:34:56', '2026-10-13 04:39:52', 0, '2026-10-15 04:39:52');
INSERT INTO `recording_request` VALUES (103, '92386020', 21, 2, '2026-10-12 15:34:58', '2026-10-13 04:39:51', 0, '2026-10-15 04:39:51');
INSERT INTO `recording_request` VALUES (104, '92386020', 22, 2, '2026-10-12 15:35:00', '2026-10-13 04:39:51', 0, '2026-10-15 04:39:51');
INSERT INTO `recording_request` VALUES (105, '92386020', 23, 2, '2026-10-12 15:35:03', '2026-10-13 04:39:49', 0, '2026-10-15 04:39:49');
INSERT INTO `recording_request` VALUES (106, '92386020', 24, 2, '2026-10-12 15:35:05', '2026-10-13 04:39:48', 0, '2026-10-15 04:39:48');
INSERT INTO `recording_request` VALUES (107, '92386020', 25, 2, '2026-10-12 15:35:07', '2026-10-13 04:39:48', 0, '2026-10-15 04:39:48');
INSERT INTO `recording_request` VALUES (108, '92386020', 26, 2, '2026-10-12 15:35:09', '2026-10-13 04:39:47', 0, '2026-10-15 04:39:47');
INSERT INTO `recording_request` VALUES (109, '92386020', 27, 2, '2026-10-12 15:35:12', '2026-10-13 04:39:46', 0, '2026-10-15 04:39:46');
INSERT INTO `recording_request` VALUES (110, '90608402', 31, 2, '2026-10-12 15:37:26', '2026-10-13 04:39:44', 0, '2026-10-15 04:39:44');
INSERT INTO `recording_request` VALUES (111, '90608402', 32, 2, '2026-10-12 15:37:35', '2026-10-13 04:39:44', 0, '2026-10-15 04:39:44');
INSERT INTO `recording_request` VALUES (112, '90608402', 33, 2, '2026-10-12 15:37:38', '2026-10-13 04:39:43', 0, '2026-10-15 04:39:43');
INSERT INTO `recording_request` VALUES (113, '90608402', 34, 2, '2026-10-12 15:37:42', '2026-10-13 04:39:42', 0, '2026-10-15 04:39:42');
INSERT INTO `recording_request` VALUES (114, '90608402', 37, 2, '2026-10-12 15:37:48', '2026-10-13 04:39:41', 0, '2026-10-15 04:39:41');
INSERT INTO `recording_request` VALUES (115, '54404418', 96, 2, '2026-10-12 15:40:06', '2026-10-13 04:39:40', 0, '2026-10-15 04:39:40');
INSERT INTO `recording_request` VALUES (116, '36271485', 80, 2, '2026-10-12 16:07:01', '2026-10-13 04:39:39', 0, '2026-10-15 04:39:39');
INSERT INTO `recording_request` VALUES (117, '63288413', 41, 2, '2026-10-12 17:07:02', '2026-10-13 04:39:38', 0, '2026-10-15 04:39:38');
INSERT INTO `recording_request` VALUES (118, '63288413', 42, 2, '2026-10-12 17:07:19', '2026-10-13 04:39:37', 0, '2026-10-15 04:39:37');
INSERT INTO `recording_request` VALUES (119, '63288413', 43, 2, '2026-10-12 17:07:24', '2026-10-13 04:39:36', 0, '2026-10-15 04:39:36');
INSERT INTO `recording_request` VALUES (120, '63288413', 40, 2, '2026-10-12 17:07:46', '2026-10-13 04:39:35', 0, '2026-10-15 04:39:35');
INSERT INTO `recording_request` VALUES (121, '99959461', 46, 2, '2026-10-12 17:17:46', '2026-10-13 04:39:34', 0, '2026-10-15 04:39:34');
INSERT INTO `recording_request` VALUES (122, '99959461', 47, 2, '2026-10-12 17:17:52', '2026-10-13 04:39:33', 0, '2026-10-15 04:39:33');
INSERT INTO `recording_request` VALUES (123, '99959461', 48, 2, '2026-10-12 17:17:54', '2026-10-13 04:39:32', 0, '2026-10-15 04:39:32');
INSERT INTO `recording_request` VALUES (124, '63161430', 64, 2, '2026-10-13 06:59:56', '2026-10-13 10:56:32', 0, '2026-10-15 10:56:32');
INSERT INTO `recording_request` VALUES (125, '63161430', 68, 2, '2026-10-13 07:03:18', '2026-10-13 10:56:45', 0, '2026-10-15 10:56:45');

-- ----------------------------
-- Table structure for recording_status
-- ----------------------------
DROP TABLE IF EXISTS `recording_status`;
CREATE TABLE `recording_status`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of recording_status
-- ----------------------------
INSERT INTO `recording_status` VALUES (1, 'Pending');
INSERT INTO `recording_status` VALUES (2, 'Approved');
INSERT INTO `recording_status` VALUES (3, 'Rejected');

-- ----------------------------
-- Table structure for recordings
-- ----------------------------
DROP TABLE IF EXISTS `recordings`;
CREATE TABLE `recordings`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `youtube_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `thumbnail_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `grade_id` int NOT NULL,
  `access_type` enum('FREE','PAID') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'PAID',
  `price` double NULL DEFAULT 0 COMMENT 'Price for paid class recordings (0.00 for free recordings)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_recordings_grade1_idx`(`grade_id` ASC) USING BTREE,
  INDEX `idx_recordings_access_type`(`access_type` ASC) USING BTREE,
  INDEX `idx_thumbnail_url`(`thumbnail_url` ASC) USING BTREE,
  CONSTRAINT `fk_recordings_grade1` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 125 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of recordings
-- ----------------------------
INSERT INTO `recordings` VALUES (15, 'Test', 'Test', 'https://youtu.be/wdGniHmtIZk?si=EdxhlNiLumqo9v0C', NULL, 0, '2026-09-18 22:32:55', 1, 'PAID', 0);
INSERT INTO `recordings` VALUES (16, 'JANUARY 2026 | GRADE 11 | L01-PART 1 ', '', 'https://www.youtube.com/live/Rp5LyMgvRP0?si=IuJOpGxvPTP07qLu', NULL, 1, '2026-09-24 22:10:43', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (17, 'JANUARY 2026 | GRADE 11 | L01-PART 2', '', 'https://www.youtube.com/live/GTvmgKFTpjI?si=saLfqzH-3gS1LxqT', NULL, 1, '2026-09-24 22:12:57', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (18, 'JANUARY 2026 | GRADE 11 | L01-PART 3', '', 'https://www.youtube.com/live/Jvzw_FQFivM?si=g87yvMSJ1r_aeeRE', NULL, 1, '2026-09-24 22:13:35', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (19, 'JANUARY 2026 | GRADE 11 | L01-PART 4', '', 'https://www.youtube.com/live/alaHKn26T58?si=V-dOr2hdMJrdJDp9', NULL, 1, '2026-09-24 22:14:21', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (20, 'FEBRUARY 2026 | GRADE 11 | L01-PART 5', '', 'https://www.youtube.com/live/L8LlAHL1AqA?si=eD9De9cbMQGijnEh', NULL, 1, '2026-09-24 22:15:07', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (21, 'FEBRUARY 2026 | GRADE 11 | L01-PART 6', '', 'https://www.youtube.com/live/3IeM3CR45VE?si=UOzE6LrwlhxmqtWc', NULL, 1, '2026-09-24 22:16:17', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (22, 'FEBRUARY 2026 | GRADE 11 | L01-PART 7', '', 'https://www.youtube.com/live/zZ3Lmy21Vmg?si=L3VoJreY9Tfy-7pt', NULL, 1, '2026-09-24 22:16:44', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (23, 'MARCH 2026 | GRADE 11 | L01-PART 8', '', 'https://youtube.com/live/qRbs6mDBVR0?feature=share', NULL, 1, '2026-09-24 22:17:20', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (24, 'MARCH 2026 | GRADE 11 | L01-PART 9', '', 'https://youtube.com/live/QRfTJptPnPo?feature=share', NULL, 1, '2026-09-24 22:18:00', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (25, 'MARCH 2026 | GRADE 11 | L01-PART 10', '', 'https://youtube.com/live/hmLY9UV5HEw?feature=share', NULL, 1, '2026-09-24 22:18:21', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (26, 'MARCH 2026 | GRADE 11 | L01-PART 11', '', 'https://youtube.com/live/qFIBhBeFwLE?feature=share', NULL, 1, '2026-09-24 22:18:48', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (27, 'APRIL 2026 | GRADE 11 | L01-PART 12', '', 'https://youtube.com/live/zq4FB3vnWZo?feature=share', NULL, 1, '2026-09-24 22:19:21', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (28, 'APRIL 2026 | GRADE 11 | L01-PART 13', '', 'https://youtube.com/live/JLOl5ccW9wg?feature=share', NULL, 1, '2026-09-24 22:19:44', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (29, 'APRIL 2026 | GRADE 11 | L01-PART 14', '', 'https://youtube.com/live/wm6-5QF0l4M?feature=share', NULL, 1, '2026-09-24 22:21:00', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (30, 'MAY 2026 | GRADE 11 | L02-FULL', '', 'https://youtube.com/live/xq2rELSBQSU?feature=share', NULL, 1, '2026-09-24 22:21:37', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (31, 'MAY 2026 | GRADE 11 | L03-PART 1', '', 'https://youtube.com/live/H9B8rrPQrQU?feature=share', NULL, 1, '2026-09-24 22:22:10', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (32, 'MAY 2026 | GRADE 11 | L03-PART 2', '', 'https://youtube.com/live/F9s6ycNeVXg?feature=share', NULL, 1, '2026-09-24 22:22:44', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (33, 'JUNE 2026 | GRADE 11 | L03-PART 3', '', 'https://youtu.be/KHOR5QXPly0?si=pr9IsHl5dIbsLUoH', NULL, 1, '2026-09-24 22:26:25', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (34, 'JUNE 2026 | GRADE 11 | L03-PART 4', '', 'https://youtube.com/live/HSmF67BrShs?feature=share', NULL, 1, '2026-09-24 22:26:54', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (35, 'JULY 2026 | GRADE 11 | 1ST WEEK', '', 'https://youtube.com/live/sKGMoPmdDsE?feature=share ', NULL, 0, '2026-09-24 22:32:09', 32, 'PAID', 0);
INSERT INTO `recordings` VALUES (36, 'JULY 2026 | GRADE 11 | 2ND WEEK', '', 'https://www.youtube.com/live/2AfFWlWTYZ4?si=ID3iNlWvxjbBu5AS', NULL, 0, '2026-09-24 23:14:10', 32, 'PAID', 0);
INSERT INTO `recordings` VALUES (37, 'JUNE 2026 | GRADE 11 | L03-PART 5', '', 'https://youtube.com/live/sKGMoPmdDsE?feature=share ', NULL, 1, '2026-09-24 23:16:33', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (38, 'JULY 2026 | GRADE 11 | L05-PART 1', '', 'https://www.youtube.com/live/2AfFWlWTYZ4?si=S7D2mLDLLGLwXp3u', NULL, 1, '2026-09-24 23:17:34', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (39, 'JULY 2026 | GRADE 11 | L05-PART 2', '', 'https://www.youtube.com/live/h-61lZR6z94?si=wIVE_kCHdZHFyNlX', NULL, 1, '2026-09-24 23:18:03', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (40, 'JULY 2026 | GRADE 11 | L05-PART 3', '', 'https://www.youtube.com/live/0MHoE_kyMz4?si=IbRLtFgsnkWRksFB', NULL, 1, '2026-09-24 23:18:29', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (41, 'JULY 2026 | GRADE 11 | L05-PART 4', '', 'https://www.youtube.com/live/a9EOyEathuI?si=AgJj0eixwh4QC4OW', NULL, 1, '2026-09-24 23:19:06', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (42, 'AUGUST 2026 | GRADE 11 | L05-PART 5', '', 'https://www.youtube.com/live/V660dAtBcwM?si=mWnTP48nPgV-gVib', NULL, 1, '2026-09-24 23:19:53', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (43, 'AUGUST 2026 | GRADE 11 | L05-PART 6', '', 'https://www.youtube.com/live/spiFI71zKqE?si=m1PLXoKivTagf6Of', NULL, 1, '2026-09-24 23:20:25', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (44, 'AUGUST 2026 | GRADE 11 | L05-PART 7', '', 'https://www.youtube.com/live/NVMA3P7r9HM?si=fsncGALLMJzVUBxO', NULL, 1, '2026-09-24 23:20:59', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (45, 'AUGUST 2026 | GRADE 11 | L05-PART 8', '', 'https://www.youtube.com/live/VobA9EVJ5us?si=QaWbmjUsgv7UFB6C', NULL, 1, '2026-09-24 23:21:24', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (46, 'SEPTEMBER 2026 | GRADE 11 | L04-PART 1', '', 'https://youtube.com/live/FRZEY-4UyTs?feature=share', NULL, 1, '2026-09-24 23:22:49', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (47, 'SEPTEMBER 2026 | GRADE 11 | L04-PART 2', '', 'https://youtube.com/live/9pQxYh29LaM?feature=share', NULL, 1, '2026-09-24 23:23:17', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (48, 'SEPTEMBER 2026 | GRADE 11 | L04-PART 3', '', 'https://youtube.com/live/OrjrIZZr6h4?feature=share', NULL, 1, '2026-09-24 23:24:03', 32, 'PAID', 200);
INSERT INTO `recordings` VALUES (49, 'JANUARY 2026 | GRADE 10 | L01-PART 1', '', 'https://www.youtube.com/live/WV_h3J06D_s?si=55JZV8qlWFzcXCik', NULL, 1, '2026-09-24 23:40:07', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (50, 'JANUARY 2026 | GRADE 10 | L01-PART 2', '', 'https://www.youtube.com/live/HRQLXk6-v68?si=4awKyLB0bx92Q1YT', NULL, 1, '2026-09-24 23:40:39', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (51, 'JANUARY 2026 | GRADE 10 | L01-PART 3', '', 'https://www.youtube.com/live/CzEHpE44k84?si=290Ro82naHvSI-NI', NULL, 1, '2026-09-24 23:40:58', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (52, 'FEBRUARY 2026 | GRADE 10 | L02-PART 1', '', 'https://www.youtube.com/live/5tFix2xjgTw?si=-2xOjQ2XgVxq3kLO', NULL, 1, '2026-09-24 23:41:45', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (53, 'FEBRUARY 2026 | GRADE 10 | L02-PART 2', '', 'https://www.youtube.com/live/vh3FL8oeESM?si=QeuhY8hTiySpZ5vW', NULL, 1, '2026-09-24 23:42:04', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (54, 'FEBRUARY 2026 | GRADE 10 | L02-PART 3', '', 'https://www.youtube.com/live/hBpSE9QCy5o?si=4fKxBv7KfnaUyS3i', NULL, 1, '2026-09-24 23:42:25', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (55, 'MARCH 2026 | GRADE 10 | L02-PART 4', '', 'https://youtube.com/live/VfDra7-zG8o?feature=share', NULL, 1, '2026-09-24 23:42:50', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (56, 'MARCH 2026 | GRADE 10 | L02-PART 5', '', 'https://youtube.com/live/YGS-thp7UN0?feature=share', NULL, 1, '2026-09-24 23:43:31', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (57, 'MARCH 2026 | GRADE 10 | L02-PART 6', '', 'https://youtube.com/live/8o11Kp4FOOU?feature=share', NULL, 1, '2026-09-24 23:43:57', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (58, 'MARCH 2026 | GRADE 10 | L02-PART 7', '', 'https://youtube.com/live/M9uGlcA5NAw?feature=share', NULL, 1, '2026-09-24 23:44:41', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (59, 'APRIL 2026 | GRADE 10 | L02-PART 8', '', 'https://youtube.com/live/qSNI5eXqbJQ?feature=share', NULL, 1, '2026-09-24 23:45:35', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (60, 'APRIL 2026 | GRADE 10 | L02-PART 9', '', 'https://www.youtube.com/live/2-NQ-dj9xnY?si=eu4C7BUHG8XaATth', NULL, 1, '2026-09-24 23:45:55', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (61, 'APRIL 2026 | GRADE 10 | L03-PART 1', '', 'https://www.youtube.com/live/5heslKxZXw0?si=O7ehQb8-vFhsVXK-', NULL, 1, '2026-09-24 23:46:30', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (62, 'MAY 2026 | GRADE 10 | L03-PART 2', '', 'https://youtube.com/live/_ZfiTH4Sm_I?feature=share', NULL, 1, '2026-09-24 23:47:13', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (63, 'MAY 2026 | GRADE 10 | L03-PART 3', '', 'https://youtube.com/live/rF7kdegDP_s?feature=share', NULL, 1, '2026-09-24 23:47:35', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (64, 'MAY 2026 | GRADE 10 | L03-PART 4', '', 'https://www.youtube.com/live/KkTwe8fKvnc?si=Q7N2luD36UNIK0dr', NULL, 1, '2026-09-24 23:48:03', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (65, 'MAY 2026 | GRADE 10 | L03-PART 5', '', 'https://youtube.com/live/c11cTVY6sMY?feature=share', NULL, 1, '2026-09-24 23:48:45', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (66, 'JUNE 2026 | GRADE 10 | L04-PART 1', '', 'https://www.youtube.com/live/KN2DLpAoPtg?si=Is9VcajL0F9ZBg9s', NULL, 1, '2026-09-24 23:49:55', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (67, 'JUNE 2026 | GRADE 10 | L04-PART 2', '', 'https://www.youtube.com/live/_RQAXm1jPcM?si=GYHwwJeziI832WYl', NULL, 1, '2026-09-24 23:50:27', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (68, 'JUNE 2026 | GRADE 10 | L04-PART 3', '', 'https://youtube.com/live/eLbPSFiVtrs?feature=share', NULL, 1, '2026-09-24 23:50:48', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (69, 'JUNE 2026 | GRADE 10 | L04-PART 4', '', 'https://youtube.com/live/Y5tlP158EDY?feature=share', NULL, 1, '2026-09-24 23:51:17', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (70, 'JUNE 2026 | GRADE 10 | L07-PART 1', '', 'https://www.youtube.com/live/AAuU27vgjq4?si=uv6HyDEgLezQ3RJu', NULL, 1, '2026-09-24 23:51:51', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (71, 'JULY 2026 | GRADE 10 | L07-PART 2', '', 'https://www.youtube.com/live/U6pYLHzMfRE?si=Abf3vzdcczt8U_-C', NULL, 1, '2026-09-24 23:52:18', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (72, 'JULY 2026 | GRADE 10 | L07-PART 3', '', 'https://www.youtube.com/live/C3bcCmifgog?si=6ubYWV6ddWAWQkp7', NULL, 1, '2026-09-24 23:52:42', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (73, 'JULY 2026 | GRADE 10 | L07-PART 4', '', 'https://www.youtube.com/live/fh74K1z0BbA?si=cIT7JPlMVYZ-6-gD', NULL, 1, '2026-09-24 23:54:14', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (74, 'AUGUST 2026 | GRADE 10 | L07-PART 5', '', 'https://www.youtube.com/live/Ve6UGflz7Sw?si=heW1L_yQHFV_5pKI', NULL, 1, '2026-09-24 23:54:34', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (75, 'AUGUST 2026 | GRADE 10 | L07-PART 6', '', 'https://www.youtube.com/live/yHudZwjBg44?si=5kWzDxq3uHRgu5yQ', NULL, 1, '2026-09-24 23:55:45', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (76, 'AUGUST 2026 | GRADE 10 | L07-PART 7', '', 'https://youtube.com/live/98_QmaHR1gw?feature=share', NULL, 1, '2026-09-24 23:56:02', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (77, 'SEPTEMBER 2026 | GRADE 10 | L05-PART 1', '', 'https://youtube.com/live/7HiBMyEGDPE?feature=share', NULL, 1, '2026-09-24 23:57:32', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (78, 'SEPTEMBER 2026 | GRADE 10 | L05-PART 2', '', 'https://youtube.com/live/VqWRClaio3U?feature=share', NULL, 1, '2026-09-24 23:58:06', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (79, 'SEPTEMBER 2026 | GRADE 10 | L05-PART 3', '', 'https://youtube.com/live/JqedLecnwvg?feature=share', NULL, 1, '2026-09-24 23:58:37', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (80, 'MAY 2026 | GRADE 11 PAPER | RAM 01-PART 1', '', 'https://www.youtube.com/live/Ys6dlfCf5OU?si=r9QYS58aTUS4hxGc', NULL, 1, '2026-09-25 00:00:33', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (81, 'MAY 2026 | GRADE 11 PAPER | RAM 01-PART 2', '', 'https://www.youtube.com/live/1jjmTfE1RXc?si=2PeNYNwyFBDcFkOd', NULL, 1, '2026-09-25 00:00:57', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (82, 'MAY 2026 | GRADE 11 PAPER | RAM 01-PART 3', '', 'https://www.youtube.com/live/MbHhPBsUkZk?si=zbobPw1nR3k6Qguv', NULL, 1, '2026-09-25 00:01:16', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (83, 'MAY 2026 | GRADE 11 PAPER | RAM 01-PART 4', '', 'https://www.youtube.com/live/WWtNuwYP2_g?si=NS7XS6vbcK_MiEOf', NULL, 1, '2026-09-25 00:01:41', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (84, 'JUNE 2026 | GRADE 11 PAPER | RAM 01-PART 5', '', 'https://youtube.com/live/LsyivuQlTEI?feature=share', NULL, 1, '2026-09-25 00:02:09', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (85, 'JUNE 2026 | GRADE 11 PAPER | RAM 01-PART 6', '', 'https://youtube.com/live/LiD1vVQUvJ0?feature=share', NULL, 1, '2026-09-25 00:02:26', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (86, 'JUNE 2026 | GRADE 11 PAPER | RAM 02-PART 1', '', 'https://youtube.com/live/q7JUBYygt4I?feature=share', NULL, 1, '2026-09-25 00:02:45', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (87, 'JULY 2026 | GRADE 11 PAPER | RAM 02-PART 2', '', 'https://www.youtube.com/live/Fl7Ufo17rXw?si=UXI5m5_mBdvwbojs', NULL, 1, '2026-09-25 00:03:13', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (88, 'JULY 2026 | GRADE 11 PAPER | RAM 02-PART 3', '', 'https://www.youtube.com/live/4Gry39f7wyg?si=Hr7JeItSD_eULfxe', NULL, 1, '2026-09-25 00:05:12', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (89, 'JULY 2026 | GRADE 11 PAPER | RAM 02-PART 4', '', 'https://youtube.com/live/hO3fMQNIoBE?feature=share', NULL, 1, '2026-09-25 00:05:41', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (90, 'AUGUST 2026 | GRADE 11 PAPER | RAM 02-PART 5', '', 'https://youtube.com/live/X0diLilflIo?feature=share ', NULL, 1, '2026-09-25 00:06:57', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (91, 'AUGUST 2026 | GRADE 11 PAPER | RAM 02-PART 6', '', 'https://youtu.be/WfZTlAguBUk', NULL, 1, '2026-09-25 00:07:46', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (92, 'AUGUST 2026 | GRADE 11 PAPER | RAM 02-PART 7', '', 'https://youtube.com/live/n5YYfuZHJSg?feature=share', NULL, 1, '2026-09-25 00:08:09', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (93, 'AUGUST 2026 | GRADE 11 PAPER | RAM 03-PART 1', '', 'https://www.youtube.com/watch?v=Hy4jh6aR1Ns', NULL, 1, '2026-09-25 00:08:45', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (94, 'SEPTEMBER 2026 | GRADE 11 PAPER | RAM 03-PART 2', '', 'https://www.youtube.com/live/_V2PcyLqUfg?si=QAp17j9rdhc2R33n', NULL, 1, '2026-09-25 00:09:16', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (95, 'SEPTEMBER 2026 | GRADE 11 PAPER | RAM 03-PART 3', '', 'https://www.youtube.com/live/9BEEPxw7qXg?si=Y-dfZU3O19nKk0Nu', NULL, 1, '2026-09-25 00:09:54', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (96, 'SEPTEMBER 2026 | GRADE 11 PAPER | RAM 03-PART 4', '', 'https://www.youtube.com/live/-kR2BM2ltLU?si=lfd4fF7UxoLJUXFS', NULL, 1, '2026-09-25 00:10:36', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (97, 'A/L ICT LESSON 01 | PART 01', '', 'https://www.youtube.com/live/iU37u-KJcYc?si=ux2JbYlP9YyVrK9P', NULL, 1, '2026-09-25 00:13:06', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (98, 'A/L ICT LESSON 01 | PART 02', '', 'https://www.youtube.com/live/y9hPFAimrmc?si=zapb-rn76p11ldW-', NULL, 1, '2026-09-25 00:14:02', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (99, 'A/L ICT LESSON 01 | PART 03', '', 'https://www.youtube.com/live/tYyGaruy4nw?si=9aljJ3pPKG1r7GsF', NULL, 1, '2026-09-25 00:14:29', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (100, 'A/L ICT LESSON 01 | PART 04', '', 'https://www.youtube.com/live/7E2WqkLnhUo?si=5pw8VFjKwUvGCPxu', NULL, 1, '2026-09-25 00:14:47', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (101, 'A/L ICT LESSON 01 | PART 05', '', 'https://www.youtube.com/live/RMBrFdgrHV4?si=x_aYtcczw3VY4_Bq', NULL, 1, '2026-09-25 00:15:06', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (102, 'A/L ICT LESSON 02 | PART 01', '', 'https://www.youtube.com/live/D_Co23AHymE?si=sksHniwWcK-ZgKwx', NULL, 1, '2026-09-25 00:18:09', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (103, 'A/L ICT LESSON 02 | PART 02', '', 'https://www.youtube.com/live/ls6SoeD2a0Y?si=TwEynuOiX5BsYh93', NULL, 1, '2026-09-25 00:18:36', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (104, 'A/L ICT LESSON 02 | PART 03', '', 'https://www.youtube.com/live/ivOQo7pLl0M?si=QrOGn65-HPDbKxRJ', NULL, 1, '2026-09-25 00:18:57', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (105, 'A/L ICT LESSON 02 | PART 04', '', 'https://www.youtube.com/live/mq8refBmJAU?si=WdT37B7nXSXZcREY', NULL, 1, '2026-09-25 00:19:13', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (106, 'A/L ICT LESSON 02 | PART 05', '', 'https://www.youtube.com/live/ISkDIsN-M6M?si=zbtJEJW3eUixEwPw', NULL, 1, '2026-09-25 00:19:31', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (107, 'A/L ICT LESSON 02 | PART 06', '', 'https://www.youtube.com/live/d_1FXvVQGcE?si=0wtpTeW7ukJPTwhs', NULL, 1, '2026-09-25 00:19:47', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (108, 'A/L ICT LESSON 02 | PART 07', '', 'https://youtube.com/live/iU37u-KJcYc?feature=share', NULL, 1, '2026-09-25 00:21:40', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (109, 'A/L ICT LESSON 02 | PART 08', '', 'https://youtube.com/live/y9hPFAimrmc?feature=share', NULL, 1, '2026-09-25 00:22:02', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (110, 'A/L ICT LESSON 02 | PART 09', '', 'https://youtube.com/live/tYyGaruy4nw?feature=share', NULL, 1, '2026-09-25 00:22:42', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (111, 'A/L ICT LESSON 02 | PART 10', '', 'https://youtube.com/live/7E2WqkLnhUo?feature=share', NULL, 1, '2026-09-25 00:23:23', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (112, 'A/L ICT LESSON 02 | PART 11', '', 'https://youtube.com/live/RMBrFdgrHV4?feature=share', NULL, 1, '2026-09-25 00:23:49', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (113, 'A/L ICT LESSON 02 | PART 12', '', 'https://youtube.com/live/hdhExodxwUo?feature=share', NULL, 1, '2026-09-25 00:24:23', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (114, 'A/L ICT LESSON 02 | PART 13', '', 'https://youtube.com/live/17S8QtpG_7I?feature=share', NULL, 1, '2026-09-25 00:24:43', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (115, 'A/L ICT LESSON 02 | PART 14', '', 'https://youtube.com/live/A-2YaeAK9Ak?feature=share', NULL, 1, '2026-09-25 00:25:05', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (116, 'A/L ICT LESSON 02 | PART 15', '', 'https://youtube.com/live/jUvsh3XHT18?feature=share', NULL, 1, '2026-09-25 00:25:48', 2, 'PAID', 300);
INSERT INTO `recordings` VALUES (117, 'Test', 'Test', 'https://www.youtube.com/live/VgzUnCePABI', NULL, 0, '2026-10-02 16:48:11', 1, 'PAID', 50);
INSERT INTO `recordings` VALUES (118, 'Test', 'Test', 'https://www.youtube.com/live/VgzUnCePABI', NULL, 0, '2026-10-02 18:08:09', 2, 'FREE', 0);
INSERT INTO `recordings` VALUES (119, 'SEPTEMBER 2026 | GRADE 10 | L05-PART 4', '', 'https://youtube.com/live/-rG3o75VT_E?feature=share', NULL, 1, '2026-10-04 04:45:13', 3, 'PAID', 200);
INSERT INTO `recordings` VALUES (120, 'SEPTEMBER 2026 | GRADE 11 PAPER | RAM 03-PART 5', '', 'https://youtube.com/live/rARy3jV_XCQ?feature=share', NULL, 1, '2026-10-04 04:48:16', 32, 'FREE', 0);
INSERT INTO `recordings` VALUES (121, 'OCTOBER 2026 | GRADE 10 | L09-PART 1', '', 'https://youtube.com/live/BvhIYSv1Kl0?feature=share', NULL, 1, '2026-10-05 04:45:33', 3, 'FREE', 0);
INSERT INTO `recordings` VALUES (122, 'A/L ICT LESSON 04 | PART 01', '', 'https://www.youtube.com/live/6cafISbQ6XQ?si=b5ftGkWuWdSMEpyi', NULL, 1, '2026-10-06 16:29:52', 2, 'FREE', 0);
INSERT INTO `recordings` VALUES (123, 'OCTOBER 2026 | GRADE 10 | L09-PART 2', '', 'https://youtube.com/live/tWMikU9xwns?feature=share', NULL, 1, '2026-10-12 14:34:08', 3, 'FREE', 0);
INSERT INTO `recordings` VALUES (124, 'SEPTEMBER 2026 | GRADE 11 PAPER | RAM 04-PART 2', '', 'https://www.youtube.com/live/i9RzNgbwF_k?si=SWJzSsyLqGXZZUt7', NULL, 1, '2026-10-12 14:50:23', 32, 'FREE', 0);

-- ----------------------------
-- Table structure for status
-- ----------------------------
DROP TABLE IF EXISTS `status`;
CREATE TABLE `status`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of status
-- ----------------------------
INSERT INTO `status` VALUES (1, 'Active');
INSERT INTO `status` VALUES (2, 'Inactive');

-- ----------------------------
-- Table structure for student_class
-- ----------------------------
DROP TABLE IF EXISTS `student_class`;
CREATE TABLE `student_class`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `grade_id` int NOT NULL,
  `class_type_id` int NOT NULL,
  `is_active` tinyint NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_student_id`(`student_id` ASC) USING BTREE,
  INDEX `idx_grade_id`(`grade_id` ASC) USING BTREE,
  INDEX `idx_class_type_id`(`class_type_id` ASC) USING BTREE,
  CONSTRAINT `fk_student_class_class_type` FOREIGN KEY (`class_type_id`) REFERENCES `class_type` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_student_class_grade` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_student_class_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 248 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of student_class
-- ----------------------------
INSERT INTO `student_class` VALUES (10, '76903255', 1, 1, 1, '2026-07-23 04:50:58');
INSERT INTO `student_class` VALUES (11, '76903255', 1, 2, 1, '2026-07-23 04:50:58');
INSERT INTO `student_class` VALUES (12, '15208224', 1, 1, 1, '2026-07-23 22:30:50');
INSERT INTO `student_class` VALUES (13, '87481209', 2, 1, 1, '2026-08-21 00:59:54');
INSERT INTO `student_class` VALUES (14, '87481209', 2, 2, 1, '2026-08-21 00:59:54');
INSERT INTO `student_class` VALUES (15, '63875948', 2, 1, 1, '2026-09-21 13:23:04');
INSERT INTO `student_class` VALUES (16, '63875948', 2, 2, 1, '2026-09-21 13:23:04');
INSERT INTO `student_class` VALUES (17, '57298892', 3, 1, 1, '2026-09-22 06:26:04');
INSERT INTO `student_class` VALUES (18, '57298892', 3, 2, 1, '2026-09-22 06:26:04');
INSERT INTO `student_class` VALUES (19, '45577478', 2, 1, 1, '2026-09-23 00:08:01');
INSERT INTO `student_class` VALUES (20, '94291476', 1, 1, 1, '2026-09-23 00:19:56');
INSERT INTO `student_class` VALUES (21, '94291476', 1, 2, 1, '2026-09-23 00:19:56');
INSERT INTO `student_class` VALUES (22, '59018528', 1, 1, 1, '2026-09-23 00:20:39');
INSERT INTO `student_class` VALUES (23, '59018528', 1, 2, 1, '2026-09-23 00:20:39');
INSERT INTO `student_class` VALUES (24, '17836214', 1, 1, 1, '2026-09-23 00:20:50');
INSERT INTO `student_class` VALUES (25, '17836214', 1, 2, 1, '2026-09-23 00:20:50');
INSERT INTO `student_class` VALUES (26, '55391371', 1, 1, 1, '2026-09-23 00:21:18');
INSERT INTO `student_class` VALUES (27, '72400548', 1, 1, 1, '2026-09-23 00:21:34');
INSERT INTO `student_class` VALUES (28, '72400548', 1, 2, 1, '2026-09-23 00:21:34');
INSERT INTO `student_class` VALUES (29, '17396147', 1, 1, 1, '2026-09-23 00:21:35');
INSERT INTO `student_class` VALUES (30, '17396147', 1, 2, 1, '2026-09-23 00:21:35');
INSERT INTO `student_class` VALUES (31, '40074015', 34, 1, 1, '2026-09-23 00:24:58');
INSERT INTO `student_class` VALUES (32, '40074015', 34, 2, 1, '2026-09-23 00:24:58');
INSERT INTO `student_class` VALUES (33, '89201900', 34, 1, 1, '2026-09-23 11:18:05');
INSERT INTO `student_class` VALUES (34, '89201900', 34, 2, 1, '2026-09-23 11:18:05');
INSERT INTO `student_class` VALUES (35, '54994107', 1, 1, 1, '2026-09-24 02:04:14');
INSERT INTO `student_class` VALUES (36, '54994107', 1, 2, 1, '2026-09-24 02:04:14');
INSERT INTO `student_class` VALUES (37, '15809397', 1, 1, 1, '2026-09-24 02:04:22');
INSERT INTO `student_class` VALUES (38, '15809397', 1, 2, 1, '2026-09-24 02:04:22');
INSERT INTO `student_class` VALUES (39, '77322976', 1, 1, 1, '2026-09-24 02:04:28');
INSERT INTO `student_class` VALUES (40, '77322976', 1, 2, 1, '2026-09-24 02:04:28');
INSERT INTO `student_class` VALUES (41, '72823764', 1, 1, 1, '2026-09-24 02:04:35');
INSERT INTO `student_class` VALUES (42, '72823764', 1, 2, 1, '2026-09-24 02:04:35');
INSERT INTO `student_class` VALUES (43, '75349150', 1, 1, 1, '2026-09-24 02:04:54');
INSERT INTO `student_class` VALUES (44, '75349150', 1, 2, 1, '2026-09-24 02:04:54');
INSERT INTO `student_class` VALUES (45, '85709585', 1, 1, 1, '2026-09-24 02:07:21');
INSERT INTO `student_class` VALUES (46, '85709585', 1, 2, 1, '2026-09-24 02:07:21');
INSERT INTO `student_class` VALUES (47, '84803838', 1, 1, 1, '2026-09-24 02:08:04');
INSERT INTO `student_class` VALUES (48, '84803838', 1, 2, 1, '2026-09-24 02:08:04');
INSERT INTO `student_class` VALUES (49, '88916271', 34, 1, 1, '2026-09-24 02:08:16');
INSERT INTO `student_class` VALUES (50, '88916271', 34, 2, 1, '2026-09-24 02:08:16');
INSERT INTO `student_class` VALUES (51, '22519093', 34, 1, 1, '2026-09-24 02:08:29');
INSERT INTO `student_class` VALUES (52, '22519093', 34, 2, 1, '2026-09-24 02:08:29');
INSERT INTO `student_class` VALUES (53, '48981677', 34, 1, 1, '2026-09-24 02:09:49');
INSERT INTO `student_class` VALUES (54, '48981677', 34, 2, 1, '2026-09-24 02:09:49');
INSERT INTO `student_class` VALUES (55, '21643286', 1, 1, 1, '2026-09-24 02:10:55');
INSERT INTO `student_class` VALUES (56, '21643286', 1, 2, 1, '2026-09-24 02:10:55');
INSERT INTO `student_class` VALUES (57, '58219985', 34, 1, 1, '2026-09-24 02:13:57');
INSERT INTO `student_class` VALUES (58, '58219985', 34, 2, 1, '2026-09-24 02:13:57');
INSERT INTO `student_class` VALUES (59, '58795636', 32, 1, 1, '2026-09-25 14:03:09');
INSERT INTO `student_class` VALUES (60, '58795636', 32, 2, 1, '2026-09-25 14:03:09');
INSERT INTO `student_class` VALUES (61, '81222911', 35, 2, 1, '2026-09-25 23:21:05');
INSERT INTO `student_class` VALUES (62, '45512699', 3, 1, 1, '2026-10-04 05:26:50');
INSERT INTO `student_class` VALUES (63, '73809117', 35, 1, 1, '2026-10-04 05:49:53');
INSERT INTO `student_class` VALUES (64, '73809117', 35, 2, 1, '2026-10-04 05:49:53');
INSERT INTO `student_class` VALUES (65, '96847431', 31, 1, 1, '2026-10-04 05:50:17');
INSERT INTO `student_class` VALUES (66, '96847431', 31, 2, 1, '2026-10-04 05:50:17');
INSERT INTO `student_class` VALUES (67, '62057834', 3, 1, 1, '2026-10-04 06:02:44');
INSERT INTO `student_class` VALUES (68, '40638177', 32, 1, 1, '2026-10-04 06:07:27');
INSERT INTO `student_class` VALUES (69, '40638177', 32, 2, 1, '2026-10-04 06:07:27');
INSERT INTO `student_class` VALUES (70, '88174360', 2, 1, 1, '2026-10-04 06:09:57');
INSERT INTO `student_class` VALUES (71, '19022737', 32, 1, 1, '2026-10-04 06:11:50');
INSERT INTO `student_class` VALUES (72, '19022737', 32, 2, 1, '2026-10-04 06:11:50');
INSERT INTO `student_class` VALUES (73, '73108289', 3, 1, 1, '2026-10-04 06:11:57');
INSERT INTO `student_class` VALUES (74, '59494997', 3, 1, 1, '2026-10-04 06:12:04');
INSERT INTO `student_class` VALUES (75, '59494997', 3, 2, 1, '2026-10-04 06:12:04');
INSERT INTO `student_class` VALUES (76, '47937205', 32, 1, 1, '2026-10-04 06:12:23');
INSERT INTO `student_class` VALUES (77, '47937205', 32, 2, 1, '2026-10-04 06:12:23');
INSERT INTO `student_class` VALUES (78, '64989358', 3, 1, 1, '2026-10-04 06:15:31');
INSERT INTO `student_class` VALUES (79, '64989358', 3, 2, 1, '2026-10-04 06:15:31');
INSERT INTO `student_class` VALUES (80, '64176698', 32, 1, 1, '2026-10-04 06:20:10');
INSERT INTO `student_class` VALUES (81, '64176698', 32, 2, 1, '2026-10-04 06:20:10');
INSERT INTO `student_class` VALUES (82, '29954866', 3, 1, 1, '2026-10-04 06:21:26');
INSERT INTO `student_class` VALUES (83, '65531710', 3, 1, 1, '2026-10-04 06:22:06');
INSERT INTO `student_class` VALUES (84, '34954445', 32, 1, 1, '2026-10-04 06:23:17');
INSERT INTO `student_class` VALUES (85, '34954445', 32, 2, 1, '2026-10-04 06:23:17');
INSERT INTO `student_class` VALUES (86, '32416225', 3, 1, 1, '2026-10-04 06:24:36');
INSERT INTO `student_class` VALUES (87, '25888160', 2, 1, 1, '2026-10-04 06:26:10');
INSERT INTO `student_class` VALUES (88, '56808678', 35, 1, 1, '2026-10-04 06:27:44');
INSERT INTO `student_class` VALUES (89, '56808678', 35, 2, 1, '2026-10-04 06:27:44');
INSERT INTO `student_class` VALUES (90, '65804211', 2, 1, 1, '2026-10-04 06:30:39');
INSERT INTO `student_class` VALUES (91, '67449663', 3, 1, 1, '2026-10-04 06:35:14');
INSERT INTO `student_class` VALUES (92, '67449663', 3, 2, 1, '2026-10-04 06:35:14');
INSERT INTO `student_class` VALUES (93, '86804353', 32, 1, 1, '2026-10-04 06:36:47');
INSERT INTO `student_class` VALUES (94, '86804353', 32, 2, 1, '2026-10-04 06:36:47');
INSERT INTO `student_class` VALUES (95, '96413579', 3, 1, 1, '2026-10-04 06:38:07');
INSERT INTO `student_class` VALUES (96, '51675638', 2, 1, 1, '2026-10-04 06:41:46');
INSERT INTO `student_class` VALUES (97, '86825575', 35, 1, 1, '2026-10-04 06:42:12');
INSERT INTO `student_class` VALUES (98, '86825575', 35, 2, 1, '2026-10-04 06:42:12');
INSERT INTO `student_class` VALUES (99, '60246189', 32, 1, 1, '2026-10-04 06:52:00');
INSERT INTO `student_class` VALUES (100, '60246189', 32, 2, 1, '2026-10-04 06:52:00');
INSERT INTO `student_class` VALUES (101, '69988958', 3, 1, 1, '2026-10-04 06:54:25');
INSERT INTO `student_class` VALUES (102, '69988958', 3, 2, 1, '2026-10-04 06:54:25');
INSERT INTO `student_class` VALUES (103, '31075988', 32, 1, 1, '2026-10-04 06:54:31');
INSERT INTO `student_class` VALUES (104, '31075988', 32, 2, 1, '2026-10-04 06:54:31');
INSERT INTO `student_class` VALUES (105, '26546881', 3, 1, 1, '2026-10-04 06:58:22');
INSERT INTO `student_class` VALUES (106, '71840137', 3, 1, 1, '2026-10-04 06:59:19');
INSERT INTO `student_class` VALUES (107, '91203277', 2, 1, 1, '2026-10-04 07:00:26');
INSERT INTO `student_class` VALUES (108, '29150939', 32, 1, 1, '2026-10-04 07:04:47');
INSERT INTO `student_class` VALUES (109, '29150939', 32, 2, 1, '2026-10-04 07:04:47');
INSERT INTO `student_class` VALUES (110, '51352066', 32, 1, 1, '2026-10-04 07:23:48');
INSERT INTO `student_class` VALUES (111, '56352174', 3, 1, 1, '2026-10-04 07:28:17');
INSERT INTO `student_class` VALUES (112, '26714369', 32, 1, 1, '2026-10-04 07:40:56');
INSERT INTO `student_class` VALUES (113, '26714369', 32, 2, 1, '2026-10-04 07:40:56');
INSERT INTO `student_class` VALUES (114, '90006089', 32, 1, 1, '2026-10-04 07:44:19');
INSERT INTO `student_class` VALUES (115, '90006089', 32, 2, 1, '2026-10-04 07:44:19');
INSERT INTO `student_class` VALUES (116, '98884075', 32, 1, 1, '2026-10-04 07:51:17');
INSERT INTO `student_class` VALUES (117, '98884075', 32, 2, 1, '2026-10-04 07:51:17');
INSERT INTO `student_class` VALUES (118, '50574760', 2, 1, 1, '2026-10-04 07:59:35');
INSERT INTO `student_class` VALUES (119, '50574760', 2, 2, 1, '2026-10-04 07:59:35');
INSERT INTO `student_class` VALUES (120, '70804653', 32, 1, 1, '2026-10-04 08:11:07');
INSERT INTO `student_class` VALUES (121, '70804653', 32, 2, 1, '2026-10-04 08:11:07');
INSERT INTO `student_class` VALUES (122, '47294242', 3, 1, 1, '2026-10-04 08:11:29');
INSERT INTO `student_class` VALUES (123, '47294242', 3, 2, 1, '2026-10-04 08:11:29');
INSERT INTO `student_class` VALUES (124, '91564138', 3, 1, 1, '2026-10-04 08:27:59');
INSERT INTO `student_class` VALUES (125, '88119671', 3, 1, 1, '2026-10-04 08:28:31');
INSERT INTO `student_class` VALUES (126, '72295196', 3, 1, 1, '2026-10-04 08:37:23');
INSERT INTO `student_class` VALUES (127, '72295196', 3, 2, 1, '2026-10-04 08:37:23');
INSERT INTO `student_class` VALUES (128, '90608402', 32, 1, 1, '2026-10-04 08:55:20');
INSERT INTO `student_class` VALUES (129, '90608402', 32, 2, 1, '2026-10-04 08:55:20');
INSERT INTO `student_class` VALUES (130, '65598554', 32, 1, 1, '2026-10-04 09:05:55');
INSERT INTO `student_class` VALUES (131, '65598554', 32, 2, 1, '2026-10-04 09:05:55');
INSERT INTO `student_class` VALUES (132, '20366519', 3, 1, 1, '2026-10-04 09:28:24');
INSERT INTO `student_class` VALUES (133, '20366519', 3, 2, 1, '2026-10-04 09:28:24');
INSERT INTO `student_class` VALUES (134, '45248941', 31, 1, 1, '2026-10-04 09:39:09');
INSERT INTO `student_class` VALUES (135, '45248941', 31, 2, 1, '2026-10-04 09:39:09');
INSERT INTO `student_class` VALUES (136, '33357252', 32, 1, 1, '2026-10-04 09:53:37');
INSERT INTO `student_class` VALUES (137, '66385350', 2, 1, 1, '2026-10-04 10:20:30');
INSERT INTO `student_class` VALUES (138, '77953252', 3, 1, 1, '2026-10-04 10:38:37');
INSERT INTO `student_class` VALUES (139, '38343832', 3, 1, 1, '2026-10-04 10:41:08');
INSERT INTO `student_class` VALUES (140, '14412883', 3, 1, 1, '2026-10-04 10:54:15');
INSERT INTO `student_class` VALUES (141, '85258026', 3, 1, 1, '2026-10-04 10:56:30');
INSERT INTO `student_class` VALUES (142, '27671917', 3, 1, 1, '2026-10-04 11:00:20');
INSERT INTO `student_class` VALUES (143, '27671917', 3, 2, 1, '2026-10-04 11:00:20');
INSERT INTO `student_class` VALUES (144, '69529304', 32, 1, 1, '2026-10-04 12:27:04');
INSERT INTO `student_class` VALUES (145, '69529304', 32, 2, 1, '2026-10-04 12:27:04');
INSERT INTO `student_class` VALUES (146, '57679027', 3, 1, 1, '2026-10-04 12:47:19');
INSERT INTO `student_class` VALUES (147, '97239230', 33, 1, 1, '2026-10-04 13:26:25');
INSERT INTO `student_class` VALUES (148, '97239230', 33, 2, 1, '2026-10-04 13:26:25');
INSERT INTO `student_class` VALUES (149, '10386350', 35, 1, 1, '2026-10-04 13:28:03');
INSERT INTO `student_class` VALUES (150, '10386350', 35, 2, 1, '2026-10-04 13:28:03');
INSERT INTO `student_class` VALUES (151, '60034929', 32, 1, 1, '2026-10-04 13:53:34');
INSERT INTO `student_class` VALUES (152, '74939881', 32, 1, 1, '2026-10-04 13:59:04');
INSERT INTO `student_class` VALUES (153, '74939881', 32, 2, 1, '2026-10-04 13:59:04');
INSERT INTO `student_class` VALUES (154, '88057991', 32, 1, 1, '2026-10-04 14:06:40');
INSERT INTO `student_class` VALUES (155, '88057991', 32, 2, 1, '2026-10-04 14:06:40');
INSERT INTO `student_class` VALUES (156, '77099833', 3, 1, 1, '2026-10-04 14:07:55');
INSERT INTO `student_class` VALUES (157, '34560913', 32, 1, 1, '2026-10-04 14:26:18');
INSERT INTO `student_class` VALUES (158, '34560913', 32, 2, 1, '2026-10-04 14:26:18');
INSERT INTO `student_class` VALUES (159, '71102952', 3, 1, 1, '2026-10-04 15:04:49');
INSERT INTO `student_class` VALUES (160, '71102952', 3, 2, 1, '2026-10-04 15:04:49');
INSERT INTO `student_class` VALUES (161, '30042358', 32, 1, 1, '2026-10-04 16:09:34');
INSERT INTO `student_class` VALUES (162, '30042358', 32, 2, 1, '2026-10-04 16:09:34');
INSERT INTO `student_class` VALUES (163, '10709146', 32, 1, 1, '2026-10-04 16:12:33');
INSERT INTO `student_class` VALUES (164, '10709146', 32, 2, 1, '2026-10-04 16:12:33');
INSERT INTO `student_class` VALUES (165, '63263513', 3, 1, 1, '2026-10-04 16:52:24');
INSERT INTO `student_class` VALUES (166, '63263513', 3, 2, 1, '2026-10-04 16:52:24');
INSERT INTO `student_class` VALUES (167, '89204148', 32, 1, 1, '2026-10-04 18:18:17');
INSERT INTO `student_class` VALUES (168, '89204148', 32, 2, 1, '2026-10-04 18:18:17');
INSERT INTO `student_class` VALUES (169, '37021078', 35, 2, 1, '2026-10-05 00:35:52');
INSERT INTO `student_class` VALUES (170, '26035164', 3, 1, 1, '2026-10-05 00:38:31');
INSERT INTO `student_class` VALUES (171, '88504947', 32, 1, 1, '2026-10-05 03:06:08');
INSERT INTO `student_class` VALUES (172, '88504947', 32, 2, 1, '2026-10-05 03:06:08');
INSERT INTO `student_class` VALUES (173, '68658629', 31, 2, 1, '2026-10-05 03:13:11');
INSERT INTO `student_class` VALUES (174, '30137887', 31, 1, 1, '2026-10-05 04:02:26');
INSERT INTO `student_class` VALUES (175, '30137887', 31, 2, 1, '2026-10-05 04:02:26');
INSERT INTO `student_class` VALUES (176, '18857922', 32, 1, 1, '2026-10-05 04:44:51');
INSERT INTO `student_class` VALUES (177, '18857922', 32, 2, 1, '2026-10-05 04:44:51');
INSERT INTO `student_class` VALUES (178, '61335552', 32, 1, 1, '2026-10-05 05:32:16');
INSERT INTO `student_class` VALUES (179, '61335552', 32, 2, 1, '2026-10-05 05:32:16');
INSERT INTO `student_class` VALUES (180, '13122724', 32, 1, 1, '2026-10-05 05:40:45');
INSERT INTO `student_class` VALUES (181, '13122724', 32, 2, 1, '2026-10-05 05:40:46');
INSERT INTO `student_class` VALUES (182, '79784028', 32, 1, 1, '2026-10-05 05:44:09');
INSERT INTO `student_class` VALUES (183, '79784028', 32, 2, 1, '2026-10-05 05:44:09');
INSERT INTO `student_class` VALUES (184, '19606851', 31, 1, 1, '2026-10-05 05:46:38');
INSERT INTO `student_class` VALUES (185, '99018209', 32, 1, 1, '2026-10-05 05:49:54');
INSERT INTO `student_class` VALUES (186, '99018209', 32, 2, 1, '2026-10-05 05:49:54');
INSERT INTO `student_class` VALUES (187, '64387383', 32, 1, 1, '2026-10-05 05:51:18');
INSERT INTO `student_class` VALUES (188, '64387383', 32, 2, 1, '2026-10-05 05:51:18');
INSERT INTO `student_class` VALUES (189, '92709936', 31, 1, 1, '2026-10-05 05:51:33');
INSERT INTO `student_class` VALUES (190, '58770339', 32, 1, 1, '2026-10-05 06:13:47');
INSERT INTO `student_class` VALUES (191, '58770339', 32, 2, 1, '2026-10-05 06:13:47');
INSERT INTO `student_class` VALUES (192, '90846228', 32, 1, 1, '2026-10-05 06:27:51');
INSERT INTO `student_class` VALUES (193, '90846228', 32, 2, 1, '2026-10-05 06:27:51');
INSERT INTO `student_class` VALUES (194, '54404418', 31, 1, 1, '2026-10-05 06:30:23');
INSERT INTO `student_class` VALUES (195, '54404418', 31, 2, 1, '2026-10-05 06:30:23');
INSERT INTO `student_class` VALUES (196, '30057073', 32, 1, 1, '2026-10-05 06:31:29');
INSERT INTO `student_class` VALUES (197, '30057073', 32, 2, 1, '2026-10-05 06:31:29');
INSERT INTO `student_class` VALUES (198, '28885770', 31, 2, 1, '2026-10-05 06:48:30');
INSERT INTO `student_class` VALUES (199, '45251977', 32, 1, 1, '2026-10-05 07:06:54');
INSERT INTO `student_class` VALUES (200, '84609661', 32, 1, 1, '2026-10-05 07:17:21');
INSERT INTO `student_class` VALUES (201, '84609661', 32, 2, 1, '2026-10-05 07:17:21');
INSERT INTO `student_class` VALUES (202, '98867404', 31, 1, 1, '2026-10-05 07:38:37');
INSERT INTO `student_class` VALUES (203, '98867404', 31, 2, 1, '2026-10-05 07:38:37');
INSERT INTO `student_class` VALUES (204, '73848579', 32, 1, 1, '2026-10-05 07:39:21');
INSERT INTO `student_class` VALUES (205, '73848579', 32, 2, 1, '2026-10-05 07:39:21');
INSERT INTO `student_class` VALUES (206, '64599395', 31, 2, 1, '2026-10-05 07:46:10');
INSERT INTO `student_class` VALUES (207, '53912598', 31, 1, 1, '2026-10-05 10:03:39');
INSERT INTO `student_class` VALUES (208, '48829767', 31, 2, 1, '2026-10-05 10:13:41');
INSERT INTO `student_class` VALUES (209, '90599354', 32, 1, 1, '2026-10-05 10:32:36');
INSERT INTO `student_class` VALUES (210, '90599354', 32, 2, 1, '2026-10-05 10:32:36');
INSERT INTO `student_class` VALUES (211, '26534746', 31, 2, 1, '2026-10-05 11:24:48');
INSERT INTO `student_class` VALUES (212, '22431509', 31, 1, 1, '2026-10-05 12:19:43');
INSERT INTO `student_class` VALUES (213, '22431509', 31, 2, 1, '2026-10-05 12:20:18');
INSERT INTO `student_class` VALUES (214, '70502108', 32, 2, 1, '2026-10-05 14:35:01');
INSERT INTO `student_class` VALUES (215, '70502108', 32, 1, 1, '2026-10-05 14:36:19');
INSERT INTO `student_class` VALUES (216, '41621251', 31, 1, 1, '2026-10-06 04:52:14');
INSERT INTO `student_class` VALUES (217, '41621251', 31, 2, 1, '2026-10-06 04:52:16');
INSERT INTO `student_class` VALUES (218, '69655512', 2, 1, 1, '2026-10-06 14:34:11');
INSERT INTO `student_class` VALUES (219, '80332658', 2, 1, 1, '2026-10-07 05:26:19');
INSERT INTO `student_class` VALUES (220, '72690106', 34, 1, 1, '2026-10-09 14:56:16');
INSERT INTO `student_class` VALUES (221, '36810197', 32, 2, 1, '2026-10-09 17:09:14');
INSERT INTO `student_class` VALUES (222, '74928194', 32, 2, 1, '2026-10-10 05:22:13');
INSERT INTO `student_class` VALUES (223, '74928194', 32, 1, 1, '2026-10-10 05:27:08');
INSERT INTO `student_class` VALUES (224, '26255598', 2, 1, 1, '2026-10-10 15:41:32');
INSERT INTO `student_class` VALUES (225, '81691676', 32, 2, 1, '2026-10-10 17:55:36');
INSERT INTO `student_class` VALUES (226, '78639144', 3, 1, 1, '2026-10-11 09:23:41');
INSERT INTO `student_class` VALUES (227, '25558397', 32, 1, 1, '2026-10-11 09:24:25');
INSERT INTO `student_class` VALUES (228, '25558397', 32, 2, 1, '2026-10-11 09:24:29');
INSERT INTO `student_class` VALUES (229, '78639144', 3, 2, 1, '2026-10-11 09:25:37');
INSERT INTO `student_class` VALUES (230, '86539099', 32, 1, 1, '2026-10-11 09:34:16');
INSERT INTO `student_class` VALUES (231, '86539099', 32, 2, 1, '2026-10-11 09:34:31');
INSERT INTO `student_class` VALUES (232, '83014730', 3, 1, 1, '2026-10-11 10:42:30');
INSERT INTO `student_class` VALUES (233, '36810197', 32, 1, 1, '2026-10-11 11:11:47');
INSERT INTO `student_class` VALUES (234, '12209806', 32, 1, 1, '2026-10-11 18:23:15');
INSERT INTO `student_class` VALUES (235, '12209806', 32, 2, 1, '2026-10-11 18:23:18');
INSERT INTO `student_class` VALUES (236, '91772379', 32, 2, 1, '2026-10-12 08:22:42');
INSERT INTO `student_class` VALUES (237, '81691676', 32, 1, 1, '2026-10-12 14:30:05');
INSERT INTO `student_class` VALUES (238, '69618390', 32, 2, 1, '2026-10-12 14:53:31');
INSERT INTO `student_class` VALUES (239, '36271485', 31, 2, 1, '2026-10-12 15:39:55');
INSERT INTO `student_class` VALUES (240, '57923586', 31, 1, 1, '2026-10-12 15:40:19');
INSERT INTO `student_class` VALUES (241, '57923586', 31, 2, 1, '2026-10-12 15:40:22');
INSERT INTO `student_class` VALUES (242, '98909706', 32, 2, 1, '2026-10-12 16:27:46');
INSERT INTO `student_class` VALUES (243, '98909706', 32, 1, 1, '2026-10-12 16:28:53');
INSERT INTO `student_class` VALUES (244, '63288413', 32, 2, 1, '2026-10-12 17:02:18');
INSERT INTO `student_class` VALUES (245, '41996164', 2, 1, 1, '2026-10-13 15:03:00');
INSERT INTO `student_class` VALUES (246, '67965815', 32, 1, 1, '2026-10-13 18:28:11');
INSERT INTO `student_class` VALUES (247, '67965815', 32, 2, 1, '2026-10-13 18:28:17');

-- ----------------------------
-- Table structure for student_grade
-- ----------------------------
DROP TABLE IF EXISTS `student_grade`;
CREATE TABLE `student_grade`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `students_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `grade_id` int NOT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_student_subjects_students1_idx`(`students_id` ASC) USING BTREE,
  INDEX `fk_student_grade_grade1_idx`(`grade_id` ASC) USING BTREE,
  INDEX `fk_student_grade_status1_idx`(`status_id` ASC) USING BTREE,
  CONSTRAINT `fk_student_grade_grade1` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_student_grade_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_student_subjects_students1` FOREIGN KEY (`students_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of student_grade
-- ----------------------------

-- ----------------------------
-- Table structure for student_grade_payments
-- ----------------------------
DROP TABLE IF EXISTS `student_grade_payments`;
CREATE TABLE `student_grade_payments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `transaction_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `receipt_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `students_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `grade_id` int NOT NULL,
  `month_year` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_student_subject_payments_students1_idx`(`students_id` ASC) USING BTREE,
  INDEX `fk_student_grade_payments_grade1_idx`(`grade_id` ASC) USING BTREE,
  INDEX `fk_payment_status`(`status_id` ASC) USING BTREE,
  CONSTRAINT `fk_payment_status` FOREIGN KEY (`status_id`) REFERENCES `payment_status` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_student_grade_payments_grade1` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_student_subject_payments_students1` FOREIGN KEY (`students_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of student_grade_payments
-- ----------------------------

-- ----------------------------
-- Table structure for student_monthly_fees
-- ----------------------------
DROP TABLE IF EXISTS `student_monthly_fees`;
CREATE TABLE `student_monthly_fees`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `grade_id` int NOT NULL,
  `class_type_id` int NULL DEFAULT NULL,
  `month_year` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `fee_amount` double NULL DEFAULT NULL,
  `status_id` int NULL DEFAULT NULL,
  `due_date` date NULL DEFAULT NULL,
  `paid_date` date NULL DEFAULT NULL,
  `transaction_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `grade_id`(`grade_id` ASC) USING BTREE,
  INDEX `student_id`(`student_id` ASC) USING BTREE,
  INDEX `fk_monthly_fees_status`(`status_id` ASC) USING BTREE,
  INDEX `idx_class_type_id`(`class_type_id` ASC) USING BTREE,
  CONSTRAINT `fk_monthly_fees_status` FOREIGN KEY (`status_id`) REFERENCES `payment_status` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `grade_id` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `student_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `student_monthly_fees_ibfk_1` FOREIGN KEY (`class_type_id`) REFERENCES `class_type` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 170 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of student_monthly_fees
-- ----------------------------
INSERT INTO `student_monthly_fees` VALUES (38, '15208224', 1, 1, '2026-09', 1200, 1, '2026-10-05', NULL, 'FEE1789008216382', '2026-09-09 21:13:18', '2026-09-09 21:13:36');
INSERT INTO `student_monthly_fees` VALUES (39, '63875948', 2, 1, '2026-09', 1000, 1, '2026-10-05', NULL, 'FEE1790016895142', '2026-09-21 13:23:05', '2026-09-21 13:24:55');
INSERT INTO `student_monthly_fees` VALUES (40, '57298892', 3, 1, '2026-09', 1200, 1, '2026-10-05', NULL, 'FEE1790317481557', '2026-09-23 00:04:32', '2026-09-25 00:54:42');
INSERT INTO `student_monthly_fees` VALUES (41, '45577478', 2, 1, '2026-09', 2500, 1, '2026-10-05', NULL, 'FEE1790251689316', '2026-09-23 00:08:01', '2026-09-24 06:38:09');
INSERT INTO `student_monthly_fees` VALUES (42, '87481209', 2, 1, '2026-09', 2500, 1, '2026-10-05', NULL, 'FEE1790172418031', '2026-09-23 08:36:42', '2026-09-23 08:36:58');
INSERT INTO `student_monthly_fees` VALUES (43, '58795636', 32, 1, '2026-09', 1000, 1, '2026-10-05', NULL, NULL, '2026-09-25 14:03:09', '2026-09-25 14:03:09');
INSERT INTO `student_monthly_fees` VALUES (44, '81222911', 35, 2, '2026-09', 5000, 1, '2026-10-05', NULL, NULL, '2026-09-25 23:21:05', '2026-09-25 23:21:05');
INSERT INTO `student_monthly_fees` VALUES (45, '45577478', 2, 1, '2026-10', 2500, 1, '2026-11-05', NULL, 'FEE1791298421018', '2026-09-30 18:35:01', '2026-10-06 14:53:41');
INSERT INTO `student_monthly_fees` VALUES (46, '57298892', 3, 1, '2026-10', 100, 1, '2026-11-05', NULL, 'FEE1791260117656', '2026-09-30 18:35:01', '2026-10-06 04:15:18');
INSERT INTO `student_monthly_fees` VALUES (47, '58795636', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-09-30 18:35:01', '2026-09-30 18:35:01');
INSERT INTO `student_monthly_fees` VALUES (48, '81222911', 35, 2, '2026-10', 5000, 1, '2026-11-05', NULL, NULL, '2026-09-30 18:35:01', '2026-09-30 18:35:01');
INSERT INTO `student_monthly_fees` VALUES (50, '45512699', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 05:26:51', '2026-10-04 05:26:51');
INSERT INTO `student_monthly_fees` VALUES (51, '73809117', 35, 2, '2026-10', 5000, 1, '2026-11-05', NULL, NULL, '2026-10-04 05:49:53', '2026-10-04 05:49:53');
INSERT INTO `student_monthly_fees` VALUES (52, '96847431', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 05:50:17', '2026-10-04 05:50:17');
INSERT INTO `student_monthly_fees` VALUES (53, '62057834', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:02:44', '2026-10-04 06:02:44');
INSERT INTO `student_monthly_fees` VALUES (54, '40638177', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:07:27', '2026-10-04 06:07:27');
INSERT INTO `student_monthly_fees` VALUES (55, '88174360', 2, 1, '2026-10', 2500, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:09:57', '2026-10-04 06:09:57');
INSERT INTO `student_monthly_fees` VALUES (56, '19022737', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:11:50', '2026-10-04 06:11:50');
INSERT INTO `student_monthly_fees` VALUES (57, '73108289', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:11:57', '2026-10-04 06:11:57');
INSERT INTO `student_monthly_fees` VALUES (58, '59494997', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:12:04', '2026-10-04 06:12:04');
INSERT INTO `student_monthly_fees` VALUES (59, '47937205', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:12:23', '2026-10-04 06:12:23');
INSERT INTO `student_monthly_fees` VALUES (60, '64989358', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:15:31', '2026-10-04 06:15:31');
INSERT INTO `student_monthly_fees` VALUES (61, '64176698', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:20:10', '2026-10-04 06:20:10');
INSERT INTO `student_monthly_fees` VALUES (62, '29954866', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:21:26', '2026-10-04 06:21:26');
INSERT INTO `student_monthly_fees` VALUES (63, '65531710', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:22:06', '2026-10-04 06:22:06');
INSERT INTO `student_monthly_fees` VALUES (64, '34954445', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:23:17', '2026-10-04 06:23:17');
INSERT INTO `student_monthly_fees` VALUES (65, '32416225', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:24:36', '2026-10-04 06:24:36');
INSERT INTO `student_monthly_fees` VALUES (66, '25888160', 2, 1, '2026-10', 2500, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:26:10', '2026-10-04 06:26:10');
INSERT INTO `student_monthly_fees` VALUES (67, '56808678', 35, 2, '2026-10', 5000, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:27:44', '2026-10-04 06:27:44');
INSERT INTO `student_monthly_fees` VALUES (68, '65804211', 2, 1, '2026-10', 2500, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:30:39', '2026-10-04 06:30:39');
INSERT INTO `student_monthly_fees` VALUES (69, '67449663', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:35:14', '2026-10-04 06:35:14');
INSERT INTO `student_monthly_fees` VALUES (70, '86804353', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791207663981', '2026-10-04 06:36:47', '2026-10-05 13:41:04');
INSERT INTO `student_monthly_fees` VALUES (71, '96413579', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:38:07', '2026-10-04 06:38:07');
INSERT INTO `student_monthly_fees` VALUES (72, '51675638', 2, 1, '2026-10', 2500, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:41:46', '2026-10-04 06:41:46');
INSERT INTO `student_monthly_fees` VALUES (73, '86825575', 35, 2, '2026-10', 5000, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:42:12', '2026-10-04 06:42:12');
INSERT INTO `student_monthly_fees` VALUES (74, '60246189', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:52:00', '2026-10-04 06:52:00');
INSERT INTO `student_monthly_fees` VALUES (75, '69988958', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:54:25', '2026-10-04 06:54:25');
INSERT INTO `student_monthly_fees` VALUES (76, '31075988', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791096967109', '2026-10-04 06:54:31', '2026-10-04 06:56:07');
INSERT INTO `student_monthly_fees` VALUES (77, '26546881', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:58:22', '2026-10-04 06:58:22');
INSERT INTO `student_monthly_fees` VALUES (78, '71840137', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 06:59:19', '2026-10-04 06:59:19');
INSERT INTO `student_monthly_fees` VALUES (79, '91203277', 2, 1, '2026-10', 2500, 1, '2026-11-05', NULL, NULL, '2026-10-04 07:00:26', '2026-10-04 07:00:26');
INSERT INTO `student_monthly_fees` VALUES (80, '29150939', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 07:04:47', '2026-10-04 07:04:47');
INSERT INTO `student_monthly_fees` VALUES (81, '51352066', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 07:23:48', '2026-10-04 07:23:48');
INSERT INTO `student_monthly_fees` VALUES (82, '56352174', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 07:28:17', '2026-10-04 07:28:17');
INSERT INTO `student_monthly_fees` VALUES (83, '26714369', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 07:40:56', '2026-10-04 07:40:56');
INSERT INTO `student_monthly_fees` VALUES (84, '90006089', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791187127786', '2026-10-04 07:44:19', '2026-10-05 07:58:48');
INSERT INTO `student_monthly_fees` VALUES (85, '98884075', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 07:51:17', '2026-10-04 07:51:17');
INSERT INTO `student_monthly_fees` VALUES (86, '50574760', 2, 1, '2026-10', 2500, 1, '2026-11-05', NULL, NULL, '2026-10-04 07:59:35', '2026-10-04 07:59:35');
INSERT INTO `student_monthly_fees` VALUES (87, '70804653', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 08:11:07', '2026-10-04 08:11:07');
INSERT INTO `student_monthly_fees` VALUES (88, '47294242', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 08:11:29', '2026-10-04 08:11:29');
INSERT INTO `student_monthly_fees` VALUES (89, '91564138', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 08:27:59', '2026-10-04 08:27:59');
INSERT INTO `student_monthly_fees` VALUES (90, '88119671', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 08:28:31', '2026-10-04 08:28:31');
INSERT INTO `student_monthly_fees` VALUES (91, '72295196', 3, 1, '2026-10', 1200, 2, '2026-11-05', '2026-10-11', 'FEE1791690877542', '2026-10-04 08:37:23', '2026-10-11 04:32:35');
INSERT INTO `student_monthly_fees` VALUES (92, '90608402', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791732087416', '2026-10-04 08:55:20', '2026-10-11 15:21:27');
INSERT INTO `student_monthly_fees` VALUES (93, '65598554', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 09:05:55', '2026-10-04 09:05:55');
INSERT INTO `student_monthly_fees` VALUES (94, '20366519', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, 'FEE1791106557688', '2026-10-04 09:28:24', '2026-10-04 09:35:58');
INSERT INTO `student_monthly_fees` VALUES (95, '45248941', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791825414396', '2026-10-04 09:39:09', '2026-10-12 17:16:54');
INSERT INTO `student_monthly_fees` VALUES (96, '33357252', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 09:53:37', '2026-10-04 09:53:37');
INSERT INTO `student_monthly_fees` VALUES (97, '66385350', 2, 1, '2026-10', 2500, 1, '2026-11-05', NULL, NULL, '2026-10-04 10:20:30', '2026-10-04 10:20:30');
INSERT INTO `student_monthly_fees` VALUES (98, '77953252', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 10:38:37', '2026-10-04 10:38:37');
INSERT INTO `student_monthly_fees` VALUES (99, '38343832', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 10:41:08', '2026-10-04 10:41:08');
INSERT INTO `student_monthly_fees` VALUES (100, '14412883', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 10:54:15', '2026-10-04 10:54:15');
INSERT INTO `student_monthly_fees` VALUES (101, '85258026', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, 'FEE1791111564578', '2026-10-04 10:56:30', '2026-10-04 10:59:25');
INSERT INTO `student_monthly_fees` VALUES (102, '27671917', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 11:00:20', '2026-10-04 11:00:20');
INSERT INTO `student_monthly_fees` VALUES (103, '69529304', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 12:27:04', '2026-10-04 12:27:04');
INSERT INTO `student_monthly_fees` VALUES (104, '57679027', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 12:47:19', '2026-10-04 12:47:19');
INSERT INTO `student_monthly_fees` VALUES (105, '97239230', 33, 2, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 13:26:25', '2026-10-04 13:26:25');
INSERT INTO `student_monthly_fees` VALUES (106, '10386350', 35, 2, '2026-10', 5000, 1, '2026-11-05', NULL, NULL, '2026-10-04 13:28:03', '2026-10-04 13:28:03');
INSERT INTO `student_monthly_fees` VALUES (107, '60034929', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 13:53:34', '2026-10-04 13:53:34');
INSERT INTO `student_monthly_fees` VALUES (108, '74939881', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 13:59:04', '2026-10-04 13:59:04');
INSERT INTO `student_monthly_fees` VALUES (109, '88057991', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 14:06:40', '2026-10-04 14:06:40');
INSERT INTO `student_monthly_fees` VALUES (110, '77099833', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 14:07:55', '2026-10-04 14:07:55');
INSERT INTO `student_monthly_fees` VALUES (111, '34560913', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 14:26:18', '2026-10-04 14:26:18');
INSERT INTO `student_monthly_fees` VALUES (112, '71102952', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 15:04:49', '2026-10-04 15:04:49');
INSERT INTO `student_monthly_fees` VALUES (113, '30042358', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 16:09:34', '2026-10-04 16:09:34');
INSERT INTO `student_monthly_fees` VALUES (114, '10709146', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 16:12:33', '2026-10-04 16:12:33');
INSERT INTO `student_monthly_fees` VALUES (115, '63263513', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-04 16:52:24', '2026-10-04 16:52:24');
INSERT INTO `student_monthly_fees` VALUES (116, '89204148', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-04 18:18:17', '2026-10-04 18:18:17');
INSERT INTO `student_monthly_fees` VALUES (117, '37021078', 35, 2, '2026-10', 5000, 1, '2026-11-05', NULL, 'FEE1791204997261', '2026-10-05 00:35:52', '2026-10-05 12:56:37');
INSERT INTO `student_monthly_fees` VALUES (118, '26035164', 3, 1, '2026-10', 1200, 1, '2026-11-05', NULL, NULL, '2026-10-05 00:38:31', '2026-10-05 00:38:31');
INSERT INTO `student_monthly_fees` VALUES (119, '88504947', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 03:06:08', '2026-10-05 03:06:08');
INSERT INTO `student_monthly_fees` VALUES (120, '68658629', 31, 2, '2026-10', 1000, 2, '2026-11-05', '2026-10-05', 'FEE1791170651122', '2026-10-05 03:13:11', '2026-10-05 03:28:35');
INSERT INTO `student_monthly_fees` VALUES (121, '30137887', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 04:02:26', '2026-10-05 04:02:26');
INSERT INTO `student_monthly_fees` VALUES (123, '61335552', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 05:32:16', '2026-10-05 05:32:16');
INSERT INTO `student_monthly_fees` VALUES (124, '13122724', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791195918993', '2026-10-05 05:40:46', '2026-10-05 10:25:19');
INSERT INTO `student_monthly_fees` VALUES (125, '79784028', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 05:44:09', '2026-10-05 05:44:09');
INSERT INTO `student_monthly_fees` VALUES (126, '99018209', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791819403158', '2026-10-05 05:49:54', '2026-10-12 15:36:43');
INSERT INTO `student_monthly_fees` VALUES (127, '64387383', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 05:51:18', '2026-10-05 05:51:18');
INSERT INTO `student_monthly_fees` VALUES (128, '58770339', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 06:13:47', '2026-10-05 06:13:47');
INSERT INTO `student_monthly_fees` VALUES (129, '90846228', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 06:27:51', '2026-10-05 06:27:51');
INSERT INTO `student_monthly_fees` VALUES (130, '54404418', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791820952368', '2026-10-05 06:30:23', '2026-10-12 16:02:32');
INSERT INTO `student_monthly_fees` VALUES (131, '30057073', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 06:31:29', '2026-10-05 06:31:29');
INSERT INTO `student_monthly_fees` VALUES (132, '28885770', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791183270460', '2026-10-05 06:48:30', '2026-10-05 06:54:30');
INSERT INTO `student_monthly_fees` VALUES (133, '45251977', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791903735018', '2026-10-05 07:06:54', '2026-10-13 15:02:15');
INSERT INTO `student_monthly_fees` VALUES (134, '84609661', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 07:17:21', '2026-10-05 07:17:21');
INSERT INTO `student_monthly_fees` VALUES (135, '98867404', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791292104833', '2026-10-05 07:38:37', '2026-10-06 13:08:25');
INSERT INTO `student_monthly_fees` VALUES (136, '73848579', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 07:39:21', '2026-10-05 07:39:21');
INSERT INTO `student_monthly_fees` VALUES (137, '64599395', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791186457297', '2026-10-05 07:46:10', '2026-10-05 07:47:37');
INSERT INTO `student_monthly_fees` VALUES (138, '48829767', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, 'FEE1791195646477', '2026-10-05 10:13:41', '2026-10-05 10:20:46');
INSERT INTO `student_monthly_fees` VALUES (139, '90599354', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 10:32:36', '2026-10-05 10:32:36');
INSERT INTO `student_monthly_fees` VALUES (140, '26534746', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 11:24:48', '2026-10-05 11:24:48');
INSERT INTO `student_monthly_fees` VALUES (141, '22431509', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 12:21:30', '2026-10-05 12:21:30');
INSERT INTO `student_monthly_fees` VALUES (142, '70502108', 32, 1, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-05 14:36:27', '2026-10-05 14:36:27');
INSERT INTO `student_monthly_fees` VALUES (143, '41621251', 31, 2, '2026-10', 1000, 1, '2026-11-05', NULL, NULL, '2026-10-06 04:52:22', '2026-10-06 04:52:22');
INSERT INTO `student_monthly_fees` VALUES (144, '69655512', 2, 1, '2026-10', 2500, 1, '2026-10-10', NULL, NULL, '2026-10-06 14:34:11', '2026-10-06 14:34:11');
INSERT INTO `student_monthly_fees` VALUES (145, '80332658', 2, 1, '2026-10', 2500, 1, '2026-10-10', NULL, NULL, '2026-10-07 05:26:19', '2026-10-07 05:26:19');
INSERT INTO `student_monthly_fees` VALUES (146, '63875948', 2, 1, '2026-10', 2500, 1, '2026-10-10', NULL, NULL, '2026-10-09 14:50:45', '2026-10-09 14:50:45');
INSERT INTO `student_monthly_fees` VALUES (147, '74928194', 32, 1, '2026-10', 1000, 1, '2026-10-10', NULL, NULL, '2026-10-10 05:27:08', '2026-10-10 05:27:08');
INSERT INTO `student_monthly_fees` VALUES (149, '18857922', 32, 1, '2026-10', 1000, 2, '2026-10-10', '2026-10-10', 'FEE1791646532518', '2026-10-10 15:04:41', '2026-10-10 16:00:33');
INSERT INTO `student_monthly_fees` VALUES (150, '26255598', 2, 1, '2026-10', 2500, 1, '2026-10-10', NULL, NULL, '2026-10-10 15:41:32', '2026-10-10 15:41:32');
INSERT INTO `student_monthly_fees` VALUES (151, '78639144', 3, 1, '2026-10', 1200, 1, '2026-10-10', NULL, NULL, '2026-10-11 09:23:41', '2026-10-11 09:23:41');
INSERT INTO `student_monthly_fees` VALUES (152, '25558397', 32, 1, '2026-10', 1000, 1, '2026-10-10', NULL, NULL, '2026-10-11 09:24:25', '2026-10-11 09:24:25');
INSERT INTO `student_monthly_fees` VALUES (153, '86539099', 32, 1, '2026-10', 1000, 1, '2026-10-10', NULL, NULL, '2026-10-11 09:34:16', '2026-10-11 09:34:16');
INSERT INTO `student_monthly_fees` VALUES (154, '86539099', 32, 2, '2026-10', 1000, 1, '2026-10-10', NULL, NULL, '2026-10-11 09:34:31', '2026-10-11 09:34:31');
INSERT INTO `student_monthly_fees` VALUES (155, '83014730', 3, 1, '2026-10', 1200, 1, '2026-10-10', NULL, NULL, '2026-10-11 10:42:30', '2026-10-11 10:42:30');
INSERT INTO `student_monthly_fees` VALUES (156, '36810197', 32, 2, '2026-10', 1000, 1, '2026-10-10', NULL, 'FEE1791717552543', '2026-10-11 11:07:15', '2026-10-11 11:19:13');
INSERT INTO `student_monthly_fees` VALUES (157, '36810197', 32, 1, '2026-10', 1000, 1, '2026-10-10', NULL, NULL, '2026-10-11 11:11:47', '2026-10-11 11:11:47');
INSERT INTO `student_monthly_fees` VALUES (158, '12209806', 32, 1, '2026-10', 1000, 1, '2026-10-10', NULL, 'FEE1791743023633', '2026-10-11 18:23:15', '2026-10-11 18:23:44');
INSERT INTO `student_monthly_fees` VALUES (159, '12209806', 32, 2, '2026-10', 1000, 1, '2026-10-10', NULL, 'FEE1791802965175', '2026-10-11 18:23:18', '2026-10-12 11:02:45');
INSERT INTO `student_monthly_fees` VALUES (160, '91772379', 32, 2, '2026-10', 1000, 1, '2026-10-10', NULL, 'FEE1791793391948', '2026-10-12 08:22:42', '2026-10-12 08:23:12');
INSERT INTO `student_monthly_fees` VALUES (161, '81691676', 32, 2, '2026-10', 1000, 1, '2026-10-10', NULL, 'FEE1791806090738', '2026-10-12 11:54:04', '2026-10-12 11:54:51');
INSERT INTO `student_monthly_fees` VALUES (162, '81691676', 32, 1, '2026-10', 1000, 1, '2026-10-10', NULL, 'FEE1791816915730', '2026-10-12 14:30:05', '2026-10-12 14:55:16');
INSERT INTO `student_monthly_fees` VALUES (163, '69618390', 32, 2, '2026-10', 1000, 1, '2026-10-10', NULL, 'FEE1791816848397', '2026-10-12 14:53:31', '2026-10-12 14:54:08');
INSERT INTO `student_monthly_fees` VALUES (164, '98909706', 32, 2, '2026-10', 1000, 1, '2026-10-10', NULL, NULL, '2026-10-12 16:27:46', '2026-10-12 16:27:46');
INSERT INTO `student_monthly_fees` VALUES (165, '98909706', 32, 1, '2026-10', 1000, 1, '2026-10-10', NULL, NULL, '2026-10-12 16:28:53', '2026-10-12 16:28:53');
INSERT INTO `student_monthly_fees` VALUES (166, '63288413', 32, 2, '2026-10', 1000, 1, '2026-10-10', NULL, NULL, '2026-10-12 17:02:18', '2026-10-12 17:02:18');
INSERT INTO `student_monthly_fees` VALUES (167, '41996164', 2, 1, '2026-10', 2500, 1, '2026-10-10', NULL, 'FEE1791903808006', '2026-10-13 15:03:00', '2026-10-13 15:03:28');
INSERT INTO `student_monthly_fees` VALUES (168, '67965815', 32, 1, '2026-10', 1000, 1, '2026-10-10', NULL, NULL, '2026-10-13 18:28:11', '2026-10-13 18:28:11');
INSERT INTO `student_monthly_fees` VALUES (169, '67965815', 32, 2, '2026-10', 1000, 1, '2026-10-10', NULL, NULL, '2026-10-13 18:28:17', '2026-10-13 18:28:17');

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `grade_id` int NOT NULL,
  `date_of_birth` datetime NULL DEFAULT NULL,
  `school` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `address_id` int NULL DEFAULT NULL,
  `class_type_id` int NULL DEFAULT NULL,
  `nic` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'NIC number for A/L students (optional)',
  `free_card` tinyint(1) NULL DEFAULT 0 COMMENT 'Free card status: 1 = has free card (no monthly fees displayed), 0 = normal student',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `fk_students_grade1_idx`(`grade_id` ASC) USING BTREE,
  INDEX `FK_students_address`(`address_id` ASC) USING BTREE,
  INDEX `idx_class_type_id`(`class_type_id` ASC) USING BTREE,
  CONSTRAINT `FK_students_address` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_students_class_type` FOREIGN KEY (`class_type_id`) REFERENCES `class_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_students_grade1` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of students
-- ----------------------------
INSERT INTO `students` VALUES ('10374799', 'Rushentha', 'Rashmika', 'jeewanithusharika1980@gmail.com', '0718822750', '$2a$12$KVIB14oUD1xD7f5hWzVWVO4BfVTBQUDXuSxTvbxlQG6qyULq2Phsy', 1, '2026-10-05 11:53:49', 31, '2010-11-05 00:00:00', 'D.S.Senanayake College Colombo 07', 20265217, NULL, '', 0);
INSERT INTO `students` VALUES ('10386350', 'Sithmi', 'Himasarani ', 'sayuridewmini20007@gmail.com', '0753809875', '$2a$12$TgSEeMJBrQVMnIbB.MrmieJzRdkGC1sX7oekd4wYnByW9Sb2IOWxe', 1, '2026-10-04 13:28:03', 35, '2010-05-10 00:00:00', 'Piliyandala central college ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('10606341', 'Thumula ', 'Theekshana ', 'sandamaliyapa1980@gmail.com', '0774849818', '$2a$12$/qlXV.H2EYMWs2RL2Zca9u56b0RHkdqSDvWf1JYhiBOi7sigoGjoe', 1, '2026-10-05 13:06:28', 31, '2010-04-02 00:00:00', 'Ananda College Colombo 10', 72324901, NULL, '', 0);
INSERT INTO `students` VALUES ('10709146', 'Fathima', 'Ifra', 'rifkaifthi1988@gmail.com', '0763831437', '$2a$12$ChkOLFTVjq2mr5jTpNbaWuir9S/EO26uq35YCBZmXj.BJkEYAHdqy', 1, '2026-10-04 16:12:33', 32, '2010-09-12 00:00:00', 'Vidyakara Girls school Maharagama', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('11609549', 'Nimsara', 'Saheli', 'nilanthidayalatha1970@gmail.com', '0714928256', '$2a$12$bWrv5sseoJwitELaZ2.q0OYBF.UJsnHcOhDpvCE0UNT5na7ZYdOGK', 1, '2026-10-05 14:45:51', 31, '2010-02-09 00:00:00', 'Mahinda Rajapaksha College Homagama ', 26839613, NULL, '', 0);
INSERT INTO `students` VALUES ('11834999', 'Binadi', 'Sandeesa', 'mathagadiaamalmee@gmail.com', '0772073566', '$2a$12$fqy2hRyBoE.FTWWpiJpFZO4vq5gAKmeds0Ason6Ks22uZR3J.am4C', 1, '2026-10-07 09:54:47', 32, '2010-08-29 00:00:00', 'Central College Piliyandala', 57821489, NULL, '', 0);
INSERT INTO `students` VALUES ('12171691', 'Rageeth', 'Kalu Arachchi', 'rageethkalu10@gmail.com', '0777171658', '$2a$12$rUW6wjSTf/h15liI3XxWJux.rb1lp9pVAsi48POalN3.T19HSukY2', 1, '2026-10-07 02:59:36', 32, '2010-10-12 00:00:00', 'Ananda College, Colombo 10', 76169294, NULL, '', 0);
INSERT INTO `students` VALUES ('12209806', 'Isith', 'Anusara', 'isithanusara11@gmail.com', '0773042661', '$2a$12$1R.d8lhAhXAYM25WhHRo8e9ddedIO6xzG8MpF5KVYdHjrR7cFWPcu', 1, '2026-10-11 17:24:26', 32, '2010-01-02 00:00:00', 'Dadly Senanayaka A.M.V', 83147291, NULL, '', 0);
INSERT INTO `students` VALUES ('13024686', 'Navodya', 'Sandeepani', 'navodyasandeepani811@gmail.com', '0778680666', '$2a$12$KYH2NKu6rI96Z47iUvN7r.R8lveN2s0.o4Ds.KCgY5b4rrrPFvksS', 1, '2026-10-12 15:12:00', 2, '2009-05-06 00:00:00', 'Central College Piliyandala', 44090987, NULL, '200962702664', 0);
INSERT INTO `students` VALUES ('13122724', 'Araliya pawan', 'Nimsara', 'araliyapawan11@gmail.com', '0703940348', '$2a$12$AQ3iL4cXlAU5bauERtdXkOSTUTee2girY8z3WBh1bEjo0ihtPwloC', 1, '2026-10-05 05:40:45', 32, '2010-11-13 00:00:00', 'Dharmaraja collage', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('14030257', 'Kuvindi ', 'Muthuhansi', 'anujawickramanayaka73818@gmail.com', '0772586443', '$2a$12$358ZfsyM6LAlvZq5zVLfs.eeRYACPqs3ItZSKch7PKke.mgCDK/fe', 1, '2026-10-08 14:55:58', 3, '2011-02-15 00:00:00', 'St.Paul\'s Girls\' School - Milagiriya', 31566376, NULL, '', 0);
INSERT INTO `students` VALUES ('14412883', 'Desindu', 'Senewirathne', 'senevirathnedesindu@email.com', '0712683332', '$2a$12$Zx/39k/Gyh2JBbVlG2egdOsJIpMxuSSKbZHFgz4C5.IJRQTnhMXja', 1, '2026-10-04 10:54:15', 3, '2011-03-10 00:00:00', 'Mahinda Rajapaksha college ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('15171156', 'Budmina', 'Ranasingha', 'budminadisara9@gmail.com', '0774044609', '$2a$12$ldyWTf7u7xSfeczMxhhpL.lWKpygf.jMqbdeeqLJEl5MQfz.N3ZWe', 1, '2026-10-12 16:00:00', 32, '2010-11-10 00:00:00', 'ROYAL COLLEGE COLOMBO 07', 27176078, NULL, '', 0);
INSERT INTO `students` VALUES ('15208224', 'Nuwantha', 'Bandara', 'nuwantha@gmail.com', '0701826874', '$2a$12$7RG.gyApxggEXbGG.kSphOcO0Rxp4VOJz/ZDVq3pKP5B3vzytMloi', 1, '2026-07-23 22:30:49', 1, '2007-02-20 18:30:00', 'SCMV', 17900166, NULL, NULL, 1);
INSERT INTO `students` VALUES ('15757509', 'Uvindu', 'Sasmitha', 'swarnamalisamantha@gmail.com', '0778104132', '$2a$12$KmvQJC75L8tQHCwNY8mrcOC7ZJOyc/1WarARYo2V8HlqhHll62ntG', 1, '2026-10-10 05:19:31', 2, '2009-11-22 00:00:00', 'Thursten college', 49041534, NULL, '200932701730', 0);
INSERT INTO `students` VALUES ('15809397', 'Gayansa', 'Sethmee ', 'gayansasethmee63@gmail.com', '0720514352', '$2a$12$PvpRgL4YzlLLnHOlMjQ01ul1d6cCyG0U8QvgkXGtQlG0w7XLB.Kry', 1, '2026-09-24 02:04:22', 1, '2008-08-18 00:00:00', 'Anula Vidyalaya Nugegoda', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('16148185', 'Thenuki', 'Warnakula', 'thenukiwarnakula@gmail.com', '0772382771', '$2a$12$rHLVAQcRK3x80HufQ3LZEuMHk/kWNv0PoWwGmkYh4KbGSmLVXDuJy', 1, '2026-10-06 09:43:52', 3, '2026-08-04 00:00:00', 'Sujatha Vidayalaya Nugegoda', 56894875, NULL, '', 0);
INSERT INTO `students` VALUES ('16550212', 'Sanadi Thasanga ', 'Perera ', 'thasanga150@gmail.com', '0765237649', '$2a$12$juSDtrs9JPHaSAVbYfD.6eMn2FE23YMmME8uI7UdJlBkHEnAR04XO', 1, '2026-10-08 17:42:51', 32, '2010-09-23 00:00:00', 'Holy Family Convent, Dehiwala ', 60181943, NULL, '', 0);
INSERT INTO `students` VALUES ('17396147', 'Tujan', 'Methmitha', 'tujanmethmitha18@gmail.com', '0787180599', '$2a$12$ometmsotnO/98Zv9woP5YuG2xjDE3kZEue7uI5HE5xJjxos7u6LAm', 1, '2026-09-23 00:21:35', 1, '2008-06-10 00:00:00', 'Homgama mahinda rajapaksha college', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('17836214', 'Mohamed', 'Izzed', 'mohomedizzed67@gmail.com', '0787553284', '$2a$12$D3POoQavhLdyctCzWs3Qnu0mMAFIsiZt0iyvasUh/8EOYSmjehO6.', 1, '2026-09-23 00:20:50', 1, '2008-11-28 00:00:00', 'Isipathana college', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('18857922', 'Vibudha', 'Prasanga', 'prasangavibudha@gmail.com', '0726209010', '$2a$12$Zr4CmL/lYfuG5Zl81B0sk.9kihqoeSCg6qIHZQIjt5udQ3rev4oRC', 1, '2026-10-05 04:44:51', 32, '2010-12-27 00:00:00', 'Mahinda Rajapaksha College ', 17916355, NULL, '', 0);
INSERT INTO `students` VALUES ('19022737', 'Chamodi', 'Thathsarani', 'chamodiabeyratne@gmail.com', '0705289824', '$2a$12$sLn.L1p8qC7Gpn1Tvl.R1O4pejIaRTlqqQugl1BfgHVFsqFvK3lJC', 1, '2026-10-04 06:11:50', 32, '2010-11-19 00:00:00', 'Guidance International School', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('19553786', 'Deneth', 'Shenal', 'deneths2011@gmail.com', '0762256061', '$2a$12$8umMBBmkLboDZkKA.LPnEesq.MTTecbb7VWvp8vHgZSAO.iEqZbCe', 1, '2026-10-09 10:54:26', 32, '2011-07-03 00:00:00', 'Leeds International School', 52751858, NULL, '', 0);
INSERT INTO `students` VALUES ('19606851', 'Manumi ', 'Wijekoon ', 'ruchiraranathunga17@gmail.com', '0779954509', '$2a$12$CNTDGp2GrpRVMwkveK9L0OXjiqySEjqmorMx3rYBdY2WE6P3YuEGm', 1, '2026-10-05 05:46:38', 31, '2010-05-13 00:00:00', 'Royal International School ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('19953264', 'Bodini', 'Jayodya', 'ranganathsaminda@gmail.com', '0760929711', '$2a$12$Qxno3ZHi0MUD4I.bxXxr4eB4sMfLV9xXb8MRq4rMX8CsbbWmuB/GS', 1, '2026-10-05 14:54:10', 31, '2010-06-28 00:00:00', 'Samudradevi Balika Vidyalaya,Nugegoda', 20297363, NULL, '', 0);
INSERT INTO `students` VALUES ('20366519', 'Yasara', 'Methsadee', 'hasinduhansana2014@gmail.com', '0703934861', '$2a$12$SAxUFzrdi3Tzt62F/iKAL.TyMti.kLO2zGdvwg4fvNq4tMsIsbZVi', 1, '2026-10-04 09:28:24', 3, '2011-08-08 00:00:00', 'Guidance international school', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('21077005', 'Fathima ', 'Farha', 'frushda571@gmail.com', '0778006572', '$2a$12$dWhe9MX8jyf8.KaJW987/OIVG4Q3I.3Yw4kXF1Pdomv6jttjnYoO.', 1, '2026-10-13 07:19:56', 32, '2010-09-16 00:00:00', 'Vidyakara Balika', 42137062, NULL, '', 0);
INSERT INTO `students` VALUES ('21643286', 'Lakduli', 'Anuradhani ', 'aluckduli@gmail.com', '0742050079', '$2a$12$8tm0pkpSIGRFgYnAlDuxcOh9if5IfDiNkHl8KUPqRmfFzg7jKIs92', 1, '2026-09-24 02:10:55', 1, '2008-04-07 00:00:00', 'Dharmasena Attigala girls school ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('22431509', 'Thulina ', 'Theekshana ', 'anuruddhikaumayangani63@gmail.com', '0707900898', '$2a$12$j.nbtZrHSSpuhmajs40H0OOuQY2l6aVMKsZPZpmeBGvsTYCbwmjv6', 1, '2026-10-05 12:01:02', 31, '2010-10-05 00:00:00', 'Royal College ', 21105173, NULL, '', 0);
INSERT INTO `students` VALUES ('22519093', 'Sithija', 'Sithara', 'sithijasithijasithara@gmail.com', '0743714015', '$2a$12$5QayHmnUSG.FHd9r9.fe/O.2zUDNsLxpkogAj.RGwXmucEPD1QUK2', 1, '2026-09-24 02:08:29', 34, '2008-10-15 00:00:00', 'Isipathana Collage ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('23463945', 'Yalithi ', 'Weerasooriya', 'chithu.yali.9057@gmail.com', '0776748474', '$2a$12$YmoFXUt6EbQLE9.4YgDx4e8qO2.hPtAe5XVo7KxmxaaLsdqhlszTe', 1, '2026-10-12 07:31:07', 3, '2011-02-07 00:00:00', 'Sujatha Vidyalaya', 39189503, NULL, '', 0);
INSERT INTO `students` VALUES ('23971546', 'Yenuli', 'Sihansa', 'yenulisihansa1115@gmail.com', '0756351721', '$2a$12$5EIlkjk5JBIHuod8Evl66ursJLmGaLh4V4pQU2qUUefMVyyshRIEe', 1, '2026-10-06 14:11:04', 2, '2009-11-19 00:00:00', 'St. Joseph’s Girls’ Achool, Nugegoda', 60345530, NULL, '200982400352', 0);
INSERT INTO `students` VALUES ('24118306', 'NETHUKI', 'SAYUNIMA', 'sayunima2011@gmail.com', '0778019198', '$2a$12$iaGBYWtNXMrb2Ho.tM4I7.sqt7ogbPZGKMCrQpX5NjpR.TY69P16y', 1, '2026-10-07 15:04:15', 3, '2011-05-12 00:00:00', 'PILIYANDALA CENTRAL COLLAGE', 20271628, NULL, '', 0);
INSERT INTO `students` VALUES ('24247536', 'Senuja', 'Rathnayake', 'priyanjalaabeysinghe1983@email.com', '0705301717', '$2a$12$42r76TLiivwHNM89Twkl0ePzzofUzqFzo1SvGvGSPwvgr4U9j.smi', 1, '2026-10-10 09:49:57', 3, '2011-11-14 00:00:00', 'Piliyandala central college ', 32944659, NULL, '', 0);
INSERT INTO `students` VALUES ('25045416', 'Amasha ', 'Kaumadi ', 'ashokadissanayaka84@gmail.com', '0768334772', '$2a$12$a7Szp6AXxNC.YED2AoMRuu9gB4wd7PMSX7ho.qDpNU6ux9JH1uVQm', 1, '2026-10-09 14:24:07', 32, '2010-08-14 00:00:00', 'Co/Vidyakara Balika Vidyalaya ', 79072956, NULL, '', 0);
INSERT INTO `students` VALUES ('25558397', 'Pamith', 'Mindinu', 'pamithscout@gmail.com', '0714511123', '$2a$12$cgJiK8Dp.RfRQsMAcbZRZuPIPtBeVA78ohAPonMNWjlmAigp6bdBO', 1, '2026-10-11 09:09:38', 32, '2007-06-22 00:00:00', 'mc', 37549559, NULL, '', 0);
INSERT INTO `students` VALUES ('25888160', 'Pulini', 'Yehara', 'puliniyehara@gmail.com', '0772748921', '$2a$12$C/ASX/6ZL8FD2jrvEBtXE.STKA5lA3qd2OuD/WhzN7GxmUIMmUBtm', 1, '2026-10-04 06:26:10', 2, '2009-11-13 00:00:00', 'St.paul\'s girls school milagiriya ', NULL, NULL, '200981803952', 0);
INSERT INTO `students` VALUES ('26035164', 'Buwana', 'Chathusanka', 'priyangikasanjeewani07@gmail.com', '0743737462', '$2a$12$Ypy4RKGx1ol25FDH/vYhi.vwCUmSHZcmUnhsjFjDQuDSsl9bRLQWG', 1, '2026-10-05 00:38:31', 3, '2011-05-20 00:00:00', 'A.S.M.', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('26255598', 'Charith', 'Akalanka', 'charithakalanka52@gmail.com', '0741909172', '$2a$12$7s9icvoyvraj6V6zVqvnIeP5Jw2v8GM5ulZt4r8OPxgHAClH78jiq', 1, '2026-10-10 15:39:05', 2, '2009-04-17 00:00:00', 'pwc', 14022600, NULL, '', 0);
INSERT INTO `students` VALUES ('26534746', 'Maneesha', 'Dewmini', 'maneeshakoduthuwakuu@gmail.com', '0772370844', '$2a$12$If9hqq6ANVigk49UgUdcReBs/GaHujWjWGpAGWkrFTKIun2LPx9bq', 1, '2026-10-05 11:24:48', 31, '2010-05-15 00:00:00', 'Visakha Vidyalaya', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('26546881', 'Shashmika', 'Heshan', 'wanniarachchithilini0@gmail.com', '0764141849', '$2a$12$3R39WmhiK2dbg8KxM89cT.QzXDEADUbFP4UaNmubUbQM6NRd2z2R6', 1, '2026-10-04 06:58:21', 3, '2012-01-23 00:00:00', 'Piliyandala central college ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('26714369', 'Enuka ', 'Pathiranage', 'ebpathiranage@gmail.com', '0777898430', '$2a$12$aAh966hOYVI71cmFeNFqkeppJILTiYluNfCa/KXrxnHmnahd/ke1S', 1, '2026-10-04 07:40:56', 32, '2010-09-01 00:00:00', 'Ananda College, Colombo 10', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('27671917', 'Mayura', 'Dilip', 'mayuradilip148@gmail.com', '0740910171', '$2a$12$q.y5Eboo2Zh5TEYsc76fOOQe9fgpNCdk1qWPgjw7OsCJmLz/J2CXq', 1, '2026-10-04 11:00:20', 3, '2011-02-18 00:00:00', 'Mahinda rajapaksha college', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('27776769', 'Thesandu', 'Sihath', 'suwinilakmalipm@gmail.com', '0779885515', '$2a$12$l.zkmSMq/k39L8HE.Gnh5eyPTEEqZhCzc/QEkx2LBMnzDJugxsnWO', 1, '2026-10-08 17:35:34', 32, '2010-05-27 00:00:00', 'Royal College,Colombo 07', 33882587, NULL, '', 0);
INSERT INTO `students` VALUES ('28024075', 'Vithuli ', 'Sehanya ', 'bandaravithuli@gmail.com', '0740712601', '$2a$12$qv3H7IkXkDqODAUJWP9m6OkR1/dFLmFoMlSJ7YWhTwdOsondrOIxa', 1, '2026-10-08 17:11:30', 32, '2010-02-17 00:00:00', 'Ashoka College Horana ', 11389536, NULL, '', 0);
INSERT INTO `students` VALUES ('28885770', 'Sachintha', 'lakruwan', 'sachi.new2002@gmail.cm', '0723299009', '$2a$12$dzUOeM1Ejdg0lQZCTNK7h.EE4i6QqZoz41btLM03foFGtRbVeTNFO', 1, '2026-10-05 06:48:30', 31, '2010-05-15 00:00:00', 'Ananda College Colombo', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('29150939', 'CHAMALSHA', 'RASHMINDI', 'shyamalikumarika001@gmail.com', '0753661081', '$2a$12$BtDgr9Zy9wZ2BekDye5sEOBmM7SVQwFSp0ryc.cyk4kDq9CylyvAi', 1, '2026-10-04 07:04:47', 32, '2010-03-19 00:00:00', 'Dharmasena Attigala Balika Vidyalaya', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('29954866', 'Inesh ', 'Induwara ', 'nadeekasa1977@gmail.com', '0768135779', '$2a$12$2GOw838iCEZE4dKQe59haOdXa5bNyJ.RiMoPH.dA.wSXiW8nn.OFq', 1, '2026-10-04 06:21:26', 3, '2011-05-14 00:00:00', 'Prince of Wales College ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('30042358', 'Navithu ', 'Gunasinghe ', 'navithugunasinghe2010@gmail.com', '0701661720', '$2a$12$JWecNJzUrVSNW5WPKYJz3eWbyL59X02InQLXALSe3nzxMWdrn1MKO', 1, '2026-10-04 16:09:34', 32, '2010-12-06 00:00:00', 'Ananda College ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('30057073', 'Chamod', 'Dushyantha', 'chamod.d.samarathunga@gmail.com', '0714979753', '$2a$12$fe3kj/qT5XI2AHA1KNW7xec22LQ/JdWPSn406O7hRwc3.87weGqT6', 1, '2026-10-05 06:31:29', 32, '2010-06-07 00:00:00', 'Isipathana College', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('30137887', 'Ranida', 'Wijesinghe', 'kasundtl@gmail.com', '0777334126', '$2a$12$6IavcfWoL9HMyLT3sg8b/OxXQxK0xTikzsXcnbXXnfNy05IIP6x7i', 1, '2026-10-05 04:02:25', 31, '2010-05-30 00:00:00', 'Central College Piliyandala', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('31075988', 'Chamodaya', 'Lakshan', 'chamodayalakshan746@gmail.com', '0774451208', '$2a$12$U36hdNTTsSSd0xqDIVlwt.JB80B.wtTZGzwijXFwSPyoTnr/zWUEG', 1, '2026-10-04 06:54:31', 32, '2010-10-23 00:00:00', 'Royal institue', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('31602636', 'sadew', 'Hansaka', 'dia90wanniarachchi@gmail.com', '0776645432', '$2a$12$BBdcSV1.ru3tL3Sk2bEOt.MR41vMMWpR2.Nmn9Pbvi9xS.2l4M5XC', 1, '2026-10-09 13:21:49', 32, '2011-03-16 00:00:00', 'Leeds International school ', 46437310, NULL, '', 0);
INSERT INTO `students` VALUES ('32416225', 'Shan', 'Sethumina', 'ssethumina2011@gmail.com', '0770229056', '$2a$12$VJZk6kGh52XxHBxnkBHxIuW./FtENeIAGKSPaTWDka/Q4Prinp0EO', 1, '2026-10-04 06:24:36', 3, '2011-11-19 00:00:00', 'President\'s collage Maharagama ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('33357252', 'Adeesha ', 'Sadew', 'sumudu4484@gmail.com', '0776708704', '$2a$12$WwfoYC1De0eNdTzA3KtbW.bvqhU5ri0kYCrq3rCBN3EF0DHJmGJM.', 1, '2026-10-04 09:53:37', 32, '2011-01-15 00:00:00', 'Central College - Piliyandala ', 17918718, NULL, '', 0);
INSERT INTO `students` VALUES ('33427249', 'Kananke Liyanage Don Jayani Saranga Liyanage', 'Liyanage', 'shanthaliyanage450@gmail.com', '0788047577', '$2a$12$3Eniic8H0Ji3a1OtoYMErO9b18s4Irur6tIHIXBcNTqgWzCslnpAW', 1, '2026-10-05 15:24:30', 31, '2010-10-15 00:00:00', 'Samudra Devi Balika Vidyalaya', 48440159, NULL, '', 0);
INSERT INTO `students` VALUES ('34322056', 'Ruvidu ', 'Methsara', 'ruvidumethsara@gmail.com', '0702925999', '$2a$12$Gw9poYzNH3GpL1m7C.vEA.BlaqZ5iFlYXCsxjZxzrbFRH3v96UiP2', 1, '2026-10-05 14:15:28', 31, '2010-07-23 00:00:00', 'Thurstan college', 23315168, NULL, '', 0);
INSERT INTO `students` VALUES ('34560913', 'Thisewni ', 'Sehansa', 'amilawasana@gmail.com', '0712310175', '$2a$12$NNlsF.ECmUUXFNX/CVyilOSgAQMZlPlilGsJB66G/aBRxbE1ZJuUO', 1, '2026-10-04 14:26:18', 32, '2010-11-01 00:00:00', 'Co/Vidyakara Balika Vidyalaya ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('34586327', 'Gagana', 'Tennakone ', 'tennakone80@hotmail.com', '0712499267', '$2a$12$Eofkp0uKcObVR2cLx8LkuuhYHjEszGn6rrLd3TNR9qwS/HhPnbmPC', 1, '2026-10-11 13:23:46', 32, '2011-01-07 00:00:00', 'Centre college piliyandala ', 16558092, NULL, '', 0);
INSERT INTO `students` VALUES ('34954445', 'Thinumi', 'Methumya', 'sujithhewage95@gmail.com', '0718835700', '$2a$12$w8UfQ8rxfwidHXBUs3vSneOGxlnFK8GnpMcXNkq550NsrxufDs056', 1, '2026-10-04 06:23:17', 32, '2010-03-20 00:00:00', 'Kottawa Dharmapala Maha Vidyalaya', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('35064616', 'Darani ', 'De Zoysa', 'daranidezoysa@gmail.com', '0773666963', '$2a$12$w.4QKkPItO0ccvigT6m0yOq8VfNCvMCdi1F9tQBhd62/X3pQc3E/K', 1, '2026-10-05 12:33:38', 31, '2010-07-01 00:00:00', 'St.Paul\'s Girls\' School ', 64198866, NULL, '', 0);
INSERT INTO `students` VALUES ('35690293', 'Dinuth ', 'Jayasinghe', 'jennydinuthsenila12345@gmail.com', '0760532274', '$2a$12$y1VTQ48VqIgVwxwI5lWHzuI3RxmO0Gz0WtTV0cnCjXMAYkCcMR5Ku', 1, '2026-10-07 10:46:43', 2, '2009-06-26 00:00:00', 'Ananda College Colombo 10', 78743359, NULL, '200917802800', 0);
INSERT INTO `students` VALUES ('36271485', 'Induwara', 'Thilakarathne ', 'induwarathilakarathne2010@gmail.com', '0769044253', '$2a$12$lbS53nS7M4XTF.jlQoRx/eikjSzTcKV3.znWHcr7nV.iZk1psal.W', 1, '2026-10-05 18:02:17', 31, '2010-07-22 00:00:00', 'Mahindra Rajapaksha College ', 73907362, NULL, '', 0);
INSERT INTO `students` VALUES ('36810197', 'Gagani Dewmini', 'Dharmabandhu', 'navindugagani2015@gmail.com', '0729298389', '$2a$12$V73WorBSMsk5jG4F/KfvvuXDMjJtyrUr2oTeiKY4qxe7Uc/wYQWAi', 1, '2026-10-09 17:05:09', 32, '2010-05-11 00:00:00', 'Guidance International School', 84704824, NULL, '', 0);
INSERT INTO `students` VALUES ('37021078', 'Nisal', 'Udithma', 'nisalnisal613@gmail.com', '0771247532', '$2a$12$o3CE.Kb/Oc/NLw.tNDBKV.kQ6Lt9sp1k./5TxSoZcweUqqoRb8E1a', 1, '2026-10-05 00:35:52', 35, '2010-03-22 00:00:00', 'MR/Godapitiya National School ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('37210953', 'Oshadhi ', 'Fernando', 'oshadifernando2006@gmail.com', '0778954173', '$2a$12$CKOxb1etxmY4Knc0AcfBoeU0ZagywEwMR7HzWayFD447b7Lh2WIma', 1, '2026-10-06 08:22:51', 2, '2006-10-30 00:00:00', 'St.John\'s National College, Panadura. ', 52594794, NULL, '200680401894', 0);
INSERT INTO `students` VALUES ('37935671', 'Risala', 'Jenith', 'risalajenith6@gmail.com', '0756383251', '$2a$12$ysoZmQrrhsCVbkjuN3gb/OmjVpAYLTQukFGbnqF9nobiSgCPdOsR.', 1, '2026-10-05 14:04:18', 31, '2010-09-02 00:00:00', 'President\'s College Maharagama ', 84830611, NULL, '', 0);
INSERT INTO `students` VALUES ('38343832', 'Navindu', 'Katugampala', 'navindukatugampala@gmail.com', '0703439314', '$2a$12$CJQnqdhPw7oMlslJHHrMBOBv4RQfHK8v1JjnE4RbYbeBSGkcjai5e', 1, '2026-10-04 10:41:08', 3, '2011-11-21 00:00:00', 'DS Senanayake college', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('38673890', 'Hansaka ', 'Nirash', 'inspirepeak6000@gmail.com', '0713243474', '$2a$12$c7/3lqsPitzQ.m0Z8Gec6em5bnid7UKyFk7UgoasckDrhFXqG4XEO', 1, '2026-10-08 16:37:26', 32, '2010-03-10 00:00:00', 'Mahanama college ', 65246391, NULL, '', 0);
INSERT INTO `students` VALUES ('40074015', 'Buddhi', 'Ravihansa', 'buddhihansa@gmail.com', '0788442428', '$2a$12$3RrW2pDJxgKWTz5Ay1gt8O1UIBaXZPO6Fq2KJQT8fVjttt0pg.826', 1, '2026-09-23 00:24:58', 34, '2008-07-10 00:00:00', 'Thurstan College ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('40421640', 'Thisas', 'Mihidinu', 'prabhad021@gmail.com', '0714035622', '$2a$12$.mtwMzwp5wE3u36WmOKuceVSAvsxnXhIwQDQJj7rOeaBNAydahNVG', 1, '2026-10-05 14:35:15', 31, '2010-03-28 00:00:00', 'President\'s college maharagama ', 21845094, NULL, '', 0);
INSERT INTO `students` VALUES ('40638177', 'Lithumi', 'Perera', 'pereraniranjala77@gmail.com', '0771159076', '$2a$12$WPosyaLnb0Q56PE65NL6pe.sbIgBSsVKnlx6kDHBG6IyJayGcyEQO', 1, '2026-10-04 06:07:27', 32, '2010-02-02 00:00:00', 'Anula Vidyalaya Nugegoda ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('41621251', 'Heshan', 'Bandara', 'bandara@gmail.com', '0701826879', '$2a$12$DBLaKN36Jw5FUKeJN.RdK.xJG17FHTeWkc9dWyugVftBYv4zqi9OG', 1, '2026-10-05 14:16:58', 31, '2026-10-05 00:00:00', 'St. John College - Nugegoda Colombo', 57084478, NULL, '', 0);
INSERT INTO `students` VALUES ('41996164', 'Vinuth ', 'Ulugalathenna', 'vgithmal@proton.me', '0765968995', '$2a$12$zub4lnPdMAkxW5HSiLWIIOTk3JHcAmkqoD1d0OKFnIUkHGDLYf.72', 1, '2026-10-13 14:59:37', 2, '2009-04-28 00:00:00', 'Mahinda Rajapaksha College Homagama', 85859083, NULL, '200911904622', 0);
INSERT INTO `students` VALUES ('42605100', 'Thulina ', 'Theekshana ', 'lasantharanasinha99@gmail.com', '0715949243', '$2a$12$Zg.D7AZ89Qiz8X4mug63xO4NfbexXeNP6bnJUeVmsYpVx7yIlOFrG', 1, '2026-10-05 12:24:28', 32, '2010-10-05 00:00:00', 'Royal College ', 62941451, NULL, '', 0);
INSERT INTO `students` VALUES ('43164195', 'Hansani', 'Bandara', 'unbandara83@gmail.com', '0717961177', '$2a$12$1M5G4fMjce7ffvEsBjezeuWqJyZqoBIbtykqpoWgpowTeyPZ01ECS', 1, '2026-10-05 12:57:00', 31, '2010-08-06 00:00:00', 'Homagama central collage', 41666874, NULL, '', 0);
INSERT INTO `students` VALUES ('45248941', 'Akinsa ', 'Ranthuli', 'ranthuliakinsa8@gmail.com', '0764462748', '$2a$12$RPQgTSYuikOpZrq2suI3tue4oUJ9YDT9EQ.Rg0gkVD1/h.KerDWuW', 1, '2026-10-04 09:39:09', 31, '2010-12-29 00:00:00', 'Samudradevi Balika Vidyalaya ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('45251977', 'WANNI', 'WASANTHI', 'nethmikatheshan75@gmail.com', '0711119772', '$2a$12$hWOWYbPSItz1tTBEIa9cteSSy50qWuWhSh06LyEy1Z/WKhGmp1LHG', 1, '2026-10-05 07:06:54', 32, '2010-01-05 00:00:00', 'Isispathana College, Colombo 05.', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('45512699', 'Sanduni ', 'Perera', 'sanduniperera399@gmail.com', '0722530373', '$2a$12$sA5QA/hxO0mHsDdBhHyU6uTg4UUl2eu7k.wgex6G8VtmeVYKnH7Sy', 1, '2026-10-04 05:26:50', 3, '2012-01-01 00:00:00', 'Anula Vidyalaya, Nugegoda', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('45577478', 'Ashan', 'Munasingha', 'nextlevelictinfo@gmail.com', '0784800385', '$2a$12$/dTlfGXk8LU9xK/.yUMH0.BMpWX2PURN3YwaN.WTneC18p.0FC6si', 1, '2026-09-23 00:08:01', 2, '2009-10-01 00:00:00', 'Isispathana College, Colombo 05.', 17910902, NULL, NULL, 0);
INSERT INTO `students` VALUES ('45596859', 'Vithula ', 'Perera', 'vith.pera@gmail.com', '0777309430', '$2a$12$DQhLCQHY2ns/hq2Fdb1LouLYEkdRrzfITt6U1GOaPWtweofRAGrb6', 1, '2026-10-05 13:47:36', 31, '2010-11-22 00:00:00', 'Royal College', 83346643, NULL, '', 0);
INSERT INTO `students` VALUES ('46400174', 'Nethini', 'Ashinsana', 'xiaozhan.ashinsana@gmail.com', '0783225410', '$2a$12$dHNewev29WIBop9vvcb7y.Nq7MGc8dhiVVA9QDfU7G2Ga9BjfYGBy', 1, '2026-10-06 11:51:35', 2, '2009-11-17 00:00:00', 'Dehiattakandiya National School', 26434722, NULL, '200982202915', 0);
INSERT INTO `students` VALUES ('46632614', 'Naveen ', 'Maduranga ', 'naveenhomemadu@gmail.com', '0760364183', '$2a$12$v27YBaF0TnxrhJRUnHXKO.QXtolrMHmcjICEeLZPGnh1Nedcgamra', 1, '2026-10-06 14:59:10', 3, '2011-09-23 00:00:00', 'Co/Dharmaraja Maha Vidyalaya laya ', 48831679, NULL, '', 0);
INSERT INTO `students` VALUES ('47294242', 'Kavini ', 'Bimdika ', 'ayomagunathilake211@gmail.com', '0771915728', '$2a$12$I0y8PYQZ9C89Crs.1bbyROVT/JqZ0kNSFQbHOHBbQ2lWMlMNdw/7u', 1, '2026-10-04 08:11:29', 3, '2011-08-31 00:00:00', 'Princess of Wales college ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('47341637', 'Binara ', 'Wimalarathna ', 'binarawimalarathna073@gmail.com', '0741153890', '$2a$12$3GRRQgkN6MTIkYdtVDf5..MKXsic2hAMYCnfVxMAviL9lNH0309ui', 1, '2026-10-05 13:54:39', 31, '2010-05-11 00:00:00', ' Dharmapala College Pannipitya ', 52404345, NULL, '', 0);
INSERT INTO `students` VALUES ('47580282', 'Tharushika ', 'Samindi', 'batuwitanayakapiyasiri@gmail.com', '0771849335', '$2a$12$UN0qgtxrKS0N5p5IxF/fJOprvAOaj55v.F7CXmfQLYOTjyEHZBz3q', 1, '2026-10-12 18:43:11', 32, '2010-08-14 00:00:00', 'Vidyakara Balika Vidyalaya ', 78712039, NULL, '', 0);
INSERT INTO `students` VALUES ('47937205', 'Adeesha', 'Nimeth', 'dilumv9@gmail.com', '0774009297', '$2a$12$7smoiLdBk63zJNpgd5FRiO6N2mB1Y.nsbKHUKYc/irFQP/DnPg2hW', 1, '2026-10-04 06:12:23', 32, '2010-11-25 00:00:00', 'Piliyandala Central College', 17918198, NULL, '', 0);
INSERT INTO `students` VALUES ('48237672', 'Mishayel ', 'Perera', 'maushperera@gmail.com', '0754774888', '$2a$12$7.dEBcZhZLmvbuSEBEEzn.71WAiCmzP.jh4vgjPLOS/MHFH/vTHcm', 1, '2026-10-09 10:06:23', 32, '2010-09-21 00:00:00', 'Wesley College Colombo 09 ', 34435065, NULL, '', 0);
INSERT INTO `students` VALUES ('48626634', 'Manula', 'Pansilu', 'manoharithilakarathna1@gmail.com', '0752175678', '$2a$12$mVU9.1J2NsVPMYpgTD.leebGBuuHAShQNucd0Zt/xXKsSVN2gm4.G', 1, '2026-10-10 14:48:04', 3, '2011-09-17 00:00:00', 'Ananda College Colombo 10', 89925955, NULL, '', 0);
INSERT INTO `students` VALUES ('48829767', 'Rashmi', 'Yashodha', 'yashodhaweliwaththage@gmail.com', '0716218104', '$2a$12$LS9xlzzE482m18EHl5/vqecD7P7Dkc05.McAUPSRsa5aRTasSj1p.', 1, '2026-10-05 10:13:41', 31, '2010-09-23 00:00:00', 'Sujatha vidyalaya', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('48981677', 'Nithija ', 'Sathvina ', 'nithijasathvina504@gmail.com', '0705652961', '$2a$12$M2qyE8kntt95s.GhhI7Kz.BcI2z9J0ibJYMxkSI3BU7oi7W9SkeDm', 1, '2026-09-24 02:09:49', 34, '2008-02-28 00:00:00', 'Sir Jon Kothalawala m.v', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('49184983', 'Senarie ', 'Minthuli', 'senarieminthuli@gmail.com', '0776278552', '$2a$12$TF.vSM5vClhB9SbRF7SUWO1Wzti.y8aoW7wz6SNJfu1KNhEyX2b6e', 1, '2026-10-06 17:18:52', 2, '2009-08-28 00:00:00', 'St. Joseph\'s girls\' school', 87719630, NULL, '200974103318', 0);
INSERT INTO `students` VALUES ('50574760', 'Duasha', 'Kulasekara', 'duashakulasekara@gmail.com', '0789788874', '$2a$12$ealKVyEdj0wHlqwQpU4pd.Vk9WL80/9o7U2g/8RnbfLrX/fe9xWca', 1, '2026-10-04 07:59:35', 2, '2009-06-11 00:00:00', 'Sirimavo Bandaranaike Vidyalaya Colombo 7 ', NULL, NULL, '200966302245', 0);
INSERT INTO `students` VALUES ('51352066', 'Temith', 'Nadishka', 'nadishkaperera10@gmail.com', '0714035541', '$2a$12$BiMuIObplbjVhDm4G.yBS.Yy5zyEBgitbFt5H1BDMIC2jLGrIxH5u', 1, '2026-10-04 07:23:48', 32, '2010-10-06 00:00:00', 'Mahinda Rajapaksha College', 17910988, NULL, '', 0);
INSERT INTO `students` VALUES ('51675638', 'Dewli', 'Apoorwa ', 'dewliapoorwa09@gmail.com', '0785869094', '$2a$12$TQobaCIvONfGXLokfPYUnudsz9bmN0bfOsbrl64QJlaMrmgYnWvFS', 1, '2026-10-04 06:41:46', 2, '2009-12-22 00:00:00', 'Sirimavo Bandaranaike Vidyalaya', NULL, NULL, '200985702100', 0);
INSERT INTO `students` VALUES ('52143746', 'Nethmika', 'Randira', 'reperera.perera6@gmail.com', '0706444197', '$2a$12$cIkS0FfytHlinAOdQX7L8OQs8TEG1OiMva1YqRE.Zew/C4TrD391q', 1, '2026-10-05 13:57:18', 31, '2010-03-27 00:00:00', 'Mahinda Rajapaksha college - Homagama ', 43293496, NULL, '', 0);
INSERT INTO `students` VALUES ('52248310', 'Kusal ', 'Dulsara', 'amilaharshani162@gmail.com', '0769192609', '$2a$12$Bc0mSoJ3o3jdi9wIMU6E.ec.f4q/mLUEJDs1BSDJUyF6GhgbQ5YZi', 1, '2026-10-09 13:33:51', 3, '2011-02-15 00:00:00', 'president\'s college Maharagama ', 20904174, NULL, '', 0);
INSERT INTO `students` VALUES ('53418258', 'venuri', 'vihara', 'mallikamadhumali9@gmeil.com', '0782693056', '$2a$12$Bf8wZfAR9l2I/w05inMqfuzT4I0zg0Lin6GfpdttiJylJfFyuJcbK', 1, '2026-10-11 03:13:05', 32, '2010-10-27 00:00:00', 'mandaduwa m.v', 56334284, NULL, '', 0);
INSERT INTO `students` VALUES ('53912598', 'Kapila', 'Bandara', 'kapilabandara@gmail.com', '0701826867', '$2a$12$t3buFrv9OtIi0EcWtlonIOdDRpNiNrsbj1e3YWGHa3hjC22IWxOGm', 1, '2026-10-05 10:03:39', 31, '2026-10-05 00:00:00', 'St. John College - Nugegoda Colombo', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('53937287', 'Methmi', 'Kavithma ', 'hemanthianurudhdhika@gmail.com', '0718697202', '$2a$12$0tNTRTwL0tME/4mk3g4st.4C42y52ZQZoOo1eLiif4z8TQ3pibj62', 1, '2026-10-05 15:10:38', 31, '2010-11-24 00:00:00', 'Central college piliyandala ', 33611104, NULL, '', 0);
INSERT INTO `students` VALUES ('54150148', 'Shaheli', 'Nimsara', 'shaheli.nimsara1029@gmail.com', '0775622618', '$2a$12$X.r2pw4I5kH0mY1tP7Par.Pkry4vwG5HIt/Veo4MUqFvf9BGGG48e', 1, '2026-10-05 11:40:48', 32, '2010-02-09 00:00:00', 'Mahinda Rajapaksha College ', 85638220, NULL, '', 0);
INSERT INTO `students` VALUES ('54404418', 'Methmi', 'Pramodya', 'gayaniishara1992@gmail.com', '0719552733', '$2a$12$fS.fAr4Mju.MoNY09L777OynvkXvCeajKfUzZXGTKGg5gVEwhcOJS', 1, '2026-10-05 06:30:23', 31, '2010-11-27 00:00:00', 'Homagama central college ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('54573228', 'Bodini', 'Muthukumarana', 'muthukumaranasaminda@gmail.com', '0776286545', '$2a$12$f8ODZ6Dym542snIisf3h3OJGW/n6kA.VzDbIZ5PD/xEUbplfZxFoa', 1, '2026-10-12 14:51:32', 32, '2010-06-28 00:00:00', 'Samudradevi Balika Vidyalaya', 25649536, NULL, '', 0);
INSERT INTO `students` VALUES ('54817062', 'Tharul', 'Edirisinghe', 'shereenjagoda1@gmail.com', '0777588205', '$2a$12$HHkHdv3U7U.lLou5ZpY6s.j5XJ4wmsLi7DEPApt4FO/mXHqCHGvOC', 1, '2026-10-05 14:56:56', 31, '2010-10-01 00:00:00', 'President College Maharagama', 22832992, NULL, '', 0);
INSERT INTO `students` VALUES ('54994107', 'Akila', 'Induwera', 'akilainduwera3600@gmail.com', '0728505757', '$2a$12$4YULrDJ/kv506wLZZsFGhe82zabc9aXMBxACP2vZKV9vObdjqXfMa', 1, '2026-09-24 02:04:14', 1, '2008-11-09 00:00:00', 'Ananda college ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('55041909', 'Senidu ', 'Dinsara', 'senidudinsara2010@gmail.com', '0770283827', '$2a$12$2JWSB5LB3dlDI47/JsA9oupXFjbUhvlDV6wv3iEiBMLrE8aEd0zim', 1, '2026-10-05 15:16:30', 31, '2010-04-13 00:00:00', 'Ashoka College Horana', 14404185, NULL, '', 0);
INSERT INTO `students` VALUES ('55391371', 'Tathila', 'Senhas', 'tathilasenhas684@gmail.com', '0761953945', '$2a$12$aSwa5flGjA6MjUtwpQG/gerToQf..nqdfLf9IV/TkShgziovk.id6', 1, '2026-09-23 00:21:18', 1, '2008-11-21 00:00:00', 'Thurstan college', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('56095853', 'Shweth', 'Abeysekara ', 'abeysekararaveesh@gmail.com', '0760244377', '$2a$12$qVRFt4mkjUPrzmcbSvJ3l.uLyprrG5g432ryp6fg6YG2x41JQfkZa', 1, '2026-10-05 15:37:35', 3, '2011-07-03 00:00:00', 'Mahinda rajapaksha college ', 48966227, NULL, '', 0);
INSERT INTO `students` VALUES ('56352174', 'Methaya', 'Sathsarani', 'lokuhewagenadeeka89@gmail.com', '0717479697', '$2a$12$0O.YX1V7bnsl/x5hg.EraeKEILoviO3tWhYfK7eFWrqVrQb5DUmOC', 1, '2026-10-04 07:28:17', 3, '2011-10-28 00:00:00', 'Sri Chandarathna Manawasingha Vidyalaya', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('56808678', 'Nehansa ', 'Mendis ', 'oshi.nehansa128@gmail.com', '0710624273', '$2a$12$p0uFFUJ0t6KTCP3uVLjDA.psPd0FsNLY0ljVlSt589sGeokyul9jG', 1, '2026-10-04 06:27:44', 35, '2011-01-28 00:00:00', 'Visakha Vidyalaya Colombo 5', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('57004598', 'Sageeth', 'Induwara', 'yashodadail@gamil.com', '0766770927', '$2a$12$ImH0MqLMONnskM60Umu.i.hBhtHL/KJcBGydiTLombyDpSETjjt7G', 1, '2026-10-05 14:12:07', 31, '2010-10-25 00:00:00', 'Mahanama college', 10268396, NULL, '', 0);
INSERT INTO `students` VALUES ('57298892', 'Kavishna ', 'Munasingha', 'kmunasingha99@gmail.com', '0761338551', '$2a$12$vRcXUdRWfZX5ottdVATfUuz8zZAcgNywqUMgq12vyHHAsnqPVHC7W', 1, '2026-09-22 06:26:04', 3, '2011-10-01 00:00:00', 'Isipathana College, Colombo 05.', 17910904, NULL, NULL, 0);
INSERT INTO `students` VALUES ('57352957', 'Shalomi', 'Geethika', 'shalomishalomi600@gmail.com', '0759891288', '$2a$12$NV0JB9wwjjcJUJQprwxSUu.K3FQ7iGN59WXZh.C.EMMFJBowEPbSe', 1, '2026-10-05 15:09:39', 31, '2010-06-21 00:00:00', 'Vidyakara balika vidyalaya', 19541313, NULL, '', 0);
INSERT INTO `students` VALUES ('57630646', 'Rushentha', 'Rashmika', 'rashmikarushentha@gmail.com', '0741542098', '$2a$12$xWwtXa6eE3OzuXPx70Z3mOc0Gp5b8jfiZZYJShFW3f7jpGmGLSpTq', 1, '2026-10-05 11:56:22', 32, '2010-11-05 00:00:00', 'D.S.Senanayake College', 97665667, NULL, '', 0);
INSERT INTO `students` VALUES ('57679027', 'Chanulya ', 'Thathsara ', 'chanulyathathsara91@gmail.com', '0752728590', '$2a$12$kCGy3Q5LwektPl0mD9OEnusuFtGB3mcjLN54dNDH/A1OP7WwksHP6', 1, '2026-10-04 12:47:19', 3, '2012-01-02 00:00:00', 'Homagama Central College ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('57923586', 'Vihanga', 'Nethum', 'erandi5939@gmail.com', '0772213091', '$2a$12$nqSLa7w8pONeskOC3wl8k.mNTWtPRnbNZP1eKmudem0DrbvQxz8Be', 1, '2026-10-05 13:46:32', 31, '2010-11-22 00:00:00', 'Prince Of Wales College', 23742739, NULL, '', 0);
INSERT INTO `students` VALUES ('58219985', 'Tharindu', 'Lakshan', 'Lakshanolaboduwa@gimail.com', '0702236688', '$2a$12$wo6V4cQBhFh8yc1M4u8T2.Af99w455QtxbO622MJVBMUvdVLfUTwa', 1, '2026-09-24 02:13:57', 34, '2008-02-27 00:00:00', 'Isipathana college ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('58770339', 'Sinura', 'Perera', 'slakdisa@gmail.com', '0702734427', '$2a$12$ntn4Zwlqwm3oHFJzvCNGoO9.GaNzAFCqqOqxfV6RiK2yZrPc4ubhe', 1, '2026-10-05 06:13:47', 32, '2010-06-08 00:00:00', 'St.John\'s college ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('58795636', 'Tharun', 'Sandeepa', 'tharunsandeepa10@gmail.com', '0717179350', '$2a$12$xytoAyQz6obkJM76p1q6WO26DILPrhzLfzNzQ4o6rG5UY6tV5eQQa', 1, '2026-09-25 14:03:09', 32, '2010-05-14 00:00:00', 'Ananda College Colombo', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('59018528', 'Pemith', 'Alwis', 'pemithalwis@gmail.com', '0762177313', '$2a$12$5LGntIEA/RgHr2X8k1nj4.AyFxPRax90xV09EZng1147BFUw/OzIK', 1, '2026-09-23 00:20:39', 1, '2008-02-24 00:00:00', 'Ananda college ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('59494997', 'Kirillawala Acharige Nethumi Nihinsa', 'Senadheera', 'irusha_82@yahoo.com', '0776084406', '$2a$12$RUTR3bqS1.vINVazQGvJ7u95VsJFrMLLqrRJRs1Y0glWpC6IIlq2i', 1, '2026-10-04 06:12:04', 3, '2011-05-18 00:00:00', 'DS Senanayake central college Mirigama', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('60034929', 'Isala', 'Uwaneka Silva', 'newsrifurniture@gmail.com', '0762156354', '$2a$12$I2sXGplRmCfaSgVKYDxHk.zPTLkwdonDe7oc4rgVedNjdq.ga6iDe', 1, '2026-10-04 13:53:34', 32, '2011-01-05 00:00:00', 'Thurstan College', 17911223, NULL, '', 0);
INSERT INTO `students` VALUES ('60246189', 'Jenul', 'Christian ', 'jenulchristian93@gmail.com', '0705969699', '$2a$12$bgjzva8Foy8P3nmHUVQTVe7YqsCAPWURyXoLkmNI9mwzkjuLQyg3.', 1, '2026-10-04 06:52:00', 32, '2010-06-11 00:00:00', 'St.Peter\'s College ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('60299677', 'sadew', 'hansaka', 'sadewhnsk@gmail.com', '0112614333', '$2a$12$JEIaYtcyiiqNV4LDFxeCje0.Vsb/OE3B5TJLIU/MDjjKuBwzvc1oq', 1, '2026-10-10 11:01:17', 32, '2011-03-16 00:00:00', 'leeds', 11918340, NULL, '', 0);
INSERT INTO `students` VALUES ('60807645', 'Thenuki ', 'Sehansa ', 'ThenukiSehansa73@gmail.com', '0713331163', '$2a$12$woIG0wIirvY/cfarDrQBcufosWPgPkaP32dOWKyzhzkhk0Aimo/D6', 1, '2026-10-06 04:22:17', 31, '2010-05-13 00:00:00', 'Princess of wales college ', 75533922, NULL, '', 0);
INSERT INTO `students` VALUES ('61335552', 'Thevindu', 'Nadeeja', 'thevindunadeeja289@gmail.com', '0762359546', '$2a$12$1cnwORz8k3xIFGEm52styOF1cxrROoDIBWdGcWHpM3PQVlCCOX6L2', 0, '2026-10-05 05:32:16', 32, '2010-06-23 00:00:00', 'Piliyandala Central College', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('61902162', 'Dinali', 'Sasandi', 'samarakondharshani@gmail.com', '0775593763', '$2a$12$LrqX3LdiS.1Rmb9NYrJPLuYv2aZhhqx6d93hwF3r3kgXr4s4v7cJK', 1, '2026-10-08 17:45:56', 32, '2010-03-01 00:00:00', 'Anula Vidyalaya Nugegoda ', 63698731, NULL, '', 0);
INSERT INTO `students` VALUES ('62057834', 'Senuth', 'Nishayal', 'senuthnishayal000@gmail.com', '0715555566', '$2a$12$n8GojxHJIwlhmJq8ZiT/C.c20DRIEW84N0EGqZiuL93e..jKFmVf2', 1, '2026-10-04 06:02:44', 3, '2011-05-21 00:00:00', 'President’s college maharagama', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('62442021', 'Avani', 'Shashiprabha', 'shashiiineth@gmail.com', '0782519474', '$2a$12$S5YdmNon7GlDVW5fPrRBS.SRGV2AmH82T3xvyg9ZlgByH0k4OOhme', 1, '2026-10-06 00:50:50', 32, '2010-03-08 00:00:00', 'Visakha Vidyalaya', 90146101, NULL, '', 0);
INSERT INTO `students` VALUES ('62497949', 'Thinuga ', 'Rithnuka', 'lgamage872@gmail.com', '0702402644', '$2a$12$id7ipkC1t865Lzf.iJ9gSeCOQBNcLA89lmo/D4naEmYUeu5J9sZc2', 1, '2026-10-09 10:13:21', 3, '2011-04-23 00:00:00', 'Royal College, Colombo 07', 23350677, NULL, '', 0);
INSERT INTO `students` VALUES ('62662719', 'Mandinu', 'Muthukumarana', 'mandinu88@gmail.com', '071 803 97', '$2a$12$7ryJpIhOjBp9ZIptdwUjqupEXxnTYwtJu1xmvc7JR/bA.Gizih0EW', 1, '2026-10-11 10:37:17', 3, '2011-08-08 00:00:00', 'Mahinda Rajapaksha College', 83484991, NULL, '', 0);
INSERT INTO `students` VALUES ('63096907', 'Duhara', 'Rodrigo', 'duhara2009@gmail.com', '0712983983', '$2a$12$7Sxb9u8yGuA145qv5gyV9.jKJoVob0umu2NKYQCkXD/uAH8KkW3j2', 1, '2026-10-06 13:06:41', 2, '2009-10-31 00:00:00', 'Holy Family Convent Wennappuwa ', 37042929, NULL, '200980502840', 0);
INSERT INTO `students` VALUES ('63161430', 'Vishara', 'Vidumini', 'visharavidumini@gmail.com', '0773035856', '$2a$12$oMZzDLicWfalHilHud8n/.GIue8tgi52T0zyKP71O.jmiQWWOAd9m', 1, '2026-10-11 07:46:29', 3, '2012-01-23 00:00:00', 'Central College -Piliyandala', 78222010, NULL, '', 0);
INSERT INTO `students` VALUES ('63263513', 'Methni', 'Thennakoon', 'saraththennakoon81@gmail.com', '0772655214', '$2a$12$kZ1PZ8lJ4opwIAHahgyd1ui/Drb78VE4h0zJg91SPhR/Zo1jsDVu2', 1, '2026-10-04 16:52:24', 3, '2011-05-11 00:00:00', 'Vidyakara girls school', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('63288413', 'Manuth Methmika ', 'Jayawardhana ', 'mylifeducationsanuth@gmail.com', '0762578873', '$2a$12$NIVf9sxcfglhMH0ql.D.remDKM03IBHX9SBSzo3eCeVo2Rvxf5ery', 1, '2026-10-11 04:11:50', 32, '2010-07-25 00:00:00', 'Piliyandala central college ', 70605808, NULL, '', 0);
INSERT INTO `students` VALUES ('63299317', 'Tharul', 'Edirisinghe', 'tharuledirisinghe1@gmail.com', '0762668560', '$2a$12$YqeVs8iHkEfktIhZvgB4TegUqXQ6Yh6I2nkoPhsmQQPcnaBxqutRG', 1, '2026-10-05 15:25:18', 31, '2010-10-01 00:00:00', 'Presidant collage, Maharagama', 71137516, NULL, '', 0);
INSERT INTO `students` VALUES ('63875948', 'Hirantha', 'Heshan', 'hirantha@gamil.com', '0740447508', '$2a$12$aCRpoP6UzsOfidvibUONz.RDISAjouKZ3/W52eovV9jKvLJ6iqYWu', 1, '2026-09-21 13:23:04', 2, '2006-02-21 00:00:00', 'S.C.M.V', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('64176698', 'Darani', 'De zoysa', 'daranidezoysa8@gmail.com', '0774326885', '$2a$12$1Vba12.To6bjqZSNgDpTl.PulgEUSimFrEK5R/3oz4hIxkGFKlYw.', 1, '2026-10-04 06:20:10', 32, '2010-07-01 00:00:00', 'St.Paul\'s Girls\' School Milagiriya', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('64387383', 'Thevindu', 'Nadeeja', 'Itzzzthevindu@gmail.com', '0715611079', '$2a$12$I/KWUWNcFiLbjD2/q/k.V.RJRGIG8rIY.4iZeCxYYUnCaIenNH/eK', 0, '2026-10-05 05:51:18', 32, '2010-06-23 00:00:00', 'Piliyandala Central College', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('64541083', 'Dulani', 'Denethma', 'jananilankika47@gmail.com', '0740698320', '$2a$12$sQG7JLNN1WPTd8//NsvfbeZLUo9RXCiDDHh.9OaIq5xQ.Jw0jrgne', 1, '2026-10-06 09:28:48', 3, '2011-11-07 00:00:00', 'Homagama Mahinda Rajapaksha College', 37949802, NULL, '', 0);
INSERT INTO `students` VALUES ('64599395', 'Navithu', 'Lawanitha', 'lawanithanavithu@gmail.com', '0715724496', '$2a$12$LNugFDU9Qzw8DiDCfJbfG.rDh7ieYka1VIEJbm..IRHkCArkahqiu', 1, '2026-10-05 07:46:10', 31, '2010-12-01 00:00:00', 'President\'s College Mahargama', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('64989358', 'K.Thilini Wasana', 'K.T.Wasana', 'tw7625383@gmail.com', '0772042294', '$2a$12$mPra6zoizPA72nZxS1sB7uMvrtp0.qyiQ6QVvp39kE7spCJP/VUKS', 1, '2026-10-04 06:15:31', 3, '2012-01-22 00:00:00', 'R/Haththella.v', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('65531710', 'Senali', 'Denethma ', 'jayanisilwa1983@gmail.com', '0773627005', '$2a$12$SV5a/iUsvRfOhUOIPMiSYOHd6/T3nUie5uJXdrL8XhhyS6bebBUPW', 1, '2026-10-04 06:22:06', 3, '2012-01-26 00:00:00', 'Dharmasena  Attygalle Balika vidyalaya', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('65598554', 'Pathum ', 'Lakmal', 'chamara7626@gmail.com', '0772977836', '$2a$12$p31s3.Q3Qm5B8czm.WQtcuP.Gl50aqONfX44VKaem.RwmyZedY9C.', 1, '2026-10-04 09:05:55', 32, '2010-02-04 00:00:00', 'Thurstan College Colombo 07', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('65804211', 'Pamudu', 'Archana', 'pamuduarchana632@gmail.com', '0775297304', '$2a$12$ALdQDByeI9yGoQYJ1ypM3.57nNc0MYZiHEj8WSV0ncs6LZ4GB2ByS', 1, '2026-10-04 06:30:39', 2, '2009-11-08 00:00:00', 'Nalanda College Colombo ', NULL, NULL, '200931301440', 0);
INSERT INTO `students` VALUES ('65970966', 'Ralindi ', 'Sasenya ', 'sriyanireta@gmail.com', '0716777245', '$2a$12$zeBEyYMtDY1Dbs5YqhEQSe0Hjfl9X3NYsGT8AzGkQxZUFBLcOWvWy', 1, '2026-10-08 16:01:15', 3, '2011-09-27 00:00:00', 'Piliyandala Central college ', 49031210, NULL, '', 0);
INSERT INTO `students` VALUES ('66008064', 'Maneesha ', 'Dharaka ', 'krtlakman1976@gmail.com', '0772428226', '$2a$12$kJ8YgLNqLFGJl/kWRAlr.uSxZi5BlxHFJwicIhyIqZGHInoITn8he', 1, '2026-10-06 16:47:10', 2, '2009-06-12 00:00:00', 'Thurstan college colombo 07 ', 54919267, NULL, '200916402420', 0);
INSERT INTO `students` VALUES ('66385350', 'Emandi', 'Peiris ', 'esandigihara55@gmail.com', '0759490791', '$2a$12$cACyuxlz/QWILHqfyQyciOHrOvT37OH1k/HDNvGpcKa2CGySFBysm', 1, '2026-10-04 10:20:30', 2, '2009-12-16 00:00:00', 'Sirimavo Bandaranayake Vidyalaya ', NULL, NULL, '200985102280', 0);
INSERT INTO `students` VALUES ('67449663', 'Manindu', 'Pabasara', 'manindu.515notmage@gmail.com', '0723870420', '$2a$12$XVWEIRzYFHc06nRD3f0PEexd.tVtl/AF4agrVCpvvCosFiw5w7SJa', 1, '2026-10-04 06:35:14', 3, '2011-08-02 00:00:00', 'Mahinda Rajapaksha  college', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('67965815', 'sanithu', 'yuthnal', 'syuthnal2@gmail.com', '0781918477', '$2a$12$Dzbzd2monz6KEPbJnnp3QekcuZ7NezwMsQIVeLustVNxbBdOOzRDK', 1, '2026-10-05 11:33:21', 32, '2010-12-30 00:00:00', 'DS Senanayake collage', 35446460, NULL, '', 0);
INSERT INTO `students` VALUES ('68217058', 'D. G. HESARA', 'NETHMINI', 'nirashaswarnamali329@gmail.com', '0764986980', '$2a$12$UGZASSLnn8LBmxugPQpLTOA2os7kIc7gg1Pjjf/f2ECQddNGq0jhq', 1, '2026-10-12 15:05:57', 2, '2026-10-12 00:00:00', 'Girls\'High school ', 36572839, NULL, '200978601884 ', 0);
INSERT INTO `students` VALUES ('68658629', 'Muhammad', 'Thameem', 'muhammadthameem987@gmail.com', '0751842469', '$2a$12$lgOQIsKmc3d5a1NqaVQeVeS69jND55nHHIvCOijRkdt3mNR3Tk/x.', 1, '2026-10-05 03:13:11', 31, '2010-08-06 00:00:00', 'St Aloysius college Rathnapura', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('69496275', 'Sasindi', 'Nawodya', 'chandrikashingara@gmail.com', '0742352560', '$2a$12$euHOg8qDE4qORG7e8RoqPeHiEGHrnqPoDyj0bvHr9UyjYVRtbUTkC', 1, '2026-10-12 09:45:07', 3, '2011-08-15 00:00:00', 'Dharmasenw Attigalle Girls School', 12591583, NULL, '', 0);
INSERT INTO `students` VALUES ('69529304', 'omesha', 'ranabahu', 'shashindiomesha@gmail.com', '0762552030', '$2a$12$SKO7CsbmXyH6w75wvln1v.BsumqVNbOUlbboWmCKc/OCeBhlwiqRy', 1, '2026-10-04 12:27:04', 32, '2010-07-09 00:00:00', 'KBV', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('69618390', 'Jayoda', 'Pinidiyage', 'indikapinidiyage33@gmail.com', '0762865122', '$2a$12$2tCuLWToDCDvWqJLa/nlseiIr81NfWuWcvZjpXKxAJ8kHRuHY46R6', 1, '2026-10-12 14:48:43', 32, '2010-03-12 00:00:00', 'Prince of walea college', 10526547, NULL, '', 0);
INSERT INTO `students` VALUES ('69655512', 'Aysha', 'Mariyam', 'ayshamariyam7878@gmail.com', '0788025289', '$2a$12$jjfp8rNVUWyGgrQ7UPkZBuTaIzCuuy2Rc7w/el2nhafG1uJTAxpYe', 1, '2026-10-06 14:18:38', 2, '2009-09-14 00:00:00', 'G/Revatha college ', 57224758, NULL, '200975803930', 0);
INSERT INTO `students` VALUES ('69988958', 'Saruka ', 'Tennakone ', 'tennakone73@hotmail.com', '0778870036', '$2a$12$BBBRdaJzozyzh4zFU1JpB.8/ez9dLwsfCHyJl9/IS7B5QAngYksBS', 1, '2026-10-04 06:54:25', 3, '2011-01-07 00:00:00', 'Piliyandala central college ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('70502108', 'Vinudi ', 'Sihasna', 'thushaniperera66@gmail.com', '0718302447', '$2a$12$.0ZDwUJg8iXp54T9cviyT.GE2vzTZMvuT7kyO7653ojEiGScJqH8y', 1, '2026-10-05 12:04:08', 32, '2010-05-25 00:00:00', 'Samudradevi Balika Vidyalaya', 50170200, NULL, '', 0);
INSERT INTO `students` VALUES ('70804653', 'Risala', 'Jenith', 'wmrisalajenith@gmail.com', '0786965504', '$2a$12$YMz30fQk2bdKx93ficoWAOlhw6Ft9tSITSTGV9M.ZMw.JMlTOdsJK', 1, '2026-10-04 08:11:07', 32, '2010-09-02 00:00:00', 'President\'s College Maharagama ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('71102952', 'Vinuda', 'Herath', 'herathvs19@gmail.com', '0759596952', '$2a$12$9cdUGarmN9uQYHrtc8K2Y.wAPis.J2j1htJi4TgiA0A9QZoG4pSgW', 1, '2026-10-04 15:04:49', 3, '2012-01-19 00:00:00', 'Wesley College', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('71840137', 'Warshitha ', 'Nadith', 'warshithanadith.pp@gmail.com', '0714768232', '$2a$12$7NBwhL1.hSVliM6V61dDhOumLwpN01NTrKh1l3lMzJQ5v/2Hf7xo2', 1, '2026-10-04 06:59:19', 3, '2011-09-25 00:00:00', 'Dharmapala Vidyalaya Pannipitiya ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('71919242', 'Heshani', 'Shavindi', 'h30187347@gmail.com', '0740453233', '$2a$12$78cNairTji4o5E3XaPgifOk.MYD8k0N3KtDBb5xUj/6GRKSpHnE3m', 1, '2026-10-07 10:47:07', 2, '2009-11-08 00:00:00', 'Gothami balika viddiyala colombo 10 ', 77787660, NULL, '200981303181', 0);
INSERT INTO `students` VALUES ('72295196', 'Maheli', 'Sanindi ', 'maheshika.lakmali111@gmail.com', '0760332906', '$2a$12$/zA3zecL/fxzVKGpc90NTOgtXNU9H25brBjfgVkgXXGBoe7/6HDoG', 1, '2026-10-04 08:37:23', 3, '2012-01-30 00:00:00', 'Defence service college colombo 2 ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('72337816', 'Piniesha ', 'Peiris ', 'thusharianusha74@gmail.com', '0714442207', '$2a$12$qdPz0017q.igrYjqWow1vebp4RG4/XnCPXIrddyaUPZPINRDfNXW6', 1, '2026-10-05 14:48:43', 31, '2010-12-06 00:00:00', 'Visakha vidyalaya ', 11701519, NULL, '', 0);
INSERT INTO `students` VALUES ('72400548', 'Vihanga ', 'Sandaruwan', 'vihangasandaruwan2008@gmail.com', '0729315792', '$2a$12$KvmM5ZkCD.c0UJa0yYJ4G.zQ/rYJPrh/qZRcEu3FFrLH8/3MHnR6a', 1, '2026-09-23 00:21:34', 1, '2008-11-11 00:00:00', 'Lumbini college ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('72524387', 'Deeptha', 'Dissanayake', 'deepthadissanayake546@gmail.com', '0714338250', '$2a$12$rqZKGmC.x52uf3t6aTbxlOlZ8zctBZpw7sfdEVFA3bg7c71yiZLtS', 1, '2026-10-13 07:51:29', 2, '2009-11-26 00:00:00', 'St\'Benedict\'s college colombo-13', 23261191, NULL, '200933101839', 0);
INSERT INTO `students` VALUES ('72690106', 'Kashmira ', 'Jayawardhana ', 'kashmirajayawardhana@gmail.com', '0768771380', '$2a$12$iGGjwmzL8IM3ApZNp08LKOyIsTuCx8cDLHwevh/Je1fITVgCMPNSq', 1, '2026-10-09 09:00:18', 34, '2004-09-04 00:00:00', 'No', 86649016, NULL, '200474802980', 0);
INSERT INTO `students` VALUES ('72823764', 'Sayuru', 'Athsara', 'sayuruathsara9@gmail.com', '0741611505', '$2a$12$NrO7BYqLvLSeY0YMP1SM6OSt4iKunSLsTsPbxAn2XDr4qELZGMZsi', 1, '2026-09-24 02:04:35', 1, '2008-03-23 00:00:00', 'Prince Of Wales', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('73108289', 'Thisumi', 'Matheesha', 'sandamalichamila55@gmail.com', '0777962258', '$2a$12$gjX2Nchv50.bSFKxi1DwRuoTlPpCqGorqoJ5b.y/r2WLbBkosqeEu', 1, '2026-10-04 06:11:57', 3, '2011-12-21 00:00:00', 'Mahinda Rajapaksha college Homagama', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('73405159', 'Prabodha', 'Sathmini', 'nayanakanthi826@gmail.com', '0752691335', '$2a$12$qewHcyJqzbxN4ud2QLmS/.y2hvNyQWr4l/YsYiYzMO4wICRJXV2Du', 1, '2026-10-10 07:03:36', 3, '2011-07-06 00:00:00', 'Wp/Jaya/Vidyakara Balika Vidylaya', 93597790, NULL, '', 0);
INSERT INTO `students` VALUES ('73809117', 'Sathsara ', 'Lelenda', 'slmihiranga45@gmail.com', '0742426343', '$2a$12$0oAJz7dFxlvgY1we8wy83.6UONLuZ6jdeA9jQy.kGWFn0hosYOUmG', 1, '2026-10-04 05:49:53', 35, '2010-08-31 00:00:00', 'Batuwanda', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('73848579', 'Navithu', 'Lawanitha', 'navithulawanitha@gmail.com', '0786998689', '$2a$12$cbh1uudcxGTkW6jXluTqoOWLGtZLu0MaNXc6i07TBFQC/XzyLuGeO', 1, '2026-10-05 07:39:21', 32, '2010-12-02 00:00:00', 'President\'s College Maharagama', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('74928194', 'Thevindu', 'Nadeeja', 'thevindunadeeja@gmail.com', '0774739165', '$2a$12$ZfP9VApP0LBZagCa/racjOC36w/wsN0ePh.dKcbdPEM0FWpPg80fW', 0, '2026-10-07 16:27:58', 32, '2010-06-23 00:00:00', 'Piliyandala Central College', 32567555, NULL, '', 0);
INSERT INTO `students` VALUES ('74939881', 'Hasanjana', 'Divyangi', 'hasanjanadivyangi@gmail.com', '0760431196', '$2a$12$/fKXx.m0hyzuLmeiufVb3OMYc.j2K58VlBoPaKjvrdVDMG5e908wK', 1, '2026-10-04 13:59:04', 32, '2010-02-16 00:00:00', 'Mahamaya Girls\' College ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('75349150', 'Satheesha', 'Nethmi', 'lakmalipeiris198@gmail.com', '0741533619', '$2a$12$8cIUNcTwtWeYP4tBl8oFKe3n3e3itCPH0ti35FbD/7lRhqEe9cWya', 1, '2026-09-24 02:04:54', 1, '2008-07-08 00:00:00', 'Gothami balika vidyalaya', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('76208909', 'Inuka ', 'Withana ', 'ruvinidiasmv@gmail.com', '0716404434', '$2a$12$JT3uiu/cceLPnq1LIlQ1X.cSnpzN.T9oJNLzTiFLqUef.a9PJ2NeK', 1, '2026-10-05 12:49:40', 31, '2010-03-12 00:00:00', 'Prince Of Wales college moratuwa ', 54200314, NULL, '', 0);
INSERT INTO `students` VALUES ('76412593', 'Methuja', 'Suhansith', 'methujasuhansith@gmail.com', '0719271330', '$2a$12$ebNyor/Wq09YW4NdjpmyJu31UesTufP/IXDr4HXnJWa6cttTtRI9G', 1, '2026-10-05 14:23:48', 32, '2010-03-11 00:00:00', 'Ananda sastralaya ', 64417464, NULL, '', 0);
INSERT INTO `students` VALUES ('76729907', 'PRABASHA', 'SADEWMINI', 'prabashasadewmini2009@gmail.com', '0713562883', '$2a$12$OUVdtIPNAR2SXOupv6TUyeH6OZj28Cd9y45grAUR2g1/qTsOH45yW', 1, '2026-10-10 08:55:29', 2, '2009-08-08 00:00:00', 'Anula Vidyalaya ', 60602886, NULL, '200972102070', 0);
INSERT INTO `students` VALUES ('76850892', 'Sethuli', 'Sahanya', 'nilminiginigalgodage@gmail.com', '0712989779', '$2a$12$Mxh3P87UUbN9rYMyM1/LSe98PZmcM8cErMKD.PHpFsVLpiph5RO/2', 1, '2026-10-10 02:49:41', 3, '2011-04-04 00:00:00', 'Princess of wales collage', 82292213, NULL, '', 0);
INSERT INTO `students` VALUES ('76903255', 'Heshan', 'Bandara', 'concabandara@gmail.com', '0701826875', '$2a$12$u6ANisl5jBeQfF7RyN3PO.f1d67aT26yvJyFju.viW9mjuOn3p/yK', 1, '2026-07-23 04:50:57', 1, '2010-06-22 18:30:00', 'St. John College - Nugegoda Colombo', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('77099833', 'Tharushi', 'Liyanage', 'gliyanage44@gmail.com', '0777832539', '$2a$12$efn.bcDJexByorCSRmUsDuuEE6MBTr90X2oNd7UyMfhbyOco.jMTm', 1, '2026-10-04 14:07:55', 3, '2012-01-18 00:00:00', 'Piliyandala Central College', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('77322976', 'Tharinda', 'Dinujaya', 'tharindadinujaya89@gmail.com', '0772579715', '$2a$12$y758lHMd.Mao62XmV6mKLOupEcB0RPdoi2GB2yXCUY6q5GcX3qbJ6', 1, '2026-09-24 02:04:28', 1, '2008-10-09 00:00:00', 'Piliyandala central collage', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('77573106', 'lasan', 'shanuka', 'lasanshanuka340@gmail.com', '0763987369', '$2a$12$XRtPoh4YSEHP6U02qScEV.HEIEikcWMMQNSxaHgi2UALvtlOYlfoe', 1, '2026-10-05 16:31:30', 31, '2010-08-30 00:00:00', 'Homagama central college', 23290476, NULL, '', 0);
INSERT INTO `students` VALUES ('77953252', 'Desindu', 'Senevirathne ', 'niroshaekanayake123456@gmail.com', '+947016833', '$2a$12$rhM8h4zrr0xyZISrzBrGoehpwHOm1oGltJIjt3gZUTCJ9SL0pCjJi', 1, '2026-10-04 10:38:37', 3, '2011-03-10 00:00:00', 'Mahinda Rajapaksha college ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('78639144', 'Pamith', 'MINDINU', 'pamithtech@gmail.com', '0768407294', '$2a$12$BLpBepQFdYcm4/4t2Zli3OUo0XiLGyp.ke67x5qgFyt5yCZ2rdsnm', 1, '2026-10-11 09:05:49', 3, '2007-06-22 00:00:00', 'MC', 17289177, NULL, '', 0);
INSERT INTO `students` VALUES ('78640757', 'Rithara', 'Alwis', 'gamagemangalika9@gmail.com', '0755536372', '$2a$12$jIO1YDhbZ8DtEpKf55k..uj1fwsHnDt6oUs.vGSmMDwuq988CueJ6', 1, '2026-10-05 13:03:07', 31, '2010-06-21 00:00:00', 'Princess of Wales\' College ', 80726902, NULL, '', 0);
INSERT INTO `students` VALUES ('79784028', 'D.D. Yuthmika ', 'Thisew', 'sanjeewadeshapriya462@gmail.com', '0771282817', '$2a$12$ryUDuJWTBcBgso8xXzBjAuR61p9KuhmfsFcNPLCTqtwuzPPag5MoS', 1, '2026-10-05 05:44:09', 32, '2010-12-06 00:00:00', 'Presiden\'t college maharagama ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('79987737', 'Hithaishi ', 'Gaganya', 'vikashadithya509@gmail.com', '0772797668', '$2a$12$7mknKgp52SMI6/y1or6cDOkclQCzDKKk4gt.PHEP12gou014G.gR6', 1, '2026-10-09 12:40:30', 2, '2009-06-22 00:00:00', 'Homagama Mahinda Rajapaksha college ', 39662771, NULL, '200967401214', 0);
INSERT INTO `students` VALUES ('80332658', 'Vishwa ', 'Shenal ', 'vsm403201@gmail.com', '0703903420', '$2a$12$7fNA3RwY4vDgszHy0XQseuvltUYfl9L3Gj4h.s/RY6mP7UizwFgKq', 1, '2026-10-06 07:30:43', 2, '2009-02-14 00:00:00', 'Private ', 70286069, NULL, '200904502350', 0);
INSERT INTO `students` VALUES ('80549853', 'K.A. sithmi ', 'Himasarani ', 'jayalatha1980.3.13@gmail.com', '0758976649', '$2a$12$INvQSOSka4WCxhL3qkFNcOMaHFH5VnO28wTJro1iuZDbhGlonQ3IG', 1, '2026-10-05 13:45:10', 31, '2010-05-10 00:00:00', 'Piliyandala central college ', 86352870, NULL, '', 0);
INSERT INTO `students` VALUES ('80776142', 'Dimuth', 'Rodrigo', 'exrodrigo88@gmail.com', '0773697527', '$2a$12$40X1S0zL3nOAtPlyA2kZM.DGeLKz/FYqlZ.Q579R.vn9Pwouqx5V2', 1, '2026-10-11 10:41:49', 3, '2011-08-08 00:00:00', 'minuwangoda President college', 45998470, NULL, '', 0);
INSERT INTO `students` VALUES ('81222911', 'Nadeeshan ', 'Perera', 'nadeeshanperera0450@gmail.com', '0729469592', '$2a$12$m7pG9Odu9BlzoTgQAgW/GuzQa1qicD72aDD0pXvJZGFbG1vCH1pVW', 1, '2026-09-25 23:21:05', 35, '2010-04-13 00:00:00', 'Thurstan College ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('81691676', 'Thevindu ', 'Nadeeja', 'rajapakshasajeewani5@gmail.com', '0787274045', '$2a$12$Bfe4d1ny5zCT1rtEbPVHP.egWW78.SYuGf/OaFUkIRe4F1bvl0tQe', 1, '2026-10-10 17:54:48', 32, '2010-06-23 00:00:00', 'Piliyandala Central College', 47116946, NULL, '', 0);
INSERT INTO `students` VALUES ('83014730', 'sithumi', 'samarasinghe ', 'asanthiweerasinghe77@gmail.com', '0763213611', '$2a$12$4YZFiXKna8fvfjw3Lfn9Nu69rJDBnltRDSbPI68m/TSohY.ZLTCzu', 1, '2026-10-11 09:46:44', 3, '2012-06-23 00:00:00', 'negombo south international school piliyadala ', 70768241, NULL, '', 0);
INSERT INTO `students` VALUES ('84013017', 'Nisal', 'Udithma', 'nisalyct@gmail.com', '0773546004', '$2a$12$fX7LCoJc4qjUbJhpm7RlOurgHG1n.ayaLO7cy2H7WC8jHmRA4KLqm', 1, '2026-10-05 13:00:44', 31, '2010-03-22 00:00:00', 'MR/Godapitiya National School ', 80880898, NULL, '', 0);
INSERT INTO `students` VALUES ('84609661', 'Virul ', 'Nethula ', 'warunipradeepthi@gmail.com', '0728409369', '$2a$12$oczeFhV0RL/LmfUG1lAPa.AU27OrOF1eYr.4oRt/diYcvbcovAy5m', 1, '2026-10-05 07:17:21', 32, '2010-06-03 00:00:00', 'N/A/Dharmapala vidyalaya ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('84803838', 'Siyansa', 'Methdini', 'siyansamethdiniwork@gmail.com', '0759221592', '$2a$12$w1thaabFs/NkVaDKQ65beukyTTY7rpalVcQZjMNC6iczzSJVw1EFK', 1, '2026-09-24 02:08:04', 1, '2009-01-03 00:00:00', 'Piliyandala central collage ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('85258026', 'Ashan', 'Munasingha', 'ashan@gmail.com', '0703439311', '$2a$12$mlJXK8kBbXAQSKVvJo1yHeZSLON0HClcVLN7bwRfrxxuIUpjF1HZ.', 1, '2026-10-04 10:56:30', 3, '2011-10-04 00:00:00', 'Presidents college', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('85361047', 'Sahiru', 'Yesara', 'sahiru.yesa@gmail.com', '0706073103', '$2a$12$ABdrqGhn8VDvRYavWTxAzOQVrx7sSzCDDEAo8OlZG8GCm7s9i5hzC', 1, '2026-10-11 17:39:02', 32, '2010-10-31 00:00:00', 'ananda college', 20569176, NULL, '', 0);
INSERT INTO `students` VALUES ('85709585', 'Pahasara', 'Sithumini', 'pahasaraguruge123@gmail.com', '0702106790', '$2a$12$N7DjXYye2tgq7MRJ0TLwo.WzmcNBKT6ZTbTcTE8Tnk0gaubaIu6We', 1, '2026-09-24 02:07:21', 1, '2008-06-11 00:00:00', 'Central college of piliyandala', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('86094498', 'Pawan', 'Tharinda', 'pawantharinda98@gmail.com', '0740801619', '$2a$12$PfYWASm6o7bA0y5i9nIQnuzUlcHgBW92bR1yNKf4x.Y2X6bINM8N6', 1, '2026-10-14 04:30:11', 3, '2011-08-04 00:00:00', 'Piliyandala Central Collage', 20506812, NULL, '', 0);
INSERT INTO `students` VALUES ('86342103', 'Enuka', 'Pathiranage', 'enukamc@gmail.com', '0727948430', '$2a$12$47H9LPCZCPjRD0F7l6WdFuQfmgI2VpEPuu9eozwkERYBF7JadVSPy', 1, '2026-10-05 14:49:35', 31, '2010-09-01 00:00:00', 'Ananda College, Colombo 10', 37836597, NULL, '', 0);
INSERT INTO `students` VALUES ('86539099', 'pmf', 'pmf', 'dinithimandiv@gmail.com', '0774767600', '$2a$12$YdQ6LK4zRVHc7IyUuGHpOumV5s6lxMuV.LyYZO4XdbncbKHNtc6om', 1, '2026-10-11 09:31:55', 32, '2007-06-22 00:00:00', 'pmf', 62865579, NULL, '', 0);
INSERT INTO `students` VALUES ('86804353', 'Vihanga', 'Nethum', 'vihanga24x@gmail.com', '0713890001', '$2a$12$BYGQmQAZ27x2A.OH3epTluCU3PHbZAdARC2NDVrzD6Awt3iwExX.m', 1, '2026-10-04 06:36:47', 32, '2010-11-22 00:00:00', 'Price Of Wales College ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('86825575', 'Ramiru ', 'Amarasinghe ', 'kosalagomes@gmail.com', '0777315582', '$2a$12$xJGA93IyW8trhSSaDPvBMO4g6DGj5N.YF0dkGDp6uOFqRPQYhCgMK', 1, '2026-10-04 06:42:12', 35, '2010-09-29 00:00:00', 'Mahinda Rajapaksha  collage ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('86889838', 'Romasha', 'Setunga', 'romashasetunga16@gmail.com', '0712368882', '$2a$12$EsMmCU6W3inZQbtOaxE25.ZwUGE9lFztdDCTXct6wvxJN10wqO8hy', 1, '2026-10-05 12:30:20', 31, '2026-04-06 00:00:00', 'Holy Family Convent Dehiwela ', 81008567, NULL, '', 0);
INSERT INTO `students` VALUES ('87481209', 'Heshan', 'Bandara', 'conca@gmail.com', '0701826872', '$2a$12$VfULWEKr5eCyfeeqr2yCbuWClL1B0LOQojgwBPlSbKWQvudmrth.q', 0, '2026-08-21 00:59:53', 2, '2020-02-20 18:30:00', '48040805', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('87879238', 'Thisewni ', 'Sehansa ', 'thisewnisehansa6@gmail.com', '0757127926', '$2a$12$OXIQOS9I.NOWm3FksZlyl..v/hv/cIk/Ok8r3yMujielY1.XbIFr6', 1, '2026-10-05 12:16:22', 31, '2010-11-01 00:00:00', 'Co/Vidyakara Balika Vidyalaya', 95812459, NULL, '', 0);
INSERT INTO `students` VALUES ('88057991', 'Senuka', 'Adikari', 'senuka.adi2010@gamil.com', '0768724558', '$2a$12$S74mT8udjQ0Hcpz3BlHASeOuAQOgFSWSMw0FG/JA1rJhwhlsvYPlq', 1, '2026-10-04 14:06:40', 32, '2010-10-11 00:00:00', 'Royal Institute International school', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('88119671', 'Chithula ', 'Vidunuwan ', 'pathmakumarathushara049@gmail.com', '0711383262', '$2a$12$SLK/cmbRdHzZALjrV3exJevG5rjK0QY2uO57guIw17IEGMMH80yOa', 1, '2026-10-04 08:28:31', 3, '2011-09-29 00:00:00', 'Mahinda Rajapaksha College Homagema ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('88174360', 'Sethuni ', 'Samarasinghe', 'sethunisamarasinghe@gmail.com', '0765851850', '$2a$12$P8FUgIo9bj9TNMBEIX5s3uWRLOS8C713D6ORnwiHJIC1sgCrYGey.', 1, '2026-10-04 06:09:57', 2, '2009-09-29 00:00:00', 'Sirimavo Bandaranaike Vidyalaya, Colombo 07', NULL, NULL, '200977302294', 0);
INSERT INTO `students` VALUES ('88307022', 'Sethuli', 'Hewavasam', 'udarihewavasam@gmail.com', '0774930295', '$2a$12$92Kec4B7FK52S3nG/12uPuPJcCRtUuRPeZXSjYxP5JDQ61BRAtDZq', 1, '2026-10-07 15:34:51', 3, '2011-04-30 00:00:00', 'Samudradevi Balika Vidya;aya', 10420484, NULL, '', 0);
INSERT INTO `students` VALUES ('88504947', 'Bisath', 'Bonuka', 'm.l.bisathbonuka123@gmail.com', '0763620800', '$2a$12$Bc2n4Qd/t0brSznvxht9Ye34.Cn.E2E4eSYL5tFUGeFx8UpeznxbG', 1, '2026-10-05 03:06:08', 32, '2010-06-01 00:00:00', 'Dharmapala Vidyalaya,Pannipitiya ', 17913425, NULL, '', 0);
INSERT INTO `students` VALUES ('88916271', 'Uvindu', 'Sathsara', 'kuvindusathsara@gmail.com', '0701744376', '$2a$12$Y/F.FtspG7al4ONjUxc.4epjNdMUiXB6DFUFbzq/Y4cSOr5eVLbXK', 1, '2026-09-24 02:08:16', 34, '2008-03-02 00:00:00', 'isipathana college', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('89201900', 'Sayumi ', 'Ruwanima ', 'nayomidumeeka4@gmail.com', '0701333028', '$2a$12$4DVZsVUPEsIzbwwm52MIl.6Zf8OdbSfumO3hkN0cTiPAEfxgB4uc.', 1, '2026-09-23 11:18:05', 34, '2008-04-12 00:00:00', 'Anula Vidyalaya Nugegoda ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('89204148', 'Rivini', 'Sehansa', 'sehansarivini6@gmail.com', '0776771312', '$2a$12$qgR8SSRNi6R5.0nxA63ftugsj5nOZwg4esKOUS6eIhSi/PbOMnvRG', 1, '2026-10-04 18:18:17', 32, '2010-11-29 00:00:00', 'Royal Institute International', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('89819314', 'Ranai', 'Harshani ', 'ranaliharshani@gmail.com', '0760147052', '$2a$12$cjATXWRV8bFRa/8D440H.OSTmUzlr6TDj4KuEF6.V1LxN.NBXAQhi', 1, '2026-10-05 15:18:34', 32, '2010-04-26 00:00:00', 'St.Paul\'s Girls\' School', 90718601, NULL, '', 0);
INSERT INTO `students` VALUES ('90006089', 'Sinura', 'Lakdisa ', 'buddikamaxp83@gmail.com', '0716419149', '$2a$12$5uGIs/ZUnLG5Y44v9j1DaesYWHY71FepI2J/njJ6HpXt0K6cw58iu', 1, '2026-10-04 07:44:19', 32, '2010-06-08 00:00:00', 'St.John\'s college.', 17912060, NULL, '', 0);
INSERT INTO `students` VALUES ('90553605', 'Minew', 'Ranchitha', 'nilanthigodallawattage@gmail.com', '0714597594', '$2a$12$4XCA2vYbR3jnAveJ8cLloeVlBD9O51ept8sVY8kUeRwUpdA9P2JpK', 1, '2026-10-07 14:41:40', 3, '2011-03-19 00:00:00', 'WP/JP/Kottawa Dharmapala Maha Vidyalaya', 71190160, NULL, '', 0);
INSERT INTO `students` VALUES ('90599354', 'Senuli Thinara ', 'Hewawasam', 'krishanthikujana@gmail.com', '0776629025', '$2a$12$Av/cCK.tCY.Jllnc.klDZudPyARak8OvFROkXtWEHOF4N/UkmTnOK', 1, '2026-10-05 10:32:36', 32, '2010-03-10 00:00:00', 'Ashoka college horana ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('90608402', 'Sakuna ', 'Denuwan ', 'sakunadenuwan915@gmail.com', '0765383870', '$2a$12$HjSMF/cPvHMwhOgRoeBd/ORfmEU4wRr3Xw4qASgn7RjDwABi/mKCm', 1, '2026-10-04 08:55:20', 32, '2026-02-16 00:00:00', 'Kottawa dharmapala maha vidyalaya', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('90846228', 'Methmi', 'Pramodya', 'priyanthamunasingha585@gmail.com', '0772155694', '$2a$12$0Qkwiaepyah0OgOZSjvCCu66ohYt2EPz6BrXWEuiCtFZnrBeCWevO', 1, '2026-10-05 06:27:50', 32, '2010-11-27 00:00:00', 'Homagama central college ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('91106413', 'Thulina Theekshana ', 'Ranasinghe ', 'anuruddhikaumayangani6@gmail.com', '071 594922', '$2a$12$1gsc0VjWyEZLMkLdg7is4.5Hl7XqETpuipoqp2dwANGdHrQv6o9hm', 1, '2026-10-05 12:11:45', 32, '2010-10-05 00:00:00', 'Royal college ', 17697992, NULL, '', 0);
INSERT INTO `students` VALUES ('91203277', 'Chanumi ', 'Sehasna ', 'njchannasanjwwa@gmail.com', '0764740563', '$2a$12$FUTF0UaJEVqsffxB.ljiJ.e2E.PUewbfJjkxyVV9y4hUY/hiKUXAe', 1, '2026-10-04 07:00:26', 2, '2009-09-25 00:00:00', 'Sirimavo Bandaranaike Vidyalaya, Colombo 07.', NULL, NULL, '200976904104', 0);
INSERT INTO `students` VALUES ('91564138', 'Methmi', 'Kiriwendala', 'lakbls@gmail.com', '0774146462', '$2a$12$pV/mwf7lyuIWgCj/GCnIJOP6V9Zzt54Ppmfhi/5vkFNXOzJlVDAHa', 1, '2026-10-04 08:27:59', 3, '2011-05-12 00:00:00', 'Mahinda Rajapaksha College', 17911028, NULL, '', 0);
INSERT INTO `students` VALUES ('91720800', 'Nethumi', 'Jayatunga', 'nethumija@gimail.com', '0718328442', '$2a$12$wX4Y9TLG5hmK7RpRWDKWSeGqLp0ofGz2d0U4Z3yHrL0Sr5o5.Ps46', 1, '2026-10-13 11:01:59', 32, '2010-11-08 00:00:00', 'Sirimavo Bandaranaike Vidyalaya', 14026733, NULL, '', 0);
INSERT INTO `students` VALUES ('91772379', 'Binuga ', 'Amarasinghe ', 'amarasinghesampath12@gmail.com', '0788149767', '$2a$12$ETCxzV4b/UzzLWRw3Tx7xeKkCySOLtlHhxsMMUwVRDeYuFdlHy9NC', 1, '2026-10-12 08:17:57', 32, '2010-05-12 00:00:00', 'Thurstan college ', 40302823, NULL, '', 0);
INSERT INTO `students` VALUES ('92386020', 'Maleesha', 'Keshan', 'keshanm85@gmail.com', '0740814502', '$2a$12$C7EW0vTawllqG7yXweEuYuKSqpu6.obnr8cisMQOT0suwaWhXsOzW', 1, '2026-10-05 12:10:19', 32, '2010-08-14 00:00:00', 'President\'s College Maharagama', 53860041, NULL, '', 0);
INSERT INTO `students` VALUES ('92709936', 'Pawan', 'Nimsara', 'pawannimsara064@gmail.com', '0702121238', '$2a$12$3icYIntGAFRRJHYBOqZ.pe5.QgMNVSw8AtVLGSM7nlB5L0P17auyO', 1, '2026-10-05 05:51:33', 31, '2010-12-09 00:00:00', 'Dharmaraja collage', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('93112816', 'Madawa', 'Nethnal', 'madawanethnal@gmail.com', '0760955965', '$2a$12$Mz7/00CIiAxOxExwfdVG.uwO7SHF5crQQTksyS16qN7OpMa0Ymj8i', 1, '2026-10-05 13:52:34', 31, '2010-09-08 00:00:00', 'S.de.s.jayasingha central college', 73031523, NULL, '', 0);
INSERT INTO `students` VALUES ('93678538', 'Ahamed', 'Rafan', 'ahamedrafan89@gmail.com', '0740035606', '$2a$12$GBLr0bDYMxxw3zSRxxLAGORCZRqsOUayO2.w8K/Hs3.9bPXIdw/jC', 1, '2026-10-09 08:32:32', 32, '2010-04-01 00:00:00', 'pracident college maharagama ', 59879009, NULL, '', 0);
INSERT INTO `students` VALUES ('94291476', 'Kawishka', 'Sahan', 'sahankawishka79@gmail.com', '0717120381', '$2a$12$uw5GafrvPvLiZ0D740XD.eEeR3L44ovskWecNZhEDpq5UhSV6SNqO', 1, '2026-09-23 00:19:56', 1, '2008-09-22 00:00:00', 'Isipathana college.Colombo 05 ', NULL, NULL, NULL, 0);
INSERT INTO `students` VALUES ('96006381', 'Methuka', 'Nanvidu', 'methukananvidu3@gmail.com', '0760758635', '$2a$12$RSwwigdbcufL2d32KpLZ3.WYOhu8ZcX9fJtjmWLVta9rHOp6SkU0.', 1, '2026-10-10 08:24:04', 2, '2009-08-11 00:00:00', 'Ds senanayaka college ', 83095281, NULL, '200922402671', 0);
INSERT INTO `students` VALUES ('96340643', 'Pabalu Nethsarani', 'Fernando', 'chanakafrenando.mb@gmail.com', '0762649529', '$2a$12$NCD0.4slmjFAu5K07wsgJOVpARhaEzf.GMa3YU1wNkJ49bsIrQ8yy', 1, '2026-10-05 13:37:43', 32, '2010-02-23 00:00:00', 'Co/Vidyakara Balika Vidyalaya', 84135734, NULL, '', 0);
INSERT INTO `students` VALUES ('96413579', 'Nikini', 'waduge', 'nikiniwaduge20@gmail.com', '0718117195', '$2a$12$P/AZb1Stb9gK0jEGogXPI.cdYKJ6xkb0rzS4sRC0R/o4LA8N/dFei', 1, '2026-10-04 06:38:07', 3, '2011-05-14 00:00:00', 'Anula vidyalaya', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('96847431', 'Dinuli H', 'Ranasingha', 'hemantharanasingha274@gmail.com', '0782825981', '$2a$12$lZQV6WWT3Hfc.WIA4djcfOFvyOJn.bsg.qc4e6OaRNPHxZ/3xr1QC', 1, '2026-10-04 05:50:17', 31, '2026-04-23 00:00:00', 'Kottawa Ananda College ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('97239230', 'Amasha', 'Shehari', 'sudarshanikorala43@gmail.com', '0771950410', '$2a$12$t/m7bpeQAmQ7KAgscxig1.lYuG7WYIWlNTwIwhmyvEPHtRF9jkGda', 1, '2026-10-04 13:26:25', 33, '2011-07-25 00:00:00', 'Princess of wale\'s college', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('98560821', 'Resandu', 'Sendinu', 'resandusendinu88@gmail.com', '0702035504', '$2a$12$lDacN0JU8V.xJ305LCnCnOPpjsfjOHkpbgHKkh2r5PpmPu40b0Fqa', 1, '2026-10-05 16:46:51', 31, '2010-03-04 00:00:00', 'Co/Dharmaraja Maha Vidyalaya', 91742552, NULL, '', 0);
INSERT INTO `students` VALUES ('98624655', 'Sadew', 'Hansaka', 'ranjikawanniarachchi@gmail.com', '0776079116', '$2a$12$CCRJnefY9i0hI9Suv735geg.wnGu/FvTjTvS9dWUqbirn9dhf.t0C', 1, '2026-10-05 12:02:16', 3, '2011-03-16 00:00:00', 'Leeds', 24838003, NULL, '', 0);
INSERT INTO `students` VALUES ('98867404', 'Sashen', 'Janith', 'adhettiarachchi4@gmail.com', '0785998941', '$2a$12$1vl.HMW6XGpgYPC1cBw7MuCeIlVzeDGlYHP31sQ52gl6MZbDmy8MG', 1, '2026-10-05 07:38:37', 31, '2010-07-02 00:00:00', 'Dharmapala Vidyalaya, Pannipitiya ', 17911861, NULL, '', 0);
INSERT INTO `students` VALUES ('98884075', 'Nethini ', 'Mithara', 'nethinimithara@gmail.com', '0777812651', '$2a$12$bPZE6aW7p5edC/q2NvbdWeBsIo3bGpNvpi6WWFgZLoEz/OqtOyu8q', 1, '2026-10-04 07:51:17', 32, '2010-06-26 00:00:00', 'Ananda Balika Vidyalaya Kotte ', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('98909706', 'Saruka Gagana ', 'Tennakone ', 'manjumanori123@gmail.com', '0768360775', '$2a$12$iTXomTryXRLqT8NdVn9A7eJjc1Bdg0tSKO7yp5ahP9gw350Bi4zYO', 1, '2026-10-05 14:48:27', 32, '2011-01-07 00:00:00', 'Pilyandala Central College ', 66867637, NULL, '', 0);
INSERT INTO `students` VALUES ('99018209', 'Hirushi', 'Ambepitiya', 'hirushisubodya@gmail.com', '0763551477', '$2a$12$lWOagw2aGCnu7G1x3Yj9D.hoolgVWMxmzuFwkezl4xNOM4wSG/ai.', 1, '2026-10-05 05:49:54', 32, '2010-11-10 00:00:00', 'WP/J Samudradevi Balika Vidyalaya, Nugegoda', NULL, NULL, '', 0);
INSERT INTO `students` VALUES ('99182770', 'Nimsara Hansamal ', 'Wijearathna ', 'nimsarahansamal21@gmail.com', '0777899060', '$2a$12$3HrYws12TJpfRJ7Cs9/jjOSHWuVzr/EtuFBz5lxtWgPs46p3Ev996', 1, '2026-10-13 06:40:22', 32, '2010-04-21 00:00:00', 'Sri Chandraratna Manawasingha Vidyalaya ', 32920715, NULL, '', 0);
INSERT INTO `students` VALUES ('99313148', 'Navithu', 'Lawanitha', '1lawanithanavithu@gmail.com', '0719725301', '$2a$12$AmVSaGbwTtgkTj6ckH6JKO9hZ65iu7Jjn5ZwAYOL8PiQUFLfKGKT6', 1, '2026-10-12 15:28:36', 32, '2010-12-02 00:00:00', 'President\'s College Maharagama', 90232365, NULL, '', 0);
INSERT INTO `students` VALUES ('99959461', 'Sayuri', 'Prarthana', 'wmddsjayawardhana@gmail.com', '0764898717', '$2a$12$vCR3giG0OAJYR8jB/ygi1eaSxsHf7JR7usM1/oO4.BsxLqvVEoxbK', 1, '2026-10-11 03:14:51', 32, '2010-10-04 00:00:00', 'Holy Family Convent', 69936718, NULL, '', 0);
INSERT INTO `students` VALUES ('99981122', 'Pahan', 'Induwara', 'pahaninduwara26@gmail.com', '0762077140', '$2a$12$CeFCM55kVRPLvCpyms5Z1ucqljpCReDYTLdfmftOdme/.8C/8epma', 1, '2026-10-12 15:36:03', 32, '2010-09-16 00:00:00', 'Central College Piliyandala', 46674720, NULL, '', 0);

-- ----------------------------
-- Table structure for tute_type
-- ----------------------------
DROP TABLE IF EXISTS `tute_type`;
CREATE TABLE `tute_type`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_tute_type_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tute_type
-- ----------------------------
INSERT INTO `tute_type` VALUES (1, 'Tute', 'Regular tutorial materials', 1, '2026-07-28 12:15:33', '2026-07-28 12:15:33');
INSERT INTO `tute_type` VALUES (2, 'Question Paper', 'Past papers and model papers', 1, '2026-07-28 12:15:33', '2026-07-28 12:15:33');

-- ----------------------------
-- Table structure for tutes
-- ----------------------------
DROP TABLE IF EXISTS `tutes`;
CREATE TABLE `tutes`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `link` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `cover_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `price` double NULL DEFAULT NULL,
  `grade_id` int NOT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `access_type` enum('FREE','PAID') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'PAID',
  `tute_type_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_tutes_grade_idx`(`grade_id` ASC) USING BTREE,
  INDEX `idx_tutes_access_type`(`access_type` ASC) USING BTREE,
  INDEX `idx_tutes_tute_type_id`(`tute_type_id` ASC) USING BTREE,
  INDEX `idx_tutes_grade_id`(`grade_id` ASC) USING BTREE,
  INDEX `idx_cover_image_url`(`cover_image_url` ASC) USING BTREE,
  CONSTRAINT `fk_tutes_grade` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_tutes_tute_type` FOREIGN KEY (`tute_type_id`) REFERENCES `tute_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tutes
-- ----------------------------
INSERT INTO `tutes` VALUES (15, 'Test', 'Test', 'http://localhost:8081/', NULL, '2026-09-18 22:33:52', 50, 1, 0, 'PAID', 1);
INSERT INTO `tutes` VALUES (16, 'Test', 'Test', 'http://localhost:8081/', NULL, '2026-10-02 16:48:49', 50, 1, 0, 'PAID', 1);
INSERT INTO `tutes` VALUES (17, 'Grade 11 Monthly Paper Pack O1 (EM)', '', 'https://drive.google.com/file/d/1thActnTCbpyeAIH72OHNqb3LIRlyeULV/view?usp=drive_link', NULL, '2026-10-08 20:07:53', 0, 32, 1, 'FREE', 2);
INSERT INTO `tutes` VALUES (18, 'Grade 11 Monthly Paper Pack O1 (SM)', '', 'https://drive.google.com/file/d/1Kj1KpRtBEbb96Vzd6-HVaji_sA3Xh1WS/view?usp=drive_link', NULL, '2026-10-08 20:08:44', 0, 32, 1, 'FREE', 2);
INSERT INTO `tutes` VALUES (19, 'Grade 11 Monthly Paper Pack O2 (EM)', '', 'https://drive.google.com/file/d/1fAgvxkwqvtw_IL_BIV_jexQpgv8d_k-V/view?usp=drive_link', NULL, '2026-10-08 20:12:56', 0, 32, 1, 'FREE', 2);
INSERT INTO `tutes` VALUES (20, 'Grade 11 Monthly Paper Pack O2 (SM)', '', 'https://drive.google.com/file/d/1eQ5XFiZJawN0ufHHEHvNSuDD5MsbrjMe/view?usp=drive_link', NULL, '2026-10-08 20:14:50', 0, 32, 1, 'FREE', 2);

-- ----------------------------
-- Table structure for tutes_request
-- ----------------------------
DROP TABLE IF EXISTS `tutes_request`;
CREATE TABLE `tutes_request`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_date` timestamp NULL DEFAULT NULL,
  `tutes_id` int NOT NULL,
  `tutes_status_id` int NOT NULL,
  `students_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_tutes_request_tutes1_idx`(`tutes_id` ASC) USING BTREE,
  INDEX `fk_tutes_request_tutes_status1_idx`(`tutes_status_id` ASC) USING BTREE,
  INDEX `fk_tutes_request_students1_idx`(`students_id` ASC) USING BTREE,
  CONSTRAINT `fk_tutes_request_students1` FOREIGN KEY (`students_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_tutes_request_tutes1` FOREIGN KEY (`tutes_id`) REFERENCES `tutes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_tutes_request_tutes_status1` FOREIGN KEY (`tutes_status_id`) REFERENCES `tutes_status` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tutes_request
-- ----------------------------

-- ----------------------------
-- Table structure for tutes_status
-- ----------------------------
DROP TABLE IF EXISTS `tutes_status`;
CREATE TABLE `tutes_status`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of tutes_status
-- ----------------------------
INSERT INTO `tutes_status` VALUES (1, 'Pending');
INSERT INTO `tutes_status` VALUES (2, 'Approved');
INSERT INTO `tutes_status` VALUES (3, 'Rejected');

SET FOREIGN_KEY_CHECKS = 1;
