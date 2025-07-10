import React, { useEffect } from 'react';
import { wow } from '../auth';

const TokenRealms = () => {
  const [realms, setRealms] = React.useState([]);

  useEffect(() => {
    const test = async () => {
      const data = await wow('/data/wow/connected-realm/index?namespace=dynamic-eu');
      console.log(data);

      return data;
    }
    test();
  }, []);

  // useEffect(() => {
  //   const test = async () => {
  //     const data = await wow('/data/wow/token/?namespace=dynamic-us');
  //     return data;
  //   }
  //   test();
  // }, []);


  return (
    <div>

    </div>
  );
};

export default TokenRealms;