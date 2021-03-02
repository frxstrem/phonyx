import { Container, Navbar } from "react-bootstrap";
import { Switch, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to={"/"}>
          Phonyx
        </Navbar.Brand>
      </Navbar>

      <Container>
        <Switch>
          <Route exact path="/">
            <div>Home</div>
          </Route>

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
