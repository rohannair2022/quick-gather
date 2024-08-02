import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

const Blogs = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [serverResponse, setServerResponse] = useState("");
  const [show, setShow] = useState(false);
  const [numdates, setNumdates] = useState(1);
  const [dates, setDates] = useState([dayjs()]);
  const [hours, setHours] = useState([
    dayjs().set("hour", 10).set("minute", 0),
  ]);

  const handleDateChange = (index, newValue) => {
    const newDates = [...dates];
    newDates[index] = newValue;
    setDates(newDates);
    console.log(newDates);
  };

  const handleHoursChange = (index, newValue) => {
    const newHours = [...hours];
    newHours[index] = newValue;
    setHours(newHours);
  };

  const addDate = () => {
    setNumdates(numdates + 1);
    setDates([...dates, dayjs()]);
    setHours([...hours, dayjs().set("hour", 10).set("minute", 0)]);
  };

  const submitForm = (data) => {
    //console.log(data);
    // Works fine the data is coming through the form
    const username = JSON.parse(localStorage.getItem("username"));

    const body = {
      title: data.title,
      description: data.description,
      username: username.name,
      mood: data.mood,
      travel: data.travel,
      budget: data.budget,
    };

    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
    console.log(token);

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch("/blog/blogs", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Blog Created") {
          setServerResponse(data.message);
          setShow(true);
          reset();
        }
      });
  };

  const [isHoveredGroup, setIsHoveredGroup] = useState(false);

  return (
    <Container fluid className="py-3 py-md-5 mt-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={6} className="text-center mt-5 mb-4 mb-lg-0">
          <img
            src={process.env.PUBLIC_URL + "/short_logo.png"}
            alt="Short Logo"
            className="img-fluid"
          />
        </Col>
        <Col xs={12} lg={6} className="blog px-5">
          <div className="blogs">
            <h1>Create Group</h1>
            <form>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Group Title"
                  {...register("title", { required: true })}
                />
              </Form.Group>
              <br></br>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Group Description"
                  {...register("description", { required: true })}
                />
              </Form.Group>
              <br></br>
              <Form.Group>
                <Form.Label>Mood</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  placeholder="Select a Mood"
                  {...register("mood", { required: true })}
                >
                  <option>Select a Mood</option>
                  <option value="1">Chill</option>
                  <option value="2">Energetic</option>
                  <option value="3">Traditional</option>
                  <option value="4">Anything</option>
                </Form.Select>
              </Form.Group>
              <br></br>
              <Form.Group>
                <Form.Label>Budget</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  placeholder="Select a Budget"
                  {...register("budget", { required: true })}
                >
                  <option>Select a Budget</option>
                  <option value="1">{`<50`}</option>
                  <option value="2">{`50 - 500`}</option>
                  <option value="3">{`500 - 2500`}</option>
                  <option value="4">No Budget</option>
                </Form.Select>
              </Form.Group>
              <br></br>
              <Form.Group>
                <Form.Label>Travel</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  placeholder="Select a Travel choice"
                  {...register("travel", { required: true })}
                >
                  <option>Select a Travel choice</option>
                  <option value="1">Close By</option>
                  <option value="2">Anywhere in the City</option>
                  <option value="3">Outside the city within the country</option>
                  <option value="4">Outside the country</option>
                </Form.Select>
              </Form.Group>
              <br></br>
              <Form.Group>
                <Form.Label>Date:</Form.Label>
                <Form.Floating>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="de"
                  >
                    {[...Array(numdates)].map((_, index) => (
                      <div key={index}>
                        <DateTimePicker
                          label="Pick a Date"
                          value={dates[index]}
                          onChange={(newValue) =>
                            handleDateChange(index, newValue)
                          }
                        />
                        <TimePicker
                          views={["hours", "minutes"]}
                          format="HH:mm"
                          value={hours[index]}
                          onChange={(newValue) =>
                            handleHoursChange(index, newValue)
                          }
                        />
                      </div>
                    ))}
                    <Button className="btn btn-outline-light" onClick={addDate}>
                      One more Date
                    </Button>
                  </LocalizationProvider>
                </Form.Floating>
              </Form.Group>
              <br></br>
              <Alert
                show={show}
                variant="success"
                onClose={() => setShow(false)}
                dismissible
              >
                <Alert.Heading>Blog Message</Alert.Heading>
                <p>{serverResponse}</p>
              </Alert>
              <Form.Group>
                <Button
                  as="sub"
                  variant="primary"
                  onClick={handleSubmit(submitForm)}
                  className="w-100 mb-3"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    color: "white",
                    backgroundColor: "#a3b899",
                    border: "none",
                    borderRadius: "5px",
                    boxShadow: "5px 3px 0 #333",
                    transition: "all 0.1s",
                    cursor: "pointer",
                    transform: isHoveredGroup ? "translateY(5px)" : "none",
                  }}
                  onMouseEnter={() => setIsHoveredGroup(true)}
                  onMouseLeave={() => setIsHoveredGroup(false)}
                >
                  Create Group
                </Button>
              </Form.Group>
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Blogs;
