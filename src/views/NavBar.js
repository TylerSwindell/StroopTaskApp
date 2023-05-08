import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import PathList from "../config/Paths";
import { useAuth } from "../contexts/auth-context/AuthContext";

function NavBar(props) {
  const auth = useAuth();
  const { width } = props.style || "";
  return (
    <Navbar className="form-control" bg="light" expand="lg">
      <Container style={{ width }}>
        <Navbar.Brand href={PathList.home}>Stroop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {auth.loginCheck() ? (
              <Nav.Link href={PathList.home}>Dashboard</Nav.Link>
            ) : (
              <Nav.Link href={PathList.login}>Login</Nav.Link>
            )}
            {auth.loginCheck() ? (
              <NavDropdown title="Admin" id="basic-nav-dropdown">
                <NavDropdown.Item href={PathList.blackboard}>
                  Begin Stroop
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href={PathList.settings}>
                  Settings
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <></>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
