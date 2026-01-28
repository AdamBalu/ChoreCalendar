import { useRef, useState, useEffect } from "react";
import { useChores } from "@/context/ChoreContext";
import { ChoreCard } from "./ChoreCard";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";

export function ChorePool() {
  const { chores, toggleFavorite } = useChores();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [chores]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      // Small timeout to check scroll after animation
      setTimeout(checkScroll, 350);
    }
  };

  if (chores.length === 0) {
    return (
      <div className="chore-pool empty">
        <div className="chore-pool-empty">
          <CalendarPlus size={24} className="text-amber-500/50" />
          <p>Create your first chore above, then drag it to the calendar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chore-pool">
      <div className="chore-pool-header">
        <h3>Your Chores</h3>
        <span className="chore-pool-count">{chores.length}</span>
      </div>
      <div className="chore-pool-relative-container">
        {showLeftArrow && (
          <button
            className="chore-pool-scroll-btn left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div
          className="chore-pool-items"
          ref={scrollContainerRef}
          onScroll={checkScroll}
        >
          {chores.map((chore) => (
            <ChoreCard
              key={chore.id}
              chore={chore}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {showRightArrow && (
          <button
            className="chore-pool-scroll-btn right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
