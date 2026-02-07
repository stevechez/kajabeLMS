import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';
import { Transaction } from '@/actions/get-analytics';

interface TransactionsTableProps {
	items: Transaction[];
}

export const TransactionsTable = ({ items }: TransactionsTableProps) => {
	return (
		<Card className="mt-4 shadow-sm border-slate-200">
			<CardHeader className="bg-slate-50/50">
				<CardTitle className="text-sm font-medium text-slate-500">
					Recent Transactions
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-6">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="w-[150px]">Date</TableHead>
							<TableHead>Student</TableHead>
							<TableHead>Course</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((item, index) => (
							<TableRow
								key={index}
								className="hover:bg-slate-50/50 transition-colors"
							>
								<TableCell className="font-medium text-slate-600">
									{item.date}
								</TableCell>
								<TableCell className="text-slate-700">{item.student}</TableCell>
								<TableCell className="text-slate-700">{item.course}</TableCell>
								<TableCell className="text-right font-semibold text-slate-900">
									{formatPrice(item.amount)}
								</TableCell>
							</TableRow>
						))}
						{items.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={4}
									className="text-center py-10 text-slate-500 italic"
								>
									No recent transactions found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
