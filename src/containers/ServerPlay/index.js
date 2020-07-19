import React from "react";
import { PlayerList, PlayZone, Board } from "../../components";
import styled from "styled-components";
import Seed from "../../resources/seed.json";
import useOnlineGame from "../../hooks/useOnlineGame";
import Collection from "../../helpers/Collection";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 100px);
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Body = styled.div`
  flex: 1;
`;

const Footer = styled.div``;

const PLAYER_STATUS = {
  OFFLINE: "offline",
  PLAYED: "played",
  PLAYING: "playing",
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const ServerPlay = () => {
  const { game } = useOnlineGame(
    Seed.decks[1],
    "test-room",
    Collection.find("test-room")
      ? Collection.find("test-room")
      : {
          name: makeid(5),
          status: PLAYER_STATUS.PLAYED,
        }
  );

  return (
    <Container>
      <Header>
        <PlayerList players={game.players} />
      </Header>
      <Body>
        <Board cards={game.board.playedCards} />
      </Body>
      <Footer>
        <PlayZone deck={game.deck} />
      </Footer>
    </Container>
  );
};

export default ServerPlay;
