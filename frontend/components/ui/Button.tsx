import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-black font-bold hover:bg-primary/90 shadow-md border border-transparent",
                destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
                outline: "border-2 border-primary text-black bg-transparent hover:bg-primary/10 font-bold",
                secondary: "bg-black text-white hover:bg-black/80 font-bold",
                ghost: "hover:bg-gray-100 hover:text-black",
                link: "text-black underline-offset-4 hover:underline",
                premium: "bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all",
            },
            size: {
                default: "h-12 px-6 py-3 rounded-full",
                sm: "h-9 px-4 rounded-full text-xs",
                lg: "h-14 px-8 text-lg rounded-full",
                icon: "h-10 w-10 rounded-full",
            },
            fullWidth: {
                true: "w-full",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
