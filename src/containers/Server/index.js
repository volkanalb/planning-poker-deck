import React, { useEffect } from "react";
import { Input, InputButton, Title } from "../../components";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4001/";

const Server = () => {
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", (data) => {
      console.log(data);
    });
  }, []);

  return (
    <>
      <Input type="text" placeholder="Nome" />
      <Title>Conectar-se a uma sala</Title>
      <InputButton placeholder="Id da sala" type="text">
        Conectar
      </InputButton>
    </>
  );
};

export default Server;
