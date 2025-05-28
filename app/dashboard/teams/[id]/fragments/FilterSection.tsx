import { SetStateAction } from "@/src/types/types";
import React from "react";
import FilterCard from "./FilterCard";
import {
  Archive,
  ChevronDown,
  Circle,
  CircleCheckBig,
  Funnel,
  FunnelX,
  ShoppingCart,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/ui/components/shadcn/ui/collapsible";
import { FilterType } from "@/src/lib/tusktask/utils/filterTasks";

const FilterSection = ({
  filter,
  setFilter,
}: {
  filter: FilterType;
  setFilter: SetStateAction<FilterType>;
}) => {
  return (
    <section id="filter" className="mb-4 border rounded-md">
      <Collapsible>
        <CollapsibleTrigger className="p-4 cursor-pointer flex items-center justify-between w-full">
          <div className="flex items-center gap-2 ">
            <span>
              <Funnel className="w-5 h-5" />
            </span>
            <span>Filter</span>
          </div>
          <div>
            <ChevronDown className="w-5 h-5" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="border-t p-4 space-y-2">
          <FilterCard
            Icon={FunnelX}
            label="Show All"
            filter={filter}
            id="all"
            setFilter={setFilter}
            title="Show all tasks and shopping lists"
          />
          <FilterCard
            Icon={ShoppingCart}
            label="Shopping Lists"
            filter={filter}
            id="shopping"
            setFilter={setFilter}
            title="Show only shopping lists"
          />
          <FilterCard
            Icon={Archive}
            label="Archived Tasks"
            filter={filter}
            id="archived"
            setFilter={setFilter}
            title="Show only archived tasks"
          />
          <FilterCard
            Icon={Circle}
            label="Tasks Todo"
            filter={filter}
            id="todo"
            setFilter={setFilter}
            title="Show only incomplete tasks"
          />
          <FilterCard
            Icon={CircleCheckBig}
            label="Completed Tasks"
            filter={filter}
            id="completed"
            setFilter={setFilter}
            title="Show only completed tasks"
          />
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};

export default FilterSection;
