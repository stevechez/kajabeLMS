export const exportToCSV = (data: any[], filename: string) => {
	if (data.length === 0) return;

	// 1. Extract headers from the first object keys
	const headers = Object.keys(data[0]).join(',');

	// 2. Map data rows and handle potential commas in strings
	const rows = data.map(row =>
		Object.values(row)
			.map(value => {
				const strValue = String(value).replace(/"/g, '""'); // Escape double quotes
				return `"${strValue}"`; // Wrap in quotes to handle internal commas
			})
			.join(','),
	);

	// 3. Combine headers and rows
	const csvContent = [headers, ...rows].join('\n');

	// 4. Create a Blob and trigger download
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);

	link.setAttribute('href', url);
	link.setAttribute('download', `${filename}.csv`);
	link.style.visibility = 'hidden';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
