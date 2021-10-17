import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Home.css";
import { useHistory } from "react-router-dom";
import { AppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
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

  const user = React.useContext(AppContext);

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

    console.log(user);

    if (file.current && file.current.size > MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${MAX_ATTACHMENT_SIZE / 1000000} MB.`
      );
      return;
    } else if (file.current) {
      var formData = new FormData();
      formData.append("file", file.current);
      formData.append("username", user.username);
      formData.append("title", fields.title);
      formData.append("description", fields.description);

      axios
        .post(`http://3.137.182.39:8080/file`, formData, {
          headers: {
            Authorization: "Bearer " + user.userToken,
          },
        })
        .then((res) => {
          console.log(res);
        });
    } else {
      alert("Please select a file to upload.");
    }
  }

  React.useEffect(() => {
    if (user !== null && user.userToken !== "") {
      axios.interceptors.request.use((request) => {
        console.log("Starting Request", JSON.stringify(request, null, 2));
        return request;
      });

      axios.interceptors.response.use((response) => {
        console.log("Response:", JSON.stringify(response, null, 2));
        return response;
      });
      fetchFiles();
    }
  }, [user]);

  const fetchFiles = async () => {
    const { data } = await axios.get("http://3.137.182.39:8080/file", {
      headers: {
        Authorization: "Bearer " + user.userToken,
      },
    });
    console.log(data);
    setFiles(data);
  };

  return (
    <div className="Home">
      <AppContext.Consumer>
        {(context) =>
          context.user.userToken !== "" ? (
            <>
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
              <div>
                {files.map((file) => (
                  <p key={file.title}>{file.title}</p>
                ))}
              </div>
            </>
          ) : (
            history.push("/login")
          )
        }
      </AppContext.Consumer>
    </div>
  );
}
