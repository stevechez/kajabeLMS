'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';

export interface Transaction {
	date: string;
	student: string;
	course: string;
	amount: number;
}

export const ExportButton = ({ data }: { data: Transaction[] }) => {
	const handleExport = () => {
		// Format the date for the filename
		const dateString = new Date().toISOString().split('T')[0];
		exportToCSV(data, `transactions-${dateString}`);
	};

	return (
		<Button
			onClick={handleExport}
			variant="outline"
			size="sm"
			className="ml-auto flex items-center gap-x-2"
		>
			<Download className="h-4 w-4" />
			Export CSV
		</Button>
	);
};
