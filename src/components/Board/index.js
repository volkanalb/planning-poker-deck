import React from "react";
import styled from "styled-components";
import Card from "../Card";

const Container = styled.div`
  margin-top: 10px;
`;

const Title = styled.p`
  font-size: 10px;
  text-transform: uppercase;
  font-weight: bold;
  color: #9e9e9e;
  margin-bottom: 5px;
`;

const Divider = styled.hr`
  margin-bottom: 15px;
  height: 1px;
  background-color: #e3e3e3;
  border: none;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CardWrapper = styled.div`
  flex: 1;
  flex: 0 0 70px;
`;

export const Board = ({ cards }) => {
  const [isUp, setIsUp] = React.useState(false);

  setTimeout(() => {
    setIsUp(true);
  }, 3000);

  return (
    <Container>
      <Title>Board</Title>
      <Divider />
      <CardsContainer>
        {cards.map((card) => (
          <CardWrapper>
            <Card
              value={card.value}
              key={card.id}
              id={card.id}
              up={isUp}
              color={card.color}
              icon={card.icon}
              fixed={true}
              editing={false}
              onClickRemove={() => {}}
              onClick={() => {}}
              size="xs"
            />
          </CardWrapper>
        ))}
      </CardsContainer>
    </Container>
  );
};
