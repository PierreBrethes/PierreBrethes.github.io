// src/App.jsx
import './App.css';
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from './components/Sidebar';
import { classRaceMap, specsByClass } from './constants';
import { wow } from './auth';

const races = Object.keys(classRaceMap);
const uniqueClasses = Array.from(new Set(Object.values(classRaceMap).flat()));
const itemPositionToChoose = 75;

export default function App() {
  // useEffect(() => {
  //   const test = async () => {
  //     const data = await wow('/data/wow/token/?namespace=dynamic-us');
  //     return data;
  //   }
  //   test();
  // }, []);

  const [offsetX, setOffsetX] = useState(0);
  const [history, setHistory] = useState([]);
  const isOpening = useRef(false);

  const CARD_W = 240, GAP = 16, DURATION = 6000;
  const totalWidth = useRef(0);

  const [items, setItems] = useState([]);
  const [excludedRaces, setExcludedRaces] = useState([]);
  const [excludedClasses, setExcludedClasses] = useState([]);
  const [excludedSpec, setExcludedSpec] = useState("");

  const allCombinations = () => {
    const items = [];
    Object.entries(classRaceMap).forEach(([race, classes]) => {
      if (excludedRaces.includes(race)) return;
      classes.forEach(classe => {
        if (excludedClasses.includes(classe)) return;
        specsByClass[classe].forEach(spec => {
          if (spec === excludedSpec) return;
          items.push({
            race,
            classe,
            spec
          });
        });
      });
    });

    // Shuffle items array before returning
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  useEffect(() => {
    const initialItems = allCombinations();
    setItems(initialItems);
  }, []);

  const startOpening = () => {
    let _items = [...items]
    if (history.length > 0) {
      const tempItems = allCombinations();
      setItems(tempItems);
      _items = [...tempItems];
    }
    if (isOpening.current) return;
    isOpening.current = true;

    const target = _items[itemPositionToChoose];
    totalWidth.current = _items.length * (CARD_W + GAP);
    setOffsetX(0);

    animateScroll(itemPositionToChoose);

    setTimeout(() => {
      setHistory(prev => [target, ...prev.slice(0, 9)]);
    }, DURATION);
  };

  const animateScroll = idx => {
    const dist = idx * (CARD_W + GAP) + CARD_W / 2 + (Math.random() * 236 - 118);
    const maxDist = totalWidth.current - window.innerWidth;
    const clamped = Math.max(0, Math.min(dist, maxDist));
    const start = performance.now();

    const tick = t => {
      const prog = Math.min((t - start) / DURATION, 1);
      const e = 1 - Math.pow(1 - prog, 3);
      setOffsetX(-clamped * e);
      if (prog < 1) requestAnimationFrame(tick);
      else isOpening.current = false;
    };
    requestAnimationFrame(tick);
  };

  const excludeRace = (race) => {
    setExcludedRaces((prev) => {
      if (prev.includes(race)) {
        return prev.filter((r) => r !== race);
      }
      if (prev.length < 3) {
        return [...prev, race];
      }
      return prev;
    });
  };

  const excludeClass = (cls) => {
    setExcludedClasses((prev) => {
      if (prev.includes(cls)) {
        return prev.filter((c) => c !== cls);
      }
      if (prev.length < 3) {
        return [...prev, cls];
      }
      return prev;
    });
  };

  const excludeSpec = (spec) => {
    setExcludedSpec((prev) => (prev === spec ? "" : spec));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🎁 WoW Case Opener</h1>
      <Button onClick={startOpening} disabled={isOpening.current} className="mb-6 cursor-pointer">
        {isOpening.current ? "Ouverture..." : "Ouvrir une case"}
      </Button>

      <div className="relative w-full overflow-hidden h-[260px] mb-6">
        <div className="divider" />
        <motion.div
          className="absolute left-[50%] top-1/2 -translate-y-1/2 flex gap-4"
          style={{ x: offsetX, willChange: "transform" }}
        >
          {items && items.map((i, idx) => (
            <Card key={idx} className="w-[240px] flex-shrink-0 bg-gray-800 shadow-lg">
              <CardContent className="p-4 text-center">
                <h2 className="text-yellow-400 font-semibold">{i.race}</h2>
                <p className="text-white">{i.classe}</p>
                <p className="italic text-gray-300">{i.spec}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl mb-2">Derniers tirages</h2>
        <ul className="flex flex-wrap gap-2">
          {history.map((h, i) => (
            <li key={i} className="bg-gray-700 p-3 rounded">
              <p className="font-semibold text-yellow-400">{h.race}</p>
              <p>{h.classe} — <em>{h.spec}</em></p>
            </li>
          ))}
        </ul>
      </div>
      <Sidebar></Sidebar>
      <Sidebar position='right' filter>
        <h2 className="text-xl mb-2">⚙️ Settings (exclure jusqu’à 3)</h2>
        <div className="mb-2">
          <h3 className='flex justify-start'>Races exclues :</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {races.map(r => (
              <button
                key={r}
                className={`px-2 py-1 rounded text-xs ${excludedRaces.includes(r) ? "bg-red-500" : "bg-gray-700"}`}
                onClick={() => excludeRace(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-2">
          <p className='flex justify-start'>Classes exclues :</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.values(uniqueClasses).map(c => (
              <button
                key={c}
                className={`px-2 py-1 rounded text-xs ${excludedClasses.includes(c) ? "bg-red-500" : "bg-gray-700"}`}
                onClick={() => excludeClass(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className='flex justify-start'>Spécialisation exclue :</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {Array.from(new Set(Object.values(specsByClass).flat())).map(s => (
              <button
                key={s}
                className={`px-2 py-1 rounded text-xs ${excludedSpec === s ? "bg-red-500" : "bg-gray-700"}`}
                onClick={() => excludeSpec(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
