import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Threads",
	description: "Threads application using Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider appearance={{ baseTheme: dark }}>
			<html lang="en">
				<head>
					<link rel="icon" type="image/x-icon" href="/threads.png" sizes="any" />
				</head>
				<body className={`${inter.className} bg-dark-1`}>
					<div className="w-full flex justify-center items-center min-h-screen">{children}</div>
				</body>
			</html>
		</ClerkProvider>
	);
}
