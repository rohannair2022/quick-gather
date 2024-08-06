import { Form, Button, Alert, Container, Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

function JoinGroup() {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [serverResponse, setServerResponse] = useState("");
  const [response, setResponse] = useState("");
  const [show, setShow] = useState(false);
  const [numdates, setNumdates] = useState(1);
  const [dates, setDates] = useState([dayjs()]);
  const [datesDisplay, setDatesDisplay] = useState([dayjs().format()]);
  const [hours, setHours] = useState([dayjs().set("hour", 1).set("minute", 0)]);
  const [hoursDisplay, setHoursDisplay] = useState([
    dayjs().set("hour", 1).set("minute", 0).format("HH:mm"),
  ]);

  const handleDateChange = (index, newValue) => {
    const newDates = [...dates];
    const newDisplayDates = [...datesDisplay];
    newDates[index] = newValue;
    newDisplayDates[index] = newValue.format();
    setDates(newDates);
    setDatesDisplay(newDisplayDates);
  };

  const handleHoursChange = (index, newValue) => {
    const newHours = [...hours];
    const newDisplayHours = [...hoursDisplay];
    newHours[index] = newValue;
    newDisplayHours[index] = newValue.format("HH:mm");
    setHours(newHours);
    setHoursDisplay(newDisplayHours);
    console.log(newDisplayHours, newHours);
  };

  const addDate = () => {
    setNumdates(numdates + 1);
    setDates([...dates, dayjs()]);
    setHours([...hours, dayjs().set("hour", 10).set("minute", 0)]);
    setDatesDisplay([...datesDisplay, dayjs().format()]);
    setHours([
      ...hoursDisplay,
      dayjs().set("hour", 10).set("minute", 0).format("HH:mm"),
    ]);
  };

  const deleteDate = () => {
    if (dates.length > 1) {
      setNumdates(numdates - 1);
      setDates((prevDates) => prevDates.slice(0, -1));
      setHours((prevHours) => prevHours.slice(0, -1));
      setDatesDisplay((prevDatesDisplay) => prevDatesDisplay.slice(0, -1));
      setHoursDisplay((prevHoursDisplay) => prevHoursDisplay.slice(0, -1));
    }
  };

  const deleteDateComplete = () => {
    setNumdates(0);
    setDates((prevDates) => []);
    setHours((prevHours) => []);
    setDatesDisplay((prevDatesDisplay) => []);
    setHoursDisplay((prevHoursDisplay) => []);
  };

  const submitForm = (data) => {
    const username = JSON.parse(localStorage.getItem("username"));

    const body = {
      id: parseInt(data.id),
      title: data.title,
      description: data.description,
      username: username.name,
      mood: data.mood,
      travel: data.travel,
      budget: data.budget,
      dates: datesDisplay,
      hours: hoursDisplay,
    };

    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
    console.log(token);

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch(`/blog/join/${parseInt(data.id)}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Success") {
          setServerResponse(data.message);
          setShow(true);
          setResponse(data.response);
          reset();
        } else {
          setServerResponse(data.message);
          setShow(true);
          setResponse(data.response);
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
          <div className="signup">
            <h1 className="title mb-3">Join a Group</h1>
            <Form>
              <Form.Group className="mb-3" controlId="formHorizontalEmail">
                <Form.Label>Id</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Group id"
                  {...register("id", { required: true })}
                />
              </Form.Group>
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
                  placeholder="Select a Mood"
                  {...register("budget", { required: true })}
                >
                  <option>Select a Mood</option>
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
                  placeholder="Select a Mood"
                  {...register("travel", { required: true })}
                >
                  <option>Select a Mood</option>
                  <option value="1">Close By</option>
                  <option value="2">Anywhere in the City</option>
                  <option value="3">Outside the city within the country</option>
                  <option value="4">Outside the country</option>
                </Form.Select>
              </Form.Group>
              <br></br>
              <Form.Group>
                <Form.Label>Your Preffered Date and time:</Form.Label>
                <div class="container-fluid mb-3 mt-1">
                  <div class="row d-flex justify-content-start">
                    <div class="col-auto pe-0">
                      <Button
                        className="btn btn-outline-light mb-3 me-2"
                        onClick={addDate}
                      >
                        Add one more Date
                      </Button>
                    </div>
                    <div class="col-auto pe-0">
                      <Button
                        className="btn btn-outline-light mb-3 me-2"
                        onClick={deleteDate}
                      >
                        Delete a Date
                      </Button>
                    </div>
                    <div class="col-auto">
                      <Button
                        className="btn btn-outline-light mb-3"
                        onClick={deleteDateComplete}
                      >
                        No preference
                      </Button>
                    </div>
                  </div>
                </div>
                <div class="container-fluid mb-3 mt-1">
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="de"
                  >
                    {[...Array(numdates)].map((_, index) => (
                      <div
                        class="row d-flex justify-content-start gx-2"
                        key={index}
                      >
                        <div class="col-auto pe-2 mb-3">
                          <DateTimePicker
                            label="Pick a Date"
                            value={dayjs(dates[index])}
                            onChange={(newValue) => {
                              handleDateChange(index, newValue);
                            }}
                          />
                        </div>
                        <div class="col-auto mb-3">
                          <TimePicker
                            label="Pick Duration (In hours)"
                            views={["hours", "minutes"]}
                            format="HH:mm"
                            value={dayjs(hours[index])}
                            onChange={(newValue) => {
                              handleHoursChange(index, newValue);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </LocalizationProvider>
                </div>
              </Form.Group>
              <br></br>
              <Alert
                show={show}
                variant={response}
                onClose={() => setShow(false)}
                dismissible
              >
                <Alert.Heading>Join Blog Message</Alert.Heading>
                <p>{serverResponse}</p>
              </Alert>
              <Form.Group className="mb-3">
                <Button
                  type="submit"
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
                  Join Group
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default JoinGroup;
