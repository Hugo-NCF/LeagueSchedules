
import { useState, useEffect } from "react";

// the website that hosts the data
const SITE = "https://raw.githubusercontent.com";
// the folder for the 2025/26 season
const FOLDER = "/openfootball/football.json/master/2025-26";
// the file for England's first division: the Premier League
const FILE = "/en.1.json";
// glue the three parts into one address
const SEASON_URL = SITE + FOLDER + FILE;

// build one list item from one match object
function makeItem(match) {
  // the date plus the home team is unique for each match
  const itemKey = match.date + match.team1;

  // return the list item
  return (
    <li key={itemKey}>
      {match.date}: {match.team1} vs {match.team2}
    </li>
  );
}

// every Premier League match of the 2025/26 season
function MatchList(props) {
  // get the search text and month from App
  const searchText = props.searchText;
  const month = props.month;

  // state: the matches; empty until the data arrives
  const [matches, setMatches] = useState([]);
  // state: are we still waiting? starts at true
  const [isLoading, setIsLoading] = useState(true);
  // state: what went wrong; empty means nothing did
  const [errorMessage, setErrorMessage] = useState("");

  // async: this function is allowed to wait
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

  // load the data once, on mount
  function startLoading() {
    loadMatches();
  }

  useEffect(startLoading, []);

  // show loading state
  if (isLoading) {
    return (
      <section className="box">
        <h2>Premier League Matches</h2>
        <p>Loading matches...</p>
      </section>
    );
  }

  // show error state
  if (errorMessage !== "") {
    return (
      <section className="box">
        <h2>Premier League Matches</h2>
        <p className="error">Could not load the matches.</p>
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

    // either team can match the search
    const teamMatches = homeMatches || awayMatches;

    // an empty month means all months
    const monthMatches = month === "" || match.date.startsWith(month);

    // both filters must match
    return teamMatches && monthMatches;
  }

  // keep only matches that fit the filters
  const filteredMatches = matches.filter(matchesFilters);

  // count matching matches
  const matchCount = filteredMatches.length;

  // keep only the first 20 matching matches
  const firstTwenty = filteredMatches.slice(0, 20);

  // turn each match into a list item
  const items = firstTwenty.map(makeItem);

  return (
    <section className="box">
      <h2>Premier League Matches</h2>

      <p>Found {matchCount} matching matches. Showing up to 20:</p>

      {/* show a message if nothing matches */}
      {matchCount === 0 ? (
        <p>No Premier League matches found.</p>
      ) : (
        <ul>{items}</ul>
      )}
    </section>
  );
}

export default MatchList;
