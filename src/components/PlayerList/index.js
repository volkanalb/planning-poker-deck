import React from "react";
import styled from "styled-components";

const STATUS_COLOR = {
  offline: "white",
  played: "#66bb6a",
  playing: "#FFD54F",
};

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

const PlayerListContainer = styled.div`
  overflow-x: auto;
  display: flex;
  margin-top: 10px;
`;

const PlayerIcon = styled.div`
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
  border: 1px solid #e3e3e3;
  align-items: center;
  display: flex;
`;

const Icon = styled.div`
  text-align: center;
  width: 100%;
  font-weight: bold;
  text-transform: uppercase;
  color: #616161;
  font-size: 10px;
`;

const PlayersName = styled.p`
  margin-top: 5px;
  font-size: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 50px;
  white-space: nowrap;
  text-align: center;
  color: #616161;
`;

const Player = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-transform: lowercase;
  position: relative;
  margin-right: 10px;
`;

const Status = styled.div`
  position: absolute;
  width: 8px;
  z-index: 1;
  height: 8px;
  right: 9px;
  top: 0px;
  background-color: ${({ status }) => STATUS_COLOR[status]};
  border-radius: 50%;
  border: 1px solid #e3e3e3;
`;

export const PlayerList = ({ players }) => (
  <>
    <Title>Jogadores</Title>
    <Divider />
    <PlayerListContainer>
      {players.map((player) => (
        <Player>
          <Status status={player.status} />
          <PlayerIcon>
            <Icon>{player.name.charAt(0)}</Icon>
          </PlayerIcon>
          <PlayersName>{player.name}</PlayersName>
        </Player>
      ))}
    </PlayerListContainer>
  </>
);
