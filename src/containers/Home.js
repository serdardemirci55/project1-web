import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "./Home.css";
import { useHistory } from "react-router-dom";
import { AppContext } from "../lib/contextLib";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import AddFileModal from "./AddFileModal";
import UpdateFileModal from "./UpdateFileModal";

export default function Home() {
  const history = useHistory();

  const [addModalShow, setAddModalShow] = React.useState(false);
  const [updateModalShow, setUpdateModalShow] = React.useState(false);

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);

  const appContext = React.useContext(AppContext);

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
    alert("File deleted!");
    fetchFiles();
  }

  function openUpdateFileModal(file) {
    setSelectedFile(file);
    setUpdateModalShow(true);
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
      "http://Cmpe281Project1AppLoadbalancer-1926089453.us-east-2.elb.amazonaws.com:8080/file",
      {
        headers: {
          Authorization: "Bearer " + appContext.user.userToken,
        },
      }
    );
    setFiles(data);
  };

  return (
    <div className="Home">
      <AppContext.Consumer>
        {(context) =>
          context.user.userToken !== "" ? (
            context.user.userRole == "admin" ? (
              <>
                <div>
                  <Container>
                    <Container>
                      <Row>
                        <Col xs="3"><b>User Name: </b> {context.user.userName} <p> </p></Col>
                      </Row>
                    </Container>
                    <Container>
                      <Row className="align-items-center">
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Name</b>
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Last Name</b>
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Upload Time</b>
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Update Time</b>
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Description</b>
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Title</b>
                        </Col>
                        <Col></Col>
                        <Col></Col>
                      </Row>
                    </Container>
                    {files.map((file) => (
                      <Container style={{ paddingTop: 10 }}>
                        <Row>
                          <Col>
                            <p key={file.firstName}>{file.firstName}</p>
                          </Col>
                          <Col>
                            <p key={file.lastName}>{file.lastName}</p>
                          </Col>
                          <Col>
                            <p key={file.uploadTime}>{file.uploadTime}</p>
                          </Col>
                          <Col>
                            <p key={file.updatedTime}>{file.updatedTime}</p>
                          </Col>
                          <Col>
                            <p key={file.description}>{file.description}</p>
                          </Col>
                          <Col>
                            <p key={file.title}>{file.title}</p>
                          </Col>
                          <Col>
                            <Button
                              variant="success"
                              block
                              size="sm"
                              onClick={() => downloadFile(file.id)}
                            >
                              Download
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              variant="danger"
                              block
                              size="sm"
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

                <UpdateFileModal
                  show={updateModalShow}
                  file={selectedFile}
                  onUploaded={() => fetchFiles()}
                  onHide={() => setUpdateModalShow(false)}
                />

                <AddFileModal
                  show={addModalShow}
                  onUploaded={() => fetchFiles()}
                  onHide={() => setAddModalShow(false)}
                />
              </>
              ) : (
                <>
                <div>
                  <Container>
                  <Container>
                      <Row>
                        <Col xs="3"><b>User Name: </b> {context.user.userName} <p> </p></Col>
                      </Row>
                    </Container>
                    <Container>
                      <Row className="align-items-center">
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Name</b>
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Last Name</b>
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Upload Time</b>
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Update Time</b>
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Description</b>
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Title</b>
                        </Col>
                        <Col></Col>
                        <Col></Col>
                        <Col>
                          <Button
                            variant="dark"
                            block
                            size="lg"
                            onClick={() => setAddModalShow(true)}
                          >
                            Upload
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                    {files.map((file) => (
                      <Container style={{ paddingTop: 10 }}>
                        <Row>
                          <Col>
                            <p key={file.firstName}>{file.firstName}</p>
                          </Col>
                          <Col>
                            <p key={file.lastName}>{file.lastName}</p>
                          </Col>
                          <Col>
                            <p key={file.uploadTime}>{file.uploadTime}</p>
                          </Col>
                          <Col>
                            <p key={file.updatedTime}>{file.updatedTime}</p>
                          </Col>
                          <Col>
                            <p key={file.description}>{file.description}</p>
                          </Col>
                          <Col>
                            <p key={file.title}>{file.title}</p>
                          </Col>
                          <Col>
                            <Button
                              variant="success"
                              block
                              size="sm"
                              onClick={() => downloadFile(file.id)}
                            >
                              Download
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              block
                              size="sm"
                              onClick={() => openUpdateFileModal(file)}
                            >
                              Update
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              variant="danger"
                              block
                              size="sm"
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

                <UpdateFileModal
                  show={updateModalShow}
                  file={selectedFile}
                  onUploaded={() => fetchFiles()}
                  onHide={() => setUpdateModalShow(false)}
                />

                <AddFileModal
                  show={addModalShow}
                  onUploaded={() => fetchFiles()}
                  onHide={() => setAddModalShow(false)}
                />
              </>
              )
          ) : (
            history.push("/login")
          )
        }
      </AppContext.Consumer>
    </div>
  );
}