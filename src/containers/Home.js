import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Home.css";
import { useHistory } from "react-router-dom";
import { AppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function Home() {
  const MAX_ATTACHMENT_SIZE = 10000000;
  const file = useRef(null);
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    title: "",
    description: "",
  });

  const [files, setFiles] = useState([]);

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

  async function downloadFile(id) {
    const { data } = await axios.get(
      "http://Cmpe281Project1AppLoadbalancer-1926089453.us-east-2.elb.amazonaws.com:8080/url?id=" +
        id,
      {
        headers: {
          Authorization: "Bearer " + appContext.user.userToken,
        },
      }
    );
    console.log(data);
    window.location.href = data;
  }

  async function deleteFile(id) {
    const { data } = await axios.delete(
      "http://Cmpe281Project1AppLoadbalancer-1926089453.us-east-2.elb.amazonaws.com:8080/file?id=" +
        id,
      {
        headers: {
          Authorization: "Bearer " + appContext.user.userToken,
        },
      }
    );
    console.log(data);
    fetchFiles();
  }

  async function handleSubmit(event) {
    event.preventDefault();

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
          fetchFiles();
        });
    } else {
      alert("Please select a file to upload.");
    }
  }

  React.useEffect(() => {
    if (
      appContext !== null &&
      appContext.user !== null &&
      appContext.user.userToken !== ""
    ) {
      fetchFiles();
    }
  }, [appContext]);

  const fetchFiles = async () => {
    const { data } = await axios.get(
      "http://Cmpe281Project1AppLoadbalancer-1926089453.us-east-2.elb.amazonaws.com:8080/file?username=" +
        appContext.user.username,
      {
        headers: {
          Authorization: "Bearer " + appContext.user.userToken,
        },
      }
    );
    console.log(data);
    setFiles(data);
  };

  return (
    <div className="Home">
      <AppContext.Consumer>
        {(context) =>
          context.user.userToken !== "" ? (
            <>
              <div>
                <Container>
                  <Row>
                    <Col>Title</Col>
                    <Col>Description</Col>
                    <Col>Filename</Col>
                  </Row>
                  {files.map((file) => (
                    <Container>
                      <Row>
                        <Col>
                          <p key={file.title}>{file.title}</p>
                        </Col>
                        <Col>
                          <p key={file.description}>{file.description}</p>
                        </Col>
                        <Col>
                          <p key={file.fileName}>{file.fileName}</p>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <Button
                            block
                            type="submit"
                            size="lg"
                            onClick={() => downloadFile(file.id)}
                          >
                            Download
                          </Button>
                        </Col>
                        <Col>
                          <Button block type="submit" size="lg">
                            Update
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            block
                            type="submit"
                            size="lg"
                            onClick={() => deleteFile(file.id)}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  ))}
                </Container>
              </div>
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
                <Button
                  block
                  type="submit"
                  size="lg"
                  disabled={!validateForm()}
                >
                  Upload
                </Button>
              </Form>
            </>
          ) : (
            history.push("/login")
          )
        }
      </AppContext.Consumer>
    </div>
  );
}