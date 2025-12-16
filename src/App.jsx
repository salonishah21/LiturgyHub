import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ListPlus, Plus } from "lucide-react";

/**
 * Mock data
 */
const LIBRARIES = [
  {
    id: "spirit",
    title: "Spirit & Song",
    season: "2025–2026",
    cover: "https://via.placeholder.com/300x120?text=Spirit+%26+Song"
  },
  {
    id: "breaking",
    title: "Breaking Bread",
    season: "2025–2026",
    cover: "https://via.placeholder.com/300x120?text=Breaking+Bread"
  },
  {
    id: "choose",
    title: "Choose Christ Missal",
    season: "2025–2026",
    cover: "https://via.placeholder.com/300x120?text=Choose+Christ"
  }
];

const MOCK_SONGS = [
  {
    id: "s1",
    number: 101,
    title: "Here I Am, Lord",
    composer: "Dan Schutte",
    topics: ["Call", "Vocation"],
    scripture: ["Isaiah 6"],
    language: "English",
    voicing: "Assembly"
  },
  {
    id: "s2",
    number: 202,
    title: "Be Not Afraid",
    composer: "Bob Dufford",
    topics: ["Trust", "Comfort"],
    scripture: ["Isaiah 43"],
    language: "English",
    voicing: "Assembly"
  },
  {
    id: "s3",
    number: 303,
    title: "Pan de Vida",
    composer: "Bob Hurd",
    topics: ["Communion"],
    scripture: ["John 6"],
    language: "Bilingual",
    voicing: "Assembly"
  }
];

const MOCK_PSALMS = [
  {
    id: "p1",
    celebration: "1st Sunday of Advent (A)",
    psalm: "Psalm 25",
    title: "To You, O Lord",
    composer: "Scott Soper"
  },
  {
    id: "p2",
    celebration: "Christmas Midnight Mass",
    psalm: "Psalm 96",
    title: "Today Is Born Our Savior",
    composer: "Owen Alstott"
  }
];

const MOCK_MASS_SETTINGS = [
  {
    id: "m1",
    title: "Mass of Christ the Savior",
    composer: "Dan Schutte",
    parts: ["Full Setting", "Kyrie", "Gloria", "Holy", "Lamb of God"]
  },
  {
    id: "m2",
    title: "Mass of Renewal",
    composer: "Curtis Stephan",
    parts: ["Full Setting", "Gloria", "Holy", "Mystery of Faith"]
  }
];

// default My Lists
const INITIAL_LISTS = [
  {
    id: 1,
    name: "1st Sunday of Advent Choir",
    items: [{ type: "song", id: "s1" }, { type: "psalm", id: "p1" }]
  },
  {
    id: 2,
    name: "Funeral Standard Repertoire",
    items: [{ type: "song", id: "s2" }]
  }
];

/**
 * Utilities
 */
function nextListId(lists) {
  return (lists.reduce((max, l) => Math.max(max, l.id), 0) || 0) + 1;
}

/**
 * Layout & shared components
 */

function App() {
  const [route, setRoute] = useState("dashboard");
  const [browseTab, setBrowseTab] = useState("songs");
  const [selectedLibraryId, setSelectedLibraryId] = useState("spirit");
  const [lists, setLists] = useState(INITIAL_LISTS);
  const selectedLibrary =
    LIBRARIES.find((l) => l.id === selectedLibraryId) || LIBRARIES[0];

  const navigate = (newRoute) => setRoute(newRoute);

  const showBrandBand = route === "browse";

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <TopNav route={route} setRoute={setRoute} />
      {showBrandBand && <LibraryBrandBand selectedLibrary={selectedLibrary} />}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          {route === "dashboard" && (
            <DashboardPage
              navigate={navigate}
              selectedLibrary={selectedLibrary}
              lists={lists}
            />
          )}
          {route === "browse" && (
            <BrowsePage
              browseTab={browseTab}
              setBrowseTab={setBrowseTab}
              selectedLibrary={selectedLibrary}
              selectedLibraryId={selectedLibraryId}
              setSelectedLibraryId={setSelectedLibraryId}
              lists={lists}
              setLists={setLists}
            />
          )}
          {route === "lists" && (
            <MyListsPage lists={lists} setLists={setLists} />
          )}
        </div>
      </main>
    </div>
  );
}

function TopNav({ route, setRoute }) {
  const [search, setSearch] = useState("");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "browse", label: "Digital Libraries" },
    { id: "planner", label: "Planner", disabled: true },
    { id: "lists", label: "My Lists" }
  ];

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-24 bg-slate-900 rounded-md" />
            <span className="text-xs tracking-[0.2em] uppercase text-slate-500">
              Digital Libraries
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {tabs.map((tab) => {
              const active = route === tab.id;
              return (
                <button
                  key={tab.id}
                  disabled={tab.disabled}
                  onClick={() => !tab.disabled && setRoute(tab.id)}
                  className={`pb-1 border-b-2 transition ${
                    active
                      ? "border-slate-900 text-slate-900 font-semibold"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                  } ${tab.disabled ? "opacity-40 cursor-default" : ""}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="hidden md:flex items-center gap-2 max-w-xs w-full">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search music, psalms, settings..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-full border bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primaryBlue w-full"
              />
            </div>
          </div>
          <div className="p-6 bg-red-500 text-white">TAILWIND CHECK</div>
          <button className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold">
            JB
          </button>
        </div>
      </div>
    </header>
  );
}

function LibraryBrandBand({ selectedLibrary }) {
  return (
    <div className="border-t bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center gap-3">
        <img
          src={selectedLibrary.cover}
          alt=""
          className="h-9 w-9 rounded-lg object-cover"
        />
        <div className="leading-tight">
          <div className="text-sm font-semibold">{selectedLibrary.title}</div>
          <div className="text-xs text-slate-500">{selectedLibrary.season}</div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle, right }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}

/**
 * Dashboard
 */

function DashboardPage({ navigate, selectedLibrary, lists }) {
  const tools = [
    { id: "planner", title: "Liturgy Planner" },
    { id: "libraries", title: "Digital Libraries" },
    { id: "assistant", title: "Digital Assistant" }
  ];

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-12 gap-6">
        {/* Left column (My Library, Tools, News) */}
        <div className="col-span-12 md:col-span-8 space-y-6">
          <section>
            <h2 className="text-sm font-semibold mb-2">My Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {LIBRARIES.map((lib) => (
                <LibraryCard
                  key={lib.id}
                  lib={lib}
                  onOpen={() => navigate("browse")}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold mb-2">Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onOpen={() =>
                    tool.id === "libraries" ? navigate("browse") : null
                  }
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold mb-2">News</h2>
            <div className="rounded-2xl border bg-white shadow-sm p-4 flex flex-col md:flex-row items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-primaryBlue mb-0.5">
                  Fresh music for 2025–2026
                </div>
                <p className="text-sm text-slate-700">
                  Explore new songs and psalm settings available in your
                  digital library subscription.
                </p>
              </div>
              <button className="px-3 py-1.5 rounded-button border border-primaryBlue text-primaryBlue text-xs font-semibold uppercase tracking-wide bg-white">
                Browse new songs
              </button>
            </div>
          </section>
        </div>

        {/* Right column (Recent Lists, Tips) */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          <section>
            <h2 className="text-sm font-semibold mb-2">Recent Lists</h2>
            <div className="rounded-2xl border bg-white shadow-sm p-3 space-y-2">
              {lists.map((list) => (
                <button
                  key={list.id}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-50 text-sm"
                >
                  {list.name}
                </button>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-sm font-semibold mb-2">Help & Tips</h2>
            <div className="rounded-2xl border bg-white shadow-sm p-3 text-xs text-slate-600 space-y-2">
              <p>Find music faster by searching by number, title, or composer.</p>
              <p>Use My Lists to organize music for each liturgy or ensemble.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function LibraryCard({ lib, onOpen }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border bg-white overflow-hidden shadow-sm"
    >
      <div className="h-24 bg-slate-100">
        <img src={lib.cover} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="p-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{lib.title}</div>
        </div>
        <button
          onClick={onOpen}
          className="px-3 py-1.5 rounded-button bg-primaryBlue text-white text-xs font-semibold uppercase tracking-wide shadow"
        >
          Open
        </button>
      </div>
    </motion.div>
  );
}

function ToolCard({ tool, onOpen }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="h-24 bg-slate-50" />
      <div className="p-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{tool.title}</div>
        </div>
        <button
          onClick={onOpen}
          className="px-3 py-1.5 rounded-button bg-primaryBlue text-white text-xs font-semibold uppercase tracking-wide shadow"
        >
          Open
        </button>
      </div>
    </div>
  );
}

/**
 * Browse / Songs / Psalms / Mass
 */

const BROWSE_TABS = [
  { id: "songs", label: "Songs" },
  { id: "psalms", label: "Psalms" },
  { id: "mass", label: "Mass Settings" }
];

function BrowsePage({
  browseTab,
  setBrowseTab,
  selectedLibrary,
  selectedLibraryId,
  setSelectedLibraryId,
  lists,
  setLists
}) {
  if (browseTab === "songs") {
    return (
      <SongListPage
        browseTab={browseTab}
        setBrowseTab={setBrowseTab}
        selectedLibrary={selectedLibrary}
        selectedLibraryId={selectedLibraryId}
        setSelectedLibraryId={setSelectedLibraryId}
        lists={lists}
        setLists={setLists}
      />
    );
  }
  if (browseTab === "psalms") {
    return (
      <PsalmListPage
        browseTab={browseTab}
        setBrowseTab={setBrowseTab}
        selectedLibraryId={selectedLibraryId}
        setSelectedLibraryId={setSelectedLibraryId}
        lists={lists}
        setLists={setLists}
      />
    );
  }
  return (
    <MassSettingsListPage
      browseTab={browseTab}
      setBrowseTab={setBrowseTab}
      selectedLibraryId={selectedLibraryId}
      setSelectedLibraryId={setSelectedLibraryId}
      lists={lists}
      setLists={setLists}
    />
  );
}

function BrowseHeaderControls({
  browseTab,
  setBrowseTab,
  selectedLibraryId,
  setSelectedLibraryId
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 justify-end">
      <div className="flex items-center gap-4 text-sm">
        {BROWSE_TABS.map((t) => {
          const active = browseTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setBrowseTab(t.id)}
              className={`pb-1 border-b-2 transition text-sm ${
                active
                  ? "border-slate-900 text-slate-900 font-semibold"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>View:</span>
        <select
          value={selectedLibraryId}
          onChange={(e) => setSelectedLibraryId(e.target.value)}
          className="text-sm border rounded-xl px-2 py-1 bg-white shadow-sm"
        >
          {LIBRARIES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
          <option value="all">All my libraries</option>
        </select>
      </div>
    </div>
  );
}

function SmartSearchBar({ query, setQuery }) {
  return (
    <div className="mb-2">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by number, title, first line, composer…"
          className="pl-9 pr-3 py-2 text-sm rounded-full border bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primaryBlue w-full"
        />
      </div>
    </div>
  );
}

/**
 * Song List Page
 */

function SongListPage({
  browseTab,
  setBrowseTab,
  selectedLibrary,
  selectedLibraryId,
  setSelectedLibraryId,
  lists,
  setLists
}) {
  const [query, setQuery] = useState("");
  const [topicFilters, setTopicFilters] = useState([]);
  const [languageFilters, setLanguageFilters] = useState([]);
  const [voicingFilters, setVoicingFilters] = useState([]);
  const [scriptureFilters, setScriptureFilters] = useState([]);
  const [sortBy, setSortBy] = useState("number");

  const filteredSongs = useMemo(() => {
    return MOCK_SONGS.filter((s) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        String(s.number).includes(q) ||
        s.composer.toLowerCase().includes(q);
      const matchesTopic =
        topicFilters.length === 0 ||
        topicFilters.some((t) => s.topics.includes(t));
      const matchesLang =
        languageFilters.length === 0 ||
        languageFilters.includes(s.language);
      const matchesVoice =
        voicingFilters.length === 0 || voicingFilters.includes(s.voicing);
      const matchesScripture =
        scriptureFilters.length === 0 ||
        scriptureFilters.some((ref) => s.scripture.includes(ref));

      return (
        matchesQuery &&
        matchesTopic &&
        matchesLang &&
        matchesVoice &&
        matchesScripture
      );
    }).sort((a, b) => {
      if (sortBy === "number") return a.number - b.number;
      if (sortBy === "title")
        return a.title.localeCompare(b.title, undefined, {
          sensitivity: "base"
        });
      if (sortBy === "composer")
        return a.composer.localeCompare(b.composer, undefined, {
          sensitivity: "base"
        });
      return 0;
    });
  }, [
    query,
    topicFilters,
    languageFilters,
    voicingFilters,
    scriptureFilters,
    sortBy
  ]);

  const scopeLabel =
    selectedLibraryId === "all" ? "All my libraries" : selectedLibrary.title;

  const clearFilters = () => {
    setTopicFilters([]);
    setLanguageFilters([]);
    setVoicingFilters([]);
    setScriptureFilters([]);
  };

  return (
    <div>
      <PageHeader
        title="Songs"
        subtitle={`${scopeLabel} • 2025–2026`}
        right={
          <BrowseHeaderControls
            browseTab={browseTab}
            setBrowseTab={setBrowseTab}
            selectedLibraryId={selectedLibraryId}
            setSelectedLibraryId={setSelectedLibraryId}
          />
        }
      />
      <div className="grid grid-cols-12 gap-4 items-start">
        <aside className="col-span-12 lg:col-span-3">
          <FilterPanel
            topicFilters={topicFilters}
            setTopicFilters={setTopicFilters}
            languageFilters={languageFilters}
            setLanguageFilters={setLanguageFilters}
            voicingFilters={voicingFilters}
            setVoicingFilters={setVoicingFilters}
            scriptureFilters={scriptureFilters}
            setScriptureFilters={setScriptureFilters}
            clearFilters={clearFilters}
          />
        </aside>
        <div className="col-span-12 lg:col-span-9">
          <SmartSearchBar query={query} setQuery={setQuery} />
          <SongsTable
            songs={filteredSongs}
            sortBy={sortBy}
            setSortBy={setSortBy}
            lists={lists}
            setLists={setLists}
          />
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  topicFilters,
  setTopicFilters,
  languageFilters,
  setLanguageFilters,
  voicingFilters,
  setVoicingFilters,
  scriptureFilters,
  setScriptureFilters,
  clearFilters
}) {
  const allTopics = ["Call", "Vocation", "Trust", "Comfort", "Communion"];
  const allLanguages = ["English", "Bilingual"];
  const allVoicings = ["Assembly"];
  const allScripture = ["Isaiah 6", "Isaiah 43", "John 6"];

  const toggle = (value, setFunc, current) => {
    setFunc(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-3 text-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-800">Filters</span>
        <button
          onClick={clearFilters}
          className="text-[11px] text-primaryBlue hover:underline"
        >
          Clear all
        </button>
      </div>
      <FilterSection
        label="Topics"
        options={allTopics}
        selected={topicFilters}
        onToggle={(v) => toggle(v, setTopicFilters, topicFilters)}
        searchable
      />
      <FilterSection
        label="Language"
        options={allLanguages}
        selected={languageFilters}
        onToggle={(v) => toggle(v, setLanguageFilters, languageFilters)}
      />
      <FilterSection
        label="Voicing"
        options={allVoicings}
        selected={voicingFilters}
        onToggle={(v) => toggle(v, setVoicingFilters, voicingFilters)}
      />
      <FilterSection
        label="Scripture"
        options={allScripture}
        selected={scriptureFilters}
        onToggle={(v) => toggle(v, setScriptureFilters, scriptureFilters)}
        searchable
      />
    </div>
  );
}

function FilterSection({
  label,
  options,
  selected,
  onToggle,
  searchable = false
}) {
  const [q, setQ] = useState("");
  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-semibold text-slate-700">{label}</div>
      {searchable && (
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter…"
          className="w-full border rounded-lg px-2 py-1 text-[11px]"
        />
      )}
      <div className="space-y-1 max-h-24 overflow-auto">
        {filtered.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`w-full text-left text-[11px] px-2 py-1 rounded-lg border ${
                active
                  ? "bg-primaryBlue/10 border-primaryBlue text-primaryBlue"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              {opt}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-[11px] text-slate-400 italic">No matches</div>
        )}
      </div>
    </div>
  );
}

function SongsTable({ songs, sortBy, setSortBy, lists, setLists }) {
  const [addModalSong, setAddModalSong] = useState(null);

  const handleSort = (key) => {
    setSortBy(key);
  };

  const addToList = (listId, songId) => {
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: l.items.some(
                (it) => it.type === "song" && it.id === songId
              )
                ? l.items
                : [...l.items, { type: "song", id: songId }]
            }
          : l
      )
    );
  };

  const columns = [
    { key: "number", label: "#" },
    { key: "title", label: "Title" },
    { key: "composer", label: "Composer" },
    { key: "topics", label: "Topics" },
    { key: "scripture", label: "Scripture" }
  ];

  return (
    <>
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-3 py-2 text-left font-semibold text-slate-600 cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {sortBy === col.key && (
                      <span className="text-[10px] text-slate-400">▲</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-3 py-2 text-right font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {songs.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-3 py-2 whitespace-nowrap text-slate-700">
                  {s.number}
                </td>
                <td className="px-3 py-2 text-slate-800">{s.title}</td>
                <td className="px-3 py-2 text-slate-700">{s.composer}</td>
                <td className="px-3 py-2 text-slate-600">
                  {s.topics.join(", ")}
                </td>
                <td className="px-3 py-2 text-slate-600">
                  {s.scripture.join(", ")}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setAddModalSong(s)}
                      className="px-2 py-1 rounded-button border border-primaryBlue text-primaryBlue text-[11px] font-semibold uppercase tracking-wide flex items-center gap-1 bg-white hover:bg-slate-50"
                    >
                      <Plus size={12} /> List
                    </button>
                    <button className="px-2 py-1 rounded-button bg-primaryBlue text-white text-[11px] font-semibold uppercase tracking-wide shadow">
                      Open
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {songs.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-3 py-6 text-center text-slate-500"
                >
                  No songs match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {addModalSong && (
        <AddToListModal
          item={{ type: "song", id: addModalSong.id, label: addModalSong.title }}
          lists={lists}
          setLists={setLists}
          onClose={() => setAddModalSong(null)}
          addToList={addToList}
        />
      )}
    </>
  );
}

/**
 * Psalm & Mass lists (simplified)
 */

function PsalmListPage({
  browseTab,
  setBrowseTab,
  selectedLibraryId,
  setSelectedLibraryId,
  lists,
  setLists
}) {
  return (
    <div>
      <PageHeader
        title="Psalms & Gospel Acclamations"
        subtitle="Upcoming celebrations and special liturgies"
        right={
          <BrowseHeaderControls
            browseTab={browseTab}
            setBrowseTab={setBrowseTab}
            selectedLibraryId={selectedLibraryId}
            setSelectedLibraryId={setSelectedLibraryId}
          />
        }
      />
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">
                Celebration
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">
                Psalm
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">
                Title
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">
                Composer
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PSALMS.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-3 py-2">{p.celebration}</td>
                <td className="px-3 py-2">{p.psalm}</td>
                <td className="px-3 py-2">{p.title}</td>
                <td className="px-3 py-2">{p.composer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MassSettingsListPage({
  browseTab,
  setBrowseTab,
  selectedLibraryId,
  setSelectedLibraryId
}) {
  return (
    <div>
      <PageHeader
        title="Mass Settings"
        subtitle="Browse by setting"
        right={
          <BrowseHeaderControls
            browseTab={browseTab}
            setBrowseTab={setBrowseTab}
            selectedLibraryId={selectedLibraryId}
            setSelectedLibraryId={setSelectedLibraryId}
          />
        }
      />
      <div className="grid md:grid-cols-2 gap-3">
        {MOCK_MASS_SETTINGS.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border bg-white shadow-sm p-3 space-y-1"
          >
            <div className="text-sm font-semibold">{m.title}</div>
            <div className="text-[11px] text-slate-500">{m.composer}</div>
            <div className="text-[11px] text-slate-500">
              Parts: {m.parts.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * My Lists
 */

function MyListsPage({ lists }) {
  return (
    <div>
      <PageHeader title="My Lists" />
      <div className="grid md:grid-cols-2 gap-3">
        {lists.map((list) => (
          <div
            key={list.id}
            className="rounded-2xl border bg-white shadow-sm p-3 space-y-1"
          >
            <div className="text-sm font-semibold">{list.name}</div>
            <div className="text-[11px] text-slate-500">
              {list.items.length} items
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Add to list modal (simplified)
 */

function AddToListModal({ item, lists, setLists, onClose, addToList }) {
  const [selectedListId, setSelectedListId] = useState(
    lists.length > 0 ? lists[0].id : null
  );
  const [newListName, setNewListName] = useState("");

  const handleAdd = () => {
    if (selectedListId) {
      addToList(selectedListId, item.id);
      onClose();
      return;
    }
    if (newListName.trim()) {
      const id = nextListId(lists);
      setLists([
        ...lists,
        { id, name: newListName.trim(), items: [{ type: item.type, id: item.id }] }
      ]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Add to My List</div>
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>
        <div className="text-xs text-slate-600">
          {item.type === "song" ? "Song" : "Item"}: {item.label}
        </div>
        <div className="space-y-2 text-xs">
          {lists.length > 0 && (
            <div>
              <div className="font-semibold mb-1">Existing lists</div>
              <select
                value={selectedListId ?? ""}
                onChange={(e) =>
                  setSelectedListId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full border rounded-lg px-2 py-1"
              >
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
                <option value="">– Create new list –</option>
              </select>
            </div>
          )}
          <div>
            <div className="font-semibold mb-1">New list</div>
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              className="w-full border rounded-lg px-2 py-1"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-button border border-slate-300 text-xs text-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 rounded-button bg-primaryBlue text-white text-xs font-semibold uppercase tracking-wide"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
