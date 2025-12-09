import GlassCard from "@components/common/GlassCard";
import { memo } from "react";

const imgApyChart =
	"http://localhost:3845/assets/a4960261af1735ca9addc547754068e9c3ed4b30.png";

const sideNav = [
	{ label: "仪表盘概览", active: false },
	{ label: "我的课程", active: false },
	{ label: "DeFi 理财", active: true },
	{ label: "收入分析", active: false },
	{ label: "设置", active: false },
];

const topStats = [
	{ label: "存款余额 (aUSDT)", value: "5,678", unit: "aUSDT", hint: "≈ $5,678 USDT" },
	{ label: "年化收益率", value: "3.85%", accent: "#22c55e", hint: "实时更新自 Aave 协议" },
	{ label: "累计收益 (USDT)", value: "234", unit: "USDT", hint: "自首次存款以来总收益" },
];

const poolFacts = [
	{ label: "池子总流动性", value: "$45.2M" },
	{ label: "利用率", value: "78.5%" },
	{ label: "存款 APY", value: "3.85%", accent: "#22c55e" },
];

const ops = [
	{ type: "存款", amount: "2,500 USDT", status: "成功", time: "2024-03-15" },
	{ type: "提现", amount: "500 USDT", status: "成功", time: "2024-03-10" },
	{ type: "存款", amount: "3,178 USDT", status: "成功", time: "2024-02-28" },
];

const Creator = () => {
	return (
		<div className="mx-auto flex max-w-[1180px] gap-8 px-4 py-10 text-slate-800">
			<aside className="hidden w-44 shrink-0 flex-col gap-3 rounded-xl border border-white/70 bg-white/70 p-4 text-sm font-medium text-slate-700 shadow-[0_8px_24px_rgba(27,107,147,0.08),0_4px_12px_rgba(27,107,147,0.05)] backdrop-blur lg:flex">
				{sideNav.map((item) => (
					<div
						key={item.label}
						className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
							item.active ? "bg-[#1b6b93] text-white" : "hover:bg-slate-100"
						}`}
					>
						<span>{item.label}</span>
					</div>
				))}
			</aside>

			<main className="flex-1 space-y-8">
				<header>
					<h1 className="text-2xl font-semibold text-slate-900">DeFi 理财总览</h1>
				</header>

				<section className="grid gap-4 lg:grid-cols-3">
					{topStats.map((card) => (
						<GlassCard key={card.label} className="p-5">
							<div className="flex items-center justify-between text-sm text-slate-600">
								<span>{card.label}</span>
							</div>
							<div className="mt-4 flex items-baseline gap-2">
								<div
									className="text-3xl font-semibold"
									style={card.accent ? { color: card.accent } : undefined}
								>
									{card.value}
								</div>
								{card.unit ? <span className="text-sm text-slate-500">{card.unit}</span> : null}
							</div>
							<div className="mt-2 text-sm text-slate-500">{card.hint}</div>
						</GlassCard>
					))}
				</section>

				<section className="grid gap-6 lg:grid-cols-2">
					<GlassCard title="快速操作" className="p-0">
						<div className="space-y-4 px-6 pb-6 pt-1">
							<div className="rounded-lg bg-[rgba(27,107,147,0.04)] p-4 text-sm text-slate-700">
								<div className="flex items-center gap-2 text-base font-semibold text-slate-900">
									<span>YD</span>
									<span className="text-xs text-slate-500">→</span>
									<span>USDT</span>
									<span className="text-xs text-slate-500">→</span>
									<span>Aave</span>
								</div>
								<p className="mt-2 text-xs text-slate-500">自动完成三步操作</p>
							</div>
							<div className="grid gap-3">
								<div className="space-y-1">
									<p className="text-sm text-slate-600">当前可用 YD 余额</p>
									<p className="text-xl font-semibold text-slate-900">1,234 YD</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm text-slate-600">预估可兑换 USDT</p>
									<p className="text-lg font-semibold text-[#1b6b93]">≈ 2,468 USDT</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm text-slate-600">预估年化收益</p>
									<p className="text-lg font-semibold text-green-500">≈ 95 USDT/年</p>
								</div>
							</div>
							<button className="w-full rounded-lg bg-[#1b6b93] py-3 text-sm font-semibold text-white transition hover:brightness-95">
								一键理财
							</button>
							<div className="rounded-lg bg-[rgba(27,107,147,0.05)] p-3 text-xs text-slate-600">
								将 YD 收入自动兑换为 USDT 并存入 Aave，获得稳定收益。包含智能合约 Gas 费用，需要钱包授权。
							</div>
						</div>
					</GlassCard>

					<GlassCard title="提现管理" className="p-0">
						<div className="space-y-4 px-6 pb-6 pt-1 text-sm text-slate-700">
							<div className="flex items-center justify-between">
								<span>本金数额</span>
								<span className="text-base font-semibold text-slate-900">5,444 USDT</span>
							</div>
							<div className="flex items-center justify-between">
								<span>利息数额</span>
								<span className="text-base font-semibold text-green-500">+234 USDT</span>
							</div>
							<div className="flex items-center justify-between border-t border-gray-200 pt-3">
								<span className="text-base font-semibold text-slate-900">总计可提取</span>
								<span className="text-lg font-semibold text-[#1b6b93]">5,678 USDT</span>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-slate-600">提现数量</p>
								<div className="flex gap-3">
									<input
										className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[#1b6b93] focus:ring-1 focus:ring-[#1b6b93]/30"
										placeholder="输入提现数量"
									/>
									<button className="rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm font-semibold text-[#1b6b93]">
										最大
									</button>
								</div>
								<p className="text-xs text-slate-500">提现后剩余：0 USDT</p>
							</div>
							<button className="w-full rounded-lg bg-[#2e8a9f] py-3 text-sm font-semibold text-white transition hover:brightness-95">
								提现到钱包
							</button>
							<div className="rounded-lg bg-[rgba(46,138,159,0.05)] p-3 text-xs text-slate-600">
								提现无手续费(仅 Gas)，资金即时到账，提现后停止产生对应部分的利息。
							</div>
						</div>
					</GlassCard>
				</section>

				<section className="grid gap-6">
					<GlassCard title="协议信息" className="p-0">
						<div className="grid gap-6 px-6 pb-6 pt-1 lg:grid-cols-2">
							<div className="space-y-4 text-sm text-slate-700">
								<div className="space-y-3">
									<p className="text-base font-semibold text-slate-900">Aave USDT 池详情</p>
									<div className="space-y-2">
										{poolFacts.map((item) => (
											<div key={item.label} className="flex items-center justify-between">
												<span>{item.label}</span>
												<span
													className="font-semibold"
													style={item.accent ? { color: item.accent } : undefined}
												>
													{item.value}
												</span>
											</div>
										))}
									</div>
								</div>
								<div className="space-y-1 text-[#1b6b93]">
									<p className="cursor-pointer hover:underline">Aave V3 协议链接 →</p>
									<p className="cursor-pointer hover:underline">审计报告链接 →</p>
								</div>
							</div>
							<div className="space-y-3">
								<p className="text-base font-semibold text-slate-900">APY 历史走势</p>
								<div className="overflow-hidden rounded-lg border border-gray-200 bg-white/80">
									<img src={imgApyChart} alt="APY chart" className="h-52 w-full object-cover" />
								</div>
							</div>
						</div>
						<div className="mt-2 rounded-lg border-l-4 border-[#fdc700] bg-yellow-50 px-4 py-3 text-sm text-[#a65f00]">
							智能合约存在技术风险。Aave 协议经多次审计，TVL 超过 $10B，建议分散风险，不要将全部资产存入单一协议。
						</div>
					</GlassCard>

					<div className="grid gap-6 lg:grid-cols-2">
						<GlassCard title="操作历史" className="p-0">
							<div className="flex justify-end px-6 pt-1">
								<button className="rounded-lg border border-gray-200 bg-white/80 px-4 py-2 text-sm font-semibold text-[#1b6b93]">
									查看全部
								</button>
							</div>
							<div className="px-6 pb-5">
								<div className="grid grid-cols-[1.1fr_1.1fr_0.7fr_1fr] border-b border-gray-200 pb-3 text-sm font-semibold text-slate-600">
									<span>操作类型</span>
									<span>数量</span>
									<span>状态</span>
									<span>时间</span>
								</div>
								<div className="divide-y divide-gray-200 text-sm">
									{ops.map((row) => (
										<div key={`${row.type}-${row.time}`} className="grid grid-cols-[1.1fr_1.1fr_0.7fr_1fr] py-3 text-slate-700">
											<span className="font-semibold text-slate-900">{row.type}</span>
											<span className="font-semibold text-slate-900">{row.amount}</span>
											<span className="text-green-600">{row.status}</span>
											<span className="text-slate-600">{row.time}</span>
										</div>
									))}
								</div>
							</div>
						</GlassCard>

						<GlassCard title="收益模拟器" className="p-0">
							<div className="space-y-4 px-6 pb-6 pt-1 text-sm text-slate-700">
								<div className="space-y-2">
									<p className="text-sm text-slate-600">存款金额 (USDT)</p>
									<div className="rounded-lg border border-gray-200 bg-white/80 px-3 py-3 text-base text-slate-500">
										1000
									</div>
								</div>
								<div className="space-y-2">
									<p className="text-sm text-slate-600">存款期限</p>
									<div className="rounded-lg border border-gray-200 bg-white/80 px-3 py-3 text-base text-slate-900">
										1 个月
									</div>
								</div>
								<div className="space-y-2">
									<p className="text-sm text-slate-600">假设 APY (%)</p>
									<div className="rounded-lg border border-gray-200 bg-white/80 px-3 py-3 text-base text-slate-500">
										3.85
									</div>
								</div>

								<div className="rounded-lg bg-[rgba(78,205,196,0.12)] p-4 text-sm text-slate-700">
									<div className="flex items-center justify-between">
										<span>预估利息收益</span>
										<span className="font-semibold text-green-600">+19.25 USDT</span>
									</div>
									<div className="flex items-center justify-between">
										<span>到期总额</span>
										<span className="font-semibold text-slate-900">1,019.25 USDT</span>
									</div>
									<div className="flex items-center justify-between">
										<span>日均收益</span>
										<span className="font-semibold text-[#4ecdc4]">0.105 USDT</span>
									</div>
								</div>
								<div className="rounded-lg bg-[rgba(78,205,196,0.06)] p-3 text-xs text-slate-600">
									仅供参考，实际收益随 APY 浮动变化，计算基于复利模式。
								</div>
							</div>
						</GlassCard>
					</div>
				</section>
			</main>
		</div>
	);
};

export default memo(Creator);

