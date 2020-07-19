import React, { useEffect } from "react";
import { Input, InputButton, Title } from "../../components";

const Server = () => {
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
