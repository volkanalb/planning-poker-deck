import React from "react";
import styled from "styled-components";
import { Input } from "../Input";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
`;

const Button = styled.button`
  padding: 10px;
  border: 1px solid #ccc;
  border-left: 0px;
  width: 100%;
  font-size: 12px;
  background-color: #ffffff;
  color: #616161;
  cursor: pointer;

  :hover {
    background-color: #f3f3f3;
  }
`;

export const InputButton = ({
  placeholder,
  value,
  onClick,
  onChange,
  children,
  type,
  name,
}) => {
  return (
    <Wrapper>
      <div>
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
        />
      </div>
      <div>
        <Button onClick={onClick}>{children}</Button>
      </div>
    </Wrapper>
  );
};
