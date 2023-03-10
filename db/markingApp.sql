-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-db
-- Generation Time: Feb 18, 2023 at 07:21 PM
-- Server version: 5.7.41
-- PHP Version: 8.1.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
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
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `id` int(255) UNSIGNED NOT NULL,
  `firstName` varchar(256) NOT NULL,
  `lastName` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`id`, `firstName`, `lastName`, `email`, `password`) VALUES
(1, 'Super', 'Instructor', 'instructor@test.com', '$2a$10$/qETjjsmUGrvI1yUSO0KaO2mQzD7vcoMXdPbkfa0JYYdefHGbNGmO');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(255) UNSIGNED NOT NULL,
  `firstName` varchar(256) NOT NULL,
  `lastName` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(64) NOT NULL,
  `answer1` varchar(128) DEFAULT NULL,
  `answer2` varchar(128) DEFAULT NULL,
  `answer3` varchar(128) DEFAULT NULL,
  `mark1` int(128) DEFAULT NULL,
  `mark2` int(128) DEFAULT NULL,
  `mark3` int(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `firstName`, `lastName`, `email`, `password`) VALUES
(1, 'Alice', 'Lin', 'alice@test.com', '$2a$10$1W8bk4jUiH/wPQ4ONEKXI.ffLG4p6T3C51RrORHx.QcMil0Rj/uvG'),
(2, 'Bruce', 'Wang', 'bruce@test.com', '$2a$10$1W8bk4jUiH/wPQ4ONEKXI.ffLG4p6T3C51RrORHx.QcMil0Rj/uvG'),
(3, 'Chris', 'Chen', 'chris@test.com', '$2a$10$1W8bk4jUiH/wPQ4ONEKXI.ffLG4p6T3C51RrORHx.QcMil0Rj/uvG');
COMMIT;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `students`
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
  MODIFY `id` int(255) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
