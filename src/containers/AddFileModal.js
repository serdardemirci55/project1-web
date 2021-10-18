import React, { useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useFormFields } from "../lib/hooksLib";
import { AppContext } from "../lib/contextLib";
import axios from "axios";

export default function AddFileModal(props) {
  const MAX_ATTACHMENT_SIZE = 10000000;
  const file = useRef(null);
  const [fields, handleFieldChange] = useFormFields({
    title: "",
    description: "",
  });

  const appContext = React.useContext(AppContext);

  function validateForm() {
    try {
      return fields.title.length > 0 && fields.description.length > 0;
    } catch (e) {
      return false;
    }
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
    validateForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(props);

    if (file.current && file.current.size > MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${MAX_ATTACHMENT_SIZE / 1000000} MB.`
      );
      return;
    } else if (file.current) {
      var formData = new FormData();
      formData.append("file", file.current);
      formData.append("username", appContext.user.username);
      formData.append("title", fields.title);
      formData.append("description", fields.description);

      axios
        .post(
          `http://Cmpe281Project1AppLoadbalancer-1926089453.us-east-2.elb.amazonaws.com:8080/file`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + appContext.user.userToken,
            },
          }
        )
        .then((res) => {
          console.log(res);
          fields.title = "";
          fields.description = "";
          props.onUploaded();
          props.onHide();
        });
    } else {
      alert("Please select a file to upload.");
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Upload a new file
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={fields.title}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={fields.description}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <Button block type="submit" size="lg" disabled={!validateForm()}>
            Upload
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}