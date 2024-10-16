import React from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Drawer from './components/Drawer';

import Home from './pages/Home';
import Favorites from './pages/Favorites';

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);

  React.useEffect(() => {
    axios.get('https://6706e52da0e04071d228991c.mockapi.io/items').then(res => {
      setItems(res.data);
    });
    axios.get('https://6706e52da0e04071d228991c.mockapi.io/cart').then(res => {
      setCartItems(res.data);
    });
    axios.get('https://6706e52da0e04071d228991c.mockapi.io/favorites').then(res => {
      setFavorites(res.data);
    });
  }, []);

  const onAddToCart = (obj) => {
    axios.post('https://6706e52da0e04071d228991c.mockapi.io/cart', obj);
    setCartItems((prev) => [...prev, obj]);
  };

  const onRemoveItem = (id) => {
    axios.delete(`https://6706e52da0e04071d228991c.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => favObj.id === obj.id)) {
        axios.delete(`https://6706e52da0e04071d228991c.mockapi.io/favorites/${obj.id}`);
      } else {
        const { data } = await axios.post('https://6706e52da0e04071d228991c.mockapi.io/favorites', obj);
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты');
    }
    /*if (favorites.find((favObj) => favObj.id === obj.id)) {
      axios.delete(`https://6706e52da0e04071d228991c.mockapi.io/favorites/${obj.id}`);
    } else {
      const { data } = await axios.post('https://6706e52da0e04071d228991c.mockapi.io/favorites', obj);
      setFavorites((prev) => [...prev, data]);
    }*/
    //setFavorites((prev) => [...prev, obj]);
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="wrapper clear">
      {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} />}
      <Header onClickCart={() => setCartOpened(true)}/>

      <Routes>
        <Route
          path="/"
          element={
            <Home 
              items={items}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavorite={onAddToFavorite}
              onAddToCart={onAddToCart}
            />
          }
        />

        <Route
          path="/favorites"
          element={
            <Favorites items={favorites} onAddToFavorite={onAddToFavorite} />
          }
        />
      </Routes>

      
    </div>
  );
}

export default App;
