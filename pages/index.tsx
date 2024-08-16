import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { FormEvent, useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const [postsData, setPostsData] = useState([]);
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [titleUpdate, setTitleUpdate] = useState("")
  const [contentUpdate, setContentUpdate] = useState("")
  const router = useRouter()


  const fetchData = async () => {
    try{
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.BACKEND_URL}/post/get`,
        {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
        })
      if(response.ok){
        const data = await response.json()
        console.log(data)
        setPostsData(data)
      }
    }catch{

    }
  }

  const createPost = async (e: FormEvent) => {
    e.preventDefault()
    try{
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.BACKEND_URL}/post/create`,
        {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              title: title,
              content: content
          })
        })
      if(response.ok){
          Swal.fire({
              title: "Success",
              text: "Create Post Success",
              icon: "success"
            }).then((result) => {
              fetchData()
            });
      }else{
          const errorData = await response.json();
          Swal.fire({
              title: "Error",
              text: `${errorData.message}`,
              icon: "error"
            });
      }
    }catch{

    }
  }

  const updatePost = async (e: FormEvent) => {
    e.preventDefault()
    try{
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.BACKEND_URL}/post/update/${updateId}`,
        {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              title: titleUpdate,
              content: contentUpdate
          })
        })
      if(response.ok){
          Swal.fire({
              title: "Success",
              text: "Update Post Success",
              icon: "success"
            }).then((result) => {
              setTitleUpdate("")
              setContentUpdate("")
              setUpdateId("")
              fetchData()
            });
      }else{
          const errorData = await response.json();
          Swal.fire({
              title: "Error",
              text: `${errorData.message}`,
              icon: "error"
            });
      }
    }catch{

    }
  }

  const deletePost = async (id: string) => {
    
    try{

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem('accessToken');
          const response = await fetch(`${process.env.BACKEND_URL}/post/delete/${id}`,
            {
                method: 'DELETE',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
            })
          if(response.ok){
              Swal.fire({
                  title: "Success",
                  text: "Delete Post Success",
                  icon: "success"
                }).then((result) => {
                  fetchData()
                });
          }else{
              const errorData = await response.json();
              Swal.fire({
                  title: "Error",
                  text: `${errorData.message}`,
                  icon: "error"
                });
          }
        }
      });

      
    }catch{

    }
  }

  const updateUser = async (e: FormEvent) => {
    e.preventDefault()
    try{
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.BACKEND_URL}/user/update`,
        {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              name: name,
              password: (user as unknown as any)?.password
          })
        })
      if(response.ok){
          Swal.fire({
              title: "Success",
              text: "Update Display Name Success",
              icon: "success"
            }).then((result) => {
              fetchData()
            });
      }else{
          const errorData = await response.json();
          Swal.fire({
              title: "Error",
              text: `${errorData.message}`,
              icon: "error"
            });
      }
    }catch{

    }
  }

  const [user, setUser] = useState({id:0});
  const [updateId, setUpdateId] = useState("")
  const [name, setName] = useState("")

  const fetchUserData = async () => {
    try{
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.BACKEND_URL}/user/get`,
        {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
        })
      if(response.ok){
        const data = await response.json()
        console.log(data)
        setUser(data)
      }
    }catch{

    }
  }

  useEffect(() => {
    fetchData()
    fetchUserData()
  }, [])

  return (
   <>
    <div className="d-flex m-3">
      <Button variant="primary"onClick={() => {localStorage.removeItem('accessToken'); router.push("/login")}} className="login-button m-3">Logout</Button>
      <Form className="d-flex p-3" onSubmit={updateUser}>
        <Form.Control value={name || ""} onChange={(e) => {setName(e.target.value)}} type="text" placeholder="Enter name" />
        <Button variant="dark" type="submit" className="ms-3">Change Display Name</Button>
      </Form>
      
    </div>
    <h1 className="m-2">Post</h1>
    <Form className="p-3" onSubmit={createPost}>
      <Form.Group className="mb-3">
        <Form.Control value={title || ""} onChange={(e) => {setTitle(e.target.value)}} type="text" placeholder="Enter title" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control as="textarea" value={content || ""} onChange={(e) => {setContent(e.target.value)}} placeholder="Enter content" />
      </Form.Group>
      <div className="">
        <Button variant="dark" type="submit" className="login-button">create</Button>
      </div>
    </Form>
    {
      postsData.map((post: any) => {
        return <Card className="m-3 p-2">
          {post?.id != updateId ? 
          <>
            <h1>{post?.title}</h1>
            <p>{post?.content}</p>
          </>:
          <>
            <Form className="p-3" onSubmit={updatePost}>
              <Form.Group className="mb-3">
                <Form.Control value={titleUpdate || ""} onChange={(e) => {setTitleUpdate(e.target.value)}} type="text" placeholder="Enter title" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control as="textarea" value={contentUpdate || ""} onChange={(e) => {setContentUpdate(e.target.value)}} placeholder="Enter content" />
              </Form.Group>
              <div className="">
                <Button variant="dark" type="submit" className="login-button m-3">Update</Button>
                <Button variant="danger" className="login-button" onClick={() => {setUpdateId("")}}>Cancel</Button>
              </div>
            </Form>
          </>
          }
          <p>created by {post?.user?.name}</p>
          {(post?.userId == user?.id) && post?.id != updateId && <div className="">
            <Button variant="danger" onClick={() => {deletePost(post?.id)}} className="login-button m-3">Delete</Button>
            <Button variant="secondary" 
              onClick={() => {
                setUpdateId(post?.id)
                setTitleUpdate(post?.title)
                setContentUpdate(post?.content)
              }} 
              className="login-button">
              Update
            </Button>
          </div>}
        </Card>
      })
    }
   </>
  );
}
