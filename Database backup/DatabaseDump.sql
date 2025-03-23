-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cfp
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `Topic` varchar(255) NOT NULL,
  PRIMARY KEY (`Topic`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('AI'),('AR'),('Big Data'),('Blockchain'),('Cloud Computing'),('Cryptocurrency'),('Cybersecurity'),('Data distribution'),('Data Science'),('DevOps'),('Game Development'),('General'),('IoT'),('Machine Learning'),('Mobile Development'),('Science'),('Software Development'),('Technology'),('Transit time Encryption'),('VR'),('Web Development');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cfp`
--

DROP TABLE IF EXISTS `cfp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cfp` (
  `CFP_ID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Announced_Date` date NOT NULL,
  `Submission_Deadline` date NOT NULL,
  `Paper_Count` int NOT NULL DEFAULT '0',
  `Topic` varchar(255) NOT NULL,
  `Conference_ID` int NOT NULL,
  PRIMARY KEY (`CFP_ID`),
  KEY `Conference_ID` (`Conference_ID`),
  KEY `Topic` (`Topic`),
  CONSTRAINT `cfp_ibfk_1` FOREIGN KEY (`Conference_ID`) REFERENCES `conference` (`Conference_ID`),
  CONSTRAINT `cfp_ibfk_2` FOREIGN KEY (`Topic`) REFERENCES `category` (`Topic`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cfp`
--

LOCK TABLES `cfp` WRITE;
/*!40000 ALTER TABLE `cfp` DISABLE KEYS */;
INSERT INTO `cfp` VALUES (1,'Test CFP Genetic Algo','2021-11-01','2021-11-30',0,'AI',1),(2,'Test CFP Bayesian','2021-11-01','2021-11-03',0,'AI',1),(3,'Big Data','2025-03-21','2025-03-21',0,'Blockchain',2),(7,'Database Management System','2025-03-01','2025-03-19',0,'Data distribution',10),(8,'Data Security','2025-03-01','2025-03-19',0,'Transit time Encryption',10);
/*!40000 ALTER TABLE `cfp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conference`
--

DROP TABLE IF EXISTS `conference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conference` (
  `Conference_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Theme` varchar(255) NOT NULL,
  `Location` varchar(255) NOT NULL,
  `Start_Date` date NOT NULL,
  `End_Date` date NOT NULL,
  PRIMARY KEY (`Conference_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conference`
--

LOCK TABLES `conference` WRITE;
/*!40000 ALTER TABLE `conference` DISABLE KEYS */;
INSERT INTO `conference` VALUES (1,'Test Conference','Test Theme AI','Test Location Pulchowk','2021-11-01','2021-12-02'),(2,'Conference Test','General','Pulchowk','2025-03-22','2025-03-31'),(10,'DBMS','General','Pulchowk','2025-03-01','2025-03-19');
/*!40000 ALTER TABLE `conference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paper`
--

DROP TABLE IF EXISTS `paper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paper` (
  `Paper_ID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(100) NOT NULL,
  `Topic` varchar(255) NOT NULL,
  PRIMARY KEY (`Paper_ID`),
  KEY `Topic` (`Topic`),
  CONSTRAINT `paper_ibfk_1` FOREIGN KEY (`Topic`) REFERENCES `category` (`Topic`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paper`
--

LOCK TABLES `paper` WRITE;
/*!40000 ALTER TABLE `paper` DISABLE KEYS */;
INSERT INTO `paper` VALUES (1,'Biggest Data','Big Data');
/*!40000 ALTER TABLE `paper` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `PersonID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Role` enum('Author','Editor','Reviewer') NOT NULL,
  `Affiliation` varchar(255) NOT NULL,
  `Phone_Number` char(10) NOT NULL,
  `Hashed_Password` varchar(255) NOT NULL,
  PRIMARY KEY (`PersonID`),
  UNIQUE KEY `Email` (`Email`),
  CONSTRAINT `person_chk_1` CHECK ((char_length(`Phone_Number`) = 10))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (1,'meow','test@gmail.com','Reviewer','Test University','1234567890','$2a$10$diUjwAdOwZdG8lPFw83HM.BNkU2GjeoxQjEXP/Pdvv3cYEr2PLPwW'),(2,'meow2','test2@gmail.com','Reviewer','Test University','1234567890','$2a$10$diUjwAdOwZdG8lPFw83HM.BNkU2GjeoxQjEXP/Pdvv3cYEr2PLPwW'),(3,'meow3','a@a.com','Author','Pulchowk Campus','9812345670','$2a$10$diUjwAdOwZdG8lPFw83HM.BNkU2GjeoxQjEXP/Pdvv3cYEr2PLPwW'),(4,'Sam Smith','smith@gmail.com','Author','Pulchowk Campus','9876567800','$2a$10$H4rexSZshXnXo5bx3Luxpud6NdFsnVHqtlyS0l/g82aHPMNZ5wylS');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `Review_ID` int NOT NULL AUTO_INCREMENT,
  `Review_Score` int NOT NULL,
  `Paper_ID` int NOT NULL,
  `Submission_ID` int NOT NULL,
  PRIMARY KEY (`Review_ID`),
  KEY `Paper_ID` (`Paper_ID`),
  KEY `Submission_ID` (`Submission_ID`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`Paper_ID`) REFERENCES `paper` (`Paper_ID`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`Submission_ID`) REFERENCES `submission` (`Submission_ID`),
  CONSTRAINT `reviews_chk_1` CHECK ((`Review_Score` between 0 and 100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission`
--

DROP TABLE IF EXISTS `submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission` (
  `Submission_ID` int NOT NULL AUTO_INCREMENT,
  `Submission_Date` date NOT NULL,
  `Status` enum('Waiting','Approved','Rejected') NOT NULL,
  `Paper_ID` int NOT NULL,
  `CFP_ID` int NOT NULL,
  `Submitted_By` int NOT NULL,
  PRIMARY KEY (`Submission_ID`),
  KEY `Paper_ID` (`Paper_ID`),
  KEY `CFP_ID` (`CFP_ID`),
  KEY `Submitted_By` (`Submitted_By`),
  CONSTRAINT `submission_ibfk_1` FOREIGN KEY (`Paper_ID`) REFERENCES `paper` (`Paper_ID`),
  CONSTRAINT `submission_ibfk_2` FOREIGN KEY (`CFP_ID`) REFERENCES `cfp` (`CFP_ID`),
  CONSTRAINT `submission_ibfk_3` FOREIGN KEY (`Submitted_By`) REFERENCES `person` (`PersonID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission`
--

LOCK TABLES `submission` WRITE;
/*!40000 ALTER TABLE `submission` DISABLE KEYS */;
INSERT INTO `submission` VALUES (1,'2025-03-23','Waiting',1,1,4);
/*!40000 ALTER TABLE `submission` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-23 20:56:11
