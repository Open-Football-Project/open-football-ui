import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { TodayPlayerScore } from "@matchinsights/core";

import NoData from "../../general/no-data/NoData";
import TodayPlayerCard from "../today-player-card/TodayPlayerCard";

interface TodayPlayersSliderProps {
  playerScores: TodayPlayerScore[];
  teamName: string;
}

const TodayPlayersSlider = ({ playerScores, teamName }: TodayPlayersSliderProps) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % playerScores.length);
  const prev = () => setCurrent((prev) => (prev - 1 + playerScores.length) % playerScores.length);

  if (!playerScores || playerScores.length === 0) {
    return <NoData />;
  }

  return (
    <div className="relative w-full sm:max-w-md sm:mx-auto">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={playerScores[current].player.id ?? current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full px-8"
          >
            <TodayPlayerCard playerScore={playerScores[current]} teamName={teamName} />
          </motion.div>
        </AnimatePresence>

        {playerScores.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute top-1/2 -translate-y-1/2 left-2 p-1 text-brand-orange hover:scale-110 transition-all"
            >
              <FaCaretLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 -translate-y-1/2 right-2 p-1 text-brand-orange hover:scale-110 transition-all"
            >
              <FaCaretRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodayPlayersSlider;
