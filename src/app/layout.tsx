import { ConfettiProvider } from '@/components/providers/confetti-provider';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<ConfettiProvider />
				{children}
			</body>
		</html>
	);
}
