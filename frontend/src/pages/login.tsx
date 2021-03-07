import { Button, Container, Form, Card, Alert} from "react-bootstrap";
import { useState } from 'react';
import { useAuth } from '../auth';

export const Login = () => {
    const auth = useAuth(); // Authentication backend
    const [username, setUsername] = useState(""); // save username when entered
    const [pass, setPass] = useState(""); //save password when input to field
    const [error, setError] = useState(null); //Show errors if login fails
    const [inactive, setInactive] = useState(false); //Disable login button while logging in

    // When "login" is pressed, try to log in.
    const handleLogin = async () => {
        if(auth.user == null) {
            try {
                setInactive(true);
                await auth.logIn(username, pass).then(() => setInactive(false));
            }
            catch(e) {
                setError(e.message);
                setInactive(false);
            }
        }
    }
    
    // Save username to variable when updated
    const handleUsernameInput = (e: any) => {setUsername(e.target.value)};
    // Save password to variable when updated
    const handlePassInput = (e: any) => {setPass(e.target.value)};


    return (
        <Container style={{maxWidth: '350px'}}> {/* Custom CSS to avoid too wide login box */}
            <Card>
                <Card.Header style={{ marginBottom: '20px' }}><strong>Enter your credentials</strong></Card.Header> 
                <Form style={{ paddingLeft: '20px', paddingRight: '20px' }}> {/* Used to space form from edges */}
                    <Form.Group>
                        {error !== null && <Alert variant="warning">{error}</Alert>}
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" onInput={handleUsernameInput} value={username} placeholder="Enter your username" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" onInput={handlePassInput} placeholder="Password" />
                    </Form.Group >
                    <Form.Group id="loginButton" className="text-center">
                        <Button disabled={inactive} variant="primary" onClick={handleLogin}>Log in</Button>
                    </Form.Group>
                </Form>
            </Card>
        </Container>            
    )
};