import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleRoomIdChange = (e) => {
        setRoomId(e.target.value);
    }

    const handleJoinChat = () => {
        navigate(`/chat?name=${name}&roomId=${roomId}`);
    }

    return (
        <div>
            <input type = "text" value = {name} onChange={handleNameChange} placeholder='Enter your name' />
            <input type = "text" value = {roomId} onChange={handleRoomIdChange} placeholder='Enter room id' />
            <button onClick={handleJoinChat}>Click me</button>
        </div>
    )
}

export default Home;