// src/components/LoopTemplates/Accordion.tsx
import { useState, useEffect, useRef, type ReactNode } from "react";
import AccordionItem from "@/components/LoopComponents/AccordionItem";
import { staggeredAnimationProps } from "@/integrations/scroll-animations";

interface AccordionItemData {
  id?: string;
  title: string;
  description?: string;
  contentSlotId: string; // ID of the hidden div with rendered content
}

interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
  headerSlot?: (params: {
    item: AccordionItemData;
    id: string;
    expanded: boolean;
  }) => ReactNode;
  headerClassName?: string;
  indicatorClassName?: string;
  contentClassName?: string;
  showIndicator?: boolean;
}

export default function Accordion({
  items,
  allowMultiple = false,
  className = "",
  headerSlot,
  headerClassName = "",
  indicatorClassName = "",
  contentClassName = "",
  showIndicator,
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const panelRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  // Load content ONLY when panel expands - lazy loading!
  useEffect(() => {
    expandedItems.forEach((itemId) => {
      const panel = panelRefs.current.get(itemId);
      const item = items.find((i, idx) => (i.id || `item-${idx}`) === itemId);
      
      if (panel && item?.contentSlotId && panel.children.length === 0) {
        // Find the hidden content by ID
        const hiddenContent = document.getElementById(item.contentSlotId);
        
        if (hiddenContent) {
          // Clone the node (keeps original hidden div intact)
          const clone = hiddenContent.cloneNode(true) as HTMLElement;
          
          // Make it visible (remove display: none)
          clone.style.display = '';
          clone.removeAttribute('id'); // Remove ID to avoid duplicates
          
          // Append to panel
          panel.appendChild(clone);
        }
      }
    });
  }, [expandedItems, items]);

  return (
    <div className={className}>
      {items.map((item, index) => {
        const itemId = item.id || `item-${index}`;

        return (
          <AccordionItem
            key={itemId}
            id={itemId}
            title={item.title}
            description={item.description}
            animationProps={staggeredAnimationProps("fade-in-up", index, {
              once: true,
              staggerDelay: 100,
            })}
            isExpanded={expandedItems.has(itemId)}
            onToggle={() => toggleItem(itemId)}
            headerSlot={
              headerSlot
                ? headerSlot({ item, id: itemId, expanded: expandedItems.has(itemId) })
                : undefined
            }
            headerClassName={headerClassName}
            indicatorClassName={indicatorClassName}
            contentClassName={contentClassName}
            showIndicator={showIndicator}
          >
            {/* Simple container - content gets cloned here when panel opens */}
            <div 
              ref={(el) => {
                if (el) panelRefs.current.set(itemId, el);
              }}
            />
          </AccordionItem>
        );
      })}
    </div>
  );
}
