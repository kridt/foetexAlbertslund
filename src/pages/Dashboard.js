import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { database } from "../firebase";

export default function Dashboard() {
  const departementsList = [
    { name: "Kundeservice", id: 602 },
    { name: "Bager", id: 605 },
    { name: "Service", id: 608 },
    { name: "Service", id: 604 },
    { name: "Frugt & Grønt", id: "040" },
    { name: "Food", id: "080" },
    { name: "Freshfood", id: "030" },
    { name: "Nonfood", id: 310 },
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
        (coworker) => coworker.leder === false
      );
      setVoterble(nonLeaders);
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
        const findVotedCoworker = allCoworkers?.find(
          (coworker) => coworker["Person ID"] === voted?.votedCoworker
        );

        findVotedCoworker.description = voted?.description;
        console.log(findVotedCoworker);
        if (voted) {
          setVoted(true);

          setVote(findVotedCoworker);
        }
      });

    if (currentCoworker["Person ID"] === 286828) {
      setAdmin(true);
    }
  }, []);

  async function handleVote(e) {
    e.preventDefault();
    const votedCoworker = e.target.vote.value;
    const description = e.target.description.value;
    const dato = new Date();
    const voteId = e.target.vote.nextElementSibling.firstChild.id;

    const votedCoworkerName = votedCoworker.split(" fra ")[0];

    const findVotedCoworker = allCoworkers?.find(
      (coworker) =>
        coworker.Navn.split(", ")[1] + " " + coworker.Navn.split(", ")[0] ===
        votedCoworkerName
    );
    console.log(findVotedCoworker);

    try {
      database
        .collection("votes")
        .doc(`stemme-${currentCoworker["Person ID"]}`)
        .set({
          votedCoworker: findVotedCoworker["Person ID"],
          description: description,
          votedBy: currentCoworker["Person ID"],
          date: dato,
          device: window.navigator.userAgent,
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
          <p>Stemme: {vote?.Navn}</p>
          <p>Afdeling: {vote["Afd."]}</p>
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

            <input list="voting" id="vote" name="vote" />

            <datalist name="test" id="voting">
              {voterble?.map((coworker) => {
                const name = coworker.Navn.split(", ");
                const fullName = name[1] + " " + name[0];

                const dep = departementsList.find(
                  (dep) => dep.id === coworker["Afd."]
                );

                return (
                  <option
                    value={fullName + " fra " + dep?.name + " afdelingen"}
                    key={coworker["Person ID"]}
                    id={coworker["Person ID"]}
                  />
                );
              })}
            </datalist>

            {/* <select name="vote">
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
            </select> */}
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
