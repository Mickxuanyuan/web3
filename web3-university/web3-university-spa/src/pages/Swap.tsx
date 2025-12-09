import GlassCard from "@components/common/GlassCard";
import { memo } from "react";

type HistoryItem = {
	direction: string;
	detail: string;
	time: string;
	hash: string;
	accent: "mint" | "blue";
};

const balances = [
	{ label: "USDT", value: "5,000" },
	{ label: "YD", value: "1,234" },
	{ label: "ETH", value: "2.5" },
];

const quickActions = ["购买 USDT", "查看交易历史"];

const instructions = [
	"连接钱包",
	"选择兑换方向和输入数量",
	"检查汇率和滑点",
	"授权并确认交易",
];

const risks = [
	"价格由 Uniswap 市场决定，存在滑点风险",
	"交易需支付以太坊 Gas 费",
	"建议设置合理的滑点容忍度",
];

const histories: HistoryItem[] = [
	{
		direction: "USDT → YD",
		detail: "100 USDT = 325 YD",
		time: "2024-01-15 14:30",
		hash: "0x1a2b...cd3e",
		accent: "mint",
	},
	{
		direction: "YD → USDT",
		detail: "650 YD = 200 USDT",
		time: "2024-01-14 09:15",
		hash: "0x5f6a...b789",
		accent: "blue",
	},
	{
		direction: "USDT → YD",
		detail: "50 USDT = 162.5 YD",
		time: "2024-01-13 16:45",
		hash: "0x9c8d...ef12",
		accent: "mint",
	},
];

const Divider = () => <div className="h-px w-full bg-gray-200" />;

const Dot = ({ color = "#1b6b93" }: { color?: string }) => (
	<span className="inline-block size-2 rounded-full" style={{ backgroundColor: color }} />
);

const Swap = () => {
	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-4 py-10 text-slate-800">
			<header className="text-center">
				<h1 className="text-xl font-semibold text-slate-900">代币兑换中心</h1>
			</header>

			<div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
				<GlassCard className="p-0">
					<div className="px-6 pt-5 text-base font-semibold text-slate-900">代币兑换</div>
					<div className="space-y-4 px-6 pb-6 pt-3">
						<section className="space-y-2">
							<label className="text-sm font-medium text-slate-600">兑换</label>
							<div className="rounded-lg border border-gray-200 bg-gray-50">
								<div className="flex items-center justify-between px-4 py-3">
									<div className="flex items-center gap-2 text-base font-semibold text-slate-900">
										<span>USDT</span>
										<Dot color="#52c59c" />
									</div>
									<button className="text-sm font-medium text-[#1b6b93]">最大</button>
								</div>
								<div className="px-4 pb-1">
									<div className="text-2xl font-semibold text-slate-400">0.00</div>
									<div className="text-sm text-slate-500">≈ 5,000 USDT</div>
								</div>
								<div className="px-4 pb-3 text-xs text-slate-500">余额: 5,000 USDT</div>
							</div>
						</section>

						<div className="flex justify-center">
							<button className="flex size-10 items-center justify-center rounded-lg border border-gray-200 bg-white">
								<svg
									aria-hidden
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									className="size-5 text-slate-500"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6-6 6 6" />
									<path strokeLinecap="round" strokeLinejoin="round" d="m18 15-6 6-6-6" />
								</svg>
							</button>
						</div>

						<section className="space-y-2">
							<label className="text-sm font-medium text-slate-600">兑换为</label>
							<div className="rounded-lg border border-gray-200 bg-gray-50">
								<div className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-slate-900">
									<span>YD</span>
									<Dot color="#1b6b93" />
								</div>
								<div className="px-4 pb-1">
									<div className="text-2xl font-semibold text-slate-400">0.00</div>
								</div>
								<div className="px-4 pb-3 text-xs text-slate-500">余额: 1,234 YD</div>
							</div>
						</section>

						<div className="rounded-lg bg-[rgba(46,138,159,0.08)] p-4 text-sm text-slate-700">
							<div className="flex items-center justify-between">
								<span>汇率</span>
								<span className="font-semibold text-slate-900">1 USDT = 3.25 YD</span>
							</div>
							<div className="flex items-center justify-between">
								<span>滑点容忍度</span>
								<span className="font-semibold text-[#1b6b93]">0.5%</span>
							</div>
							<div className="flex items-center justify-between">
								<span>价格影响</span>
								<span className="font-semibold text-slate-900">&lt; 0.01%</span>
							</div>
							<div className="flex items-center justify-between">
								<span>预估 Gas 费用</span>
								<span className="font-semibold text-slate-900">~$12</span>
							</div>
							<div className="flex items-center justify-between">
								<span>流动性提供方</span>
								<span className="font-semibold text-[#1b6b93]">Uniswap V3</span>
							</div>
						</div>

						<button className="w-full rounded-lg bg-[#1b6b93] py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95">
							兑换
						</button>
					</div>
				</GlassCard>

				<div className="flex flex-col gap-6">
					<GlassCard title="钱包资产概览" className="p-0">
						<div className="space-y-3">
							{balances.map((item) => (
								<div key={item.label} className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2 text-slate-700">
										<Dot color={item.label === "YD" ? "#1b6b93" : "#52c59c"} />
										<span>{item.label}</span>
									</div>
									<span className="font-semibold text-slate-900">{item.value}</span>
								</div>
							))}
						</div>
					</GlassCard>

					<GlassCard title="快捷操作" className="p-0">
						<div className="flex flex-col gap-3">
							{quickActions.map((action) => (
								<button
									key={action}
									className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-[#1b6b93] transition hover:border-[#1b6b93]/40"
								>
									{action}
								</button>
							))}
						</div>
					</GlassCard>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<GlassCard title="如何兑换" className="p-0">
					<div className="space-y-3 text-sm text-slate-700">
						{instructions.map((text, idx) => (
							<div key={text} className="flex items-start gap-3">
								<span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1b6b93] text-xs font-semibold text-white">
									{idx + 1}
								</span>
								<span>{text}</span>
							</div>
						))}
					</div>
				</GlassCard>

				<GlassCard title="风险提示" className="p-0">
					<div className="space-y-3 text-sm text-slate-700">
						{risks.map((text) => (
							<div key={text} className="flex items-start gap-3">
								<Dot color="#f59e0b" />
								<span>{text}</span>
							</div>
						))}
					</div>
					<div className="pt-4 text-sm font-semibold text-[#1b6b93]">
						<span className="mr-4 cursor-pointer hover:underline">Uniswap 协议</span>
						<span className="cursor-pointer hover:underline">审计报告</span>
					</div>
				</GlassCard>
			</div>

			<GlassCard title="最近交易记录" className="p-0">
				<div className="divide-y divide-gray-200">
					{histories.map((item, idx) => (
						<div key={item.hash} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-3">
								<div
									className={`rounded-lg px-2 py-1 text-xs font-semibold ${
										item.accent === "mint"
											? "bg-[rgba(78,205,196,0.12)] text-[#36a18c]"
											: "bg-[rgba(27,107,147,0.12)] text-[#1b6b93]"
									}`}
								>
									{item.direction}
								</div>
								<div className="text-sm text-slate-700">{item.detail}</div>
							</div>
							<div className="text-right text-sm text-slate-600">
								<div>{item.time}</div>
								<div className="text-[#1b6b93]">{item.hash}</div>
							</div>
						</div>
					))}
				</div>
			</GlassCard>
		</div>
	);
};

export default memo(Swap);

