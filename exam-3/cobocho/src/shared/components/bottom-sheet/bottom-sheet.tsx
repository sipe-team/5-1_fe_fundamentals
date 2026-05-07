import { Drawer } from 'vaul';
import { cn } from '@/shared/lib/cn';
import type { ComponentProps, ReactNode } from 'react';

type RootProps = ComponentProps<typeof Drawer.Root>;

function Root({ children, ...props }: RootProps) {
	return <Drawer.Root {...props}>{children}</Drawer.Root>;
}

type TriggerProps = ComponentProps<typeof Drawer.Trigger>;

function Trigger({ children, ...props }: TriggerProps) {
	return <Drawer.Trigger {...props}>{children}</Drawer.Trigger>;
}

interface ContentProps {
	className?: string;
	children: ReactNode;
}

function Content({ className, children }: ContentProps) {
	return (
		<Drawer.Portal>
			<Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
			<Drawer.Content
				className={cn(
					'fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white px-4 pb-8 pt-4',
					className,
				)}
			>
				<div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />
				{children}
			</Drawer.Content>
		</Drawer.Portal>
	);
}

interface TitleProps {
	className?: string;
	children: ReactNode;
}

function Title({ className, children }: TitleProps) {
	return (
		<Drawer.Title className={cn('mb-4 text-base font-semibold', className)}>
			{children}
		</Drawer.Title>
	);
}

type CloseProps = ComponentProps<typeof Drawer.Close>;

function Close({ children, ...props }: CloseProps) {
	return <Drawer.Close {...props}>{children}</Drawer.Close>;
}

export const BottomSheet = {
	Root,
	Trigger,
	Content,
	Title,
	Close,
};
