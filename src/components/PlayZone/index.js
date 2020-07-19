import React from "react";
import styled from "styled-components";
import Card from "../Card";

const Container = styled.div`
  overflow-x: auto;
  display: flex;
`;

const CardSizeWrapper = styled.div`
  flex: 1;
  flex: 0 0 70px;
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

export const PlayZone = ({ deck }) => (
  <>
    <Title>Deck</Title>
    <Divider />
    <Container>
      {deck.cards &&
        deck.cards.map((card) => (
          <CardSizeWrapper>
            <Card
              value={card.value}
              key={card.id}
              id={card.id}
              up={true}
              color={card.color}
              icon={card.icon}
              fixed={true}
              editing={false}
              onClickRemove={() => {}}
              onClick={() => {
                alert("clicked");
              }}
              size="xs"
            />
          </CardSizeWrapper>
        ))}
    </Container>
  </>
);
