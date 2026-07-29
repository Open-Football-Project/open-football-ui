import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { NewsCardItem, useNewsState } from "open-football-project-core";
import { useEffect, useState } from "react";

interface NewsSliderProps {
  items: NewsCardItem[];
}

const NewsSlider = ({ items }: NewsSliderProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { visibleItems, prev, next, cardsToShow } = useNewsState(
    items,
    windowWidth
  );
  return (
    <div className="relative w-full">
      <div className="flex overflow-hidden gap-6 md:gap-8 lg:gap-10 xl:gap-12">
        {visibleItems.map((item, idx) => (
          <motion.a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-brand-card"
            style={{
              width: `${100 / cardsToShow}%`,
              minHeight: "400px",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 md:h-56 xl:h-64 object-cover"
            />
            <div className="p-4 md:p-6 mt-6">
              <h3 className="text-base md:text-lg xl:text-xl font-semibold mb-2 text-brand-white line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm md:text-base xl:text-lg text-brand-lightGray line-clamp-3">
                {item.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute top-1/2 -translate-y-1/2 left-2 p-3 md:p-4 bg-brand-orangeo rounded-full shadow hover:bg-brand-cream transition"
      >
        <FaChevronLeft size={15} />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 -translate-y-1/2 right-2 p-3 md:p-4 bg-brand-orangeo rounded-full shadow hover:bg-brand-cream transition"
      >
        <FaChevronRight size={15} />
      </button>
    </div>
  );
};

export default NewsSlider;
