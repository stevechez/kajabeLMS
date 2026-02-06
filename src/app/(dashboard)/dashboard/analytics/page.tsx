import { getAdminStats } from '@/lib/admin-stats';
import { DataCard } from './_components/data-card';
import { Chart } from './_components/chart';

export default async function AnalyticsPage() {
	const { totalRevenue, totalSales, totalCourses, uniqueStudents } =
		await getAdminStats();

	return (
		<div className="p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
				<DataCard label="Total Sales" value={totalSales} />
				<DataCard label="Total Courses" value={totalCourses} />
				<DataCard label="Active Students" value={uniqueStudents} />
			</div>

			{/* We'll build this Chart component next */}
			<Chart data={[]} />
		</div>
	);
}
