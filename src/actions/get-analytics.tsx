import { createClient } from '@/utils/supabase/server';

interface PurchaseWithDetails {
	created_at: string;
	course: {
		title: string;
		price: number | null;
	} | null;
	profile: {
		full_name: string | null;
	} | null;
}

export interface Transaction {
	date: string;
	student: string;
	course: string;
	amount: number;
}

export const getAnalytics = async () => {
	const supabase = await createClient();

	// 1. Fetch data from Supabase
	const { data: rawPurchases } = await supabase
		.from('purchases')
		.select(
			`
            created_at,
            course:courses (title, price),
            profile:profiles!purchases_user_id_fkey (full_name)
        `,
		)
		.order('created_at', { ascending: false });

	// 2. Cast and initialize data
	const purchases = (rawPurchases as unknown as PurchaseWithDetails[]) || [];
	const groupedEarnings: Record<string, number> = {};

	// 3. Process grouped earnings for the chart
	purchases.forEach(purchase => {
		if (purchase.course) {
			const courseTitle = purchase.course.title || 'Untitled Course';
			const price = purchase.course.price || 0;

			if (!groupedEarnings[courseTitle]) {
				groupedEarnings[courseTitle] = 0;
			}
			groupedEarnings[courseTitle] += price;
		}
	});

	// 4. Transform grouped data into Chart-friendly format
	const data = Object.entries(groupedEarnings).map(([name, total]) => ({
		name,
		total: total || 0,
	}));

	// 5. Calculate global totals
	const totalRevenue = data.reduce((acc, curr) => acc + (curr.total || 0), 0);
	const totalSales = purchases.length;

	// 6. Format transaction list for the table
	const transactions = purchases.map(p => ({
		date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A',
		student: p.profile?.full_name || 'Anonymous',
		course: p.course?.title || 'Deleted Course',
		amount: p.course?.price || 0,
	}));

	// 7. Return the final analytics object
	return {
		data,
		totalRevenue,
		totalSales,
		transactions,
	};
};
