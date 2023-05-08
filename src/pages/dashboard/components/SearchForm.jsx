import { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { queryDoc } from "../../../setup/QueryDB";
import { activeFirestore } from "../../../config/MainConfig";

export default function SearchForm(props) {
  //console.log('SearchForm.js props:', props)
  const { setError } = props.errorState;
  const { setSearchState } = props.searchState;

  const classes = `d-flex flex-row align-items-center justify-content-center ${
    props.customClasses || ""
  }`;
  const pidRef = useRef();
  const [loading, setLoading] = useState(false);

  const resetInputValue = () => {
    const value = pidRef.current.value;
    pidRef.current.value = "";
    return value;
  };

  async function handleQuery(e) {
    e.preventDefault();

    setLoading(true);
    const pid = resetInputValue();
    setError("");

    //console.log(e)
    const data = await queryDoc(e, activeFirestore, pid);

    if (!data) {
      setError(pid + " is not a valid pid");
      setSearchState(null);
    } else {
      setSearchState(data);
    }

    setLoading(false);
  }

  return (
    <>
      <Form
        className={classes}
        onSubmit={handleQuery}
        style={
          props.styles || { width: "90%", backgroundColor: "rgba(248,249,250)" }
        }
      >
        <Form.Label className="d-flex align-items-center justify-content-center">
          Pid
        </Form.Label>
        <Form.Control
          autoFocus
          className="m-3"
          type="Pid"
          ref={pidRef}
          required
        />
        <Button
          type="submit"
          className="mt-3 mb-3"
          style={{ width: "10rem" }}
          disabled={loading}
        >
          Search
        </Button>
      </Form>
    </>
  );
}
