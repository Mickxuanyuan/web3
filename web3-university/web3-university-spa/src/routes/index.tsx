import { Loading, PageNotFoundView } from "@components/common";
import MainLayout from "@layouts/Layout";
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

const Home = lazy(() => import("@pages/Home"));
const About = lazy(() => import("@pages/About"));
const Demo = lazy(() => import("@pages/Demo"));
const Swap = lazy(() => import("@pages/Swap"));
const Creator = lazy(() => import("@pages/Creator"));
const Web3University = lazy(() => import("@pages/web3-university"));

const routes: RouteObject[] = [
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: (
					<Suspense fallback={<Loading />}>
						<Home />
					</Suspense>
				),
			},
			{
				path: "web3-university",
				element: (
					<Suspense fallback={<Loading />}>
						<Web3University />
					</Suspense>
				),
			},
			{
				path: "about",
				element: (
					<Suspense fallback={<Loading />}>
						<About />
					</Suspense>
				),
			},
			{
				path: "demo",
				element: (
					<Suspense fallback={<Loading />}>
						<Demo />
					</Suspense>
				),
			},
			{
				path: "swap",
				element: (
					<Suspense fallback={<Loading />}>
						<Swap />
					</Suspense>
				),
			},
			{
				path: "creator",
				element: (
					<Suspense fallback={<Loading />}>
						<Creator />
					</Suspense>
				),
			},
		],
	},
	{
		path: "*",
		element: <PageNotFoundView />,
	},
];

export default routes;
