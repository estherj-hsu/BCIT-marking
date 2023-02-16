-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-db
-- Generation Time: Feb 16, 2023 at 01:17 PM
-- Server version: 5.7.41
-- PHP Version: 8.1.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `markingApp`
--

-- --------------------------------------------------------

--
-- Table structure for table `sample`
--

CREATE TABLE `students` (
  `id` int(255) NOT NULL,
  `name` varchar(256) NOT NULL,
  `answer1` varchar(128) DEFAULT NULL,
  `answer2` varchar(128) DEFAULT NULL,
  `answer3` varchar(128) DEFAULT NULL,
  `mark1` varchar(128) DEFAULT NULL,
  `mark2` varchar(128) DEFAULT NULL,
  `mark3` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sample`
--

INSERT INTO `students` (`id`, `name`) VALUES
(1, 'Alice'),
(2, 'Bruce'),
(3, 'Chris');
COMMIT;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sample`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;