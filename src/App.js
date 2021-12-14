import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import SimpleBottomNavigation from './components/MainNav';

import React from 'react';
import Trending from './Pages/Trending/Trending';
import Movies from './Pages/Movies/Movies';
import Search from './Pages/Search/Search';
import Series from './Pages/Series/Series';
import Login from './Pages/Login/Login';
import store from './redux/store/store';
import { Provider } from 'react-redux';
import MyWatchlists from './Pages/MyWatchlists/MyWatchlists';
import Watchlist from './Pages/Watchlist/Watchlist';

function App() {
  //comment
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Switch>
            <Route path="/login" exact component={Login} />
            <>
              <Header />
              <Route path="/" exact component={Trending} />
              <Route path="/movies" component={Movies} />
              <Route path="/series" component={Series} />
              <Route path="/search" component={Search} />
              <Route path="/watchlist/:wishlistId" component={Watchlist} />
              <Route path="/mywatchlists" component={MyWatchlists} />
              <SimpleBottomNavigation />
            </>
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
