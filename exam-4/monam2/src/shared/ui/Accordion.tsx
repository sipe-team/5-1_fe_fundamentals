import { css } from '@emotion/react';
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react';

type AccordionValue = string;
type AccordionType = 'single' | 'multiple';

interface AccordionRootProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  type?: AccordionType;
  defaultValue?: AccordionValue[];
  value?: AccordionValue[];
  onValueChange?: (value: AccordionValue[]) => void;
}

interface AccordionItemProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  value: AccordionValue;
}

interface AccordionTriggerProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  children: ReactNode | ((state: { open: boolean }) => ReactNode);
}

interface AccordionContentProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  forceMount?: boolean;
}

interface AccordionRootContextValue {
  openValues: AccordionValue[];
  toggleValue: (value: AccordionValue) => void;
}

interface AccordionItemContextValue {
  contentId: string;
  open: boolean;
  triggerId: string;
  value: AccordionValue;
}

const AccordionRootContext = createContext<AccordionRootContextValue | null>(
  null,
);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null,
);

function Root({
  children,
  type = 'multiple',
  defaultValue = [],
  value,
  onValueChange,
  ...rest
}: AccordionRootProps) {
  const [uncontrolledValue, setUncontrolledValue] =
    useState<AccordionValue[]>(defaultValue);
  const openValues = value ?? uncontrolledValue;
  const isControlled = value !== undefined;

  const toggleValue = useCallback(
    (targetValue: AccordionValue) => {
      const nextValue =
        type === 'single'
          ? openValues.includes(targetValue)
            ? []
            : [targetValue]
          : openValues.includes(targetValue)
            ? openValues.filter((valueItem) => valueItem !== targetValue)
            : [...openValues, targetValue];

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange, openValues, type],
  );

  const contextValue = useMemo(
    () => ({
      openValues,
      toggleValue,
    }),
    [openValues, toggleValue],
  );

  return (
    <AccordionRootContext.Provider value={contextValue}>
      <div css={rootStyle} {...rest}>
        {children}
      </div>
    </AccordionRootContext.Provider>
  );
}

function Item({ children, value, ...rest }: AccordionItemProps) {
  const { openValues } = useAccordionRootContext();
  const id = useId();
  const open = openValues.includes(value);

  const contextValue = useMemo(
    () => ({
      contentId: `${id}-content`,
      open,
      triggerId: `${id}-trigger`,
      value,
    }),
    [id, open, value],
  );

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div css={itemStyle} data-state={open ? 'open' : 'closed'} {...rest}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function Trigger({
  children,
  onClick,
  type = 'button',
  ...rest
}: AccordionTriggerProps) {
  const { toggleValue } = useAccordionRootContext();
  const { contentId, open, triggerId, value } = useAccordionItemContext();

  const resolvedChildren =
    typeof children === 'function' ? children({ open }) : children;

  return (
    <button
      id={triggerId}
      css={triggerStyle}
      type={type}
      aria-controls={contentId}
      aria-expanded={open}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        toggleValue(value);
      }}
      {...rest}
    >
      {resolvedChildren}
    </button>
  );
}

function Content({
  children,
  forceMount = false,
  ...rest
}: AccordionContentProps) {
  const { contentId, open, triggerId } = useAccordionItemContext();

  if (!forceMount && !open) {
    return null;
  }

  return (
    <section
      id={contentId}
      css={contentStyle}
      aria-labelledby={triggerId}
      hidden={!open}
      {...rest}
    >
      {children}
    </section>
  );
}

function useAccordionRootContext() {
  const context = useContext(AccordionRootContext);

  if (!context) {
    throw new Error(
      'Accordion compound components must be used within Accordion.Root.',
    );
  }

  return context;
}

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error(
      'Accordion compound components must be used within Accordion.Item.',
    );
  }

  return context;
}

const rootStyle = css({
  display: 'grid',
});

const itemStyle = css({
  display: 'grid',
});

const triggerStyle = css({
  width: '100%',
});

const contentStyle = css({
  display: 'grid',
});

export const Accordion = {
  Root,
  Item,
  Trigger,
  Content,
};
