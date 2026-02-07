'use client';

import { useState } from 'react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { Eye, BookOpen } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface StudentDetailsSheetProps {
	studentId: string;
	studentName: string;
}

interface StudentPurchase {
	created_at: string;
	course: {
		title: string;
		price: number;
	};
}

export const StudentDetailsSheet = ({
	studentId,
	studentName,
}: StudentDetailsSheetProps) => {
	// 2. Use the interface in the useState hook
	const [purchases, setPurchases] = useState<StudentPurchase[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const supabase = createClient();

	const fetchPurchases = async () => {
		setIsLoading(true);

		const { data } = await supabase
			.from('purchases')
			.select(
				`
        created_at,
        course:courses (
          title,
          price
        )
      `,
			)
			.eq('user_id', studentId);

		// 3. Cast the data coming back from Supabase
		setPurchases((data as unknown as StudentPurchase[]) || []);
		setIsLoading(false);
	};

	return (
		<Sheet onOpenChange={open => open && fetchPurchases()}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="sm" className="flex items-center gap-x-2">
					<Eye className="h-4 w-4" />
					View Details
				</Button>
			</SheetTrigger>
			<SheetContent className="w-[400px] sm:w-[540px]">
				<SheetHeader>
					<SheetTitle>Student Activity</SheetTitle>
					<div className="text-sm text-slate-500">
						Purchases for{' '}
						<span className="font-semibold text-slate-900">{studentName}</span>
					</div>
				</SheetHeader>

				<div className="mt-8 space-y-4">
					<h3 className="font-medium flex items-center gap-x-2">
						<BookOpen className="h-4 w-4 text-blue-600" />
						Enrolled Courses ({purchases.length})
					</h3>

					{isLoading ? (
						<div className="text-sm text-slate-500 italic">
							Loading purchases...
						</div>
					) : (
						<div className="space-y-3">
							{purchases.map((item, index) => (
								<div
									key={index}
									className="p-4 border rounded-lg bg-slate-50 flex justify-between items-center"
								>
									<div>
										<p className="text-sm font-semibold">{item.course.title}</p>
										<p className="text-xs text-slate-500">
											Purchased:{' '}
											{new Date(item.created_at).toLocaleDateString()}
										</p>
									</div>
									<div className="text-sm font-medium text-slate-600">
										{formatPrice(item.course.price)}
									</div>
								</div>
							))}
							{purchases.length === 0 && (
								<p className="text-sm text-slate-400 text-center py-10">
									No courses purchased yet.
								</p>
							)}
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
};
