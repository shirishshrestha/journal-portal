import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * EllipsisTooltip - Shows truncated text with ellipsis and a tooltip for long strings
 * @param {string} text - The text to display
 * @param {number} [maxLength=45] - Max length before truncation
 * @param {object} [spanProps] - Additional props for the span
 */
export default function EllipsisTooltip({
  text,
  maxLength = 35,
  spanProps = {},
}) {
  if (typeof text !== "string" || text.length <= maxLength) {
    return <span {...spanProps}>{text}</span>;
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          {...spanProps}
          className={`cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] ${
            spanProps.className || ""
          }`.trim()}
        >
          {text.slice(0, maxLength)}...
        </span>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
