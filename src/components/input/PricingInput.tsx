import React from "react";
import { DollarSign } from "lucide-react";

interface PricingInputProps {
  pricePerSlot: number;
  setPricePerSlot: (value: number) => void;
}

export function PricingInput({
  pricePerSlot,
  setPricePerSlot,
}: PricingInputProps) {
  return (
    <div>
      <div className="space-y-1 mb-4">
        <h2 className="text-xl font-bold text-gray-800">Plan & Pricing</h2>
        <p className="text-sm text-gray-500">
          กำหนดค่าใช้จ่ายและจำนวนครั้งที่เรียนต่อสัปดาห์
        </p>
      </div>
      <label
        htmlFor="price"
        className="flex items-center text-sm font-medium text-gray-700 mb-1"
      >
        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
        Price/Slot*
      </label>
      <input
        type="number"
        id="price"
        value={pricePerSlot}
        onChange={(e) => setPricePerSlot(Number(e.target.value))}
        min="0"
        required
        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
      />
    </div>
  );
}
