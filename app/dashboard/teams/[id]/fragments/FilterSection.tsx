import { SetStateAction } from "@/src/types/types";
import React from "react";
import FilterCard from "./FilterCard";
import { ChevronDown, Funnel } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/ui/components/shadcn/ui/collapsible";
import { filterItems, FilterType } from "@/src/lib/tusktask/utils/filterTasks";

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
          {filterItems.map((option) => {
            if (option.filterKey === "createdByOptimisticUpdate") {
              return <></>;
            }

            return (
              <FilterCard
                Icon={option.icon}
                label={option.label}
                filter={filter}
                id={option.filterKey}
                setFilter={setFilter}
                title="Show only shopping lists"
                key={option.filterKey}
              />
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};

export default FilterSection;
