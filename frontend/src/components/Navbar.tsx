import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { useAuthContext } from "../Context/authContext";
import { useTranslation } from "react-i18next";

export default function Navbar() {
	const [hovered, setHovered] = useState<number | null>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);
	const { isAuthenticated } = useAuthContext();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const navItems = [
		{
			label: t("nav.village"),
			links: [
				{ label: t("nav.about"), path: "/About-Vathode" },
				{ label: t("gallery"), path: "/gallery" },
			],
		},
		{
			label: t("nav.gp"),
			links: [
				{ label: t("nav.members"), path: "/members" },
				{ label: t("nav.meetings"), path: "/meetings" },
				{ label: t("nav.schemes"), path: "/schemes" },
			],
		},
		{
			label: t("nav.citizen"),
			links: [{ label: t("nav.apply"), path: "/apply-for-certificates" }],
		},
		{
			label: t("nav.public"),
			links: [{ label: t("nav.notices"), path: "/notices" }],
		},
		{
			label: t("nav.help"),
			links: [{ label: t("nav.contact"), path: "/contact" }],
		},
	];

	const handleMobileDropdown = (idx: number) => {
		setMobileDropdown(mobileDropdown === idx ? null : idx);
	};

	return (
		<div className="relative z-50 w-full shadow-sm">
			{/* Header */}
			<div className="bg-white py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between px-4">
					<img src="/images/mhlogo.png" alt="Government Logo" className="h-16 w-auto" />

					{/* Center Content */}
					<div className="flex flex-col items-center flex-1">
						<img src="/images/panchyatlogo.png" alt="Panchayat Logo" className="h-12 mx-auto mb-1" />
						<h1 className="text-5xl text-yellow-800 font-semibold tracking-wide tiro-header">
							{t("header.title")}
						</h1>
						<p className="text-sm text-gray-500 italic">{t("header.subtitle")}</p>
					</div>

					{/* Right Side Buttons */}
					<div className="flex items-center gap-2">
						<img
							src="/images/azadi-ka-amrit-mahotsav-.jpg"
							alt="Other Logo"
							className="h-16 w-auto ml-2"
						/>

						{!isAuthenticated ? (
							<button
								onClick={() => navigate("/login")}
								className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-red-700 transition"
							>
								{t("header.login")}
							</button>
						) : (
							<span className="ml-2">
								<Link to="/dashboard" title={t("header.dashboard")}>
									<FaUser className="text-xl text-blue-600" />
								</Link>
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Hamburger for mobile */}
			<div className="md:hidden flex justify-end px-4 py-2 bg-white border-t border-gray-200">
				<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
					{mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
				</button>
			</div>

			{/* Welcome Line */}
			<div className="w-full flex justify-center bg-yellow-100 py-1 border-b border-yellow-300">
				<div className="overflow-hidden w-full max-w-3xl">
					<div className="animate-marquee whitespace-nowrap font-tiro-marathi text-blue-900 font-bold text-base md:text-lg">
						{t("header.welcome")}
					</div>
				</div>
			</div>

			{/* Desktop Navbar */}
			<nav className="hidden md:block bg-blue-900 border-t border-blue-900">
				<ul className="flex justify-center space-x-9 px-8 py-8 text-xl font-tiro-marathi text-white uppercase tracking-wide relative">
					<li>
						<Link
							to="/"
							className="flex items-center space-x-1 cursor-pointer hover:text-yellow-300 transition px-2 py-1"
						>
							मुखपृष्ठ
						</Link>
					</li>
					{navItems.map((item, idx) => (
						<li
							key={idx}
							className="relative"
							onMouseEnter={() => setHovered(idx)}
							onMouseLeave={() => setHovered(null)}
						>
							<>
								<div className="flex items-center space-x-1 cursor-pointer hover:text-yellow-300 transition">
									{item.label}
									<ChevronDown size={18} />
								</div>
								{/* Dropdown */}
								{hovered === idx && Array.isArray(item.links) && (
									<div className="absolute left-0 top-full w-56 bg-blue-800 bg-opacity-95 text-white rounded shadow-lg z-20">
										{item.links.map((link, linkIdx) => (
											<Link
												to={link.path}
												key={linkIdx}
												className="block px-4 py-3 hover:bg-blue-700 transition bg-transparent text-lg font-tiro-marathi"
											>
												{link.label}
											</Link>
										))}
									</div>
								)}
							</>
						</li>
					))}
				</ul>
			</nav>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="md:hidden fixed inset-0 z-50">
					<div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setMobileMenuOpen(false)} tabIndex={-1} />
					<div className="relative bg-white border-t border-gray-200 h-full shadow-lg p-4 z-50">
						<div className="flex flex-col space-y-2 text-yellow-900 font-medium uppercase tracking-wide">
							{navItems.map((item, idx) => (
								<div key={idx} className="relative">
									<button
										className="flex items-center justify-between w-full text-left px-4 py-2 text-sm font-medium text-yellow-900 uppercase tracking-wide hover:bg-yellow-100 transition"
										onClick={() => handleMobileDropdown(idx)}
									>
										<span>{item.label}</span>
										<ChevronDown size={18} className={`transition-transform ${mobileDropdown === idx ? "rotate-180" : ""}`} />
									</button>
									{mobileDropdown === idx && Array.isArray(item.links) && (
										<div className="pl-4">
											{item.links.map((link, linkIdx) => (
												<Link
													to={link.path}
													key={linkIdx}
													className="block px-2 py-2 text-sm hover:bg-yellow-100 rounded transition"
													onClick={() => setMobileMenuOpen(false)}
												>
													{link.label}
												</Link>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
