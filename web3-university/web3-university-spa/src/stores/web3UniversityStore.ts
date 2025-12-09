import { useImmer } from "@hooks/useImmer";
import { useMemo } from "react";

export type ProgramStat = {
  label: string;
  value: string;
  helper: string;
  tone: string;
};

export type FocusArea = {
  id: string;
  label: string;
  description: string;
  active: boolean;
};

export type TrackModule = {
  title: string;
  detail: string;
  tag: string;
};

export type LearningTrack = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  duration: string;
  gradient: string;
  description: string;
  modules: TrackModule[];
  toolkits: string[];
  outcomes: string[];
};

export type SpotlightProject = {
  title: string;
  chain: string;
  focus: string;
  progress: string;
  detail: string;
  accent: string;
};

export type Web3UniversityState = {
  stats: ProgramStat[];
  focusAreas: FocusArea[];
  tracks: LearningTrack[];
  spotlight: SpotlightProject[];
  selectedTrackId: string;
};

const trackSeed: LearningTrack[] = [
  {
    id: "builder",
    title: "Builder Track",
    subtitle: "从 0 到 1 上链",
    badge: "主网可交付",
    duration: "12 周强化",
    gradient: "from-indigo-600 via-blue-600 to-emerald-500",
    description: "以产品思维完成一款可上线的 Web3 应用，涵盖钱包交互、Gas 优化与安全基线。",
    modules: [
      { title: "合约设计", detail: "Solidity 模块化设计、Foundry 测试与安全基线", tag: "Week 1-3" },
      { title: "前后端协作", detail: "Ethers、账户抽象、Gas 经济模型与监控", tag: "Week 4-6" },
      { title: "主网验证", detail: "测试网演练、审计清单、主网发布与运营仪表盘", tag: "Week 7-12" },
    ],
    toolkits: ["Solidity", "Foundry", "Ethers v6", "Account Abstraction", "The Graph"],
    outcomes: ["完成一款可演示的 DApp", "具备主网发布流程经验", "形成安全与监控基线"],
  },
  {
    id: "research",
    title: "Research Track",
    subtitle: "协议研究与复现",
    badge: "白皮书实战",
    duration: "8 周深潜",
    gradient: "from-purple-600 via-fuchsia-600 to-blue-500",
    description: "拆解主流 DeFi/NFT 协议，复现核心数学模型并撰写研究报告，兼具工程与论文思路。",
    modules: [
      { title: "协议拆解", detail: "AMM、LSD、Perp、Restaking 设计空间与对比", tag: "Week 1-2" },
      { title: "模型复现", detail: "用 TypeScript/Foundry 复现核心曲线、预言机与风险参数", tag: "Week 3-5" },
      { title: "研究交付", detail: "写作框架、数据可视化、答辩与同行评审", tag: "Week 6-8" },
    ],
    toolkits: ["Dune/Flipside", "Python/TS", "Foundry Script", "NumPy", "Notion Lab Book"],
    outcomes: ["完成一篇可公开的研究报告", "掌握协议复现方法论", "积累行业评审素材"],
  },
  {
    id: "ecosystem",
    title: "Ecosystem Track",
    subtitle: "链上生态落地",
    badge: "伙伴共建",
    duration: "6 周冲刺",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    description: "与公链与生态伙伴联动，快速完成特定链上的用例验证，拿到技术支持与资助渠道。",
    modules: [
      { title: "生态定位", detail: "目标公链特性、账户体系、RPC 性能与合约模板", tag: "Week 1-2" },
      { title: "场景打磨", detail: "结合伙伴场景完成 PoC，API 网关与观察者设计", tag: "Week 3-4" },
      { title: "路演交付", detail: "Demo Day、生态提案、Grants 申请材料准备", tag: "Week 5-6" },
    ],
    toolkits: ["EVM/L2 RPC", "GraphQL API", "Subgraphs", "Chainlink", "Grants Toolkit"],
    outcomes: ["完成生态 PoC 并路演", "对接技术支持与 BD 渠道", "准备好 Grants/提案材料"],
  },
];

const focusAreaSeed: FocusArea[] = [
  {
    id: "defi",
    label: "DeFi",
    description: "AMM、LSD、Perp、Restaking 设计空间",
    active: true,
  },
  {
    id: "aa",
    label: "Account Abstraction",
    description: "智能账户、支付通道与签名策略",
    active: true,
  },
  {
    id: "infra",
    label: "Infra",
    description: "节点、预言机、监控与数据索引",
    active: false,
  },
  {
    id: "security",
    label: "Security",
    description: "威胁建模、审计清单、监控告警",
    active: false,
  },
  {
    id: "community",
    label: "Community",
    description: "运营增长、治理与资金盘点",
    active: false,
  },
];

const statsSeed: ProgramStat[] = [
  { label: "已毕业开发者", value: "1,200+", helper: "覆盖 12 个国家/地区", tone: "text-blue-300" },
  { label: "生态导师", value: "48", helper: "来自 L2/基础设施与安全团队", tone: "text-emerald-300" },
  { label: "链上里程碑", value: "320", helper: "从测试网到主网的交付记录", tone: "text-amber-300" },
  { label: "可用资助池", value: "$500k", helper: "Grants、Credits 与审计额度", tone: "text-purple-200" },
];

const spotlightSeed: SpotlightProject[] = [
  {
    title: "L2 Rollup Analytics",
    chain: "Arbitrum / Optimism",
    focus: "Data & Monitoring",
    progress: "已上线内测",
    detail: "构建统一的 L2 观察者，覆盖出块延迟、Sequencer 健康与跨链桥安全基线。",
    accent: "from-blue-500/60 to-cyan-400/50",
  },
  {
    title: "Account Abstraction Kit",
    chain: "EVM 通用",
    focus: "AA & Growth",
    progress: "公开 Beta",
    detail: "提供即插即用的 Session Key、Bundler 策略与费用抽象方案，集成监控告警。",
    accent: "from-violet-500/60 to-fuchsia-400/50",
  },
  {
    title: "DeFi Guardrails",
    chain: "Multi-chain",
    focus: "Security",
    progress: "测试网验证",
    detail: "利用 Simulations + Risk Switch 保护流动性池，支持自动风控参数调优与白名单。",
    accent: "from-emerald-500/60 to-green-400/50",
  },
];

const createInitialState = (): Web3UniversityState => ({
  stats: statsSeed.map((item) => ({ ...item })),
  focusAreas: focusAreaSeed.map((item) => ({ ...item })),
  tracks: trackSeed.map((item) => ({
    ...item,
    modules: item.modules.map((module) => ({ ...module })),
    toolkits: [...item.toolkits],
    outcomes: [...item.outcomes],
  })),
  spotlight: spotlightSeed.map((item) => ({ ...item })),
  selectedTrackId: "builder",
});

export const useWeb3UniversityStore = () => {
  const [state, setState] = useImmer<Web3UniversityState>(createInitialState);

  const selectTrack = (trackId: string) => {
    setState((draft) => {
      draft.selectedTrackId = trackId;
    });
  };

  const toggleFocusArea = (areaId: string) => {
    setState((draft) => {
      const target = draft.focusAreas.find((area) => area.id === areaId);
      if (target) {
        target.active = !target.active;
      }
    });
  };

  const selectedTrack = useMemo(
    () => state.tracks.find((track) => track.id === state.selectedTrackId) ?? state.tracks[0],
    [state.selectedTrackId, state.tracks],
  );

  const activeFocusAreas = useMemo(
    () => state.focusAreas.filter((area) => area.active),
    [state.focusAreas],
  );

  return {
    state,
    selectedTrack,
    activeFocusAreas,
    selectTrack,
    toggleFocusArea,
  };
};
