import { createClient } from '@/utils/supabase/server';

interface PurchaseWithCourse {
	price: number;
	courses: {
		title: string;
	} | null;
}

export const getAdminStats = async () => {
	const supabase = await createClient();

	// 1. Fetch purchases with joined course titles
	// Note: We use the plural 'courses' or singular 'course' depending on your FK name
	const { data: purchases } = (await supabase.from('purchases').select(`
      price,
      courses (
        title
      )
    `)) as { data: PurchaseWithCourse[] | null };

	// 2. Aggregate Data for the Chart
	const groupedRevenue: { [courseTitle: string]: number } = {};

	purchases?.forEach(purchase => {
		const courseTitle = purchase.courses?.title || 'Unknown Course';

		if (!groupedRevenue[courseTitle]) {
			groupedRevenue[courseTitle] = 0;
		}
		groupedRevenue[courseTitle] += purchase.price;
	});

	// Convert grouped object to array for Recharts
	const data = Object.entries(groupedRevenue).map(([name, total]) => ({
		name,
		total,
	}));

	// 3. Calculate KPI Metrics
	const totalRevenue =
		purchases?.reduce((acc, curr) => acc + (curr.price || 0), 0) || 0;
	const totalSales = purchases?.length || 0;

	// 4. Get Total Courses Count
	const { count: totalCourses } = await supabase
		.from('courses')
		.select('*', { count: 'exact', head: true });

	// 5. Get Unique Students (users who have started at least one lesson)
	const { data: progressData } = await supabase
		.from('user_progress')
		.select('user_id');

	const uniqueStudents = new Set(progressData?.map(s => s.user_id)).size;

	return {
		data,
		totalRevenue,
		totalSales,
		totalCourses: totalCourses || 0,
		uniqueStudents,
	};
};
