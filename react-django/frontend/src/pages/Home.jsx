import { useState, useEffect } from "react"; // import useState and useEffect hooks from react
import api from "../api";
import Note from "../components/Note"
import "../styles/Home.css"

function Home() {
    const [notes, setNotes] = useState([]); // create an empty array 'notes' and a function 'setNotes' to update the array
    const [content, setContent] = useState(""); // create an empty string 'content' and a function 'setContent' to update the string
    const [title, setTitle] = useState(""); // create an empty string 'title' and a function 'setTitle' to update the string

    useEffect(() => {
        getNotes();
    }, []); // call 'getNotes' function when the component is mounted (empty array means the function is called as soon as component is mounted and only once)

    // create a function 'getNotes' to get all notes from the server, from api, 
    const getNotes = () => {
        api
            .get("/api/notes/") // send a GET request to '/api/notes/'
            .then((res) => res.data) // get the response data
            .then((data) => {
                setNotes(data); // update 'notes' to received data
                console.log(data); // log it to the console
            })
            .catch((err) => alert(err)); // if there is an error, give an alert message of it
    };

    // create a function 'deleteNote' which takes 'id' as argument
    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`) // send a DELETE request to '/api/notes/delete/{id}/'
            .then((res) => {
                if (res.status === 204) alert("Note deleted!"); // if the response status is 204, it means note is deleted successfully, give an alert messag
                else alert("Failed to delete note."); // if an error occurs, give an alert message of it
                getNotes(); // call 'getNotes' function to update the notes
            })
            .catch((error) => alert(error)); // if there is an error, give an alert message of it
    };

    // create a function 'createNote' which takes event object 'e' as argument
    const createNote = (e) => {
        e.preventDefault(); // prevent the default behavior of the form
        
        api
            .post("/api/notes/", { content, title }) // send a POST request to '/api/notes/' with 'content' and 'title' as data
            .then((res) => {
                if (res.status === 201) alert("Note created!"); // if the response status is 201, it means note is created successfully, give an alert message
                else alert("Failed to make note."); // if an error occurs, give an alert message of it
                getNotes(); // call 'getNotes' function to update the notes
            })
            .catch((err) => alert(err)); // if there is an error, give an alert message of it
    };

    return (
        <div>
            <div>
                <h2>Notes</h2>
                {/* for each item in 'notes' array, render 'Note' component for it, 'deleteNote' function to delete it if user wants to, 'note.id' as it's unique identifier */}
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
            </div>
            <h2>Create a Note</h2>
            <form onSubmit={createNote}> {/* on form submission, call 'createNote' function */}
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required // this field is required to be given a value
                    onChange={(e) => setTitle(e.target.value)} // when the value of the input field changes, call 'setTitle' function to update value of 'title'
                    value={title}
                />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required // this field is required to be given a value
                    value={content}
                    onChange={(e) => setContent(e.target.value)} // when the value of the input field changes, call 'setContent' function to update value of 'content'
                ></textarea>
                <br />
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    );
}

export default Home;