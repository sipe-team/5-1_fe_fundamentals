import { Grid, HStack, VStack } from '@/shared/components/layout';
import { Skeleton } from '@/shared/components/skeleton';

export function MenuPageSkeleton() {
	return (
		<VStack className="p-4 pb-10">
			<HStack gap={2} className="rounded-lg bg-gray-100 p-1 w-fit">
				<Skeleton className="h-8 w-14 rounded-md" />
				<Skeleton className="h-8 w-14 rounded-md" />
				<Skeleton className="h-8 w-14 rounded-md" />
			</HStack>
			<Grid cols={2}>
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton
						// biome-ignore lint/suspicious/noArrayIndexKey: 스켈레톤 아이템
						key={i}
						className="h-40 rounded-lg"
					/>
				))}
			</Grid>
		</VStack>
	);
}
