// src/App.jsx
import './App.css';
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from './components/Sidebar';

const data = {
  races: [
    "Humain", "Nain", "Gnome", "Elfe de la nuit", "Draeneï",
    "Worgen", "Pandaren", "Elfe du vide", "Nain sombrefer", "Mécagnome",
    "Orc", "Troll", "Tauren", "Elfe de sang", "Mort-vivant",
    "Gobelin", "Orc mag'har", "Tauren de Haut-Roc", "Troll zandalari",
    "Vulpérin", "Elfe sacrenuit"
  ],
  classes: {
    Guerrier: ["Armes", "Fureur", "Protection"],
    Paladin: ["Sacré", "Protection", "Vindicte"],
    Chasseur: ["Maîtrise des bêtes", "Précision", "Survie"],
    Voleur: ["Assassinat", "Hors‑la‑loi", "Finesse"],
    Prêtre: ["Discipline", "Sacré", "Ombre"],
    "Chevalier de la mort": ["Sang", "Givre", "Impie"],
    Chaman: ["Élémentaire", "Amélioration", "Restauration"],
    Mage: ["Arcanes", "Feu", "Givre"],
    Démoniste: ["Affliction", "Démonologie", "Destruction"],
    Moine: ["Maître brasseur", "Tisse‑brume", "Marche‑vent"],
    "Chasseur de démons": ["Dévastation", "Vengeance"],
    Druide: ["Équilibre", "Farouche", "Gardien", "Restauration"],
    Évocateur: ["Augmentation", "Préservation", "Dévastation"]
  }
};

function getRandomChar(allowedRaces, allowedClasses, allowedSpecs) {
  const race = allowedRaces[(Math.random() * allowedRaces.length) | 0];
  const cls = allowedClasses[(Math.random() * allowedClasses.length) | 0];
  const spec = allowedSpecs[cls][(Math.random() * allowedSpecs[cls].length) | 0];
  return { race, className: cls, spec };
}

export default function App() {
  const [items, setItems] = useState([]);
  const [offsetX, setOffsetX] = useState(0);
  const [history, setHistory] = useState([]);
  const isOpening = useRef(false);

  const CARD_W = 240, GAP = 16, DURATION = 6000;
  const totalWidth = useRef(0);

  const [excludedRaces, setExcludedRaces] = useState([]);
  const [excludedClasses, setExcludedClasses] = useState([]);
  const [excludedSpec, setExcludedSpec] = useState("");

  const allowedRaces = data.races.filter(r => !excludedRaces.includes(r));
  const allowedClasses = Object.keys(data.classes).filter(c => !excludedClasses.includes(c));
  const allowedSpecs = {};
  allowedClasses.forEach(c => {
    allowedSpecs[c] = data.classes[c].filter(s => s !== excludedSpec);
  });

  const genItems = () => Array.from({ length: 80 }, () =>
    getRandomChar(allowedRaces, allowedClasses, allowedSpecs)
  );

  useEffect(() => {
    const arr = genItems();
    setItems(arr);
    totalWidth.current = arr.length * (CARD_W + GAP);
    setOffsetX(0);
  }, [excludedRaces, excludedClasses, excludedSpec]);

  const startOpening = () => {
    if (isOpening.current) return;
    isOpening.current = true;

    const arr = genItems();
    const target = getRandomChar(allowedRaces, allowedClasses, allowedSpecs);
    arr[39] = target; // injecte au 40ᵉ
    setItems(arr);
    totalWidth.current = arr.length * (CARD_W + GAP);
    setOffsetX(0);

    animateScroll(39);

    setTimeout(() => {
      setHistory(prev => [target, ...prev.slice(0, 9)]);
    }, DURATION);
  };

  const animateScroll = idx => {
    const dist = idx * (CARD_W + GAP) + CARD_W/2 + (Math.random() * 236 - 118);
    const maxDist = totalWidth.current - window.innerWidth;
    const clamped = Math.max(0, Math.min(dist, maxDist));
    const start = performance.now();

    const tick = t => {
      const prog = Math.min((t - start)/DURATION,1);
      const e = 1 - Math.pow(1-prog,3);
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

  useEffect(() => {
    console.log(history);
  }, [history]);
    

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🎁 WoW Case Opener</h1>

      <Sidebar>
        <h2 className="text-xl mb-2">⚙️ Settings (exclure jusqu’à 3)</h2>
        <div className="mb-2">
          <h3 className='flex justify-start'>Races exclues :</h3>
          <div className="flex flex-wrap gap-1">
            {data.races.map(r => (
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
          <p>Classes exclues :</p>
          <div className="flex flex-wrap gap-1">
            {Object.keys(data.classes).map(c => (
              <button
                key={c}
                className={`px-2 py-1 rounded ${excludedClasses.includes(c) ? "bg-red-500" : "bg-gray-700"}`}
                onClick={() => excludeClass(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p>Spécialisation exclue :</p>
          <div className="flex flex-wrap gap-1">
            {Array.from(new Set(Object.values(data.classes).flat())).map(s => (
              <button
                key={s}
                className={`px-2 py-1 rounded ${excludedSpec === s ? "bg-red-500" : "bg-gray-700"}`}
                onClick={() => excludeSpec(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Sidebar>

      <Button onClick={startOpening} disabled={isOpening.current} className="mb-6">
        {isOpening.current ? "Ouverture..." : "Ouvrir une case"}
      </Button>

      <div className="relative w-full overflow-hidden h-[260px] mb-6">
        <div className="divider" />
        <motion.div
          className="absolute left-[50%] top-1/2 -translate-y-1/2 flex gap-4"
          style={{ x: offsetX, willChange: "transform" }}
        >
          {items.map((i, idx) => (
            <Card key={idx} className="w-[240px] flex-shrink-0 bg-gray-800 shadow-lg">
              <CardContent className="p-4 text-center">
                <h2 className="text-yellow-400 font-semibold">{i.race}</h2>
                <p className="text-white">{i.className}</p>
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
                <p>{h.className} — <em>{h.spec}</em></p>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}
