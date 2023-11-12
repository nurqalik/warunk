import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert';
import React from "react";

export interface AlertDeleteProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  onAction: () => void;
}

const AlertDelete = React.forwardRef<HTMLDivElement, AlertDeleteProps>(
  ({ title, description, onAction }) => {
      return (
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>{title}</AlertDialogTitle>
                  {description && (
                      <AlertDialogDescription>
                          {description}
                      </AlertDialogDescription>
                  )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onAction()}>
                      Continue
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      );
  }
);
AlertDelete.displayName = "AlertDelete";
export default AlertDelete;