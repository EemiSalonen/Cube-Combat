import type { Route } from "./+types/home";
import { Dashboard } from "~/components/dashboard/Dashboard";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Cube Combat" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return <Dashboard />;
}
