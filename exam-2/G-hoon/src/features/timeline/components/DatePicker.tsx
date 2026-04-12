interface DatePickerProps {
	value: string;
	onChange: (date: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
	return (
		<div className="flex items-center gap-2 sm:gap-3">
			<label
				htmlFor="timeline-date"
				className="text-sm font-medium text-slate-700 min-w-[60px] sm:min-w-7"
			>
				날짜
			</label>
			<input
				id="timeline-date"
				type="date"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
			/>
		</div>
	);
}
