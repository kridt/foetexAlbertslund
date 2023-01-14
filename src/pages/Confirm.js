import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase";

export default function Confirm() {
  const [potentielNewDatabase, setPotentielNewDatabase] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      const local = JSON.parse(localStorage.getItem("potentielNewDatabase"));

      setPotentielNewDatabase(local);
    }, 1000);
  }, []);
  console.log(potentielNewDatabase);

  function changeDatabase() {
    database
      .collection("allCoworkers")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      })
      .then(() => {
        var batch = database.batch();

        potentielNewDatabase?.forEach((item) => {
          console.log(item);
          var docRef = database
            .collection("allCoworkers")
            .doc("coworker-" + item.sallingId);
          batch.set(docRef, item);
        });

        batch.commit().then(() => {
          alert("Database er opdateret");
          navigate("/admin");
        });
      });

    /* potentielNewDatabase?.forEach((item) => {
      console.log(item);
      database
        .collection("allCoworkers")
        .doc(`${"coworker-" + item.sallingId}`)
        .set(item);
    });

    navigate("/admin"); */
  }

  return (
    <div style={{ color: "white" }}>
      <h1>Ser det rigtigt ud?</h1>

      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <button onClick={() => changeDatabase()}>Ja</button>
        <button onClick={() => navigate("/admin")}>Nej</button>
      </div>

      <br />
      <br />
      <br />

      <p>Der er {potentielNewDatabase.length} medarbejdere på listen</p>
      <div>
        {potentielNewDatabase.map((item) => {
          return (
            <div
              style={{
                backgroundColor: "#222",
                marginBottom: "2em",
                padding: "1em",
              }}
              key={item.sallingId}
            >
              <p>Navn: {item.name}</p>
              <p>Lønnummer: {item.sallingId}</p>
              <p>Leder?: {item.leder ? <>ja</> : <>nej</>}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
