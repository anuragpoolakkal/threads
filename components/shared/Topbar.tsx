import Link from "next/link";
import Image from "next/image";
import { SignOutButton, SignedIn, OrganizationSwitcher } from "@clerk/nextjs";

const Topbar = () => {
	return (
		<nav className="topbar">
			<Link href="/" className="flex items-center gap-4">
				<Image src="/threads.png" alt="logo" width={30} height={30} />
				<p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
			</Link>

			<div className="flex items-center gap-4">
				<div className="block md:hidden">
					<SignedIn>
						<SignOutButton>
							<div className="flex cursor-pointer">
								<Image src="/logout.svg" alt="logout" width={24} height={24} />
							</div>
						</SignOutButton>
					</SignedIn>
				</div>

				<OrganizationSwitcher
					appearance={{
						elements: {
							organizationalSwitcherTrigger: "py-2 px-4",
						},
					}}
				/>
			</div>
		</nav>
	);
};
export default Topbar;
