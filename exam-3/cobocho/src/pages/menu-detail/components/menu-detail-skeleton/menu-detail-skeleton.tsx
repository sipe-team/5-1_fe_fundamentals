import { VStack, HStack } from '@/shared/components/layout';
import { Skeleton } from '@/shared/components/skeleton';

export function MenuDetailSkeleton() {
	return (
		<VStack gap={6} className="pb-24 p-4">
			{/* 메뉴 정보 */}
			<VStack gap={3} align="center" className="pt-4">
				<Skeleton className="aspect-square w-full rounded-xl" />
				<Skeleton className="h-6 w-28" />
				<Skeleton className="h-4 w-40" />
				<Skeleton className="h-5 w-20" />
			</VStack>

			{/* 옵션 1 */}
			<VStack gap={2}>
				<Skeleton className="h-4 w-16" />
				<HStack gap={2}>
					<Skeleton className="h-20 flex-1 rounded-lg" />
					<Skeleton className="h-20 flex-1 rounded-lg" />
				</HStack>
			</VStack>

			{/* 옵션 2 */}
			<VStack gap={2}>
				<Skeleton className="h-4 w-16" />
				<HStack gap={2}>
					<Skeleton className="h-20 flex-1 rounded-lg" />
					<Skeleton className="h-20 flex-1 rounded-lg" />
					<Skeleton className="h-20 flex-1 rounded-lg" />
				</HStack>
			</VStack>

			{/* 옵션 3 */}
			<VStack gap={2}>
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-12 w-full rounded-lg" />
			</VStack>

			{/* 수량 */}
			<HStack justify="between" className="py-2">
				<Skeleton className="h-4 w-10" />
				<Skeleton className="h-8 w-24 rounded-full" />
			</HStack>
		</VStack>
	);
}
