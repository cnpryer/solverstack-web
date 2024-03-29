import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Logo from "../images/Logo";


const CustomNav = () => {

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/"><Logo height="30px"/> solverstack</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <NavDropdown title="More" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/discover">Discover</NavDropdown.Item>
                </NavDropdown>
                </Nav>
                <Form inline>
                <FormControl type="text" placeholder="Coming soon..." className="mr-sm-2" />
                <Button variant="outline-success" disabled>Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default CustomNav;
