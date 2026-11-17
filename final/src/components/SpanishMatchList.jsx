
import { useState, useEffect } from "react";

// the website that hosts the data
const SITE = "https://raw.githubusercontent.com";
// the folder for the 2025/26 season
const FOLDER = "/openfootball/football.json/master/2025-26";
// the file for Spain's first division: LaLiga
const FILE = "/es.1.json";
// glue the three parts into one address
const SEASON_URL = SITE + FOLDER + FILE;

// build one list item from one match object
function makeItem(match) {
  // date plus both teams identifies the match
  const itemKey = match.date + match.team1 + match.team2;

  return (
    <li key={itemKey}>
      {match.date}: {match.team1} vs {match.team2}
    </li>
  );
}

// LaLiga matches of the 2025/26 season
function SpanishMatchList(props) {
  // get the search text and month from App
  const searchText = props.searchText;
  const month = props.month;

  // state: the matches; empty until the data arrives
  const [matches, setMatches] = useState([]);
  // state: are we still waiting?
  const [isLoading, setIsLoading] = useState(true);
  // state: error message if something goes wrong
  const [errorMessage, setErrorMessage] = useState("");

  // async function to load LaLiga matches
  async function loadMatches() {
    try {
      const response = await fetch(SEASON_URL);

      if (!response.ok) {
        throw new Error("The server answered " + response.status);
      }

      const season = await response.json();
      const seasonMatches = season.matches;
      setMatches(seasonMatches);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  }

  // start loading when the component mounts
  function startLoading() {
    loadMatches();
  }

  useEffect(startLoading, []);

  // show loading state
  if (isLoading) {
    return (
      <section className="box">
        <h2>LaLiga 2025/26</h2>
        <p>Loading LaLiga matches...</p>
      </section>
    );
  }

  // show error state
  if (errorMessage !== "") {
    return (
      <section className="box">
        <h2>LaLiga 2025/26</h2>
        <p className="error">Could not load LaLiga matches.</p>
        <p className="error">({errorMessage})</p>
      </section>
    );
  }

  // check whether a match fits the search and month
  function matchesFilters(match) {
    // lowercase the search text
    const lowerSearch = searchText.toLowerCase().trim();

    // check both home and away teams
    const homeMatches = match.team1.toLowerCase().includes(lowerSearch);
    const awayMatches = match.team2.toLowerCase().includes(lowerSearch);

    // either team can match
    const teamMatches = homeMatches || awayMatches;

    // an empty month means all months
    const monthMatches = month === "" || match.date.startsWith(month);

    // both conditions must be true
    return teamMatches && monthMatches;
  }

  // filter the matches
  const filteredMatches = matches.filter(matchesFilters);

  // count the matches
  const matchCount = filteredMatches.length;

  // keep only the first 20
  const firstTwenty = filteredMatches.slice(0, 20);

  // turn each match into a list item
  const items = firstTwenty.map(makeItem);

  return (
    <section className="box">
      <h2>LaLiga 2025/26</h2>

      <p>Found {matchCount} matching matches. Showing up to 20:</p>

      {/* show a message if nothing matches */}
      {matchCount === 0 ? (
        <p>No LaLiga matches found.</p>
      ) : (
        <ul>{items}</ul>
      )}
    </section>
  );
}

export default SpanishMatchList;
