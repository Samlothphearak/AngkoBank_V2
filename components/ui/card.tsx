import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "div" : "section";
    return (
      <Comp
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  hasTitle?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, hasTitle = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        hasTitle && "pb-3", // Less padding when there's a title below
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Tag = "h3", ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        "text-balance", // For better text wrapping
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      "text-pretty", // For better text wrapping
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 pt-0",
      "prose prose-sm dark:prose-invert max-w-none", // Better typography support
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = "start", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0",
        {
          "justify-start": align === "start",
          "justify-center": align === "center",
          "justify-end": align === "end",
          "justify-between": align === "between",
          "justify-around": align === "around",
          "justify-evenly": align === "evenly",
        },
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardFooterProps,
};