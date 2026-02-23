import { HTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import styles from "./Table.module.css";

type Props = HTMLAttributes<HTMLDivElement>;

export const Table = forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.table, className)} {...props}>
        {children}
      </div>
    );
  }
);

Table.displayName = "Table";

export const TableRow = forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.row, className)} {...props}>
        {children}
      </div>
    );
  }
);

TableRow.displayName = "TableRow";

export const TableCell = forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.cell, className)} {...props}>
        {children}
      </div>
    );
  }
);

TableCell.displayName = "TableCell";
