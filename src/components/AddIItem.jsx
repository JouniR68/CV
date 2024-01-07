import { useRef, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Notificaatio from "../../NotificaatioDialog";

const AddItem = () => {
  let isUserLoggedIn = sessionStorage.getItem("loggedIn");
  const nameRef = useRef();
  const kuvausRef = useRef();
  const typeSelectorRef = useRef();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [work, setWork] = useState(false);
  const [close, setClose] = useState(false);

  console.log("isUserLoggedIn: ", isUserLoggedIn);
  if (!isUserLoggedIn || isUserLoggedIn === false) {
    sessionStorage.setItem("loggedIn", false);
    setError("käyttäjä ei ole kirjautunut");
  } else {
    isUserLoggedIn = true;
  }

  let options = [
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
  ];

  const subjects = [
    { value: "project", label: "Project" },
    { value: "issue", label: "Issues" },
    { value: "tasks", label: "Tasks" },
    { value: "dev", label: "Development" },
  ];

  const personalSubjects = [{ value: "tasks", label: "Tasks" }];

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Adding :", data);
    console.log("type:", type);
    try {
      const response = await axios.post(`http://localhost:3852/${type}`, data);
      console.log("json response: ", response.data);
    } catch (err) {
      console.log("Meni aivan vituiksi, error: ", err);
    }
    nameRef.current.value = "";
    kuvausRef.current.value = "";
  };

  const handleData = (e) => {
    console.log("Value: " + e.value);

    if (e.value === "work") {
      setType("work");
      setWork(true);
    } else {
      setType("personal");
      setWork(false);
    }

    e.target?.name === "nimi"
      ? setData({ ...data, name: e.target?.value })
      : null;
    e.target?.name === "kuvaus"
      ? setData({ ...data, kuvaus: e.target?.value })
      : null;
    e.value === "issue" ||
    e.value === "tasks" ||
    e.value === "dev" ||
    e.value === "project"
      ? setData({ ...data, subject: e.value })
      : "";
  };

  const onCloseError = () => {
    console.log("onCloseError");
    console.log("error: ", error);
    setClose(true);
  };

  return (
    <div>
      {error && <Notificaatio message={error} onClose={onCloseError} />}
      {isUserLoggedIn && (
        <form className="adder--form">
          <Select
            id="adder--select"
            name="selector"
            onChange={handleData}
            options={options}
          />

          {work ? (
            <Select
              id="adder--select"
              name="subjects"
              onChange={handleData}
              options={subjects}
            />
          ) : (
            <Select
              id="adder--select"
              name="subjects"
              onChange={handleData}
              options={personalSubjects}
            />
          )}

          <input
            id="adder--input"
            ref={nameRef}
            type="text"
            name="nimi"
            onChange={handleData}
            placeholder="Subject"
          />

          <textarea
            id="adder--textarea"
            ref={kuvausRef}
            name="kuvaus"
            placeholder="Data"
            onChange={handleData}
          />
          <button id="adder--button" onClick={onSubmit}>
            Lisää data
          </button>
        </form>
      )}
    </div>
  );
};

export default AddItem;
