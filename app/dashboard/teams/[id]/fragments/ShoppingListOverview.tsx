import { formatNumber } from "@/src/lib/tusktask/utils/formatNumber";
import { FullTask } from "@/src/types/task";
import { Separator } from "@/src/ui/components/shadcn/ui/separator";
import React from "react";

const ShoppingListOverview = ({
  shoppingList,
}: {
  shoppingList: FullTask[];
}) => {
  const listWithPrice = shoppingList.filter((t) => t?.price);
  let totalPrice: number = 0;

  listWithPrice.forEach((t) => {
    totalPrice += t.price!;
  });

  return (
    <section id="shoppingListOverview" className="p-4 border rounded-md">
      {/* Price Overview */}
      <div className="flex flex-col items-center">
        <small className="text-xs">Expenses</small>
        <span className="text-2xl font-bold mb-3">
          {formatNumber(totalPrice)}
        </span>
        <Separator />
        <div className="mt-2 w-full text-xs flex items-center justify-between">
          <span>Shopping Lists</span>
          <span>{shoppingList.length}</span>
        </div>
        <div className="mt-2 w-full text-xs flex items-center justify-between">
          <span>Expenses Not Defined</span>
          <span>{shoppingList.filter((t) => !t?.price).length}</span>
        </div>
      </div>
    </section>
  );
};

export default ShoppingListOverview;
