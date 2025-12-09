import Header from "@components/common/Header";
import { memo } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
	return (
		<>
			<Header />
			<main className="min-h-screen bg-gradient-to-b from-white via-[#f6f8fb] to-[#eef4f3] text-slate-900">
				<Outlet />
			</main>
		</>
	);
};
// MainLayout.whyDidYouRender = true;
export default memo(MainLayout);
