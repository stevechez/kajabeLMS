import { createClient } from '@/utils/supabase/server';
import { SearchInput } from './_components/search-input';
import { StudentDetailsSheet } from './_components/student-details-sheet';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export default async function StudentsPage({
	searchParams,
}: {
	searchParams: Promise<{ name?: string }>;
}) {
	const { name } = await searchParams;
	const supabase = await createClient();

	// Build the query
	let query = supabase
		.from('profiles')
		.select('*')
		.order('full_name', { ascending: true });

	// If a search term exists, filter by name
	if (name) {
		query = query.ilike('full_name', `%${name}%`);
	}

	const { data: students } = await query;

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold">Students</h1>
				<SearchInput />
			</div>

			<div className="rounded-md border bg-white">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email (ID)</TableHead>
							<TableHead className="text-right">Joined</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{students?.map(student => (
							<TableRow key={student.id}>
								<TableCell className="font-medium">
									{student.full_name || 'Anonymous Student'}
								</TableCell>
								<TableCell className="text-slate-500 text-xs">
									{student.id}
								</TableCell>
								<TableCell className="text-right">
									<StudentDetailsSheet
										studentId={student.id}
										studentName={student.full_name || 'Student'}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{students?.length === 0 && (
					<div className="p-10 text-center text-slate-500">
						No students found matching &quot;{name}&quot;
					</div>
				)}
			</div>
		</div>
	);
}
