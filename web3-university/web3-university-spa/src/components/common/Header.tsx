import { memo, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
	{ label: "课程市场", href: "/" },
	{ label: "代币兑换", href: "/swap" },
	{ label: "创作者中心", href: "/creator" },
];

const LogoMark = () => (
	<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-lg font-semibold text-emerald-700 shadow-[0_8px_24px_rgba(16,185,129,0.18)] ring-1 ring-white/70">
		C
	</span>
);

const WalletIcon = () => (
	<svg
		aria-hidden
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		className="size-4 text-emerald-600"
		fill="currentColor"
	>
		<path d="M19 7h-1V6a2 2 0 0 0-2-2H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-4-1a1 1 0 0 1 1 1v1H5a2 2 0 0 0-2 2V7a2 2 0 0 1 2-2h10Zm5 12a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-3h17Zm0-5H3v-2a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1Z" />
	</svg>
);

const Header = () => {
	const { pathname } = useLocation();
	const accentColor = "#1b6b93";
	const accentBg = "bg-[#1b6b93]";

	const isActive = useMemo(
		() => (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href)),
		[pathname],
	);

	return (
		<header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.08),0_4px_16px_rgba(31,38,135,0.05)] backdrop-blur-xl">
			<div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-3">
				<div className="flex items-center gap-3">
					<LogoMark />
					<span className="text-xl font-bold" style={{ color: accentColor }}>
						CourseFi
					</span>
				</div>

				<nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
					{navItems.map((item) => (
						<Link
							key={item.label}
							to={item.href}
							className={`relative pb-1 transition ${
								isActive(item.href)
									? "text-slate-900 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-current"
									: "text-slate-600 hover:text-slate-900"
							}`}
							style={isActive(item.href) ? { color: accentColor } : undefined}
							aria-current={isActive(item.href) ? "page" : undefined}
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
						<WalletIcon />
						<span>2,458 YD</span>
					</div>
					<button
						type="button"
						className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition hover:brightness-95 ${accentBg}`}
					>
						Connect Wallet
					</button>
				</div>
			</div>
		</header>
	);
};

export default memo(Header);
