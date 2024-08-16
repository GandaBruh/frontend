import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import Swal from "sweetalert2"

const Login = () => {
	
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const router = useRouter()

	const login = async (e: FormEvent) => {
		e.preventDefault()
        try{
            const response = await fetch(`${process.env.BACKEND_URL}/authentication/login`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })

            if(response.ok){
								const data = await response.json()
								localStorage.setItem('accessToken', data.accessToken);
                Swal.fire({
                    title: "Login",
                    text: "Login success",
                    icon: "success"
                  }).then((result) => {
                    if (result.isConfirmed) {
                        router.push("/")
                      }
                  });
            }else{
                const errorData = await response.json();
                Swal.fire({
                    title: "Error",
                    text: `${errorData.message}`,
                    icon: "error"
                  });
            }
        }catch (e){
            Swal.fire({
                title: "Error",
                text: `Something went wrong`,
                icon: "error"
              });
        }
	}
	return (
	<>
		<Container className="login-container">
			<div className="login-box">
				<h2>Login</h2>
				<Form onSubmit={login}>
					<Form.Group className="mb3">
						<Form.Control value={username || ""} onChange={(e) => {setUsername(e.target.value)}} type="text" placeholder="Enter username" />
					</Form.Group>
					<Form.Group className="mb3">
						<Form.Control value={password || ""} onChange={(e) => {setPassword(e.target.value)}} type="password" placeholder="Enter password" />
					</Form.Group>
					<div className="d-grid">
						<Button variant="dark" type="submit" className="login-button">Login</Button>
					</div>
				</Form>
				<p>
						Don't have an account? <Link href="/register" >Register</Link>
				</p>
			</div>
		</Container>

		
	</>)
}

export default Login