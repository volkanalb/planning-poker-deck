import { useEffect, useReducer, useState } from "react";
import socketIOClient from "socket.io-client";
import Collection from "../helpers/Collection";

const ENDPOINT = "http://localhost:4001/";

const ACTIONS = {
  JOIN_USER: "JOIN_USER",
  LEAVE_USER: "LEAVE_USER",
  UPDATE_GLOBAL_STATE: "UPDATE_GLOBAL_STATE",
  CALL_UPDATE_GLOBAL_STATE: "CALL_UPDATE_GLOBAL_STATE",
  CALL_JOIN_USER: "CALL_JOIN_USER",
  CALL_PLAY_CARD: "CALL_PLAY_CARD",
  CALL_REVEAL_CARDS: "CALL_REVEAL_CARDS",
  CALL_NEXT_ROUND: "CALL_NEXT_ROUND",
};

const init = {
  player: {},
  players: [],
  deck: {},
  board: {
    visible: false,
    playedCards: [],
  },
};

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.JOIN_USER: {
      return {
        ...state,
        players: [...state.players, action.payload],
        player:
          Object.keys(state.player).length === 0
            ? action.payload
            : state.player,
      };
    }
    case ACTIONS.LEAVE_USER: {
      return {
        ...state,
        players: state.players.filter(
          (player) => player.id !== action.payload.id
        ),
      };
    }
    case ACTIONS.UPDATE_GLOBAL_STATE: {
      return { ...state, players: [...action.payload.players] };
    }
    case ACTIONS.CALL_NEXT_ROUND: {
      return { ...state, board: { playedCards: [], visible: false } };
    }
    case ACTIONS.CALL_REVEAL_CARDS: {
      return { ...state, board: { ...state.board, visible: true } };
    }
    case ACTIONS.CALL_PLAY_CARD: {
      return {
        ...state,
        board: {
          ...state.board,
          playedCards: [...state.board.playedCards, action.payload],
        },
      };
    }
  }
}

export default function useOnlineGame(deck, room, player) {
  const [socket] = useState(socketIOClient(ENDPOINT));
  const [game, dispatch] = useReducer(reducer, { ...init, deck: deck });

  useEffect(() => {
    socket.on(["JOIN_USER"], (action) => {
      dispatch(action);
    });

    socket.on("LEAVE_USER", (action) => {
      dispatch(action);
    });

    socket.on("UPDATE_GLOBAL_STATE", (action) => {
      dispatch(action);
    });

    socket.emit("CALL_JOIN_USER", { id: room, payload: player });
  }, []);

  useEffect(() => {
    if (game.player.owner) {
      socket.emit("CALL_UPDATE_GLOBAL_STATE", { id: room, state: game });
    }
  }, [game.players, game.board]);

  useEffect(() => {
    Collection.put(room, game.player);
  }, [game.player]);

  console.log(game);

  return { game };
}
