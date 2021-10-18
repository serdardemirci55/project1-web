import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { useFormFields } from "../lib/hooksLib";
import axios from "axios";
import "./Signup.css";

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    fistName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    userRole: "",
  });
  const history = useHistory();

  function validateForm() {
    try {
      return (
        fields.email.length > 0 &&
        fields.firstName.length > 0 &&
        fields.lastName.length > 0 &&
        fields.password.length > 0 &&
        fields.password === fields.confirmPassword &&
        fields.userRole.length > 0
      );
    } catch (e) {
      return false;
    }
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
    signupParams.append("first_name", fields.firstName);
    signupParams.append("last_name", fields.lastName);
    signupParams.append("role", fields.userRole);
    axios
      .post(
        `http://Cmpe281Project1AppLoadbalancer-1926089453.us-east-2.elb.amazonaws.com:8080/signup`,
        signupParams,
        config
      )
      .then((res) => {
        
        if (res.data !== "Success") {
          alert(res.data.toString());
        } else {
          alert("Signup Success!");
          history.push("/login");
        }
      });
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="firstName" size="lg">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={fields.firstName}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="lastName" size="lg">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={fields.lastName}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <Form.Group controlId="userRole" size="lg">
          <Form.Label>User Role</Form.Label>
          <Form.Control
            type="text"
            value={fields.userRole}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Signup
        </Button>
      </Form>
    );
  }

  return <div className="Signup">{renderForm()}</div>;
}