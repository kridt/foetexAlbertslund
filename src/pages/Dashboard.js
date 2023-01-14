import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { database } from "../firebase";

export default function Dashboard() {
  const departementsList = [
    { name: "Service", id: 602 },
    { name: "Service", id: 605 },
    { name: "Service", id: 608 },
    { name: "Service", id: 604 },
    { name: "IDK", id: "040" },
    { name: "IDK", id: "080" },
    { name: "IDK", id: "030" },
    { name: "IDK", id: 310 },
    { name: "IDK", id: "080" },
  ];

  const navigate = useNavigate();
  const [voted, setVoted] = useState(false);
  const [allCoworkers, setAllCoworkers] = useState([]);
  const [currentCoworker, setCurrentCoworker] = useState({});
  const [voterble, setVoterble] = useState([]);
  const [vote, setVote] = useState({});
  const [admin, setAdmin] = useState(false);
  const [currentCoworkerName, setCurrentCoworkerName] = useState("");
  useEffect(() => {
    const allCoworkers = JSON.parse(localStorage.getItem("allCoworkers"));
    const currentCoworker = JSON.parse(localStorage.getItem("currentCoworker"));
    var name = currentCoworker.Navn.split(", ");
    setCurrentCoworkerName(name[1] + " " + name[0]);
    allCoworkers?.forEach((coworker) => {
      var nonLeaders = allCoworkers?.filter(
        (coworker) => coworker.leader === false
      );
      setVoterble(allCoworkers);
    });
    setAllCoworkers(allCoworkers);
    setCurrentCoworker(currentCoworker);

    database
      .collection("votes")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        const voted = data.find(
          (item) => item.votedBy === currentCoworker["Person ID"]
        );

        if (voted) {
          setVoted(true);

          setVote(voted);
        }
      });

    if (
      currentCoworker["Person ID"] === 286828 ||
      currentCoworker["Person ID"] === 125811
    ) {
      setAdmin(true);
    }
  }, []);

  async function handleVote(e) {
    e.preventDefault();
    const votedCoworker = e.target.vote.value;
    const description = e.target.description.value;
    const dato = new Date();
    console.log(dato);

    try {
      database
        .collection("votes")
        .doc(`stemme-${currentCoworker["Person ID"]}`)
        .set({
          votedCoworker: parseFloat(votedCoworker),
          description: description,
          votedBy: currentCoworker["Person ID"],
          date: dato,
          device: window.navigator.userAgent,
          votedCoworkerName: allCoworkers?.find(
            (person) => person["Person ID"] === parseFloat(votedCoworker)
          ).name,
          votedCoworkerDep: allCoworkers?.find(
            (person) => person["Person ID"] === parseFloat(votedCoworker)
          ).dep,
        })
        .then(() => {
          alert("Din stemme er nu registreret");
          navigate("/");
        });
    } catch (error) {
      alert("Der skete en fejl, prøv igen");
      console.log(error);
    }
  }

  async function handleDeleteVote() {
    if (window.confirm("Er du sikker på du vil slette din stemme?")) {
      database
        .collection("votes")
        .doc(`stemme-${currentCoworker["Person ID"]}`)
        .delete()
        .then(() => {
          alert("Din stemme er nu slettet");
          navigate("/");
        });
    } else {
      return;
    }
  }
  return (
    <div style={{ color: "#fff", textAlign: "center" }}>
      <button onClick={() => navigate("/")}>Log ud</button>
      <h1>Hej {currentCoworkerName}</h1>

      {voted ? (
        <>
          <h3>Du har allerede stem på månedens medarbejder</h3>
          <p>Stemme: {vote?.votedCoworkerName}</p>
          <p>Afdeling: {vote?.votedCoworkerDep}</p>
          <p>Beskrivelse: {vote?.description}</p>
          <br />
          <br />
          <button onClick={() => handleDeleteVote()}>Slet min stemme?</button>
        </>
      ) : (
        <>
          <form onSubmit={(e) => handleVote(e)}>
            <label>Hvem vil du stemme på?</label>
            <br />
            <br />
            <select name="vote">
              {voterble?.map((coworker) => {
                const name = coworker.Navn.split(", ");
                const fullName = name[1] + " " + name[0];
                const dep = departementsList.find(
                  (dep) => dep.id === coworker["Afd."]
                );

                return (
                  <option
                    value={coworker["Person ID"]}
                    key={coworker["Person ID"]}
                  >
                    {fullName} fra {dep?.name + " "}
                    afdelingen
                  </option>
                );
              })}
            </select>
            <br />
            <br />
            <div>
              <label htmlFor="desc">
                Hvorfor skal han/hun vinde månedens medarbejder?
              </label>
              <br />
              <br />
              <textarea name="description" cols="30" rows="10"></textarea>
            </div>
            <br />
            <input type="submit" value="STEM" />
          </form>
        </>
      )}
      <br />
      <br />
      <br />
      {admin && (
        <Link style={{ color: "white" }} to="/admin">
          Admin side
        </Link>
      )}
    </div>
  );
}
