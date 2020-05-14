import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import update from "immutability-helper";
import "./App.css";

/** Components */
import NavRouter from "./components/NavRouter";
import { MoonAlert, MoonToastr } from "minimoon";

/** Containers */
import Play from "./containers/Play";
import Played from "./containers/Played";
import Decks from "./containers/Decks";
import Config from "./containers/Config";
import Server from "./containers/Server";

/** Contexts */
import { ThemeContext } from "./Contexts";

/** Helpers */
import I18n from "./helpers/I18n";
import seed from "./resources/seed.json";
import DeckFactory from "./helpers/DeckFactory";
import DeckCollection from "./helpers/DeckCollection";
import ConfigCollection from "./helpers/ConfigCollection";

/**
 * @author Victor Heringer
 *
 * Hold all functions and a 'global state'. Since this is a tiny application,
 * there is no need to use redux or complicate too much to handle states.
 */
class App extends Component {
  /**
   * App state
   *
   * @param {Object}
   */
  state = {
    decks: [],
    current: {},
    selectedCard: null,
    deckNameInput: "",
    text: this.props.text,
    configurations: {
      lang: this.props.lang,
      grid: this.props.grid,
      theme: this.props.theme,
    },
    toastr: {
      show: false,
      message: "",
      action: "",
    },
    confirmBox: {
      show: false,
      message: "",
      title: "",
      onConfirm: undefined,
    },
  };

  /**
   * @author Victor Heringer
   *
   * Lifecycle method to set some initial states
   *
   * @return {void}
   */
  componentWillMount() {
    this.loadDecks();
  }

  canShare = () => {
    return navigator.share ? true : false;
  };

  selectCard = (card, callback) => {
    this.setState(
      (state) => update(state, { selectedCard: { $set: card } }),
      callback
    );
  };

  /**
   * @author Victor Heringer
   *
   * Loads all texts based on given language
   *
   * @todo Change to context api
   *
   * @return {void}
   */
  loadText = (lang) => {
    this.setState((state) => update(state, { $set: { text: I18n.get(lang) } }));
  };

  /**
   * @author Victor Heringer
   *
   * Loads all decks
   *
   * @return {void}
   */
  loadDecks = (callback) => {
    const decks = DeckCollection.all();
    const favorite = DeckCollection.getFavorite();
    this.setState(
      (state) =>
        update(state, { decks: { $set: decks }, current: { $set: favorite } }),
      callback
    );
  };

  /**
   * @author Victor Heringer
   *
   * Add a deck to state and local storage
   *
   * @param {Object} deck
   *
   * @return {void}
   */
  createDeck = (event, name) => {
    event.preventDefault();

    if (!name) return;

    const deck = DeckFactory.create(name);
    DeckCollection.push(deck, true);

    const toUpdate = {
      deckNameInput: { $set: "" },
      toastr: {
        show: { $set: true },
        message: { $set: this.state.text.toastr.messages.deckAdd },
        action: { $set: this.state.text.toastr.action },
      },
    };

    const updateCallback = () => {
      this.setState(
        (state) => update(state, toUpdate),
        this.closeToastrCallback
      );
    };

    this.loadDecks(updateCallback);
  };

  /**
   * @author Victor Heringer
   *
   * Deletes a deck from state and local storage
   *
   * @param {Int} id
   *
   * @return {void}
   */
  deleteDeck = (id) => {
    const deck = DeckCollection.find(id);
    const toUpdate = DeckCollection.all().filter((deck) => deck.id !== id);

    if (toUpdate.length === 0) {
      this.showToastr(this.state.text.toastr.messages.deckCantDelete);
      return;
    }

    if (deck.favorite) {
      toUpdate[0].favorite = true;
    }

    DeckCollection.put(toUpdate);
    this.loadDecks(() =>
      this.showToastr(this.state.text.toastr.messages.deckDelete)
    );
  };

  /**
   * @author Victor Heringer
   *
   * Turns a deck to favorite. The favorite deck will be used to play.
   *
   * @param {Number} id
   *
   * @return {void}
   */
  favorite = (id) => {
    DeckCollection.setFavorite(id);
    this.loadDecks();
  };

  /**
   * @author Victor Heringer
   *
   * Handles form input change
   *
   * @param {Object} event
   *
   * @return {void}
   */
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /**
   * @author Victor Heringer
   *
   * Handles form input change
   *
   * @param {Object} event
   *
   * @return {void}
   */
  handleChangeConfiguration = (event) => {
    console.log(event.target.name);
    const toUpdate = {
      configurations: { [event.target.name]: { $set: event.target.value } },
    };
    console.log(toUpdate);
    this.setState((state) => update(state, toUpdate));
  };

  /**
   * @author Victor Heringer
   *
   * Handles language selection
   *
   * @param {Object} event
   *
   * @return {void}
   */
  handleSelectLang = (event) => {
    const config = ConfigCollection.all();
    config.lang = event.target.value;
    ConfigCollection.put(config);
    this.loadText(event.target.value);
    this.handleChangeConfiguration(event);
  };

  /**
   * @author Victor Heringer
   *
   * Handles grid size selection
   *
   * @param {Object} event
   *
   * @return {void}
   */
  handleSelectGrid = (event) => {
    const config = ConfigCollection.all();
    config.grid = event.target.value;
    ConfigCollection.put(config);
    this.handleChangeConfiguration(event);
  };

  /**
   * @author Victor Heringer
   *
   * Handles theme selection
   *
   * @param {Object} event
   *
   * @return {void}
   */
  handleSelectTheme = (event) => {
    const config = ConfigCollection.all();
    config.theme = event.target.value;
    ConfigCollection.put(config);
    this.handleChangeConfiguration(event);
  };

  /**
   * @author Victor Heringer
   *
   * Handles push card to decks
   *
   * @param {Object} event
   *
   * @return {void}
   */
  handlePushCardToCurrentDeck = (event, card) => {
    let deck = DeckCollection.getFavorite();
    deck.cards.push({ value: "Ok", icon: false });
    DeckCollection.update(deck);
    this.loadDecks();
  };

  /**
   * @author Victor Heringer
   *
   * Set the values to confirm box related to reset deck action
   *
   * @return {void}
   */
  handleConfirmBoxResetDeck = () => {
    const { text } = this.state;

    const toUpdate = {
      confirmBox: {
        show: { $set: !this.state.confirmBox.show },
        title: { $set: text.confirmBox.refresh.title },
        message: { $set: text.confirmBox.refresh.message },
        confirm: { $set: this.resetDecks },
      },
    };

    this.setState((state) => update(state, toUpdate));
  };

  /**
   * @author Victor Heringer
   *
   * Restore default values at state and local storage
   *
   * @return {void}
   */
  resetDecks = () => {
    DeckCollection.put(seed.decks);
    this.setState((state) =>
      update(state, {
        decks: { $set: seed.decks },
        confirmBox: { show: { $set: !state.confirmBox.show } },
      })
    );
  };

  /**
   * @author Victor Heringer
   *
   * Share a deck through other apps
   *
   * @return {void}
   */
  shareDeck = (id) => {
    let deck = DeckCollection.find(id);
    deck.favorite = false;
    this.canShare() && navigator.share({ text: JSON.stringify(deck) });
  };

  /**
   * @author Victor Heringer
   *
   * Closes confirm box modal
   *
   * @return {void}
   */
  cancelModal = () => {
    this.setState((state) =>
      update(state, { confirmBox: { show: { $set: false } } })
    );
  };

  /**
   * @author Victor Heringer
   *
   * Closes the toastr
   *
   * @return {void}
   */
  handleCloseToastr = () => {
    this.setState((state) =>
      update(state, {
        toastr: { show: { $set: false } },
      })
    );
  };

  /**
   * @author Victor Heringer
   *
   * Closes the toastr after a time
   *
   * @return {void}
   */
  closeToastrCallback = () => {
    setTimeout(() => {
      this.handleCloseToastr();
    }, 2000);
  };

  /**
   * @author Victor Heringer
   *
   * Shows the toastr
   *
   * @param {String} message
   *
   * @return {void}
   */
  showToastr = (message) => {
    this.setState(
      (state) =>
        update(state, {
          toastr: {
            show: { $set: true },
            message: { $set: message },
            action: { $set: this.state.text.toastr.action },
          },
        }),
      this.closeToastrCallback
    );
  };

  /**
   * @author Victor Heringer
   *
   * Renders the played card container
   */
  renderPlayed = () => (
    <Played {...this.state} card={this.state.selectedCard} />
  );

  /**
   * @author Victor Heringer
   *
   * Renders the play container
   */
  renderPlay = () => (
    <Play
      {...this.state}
      addCard={this.handlePushCardToCurrentDeck}
      loadDecks={this.loadDecks}
      gridSize={this.state.configurations.grid}
      handleSelectCard={this.selectCard}
    />
  );

  /**
   * @author Victor Heringer
   *
   * Renders the decks container
   */
  renderDecks = () => (
    <Decks
      handleConfirmBoxResetDeck={this.handleConfirmBoxResetDeck}
      createDeck={this.createDeck}
      deleteDeck={this.deleteDeck}
      handleChange={this.handleChange}
      favorite={this.favorite}
      share={this.shareDeck}
      {...this.state}
      canShare={this.canShare()}
    />
  );

  /**
   * @author Victor Heringer
   *
   * Renders the config container
   */
  renderConfig = () => (
    <Config
      grid={this.state.configurations.grid}
      text={this.state.text}
      handleSelectLang={this.handleSelectLang}
      handleSelectGrid={this.handleSelectGrid}
      handleSelectTheme={this.handleSelectTheme}
      themes={this.props.themes}
      grids={this.props.grids}
      version={this.props.version}
    />
  );

  renderServer = () => <Server />;

  render() {
    const confirmBox = (
      <MoonAlert
        title={this.state.confirmBox.title}
        message={this.state.confirmBox.message}
        show={this.state.confirmBox.show}
        onCancel={this.cancelModal}
        onConfirm={this.state.confirmBox.confirm}
        text={this.state.text}
        position="bottom"
        className="ppdAlert"
        textCancel={this.state.text.confirmBox.btn.cancel}
        textConfirm={this.state.text.confirmBox.btn.confirm}
      />
    );

    const toastr = (
      <MoonToastr
        show={this.state.toastr.show}
        handleAction={this.handleCloseToastr}
        actionText={this.state.toastr.action}
        messageText={this.state.toastr.message}
        className="ppdToastr"
      />
    );

    return (
      <div className={"appWrapper " + this.state.configurations.theme}>
        <ThemeContext.Provider value={this.state.configurations.theme}>
          <Router>
            <div>
              <NavRouter />
              <div className="app">
                <Route path="/" exact render={this.renderPlay} />
                <Route path="/played" exact render={this.renderPlayed} />
                <Route path="/decks" exact render={this.renderDecks} />
                <Route path="/config" exact render={this.renderConfig} />
                <Route path="/online" exact render={this.renderServer} />
                {confirmBox}
                {toastr}
              </div>
            </div>
          </Router>
        </ThemeContext.Provider>
      </div>
    );
  }
}

export default App;
