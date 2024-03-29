import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/auth-context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PathList from "../../config/Paths";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { loginAuth } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await loginAuth(emailRef.current.value, passwordRef.current.value);
      navigate(PathList.home);
    } catch (err) {
      setError("Failed to log in");
      console.log(err);
    }

    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100  mt-3" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to={PathList.forgotPassword}>Forgot Password?</Link>
          </div>
        </Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
      </Card>
    </>
  );
}
