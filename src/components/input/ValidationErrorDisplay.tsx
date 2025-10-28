import React from "react";
import { AlertCircle } from "lucide-react";

interface ValidationErrorDisplayProps {
  errors: string[];
}

export function ValidationErrorDisplay({
  errors,
}: ValidationErrorDisplayProps) {
  return (
    <div className="!mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            กรุณาแก้ไขข้อผิดพลาดต่อไปนี้:
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc pl-5 space-y-1">
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
