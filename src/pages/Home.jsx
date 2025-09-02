import { useEffect } from 'react';
import axios from '../utils/axios.jsx';
const Home = () => {
  const getproduct = async() => {
    try {
      const { data } = await axios.get('products');
      console.log(data);
    }
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('Home.jsx Mounted!');
    getproduct();
    return () => {
      console.log('Home.jsx UnMounted!');
    }
  }
  )
  return (
    <div>
      <h1>Home</h1>
      <button onClick={getproduct}>Get Product</button>
    </div>
  )
}

export default Home