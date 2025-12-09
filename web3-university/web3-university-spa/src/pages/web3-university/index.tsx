import { memo, type ReactNode } from "react";

const imgSoliditySmartContractDevelopmentCourseWithBlockchainBackgroundAndCodeSnippets =
	"http://localhost:3845/assets/0d1806a7c72d1446e078cc7c358c51f69610bbc2.png";
const imgDeFiProtocolInterfaceShowingLiquidityPoolsAndYieldFarmingDashboard =
	"http://localhost:3845/assets/efc344423554e9a454105d7f7eb4d9012c8bfb0c.png";
const imgWeb3FrontendDevelopmentSetupWithReactAndBlockchainIntegrationCode =
	"http://localhost:3845/assets/c8057348a70095409bc59af32d314ed039516469.png";
const imgNftMarketplaceInterfaceShowingDigitalArtCollectionAndTradingFeatures =
	"http://localhost:3845/assets/91d712fb84389ae758505de5009a886bd25e8e32.png";
const imgBlockchainNetworkVisualizationWithNodesAndCryptographicSecurityElements =
	"http://localhost:3845/assets/b149511e59ed96b0ee9a4c57eaf4838ba01b591f.png";
const imgDaoGovernanceInterfaceWithVotingProposalsAndCommunityParticipationDashboard =
	"http://localhost:3845/assets/afbadf9b624c5180b36f51cb03adddf579fbee91.png";

type CourseCard = {
	title: string;
	tag: string;
	tagColor: string;
	description: string;
	author: string;
	price: string;
	students: string;
	image: string;
};

type FeatureItem = {
	title: string;
	desc: string[];
	accent: string;
	icon: ReactNode;
};

const courseCards: CourseCard[] = [
	{
		title: "Solidity 从入门到精通",
		tag: "智能合约",
		tagColor: "#1c7c54",
		description:
			"全面学习 Solidity 语言，掌握智能合约开发核心技能，包含实战项目案例。",
		author: "0x1234...abcd",
		price: "299 YD",
		students: "1,234",
		image:
			imgSoliditySmartContractDevelopmentCourseWithBlockchainBackgroundAndCodeSnippets,
	},
	{
		title: "DeFi 协议深度解析",
		tag: "DeFi",
		tagColor: "#5fbfbf",
		description:
			"深入理解 DeFi 生态，学习流动性挖矿、借贷协议等核心机制。",
		author: "0x5678...efgh",
		price: "399 YD",
		students: "856",
		image: imgDeFiProtocolInterfaceShowingLiquidityPoolsAndYieldFarmingDashboard,
	},
	{
		title: "Web3 前端开发实战",
		tag: "Web3 开发",
		tagColor: "#4a9b8c",
		description:
			"使用 React 和 Web3.js 构建去中心化应用前端，连接钱包和智能合约。",
		author: "0x9abc...ijkl",
		price: "199 YD",
		students: "2,156",
		image:
			imgWeb3FrontendDevelopmentSetupWithReactAndBlockchainIntegrationCode,
	},
	{
		title: "NFT 市场开发指南",
		tag: "NFT",
		tagColor: "#8c8c8c",
		description:
			"从零构建 NFT 交易平台，涵盖智能合约、前端界面和元数据管理。",
		author: "0xdef0...mnop",
		price: "499 YD",
		students: "678",
		image:
			imgNftMarketplaceInterfaceShowingDigitalArtCollectionAndTradingFeatures,
	},
	{
		title: "区块链技术基础",
		tag: "区块链基础",
		tagColor: "#1c7c54",
		description: "掌握共识机制、密码学与去中心化原理，构建坚实的区块链基础。",
		author: "0x2468...qrst",
		price: "149 YD",
		students: "3,247",
		image:
			imgBlockchainNetworkVisualizationWithNodesAndCryptographicSecurityElements,
	},
	{
		title: "DAO 治理机制设计",
		tag: "DAO 治理",
		tagColor: "#5fbfbf",
		description: "学习去中心化自治组织的设计原则、投票机制与社区治理实践。",
		author: "0xaced...uvwx",
		price: "349 YD",
		students: "924",
		image:
			imgDaoGovernanceInterfaceWithVotingProposalsAndCommunityParticipationDashboard,
	},
];

const featureItems: FeatureItem[] = [
	{
		title: "链上透明",
		desc: ["所有交易记录永久保存在区块链上，完全透明可验证，确保公平公正。"],
		accent: "bg-[rgba(28,124,84,0.1)] text-emerald-700",
		icon: (
			<svg
				aria-hidden
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="size-6"
			>
				<path d="M12 2a1 1 0 0 1 .6.2l8 6A1 1 0 0 1 21 10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a1 1 0 0 1 .4-.8l8-6A1 1 0 0 1 12 2Zm-7 8.4V18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7.6l-7-5.25V8a1 1 0 0 1-2 0V5.15Z" />
				<path d="M8.7 14.7a1 1 0 0 1 1.4 0l.9.9 3.6-3.6a1 1 0 1 1 1.4 1.4l-4.3 4.3a1 1 0 0 1-1.4 0l-1.6-1.6a1 1 0 0 1 0-1.4Z" />
			</svg>
		),
	},
	{
		title: "NFT 确权",
		desc: ["课程以 NFT 形式发行，真正拥有，可转让、收藏或用于其他用途。"],
		accent: "bg-[rgba(95,191,191,0.1)] text-cyan-700",
		icon: (
			<svg
				aria-hidden
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="size-6"
			>
				<path d="M12 2a2 2 0 0 1 1.7 1l7 12a2 2 0 0 1 0 2 2 2 0 0 1-1.7 1H5a2 2 0 0 1-1.7-3l7-12A2 2 0 0 1 12 2Zm0 2-7 12h14Z" />
				<path d="M12 9a1 1 0 0 1 1 1v3.5a1 1 0 1 1-2 0V10a1 1 0 0 1 1-1Zm0 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
			</svg>
		),
	},
	{
		title: "创作者友好",
		desc: ["创作者获得 95% 的课程销售收入，平台仅收取 5% 手续费，最大化创作激励。"],
		accent: "bg-[rgba(74,155,140,0.1)] text-emerald-700",
		icon: (
			<svg
				aria-hidden
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="size-6"
			>
				<path d="M12 3a6 6 0 0 1 6 6c0 5.25-5.4 9.4-5.6 9.56a1 1 0 0 1-1.2 0C11 18.4 5 14.25 5 9a6 6 0 0 1 7-6Zm0 2a4 4 0 0 0-4 4c0 3.07 2.72 6.17 4 7.48 1.28-1.3 4-4.4 4-7.48a4 4 0 0 0-4-4Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
			</svg>
		),
	},
	{
		title: "DeFi 理财",
		desc: ["课程收入自动投入 DeFi 协议进行增值，让知识投资持续产生收益。"],
		accent: "bg-[rgba(140,140,140,0.12)] text-slate-700",
		icon: (
			<svg
				aria-hidden
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="size-6"
			>
				<path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 2a7 7 0 1 1-7 7 7 7 0 0 1 7-7Zm0 2a1 1 0 0 1 .9.56l2 4a1 1 0 1 1-1.8.88L12 9.38l-.9 1.8a1 1 0 0 1-1.8-.88l2-4A1 1 0 0 1 12 7Zm-3 8a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V16a1 1 0 0 1 1-1Zm6 0a1 1 0 0 1 1 1v.01a1 1 0 1 1-2 0V16a1 1 0 0 1 1-1Z" />
			</svg>
		),
	},
];

const SearchIcon = () => (
	<svg
		aria-hidden
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		className="size-5 text-slate-400"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
		/>
	</svg>
);

const UserIcon = () => (
	<svg
		aria-hidden
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="size-4 text-slate-500"
	>
		<path d="M12 2a5 5 0 0 1 1 9.9V13h4a2 2 0 0 1 2 2v4a1 1 0 1 1-2 0v-4h-4v4a1 1 0 1 1-2 0v-4H7v4a1 1 0 0 1-2 0v-4a2 2 0 0 1 2-2h4v-1.1A5 5 0 0 1 12 2Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
	</svg>
);

const CourseCardItem = ({
	title,
	tag,
	tagColor,
	description,
	author,
	price,
	students,
	image,
}: CourseCard) => (
	<div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_14px_40px_rgba(31,38,135,0.08),0_6px_18px_rgba(31,38,135,0.05)] backdrop-blur transition duration-300 hover:-translate-y-1">
		<div className="relative h-44 overflow-hidden">
			<img
				src={image}
				alt={title}
				className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
				loading="lazy"
			/>
			<span
				className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
				style={{ backgroundColor: tagColor }}
			>
				{tag}
			</span>
		</div>
		<div className="space-y-3 p-5">
			<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
			<p className="min-h-[42px] text-sm leading-relaxed text-slate-600">
				{description}
			</p>
			<div className="flex items-center justify-between text-sm text-slate-500">
				<span>创作者: {author}</span>
				<span className="font-semibold text-[#1b6b93]">{price}</span>
			</div>
			<div className="flex items-center gap-2 text-sm text-slate-500">
				<UserIcon />
				<span>{students} 学员</span>
			</div>
			<button
				type="button"
				className="flex w-full items-center justify-center rounded-xl bg-[#1b6b93] py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(27,107,147,0.35)] transition hover:brightness-95"
			>
				查看详情
			</button>
		</div>
	</div>
);

const FeatureCard = ({ title, desc, accent, icon }: FeatureItem) => (
	<div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-6 text-center shadow-[0px_8px_32px_rgba(31,38,135,0.08),0px_4px_16px_rgba(31,38,135,0.05)] backdrop-blur">
		<div
			className={`mx-auto mb-6 flex size-14 items-center justify-center rounded-full ${accent}`}
		>
			{icon}
		</div>
		<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
		<p className="mt-3 text-sm leading-relaxed text-slate-600">
			{desc.join(" ")}
		</p>
	</div>
);

const Web3UniversityPage = () => {
	return (
		<div className="relative isolate">
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-[#f2f6f4] to-[#eef3f7]" />
			<div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-emerald-200/45 blur-3xl" />
			<div className="pointer-events-none absolute right-0 top-12 h-56 w-56 rounded-full bg-slate-200/60 blur-3xl" />

			<div className="relative mx-auto max-w-[1280px] px-6 pb-20 pt-12">
				<section className="flex flex-col items-center gap-5 text-center">
					<h1 className="text-[32px] font-semibold leading-tight text-slate-900 md:text-4xl">
						透明化知识付费 + DeFi 理财
					</h1>
					<p className="max-w-3xl text-lg leading-relaxed text-slate-600">
						基于区块链技术的去中心化课程平台，让学习更透明，让创作更有价值，让收益自动增长
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<button
							type="button"
							className="rounded-full bg-[#1b6b93] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(27,107,147,0.35)] transition hover:brightness-95"
						>
							浏览课程
						</button>
						<button
							type="button"
							className="rounded-full border border-[#1b6b93]/30 bg-white/80 px-8 py-3 text-sm font-semibold text-[#1b6b93] shadow-sm transition hover:border-[#1b6b93]/50"
						>
							成为创作者
						</button>
					</div>
				</section>

				<section className="mt-10">
					<div className="flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/85 p-5 shadow-[0_12px_32px_rgba(31,38,135,0.08),0_4px_16px_rgba(31,38,135,0.05)] backdrop-blur md:flex-row md:items-center md:justify-between md:gap-6">
						<div className="flex w-full items-center gap-3 md:w-[46%]">
							<div className="flex size-10 items-center justify-center rounded-full bg-slate-100">
								<SearchIcon />
							</div>
							<input
								type="text"
								placeholder="搜索课程标题或关键词..."
								className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#1b6b93] focus:ring-2 focus:ring-[#1b6b93]/15"
							/>
						</div>
						<div className="grid w-full gap-3 md:w-[54%] md:grid-cols-2">
							<button
								type="button"
								className="rounded-xl border border-slate-200 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#1b6b93]/40 hover:text-[#1b6b93]"
							>
								所有分类
							</button>
							<button
								type="button"
								className="rounded-xl border border-slate-200 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#1b6b93]/40 hover:text-[#1b6b93]"
							>
								最新发布
							</button>
						</div>
					</div>
				</section>

				<section
					id="courses"
					className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
				>
					{courseCards.map((course) => (
						<CourseCardItem key={course.title} {...course} />
					))}
				</section>

				<section id="why" className="mt-16 space-y-6">
					<div className="text-center">
						<h2 className="text-3xl font-semibold text-slate-900">为什么选择 CourseFi</h2>
						<p className="mt-3 text-lg text-slate-600">
							革新性的区块链教育平台，为学习者和创作者提供更好的体验
						</p>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{featureItems.map((item) => (
							<FeatureCard key={item.title} {...item} />
						))}
					</div>
				</section>
			</div>

			<footer className="border-t border-white/70 bg-white/80 backdrop-blur">
				<div className="mx-auto max-w-[1280px] px-6 py-12">
					<div className="grid gap-10 md:grid-cols-3">
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-lg font-semibold text-emerald-600 shadow-sm">
									C
								</div>
								<span className="text-xl font-bold text-emerald-700">CourseFi</span>
							</div>
							<p className="text-sm leading-relaxed text-slate-600">
								基于区块链技术的去中心化知识付费平台，让学习更透明，让创作更有价值，让收益自动增长。
							</p>
							<div className="flex items-center gap-3 text-slate-500">
								<span className="text-sm">Twitter</span>
								<span className="text-sm">Discord</span>
								<span className="text-sm">Telegram</span>
								<span className="text-sm">Medium</span>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-base font-semibold text-slate-900">相关链接</h3>
							<ul className="space-y-3 text-sm text-slate-600">
								<li>白皮书</li>
								<li>智能合约</li>
								<li>开发文档</li>
								<li>GitHub</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="text-base font-semibold text-slate-900">社区</h3>
							<ul className="space-y-3 text-sm text-slate-600">
								<li>Twitter</li>
								<li>Discord</li>
								<li>Telegram</li>
								<li>Medium</li>
							</ul>
						</div>
					</div>
					<div className="mt-10 border-t border-white/70 pt-6 text-center text-sm text-slate-500">
						© 2024 CourseFi. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
};

export default memo(Web3UniversityPage);
