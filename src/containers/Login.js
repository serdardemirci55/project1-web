import React from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useAppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const history = useHistory();
  const { setUser } = useAppContext();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    let signupParams = new URLSearchParams();
    signupParams.append("username", fields.email);
    signupParams.append("password", fields.password);

    axios
      .post(
        `http://Cmpe281Project1AppLoadbalancer-1926089453.us-east-2.elb.amazonaws.com:8080/login`,
        signupParams,
        config
      )
      .then((res) => {
        console.log(res);

        if (res.data.toString().startsWith("Incorrect")) {
          alert(res.data.toString());
        } else {
          setUser({
            userToken: res.data.toString(),
            username: fields.email,
          });
          history.push("/");
        }
      });
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}