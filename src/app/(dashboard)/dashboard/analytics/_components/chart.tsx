'use client';

import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartProps {
	data: {
		name: string;
		total: number;
	}[];
}

export const Chart = ({ data }: ChartProps) => {
	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Revenue by Course</CardTitle>
			</CardHeader>
			<CardContent className="pl-2">
				<ResponsiveContainer width="100%" height={350}>
					<BarChart data={data}>
						<XAxis
							dataKey="name"
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							tickFormatter={value => `$${value}`}
						/>
						<Tooltip
							cursor={{ fill: '#f1f5f9' }}
							contentStyle={{
								borderRadius: '8px',
								border: 'none',
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
							}}
						/>
						<Bar
							dataKey="total"
							fill="#0369a1" // A nice Kajabi-esque blue
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
