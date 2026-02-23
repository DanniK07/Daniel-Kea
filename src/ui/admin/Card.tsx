import { HTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import styles from "./Card.module.css";

type Props = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.card, className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
