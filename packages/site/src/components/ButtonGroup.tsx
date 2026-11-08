"use client";

import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

const ButtonGroupContext = React.createContext<
  VariantProps<typeof buttonVariants>
>({
  size: "default",
  variant: "default",
});

function ButtonGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  VariantProps<typeof buttonVariants>) {
  return (
    <div
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className
      )}
      {...props}
    >
      <ButtonGroupContext value={{ variant, size }}>
        {children}
      </ButtonGroupContext>
    </div>
  );
}

function ButtonGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof Button> & VariantProps<typeof buttonVariants>) {
  const context = React.use(ButtonGroupContext);

  return (
    <Button
      data-variant={context.variant || variant}
      data-size={context.size || size}
      variant={context.variant || variant}
      size={context.size || size}
      className={cn(
        buttonVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        // 44px touch targets on touch screens; mouse users keep the compact size.
        "pointer-coarse:h-11 pointer-coarse:min-w-11",
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

export { ButtonGroup, ButtonGroupItem };
