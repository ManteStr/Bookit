-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 20, 2026 at 07:22 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_bookit`
--

-- --------------------------------------------------------

--
-- Table structure for table `bibliotekos`
--

CREATE TABLE `bibliotekos` (
  `bibliotekos_id` int(11) NOT NULL,
  `pavadinimas` varchar(100) NOT NULL,
  `adresas` varchar(150) NOT NULL,
  `aukstas` varchar(150) NOT NULL,
  `zemelapio_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `iranga`
--

CREATE TABLE `iranga` (
  `irangos_id` int(11) NOT NULL,
  `pavadinimas` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kambariai`
--

CREATE TABLE `kambariai` (
  `kambario_id` int(11) NOT NULL,
  `bibliotekos_id` int(11) NOT NULL,
  `pavadinimas` varchar(50) NOT NULL,
  `kambario_nr` varchar(20) NOT NULL,
  `aukstas` int(11) NOT NULL,
  `zemelapio_x` decimal(8,2) NOT NULL,
  `zemelapio_y` decimal(8,2) NOT NULL,
  `talpa` int(11) NOT NULL,
  `stalu_sk` int(11) NOT NULL,
  `kedziu_sk` int(11) NOT NULL,
  `kompiuteriu_sk` int(11) NOT NULL,
  `busena` varchar(20) NOT NULL,
  `nuotraukos_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kambario_iranga`
--

CREATE TABLE `kambario_iranga` (
  `kambario_irangos_id` int(11) NOT NULL,
  `kambario_id` int(11) NOT NULL,
  `irangos_id` int(11) NOT NULL,
  `kiekis` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pranesimu_prenumeratos`
--

CREATE TABLE `pranesimu_prenumeratos` (
  `prenumeratos_id` int(11) NOT NULL,
  `vartotojo_id` int(11) NOT NULL,
  `kambario_id` int(11) NOT NULL,
  `data` date NOT NULL,
  `pradzios_laikas` time NOT NULL,
  `pabaigos_laikas` time NOT NULL,
  `statusas` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rezervacijos`
--

CREATE TABLE `rezervacijos` (
  `rezervacijos_id` int(11) NOT NULL,
  `vartotojo_id` int(11) NOT NULL,
  `kambario_id` int(11) NOT NULL,
  `data` date NOT NULL,
  `pradzios_laikas` time NOT NULL,
  `pabaigos_laikas` time NOT NULL,
  `busena` varchar(30) NOT NULL,
  `sukurimo_data` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `pavadinimas` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vartotojai`
--

CREATE TABLE `vartotojai` (
  `vartotojo_id` int(11) NOT NULL,
  `vardas` varchar(50) NOT NULL,
  `pavarde` varchar(50) NOT NULL,
  `el_pastas` varchar(100) NOT NULL,
  `slaptazodzio_hash` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `reg_data` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bibliotekos`
--
ALTER TABLE `bibliotekos`
  ADD PRIMARY KEY (`bibliotekos_id`);

--
-- Indexes for table `iranga`
--
ALTER TABLE `iranga`
  ADD PRIMARY KEY (`irangos_id`),
  ADD UNIQUE KEY `pavadinimas` (`pavadinimas`);

--
-- Indexes for table `kambariai`
--
ALTER TABLE `kambariai`
  ADD PRIMARY KEY (`kambario_id`),
  ADD KEY `bibliotekos_id` (`bibliotekos_id`);

--
-- Indexes for table `kambario_iranga`
--
ALTER TABLE `kambario_iranga`
  ADD PRIMARY KEY (`kambario_irangos_id`),
  ADD KEY `kambario_id` (`kambario_id`,`irangos_id`),
  ADD KEY `irangos_id` (`irangos_id`);

--
-- Indexes for table `pranesimu_prenumeratos`
--
ALTER TABLE `pranesimu_prenumeratos`
  ADD PRIMARY KEY (`prenumeratos_id`),
  ADD KEY `vartotojo_id` (`vartotojo_id`),
  ADD KEY `kambario_id` (`kambario_id`);

--
-- Indexes for table `rezervacijos`
--
ALTER TABLE `rezervacijos`
  ADD PRIMARY KEY (`rezervacijos_id`),
  ADD KEY `vartotojo_id` (`vartotojo_id`,`kambario_id`),
  ADD KEY `kambario_id` (`kambario_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `pavadinimas` (`pavadinimas`);

--
-- Indexes for table `vartotojai`
--
ALTER TABLE `vartotojai`
  ADD PRIMARY KEY (`vartotojo_id`),
  ADD UNIQUE KEY `el_pastas` (`el_pastas`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bibliotekos`
--
ALTER TABLE `bibliotekos`
  MODIFY `bibliotekos_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `iranga`
--
ALTER TABLE `iranga`
  MODIFY `irangos_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kambariai`
--
ALTER TABLE `kambariai`
  MODIFY `kambario_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kambario_iranga`
--
ALTER TABLE `kambario_iranga`
  MODIFY `kambario_irangos_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pranesimu_prenumeratos`
--
ALTER TABLE `pranesimu_prenumeratos`
  MODIFY `prenumeratos_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rezervacijos`
--
ALTER TABLE `rezervacijos`
  MODIFY `rezervacijos_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vartotojai`
--
ALTER TABLE `vartotojai`
  MODIFY `vartotojo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kambariai`
--
ALTER TABLE `kambariai`
  ADD CONSTRAINT `kambariai_ibfk_1` FOREIGN KEY (`bibliotekos_id`) REFERENCES `bibliotekos` (`bibliotekos_id`);

--
-- Constraints for table `kambario_iranga`
--
ALTER TABLE `kambario_iranga`
  ADD CONSTRAINT `kambario_iranga_ibfk_1` FOREIGN KEY (`irangos_id`) REFERENCES `iranga` (`irangos_id`),
  ADD CONSTRAINT `kambario_iranga_ibfk_2` FOREIGN KEY (`kambario_id`) REFERENCES `kambariai` (`kambario_id`);

--
-- Constraints for table `pranesimu_prenumeratos`
--
ALTER TABLE `pranesimu_prenumeratos`
  ADD CONSTRAINT `pranesimu_prenumeratos_ibfk_1` FOREIGN KEY (`vartotojo_id`) REFERENCES `vartotojai` (`vartotojo_id`),
  ADD CONSTRAINT `pranesimu_prenumeratos_ibfk_2` FOREIGN KEY (`kambario_id`) REFERENCES `kambariai` (`kambario_id`);

--
-- Constraints for table `rezervacijos`
--
ALTER TABLE `rezervacijos`
  ADD CONSTRAINT `rezervacijos_ibfk_1` FOREIGN KEY (`vartotojo_id`) REFERENCES `vartotojai` (`vartotojo_id`),
  ADD CONSTRAINT `rezervacijos_ibfk_2` FOREIGN KEY (`kambario_id`) REFERENCES `kambariai` (`kambario_id`);

--
-- Constraints for table `vartotojai`
--
ALTER TABLE `vartotojai`
  ADD CONSTRAINT `vartotojai_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
