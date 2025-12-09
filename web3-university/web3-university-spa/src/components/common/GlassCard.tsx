import { cn } from "@utils/cn";
import type { PropsWithChildren, ReactNode } from "react";

type GlassCardProps = {
	className?: string;
	title?: ReactNode;
	footer?: ReactNode;
};

const GlassCard = ({ className, title, footer, children }: PropsWithChildren<GlassCardProps>) => {
	return (
		<div
			className={cn(
				"rounded-xl border border-white/70 bg-white/70 shadow-[0_8px_24px_rgba(27,107,147,0.08),0_4px_12px_rgba(27,107,147,0.05)] backdrop-blur",
				className,
			)}
		>
			{title ? <div className="px-6 pt-5 text-base font-semibold text-slate-900">{title}</div> : null}
			<div className="px-6 pb-5 pt-3">{children}</div>
			{footer ? <div className="px-6 pb-5 pt-3">{footer}</div> : null}
		</div>
	);
};

export default GlassCard;

