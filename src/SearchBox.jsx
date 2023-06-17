import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SearchBox({ country }) {
  const [searchValue, setSearchValue] = useState();
  // altSpellings
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // country && setSearchValue(country);
  console.log("props country", country);

  function searchHandler() {
    setLoading(true);
    axios
      .get(`https://restcountries.com/v3.1/name/${searchValue}?fullText=true`)
      .then((res) => {
        setResult(res.data);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
      });
  }
  useEffect(() => {
    searchHandler();
  }, [country]);

  return (
    <div className="searchBox">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          aria-label="Sizing example input"
          placeholder="search country"
          onKeyUp={(e) => setSearchValue(e.target.value)}
          aria-describedby="inputGroup-sizing-default"
        />
      </div>

      <button type="button" onClick={searchHandler} class="btn btn-success">
        Search
      </button>

      {loading ? (
        "Loading..."
      ) : (
        <div className="card">
          {result && (
            <>
              <img src={result[0].flags.png} />
              <h3>Name:{result[0].altSpellings[1]}</h3>
              <h4>Symbol:{result[0].fifa}</h4>
              <h4>population:{result[0].population}</h4>
              <h4>capital:{result[0].capital[0]}</h4>
            </>
          )}
          {error ? (
            <div class="alert alert-danger" role="alert">
              something went wrong
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}
