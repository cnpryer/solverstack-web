import React, { useState } from "react";
import Papa from "papaparse";

// Bootstrap
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import CustomMarker from "../google-maps/CustomMarker";
import GoogleMaps from "../google-maps/GoogleMaps";
import Button from "react-bootstrap/Button";


const assert = require('assert');

function checkCsvData(csvData) {
    assert(csvData); // TODO
}

function checkNum(val) {
    assert(Number(val));
}

function checkUnit(unit, data) {
    assert(data[0].hasOwnProperty(unit));
}

const FormSetup = () => {
    // TODO: const?
    const [fileName, setFileName] = useState("demand file");
    
    const onFileSubmit = event => {
        setFileName(event.target.value.split("\\").splice(-1)[0]);
    };

    // handle api integration
    const onCreateSubmit = event => {
        event.preventDefault();

        // TODO: figure out how to properly ref
        const originLat = event.target[0].value;
        const originLon = event.target[1].value;
        const vehicleCap = event.target[2].value;
        const unit = event.target[3].value;
        const demandData = event.target[10].files[0]

        checkNum(originLat);
        checkNum(originLon);
        checkNum(vehicleCap);

        console.log("origin lat", originLat);
        console.log("origin lon", originLon);
        console.log("vehicle cap", vehicleCap);
        console.log("unit", unit);
        
        Papa.parse(demandData, {
            header: true,
            complete: function(results) {
                checkCsvData(results);
                checkUnit(unit, results.data);

                console.log("demand data", results);
            }
        });
    };

    return (
        <Card>
            <Card.Body>
                <Form onSubmit={onCreateSubmit}>
                    <Row className="mb-4">
                        <Col lg="6">
                            <Row className="d-flex flex-column">
                                <Col className="pb-3">
                                    <div>Origin</div>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            <FormControl id="origin-lat" className="d-inline-flex" placeholder="lat." aria-label="Lat." />
                                        </Col>
                                        <Col>
                                            <FormControl id="origin-lon" className="d-inline-flex" placeholder="lon." aria-label="Lon." />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="6">
                            <Row className="d-flex flex-column">
                                <Col className="pb-3">
                                    <div>Vehicle</div>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            <FormControl id="max-vehicle-cap" className="d-inline-flex" placeholder="capacity" aria-label="capacity" />
                                        </Col>
                                        <Col>
                                            <FormControl id="unit" className="d-inline-flex" placeholder="unit" aria-label="unit" />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col className="p-0">
                            <GoogleMaps />
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-end">
                        <Col lg="8">
                            <Form.File id="custom-file" label={fileName} custom onChange={onFileSubmit} />
                        </Col>
                        <Col lg="auto">
                            <Button type="submit">Create</Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default FormSetup;
