import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase";
export default function Login() {
  const [allCoworkers, setAllCoworkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    database
      .collection("allCoworkers")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setAllCoworkers(data);
        localStorage.setItem("allCoworkers", JSON.stringify(data));
      });

    console.log(allCoworkers);
  }, [setAllCoworkers, allCoworkers]);

  function handleLogin(e) {
    e.preventDefault();
    const sallingId = e.target.value;

    if (sallingId.length === 6) {
      var foundCoworker = allCoworkers.find(
        (coworker) => coworker["Person ID"] === parseInt(sallingId)
      );

      console.log(foundCoworker);
      if (foundCoworker) {
        localStorage.setItem("currentCoworker", JSON.stringify(foundCoworker));
        navigate("/dashboard/" + foundCoworker["Person ID"]);
      } else {
        alert("Dit lønnummer er forkert");
      }
    } else {
      return;
    }
  }

  return (
    <div>
      <div style={{ width: "100vw", textAlign: "center" }}>
        <img
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
          src="/logo.png"
          alt="foetexlogo"
        />
      </div>

      <form style={{ width: "300px", margin: "0 auto", textAlign: "center" }}>
        <label
          style={{
            color: "white",
            textAlign: "center",
          }}
          htmlFor="login"
        >
          Log ind med dit lønnummer
        </label>
        <br />
        <br />
        <br />
        <input
          style={{
            width: "200px",
            height: "30px",
            border: "1px solid #ccc",
            borderRadius: "3px",
            textAlign: "center",
          }}
          onChange={(e) => handleLogin(e)}
          type="tel"
          id="login"
          name="sallingId"
        />
      </form>
    </div>
  );
}
