import { Container, Navbar, Nav } from "react-bootstrap";
import { Switch, Route, Link } from "react-router-dom";
import { Login } from './pages/login';

import "./App.css";

function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="sm" style={{ marginBottom: '20px' }}>
        <Navbar.Brand as={Link} to={"/"}>
          Phonyx
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link as={Link} to="/servers">My servers</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/other">Other</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <Switch>
          <Route exact path="/">
            <div>Home</div>
          </Route>
          <Route exact path="/servers" />
          <Route exact path="/login" component={Login}/>
          {/* Fallback route */}
          <Route>
            <div>404 Page Not Found</div>
          </Route>
        </Switch>
      </Container>
    </div>
  );
}

export default App;
