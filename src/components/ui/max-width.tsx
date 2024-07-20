import { cva, VariantProps } from "class-variance-authority";
import { FC, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const maxWidthVariants = cva("w-full h-full", {
  variants: {
    size: {
      default: "max-w-7xl",
      lg: "max-w-[1980px]",
    },
    flex: {
      default: "flex items-center justify-center flex-col",
      row: "flex items-center justify-center ",
      none: "",
    },
  },
  defaultVariants: {
    size: "default",
    flex: "default",
  },
});

interface MaxWidthProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof maxWidthVariants> {}

export const MaxWidth: FC<MaxWidthProps> = ({
  className,
  size,
  flex,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(maxWidthVariants({ size, flex }), className)}
    />
  );
};
