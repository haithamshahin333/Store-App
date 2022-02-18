import { useState } from "react";
import { useQuery } from "react-query";
//Components 
import Item from './Item/Item';
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress  from "@material-ui/core/LinearProgress";
import Button from '@material-ui/core/Button'
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Badge from "@material-ui/core/Badge";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { appInsights, reactPlugin } from "./AppInsights";

import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';

//Styles
import { Wrapper, StyledButton} from './App.Styles';
//Types

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image:string;
  price: number;
  title: string;
  amount: number;
}

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch ('https://fakestoreapi.com/products')).json();


const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error} = useQuery<CartItemType[]>(
    'products', 
    getProducts
    );
  console.log(data); 

  const getTotalItems = (items: CartItemType[]) => 
    items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart =(clickedItem: CartItemType) => {
    appInsights.trackEvent({name: clickedItem.title});
    setCartItems(prev => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id)

      if (isItemInCart) {
        return prev.map(item => 
          item.id === clickedItem.id
          ? {...item, amount: item.amount + 1 }
          : item
        );
      }
      //First time the item is added
      return[...prev, {...clickedItem, amount: 1}];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => 
      prev.reduce((ack,item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, {...item, amount: item.amount - 1}];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div> Something went wrong... </div>;
  
  const Home = () => (
    <div>
        <h2>Home Page</h2>
    </div>
);

const About = () => (
    <div>
        <h2>About Page</h2>
    </div>
);

const Header = () => (
    <ul>
        <li>
            <Link to="/home">Home</Link>
        </li>
        <li>
            <Link to="/about">About</Link>
        </li>
    </ul>
);
  

  return (
    <BrowserRouter>
      <AppInsightsContext.Provider value={reactPlugin}>
        <Wrapper>
        <div>
            <Header/>
            <Routes>
            <Route path="/home" element={<Home/>} />
            <Route path="/about" element={<About/>} />
            </Routes>
          </div>
          <button type="button">Click Me!</button>
          <Drawer anchor='right' open={cartOpen} onClose = {() => setCartOpen(false)}>
            <Cart 
              cartItems = {cartItems} 
              addToCart = {handleAddToCart}
              removeFromCart = {handleRemoveFromCart}
              />
          </Drawer>
          <StyledButton onClick = {() => setCartOpen(true)}>
            <Badge badgeContent={getTotalItems(cartItems)} color='error'>
              <AddShoppingCartIcon/>
            </Badge>
          </StyledButton>
          <Grid container spacing={3}>
          {data?.map(item => (
            <Grid item key={item.id} xs={12} sm={4}>
              <Item item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          ))}
          </Grid>
        </Wrapper>
      </AppInsightsContext.Provider>
    </BrowserRouter>
  );
}

export default App;
