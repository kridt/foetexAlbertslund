import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import excelToJson from "../components/excelToJson";

export default function AdminSite() {
  const navigate = useNavigate();
  const [currentCoworker, setcurrentCoworker] = useState({});

  useEffect(() => {
    setcurrentCoworker(JSON.parse(localStorage.getItem("currentCoworker")));
  }, []);

  function handleNewDatabase(e) {
    e.preventDefault();
    var res = excelToJson(e.target[0].files[0]);

    /* localStorage.setItem(
      "potentielNewDatabase",
      JSON.stringify(excelToJson(e.target[0].files[0]))
    ); 
    */
    navigate("/confirm");
  }

  return (
    <div style={{ color: "white", textAlign: "center" }}>
      <button
        onClick={() => navigate(`/dashboard/${currentCoworker?.sallingId}`)}
      >
        tilbage
      </button>
      <h1>{"admin site"}</h1>
      <div
        style={{
          border: "1px solid white",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "10px",
        }}
      >
        <p>Opdater medarbejder databasen</p>

        <form onSubmit={(e) => handleNewDatabase(e)}>
          <label htmlFor="file">Der skal vælges en excel fil</label>
          <br />
          <div>
            <p>Sådan ska excel filen se ud</p>
            <img
              style={{ width: "100%", height: "auto" }}
              src="/example.PNG"
              alt="example"
            />
          </div>
          <br />
          <input type="file" accept=".xlsx" />
          <br />
          <br />
          <br />
          <button type="submit">Opdater</button>
        </form>
      </div>
    </div>
  );
}
