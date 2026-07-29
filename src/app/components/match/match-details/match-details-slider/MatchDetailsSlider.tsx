import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import NoData from "../../../general/no-data/NoData";

export interface SliderItem {
  component: React.ReactNode;
  title?: string;
  isLoading?: boolean;
  isAvailable?: boolean;
}

interface SliderProps {
  items: SliderItem[];
}

const MatchDetailsSlider = ({ items }: SliderProps) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + items.length) % items.length);

  if (!items || items.length === 0) {
    return <NoData />;
  }

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="p-2 sm:p-4 flex flex-col items-center justify-center text-brand-white"
          >
            {items[current].title && (
              <h4 className="block text-sm sm:text-base font-semibold mb-4 text-center text-brand-orange">
                {items[current].title}
              </h4>
            )}
            <div className="w-full">{items[current].component}</div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute top-1/2 -translate-y-1/2 left-2 p-1 text-brand-white hover:text-brand-orange hover:scale-110 transition-all"
        >
          <FaCaretLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 -translate-y-1/2 right-2 p-1 text-brand-white hover:text-brand-orange hover:scale-110 transition-all"
        >
          <FaCaretRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default MatchDetailsSlider;
