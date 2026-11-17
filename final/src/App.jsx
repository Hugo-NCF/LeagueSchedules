
import { useState } from "react";

import "./App.css";

import PageHeader from "./components/PageHeader.jsx";
import MatchList from "./components/MatchList.jsx";
import SpanishMatchList from "./components/SpanishMatchList.jsx";
import SearchBox from "./components/Searchbox.jsx";
import MonthPicker from "./components/Filter.jsx";

function App() {
  // the search text lives in App, the parent of both
  const [searchText, setSearchText] = useState("");

  // state: the chosen month; "" means every month
  const [month, setMonth] = useState("");

  // runs every time the search box changes
  function handleSearchChange(event) {
    // read the text that is now in the box
    const typedText = event.target.value;
    // store it; React draws App and its children again
    setSearchText(typedText);
  }

  // runs every time the month menu changes
  function handleMonthChange(event) {
    // read the value of the chosen option, like "2025-12"
    const chosenMonth = event.target.value;
    // store it; React draws App and its children again
    setMonth(chosenMonth);
  }

  // return one parent div that holds everything
  return (
    <div>
      <PageHeader
        title="Premier League 2025/26 & LaLiga 2025/26"
        subtitle="Week 13: fetching APIs"
      />

      <SearchBox
        value={searchText}
        onSearchChange={handleSearchChange}
      />

      <MonthPicker
        value={month}
        onMonthChange={handleMonthChange}
      />

      <MatchList searchText={searchText} month={month} />

      <SpanishMatchList searchText={searchText} month={month} />
    </div>
  );
}

export default App;
