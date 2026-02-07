import { getAnalytics } from '@/actions/get-analytics';
import { DataCard } from './_components/data-card';
import { Chart } from './_components/chart';
import { TransactionsTable } from './_components/transactions-table';
import { ExportButton } from './_components/export-button';

export default async function AnalyticsPage() {
	// This now correctly calls the action we built
	const { data, totalRevenue, totalSales, transactions } = await getAnalytics();

	return (
		<div className="p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
				<DataCard label="Total Sales" value={totalSales} />
			</div>

			<Chart data={data} />

			<div className="mt-8 flex items-center justify-between">
				<h2 className="text-xl font-semibold text-slate-700">
					Transaction History
				</h2>
				<ExportButton data={transactions} />
			</div>

			{/* Passing the transactions to the separate table component */}
			<TransactionsTable items={transactions} />
		</div>
	);
}
