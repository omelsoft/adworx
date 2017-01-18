-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 19, 2016 at 12:13 PM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dashboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `partners`
--

CREATE TABLE `partners` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `website` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `partners`
--

INSERT INTO `partners` (`id`, `name`, `website`) VALUES
(16, 'Sekindo', 'https://www.sekindo.com'),
(18, 'Adsense', 'google.com/adsense'),
(19, 'Ad Exchange', 'google.com/adx'),
(21, 'App Nexus', 'appnexus.com'),
(23, 'Ad Slot', 'adslot.com'),
(24, 'AOL', 'aol.com');

-- --------------------------------------------------------

--
-- Table structure for table `sekindo`
--

CREATE TABLE `sekindo` (
  `id` int(11) NOT NULL,
  `pubId` int(11) NOT NULL,
  `reportDate` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `Impressions` int(11) NOT NULL,
  `Clicks` int(11) NOT NULL,
  `eCPM` double NOT NULL,
  `Revenue` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sekindo`
--

INSERT INTO `sekindo` (`id`, `pubId`, `reportDate`, `Impressions`, `Clicks`, `eCPM`, `Revenue`) VALUES
(1, 2, '2016-12-01', 31423, 0, 1.75, 54.99),
(2, 2, '2016-12-02', 28479, 0, 2.2, 62.74),
(3, 2, '2016-12-03', 28476, 0, 1.72, 49.04),
(4, 2, '2016-12-04', 32833, 3, 1.6, 52.54),
(5, 2, '2016-12-05', 37418, 6, 2, 74.82),
(6, 2, '2016-12-06', 41161, 0, 1.68, 69.1),
(7, 2, '2016-12-07', 37551, 0, 1.61, 60.62),
(8, 2, '2016-12-08', 41082, 0, 1.72, 70.67),
(9, 2, '2016-12-09', 37341, 0, 1.88, 70.29),
(10, 2, '2016-12-10', 31848, 0, 1.76, 56.15),
(11, 2, '2016-12-11', 40202, 0, 1.63, 65.61),
(12, 2, '2016-12-12', 5375, 0, 1.97, 10.57);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(6) NOT NULL,
  `fullname` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(60) NOT NULL,
  `paypal` varchar(50) NOT NULL,
  `status` bit(1) NOT NULL DEFAULT b'0',
  `rate` double NOT NULL,
  `website` varchar(40) NOT NULL,
  `message` varchar(500) NOT NULL,
  `type` varchar(15) NOT NULL,
  `profilepic` varchar(100) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `username`, `password`, `email`, `paypal`, `status`, `rate`, `website`, `message`, `type`, `profilepic`, `timezone`) VALUES
(1, 'Administrator', 'admin', '21232f297a57a5a743894a0e4a801fc3', 'omelsoft@gmail.com', 'omelsoft@gmail.com', b'1', 0, 'adworx.com.ph', 'I''m admin.', 'admin', NULL, NULL),
(2, 'Ramon Van Meer', 'ramon', '266575d3c2b8a34f83817458f96152b1', 'ramon@pinkjava.com', 'ramon@pinkjava.com', b'0', 0, 'pinkjava.com', 'Pink Java Media', 'publisher', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sekindo`
--
ALTER TABLE `sekindo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `partners`
--
ALTER TABLE `partners`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `sekindo`
--
ALTER TABLE `sekindo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
